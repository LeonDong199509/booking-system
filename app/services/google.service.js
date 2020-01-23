const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const dateUtil = require('../utils/date.util.js');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

// shows which endpoint was requested,1 means /days, 2 means /timeslots,3 means /book
let apiRequested ;
// global parameters 
let paramYear, paramMonth, paramDay,paramHour, paramMin;


/**
 *get access token for google calendar api
 *
 * @param {*} oAuth2Client -- google calendar account credential
 * @param {*} callback -- callback when get token
 * @param {*} resApi -- the api response from controller
 */
getAccessToken = (oAuth2Client, callback, resApi) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client, resApi);
        });
    });
}



/**
 *authorize the calendar account to get access for google api
 *
 * @param {*} credentials -- credentials for your google calendar account
 * @param {*} callback -- callback when authorize successfully
 * @param {*} resApi -- the api response from controller
 */ 
authorize = (credentials, callback, resApi) => {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback,resApi);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client,resApi);
    });
}



/**
 *return response data for bookable days api
 *
 * @param {*} events -- events got from google calender api
 * @returns
 */
dataBookableDays = (events) => {
    let days = [];
    let daysInMonth = new Date(paramYear,paramMonth,0).getDate();
    for (i = 0; i < daysInMonth; i++) {
        let has = dateUtil.hasTimeSlots(
            dateUtil.dateUTC(paramYear,paramMonth-1,i+1,9),
            dateUtil.dateUTC(paramYear,paramMonth-1,i+1,18),
            events
        );
        days.push({"day": i+1,"hasTimeSlots": has})
    }
    return {
        "success":true,
        "days":days
    } ;
}


/**
 *return response data for available slots api
 *
 * @param {*} events -- events got from google calendar api
 * @returns
 */
dataFreeSlots = (events) => {
    let timeSlots = [];
    let startTime = dateUtil.dateUTC(paramYear,paramMonth-1,paramDay,9);
    for (i = 0; i < 12; i++) {
        let isFree = dateUtil.isFreeSlot(startTime ,events);
        if (isFree) timeSlots.push({
            "startTime":startTime.toISOString(),
            "endTIme": dateUtil.dateAddMinutes(startTime,40).toISOString()
        })
        startTime = dateUtil.dateAddMinutes(startTime,45)
    }
    return {
        "success":true,
        "timeSlots":timeSlots
    } ;
}



/**
 *get events list from google calendar api
 *
 * @param {*} auth -- google calendar account credential
 * @param {*} resApi -- the api response from controller 
 * @returns
 */
listEvents = (auth,resApi) => {
    const calendar = google.calendar({version: 'v3', auth});
    let timeMax, timeMin, getResData;
    if (apiRequested == 3){
        let startTime = new Date(Date.UTC(paramYear,paramMonth-1,paramDay,paramHour,paramMin));
        return calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date(Date.UTC(paramYear, paramMonth-1, paramDay,9))).toISOString(),
            timeMax: (new Date(Date.UTC(paramYear, paramMonth-1, paramDay,18))).toISOString() ,
            timeZone: 'UTC',
            orderBy: 'startTime',
            singleEvents: true
        })
    }
    if (apiRequested == 1) {
        timeMin = (new Date(Date.UTC(paramYear, paramMonth-1, 1))).toISOString() ;
        timeMax = (new Date(Date.UTC(paramYear, paramMonth, 1))).toISOString() ;
        getResData = dataBookableDays ;
    }else if (apiRequested == 2){
        timeMin = (new Date(Date.UTC(paramYear, paramMonth-1, paramDay,9))).toISOString() ;
        timeMax = (new Date(Date.UTC(paramYear, paramMonth-1, paramDay,18))).toISOString() ;
        getResData = dataFreeSlots ;
    }
    calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        timeZone: 'UTC',
        orderBy: 'startTime',
        singleEvents: true
    }, (err, res) => {
        if (err) return resApi.status(400).send({
            "success": false,
            "message": "cannot get events from goole caleder api"
        });
        const events = res.data.items;
        resApi.send(getResData(events));
    });
}


/**
 *create calendar events in google calendar via google api
 *
 * @param {*} auth -- google calendar account credential
 * @param {*} resApi -- the api response from controller 
 */
createEvents = (auth,resApi) => {
    let startTime = new Date(Date.UTC(paramYear,paramMonth-1,paramDay,paramHour,paramMin));
    listEvents(auth,resApi).then(
        (res)=>{
            const events = res.data.items;
            let freeSlots = dataFreeSlots(events).timeSlots
            let available = false
            freeSlots.forEach(element => {
                if (element.startTime == startTime.toISOString()){
                    available = true
                    return
                }
            });
            if (! available){
                return resApi.status(400).send({
                    "success": false,
                    "message": "Invalid time slot"
                })
            }else{
                createEvent();
            }
        },
        (error)=>{
            return resApi.status(400).send({
                    "success": false,
                    "message": "cannot get events from goole caleder api"
                })
        }
    )
    function createEvent(){
        let event = {
            'summary': '2hats appointment',
            'location': '77 Hannan St, Maroubra, NSW',
            'description': 'A chance to hear more about 2hats.',
            'start': {
                'dateTime': startTime.toISOString(),
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': dateUtil.dateAddMinutes(startTime,40).toISOString(),
                'timeZone': 'UTC',
            },
        };
        const calendar = google.calendar({version: 'v3', auth});
        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
        }, function(err, event) {
            if (err) {
                return resApi.status(400).send({
                    "success": false,
                    "message": "cannot create event via goole caleder api"
                })
            }
            resApi.send({
                "success":true,
                "startTime":startTime.toISOString(),
                "endTime": dateUtil.dateAddMinutes(startTime,40).toISOString()
            });
        });
    }
}


/**
 *export for the use of controller
 *
 * @param {*} resApi -- the api response 
 * @param {*} api -- api type
 * @param {*} year -- year from query params
 * @param {*} month -- month from query params
 * @param {*} day -- day from query params
 */
exports.getCalendarEvents = (resApi,api,year,month,day) => {
    apiRequested = api; paramYear = year; paramMonth = month; paramDay = day;
    fs.readFile('credentials.json', (err, content) => {
        if (err) return resApi.status(400).send({
            "success": false,
            "message": "cannot read credentials.json"
        });
        authorize(JSON.parse(content), listEvents,resApi);
    });
}

/**
 *export for the use of controller
 *
 * @param {*} resApi -- the api response
 * @param {*} api -- api type
 * @param {*} year -- year from post data
 * @param {*} month -- month from post data
 * @param {*} day -- day from post data
 * @param {*} hour -- hour from post data
 * @param {*} min -- minute from post data
 */
exports.createCalendarEvents = (resApi,api,year,month,day,hour,min) => {
    apiRequested = api; paramYear = year; paramMonth = month; paramDay = day;paramHour = hour;paramMin = min;
    fs.readFile('credentials.json', (err, content) => {
        if (err) return resApi.status(400).send({
            "success": false,
            "message": "cannot read credentials.json"
        });
        authorize(JSON.parse(content), createEvents,resApi);
    });
}

