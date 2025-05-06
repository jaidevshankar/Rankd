from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr, validator
from supabase import create_client, Client
import bcrypt
import re
from datetime import datetime

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
    message: str

def hash_password(password: str) -> str:
    """Hash a password for storing."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verify a stored password against one provided by user"""
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))

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
        
        # Current date for date_joined
        current_date = datetime.now().isoformat()
        
        # Create user in Supabase - include date_joined field
        user = supabase.table("Users").insert({
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password,
            "date_joined": current_date
        }).execute()
        
        if not user.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        created_user = user.data[0]
        
        return {
            "user_id": created_user["user_id"],
            "username": created_user["username"],
            "email": created_user["email"],
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
        
        # First try direct comparison (for test users with plain text passwords)
        if user["password"] == user_data.password:
            return {
                "user_id": user["user_id"],
                "username": user["username"],
                "email": user["email"],
                "message": "Login successful (plain text)"
            }
            
        # Then try bcrypt verification
        try:
            if verify_password(user["password"], user_data.password):
                return {
                    "user_id": user["user_id"],
                    "username": user["username"],
                    "email": user["email"],
                    "message": "Login successful (bcrypt)"
                }
        except Exception as e:
            print(f"Error during password verification: {str(e)}")
        
        # If we get here, password verification failed
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}")

@router.get("/create_test_user")
async def create_test_user():
    try:
        # Check if test user exists
        test_username = "testuser"
        existing_user = supabase.table("Users").select("*").eq("username", test_username).execute()
        
        if existing_user.data:
            return {"message": f"Test user '{test_username}' already exists"}
        
        # Hash password
        password = "password123"
        hashed_password = hash_password(password)
        
        # Current date for date_joined
        current_date = datetime.now().isoformat()
        
        # Create a simple user with required fields
        user = supabase.table("Users").insert({
            "username": test_username,
            "email": "test@example.com",
            "password": hashed_password,
            "date_joined": current_date
        }).execute()
        
        return {
            "message": "Created test user",
            "username": "testuser",
            "password": "password123",
            "email": "test@example.com",
            "result": user.data if user.data else "No data returned"
        }
    except Exception as e:
        return {"message": f"Error creating test user: {str(e)}"}

@router.get("/get_table_info")
async def get_table_info():
    try:
        # Get table info from database
        result = supabase.table("Users").select("*").limit(1).execute()
        
        columns = []
        if result.data and len(result.data) > 0:
            columns = list(result.data[0].keys())
        
        return {
            "message": "Table information",
            "table_exists": result.data is not None,
            "columns": columns
        }
    except Exception as e:
        return {"message": f"Error getting table info: {str(e)}"}

@router.get("/test_existing_login")
async def test_existing_login():
    try:
        # Try to log in with the existing user from the screenshot
        test_username = "test_user"
        test_password = "test_pass"
        
        # Query for the user
        query = supabase.table("Users").select("*").eq("username", test_username)
        result = query.execute()
        
        if not result.data:
            return {"message": f"User '{test_username}' not found"}
        
        user = result.data[0]
        
        # In this case, we're assuming the password is stored as plain text
        # This is just for testing - in a real app, you should use proper hashing
        if user["password"] == test_password:
            return {
                "message": "Login successful with existing user",
                "user_id": user["user_id"],
                "username": user["username"],
                "email": user["email"]
            }
        else:
            # Try with bcrypt verification just in case
            try:
                if verify_password(user["password"], test_password):
                    return {
                        "message": "Login successful with bcrypt verification",
                        "user_id": user["user_id"],
                        "username": user["username"],
                        "email": user["email"] 
                    }
            except Exception:
                pass
                
            return {"message": "Password verification failed"}
            
    except Exception as e:
        return {"message": f"Error testing login: {str(e)}"} 