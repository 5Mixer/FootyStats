var Datastore = require('nedb')
	, db = new Datastore({ filename: 'database' });
var gather = require('./gather.js');
var _ = require('underscore')

//Wipe DB!
if (process.argv[2] == true){
	db.remove({}, {}, function (err, numRemoved) {
	});
}

db.loadDatabase(function (err) {
	var finished = _.after(116, complete);

	for (var year = 1900; year < 2016; year++){
		gather.researchYear(year).then(function(game){

			db.insert(game);
			finished();
		})
	}

	function complete () {
		db.find({}, function (err, docs) {
			console.log(docs);
		});
	}
});
