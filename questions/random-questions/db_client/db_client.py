import os
from dotenv import load_dotenv
from supabase import create_client

# Build the path to the .env file inside the same folder
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials missing from .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
