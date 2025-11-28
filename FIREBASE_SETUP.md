# Firebase Cloud Storage Setup Guide

Your calculator now has cloud storage! Your calculation history is automatically saved to the cloud and can be accessed from any device using a shareable link.

## Quick Start (Using Demo Config)

The app comes with demo Firebase credentials that should work out of the box for testing. If the demo credentials don't work or you want your own dedicated storage, follow the setup below.

## Setting Up Your Own Firebase Project (Optional)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "My Calculator App")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click "Create Project"

### Step 2: Set Up Realtime Database

1. In your Firebase project, click on "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location close to your users
4. Start in **"Test mode"** for development (you can secure it later)
5. Click "Enable"

### Step 3: Get Your Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps"
4. Click the Web icon `</>`
5. Register your app with a nickname (e.g., "Calculator Web")
6. Copy the `firebaseConfig` object

### Step 4: Update Your App

1. Open `src/firebase.js` in your calculator app
2. Replace the `firebaseConfig` object with your own:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Save the file - the app will automatically reload!

## Security Rules (Important for Production)

By default, the database is open for testing. For production, update your Realtime Database rules:

1. Go to Firebase Console > Realtime Database > Rules
2. Replace with these rules:

```json
{
  "rules": {
    "history": {
      "$sessionId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

This allows anyone to read/write to their own session but maintains separation between users.

## How It Works

### Features:
- **Automatic Sync**: Every calculation is automatically saved to the cloud
- **Shareable Links**: Click the "🔗 Share" button to copy a link
- **Cross-Device Access**: Open the shared link on any device to see the history
- **Local Backup**: History is also saved locally in case Firebase is unavailable
- **Real-time Sync**: Changes sync across all devices viewing the same link

### Session Management:
- Each browser/device gets a unique session ID
- Session ID is stored in localStorage
- Share the link to let others see your calculations
- Your history is tied to your session ID

### The Share Button:
1. Click "🔗 Share" button
2. Link is automatically copied to clipboard
3. Share the link via email, chat, etc.
4. Anyone with the link can view your calculation history

## Troubleshooting

**History not syncing?**
- Check your internet connection
- Verify Firebase configuration is correct
- Check browser console for errors
- History is still saved locally as backup

**Share button not working?**
- Some browsers block clipboard access
- An alert will show with the link if clipboard fails
- Manually copy the URL from the alert

**Can't see shared history?**
- Make sure you're using the full URL with `?session=...`
- Check that the original creator has made calculations
- Verify Firebase Realtime Database is enabled

## Features Overview

### Sync Status Indicator
- **☁️ Syncing...**: Data is being saved to cloud (orange, pulsing)
- **✓ Synced to cloud**: Data successfully saved (green)

### Data Persistence
- **Primary**: Firebase Realtime Database (cloud)
- **Backup**: Browser localStorage (local)
- **Fallback**: If Firebase fails, uses localStorage only

## Privacy & Security

- Each session gets a unique, random ID
- No personal information is collected
- History is only accessible via the session link
- You can clear your history anytime
- Data expires after 30 days of inactivity (you can configure this)

## Cost

Firebase Realtime Database has a generous free tier:
- 1 GB stored data (plenty for calculator history)
- 10 GB/month downloaded data
- 100 simultaneous connections

For a personal calculator app, you'll likely never exceed the free tier!

## Need Help?

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Verify your Firebase configuration
3. Ensure Realtime Database is enabled
4. Check that you're using the correct database URL

Enjoy your cloud-powered calculator! 🧮☁️
