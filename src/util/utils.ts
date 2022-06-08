export class Utils {

    static arrayze(arayObj: Object, keyFieldName: String) {

        var newArray = []

        for (objectIndex in arayObj) {

            var newObject = arayObj[objectIndex]

            if (keyFieldName !== true) {
                newObject[keyFieldName || 'itemKey'] = objectIndex
            }

            newArray.push(newObject)

        }

        return newArray
    }

    static debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    static sortByField(items: Array, fieldName: String, reverse: Boolean) {

        var fieldSplited = fieldName.split('.')

        var length = items.length;
        for (var i = 0; i < length; i++) { //Number of passes
            for (var j = 0; j < (length - i - 1); j++) { //Notice that j < (length - i)

                //Compare the adjacent positions
                if(fieldName.indexOf('.') !== -1){

                    if (items[j][fieldSplited[0]][fieldSplited[1]] > items[j + 1][fieldSplited[0]][fieldSplited[1]]) {
                        //Swap the numbers
                        var tmp = items[j]; //Temporary variable to hold the current number
                        items[j] = items[j + 1]; //Replace current number with adjacent number
                        items[j + 1] = tmp; //Replace adjacent number with current number
                    }

                }
                else{
                    if (items[j][fieldName] > items[j + 1][fieldName]) {
                        //Swap the numbers
                        var tmp = items[j]; //Temporary variable to hold the current number
                        items[j] = items[j + 1]; //Replace current number with adjacent number
                        items[j + 1] = tmp; //Replace adjacent number with current number
                    }
                }


            }
        }

        if(reverse){
            items.reverse()
            return items
        }

        return items
    }

    static findFirst(array, prop, value){
        var foundItem = array.filter(item => item[prop] == value)
        return foundItem.length ? foundItem[0] : null
    }

}
