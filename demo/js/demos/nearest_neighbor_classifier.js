(function($M){
	AgentSmithDemo.addDemo('Nearest neighbor classifier',
		'A classifier based on nearest neighbor', {
			X: {
				shape: [2, 'n_data'],
				default: $M.fromArray([
						[10, 22],
						[11, 12],
						[15, 14],
						[17, 12],
						[20, 10],

						[20, 20],
						[21, 22],
						[15, 20],
						[17, 14],
						[20, 12]
					])
			},
			labels: {
				shape: [1, 'n_data'],
				default: $M.fromArray([[1,1,1,1,1,2,2,2,2,2]])
			}
		},
		function(plt, args){
			var $M = AgentSmith.Matrix;
			var $T = Trinity;

			var samples = args.X;
			var labels = args.labels;

			// Fit classifier
			var clf = new Neo.Neighbors.KNeighborsClassifier({n_neighbors: 1});
			clf.fit(samples, labels);

			// Plot samples
			//var plt = new $T("#content");
			var x = $M.extract(samples, 0, 0, samples.rows, 1)
			var y = $M.extract(samples, 0, 1, samples.rows, 1);
			var color = labels.t();
			plt.scatter(x,y,color);

			// Draw line
			plt.contourDesicionFunction(10, 22, 10, 22, {levels: [1.5]}, function(x,y){
				return clf.predict((new $M(1,2)).set(0,0,x).set(0,1,y)).get(0,0);
			});
			plt.show();
		});
})(AgentSmith.Matrix);