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

# Validate environment
VALID_ENVIRONMENTS = ['development', 'production', 'testing']
if ENVIRONMENT not in VALID_ENVIRONMENTS:
    print(f"Warning: Invalid DJANGO_ENV '{ENVIRONMENT}'. Defaulting to 'development'.")
    ENVIRONMENT = 'development'

print(f"Loading Django settings for '{ENVIRONMENT}' environment...")

# First, load base settings without any DEBUG assumption
try:
    from .base import *
except ImportError as e:
    print(f"Error importing base settings: {e}")
    sys.exit(1)

# Then load database settings
try:
    from .database import *
except ImportError as e:
    print(f"Error importing database settings: {e}")
    sys.exit(1)

# Now load environment-specific settings
try:
    if ENVIRONMENT == 'production':
        from .production import *
        
        # ENFORCE production safety rules
        if DEBUG:
            print("\n" + "="*70)
            print("SECURITY WARNING: DEBUG=True in production environment!")
            print("Overriding DEBUG=False for production safety.")
            print("="*70 + "\n")
            DEBUG = False
            
        # Ensure ALLOWED_HOSTS is set in production
        if not ALLOWED_HOSTS or ALLOWED_HOSTS == ['*']:
            print("\n" + "="*70)
            print("SECURITY WARNING: ALLOWED_HOSTS is too permissive for production!")
            print("Please set proper ALLOWED_HOSTS in production.py")
            print("="*70 + "\n")
            
    elif ENVIRONMENT == 'testing':
        from .testing import *  # Create this file if needed
    else:
        # Development environment
        from .development import *
        
        # Ensure DEBUG is True in development unless explicitly overridden
        if not DEBUG:
            print(f"\nNote: DEBUG=False in development. If you want to see logs, set DEBUG=True")
            
except ImportError as e:
    print(f"Error importing {ENVIRONMENT} settings: {e}")
    sys.exit(1)

# Post-load validation and settings adjustment
def validate_settings():
    """Validate critical settings after all imports"""
    
    # Security warnings
    if DEBUG:
        print(f"DEBUG mode is ENABLED")
        if SECRET_KEY == 'dev-secret-key-change-in-production':
            print(f"Warning: Using default SECRET_KEY. Change this in production!")
    else:
        print(f"DEBUG mode is DISABLED")
        
    # CORS validation
    if ENVIRONMENT == 'development' and not CORS_ALLOW_ALL_ORIGINS:
        print(f"Note: CORS_ALLOW_ALL_ORIGINS=False in development. "
              f"Your React app might have CORS issues.")
    
    # Database validation
    if DATABASES['default']['ENGINE'] == 'django.db.backends.mysql':
        print(f"Using MySQL database: {DATABASES['default']['NAME']}")
    else:
        print(f"Using database: {DATABASES['default']['ENGINE']}")
    
    # Logging configuration check
    if 'handlers' not in LOGGING:
        print(f"Note: No custom logging handlers configured. Using Django defaults.")
        
    return True

# Run validation
validate_settings()

# Final debug output
print(f"\nSettings loaded successfully!")
print(f"- Environment: {ENVIRONMENT}")
print(f"- DEBUG: {DEBUG}")
print(f"- Database: {DATABASES['default']['ENGINE']}")
print(f"- Allowed Hosts: {ALLOWED_HOSTS[:3]}{'...' if len(ALLOWED_HOSTS) > 3 else ''}")
print(f"- Installed Apps: {len(INSTALLED_APPS)} apps")
print("-" * 50 + "\n")