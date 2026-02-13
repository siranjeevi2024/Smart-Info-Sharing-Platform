# Password Reset Feature Setup Guide

## Overview
The password reset feature allows users to reset their password if they forget it. The system sends a secure token via email that expires in 10 minutes.

## Backend Changes Made

### 1. User Model (`models/User.js`)
Added two new fields:
- `resetPasswordToken`: Stores hashed reset token
- `resetPasswordExpire`: Token expiration timestamp

### 2. Auth Controller (`controllers/authController.js`)
Added two new functions:
- `forgotPassword`: Generates token and sends reset email
- `resetPassword`: Validates token and updates password

### 3. Auth Routes (`routes/auth.js`)
Added two new routes:
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token

## Frontend Changes Made

### 1. New Pages Created
- `ForgotPassword.js` - User enters email to request reset
- `ResetPassword.js` - User enters new password with token

### 2. App.js Routes
Added routes:
- `/forgot-password` - Forgot password page
- `/reset-password/:token` - Reset password page

### 3. Login Page
Added "Forgot Password?" link below password field

## Setup Instructions

### 1. Update .env File
Add these variables to your `backend/.env` file:

```env
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Gmail App Password Setup
For Gmail users:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > App passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use this as `EMAIL_PASS` in .env

### 3. Alternative Email Services
For other email services, update the transporter in `authController.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## How It Works

### User Flow:
1. User clicks "Forgot Password?" on login page
2. User enters their email address
3. System generates a secure token and sends email
4. User clicks link in email (valid for 10 minutes)
5. User enters new password
6. Password is updated and user can login

### Security Features:
- Token is hashed before storing in database
- Token expires after 10 minutes
- Password is automatically hashed before saving
- Invalid/expired tokens are rejected

## API Endpoints

### Forgot Password
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
Response: { "message": "Password reset email sent" }
```

### Reset Password
```
POST /api/auth/reset-password/:token
Body: { "password": "newPassword123" }
Response: { "message": "Password reset successful" }
```

## Testing

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Navigate to login page
4. Click "Forgot Password?"
5. Enter registered email
6. Check email for reset link
7. Click link and enter new password
8. Login with new password

## Troubleshooting

### Email not sending:
- Check EMAIL_USER and EMAIL_PASS in .env
- Verify Gmail app password is correct
- Check if 2FA is enabled on Gmail
- Check spam folder

### Token expired:
- Token is valid for 10 minutes only
- Request a new reset link

### Invalid token:
- Token may have been used already
- Request a new reset link

## Notes
- Make sure to restart the backend server after updating .env
- The reset link format: `http://localhost:3000/reset-password/{token}`
- Tokens are single-use and expire after 10 minutes
- Users with Google OAuth login don't have passwords to reset
