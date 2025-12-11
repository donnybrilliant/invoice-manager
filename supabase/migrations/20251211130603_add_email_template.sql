-- Add email template fields to company_profiles for custom email branding
ALTER TABLE company_profiles
ADD COLUMN IF NOT EXISTS use_custom_email_template boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS email_template text;

COMMENT ON COLUMN company_profiles.use_custom_email_template IS 'If true, use custom email template. If false, use email template matching the invoice template.';
COMMENT ON COLUMN company_profiles.email_template IS 'Custom HTML email template for invoice emails (only used when use_custom_email_template is true). Uses template variables: {{invoiceNumber}}, {{clientName}}, {{companyName}}, {{total}}, {{currency}}, {{issueDate}}, {{dueDate}}, {{message}}, {{companyEmail}}';
