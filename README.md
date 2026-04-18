# Delivery Jobs Application - Google Sheets Integration Setup

## Overview
This application captures user details in Google Sheets when they click "Apply on WhatsApp".

## Setup Instructions

### 1. Deploy Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Copy the code from `google-apps-script.js` and paste it into the script editor
4. Save the project with a name like "Delivery Jobs Data Capture"

### 2. Set up Google Sheet

Your Google Sheet is already created at:
https://docs.google.com/spreadsheets/d/1VZelT1XXGzywNDEBE6hEEaNo-QnVto4Orn1ruK551ak/edit

The script will automatically add headers and data rows.

### 3. Deploy as Web App

1. In Google Apps Script editor, click "Deploy" > "New deployment"
2. Select type: "Web app"
3. Configure:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click "Deploy"
5. **Copy the web app URL** - you'll need this next

### 4. Update JavaScript

1. Open `script.js`
2. Find this line:
   ```javascript
   const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your deployed web app URL

### 5. Test the Integration

1. Open `index.html` in a browser
2. Fill out the form
3. Click "Apply on WhatsApp"
4. Check your Google Sheet - the data should appear in a new row

## Data Captured

The following data is captured in Google Sheets:
- Timestamp
- Name
- Phone Number
- District
- Platform
- Full WhatsApp Message

## Troubleshooting

- If data isn't appearing in the sheet, check the browser console for errors
- Make sure the Google Apps Script is deployed and the URL is correct
- Ensure the sheet is publicly accessible (it should be since you're the owner)

## Security Note

The current setup allows anyone to submit data. For production use, consider adding authentication or rate limiting.