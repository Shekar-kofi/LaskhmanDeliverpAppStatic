// Google Apps Script code for capturing form data to Google Sheets
// Deploy this as a web app with "Execute as: Me" and "Who has access: Anyone"

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Open the Google Sheet
    const sheetId = '1VZelT1XXGzywNDEBE6hEEaNo-QnVto4Orn1ruK551ak';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    
    // Determine which sheet to write to based on form type
    let sheetName = 'Home'; // Default for delivery job applications
    const isAdvance = data.type === 'AdvancePayment' || data.formType === 'AdvancePayment';
    if (isAdvance) {
      sheetName = 'advancewd paymentr';
    }
    
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      // Create the sheet if it doesn't exist
      sheet = spreadsheet.insertSheet(sheetName);
    }

    // Get current timestamp
    const timestamp = new Date();

    // Prepare data row based on form type
    let rowData;
    if (isAdvance) {
      rowData = [
        timestamp,
        data.name,
        data.phone,
        data.hubName || '',
        data.hubIncharge || '',
        data.location || ''
      ];
    } else {
      // Default delivery job application format
      rowData = [
        timestamp,
        data.name,
        data.phone,
        data.district || '',
        data.platform || ''
      ];
    }

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
  const spreadsheet = SpreadsheetApp.openById(sheetId);

  // Setup Delivery Jobs Sheet (Sheet2)
  let sheet2 = spreadsheet.getSheetByName('Home');
  if (!sheet2) {
    sheet2 = spreadsheet.getActiveSheet();
  }

  if (sheet2.getRange(1, 1).getValue() === '') {
    sheet2.getRange(1, 1, 1, 5).setValues([[
      'Timestamp',
      'Name',
      'Phone',
      'District',
      'Platform'
    ]]);
  }

  // Setup Advance Payment Sheet
  let advancePaymentSheet = spreadsheet.getSheetByName('AdvancePayment');
  if (!advancePaymentSheet) {
    advancePaymentSheet = spreadsheet.insertSheet('AdvancePayment');
  }

  if (advancePaymentSheet.getRange(1, 1).getValue() === '') {
    advancePaymentSheet.getRange(1, 1, 1, 6).setValues([[
      'Timestamp',
      'Name',
      'Phone',
      'Hub Name',
      'Hub Incharge',
      'Location'
    ]]);
  }
}