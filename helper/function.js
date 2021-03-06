let team_name = ['AFC Bournemouth', 'Arsenal', 'Brighton & Hove Albion', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Huddersfield Town', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle United', 'Southampton', 'Stoke City', 'Swansea City', 'Tottenham Hotspur', 'Watford', 'West Bromwich Albion', 'West Ham United', 'Alavés', 'Athletic Bilbao', 'Atletico Madrid', 'Barcelona', 'Celta Vigoance', 'Deportivo La Coruña', 'Eibar', 'Espanyol', 'Getafe', 'Girona', 'Las Palmas', 'Leganes', 'Levante', 'Málaga', 'Real Betis', 'Real Madrid', 'Real Sociedad', 'Sevilla', 'Valencia', 'Villarreal', 'Argentina', 'Australia', 'Belgium', 'Brazil', 'Chile', 'Colombia', 'England', 'France', 'Germany', 'Ghana', 'Italy', 'Ivory Coast', 'Mexico', 'Netherlands', 'Nigeria', 'Portugal', 'Spain', 'United States', 'Uruguay']

let team_code = [['BOU', 1], ['ARS', 2], ['BRH', 3], ['BUR', 4], ['CHE', 5], ['CRY', 6], ['EVE', 7], ['HDD', 8], ['LEI', 9], ['LIV', 10], ['NEW', 13], ['SOU', 14], ['STK', 15], ['SWA', 16], ['TOT', 17], ['WAT', 18], ['WBA', 19], ['WHU', 20], ['ALV', 21], ['ATB', 22], ['ATM', 23], ['FCB', 24], ['CLV', 25], ['COR', 26], ['EIB', 27], ['ESY', 28], ['GET', 29], ['GIR', 30], ['LAP', 31], ['LEG', 32], ['LVT', 33], ['MLA', 34], ['BET', 35], ['MAD', 36], ['SOC', 37], ['SEV', 38], ['VAL', 39], ['VIL', 40], ['ARG', 41], ['AUS', 42], ['BEL', 43], ['BRA', 44], ['CHL', 45], ['COL', 46], ['ENG', 47], ['FRA', 48], ['GER', 49], ['GHA', 50], ['ITA', 51], ['CIV', 52], ['MEX', 53], ['NLD', 54], ['NGA', 55], ['POR', 56], ['ESP', 57], ['USA', 58], ['URY', 59], ['MCI', 11], ['MC', 11], ['MUN', 12], ['MU', 12], ['MAN UTD', 12], [' MANUTD', 12], ['MANU', 12]]


function checkSpell(name) {
	var flag = false;
	var key = name.toUpperCase();
	var len = key.length;

	// Need more work to distinguish names
	for (var i = 0; i < team_name.length; i++) {
		if (key.valueOf() == team_name[i].substring(0,len).toUpperCase().valueOf()) {
			flag = true;
			key = team_name[i];
			break;
		}
	}
	if (flag == false) {
		for (var i = 0; i < team_code.length; i++) {
			if (key.valueOf().toUpperCase() == team_code[i][0].toUpperCase().valueOf()) {
				key = team_name[team_code[i][1] - 1];
				flag = true;
				break;
			}
		}
	}
	if (flag == true)
		return key;
	else
		return "";
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

function teamFormat(team1, team2, key) {
	var check = team1;
	team1 = "*" + team1 + "*" + "  _(Home team)_";
	team2 = "*" + team2 + "*" + "  _(Away team)_";
	if (check != key) {
		return [team2, team1];
	}
	return [team1, team2];
}

module.exports = {
	checkSpell,
	timeFormat,
	teamFormat
};
