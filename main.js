var gather = require('./gather.js');
var colors = require('colors');

//researchYear(process.argv[2]);
/*gather.researchYear(2000).then(function (teams){

	require('./basicGameOverview.js')(teams);

}).catch(function (reason){
	console.log("Failed : "+reason.stack)
})*/
gather.researchYear(process.argv[2] || 2016).then(function(games){
	//console.log(JSON.stringify(games))
})
