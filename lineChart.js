

var LineChartsParent = require('./lineChartsParent');

/*
define(['lineChartsParent'], function(LineChartsParent){
*/
	function LineChart(opts) {
		this.opts = opts;
		this.ctx = opts.dom.getContext("2d");
		this.ctx.translate(0.5,0.5);  // 使1px线变细
		this.init();
		
	}

	var lineproto = LineChart.prototype = new LineChartsParent;


	lineproto.clickFlow = function(){

		this.ctx.clearRect(0, 0, this.width, this.height);

		// 不显示的值设置为零
		this.publicFn.restoreData(this.series);


		this.drawTitle();
		this.drawCutLine();
		this.drawContent();
		this.saveOriginal();
	}



/*	return LineChart;

})
*/



module.exports = LineChart;


