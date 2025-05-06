from utils.auth import supabase, hash_password, generate_token
from datetime import datetime, timedelta

def create_test_user():
    # Check if test user exists
    test_username = "testuser"
    existing_user = supabase.table("Users").select("*").eq("username", test_username).execute()
    
    if existing_user.data:
        print(f"Test user '{test_username}' already exists with ID: {existing_user.data[0]['user_id']}")
        return
    
    # Hash password
    password = "password123"
    hashed_password = hash_password(password)
    
    # Generate token
    token = generate_token()
    token_expiry = (datetime.now() + timedelta(days=30)).isoformat()
    
    # Create user
    user = supabase.table("Users").insert({
        "username": test_username,
        "email": "test@example.com",
        "password": hashed_password,
        "created_at": datetime.now().isoformat(),
        "auth_token": token,
        "token_expiry": token_expiry,
        "profile_pic_url": None,
        "bio": "Test user for development"
    }).execute()
    
    if user.data:
        print(f"Created test user '{test_username}' with ID: {user.data[0]['user_id']}")
        print("Username: testuser")
        print("Password: password123")
        print("Email: test@example.com")
    else:
        print("Failed to create test user")

if __name__ == "__main__":
    create_test_user() 