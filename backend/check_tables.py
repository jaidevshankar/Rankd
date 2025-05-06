from utils.auth import supabase
import json

def check_database_schema():
    print("Checking database schema...")
    
    try:
        # Get information about the Users table
        print("\nChecking Users table...")
        result = supabase.from_("Users").select("*").limit(1).execute()
        
        if not result.data:
            print("Users table exists but no records found")
        else:
            print(f"Users table found with {len(result.data)} record(s)")
            
            # Print the first record to see column names
            if result.data:
                print("\nColumns in Users table:")
                for key in result.data[0].keys():
                    print(f"- {key}")
        
        # Try to get column information directly
        try:
            # You can try inspecting a specific column to see if it exists
            print("\nChecking specific columns...")
            
            # This will help identify columns we're trying to use
            needed_columns = ["user_id", "username", "email", "password", "auth_token", "token_expiry"]
            
            # Try to select these columns to see which ones exist
            for col in needed_columns:
                try:
                    test_query = supabase.from_("Users").select(col).limit(0).execute()
                    print(f"Column '{col}' exists")
                except Exception as e:
                    print(f"Column '{col}' error: {str(e)}")
        except Exception as e:
            print(f"Error checking columns: {str(e)}")
            
    except Exception as e:
        print(f"Error checking database schema: {str(e)}")

if __name__ == "__main__":
    check_database_schema() 