# Contact Page Settings Management

## Overview
The Contact Page Settings system allows administrators to manage content for different types of contact pages through the Admin Dashboard.

## Features

### Three Contact Page Types
1. **General Contact** - Default contact page (`/contact`)
2. **Partner as Sponsor** - For sponsor inquiries (`/contact?type=sponsor`)
3. **Education & Training Partner** - For education partnerships (`/contact?type=education-partner`)

### Customizable Content
For each contact type, admins can customize:
- **Page Title** - Main heading displayed at the top
- **Subtitle** - Secondary heading
- **Description** - Detailed description text
- **Pre-filled Subject** - Default subject line in the contact form
- **Pre-filled Message** - Default message text in the contact form
- **Button Text** - Custom submit button text (e.g., "Send Message", "Submit Partnership Inquiry")
- **Active Status** - Toggle to enable/disable the contact type

## How to Use

### Accessing Contact Settings
1. Login as Admin
2. Go to Admin Dashboard
3. Click on **"Contact Settings"** tab in the sidebar
4. Select the contact type you want to edit:
   - 📧 General Contact
   - 💰 Partner as Sponsor
   - 🎓 Education & Training Partner

### Editing Settings
1. Click on the contact type card you want to edit
2. Fill in the form fields:
   - **Page Title**: Main heading (e.g., "Get in Touch")
   - **Subtitle**: Supporting text (e.g., "We'd love to hear from you")
   - **Description**: Full description paragraph
   - **Pre-filled Subject**: Optional default subject for the form
   - **Pre-filled Message**: Optional default message for the form
   - **Button Text**: Text for submit button (e.g., "Send Message")
   - **Page Active**: Check to make this contact type visible
3. See live preview of your changes at the top of the form
4. Click **"Save [Type] Settings"** button

### Initializing Default Settings
If no settings exist yet:
1. Click the **"🔄 Initialize Defaults"** button at the top
2. This creates default settings for all three contact types
3. You can then customize them as needed

## API Endpoints

### Public Endpoints
- `GET /api/admin/contact-settings/` - List all contact settings
- `GET /api/admin/contact-settings/type/{type}/` - Get specific type (general, sponsor, education)

### Admin-Only Endpoints
- `POST /api/admin/contact-settings/` - Create new contact setting
- `PUT /api/admin/contact-settings/{id}/` - Update existing setting
- `DELETE /api/admin/contact-settings/{id}/` - Delete setting
- `POST /api/admin/contact-settings/initialize/` - Initialize default settings

## Backend Models

### ContactPageSettings
```python
class ContactPageSettings(models.Model):
    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPE_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300)
    description = models.TextField()
    default_subject = models.CharField(max_length=200, blank=True, null=True)
    default_message = models.TextField(blank=True, null=True)
    button_text = models.CharField(max_length=100, default="Send Message")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## Frontend Implementation

### Contact Page
The contact page automatically fetches settings from the API based on the URL parameter:
- `/contact` → Uses "general" settings
- `/contact?type=sponsor` → Uses "sponsor" settings
- `/contact?type=education-partner` → Uses "education" settings

### Fallback
If API settings are not configured, the page falls back to hardcoded defaults to ensure the site always works.

## After Deployment

1. **Run Migrations** (automatic via build.sh):
   ```bash
   python manage.py migrate
   ```

2. **Login to Admin Dashboard**

3. **Initialize Contact Settings**:
   - Go to Contact Settings tab
   - Click "Initialize Defaults" button
   - Customize each contact type as needed

4. **Test Each Contact Type**:
   - Visit `/contact` (general)
   - Click "Partner as Sponsor" button
   - Click "Education & Training Partner" button
   - Verify content matches your settings

## Benefits

✅ **No Code Changes Needed** - Update contact page content without deploying
✅ **Instant Updates** - Changes reflect immediately on the website
✅ **Per-Button Customization** - Each partnership button shows unique content
✅ **Professional** - Tailored messaging for each audience (sponsors, education partners)
✅ **Easy to Use** - Intuitive admin interface with live preview
✅ **Flexible** - Add new contact types by extending the model

## Troubleshooting

### Settings not showing on contact page?
- Check that `is_active` is checked for that contact type
- Verify the API endpoint is accessible: `/api/admin/contact-settings/type/general/`
- Check browser console for any API errors

### Can't save settings?
- Ensure you're logged in as admin
- Check that all required fields are filled (title, subtitle, description)
- Verify your admin token is valid

### Initialize button not working?
- Make sure you're logged in as admin
- Check backend logs for any database errors
- Try running migrations: `python manage.py migrate`
