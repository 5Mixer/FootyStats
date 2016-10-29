var Datastore = require('nedb')
	, db = new Datastore({ filename: 'database' });
var gather = require('./gather.js');
var _ = require('underscore')
var colors = require('colors');

//Wipe DB!
if (process.argv[2] == true){
	db.remove({}, {}, function (err, numRemoved) {
	});
}

db.loadDatabase(function (err) {


	var isWinnerWinning = {
		a : 0,
		b : 0,
		c : 0,
		d : 0,
	}

	var winnerWinningByWhat = {
		a: 0,
		b: 0,
		c: 0,
		d: 0,
	}

	db.find({"teams.0.name" : "Collingwood"}, function (err, docs) {
		console.log(("Analysing "+docs.length+" games.").green);
		console.log()
		for (var i = 0; i < docs.length; i++){
			var game = docs[i]


			var gameDifferenceAtQuarter = game.teams[0].quarters[0].totalScore - game.teams[1].quarters[0].totalScore;
			var gameDifferenceAtHalf = game.teams[0].quarters[1].totalScore - game.teams[1].quarters[1].totalScore;
			var gameDifferenceAtThreeQuarter = game.teams[0].quarters[2].totalScore - game.teams[1].quarters[2].totalScore;
			var gameDifferenceAtFinal = game.teams[0].quarters[3].totalScore - game.teams[1].quarters[3].totalScore;


			if (gameDifferenceAtQuarter > 0) isWinnerWinning.a++;
			if (gameDifferenceAtHalf > 0) isWinnerWinning.b++;
			if (gameDifferenceAtThreeQuarter > 0) isWinnerWinning.c++;
			if (gameDifferenceAtFinal > 0) isWinnerWinning.d++;

			winnerWinningByWhat.a += gameDifferenceAtQuarter/docs.length;
			winnerWinningByWhat.b += gameDifferenceAtHalf/docs.length;
			winnerWinningByWhat.c += gameDifferenceAtThreeQuarter/docs.length;
			winnerWinningByWhat.d += gameDifferenceAtFinal/docs.length;


		}

		console.log("Is winning per quarter.".green);
		console.log(isWinnerWinning);

		console.log()

		console.log("Average margin per quarter.".green)
		console.log(winnerWinningByWhat);
	});
});
