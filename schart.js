
var StackedAreaChart = require('./stackedAreaChart');
var PieChart = require('./pieChart');
var LineChart = require('./lineChart');
var SimpleColumnChart = require('./simpleColumnChart');
var SimpleStackedColumnChart = require('./simpleStackedColumnChart');
var ClusterColumnChart = require('./clusterColumnChart');
var ClusterStackedColumnChart = require('./clusterStackedColumnChart');


/*
define(['stackedAreaChart', 'pieChart', 'lineChart', 'simpleColumnChart', 'simpleStackedColumnChart', 'clusterColumnChart', 'clusterStackedColumnChart'], function(StackedAreaChart, PieChart, LineChart, SimpleColumnChart, SimpleStackedColumnChart, ClusterColumnChart, ClusterStackedColumnChart){
*/
	window.schart = function(opts){
		var type = opts.type; 
		var obj ;

		switch(type){
			case 'stackedAreaChart': 
				obj = new StackedAreaChart(opts);
				break;
			case 'pieChart':
				obj = new PieChart(opts);
				break;
			case 'lineChart':
				obj = new LineChart(opts);
				break;
			case 'simpleColumnChart':
				obj = new SimpleColumnChart(opts);
				break;
			case 'simpleStackedColumnChart':
				obj = new SimpleStackedColumnChart(opts);
				break;
			case 'clusterColumnChart': 
				obj = new ClusterColumnChart(opts);
				break;
			case 'clusterStackedColumnChart':
				obj = new ClusterStackedColumnChart(opts);
				break;
			default: 
				throw new Error('传入参数type，有误'); 
		}

		return obj;
	}

	

/*	return window.schart;
})
*/


