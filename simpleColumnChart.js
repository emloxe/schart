
var ColumnChartsParent = require('./columnChartsParent');

/*
define(['columnChartsParent'], function(ColumnChartsParent){
*/
	function SimpleColumnChart (opts){
		this.opts = opts;
		this.ctx = opts.dom.getContext("2d");
		this.ctx.translate(0.5,0.5);  // 使1px线变细
		this.init();
	}



	var proto = SimpleColumnChart.prototype = new ColumnChartsParent();


	proto.chartInit = function(){


		this.drawTitle();

		// 不需要绘制图例
		// this.drawCutLine();

		this.confirmContentRegion();

		this.drawContent();

	}

	// 确定主体的绘制区域
	proto.confirmContentRegion = function(){

		// 	确定需要给坐标预留的空间

		var title = this.title;
		var width = this.width;
		var height = this.height;

		var titleNeedH = this.titleNeedH;

		var paddingLR = this.paddingLR;

		var content = this.content = {};
	 	content.conTop = titleNeedH;
	 	content.conHeight = height - titleNeedH;
	 	content.conLeft = paddingLR;
	 	content.conWidth = width -paddingLR*2;


	}





	// 绘制柱形
	proto.drawGraph = function(){
		var ctx = this.ctx;
		var cs = this.cs;
		var series = this.series;

		var csXOneLen = cs.csXOneLen;
		var csLeft = cs.csLeft;
		var csTop = cs.csTop;
		var csWidth = cs.csWidth;
		var csHeight = cs.csHeight;


		var mScale = 0.2;  // 区块内柱形图的左右留白比例

		 

		var columnW = csXOneLen*(1- mScale*2);  // 单个柱子的宽度

		var data = series[0].data;  // 二维数组传入时应该只有的一个数组，这里就默认为[0].data
		var csYMin = this.cs.csYMin;
		ctx.fillStyle = series[0].color[0];
		for (var i = 0, len = data.length; i < len; i++) {

			var columnH = (data[i] - csYMin)*this.bl;

			ctx.beginPath();

			ctx.fillRect(csLeft + (i+mScale)*csXOneLen, csTop + csHeight - columnH, columnW, columnH - 1);   // 减1的目的是不遮挡x轴

			
		}




	}



// 没有图例，重写该方法添加监听鼠标移动的特效动效
proto.addListenDynamic = function(){
	var _this = this;
	var dom = this.opts.dom;
	var width = this.width;
	var height = this.height;


	var isShowDots = false;  // 是否显示了小圆点


	this.saveOriginal();

	window.addEventListener('mousemove', function(e){
		
		var gbc = dom.getBoundingClientRect();
		var top = gbc.top;
		var left = gbc.left;
		
		var x = e.clientX;
		var y = e.clientY;
		
		// 判断是否在canvas的区域内
		if (x > left && x < left + width && y > top && y < top + height) {

			// 鼠标在canvas上的相对坐标
			var cx = x - left;
			var cy = y - top;

			var series = _this.series;

				// 进入中间主体区域
				if (cx > _this.content.conLeft && cx < _this.content.conLeft + _this.content.conWidth){
					
					_this.moveToContent(cx, cy);
					
				}else {

					if (_this.isShowOriginal === false) {
						
						_this.showOriginal();
						_this.isShowOriginal = true;
					}
				}



			/**
			 * 遍历判断是否在区域内
			 * @param {Number} start 起始值
			 * @param {Number} len   当前条件下的一排的个数
			 */
			function analyzingConditionsAreaX(start, len){
				var moveI ;
				var isMovein = false;  // 是否移入了图标
				for (var i = start; i < len; i++) {
					if ( cx > series[i].cutLinePst.boxLeftA && cx < series[i].cutLinePst.textLeftA + series[i].ctxLen) {									
						isMovein = true;
						moveI = i;
					}
				}
				if (isMovein) {
					
					if (!series[moveI].isShow) {return}

					if (isShowDots) { return;}
					
					_this.drawMoveChange(series[moveI]);
					isShowDots = true;
					_this.opts.dom.style.cursor = 'pointer';
				}else{
											
					if (!isShowDots) {return;}						
					isShowDots = false;
					isMovein = false;
					_this.showOriginal();
					
					_this.opts.dom.style.cursor = 'default';
				}
			}

			/**
			 * @param {Number} len      当前条件下的竖排的个数
			 * @param {Number} fontSize 图例的字体大小
			 */
			function analyzingConditionsAreaY(len, fontSize){
				var moveI ;
				var isMovein = false;  // 是否移入了图标
				for (var i = 0; i < len; i++) {
					if ( cy > series[i].cutLinePst.textTopA -  fontSize&& cy < series[i].cutLinePst.textTopA ) {	
						if (cx > series[i].cutLinePst.boxLeftA && cx < series[i].cutLinePst.textLeftA +series[i].ctxLen) {
							isMovein = true;
							moveI = i;
						}								
					}
				}
				if (isMovein) {
					if (!series[moveI].isShow) {return}  // 图标显示为灰色的就不画该圆点了

					if (isShowDots) { return;}
					
					_this.drawMoveChange(series[moveI]);
					isShowDots = true;
					_this.opts.dom.style.cursor = 'pointer';
				}else{
						

					if (_this.isShowOriginal === false) {
						_this.showOriginal();
					}

					if (!isShowDots) {return;}
											
					isShowDots = false;
					isMovein = false;
					
					_this.opts.dom.style.cursor = 'default';



				}
			}

		}
		
	})

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




	// 没有图例就没有点击事件，这个函数的目的是覆盖本来需要执行的函数
	proto.addListenClick = function(){}



/*	return SimpleColumnChart;
		
});*/


module.exports = SimpleColumnChart;