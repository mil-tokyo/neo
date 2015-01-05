var nodejs = (typeof window === 'undefined');

if (nodejs) {
    var AgentSmith = require('../../agent_smith/src/agent_smith');
    var AgentSmithML = require('../agent_smith_ml');
    require('./decomposition');
}

var $M = AgentSmith.Matrix;

AgentSmithML.Decomposition.PCA = function(n_components) {
    if(n_components === undefined) n_components = 10;
    this.n_components = n_components;
    };

AgentSmithML.Decomposition.PCA.prototype.fit = function(){
    console.log("PCA\ncomponents : %d", this.n_components);
    var samples = $M.fromArray([
	[1, 1, 3],
	[0, 1, 1],
	[1, 1, 0],
	[1, 2, 1],
	[1, 2, -1],
	[9, 7, 8],
	[13, 10, 11],
	[10, 7, 8],
	[8, 11, 9],
	[9, 7, 8],
    ]);

	
    var n_samples = samples.rows;
    var n_features = samples.cols;
    console.log("n_samples : " + n_samples + ", n_features : " + n_features);
    console.log("====== start calculating PCA ======");
    var sample_mean = $M.sumEachCol(samples).times(1.0 / n_samples);
    var dist = $M.sub(samples, sample_mean);
    console.log($M.sub(samples, sample_mean).data);
    console.log(dist);
    //var covariance = $M.mul(dist.t(), dist).times(1.0 / n_samples);
    var ret = $M.svd(dist);
    //U = ret['U'];
    S = ret['S'];
    V = ret['V'];
    //console.log(covariance.data);
    
    console.log('====== end calculation ======');
    console.log()
    console.log("result:");
    console.log(S.data);
    console.log(V.data);
}



