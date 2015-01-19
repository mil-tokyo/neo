var nodejs = (typeof window === 'undefined');

if (nodejs) {
    var AgentSmith = require('../../agent_smith/src/agent_smith');
    var AgentSmithML = require('../agent_smith_ml');
    require('./mixture');
}

var $M = AgentSmith.Matrix;

AgentSmithML.Mixture.GMM = function(n_components, n_iter, thresh, min_covar) {
    this.n_components = typeof n_components === "undefined" ? 1 : n_components;
    this.n_iter = typeof n_iter === "undefined" ? 100 : n_iter;
    this.thresh = typeof thresh === "undefined" ? 0.01 : thresh;
    this.min_covar = typeof min_covar === "undefined" ? 0.001 : min_covar;
};

AgentSmithML.Mixture.GMM.prototype.fit = function(X){
    var n_samples = X.rows;
    var n_features = X.cols;

    this.initParams(X);
    var oldLogLikelihood = 0
    var newLogLikelihood = 0
    for(var i=0; i<this.n_iter; i++){
	var responsibility = this.expectationStep(X);
	if($M.hasNaN(responsibility)){
	    this.showParams();
	    throw new Error("responsibility has NaN value")
	}
	this.maximizationStep(X, responsibility);
	newLogLikelihood = this.calcLogLikelihood(X);
	console.log("LogLikelihood : " + newLogLikelihood)
	if(checkConvergnce(oldLogLikelihood, newLogLikelihood, this.thresh)){
	    break;
	}
	oldLogLikelihood = newLogLikelihood;
    }
    this.showParams();
}

AgentSmithML.Mixture.GMM.prototype.calcLogLikelihood = function(X){
    var n_samples = X.rows;
    var n_features = X.cols;
    loglikelihood = 0;
    for(i=0; i<n_samples; i++){
	var x = $M.extract(X, i, 0, 1, n_features).t()
	var likelihood = 0;
	for(k=0; k<this.n_components; k++){
	    likelihood += getGaussProbability(this.weights.data[k], this.means[k], this.covars[k], x);
	}
	loglikelihood -= Math.log(likelihood);
    }
    return loglikelihood
}

AgentSmithML.Mixture.GMM.prototype.expectationStep = function(X){
    var n_samples = X.rows;
    var n_features = X.cols;
    var responsibility = new $M(n_samples, this.n_components)
    responsibility.zeros(0);
    
    for(var i=0; i<n_samples; i++){
	var x = $M.extract(X, i, 0, 1, n_features).t();
	for(var k=0; k<this.n_components; k++){
	    var posterior = getGaussProbability(this.weights.data[k], this.means[k], this.covars[k], x);
	    responsibility.set(i, k, posterior)
	}
    }
    responsibility = $M.divEach(responsibility, $M.sumEachRow(responsibility))	
    return responsibility
}

AgentSmithML.Mixture.GMM.prototype.maximizationStep = function(X, responsibility){
    responsibility.print()
    var n_samples = X.rows;
    var n_features = X.cols;
    var Nk = $M.sumEachCol(responsibility);
    this.weights = Nk.clone().times( 1.0 / n_samples);
    Nk.print()

    for(var k=0; k<this.n_components; k++){
	this.means[k].zeros()
	this.covars[k].zeros()
    }
    
    for(var i=0; i<n_samples; i++){
	var x = $M.extract(X, i, 0, 1, n_features).t();
	for(var k=0; k<this.n_components; k++){
	    this.means[k].add(x.clone().times(responsibility.get(i, k)))
	}
    }

    for(var k=0; k<this.n_components; k++){
	this.means[k].times( 1.0 / Nk.get(0, k));
    }

    for(var i=0; i<n_samples; i++){
	var x = $M.extract(X, i, 0, 1, n_features).t();
	for(var k=0; k<this.n_components; k++){
	    var sub = $M.sub(x, this.means[k]);
	    this.covars[k].add($M.mul(sub, sub.t()).times( responsibility.get(i, k) ))
	}
	
    }
    
    for(var k=0; k<this.n_components; k++){
	this.covars[k].times( 1.0 / Nk.data[k]);
    }

}

AgentSmithML.Mixture.GMM.prototype.initParams = function(X){
    var n_features = X.cols
    this.weights = new $M(1, this.n_components);
    this.weights.zeros( 1.0 / this.n_components );

    this.means = [];
    this.covars = [];

    var kmeans = new AgentSmithML.Cluster.Kmeans(this.n_components)
    kmeans.fit(X)
    var init_means = kmeans.cluster_centers_;
    for(var k=0; k<this.n_components; k++){
	var mean = $M.extract(init_means, k, 0, 1, n_features).t();
	mean.random();
	this.means.push(mean);
	var covar = $M.add(AgentSmithML.Utils.Statistics.cov(X), $M.eye(n_features).times(this.min_covar));
	this.covars.push(covar);
    }	
}

AgentSmithML.Mixture.GMM.prototype.showParams= function(){
    for(var k=0; k<this.n_components; k++){
	console.log("component " + k);
	console.log("weight :" + this.weights.data[k])
	console.log("mean : ");
	this.means[k].print();
	console.log("covariance : ");
	this.covars[k].print();
	console.log();
    }
}

function getGaussProbability(weight, mean, covar, x){
    var m = x.rows;
    var sub = $M.sub(x, mean);
    var normalization_term = 1.0 / (Math.pow(Math.sqrt(2*Math.PI), m)* Math.sqrt(covar.det()));
    var gauss = Math.exp( -0.5 * $M.mul($M.mul(sub.t(), covar.inverse()), sub).data[0] )
    return weight * normalization_term * gauss 
}

function checkConvergnce(old_val, new_val, tol){
    if(Math.abs(old_val - new_val) < tol){
	return true
    }
    return false
}
