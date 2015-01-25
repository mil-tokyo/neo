(function($M){
	AgentSmithDemo.addDemo('Perceptron vis by contour',
	'A kind of linear classifier',
	{
		X: {
			shape: [2, 'n_data'],
			default: $M.fromArray([
					[ 1.4949318 ,  3.85848832],
					[ 1.42613574,  0.0456529 ],
					[ 1.1641107 ,  3.79132988],
					[ 1.54632313,  4.212973  ],
					[ 2.09680487,  3.7174206 ],
					[ 1.24258802,  4.50399192],
					[ 0.91433877,  4.55014643],
					[ 2.14823598,  1.12456117],
					[ 3.4171203 ,  0.02504426],
					[-0.55552381,  4.69595848],
					[ 2.08272263,  0.78535335],
					[ 1.52259607, -0.29081422],
					[ 2.97493505,  1.77927892],
					[ 1.06269622,  5.17635143],
					[ 1.82287143,  0.71628201],
					[ 2.79344193,  1.61909157],
					[ 1.84652023,  0.99147304],
					[ 1.03150541,  2.0681289 ],
					[ 1.87271752,  4.18069237],
					[ 1.43289271,  4.37679234]
				])
		},
		labels: {
			shape: [1, 'n_data'],
			default: $M.fromArray([[0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0]])
		}
	},
	function(plt, args){
		var $M = AgentSmith.Matrix;

		// Prepare data
		var samples = args.X;
		var labels = args.labels;

		// Learn perceptron
		var perceptron = new Neo.LinearModel.Perceptron();
		perceptron.fit(samples,labels.t());

		// Plot
		var x = $M.extract(samples, 0, 0, samples.rows, 1)
		var y = $M.extract(samples, 0, 1, samples.rows, 1);
		var color = labels.t();

		plt.scatter(x,y,color);
		plt.contourDesicionFunction(-1, 5, -1, 5, function(x,y){
			return perceptron.decisionFunction((new $M(1,2)).set(0,0,x).set(0,1,y)).get(0,0);
		});
		plt.show();
	});
})(AgentSmith.Matrix);

