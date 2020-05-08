export const parseStringToArray = (str: string) => {
    const arrStr = str.split(",");
    const arrNum: number[] = [];
    let numNan = 0
    
    arrStr.forEach((item, idx) => {
        const int = parseInt(item.trim());
        if (isNaN(int) && idx === 0) {
            return;
        }
        if (isNaN(int) && numNan < 1) {
            arrNum.push(int);
            numNan += 1;
        }
        if (!isNaN(int)) {
            arrNum.push(int)
        }
    });
    return arrNum;
}
export const parseArrayToString = (arr: number[]) => {
    let strValue = ""
    if (arr) {
        if (isNaN(arr[arr.length - 1]) && arr.length !== 0) {
            arr.pop();
            strValue = arr.toString() + ",";
            
        } else {
            strValue = arr.toString();
        }
    }
    return strValue;
}