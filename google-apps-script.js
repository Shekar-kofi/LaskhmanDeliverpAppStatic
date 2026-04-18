// Google Apps Script code for capturing form data to Google Sheets
// Deploy this as a web app with "Execute as: Me" and "Who has access: Anyone"

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Open the Google Sheet
    const sheetId = '1VZelT1XXGzywNDEBE6hEEaNo-QnVto4Orn1ruK551ak';
    const sheetName = 'Sheet2';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.getActiveSheet();
    }

    // Get current timestamp
    const timestamp = new Date();

    // Prepare data row
    const rowData = [
      timestamp,
      data.name,
      data.phone,
      data.district,
      data.platform
    ];

    // Append to sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to set up headers (run this once)
function setupHeaders() {
  const sheetId = '1VZelT1XXGzywNDEBE6hEEaNo-QnVto4Orn1ruK551ak';
  const sheetName = 'Sheet2';
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.getActiveSheet();
  }

  // Set headers if not already set
  if (sheet.getRange(1, 1).getValue() === '') {
    sheet.getRange(1, 1, 1, 5).setValues([[
      'Timestamp',
      'Name',
      'Phone',
      'District',
      'Platform'
    ]]);
  }
}