var file = require('./teamName')
var popular = require('./popularTeam')

const
	request = require('request');

function checkSpellName(name) {
	var correctTeam = ""
	var flag = true
	var identityTeam = []
	if (name == "Set Reminder") {
		return name
	}

	name = name.replace(/\s/g,'').toUpperCase();
	for (var key in file) {
		if (flag) {
			array = file[key]
			team = key.replace(/\s/g,'').toUpperCase()
			// Check to see if the specific team name has duplicate with other team name at diffrent location
			if ((name.length >= 4) && team.indexOf(name) !== -1) {
				identityTeam.push(key)
			}
			for (var i in array) {
				// Check to see if the team name same as shortcut name
				if (name == array[i].replace(/\s/g,'').toUpperCase()) {
					correctTeam = key
					flag = false
					break
				//	Check to see if the specific team name has duplicate with other team name at same location
				} else if (name == array[i].replace(/\s/g,'').substring(0, name.length).toUpperCase()) {
					if (identityTeam.includes(key) == false) {
						identityTeam.push(key)
					}
				}
			}
		} else {
			break
		}
	}
	//Final Check		
	switch(identityTeam.length) {
		case 0:
			return correctTeam
			break
		case 1:
			return identityTeam[0]
			break;
		// Handle multiple teams
		default:
			return identityTeam
			break
	}
}

function completeName(key) {
	newKey = ""
	for (i = 0; i < key.length - 1; i++) {
		newKey = newKey + key[i] + ", "
	}
	newKey += "or " + key[key.length-1]
	return newKey
}

function timeFormat(inputTime, timezone) {
	var time = new Date(inputTime);
	time.setHours(time.getHours() + timezone);
	var hour = time.getHours();
	var minute = time.getMinutes();
	var date = time.getDate();
	var month = time.getMonth() + 1;
	var noon = " AM";
	if (hour > 12) {
		hour -= 12;
		noon = " PM";
	}
	if (hour == 12) 
		noon = " PM";

	if (minute < 10)
		minute = "0" + minute;
	var answer = month + "/" + date + ", " + hour + ":" + minute + noon;
	return answer;
}

// Handle the UI quick replies
function quickReplies(value) {
	var finalArr = []
	for (i = 0; i < value.length; i++) {
		map = {}
		map["content_type"] = "text"
		map["title"] = value[i]
		map["payload"] = "value"
		finalArr.push(map)
	}
	return finalArr
}

// Team format
function teamFormat(team1, team2, key) {
	var check = team1;
	team1 = "*" + team1 + "*" + "  _(Home team)_";
	team2 = "*" + team2 + "*" + "  _(Away team)_";
	if (check != key) {
		return [team2, team1];
	}
	return [team1, team2];
}

function callSendAPI(sender_psid, response, flag) {
    let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response

    }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    // "uri": "http://localhost:3100/v2.6",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN},
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (err) {
      console.error("Unable to send message:" + err);
    } else if (flag == true) {
        ask = {
            "text": `Do you want to set the time above to reminder?`,
        }
        // var count = 0
        // var i = 1
        // while (count < 1) {
        // 	i += 1
        // 	if (response.text[i] == '*')
        // 		count += 1
        // }
        // var res = response.text.substr(1, i - 1)
        var newKey = "Set Reminder"
        // console.log(newKey)
        quickReply(sender_psid, ask, [newKey]);
    }
  });
}

// function buttonSet(sender_psid, time) {

//     let request_body = {
//     "recipient": {
//       "id": sender_psid
//     },
//     "message":{
//       "attachment":{
//         "type":"template",
//         "payload":{
//           "template_type":"button",
//           "text":"Do you want to set the time above to reminder?",
//           "buttons":[
//             {
//               "type":"web_url",
//               "url":"https://www.google.com",
//               "title":"Click to set"
//               // "payload":time
//             }
//           ]
//         }
//       }
//     }
//     }
//   // Send the HTTP request to the Messenger Platform
//   request({
//     "uri": "https://graph.facebook.com/v2.6/me/messages",
//     // "uri": "http://localhost:3100/v2.6",
//     "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN},
//     "method": "POST",
//     "json": request_body
//   }, (err, res, body) => {
//     if (err) {
//       console.error("Unable to send message:" + err);
//     }
//   });
// }


function quickReply (sender_psid, response, value) {
  jsonFile = quickReplies(value)
    let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": {
      "text": response["text"],
      "quick_replies": jsonFile
    }
    }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    // "uri": "http://localhost:3100/v2.6",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN},
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (err) {
      console.error("Unable to send message:" + err);
    }
  });
}

module.exports = {
	checkSpellName,
	timeFormat,
	teamFormat,
	completeName,
	quickReplies,
	callSendAPI,
	quickReply
};
