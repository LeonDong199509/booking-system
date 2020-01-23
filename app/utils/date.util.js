/**
 *check if there are free slots for this date
 *
 * @param {*} startTime -- the starttime you wanna check
 * @param {*} endTime  -- the endtime you wanna check
 * @param {*} events -- the current events in google calendar
 * @returns
 */
exports.hasTimeSlots = (startTime,endTime,events) => {
    let eventsCount = events.filter(element => 
        new Date (element.start.dateTime) >= startTime & new Date (element.end.dateTime) <= endTime
    ).length
    if (eventsCount < 12) return true;
    return false
}

/**
 *create UTC date from arguments
 *
 * @param {*} y -- year
 * @param {*} m -- month
 * @param {*} d -- day
 * @param {*} h -- hour
 */
exports.dateUTC = (y,m,d,h) => (
    new Date(Date.UTC(y,m,d,h))
)

/**
 *compare if the first date greater than second date
 *
 * @param {*} d1 -- date 1
 * @param {*} d2 -- date 2
 * @returns
 */
exports.compareDates = (d1,d2) => {
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
exports.dateAddMinutes  = (d1,m) => {
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
exports.checkLegalDates = (date) => {
    date = new Date(date);
    if (date.getDay() == 6 || date.getDay() == 0){
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
exports.isFreeSlot = (startTime,events) => {
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