"""
Vercel serverless function entry point for FastAPI backend.
"""
import sys
import os

# Add backend directory to path so we can import modules
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

# Check for missing environment variables first
required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]
missing_vars = [var for var in required_vars if not os.environ.get(var)]

if missing_vars:
    # Create a minimal FastAPI app that returns an error message
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    error_app = FastAPI()
    
    @error_app.get("/{full_path:path}")
    @error_app.post("/{full_path:path}")
    async def missing_env_error():
        return JSONResponse(
            status_code=500,
            content={
                "error": "Missing environment variables",
                "missing": missing_vars,
                "message": "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel project settings"
            }
        )
    
    app_instance = error_app
    print(f"MISSING ENVIRONMENT VARIABLES: {', '.join(missing_vars)}")
else:
    # Normal initialization
    try:
        from main import app as main_app
        app_instance = main_app
        print("API handler initialized successfully")
    except Exception as e:
        # Log the error so it appears in Vercel function logs
        import traceback
        error_msg = f"ERROR: Failed to initialize API handler: {e}"
        print(error_msg)
        print(f"Traceback: {traceback.format_exc()}")
        
        # Create error app
        from fastapi import FastAPI
        from fastapi.responses import JSONResponse
        
        error_app = FastAPI()
        
        @error_app.get("/{full_path:path}")
        @error_app.post("/{full_path:path}")
        async def init_error():
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Failed to initialize API",
                    "message": str(e)
                }
            )
        
        app_instance = error_app

# Vercel supports FastAPI directly - expose the app as 'app' variable
# Vercel will automatically detect and use the ASGI app
# DO NOT create a 'handler' variable - it causes Vercel to check for BaseHTTPRequestHandler
# and fail with TypeError when it finds a callable instead of a class
app = app_instance

# Workaround for Vercel Python 3.12 runtime bug:
# Vercel's runtime checks for 'handler' and tries issubclass() which fails
# By ensuring 'app' is the only exported variable, Vercel should skip handler check
# If this still fails, it's a Vercel runtime bug that needs to be reported

