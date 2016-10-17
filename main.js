var gather = require('./gather.js');
var colors = require('colors');

//researchYear(process.argv[2]);
/*gather.researchYear(2000).then(function (teams){

	require('./basicGameOverview.js')(teams);

}).catch(function (reason){
	console.log("Failed : "+reason.stack)
})*/
var analysis = new (require('./bestTeamsOverview.js'));
for (var i = 0; i < 100; i++){
	var year = 1900 + i;

	gather.researchYear(year).then(function (teams){
		analysis.accountForYear(year,teams);

		console.log(analysis.teams)
		console.log("-----------")

	}).catch(function (reason){
		console.log("Failed : "+reason.stack)
	})
}
