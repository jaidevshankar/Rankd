from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr, validator
from supabase import create_client, Client
import secrets
import string
import bcrypt
from datetime import datetime, timedelta
import re

# Initialize Supabase (using the same credentials as in ranking.py)
url = "https://gkvqpvkyncgblfbfmsoz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdnFwdmt5bmNnYmxmYmZtc296Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk5MTI5NSwiZXhwIjoyMDUwNTY3Mjk1fQ.KPPQgtkdf6tycv7CKe7hYhbKc0wx48mbeIXWAWU3OOs"
supabase: Client = create_client(url, key)

router = APIRouter()

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    @validator('username')
    def username_must_be_valid(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', v):
            raise ValueError('Username must be 3-20 characters and contain only letters, numbers, and underscores')
        return v
    
    @validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class AuthResponse(BaseModel):
    user_id: int
    username: str
    email: str
    token: str
    message: str

def hash_password(password: str) -> str:
    """Hash a password for storing."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verify a stored password against one provided by user"""
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))

def generate_token() -> str:
    """Generate a secure random token."""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(64))

@router.post("/signup", response_model=AuthResponse)
async def signup(user_data: UserSignup = Body(...)):
    try:
        # Check if username already exists
        existing_username = supabase.table("Users").select("*").eq("username", user_data.username).execute()
        if existing_username.data:
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Check if email already exists
        existing_email = supabase.table("Users").select("*").eq("email", user_data.email).execute()
        if existing_email.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash the password
        hashed_password = hash_password(user_data.password)
        
        # Generate token
        token = generate_token()
        token_expiry = (datetime.now() + timedelta(days=30)).isoformat()
        
        # Create user in Supabase
        user = supabase.table("Users").insert({
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password,
            "created_at": datetime.now().isoformat(),
            "auth_token": token,
            "token_expiry": token_expiry,
            "profile_pic_url": None,  # Default null as specified in the table
            "bio": ""  # Empty string for bio
        }).execute()
        
        if not user.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        created_user = user.data[0]
        
        return {
            "user_id": created_user["user_id"],
            "username": created_user["username"],
            "email": created_user["email"],
            "token": token,
            "message": "User created successfully"
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during signup: {str(e)}")

@router.post("/login", response_model=AuthResponse)
async def login(user_data: UserLogin = Body(...)):
    try:
        # Check if login is email or username
        is_email = '@' in user_data.email_or_username
        
        # Query based on email or username
        query = supabase.table("Users").select("*")
        if is_email:
            query = query.eq("email", user_data.email_or_username)
        else:
            query = query.eq("username", user_data.email_or_username)
            
        result = query.execute()
        
        if not result.data:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user = result.data[0]
        
        # Verify password
        if not verify_password(user["password"], user_data.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Generate new token
        token = generate_token()
        token_expiry = (datetime.now() + timedelta(days=30)).isoformat()
        
        # Update user's token
        supabase.table("Users").update({
            "auth_token": token,
            "token_expiry": token_expiry,
            "last_login": datetime.now().isoformat()
        }).eq("user_id", user["user_id"]).execute()
        
        return {
            "user_id": user["user_id"],
            "username": user["username"],
            "email": user["email"],
            "token": token,
            "message": "Login successful"
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}")

@router.post("/verify_token")
async def verify_token(token: str = Body(..., embed=True)):
    try:
        # Find user with this token
        result = supabase.table("Users").select("*").eq("auth_token", token).execute()
        
        if not result.data:
            return {"valid": False, "message": "Invalid token"}
        
        user = result.data[0]
        
        # Check if token is expired
        token_expiry = datetime.fromisoformat(user["token_expiry"])
        if datetime.now() > token_expiry:
            return {"valid": False, "message": "Token expired"}
            
        return {
            "valid": True,
            "user_id": user["user_id"],
            "username": user["username"],
            "email": user["email"]
        }
        
    except Exception as e:
        return {"valid": False, "message": f"Error verifying token: {str(e)}"}

@router.get("/create_test_user")
async def create_test_user():
    try:
        # Let's first get table info to see what columns are available
        table_info = supabase.table("Users").select("*").limit(0).execute()
        if hasattr(table_info, 'error') and table_info.error:
            return {"message": f"Error accessing Users table: {table_info.error}"}
        
        # Check if table exists
        if not table_info.data and not hasattr(table_info, 'columns'):
            return {"message": "Users table might not exist. Please create it first."}
            
        columns = []
        if hasattr(table_info, 'columns'):
            columns = table_info.columns
            
        # Debug info
        return {
            "message": "Table information retrieved",
            "columns": columns,
            "table_exists": table_info.data is not None,
            "data_example": table_info.data
        }
    except Exception as e:
        return {"message": f"Error accessing table: {str(e)}"}

@router.get("/check_tables")
async def check_tables():
    try:
        # List all tables in the database
        tables = []
        response = supabase.rpc('get_tables').execute()
        
        return {
            "message": "Database information",
            "response": response.data if hasattr(response, 'data') else str(response)
        }
    except Exception as e:
        return {"message": f"Error checking tables: {str(e)}"} 