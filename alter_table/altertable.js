function Geeks() {

    console.log('start to change table');    
    var table = document.getElementById('flex_cb');
    var row = table.rows; // Getting the rows
    console.log('jisilu',row.length);
    console.log(row[1].cells)
    for (var i = 0; i < row[1].cells.length; i++) {

        // Getting the text of columnName
        // var str = row[0].cells[i].innerHTML;
        // console.log(str)
        // If 'Geek_id' matches with the columnName 
        if (i===2) {
            for (var j = 1; j < row.length; j++) {

                // Deleting the ith cell of each row
                row[j].deleteCell(i);
                // console.log(row[j].cells[i].innerHTML);

            }
        }
    }

}


Geeks();