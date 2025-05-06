from utils.auth import supabase
import json

def update_database_schema():
    print("Preparing to update database schema...")
    
    try:
        # Check if table exists
        result = None
        try:
            result = supabase.from_("Users").select("*").limit(1).execute()
            print("Users table exists")
        except Exception as e:
            print(f"Error accessing Users table: {str(e)}")
            if "relation" in str(e) and "does not exist" in str(e):
                print("Users table doesn't exist, we need to create it")
            return

        # Assuming table exists but needs modification
        # The safer approach is to:
        # 1. Check which columns exist
        # 2. Add missing columns
        
        # Get existing columns
        existing_columns = set()
        if result and result.data and len(result.data) > 0:
            existing_columns = set(result.data[0].keys())
            print(f"Existing columns: {', '.join(existing_columns)}")
        
        # Define columns we need
        needed_columns = {
            "user_id": "integer", 
            "username": "text",
            "email": "text",
            "password": "text",
            "created_at": "timestamp",
            "last_login": "timestamp",
            "auth_token": "text",
            "token_expiry": "timestamp",
            "profile_pic_url": "text",
            "bio": "text"
        }
        
        # Identify missing columns
        missing_columns = set(needed_columns.keys()) - existing_columns
        
        if not missing_columns:
            print("All required columns exist in the Users table")
            return
            
        print(f"Missing columns: {', '.join(missing_columns)}")
        
        # This code attempts to add columns, but may not work with Supabase REST API
        # You'll likely need to use the Supabase dashboard to add these columns
        for col in missing_columns:
            col_type = needed_columns[col]
            print(f"Column '{col}' ({col_type}) is missing and needs to be added")
        
        print("\nIMPORTANT: Please add the missing columns using the Supabase dashboard")
        print("1. Go to your Supabase project")
        print("2. Navigate to the Table Editor")
        print("3. Find the 'Users' table")
        print("4. Add the missing columns with appropriate types")
        
    except Exception as e:
        print(f"Error updating schema: {str(e)}")

if __name__ == "__main__":
    update_database_schema() 