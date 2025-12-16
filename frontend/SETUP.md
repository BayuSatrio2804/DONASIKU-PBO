# Donasiku Frontend - Setup Instructions

## Project Structure

```
app/
├── page.tsx                 # Redirects to onboarding
├── layout.tsx              # Root layout
├── onboard/
│   └── page.tsx            # Onboarding carousel with 3 slides
├── auth/
│   ├── login/
│   │   └── page.tsx        # Login page
│   └── signup/
│       └── page.tsx        # Signup/Registration page
└── dashboard/
    └── page.tsx            # Dashboard (after login)
```

## Features

### Onboarding Page (`/onboard`)
- 3-slide carousel with images and descriptions
- Navigation with skip button
- Responsive design
- Auto-scroll dots for slide navigation
- Directs to login page after last slide

### Login Page (`/auth/login`)
- Username and password fields
- Password visibility toggle
- Form validation
- Error handling
- Link to signup page
- Redirects to dashboard on successful login

### Signup Page (`/auth/signup`)
- Username, email, password fields
- Role selection (Donor/Recipient)
- Password confirmation
- Form validation
- Error handling
- Link to login page

### Dashboard Page (`/dashboard`)
- Main application interface after authentication
- Feature cards (Donate, Receive, Track)
- Recent donations section

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Images**
   - The logo (`f6b78b3278cda1016742221dca3c5b8cdbce72c9.png`) is already in the `public/` folder
   - Add onboarding images to `public/`:
     - `onboard-1.jpg` - First slide image
     - `onboard-2.jpg` - Second slide image  
     - `onboard-3.jpg` - Third slide image

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Navigate to Routes**
   - Onboarding: http://localhost:3000 (auto-redirect)
   - Onboarding: http://localhost:3000/onboard
   - Login: http://localhost:3000/auth/login
   - Signup: http://localhost:3000/auth/signup
   - Dashboard: http://localhost:3000/dashboard

## Styling

- Uses **Tailwind CSS** for styling
- Color scheme:
  - Primary: Blue-900 (#1e3a8a)
  - Secondary: Gray tones
  - Accents: Red (logout button)

## Next Steps

1. **Replace placeholder API calls** in login and signup with actual backend integration
2. **Add image uploads** for onboarding slides
3. **Implement authentication** with JWT tokens or sessions
4. **Add navigation guards** to protect dashboard route
5. **Implement user profile** functionality
6. **Add donation management** features
