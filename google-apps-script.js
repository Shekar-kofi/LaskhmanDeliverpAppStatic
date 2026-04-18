// Google Apps Script code for capturing form data to Google Sheets
// Deploy this as a web app with "Execute as: Me" and "Who has access: Anyone"

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Open the Google Sheet
    const sheetId = '1VZelT1XXGzywNDEBE6hEEaNo-QnVto4Orn1ruK551ak';
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    
    // Determine which sheet to write to based on form type
    const homeSheetName = 'Home';
    const advanceSheetName = 'AdvancePayment';
    const referralsSheetName = 'Referrals';
    const complaintsSheetName = 'Complaints';

    const isAdvance = data.type === 'AdvancePayment' || data.formType === 'AdvancePayment';
    const isReferral = data.type === 'Referral' || data.formType === 'Referral' || data.type === 'Referal' || data.formType === 'Referal';
    const isComplaint = data.type === 'Complaint' || data.formType === 'Complaint';

    let sheetName = homeSheetName;
    if (isAdvance) {
      sheetName = advanceSheetName;
    } else if (isReferral) {
      sheetName = referralsSheetName;
    } else if (isComplaint) {
      sheetName = complaintsSheetName;
    }

    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      // Create only the exact required sheet if it is missing
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
    } else if (isReferral) {
      rowData = [
        timestamp,
        data.name,
        data.phone,
        data.hubName || '',
        data.referralName || '',
        data.location || ''
      ];
    } else if (isComplaint) {
      rowData = [
        timestamp,
        data.name,
        data.phone,
        data.hubName || '',
        data.complaint || ''
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

  // Setup Referrals Sheet
  let referralsSheet = spreadsheet.getSheetByName('Referrals');
  if (!referralsSheet) {
    referralsSheet = spreadsheet.insertSheet('Referrals');
  }

  if (referralsSheet.getRange(1, 1).getValue() === '') {
    referralsSheet.getRange(1, 1, 1, 6).setValues([[
      'Timestamp',
      'Name',
      'Phone',
      'Hub Name',
      'Referral Name',
      'Location'
    ]]);
  }

  // Setup Complaints Sheet
  let complaintsSheet = spreadsheet.getSheetByName('Complaints');
  if (!complaintsSheet) {
    complaintsSheet = spreadsheet.insertSheet('Complaints');
  }

  if (complaintsSheet.getRange(1, 1).getValue() === '') {
    complaintsSheet.getRange(1, 1, 1, 5).setValues([[
      'Timestamp',
      'Name',
      'Phone',
      'Hub Name',
      'Complaint'
    ]]);
  }
}
