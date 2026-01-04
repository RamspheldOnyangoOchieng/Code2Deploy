# Authentication Setup Guide

## Backend Setup

The Django backend is configured with JWT authentication using djoser. The following endpoints are available:

### Authentication Endpoints:
- `POST /api/auth/users/` - User registration
- `POST /api/auth/jwt/create/` - Login (get JWT token)
- `GET /api/auth/users/me/` - Get current user info
- `POST /api/auth/jwt/refresh/` - Refresh JWT token
- `POST /api/auth/jwt/verify/` - Verify JWT token

### CORS Configuration:
The backend is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173`
- `http://localhost:3000` (React dev server)
- `http://127.0.0.1:3000`

## Frontend Integration

### Components Created:
1. **AuthService** (`frontend/src/services/authService.js`)
   - Handles all authentication API calls
   - Manages JWT tokens and user state
   - Provides login, signup, logout functionality

2. **LoginModal** (`frontend/src/components/LoginModal.jsx`)
   - Login form with email and password
   - Error handling and loading states
   - Responsive design

3. **SignupModal** (`frontend/src/components/SignupModal.jsx`)
   - Registration form with all required fields
   - Password confirmation validation
   - Form validation and error handling

4. **UserProfile** (`frontend/src/components/UserProfile.jsx`)
   - Displays user information when logged in
   - Dropdown menu with logout option
   - User avatar with initials

5. **Updated Layout** (`frontend/src/components/layout.jsx`)
   - Integrated authentication buttons
   - Conditional rendering based on auth state
   - Mobile-responsive design

### Navbar Buttons Connected:

1. **Login Button** (Left side)
   - Opens login modal
   - Handles authentication with backend
   - Shows user profile when logged in

2. **Sign Up Button** (Left side)
   - Opens signup modal
   - Creates new user account
   - Automatically logs in after successful registration

3. **Partner as Sponsor** (Right side)
   - Ready for future integration
   - Currently displays as placeholder

4. **Education & Training Partner** (Right side)
   - Ready for future integration
   - Currently displays as placeholder

## Testing the Authentication

### 1. Start the Backend Server:
```bash
cd backend
python manage.py runserver
```

### 2. Start the Frontend Development Server:
```bash
cd frontend
npm run dev
```

### 3. Test User Registration:
1. Click "Sign Up" button in the navbar
2. Fill out the registration form
3. Submit the form
4. You should be automatically logged in

### 4. Test User Login:
1. Click "Login" button in the navbar
2. Enter your email and password
3. Submit the form
4. You should see your user profile in the navbar

### 5. Test Logout:
1. Click on your user profile (avatar with initials)
2. Click "Logout" in the dropdown
3. You should see the login/signup buttons again

## API Testing with curl

### Register a new user:
```bash
curl -X POST http://localhost:8000/api/auth/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8000/api/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Get user info (with token):
```bash
curl -X GET http://localhost:8000/api/auth/users/me/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

- JWT tokens are stored in localStorage
- Automatic token refresh handling
- CORS protection configured
- Password validation (minimum 8 characters)
- Form validation and error handling
- Secure logout (clears all stored data)

## Next Steps

1. **Add Protected Routes**: Create routes that require authentication
2. **Add User Dashboard**: Create a user dashboard page
3. **Add Password Reset**: Implement password reset functionality
4. **Add Email Verification**: Implement email verification for new accounts
5. **Add Social Authentication**: Integrate Google, Facebook, etc.
6. **Add Role-based Access**: Implement different user roles and permissions 