const googleService = require('../services/google.service.js');
const dateUtil = require('../utils/date.util.js');
const { validationResult } = require('express-validator')


/**
 *function for /days endpoint
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getBookableDays = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ "success": false, "Message": errors.array()[0].msg });
        return;
      }

    googleService.getCalendarEvents(res,1,req.query.year,req.query.month,null);
}


/**
 *function for /timeslots
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getFreeSlots = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ "success": false, "Message": errors.array()[0].msg });
        return;
    }

    googleService.getCalendarEvents(res,2,req.query.year,req.query.month,req.query.day);
}

/**
 *function for /book
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.bookAppointments= (req,res) => {
    const errors = validationResult(req);
    const isEmpty = inputObject => {
        return Object.keys(inputObject).length === 0;
    };
    if (!errors.isEmpty()) {
        res.status(422).json({ "success": false, "Message": errors.array()[0].msg });
        return;
    }
    let startTime;
    if (!isEmpty(req.body)){
        startTime = new Date(Date.UTC(req.body.year,req.body.month-1,req.body.day,req.body.hour, req.body.minute));
    }else if(!isEmpty(req.query)){
        startTime = new Date(Date.UTC(req.query.year,req.query.month-1,req.query.day,req.query.hour, req.query.minute));
    }
    let nowTime = (new Date()).toISOString();
    let time24hLater = dateUtil.dateAddMinutes(nowTime,24*60);
    if (dateUtil.compareDates(nowTime,startTime)) return res.status(400).send({
        "success": false,
        "Message": "Cannot book time in the past"
    });
    if (dateUtil.compareDates(time24hLater,startTime)) return res.status(400).send({
        "success": false,
        "Message": "Cannot book with less than 24 hours in advance"
    });
    if (! dateUtil.checkLegalDates(startTime)) return res.status(400).send({
        "success": false,
        "Message": "Cannot book outside bookable timeframe"
    });
    if (!isEmpty(req.body)){
        googleService.createCalendarEvents(res,3,req.body.year,req.body.month,req.body.day,req.body.hour,req.body.minute);
    }else if(!isEmpty(req.query)){
        googleService.createCalendarEvents(res,3,req.query.year,req.query.month,req.query.day,req.query.hour, req.query.minute);
    }
}