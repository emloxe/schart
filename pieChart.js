

var ChartsParent = require('./chartsParent');

/*
define(['chartsParent'], function(ChartsParent){
*/

	function PieChart(opts){
		this.opts = opts;

		this.init();
	}


	var pieProto = PieChart.prototype  = new ChartsParent;





	// 进行第一次计算
	pieProto.firstCalculate = function(){
		var _this = this;
		this.paddingLR = 20;  // 设定左右留白区域

		this.isShowColor = false;

		var series = this.series;

		// 初始化series[i]全部为isShow = true
		this.initializationIsShowData(series);

		// 备份series中data
		this.dataBackUp();


		// 从大到小排序数组
		// series.sort(function (a, b){ return b.data - a.data});

		// 填充数据颜色
		this.bindColor(series);


		this.publicFn.calculateScale(series);


	}



	pieProto.drawContent = function(){
		var _this = this;
		var ctx = this.ctx;
		var series = this.series;

		var conWidth = this.content.conWidth;
		var conHeight = this.content.conHeight;
		var conTop = this.content.conTop;
		var conLeft = this.content.conLeft;

		this.pie = {};
		// 绘制的中心值
		var centerL = this.pie.centerL =  Math.floor(conLeft + conWidth/2);
		var centerT = this.pie.centerT =Math.floor(conTop + conHeight/2);


		init();

		function init(){
			drawSectorAll();
			drawSectorInfo();
		}

		

		// 绘制扇形
		function drawSectorAll(){
			// 计算半径
			var radius =  _this.opts.radius || 0.9;
			var r = (conWidth < conHeight ? conWidth*radius : conHeight*radius)/2;
			_this.pie.r = r;
			if(r < 0) return;
			ctx.save()
			// 位移到圆心，方便绘制
			ctx.translate(centerL, centerT);

			for (var i = 0; i < series.length; i++) {
				drawSector(r, series[i].startAngle, series[i].startAngle + series[i].scale, series[i].color[0])
			}

			ctx.restore();


			/**
			 * 绘制扇形
			 * @param  {number} r 半径
			 * @param  {number} a 比例
			 * @param  {number} b [description]
			 * @return {[type]}   [description]
			 */
			function drawSector(r, a, b,color){
				ctx.fillStyle = color;
				ctx.beginPath();
				// 移动到圆心
				ctx.moveTo(0, 0);
				// 绘制圆弧
				ctx.arc(0, 0, r, Math.PI*2*a, Math.PI*2*b);
				// 闭合路径
				ctx.closePath(Math.PI*2*a, Math.PI*2*b);
				ctx.fill();



			}

		}

		// 绘制扇形的信息
		function drawSectorInfo(){
			var r = _this.pie.r;
			var sl = 10;  // 标注斜横长度
			var hl = 5;  // 标注短横长度

			var centerL = _this.pie.centerL;
			var centerT = _this.pie.centerT;


			var allLen = r + sl;

			for (var i = 0; i < series.length; i++) {	

				if (series[i].isShow === false) { continue;}
				
				var angle = (series[i].startAngle + series[i].scale/2)*2*Math.PI;
				var sinL = allLen*Math.sin(angle);
				var cosL = allLen*Math.cos(angle);
				var rsl = r*Math.sin(angle);
				var rcl = r*Math.cos(angle);

				ctx.beginPath();
				ctx.strokeStyle = series[i].color[0];
				ctx.fillStyle = '#000';
				
				
				ctx.moveTo(centerL + rcl, centerT + rsl);
				ctx.lineTo(centerL + cosL, centerT + sinL);
				if (cosL >= 0) {
					ctx.lineTo(centerL + cosL + hl, centerT + sinL);
					ctx.textAlign = 'start';
					ctx.fillText(series[i].cutName, centerL + cosL + hl + 3, centerT + sinL + _this.cutLine.fontSize/2);
				}else{
					ctx.lineTo(centerL + cosL - hl, centerT + sinL);
					ctx.textAlign = 'end';
					ctx.fillText(series[i].cutName, centerL + cosL + hl - 13, centerT + sinL + _this.cutLine.fontSize/2);
				}
				ctx.stroke();

			}
		}


	}

	pieProto.drawMain = function(){
		var dom = this.opts.dom;
		var ctx = this.ctx;
			
		var width = this.width = dom.width = dom.offsetWidth ;  // canvas宽
		var height = this.height = dom.height = dom.offsetHeight;  // canvas高


		this.ctx.clearRect( 0, 0, width, height);

		this.chartInit();
		

	}



	pieProto.clickFlow = function(){

		this.ctx.clearRect(0, 0, this.width, this.height);


		// 不显示的值设置为零
		this.publicFn.restoreData(this.series);
		this.publicFn.calculateScale(this.series);


		this.drawTitle();
		this.drawCutLine();
		this.drawContent();
		this.saveOriginal();

	}



	// 更新数据进行重绘
	pieProto.reflow = function(opts){

		this.series = opts.series || this.series;
		this.drawMain();
		return this;

	}




	/**
	 * 绘制颜色的改变
	 * @param  {Object} obj series数组中的某一个
	 */
	pieProto.drawMoveChange = function(obj){
		var ctx = this.ctx;

		if (!obj) {return;}

		this.showOriginal();

		ctx.save()
		// 位移到圆心，方便绘制
		ctx.translate(this.pie.centerL, this.pie.centerT);

		ctx.fillStyle = 'rgba(255, 255, 255, .3)';
		ctx.beginPath();
		// 移动到圆心
		ctx.moveTo(0, 0);
		// 绘制圆弧
		
		ctx.arc(0, 0, this.pie.r, Math.PI*2*obj.startAngle, Math.PI*2*obj.startAngle + Math.PI*2*obj.scale);
		// 闭合路径
		ctx.closePath(Math.PI*2*obj.startAngle, Math.PI*2*obj.startAngle + Math.PI*2*obj.startAngle);
		ctx.fill();

		ctx.restore();

	}


	// 当鼠标移动到主体区域，进行动态绘制
	pieProto.moveToContent = function(cx, cy){
		var r = this.pie.r;
		var series = this.series;

		var centerL = this.pie.centerL;
		var centerT = this.pie.centerT;

		var diffX = cx - centerL;
		var diffY = cy - centerT;

		


		// 进入饼图区域
		if(Math.pow(diffX, 2) + Math.pow(diffY, 2) < Math.pow(r, 2)){
			var a = Math.atan(diffY/diffX)/Math.PI/2; // 比值
			if (diffX < 0 && diffY > 0) {
				a = 0.5 + a;
			}else if(diffX < 0 && diffY < 0){
				a = a + 0.5;
			}else if(diffX > 0 && diffY < 0){
				a = a + 1;
			}

			

			for (var i = 0, len = series.length; i < len; i++) {
				var moveI ;
				if(a > series[i].startAngle){					
					moveI = i;
				}
			}

			
			if (!this.isShowColor ) {   // this.isShowColor定义在 firstCalculate 中
				
				this.drawMoveChange(series[moveI]);
				this.isShowColor = true;
			}else if(this.lastI !== moveI){
				this.showOriginal();
				this.drawMoveChange(series[moveI]);
				this.isShowColor = true;
			}
			this.lastI = moveI;
		}else{
			this.isShowColor = false;
			this.showOriginal();
		}
	}




	pieProto.publicFn = {


		//  a为默认参数对象，b为传递进来的参数对象
		extendObj: function (a, b){ 

			var str = JSON.stringify(a);
			var newobj = JSON.parse(str)
			for(key in b){
				if(newobj.hasOwnProperty(key)){
					newobj[key] = b[key];
				}else{
					newobj[key] = b[key];
					console.log('传入的参数'+key+'原本没有！');
				}
			}

			return newobj;
		},

		restoreData: function(series){

			for (var i = 0, len = series.length; i < len ; i++) {
				if (series[i].isShow === false) {
					series[i].data = 0;
				}else{
					series[i].data = series[i].dataBackUp;
				}
				
			}

		},


		// 计算比例和
		calculateScale: function(series){

			var sumNum = 0;
			var sumScale = 0;

			for (var i = 0; i < series.length; i++) {
				sumNum += series[i].data;
			}

			for (var i = 0, scale = 0; i < series.length; i++) {
				scale = series[i].data/sumNum;
				series[i].startAngle = sumScale;
				series[i].scale = scale;  //百分比例
				sumScale += scale;
				
			}

		}

	}


	// 初始化的参数变量
	PieChart.DEFAULTS = {

		title: { //图表绘制的区域
			text: '图表-饼图',
			color: '#000',
			font: '16px Arial',
			position: 'center',
			isShow: true
		}

	}

	// 参数填充
	pieProto.extendOpts = function(){
		var opts = this.opts;
		this.ctx = opts.dom.getContext("2d");
		this.ctx.translate(0.5, 0.5);

		this.series =JSON.parse(JSON.stringify(opts.series));


		// 标题信息
		if (opts.title) {
			this.title = this.publicFn.extendObj( PieChart.DEFAULTS.title, this.opts.title);
		}else{
			this.title.isShow = false;
		}


	}

/*	return PieChart;
})*/




module.exports = PieChart;

