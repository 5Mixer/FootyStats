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

                var games = [];

            	tables = $('table'); //get all table row elements.
            	$(tables).each(function(i, table){


                    if ($(table).text() == "Grand Final"){ //If it's text is grand final, look at the table below it for scores.

            			//Get its parent(the page) and get it's next element, the table with the grand final
            			var grandFinalGameTable = $(table).next()

                        console.log(year+" Grandfinal");

            			var gameText = $('td',grandFinalGameTable);

            			var game = {
                            year : year,
                            type : "Grand Final",
                            teams:[]
                        }

            			//Raw forms are points.goals, points.goals, points.goals, points.goals
            			var scoresTeamARaw = $(gameText.toArray()[1]).text().trim().split(" ");
            			var scoresTeamBRaw = $(gameText.toArray()[5]).text().trim().split(" ");

                        console.log(scoresTeamARaw);

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

                        games.push(game);


            		}

                    if ($(table).text().indexOf("Round ") != -1){ //If it's text is round x, look at the table below it for scores.

            			//Get its parent(the page) and get it's next element, the table with the grand final
            			var roundGames = $('td',$(table).next().children()).first().children()

                        if ($(table).text().substring(0,$(table).text().indexOf('Rnd')) == ""){
                            console.log("skip")
                            return;
                        }




                        console.log(year+" "+$(table).text().substring(0,$(table).text().indexOf('Rnd')));


                        roundGames.each(function (index, table){
                            var gameText = $('td',table);

                            if ($(gameText.toArray()[0]).text().substring(0,1) == "Rd"){
                                console.log("skip")
                                return;
                            }

                            if ( $(gameText.toArray()[0]).text() == ""){
                                console.log("skip")
                                return;
                            }
                            if ( $(gameText.toArray()[0]).text().indexOf("match cancelled") != -1){
                                console.log("skip")
                                return;
                            }

                			var game = {
                                year : year,
                                type : "Round",
                                teams:[]
                            }

                			//Raw forms are points.goals, points.goals, points.goals, points.goals
                			var scoresTeamARaw = $(gameText.toArray()[1]).text().trim().split(" ");
                			var scoresTeamBRaw = $(gameText.toArray()[5]).text().trim().split(" ");

                            if (scoresTeamARaw[0] == 'Bye'){
                                return ;
                            }


                            console.log(scoresTeamARaw);

                            if (getGoalsAndPoints(scoresTeamARaw).totalScore > getGoalsAndPoints(scoresTeamBRaw).totalScore){

                                var a = getGoalsAndPoints(scoresTeamARaw);
                                var b = getGoalsAndPoints(scoresTeamBRaw);
                            }else{
                                var b = getGoalsAndPoints(scoresTeamARaw);
                                var a = getGoalsAndPoints(scoresTeamBRaw);
                            }

                            game.teams.push({
                					name: $(gameText.toArray()[0]).text(),
                					quarters: a.quarters,
                					totalGoals: a.totalGoals,
                					totalPoints: a.totalPoints,
                					totalScore: a.totalScore
                				}
                			)

                			game.teams.push({
                					name: $(gameText.toArray()[4]).text(),
                					quarters: b.quarters,
                					totalGoals: b.totalGoals,
                					totalPoints: b.totalPoints,
                					totalScore: b.totalScore
                				}
                			)

                            if (game.teams[0].totalScore != null && game.teams[1].totalScore != null){

                                games.push(game)

                            }

                        });


            		}
            	});

                resolve(games);
            });
        } );
    }
}
