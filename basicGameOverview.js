module.exports = function(teams){
	console.log(("\nGrand final results for the year "+2000).green.bold);

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
