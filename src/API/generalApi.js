//Check if there is an object with the name chosen by the user already exist
export function hasNoDuplicateForColumnName(objectName, data){
    let result = true;
    data.map((object) => {
        if(object.name === objectName){
            result=false;
        }
    })
    return result;
}