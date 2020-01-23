define({ "api": [
  {
    "type": "get",
    "url": "/days",
    "title": "list bookable days",
    "group": "Get_Method",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "year",
            "description": "<p>the year you wanna list.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "month",
            "description": "<p>the month you wanna list.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/routes.js",
    "groupTitle": "Get_Method",
    "name": "GetDays"
  },
  {
    "type": "get",
    "url": "/timeslots",
    "title": "list all available timeslots",
    "group": "Get_Method",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "year",
            "description": "<p>the year you wanna list.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "month",
            "description": "<p>the month you wanna list.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "day",
            "description": "<p>the day you wanna list.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/routes.js",
    "groupTitle": "Get_Method",
    "name": "GetTimeslots"
  },
  {
    "type": "post",
    "url": "/book",
    "title": "book an appointment",
    "group": "Post_Method",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "year",
            "description": "<p>the year you wanna book.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "month",
            "description": "<p>the month you wanna book.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "day",
            "description": "<p>the day you wanna book.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "hour",
            "description": "<p>the hour you wanna book.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "minute",
            "description": "<p>the minute you wanna book.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/routes.js",
    "groupTitle": "Post_Method",
    "name": "PostBook"
  }
] });
