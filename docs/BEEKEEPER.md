# Beekeeper Studio - Dev DB (Read-Only)

Use Beekeeper Studio to inspect playlist data in the dev database.

## Connection (URI)
Use the Postgres URI below (SSL required). Replace the password with the one provided in your task resources.

postgresql://qa_console_ro.litjymgsrkzwtfmrrkef:<PASSWORD>@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require

If port 5432 fails, try 6543:

postgresql://qa_console_ro.litjymgsrkzwtfmrrkef:<PASSWORD>@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

## Manual fields (if you don’t use URI)
- Host: aws-1-ap-south-1.pooler.supabase.com
- Port: 5432 (or 6543)
- Database: postgres
- Username: qa_console_ro.litjymgsrkzwtfmrrkef
- Password: provided externally
- SSL: Require

## Queries to run
```sql
select current_user;

select id, name, owner, like_count
from public.playlists
order by like_count desc
limit 5;
