(function($M){
	SushiDemo.addDemo('SGDRegressor',
	'A kind of linear classifier',
	{
		X: {
			shape: [2, 'n_data'],
			init: $M.fromArray([
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
			init: $M.fromArray([
					[1, 0],
					[0, 1],
					[1, 0],
					[1, 0],
					[1, 0],
					[1, 0],
					[1, 0],
					[0, 1],
					[0, 1],
					[1, 0],
					[0, 1],
					[0, 1],
					[0, 1],
					[1, 0],
					[0, 1],
					[0, 1],
					[0, 1],
					[0, 1],
					[1, 0],
					[1, 0]
				])
		}
	},
	function(plt, args){
		var $S = Tempura.Utils.Statistics;

		var samples = args.X;
		var labels = args.labels;

		// fit tempura
		var per = new Tempura.LinearModel.SGDRegressor({algorithm:'perceptron',aver:false,lambda:0.0});
		var svm = new Tempura.LinearModel.SGDRegressor({algorithm:'sgdsvm'});
		per.fit(samples,labels);
		svm.fit(samples,labels);
		// weight output
		var w = svm.weight;
		w.print();
		console.log( 'gradient' ); var grad = - w.get(0,0) / w.get(1,0); console.log( grad );
		console.log( 'intercept' ); var inter = - w.get(2,0) / w.get(1,0); console.log( inter );
		
		// Plot data points
		var meanStd = $S.meanStd( true, true, samples, false, 1);
		var x = $M.getCol(meanStd.X,0);
		var y = $M.getCol(meanStd.X,1);
		var color = $M.getCol(labels,0);
		plt.scatter(x,y,color);

		// Plot decision boundaries
		plt.contourDesicionFunction(-2, 4, -2, 2, {levels: [0], colors: 'r', linestyles: ['solid']}, function(x,y){
			return svm.predict($M.fromArray([[x,y]])).get(0,0);
		});
		plt.contourDesicionFunction(-2, 4, -2, 2, {levels: [0], colors: 'b', linestyles: ['solid']}, function(x,y){
			return per.predict($M.fromArray([[x,y]])).get(0,0);
		});

		// Draw axis labels and legends
		plt.xlabel('x');
		plt.ylabel('y');
		plt.legend(['Data points (2 classes)', 'Decision boundary (SGD SVM)', 'Decision boundary (perceptron)']);
		plt.show();
	});
})(Sushi.Matrix);

