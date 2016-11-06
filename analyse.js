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

	var search = {
		all : {},
		old : { year : { $lt :  1940}},
		recent : { year : { $gt :  1976}},
		teams : [
			{"teams.0.name":"Western Bulldogs"},
			{"teams.0.name":"Hawthorn"},
			{"teams.0.name":"Essendon"},
			{"teams.0.name":"Sydney"},
			{"teams.0.name":"Carlton"},
			{"teams.0.name":"Adelaide"},
			{"teams.0.name":"West Coast"},
		]
	}

	db.find(search.recent, function (err, docs) {
		console.log(("Analysing "+docs.length+" games.").green);
		console.log()
		for (var i = 0; i < docs.length; i++){
			var game = docs[i]


			var gameDifferenceAtQuarter = game.teams[0].quarters[0].totalScore - game.teams[1].quarters[0].totalScore;
			var gameDifferenceAtHalf = game.teams[0].quarters[1].totalScore - game.teams[1].quarters[1].totalScore;
			var gameDifferenceAtThreeQuarter = game.teams[0].quarters[2].totalScore - game.teams[1].quarters[2].totalScore;
			var gameDifferenceAtFinal = game.teams[0].quarters[3].totalScore - game.teams[1].quarters[3].totalScore;


			if (gameDifferenceAtQuarter >= 0) isWinnerWinning.a += 1/docs.length;
			if (gameDifferenceAtHalf >= 0) isWinnerWinning.b += 1/docs.length;
			if (gameDifferenceAtThreeQuarter >= 0) isWinnerWinning.c += 1/docs.length;
			if (gameDifferenceAtFinal >= 0) isWinnerWinning.d += 1/docs.length;
			//if (gameDifferenceAtFinal < 1) console.log(game.year+game.type)

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
