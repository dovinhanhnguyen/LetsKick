const
  bodyParser = require('body-parser'),
  request = require('request'),
  Data = require('../data/get_data'),
  task = require('./function'),
  rx = require('rxjs/Rx');


const handleMessage = (sender_psid, received_message) => {
  let response;
  console.log(received_message.text);

  let key = task.checkSpellName(received_message.text);

  //Check if the key is in an array
  if(typeof(key) == 'object') {
    newKey = task.completeName(key)
    response = {
      "text": `Did you mean *${newKey}* ? Or please retype the team you want to see!!!`
    }
    task.quickReply(sender_psid, response, key);
  // Check if the key is empty
  } else if (key == "") {
    response = {
      "text": `We cannot find your team, please give us another one!`
    }
    task.callSendAPI(sender_psid, response, false);
  // Check if the key contain a team
  } else if (key == "Set Reminder") {
    d1 = new Date()
    d2 = new Date()
    d2.setHours(d2.getHours() + 1)
    console.log("Tuan")
    setTimeout( () => {
      console.log("Nguyen")
      response = {
        "text": `It's time.`
      }
      task.callSendAPI(sender_psid, response, false)
    }, d2 - d1)
  } else {
    response = {
      "text": `\`\`\`\nPlease wait, we are retrieving information for ${key}...\n\`\`\``
    };
    console.log("waiting...");
    task.callSendAPI(sender_psid, response, false);
    Data.get_next_game(key, (err, reply) => {
        if (err) {
          response = {
            "text" : "Something went wrong. Please try again"
          }
        } else if (key) {
          request( {
            "uri": "https://graph.facebook.com/v2.6/" + sender_psid,
            "qs" : {"access_token": process.env.PAGE_ACCESS_TOKEN, fields: "timezone"},
            "method": "GET",
            "json": true,
          }, (err, res, body) => {
         // Test
            if (err) {
              console.error("Unable to send message:" + err);
            } else {
              let time = task.timeFormat(reply[2], body.timezone);
              let team = task.teamFormat(reply[0], reply[1], key);
            // Create the payload for a basic text message
              response = {
                "text": `${team[0]} will play against ${team[1]} on *${time}*, for ${reply[3]}.`
              }

              console.log("replied");
              task.callSendAPI(sender_psid, response, true);
            }
        })
      }
    })
  }
}

function handlePostback (sender_psid, received_postback) {

}

module.exports = {
  handleMessage,
  handlePostback
};
