//Sort the categories in the table
export function sortDataInTable (clickedColumn, column, direction, data){
    if (column !== clickedColumn) {
        data= sortBy(data, clickedColumn);
        direction= 'ascending';
      return
    } 
    data=data.reverse();
    direction= direction === 'ascending' ? 'descending' : 'ascending';
}


//Sort data
export function sortBy (data, column){
    return data.sort(function(a,b) {
        var x =a[column];
        var y=b[column];
        if(typeof x === 'undefined') return 1;
        if(typeof y === 'undefined') return -1;
        return x.localeCompare(y, 'fr', {sensitivity: 'base'});
    })
}
