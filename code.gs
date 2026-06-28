// ============================================================
// CyberKhana Interviews — Google Apps Script (Booking backend)
// Paste this entire file into your Apps Script editor, then
// Deploy → New deployment → Web app
//   Execute as: Me
//   Who has access: Anyone
// Copy the Web App URL into book.html (the SCRIPT_URL variable).
// ============================================================

var HEADERS = ["Timestamp", "Full Name", "Interview Day", "Time Slot", "Slot Key"];
var SLOT_KEY_COL = 5; // column index of "Slot Key" (1-based)

// ------------------------------------------------------------
// GET: return the list of already-booked slot keys.
// book.html calls this on load (…/exec?action=taken) to disable taken cards.
// ------------------------------------------------------------
function doGet(e) {
  try {
    var taken = getTakenSlots_();
    return jsonOut_({ status: "success", taken: taken });
  } catch (error) {
    return jsonOut_({ status: "error", message: error.toString(), taken: [] });
  }
}

// ------------------------------------------------------------
// POST: reserve a slot if it is still free, then record the booking.
// Uses LockService so two people can never grab the same slot.
// ------------------------------------------------------------
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait up to 20s for exclusive access — this is what prevents double-booking.
    lock.waitLock(20000);

    var data = JSON.parse(e.postData.contents);
    var slotKey = data.slotKey || (data.day + " | " + data.time);

    var sheet = getSheet_();

    // Re-check availability *inside* the lock.
    var taken = getTakenSlots_();
    if (taken.indexOf(slotKey) !== -1) {
      return jsonOut_({ status: "taken", message: "Slot already booked" });
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name,
      data.day,
      data.time,
      slotKey
    ]);

    sheet.autoResizeColumns(1, HEADERS.length);

    return jsonOut_({ status: "success", slotKey: slotKey });

  } catch (error) {
    return jsonOut_({ status: "error", message: error.toString() });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function getSheet_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Read every booked slot key from the "Slot Key" column (skipping the header).
function getTakenSlots_() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(2, SLOT_KEY_COL, last - 1, 1).getValues();
  var keys = [];
  for (var i = 0; i < values.length; i++) {
    var k = String(values[i][0]).trim();
    if (k) keys.push(k);
  }
  return keys;
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ------------------------------------------------------------
// Optional: run once to (re)initialize the sheet with headers.
// ------------------------------------------------------------
function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}
