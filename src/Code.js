var COL_FROM = 1;
var COL_TO = 2;
var COL_FROM_REC = 4;
var COL_TO_REC = 5;
var COL_SUM = 3;

function doGet() {
  var html = HtmlService.createHtmlOutputFromFile('Index');
  html.setTitle('Využívání Coworkingu DEPO2015');
  html.setFaviconUrl('https://cdn.jakub-boucek.cz/static/projects/depo2015-coworking/favicon.ico');
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return html;
}

function isBorrowed() {
  var row = getLastRow();
  
  return row.getCell(1, COL_TO).isBlank();
}

function addNewDate(isoDate, direct) {
  var date = new Date(isoDate);
  var borrowed = isBorrowed();
  
  if((direct == 'return') != borrowed) {
    throw new Error("Stav neodpovídá požadavku");
  }
  
  if(borrowed) {
    setReturnDate(date);
  }
  else {
    setBorrowDate(date);
  }
  
  return !borrowed;
}

function setReturnDate(date) {
  var row = getLastRow();
  
  row.getCell(1, COL_TO).setValue(date);
  row.getCell(1, COL_TO_REC).setValue(new Date());
}

function setBorrowDate(date) {
  var prev = getLastRow();
  var row = getNewRow();
  
  row.getCell(1, COL_FROM).setValue(date);
  row.getCell(1, COL_FROM_REC).setValue(new Date());
  
  var formula = '=IF(OR(ISBLANK(R[0]C[-2]);ISBLANK(R[0]C[-1]));"";(R[0]C[-1]-R[0]C[-2])*24)';
  row.getCell(1, COL_SUM).setFormulaR1C1(formula);
  
}

function getNewRow() {
  return getLastRow(true);
}

function getLastRow(next) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if(next) {
    lastRow++;
  }

  var range = sheet.getRange(lastRow, 1, 1, 5);
  
  return range;
}


