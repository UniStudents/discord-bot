

function getTime() {
    let ts = Date.now();

    let dateObj = new Date(ts);
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    let date = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();

    return date + "/" + month  + "/" + year + " " + hour+":"+minute;

}

module.exports = {
    getTime : getTime
}