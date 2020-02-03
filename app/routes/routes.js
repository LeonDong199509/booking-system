const { query,body,check } = require('express-validator');
module.exports = (app) => {
    const ctrl = require('../controllers/controller.js');

    /**
    * @api {get} /days list bookable days
    * @apiGroup Get Method
    * @apiParam {Number} year the year you wanna list.
    * @apiParam {Number} month the month you wanna list.
    */
    app.get('/days',[
        query('year').exists().withMessage('Request is missing parameter: year')
            .isInt().withMessage("year must be a number"),
        query('month').exists().withMessage('Request is missing parameter: month')
            .isInt().withMessage("month must be a number"),
    ], ctrl.getBookableDays);
    
    /**
    * @api {get} /timeslots list all available timeslots
    * @apiGroup Get Method 
    * @apiParam {Number} year the year you wanna list.
    * @apiParam {Number} month the month you wanna list.
    * @apiParam {Number} day the day you wanna list.
    */
    app.get('/timeslots',[
        query('year').exists().withMessage('Request is missing parameter: year')
            .isInt().withMessage("year must be a number"),
        query('month').exists().withMessage('Request is missing parameter: month')
            .isInt().withMessage("month must be a number"),
        query('day').exists().withMessage('Request is missing parameter: day')
            .isInt().withMessage("day must be a number"),
    ], ctrl.getFreeSlots);
    

    /**
    * @api {post} /book book an appointment
    * @apiGroup Post Method 
    * @apiParam {Number} year the year you wanna book.
    * @apiParam {Number} month the month you wanna book.
    * @apiParam {Number} day the day you wanna book.
    * @apiParam {Number} hour the hour you wanna book.
    * @apiParam {Number} minute the minute you wanna book.
    */
    app.post('/book',[
        check('year').exists().withMessage('Request is missing parameter: year')
            .isInt().withMessage("year must be a number"),
        check('month').exists().withMessage('Request is missing parameter: month')
            .isInt().withMessage("month must be a number"),
        check('day').exists().withMessage('Request is missing parameter: day')
            .isInt().withMessage("day must be a number"),
        check('hour').exists().withMessage('Request is missing parameter: hour')
            .isInt().withMessage("hour must be a number"),
        check('minute').exists().withMessage('Request is missing parameter: minute')
            .isInt().withMessage("minute must be a number"),
    ], ctrl.bookAppointments);
}