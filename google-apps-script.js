/**
 * Google Apps Script for Receiving Event Registration Data
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this script
 * 4. Save and deploy as a web app
 * 5. Set access to "Anyone" and "Execute as: Me"
 * 6. Copy the web app URL and use it in your backend
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prepare the row data
    const rowData = [
      new Date(), // Timestamp
      data.eventId,
      data.eventTitle,
      data.submittedAt,
      // Add all the question answers
      ...Object.values(data.answers)
    ];
    
    // Add headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Event ID',
        'Event Title',
        'Submitted At',
        // You can customize these headers based on your questions
        'Full Name',
        'Email',
        'Department',
        'Year of Study',
        'Experience Level',
        'Additional Info'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Registration data saved successfully',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput('Google Apps Script is running! Use POST to send registration data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Test function to verify the script is working
 */
function testScript() {
  const testData = {
    eventId: "test123",
    eventTitle: "Test Event",
    submittedAt: new Date().toISOString(),
    answers: {
      name: "John Doe",
      email: "john@example.com",
      department: "CSE",
      year: "2nd Year"
    }
  };
  
  // Simulate a POST request
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
