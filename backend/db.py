from supabase import create_client, Client
from settings import settings

# Create Supabase client using service role key for backend operations
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)

