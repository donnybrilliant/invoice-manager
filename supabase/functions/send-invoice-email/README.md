# Send Invoice Email Edge Function

This Edge Function sends invoices via email using SMTP.

## Configuration

### For Local Testing

1. Create a `.env.local` file in this directory (`supabase/functions/send-invoice-email/.env.local`)
2. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
3. Fill in your SMTP details:
   ```env
   SMTP_HOST=smtp.yourdomain.com
   SMTP_PORT=587
   SMTP_SECURE=true
   SMTP_USER=your-email@yourdomain.com
   SMTP_PASSWORD=your-smtp-password
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   SMTP_FROM_NAME=Invoice Manager
   ```

### For Production (Self-Hosted Supabase)

Set secrets in your Supabase project:

```bash
# If using Supabase CLI (when linked)
supabase secrets set SMTP_HOST=smtp.yourdomain.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_SECURE=true
supabase secrets set SMTP_USER=your-email@yourdomain.com
supabase secrets set SMTP_PASSWORD=your-smtp-password
supabase secrets set SMTP_FROM_EMAIL=noreply@yourdomain.com
supabase secrets set SMTP_FROM_NAME=Invoice Manager
```

Or configure in `supabase/config.toml`:

```toml
[edge_runtime.secrets]
SMTP_HOST = "env(SMTP_HOST)"
SMTP_PORT = "env(SMTP_PORT)"
SMTP_SECURE = "env(SMTP_SECURE)"
SMTP_USER = "env(SMTP_USER)"
SMTP_PASSWORD = "env(SMTP_PASSWORD)"
SMTP_FROM_EMAIL = "env(SMTP_FROM_EMAIL)"
SMTP_FROM_NAME = "env(SMTP_FROM_NAME)"
```

## Testing Locally

### Option 1: Using Supabase CLI (Without Linking)

Even if you haven't linked your project to Supabase CLI, you can still test locally:

1. Make sure you have Supabase CLI installed:

   ```bash
   npm install -g supabase
   ```

2. Start Supabase locally (this creates a local instance):

   ```bash
   supabase start
   ```

3. Create `.env.local` file in this directory with your SMTP settings:

   ```bash
   cp env.example .env.local
   # Edit .env.local with your SMTP details
   ```

4. Serve the Edge Function locally:

   ```bash
   # From the project root
   supabase functions serve send-invoice-email --env-file supabase/functions/send-invoice-email/.env.local
   ```

5. Test the function:
   ```bash
   # Get your local anon key from: supabase status
   curl -X POST http://localhost:54321/functions/v1/send-invoice-email \
     -H "Authorization: Bearer YOUR_LOCAL_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "invoiceId": "invoice-uuid",
       "recipientEmail": "test@example.com",
       "message": "Test message",
       "pdfBase64": "base64-encoded-pdf"
     }'
   ```

### Option 2: Manual Testing with Deno (Direct)

For quick testing without Supabase CLI:

1. Create `.env.local` file or set environment variables:

   ```bash
   export SMTP_HOST=smtp.yourdomain.com
   export SMTP_PORT=587
   export SMTP_SECURE=true
   export SMTP_USER=your-email@yourdomain.com
   export SMTP_PASSWORD=your-password
   export SMTP_FROM_EMAIL=noreply@yourdomain.com
   export SMTP_FROM_NAME=Invoice Manager
   ```

2. Load environment and run (requires a simple HTTP server wrapper):
   ```bash
   cd supabase/functions/send-invoice-email
   # Note: This is a simplified test - for full testing, use Supabase CLI
   deno run --allow-net --allow-env --allow-read index.ts
   ```

**Note**: For full integration testing with your database, use Option 1 with `supabase start`.

## SMTP Ports

- **Port 587**: Submission port with STARTTLS (recommended)
- **Port 465**: SMTPS port with SSL/TLS (set `SMTP_SECURE=true`)
- **Port 25**: Usually blocked by ISPs, not recommended

## Troubleshooting

### Connection Issues

- Verify your SMTP server allows connections from your IP
- Check firewall rules on your VPS
- Ensure the SMTP port is open

### Authentication Errors

- Verify username and password are correct
- Some SMTP servers require the full email address as username
- Check if your SMTP server requires app-specific passwords

### TLS/SSL Issues

- For port 587, use `SMTP_SECURE=true` (STARTTLS)
- For port 465, use `SMTP_SECURE=true` (SSL/TLS)
- Some servers may not support STARTTLS - try port 465 instead

### Testing SMTP Connection

You can test your SMTP connection using a simple script:

```bash
# Test SMTP connection
telnet smtp.yourdomain.com 587
```

Or use a tool like `swaks` (Swiss Army Knife for SMTP):

```bash
swaks --to test@example.com \
      --from your-email@yourdomain.com \
      --server smtp.yourdomain.com \
      --port 587 \
      --auth LOGIN \
      --auth-user your-email@yourdomain.com \
      --auth-password your-password \
      --tls
```
