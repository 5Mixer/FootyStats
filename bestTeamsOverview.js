function bestTeamsOverview() {
	this.teams = {}
}
bestTeamsOverview.prototype.accountForYear = function(year,t){
	var winningTeam = t[0].name; //DB is already sorted with winner first.
	if (this.teams[winningTeam] == undefined){
		this.teams[winningTeam] = 1;
	}else{
		this.teams[winningTeam]++;
	}
}


module.exports = bestTeamsOverview;
