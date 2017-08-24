
var ColumnChartsParent = require('./columnChartsParent');

/*define(['columnChartsParent'], function(ColumnChartsParent){*/

	function ClusterColumnChart (opts){
		this.opts = opts;
		this.ctx = opts.dom.getContext("2d");
		this.ctx.translate(0.5,0.5);  // 使1px线变细
		this.init();
	}


	var proto = ClusterColumnChart.prototype = new ColumnChartsParent();

	proto.drawGraph = function(){
		var ctx = this.ctx;
		var cs = this.cs;
		var series = this.series;

		var csXOneLen = cs.csXOneLen;
		var csLeft = cs.csLeft;
		var csTop = cs.csTop;
		var csWidth = cs.csWidth;
		var csHeight = cs.csHeight;


		var sLen = 0;
		for (var i = 0; i < series.length; i++) {
			if(series[i].isShow === true){
				sLen++;
			}
		}


		var mScale = 0.2;  // 区块内柱形图的左右留白比例，也就是0.2*len 0.6*len 0.2*len
		var pScale = 0.05;  // 每个柱形的间隔比例

		 
		var columnW = csXOneLen*(1- mScale*2)
		var columnOneW = (columnW-csXOneLen*pScale*(sLen-1))/sLen;  // 单个柱子的宽度


		setColumnPst.call(this);
		fillRectColumn.call(this);


		// 存储柱形个个的坐标，宽高
		function setColumnPst(){
			
			var bl = this.bl;
			var csYMin = this.cs.csYMin;

			var ci = -1;
			for (var i = 0, len = series.length; i < len; i++) {
				var pst = series[i].columnPst = [];
				if(series[i].isShow === true){
					ci++;
				}
				for (var j = 0; j < series[i].data.length; j++) {

					
					var top = csTop + csHeight - (series[i].data[j] - csYMin)*bl;
					var left = csLeft + (j+mScale)*csXOneLen + (columnOneW+csXOneLen*pScale)*ci;
					var columnH = (series[i].data[j] - csYMin)*bl;


					var arr = [];
					arr.push(left, top, columnOneW, columnH, series[i].color[0]);
					pst.push(arr);

				}

			}

			
		}

		// 绘制柱形
		function fillRectColumn(){

			for (var i = 0; i < series.length; i++) {

				if (series[i].isShow === false) { continue;}

				ctx.beginPath();
				ctx.fillStyle = series[i].color[0];

				var pst = series[i].columnPst;
				
				for (var j = 0; j < pst.length; j++) {

					ctx.fillRect(pst[j][0], pst[j][1], pst[j][2], pst[j][3]);   // 减1的目的是不遮挡x轴
				}
			}
		}
	}



	proto.clickFlow = function(){
		

		this.ctx.clearRect(0, 0, this.width, this.height);
		// 将需要隐藏的柱形值设置为0
		this.publicFn.restoreData(this.series);

		this.drawTitle();
		this.drawCutLine();
		this.drawContent();
		this.saveOriginal();
	}



	// 鼠标移动到主体区域时,绘制灰色遮罩
	proto.moveToContent = function(cx, cy){
		var cs = this.cs;
		var _this = this;
		

		// 进入坐标系内
		if (cx > cs.csLeft && cx < cs.csLeft + cs.csWidth && cy > cs.csTop && cy < cs.csTop + cs.csHeight) {

			var x = cx - cs.csLeft;  // 转换为坐标系内x的值

			var csXOneLen = cs.csXOneLen;
			var thisI = -1;

			for (var i = 0, len = this.series[0].data.length; i < len; i++) {

				if (x > i*csXOneLen && x < (i+1)*csXOneLen) {
					thisI = i;

				}
			}

			if (thisI !== -1) {
				//if (moveI === thisI) {return;}
				//moveI = thisI;

				this.showOriginal();
				drawShadow(thisI);

				this.isShowOriginal = false;

			}
			
		}else{

			if (this.isShowOriginal === false) {
				this.showOriginal();
				this.isShowOriginal = true;
			}

		}

		function drawShadow(i){

					var ctx = _this.ctx;
					
					var csXOneLen = cs.csXOneLen;

					ctx.beginPath();
					ctx.fillStyle = 'rgba(100, 100, 100, .1)';  // 着重显示时的颜色
					ctx.fillRect(cs.csLeft + i*csXOneLen, cs.csTop, csXOneLen, cs.csHeight);
				}
	}



/*	return ClusterColumnChart;
});*/


module.exports = ClusterColumnChart;

