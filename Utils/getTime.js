const {DateTime} = require('luxon')

module.exports ={
    getTime: ()=>{
        let ts = Date.now();
        let dateObj = new Date(ts);
        let hour = dateObj.getHours();
        let minute = dateObj.getMinutes();
        let date = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();
        return date + "/" + month  + "/" + year + " " + hour+":"+minute;
    },
    getDatePreFormatted: ()=>{
        let dt = DateTime.now().setZone("Europe/Athens");
        return dt.toFormat("cccc d LLLL y")
    },
    getTimePreFormatted: ()=> {
        let dt = DateTime.now().setZone("Europe/Athens");
        return dt.toFormat("HH:mm:ss")
    },
    getTimeFormatted: (format ="")=> {
        let dt = DateTime.now().setZone("Europe/Athens");
        return dt.toFormat(format)
    }

}

