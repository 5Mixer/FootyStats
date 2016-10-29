var request = require('request')
  , cheerio = require('cheerio');

  function getGoalsAndPoints (rawArray){
      var totalGoals = 0;
      var totalPoints = 0;
      var totalScore = 0;

      var quarters = []

      for (var i = 0; i < rawArray.length; i++){
          var round = rawArray[i];
          var details = round.split(".");

          var goals = parseInt(details[0] - totalGoals);
          var points = parseInt(details[1] - totalPoints);
          var score = (goals * 6) + points;

          totalGoals += goals;
          totalPoints += points;
          totalScore += score;

          quarters.push( { goals: goals, points: points, score: score, totalScore: totalScore} );
      }

      return {
          totalGoals : totalGoals,
          totalPoints: totalPoints,
          quarters: quarters,
          totalScore: totalScore
      }
  }

module.exports = {
    researchYear : function (year){
        var year = year || 2016;
        return new Promise(function (resolve, reject){
            var url = 'http://afltables.com/afl/seas/' + year + ".html";


            request(url, function(err, resp, body){
            	$ = cheerio.load(body);


            	tables = $('table'); //get all table row elements.
            	$(tables).each(function(i, table){
            		if ($(table).text() == "Grand Final"){ //If it's text is grand final, look at the table below it for scores.

            			//Get its parent(the page) and get it's next element, the table with the grand final
            			var grandFinalGameTable = $(table).next()


            			var gameText = $('td',grandFinalGameTable);

            			var game = {
                            year : year,
                            teams:[]
                        }

            			//Raw forms are points.goals, points.goals, points.goals, points.goals
            			var scoresTeamARaw = $(gameText.toArray()[1]).text().trim().split(" ");
            			var scoresTeamBRaw = $(gameText.toArray()[5]).text().trim().split(" ");

            			var a = getGoalsAndPoints(scoresTeamARaw);
            			game.teams.push({
            					name: $(gameText.toArray()[0]).text(),
            					quarters: a.quarters,
            					totalGoals: a.totalGoals,
            					totalPoints: a.totalPoints,
            					totalScore: a.totalScore
            				}
            			)

            			var b = getGoalsAndPoints(scoresTeamBRaw);
            			game.teams.push({
            					name: $(gameText.toArray()[4]).text(),
            					quarters: b.quarters,
            					totalGoals: b.totalGoals,
            					totalPoints: b.totalPoints,
            					totalScore: b.totalScore
            				}
            			)

                        resolve(game);


            		}
            	});
            });
        } );

    }
}
