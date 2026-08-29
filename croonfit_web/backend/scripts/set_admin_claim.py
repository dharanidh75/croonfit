import os
import sys
import json
import firebase_admin
from firebase_admin import auth, credentials
from dotenv import load_dotenv

# Load env vars from ../.env (or wherever it's located)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def main():
    if len(sys.argv) < 2:
        print("Usage: python set_admin_claim.py <firebase_uid>")
        sys.exit(1)
    
    uid = sys.argv[1]
    
    # Initialize Firebase Admin SDK
    firebase_creds_path = os.environ.get("FIREBASE_CREDENTIALS_PATH")
    if not firebase_creds_path:
        print("Error: FIREBASE_CREDENTIALS_PATH environment variable not set.")
        sys.exit(1)
        
    try:
        cred = credentials.Certificate(firebase_creds_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Failed to initialize Firebase Admin: {e}")
        sys.exit(1)
        
    try:
        # Check if user exists
        user = auth.get_user(uid)
        
        # Set custom claim
        auth.set_custom_user_claims(uid, {'admin': True})
        print(f"Success! Set admin=True for user {uid} ({user.email}).")
    except Exception as e:
        print(f"Failed to set custom claim: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
