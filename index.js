'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "ZZS: Seems like some problem. Speak again."
    var action = req.body.result.action;
    return res.json({
        speech: 'action:'+action+';echo:'+speech,
        displayText: 'ZZS:'+speech,
        source: 'webhook-echo-sample'
    });
});

restService.post('/slack-test', function(req, res) {
    
    var action = req.body.result.action;
    
    var slack_message = welcome();
    
    if (req.body.result && req.body.result.parameters && req.body.result.parameters.TR) {
        slack_message = tr();
    }
    if (req.body.result && req.body.result.parameters && req.body.result.parameters.PRJ) {
        slack_message = bimbqm();        
    }
    if (req.body.result && req.body.result.parameters && req.body.result.parameters.JF) {
        slack_message = jf();        
    }

    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'webhook-echo-sample',
        data: {
            "slack": slack_message
        }
    });
});

function jf(){
    return {
        "text": "John Finch",
        "attachments": [ {
            "title": "Chief Technology Officer, Financial and Risk at Thomson Reuters",
            "title_link": "https://uk.linkedin.com/in/john-finch-0a854920",
            "color": "#f49e42",
            "thumb_url": "https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAALhAAAAJGUzMmU1MjY4LWFkNTEtNDhmNi05YTM1LTlmZTVkZjBhNjIwOA.jpg"
        }]
    }
}

function welcome(){
    return {
        "text": "What can I help you?",
        "attachments": [ {
            "title": "TR BJOC Innovation Lab",
            "title_link": "https://www.thomsonreuters.cn/content/dam/openweb/images/china/artworked/Jinhui3.jpg",
            "color": "#f49e42",
            "thumb_url": "https://www.thomsonreuters.cn/content/dam/openweb/images/china/artworked/Jinhui3.jpg"
        }]
    }
}

function tr(){
    return {
        "text": "The Answer Company",
        "attachments": [ {
            "title": "Board of Directors",
            "title_link": "https://www.thomsonreuters.com/en/about-us/board-of-directors.html",
            "color": "#f49e42",
            "thumb_url": "https://www.thomsonreuters.com/content/dam/openweb/images/corporate/16-9/bio-photos/david-thomson.jpg/_jcr_content/renditions/cq5dam.thumbnail.370.208.png"
        },
        {
            "title": "Executive Team",
            "title_link": "https://www.thomsonreuters.com/en/about-us/executive-team.html",
            "color": "#f49e42",
            "thumb_url": "https://www.thomsonreuters.com/content/dam/openweb/images/corporate/16-9/bio-photos/James-Smith.jpg/_jcr_content/renditions/cq5dam.thumbnail.370.208.png"        
        }]
    }
}

function bimbqm(){
    return {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.thomsonreuters.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.thomsonreuters.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
}

function pg_connect(){
    var pg = require('pg');
    pg.defaults.ssl = true;
    var conString = "postgres://nlmiijucugmkgy:ecee66c60fdf4553ad10261ff5fa2d0bb65858f2a623be3559d73ad938f534d1@ec2-184-73-247-240.compute-1.amazonaws.com:5432/d8hm6a03dul7uh"
    var client = new pg.Client(conString);
    var message = "Connected!";
    client.connect(function(err) {
        if(err) {
            console.error('could not connect to postgres', err);
            message = "could not connect to postgres";
        }
        client.query('SELECT NOW() AS "theTime"', function(err, result) {
            if(err) {
                console.error('error running query', err);
                message = "error running query";
            }
            console.log(result.rows[0].theTime);
            message = result.rows[0].theTime;
            //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
            client.end();
        });
    });
    return {
        "text": message,
        "attachements": [{'',''}]
    };
}


restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
