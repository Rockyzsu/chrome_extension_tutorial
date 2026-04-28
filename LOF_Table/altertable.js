function Update() {
  console.log("start to change table");
  var table = document.getElementById("flex_stock");
  var row = table.rows; // Getting the rows
  console.log(row.length);
  let deleteRow = [];
  for (var i = 1; i < row.length; i++) {
    console.log(row[i].cells[4].textContent);
    if (parseFloat(row[i].cells[4].textContent) < 100) {
    //   table.deleteRow(i);
    console.log("delete row",i);
    // console.log
    deleteRow.push(i);
    // deleteRow.push(row[i].id);
    }
  }
  console.log(deleteRow.length);
  console.log(deleteRow);
    for (var i = deleteRow.length-1 ; i > 1; i--) {
        console.log(deleteRow[i])
        // var row = document.getElementById(deleteRow[i]);
        table.deleteRow(deleteRow[i]);
    }
}

Update();
