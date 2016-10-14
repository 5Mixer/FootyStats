var request = require('request')
  , cheerio = require('cheerio');
var colors = require('colors');

//researchYear(process.argv[2]);

for (var i = 0; i < 10; i++)
    researchYear(1960+i)

function researchYear (year){
    var year = year || 2016;
    var url = 'http://afltables.com/afl/seas/' + year + ".html";

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

    request(url, function(err, resp, body){
    	$ = cheerio.load(body);

    	console.log(("\nGrand final results for the year "+year).green.bold);

    	tables = $('table'); //get all table row elements.
    	$(tables).each(function(i, table){
    		if ($(table).text() == "Grand Final"){ //If it's text is grand final, look at the table below it for scores.

    			//Get its parent(the page) and get it's next element, the table with the grand final
    			var grandFinalGameTable = $(table).next()


    			var games = $('td',grandFinalGameTable);

    			var teams = []

    			//Raw forms are points.goals, points.goals, points.goals, points.goals
    			var scoresTeamARaw = $(games.toArray()[1]).text().trim().split(" ");
    			var scoresTeamBRaw = $(games.toArray()[5]).text().trim().split(" ");


    			var a = getGoalsAndPoints(scoresTeamARaw);
    			teams.push({
    					name: $(games.toArray()[0]).text(),
    					quarters: a.quarters,
    					totalGoals: a.totalGoals,
    					totalPoints: a.totalPoints,
    					totalScore: a.totalScore
    				}
    			)

    			var b = getGoalsAndPoints(scoresTeamBRaw);
    			teams.push({
    					name: $(games.toArray()[4]).text(),
    					quarters: b.quarters,
    					totalGoals: b.totalGoals,
    					totalPoints: b.totalPoints,
    					totalScore: b.totalScore
    				}
    			)


    			console.log((teams[0].name + " vs " + teams[1].name).underline.green);

    			console.log("");

    			//console.log($($(games).toArray()[0]).text());
    			//console.log($($(games).toArray()[1]).text());



    			console.log("Scores were...");
    			console.log(teams[0]);
    			console.log("to")
    			console.log(teams[1]);

                console.log("---");
                console.log("quarterly analysis.".green);

                for (var i = 0; i < 4; i++){
                    console.log("quarter "+ i +": "+
                                (teams[0].quarters[i].totalScore > teams[1].quarters[i].totalScore ? "A".bold.inverse : "B".bold.inverse) +
                                " "+
                                teams[0].quarters[i].totalScore+
                                " vs "+
                                teams[1].quarters[i].totalScore)
                }

    		}
    	});
    });

}
