/**
 *create UTC date from arguments
 *
 * @param {*} y -- year
 * @param {*} m -- month
 * @param {*} d -- day
 * @param {*} h -- hour
 */
const dateUTC = (y,m,d,h) => (
    new Date(Date.UTC(y,m,d,h))
)

/**
 *check if there are free slots for this date
 *
 * @param {*} startTime -- the starttime you wanna check
 * @param {*} endTime  -- the endtime you wanna check
 * @param {*} events -- the current events in google calendar
 * @returns
 */
const hasTimeSlots = (y,m,d,events) => {
    let startTime = dateUTC(y,m-1,d,9);
    let timeSlots = [];
    for (let i = 0; i < 12; i++) {
        let isFree = isFreeSlot(startTime ,events);
        if (isFree) timeSlots.push({
            "startTime":startTime.toISOString(),
            "endTIme": dateAddMinutes(startTime,40).toISOString()
        })
        startTime = dateAddMinutes(startTime,45)
    }
    if (timeSlots.length >0) return true;
    return false;
}


/**
 *compare if the first date greater than second date
 *
 * @param {*} d1 -- date 1
 * @param {*} d2 -- date 2
 * @returns
 */
const compareDates = (d1,d2) => {
    if (new Date(d1) > new Date(d2)) return true;
    return false ;
}

/**
 *used to add minutes on a date
 *
 * @param {*} d1 -- the date you wanna add on
 * @param {*} m -- the minutes you wanna add
 * @returns
 */
const dateAddMinutes  = (d1,m) => {
    d1 = new Date( d1 )
    let d2 = new Date ( d1 );
    d2.setMinutes ( d1.getMinutes() + m );
    return d2 ;
}




/**
 *check if a date is legal (not weekend and bt 9-18)
 *
 * @param {*} date -- date you wanna check
 * @returns
 */
const checkLegalDates = (date) => {
    date = new Date(date);
    if (date.getUTCDay() == 6 || date.getUTCDay() == 0){
        return false
    }else if (date.getUTCHours()<9|| date.getUTCHours()>18){
        return false
    }
    return true ;
}

/**
 *check if a slot is available
 *
 * @param {*} startTime -- the time you wanna check
 * @param {*} events -- current events in calendar
 * @returns
 */
const isFreeSlot = (startTime,events) => {
    let nowTime = (new Date()).toISOString();
    if (compareDates(nowTime,startTime)) return false;
    let time24hLater = dateAddMinutes(nowTime,24*60);
    if (compareDates(time24hLater,startTime)) return false;
    if (! checkLegalDates(startTime)) return false;
    if (!events || ! events.length) return true ;
    let result = true;
    events.forEach(element => {
        if ( (new Date (element.start.dateTime)).getTime() == startTime.getTime() ) {
            result = false
            return 
        }
    });
    return result;
}

exports.dateUTC = dateUTC;
exports.hasTimeSlots = hasTimeSlots;
exports.compareDates = compareDates;
exports.dateAddMinutes = dateAddMinutes;
exports.checkLegalDates = checkLegalDates;
exports.isFreeSlot = isFreeSlot;