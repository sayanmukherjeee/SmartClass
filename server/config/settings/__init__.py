# config/settings/__init__.py
import os
import sys
from pathlib import Path

# Check if we're on Render
ON_RENDER = os.getenv('RENDER', False) or os.getenv('DJANGO_SETTINGS_MODULE', '').endswith('production')

if ON_RENDER:
    # Force production on Render
    os.environ.setdefault('DJANGO_ENV', 'production')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
    print("🚀 Running on Render - Forcing production settings")

# Load environment variables from dotenv first
from dotenv import load_dotenv

# Load .env from project root (backend/.env)
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)

# Determine environment
ENVIRONMENT = os.getenv('DJANGO_ENV', 'development').lower()

print(f"Loading Django settings for '{ENVIRONMENT}' environment...")

# Load the appropriate settings file
try:
    if ENVIRONMENT == 'production':
        from .production import *
        print(f"✅ Production settings loaded")
    elif ENVIRONMENT == 'testing':
        from .testing import *
    else:
        from .development import *
        print(f"✅ Development settings loaded")
        
except ImportError as e:
    print(f"❌ Error importing {ENVIRONMENT} settings: {e}")
    sys.exit(1)

# Simple validation
print(f"- DEBUG: {DEBUG}")
print(f"- Database: {DATABASES['default']['ENGINE']}")
print(f"- Allowed Hosts: {ALLOWED_HOSTS[:3]}{'...' if len(ALLOWED_HOSTS) > 3 else ''}")
print("-" * 50)