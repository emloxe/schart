var ColumnChartsParent = require('./columnChartsParent');

/*
define(['columnChartsParent'], function(ColumnChartsParent){
*/

	function ClusterStackedColumnChart (opts){
		this.opts = opts;
		this.ctx = opts.dom.getContext("2d");
		this.ctx.translate(0.5,0.5);  // 使1px线变细
		
		this.init();
	}

	var proto = ClusterStackedColumnChart.prototype = new ColumnChartsParent();


/*	// 计算相关的比例
	proto.countBl = function(){
		
		var csYOneLen = this.opts.style.csYOneLen || 0;  // 纵坐标每个间距的值，由用户控制

		this.changeStructure()
		this.getExtremum();

		// 在这里获取的最大最小值
		var maxNum = this.maxNum;  // 数据中的最大值
		var minNum = this.minNum;


		var yCopies = this.cs.yCopies = 3; // 设置默认将y轴分为3分

		// 计算y轴刻度最小的值直接从0开始算
		var csYMin = this.cs.csYMin = 0; 

		var diff = Math.floor(maxNum/0.9 - csYMin); // 差值
		if (csYOneLen) {
			yCopies = Math.ceil(diff/csYOneLen); // 把展示的数据等分为几份
		}else{                              // 将数据的
			var n5 = Math.ceil(diff/yCopies).toString();
			if (parseInt(n5) > 5) {
				n5 = n5.slice(0, n5.length - 1) + '0';
				csYOneLen = parseInt(n5)  + 10;
			}else{
				csYOneLen = parseInt(n5)  + 5;
			}
		}
		
		var diff = yCopies*csYOneLen;  // 最终的跨度
		
		this.bl = this.cs.csHeight/diff;  // 比例
		this.cs.csYOneLen = csYOneLen;

	}  */


	// 计算相关的比例
	proto.countBl = function(){
		
		var csYOneLen = this.opts.style.csYOneLen || 1;  // 纵坐标每个间距的值，由用户控制

		this.changeStructure()
		this.getExtremum();




		var arr = this.series;

		var maxNum = this.maxNum ;  // 数据中的最大值



		var yCopies = 0;  // 设置默认将y轴分为3分

		// 计算y轴刻度最小的值直接从0开始算
		var csYMin = this.cs.csYMin = 0; 

		var diff = Math.floor(maxNum/0.9 - csYMin);  // 差值

		if (diff < 5) {

			diff = maxNum/0.9 - csYMin;
			var n1 = diff/5;
			var n2 = n1.toString();

			var i = 0;
			var maxI = 0;
			while(i >= 0){
				if (n2.charAt(2+i) !== '0' ) {
					break;
				}

				i++;
			}
			var divisor = 1;
			while(i >= 0){
				divisor = divisor*10;  // 计算n1要除的整数
				i--;
			}
			var n3 = n1*divisor;
			if (n3 < 1.4) {
				csYOneLen = 1/divisor;
			}else if(n3 < 2.5){
				csYOneLen = 2/divisor;
			}else if(n3 < 7.5){
				csYOneLen = 5/divisor;
			}else{
				csYOneLen = 10/divisor;
			}


		}else{

			var n1 = Math.ceil(diff/5);  // 将差值除以5，取整
			var n2 = n1.toString().length;  // 取得n1整数位的长度

			var i = n2 -1;
			var divisor = 1;
			while(i > 0){
				divisor = divisor*10;  // 计算n1要除的整数
				i--;
			}
			if (divisor === 1) {
				diff +=1;  // 当数值过小时，扩大差值
			}
				var n3 = n1/divisor;
				if (n3 < 1.4) {
					csYOneLen = 1*divisor;
				}else if(n3 < 2.5){
					csYOneLen = 2*divisor;
				}else if(n3 < 7.5){
					csYOneLen = 5*divisor;
				}else{
					csYOneLen = 10*divisor;
				}
			
		}

		yCopies = Math.ceil(diff/csYOneLen);

		
		var diff = yCopies*csYOneLen;  // 最终的跨度


		this.cs.yCopies = yCopies; 
		this.bl = this.cs.csHeight/diff;  // 比例
		this.cs.csYOneLen = csYOneLen;

		setYAxis.call(this);
		function setYAxis(){
			var yAxis = this.yAxis = []; 

			for(var j = 0; j <= yCopies; j++ ){

				var y = csYMin + csYOneLen*(yCopies*1000000-j*1000000)/1000000;	

				yAxis.push(y);			
			}

			
		}

		

	}



	// 构造新的数据结构传入this.newObj,原series不改变	 
	proto.changeStructure = function(){
		var newObj = {};
		var series = JSON.parse(JSON.stringify(this.series));

		for (var i = 0, len = series.length; i < len; i++) {

			var obj = {};
			var name = series[i].name;
			if(typeof series[i].stack === 'undefined'){
				newObj[name] = [];
				obj.name = series[i].name;
				obj.data = series[i].data;
				obj.color = series[i].color;
				newObj[name].push(obj);
			}else{

				var stack = series[i].stack;
				if (typeof newObj[stack] === 'undefined') {
					newObj[stack] = [];
				}

				obj.name = series[i].name;
				obj.data = series[i].data;
				obj.color = series[i].color;
				newObj[stack].push(obj);  
				
			}
		}

		this.newObj = newObj;

	}


	// 获取最大值以及最小值
	proto.getExtremum = function(){
		var obj = this.newObj;
		var max = -1;
		var min = -1;
		for (var key in obj) {
			if(obj.hasOwnProperty(key)){
				
				var arr = this.publicFn.spData2(obj[key]);

				var maxT = this.publicFn.getMaxNum(arr);
				var minT = this.publicFn.getMinNum(arr);

				if (maxT > max) {
					max = maxT;
				}

				if (min === -1 || minT < min) {
					min = minT
				}
			}
		}


		this.maxNum = max;
		this.minNum = min;

	}




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
		var obj = this.newObj;
		for (var key in obj) {
			if(obj.hasOwnProperty(key)){
				

				var sp = this.publicFn.spData2(obj[key]);
				
				if(this.publicFn.getMaxNum(sp) > 0){
					sLen++;
				}


			}
		}



		var mScale = 0.2;  // 区块内柱形图的左右留白比例，也就是0.2*len 0.6*len 0.2*len
		var pScale = 0.05;  // 每个柱形的间隔比例

		 
		var columnW = csXOneLen*(1- mScale*2)
		var columnOneW = (columnW-csXOneLen*pScale*(sLen-1))/sLen;  // 单个柱子的宽度


		getColumnPst.call(this);
		matchPst.call(this);
		fillRectColumn.call(this);







		// 通过改变的数据newObj计算每个柱形的定位信息
		function getColumnPst() {

			var bl = this.bl;
			var csYMin = this.cs.csYMin;
			var obj = this.newObj;

			//var i = -1;
			var ci = -1;
			for (var key in obj) {
				if(obj.hasOwnProperty(key)){
					//i++;

					var sp = this.publicFn.spData2(obj[key]);
					
					if(this.publicFn.getMaxNum(sp) > 0){
						ci++;
					}
					for (var j = 0, len2 = obj[key].length; j < len2; j++) {

						
						var pst = obj[key][j].columnPst = [];

						for (var k = 0, len3 = obj[key][j].data.length; k < len3; k++) {
							
							var top = csTop + csHeight - (sp[j].data[k] - csYMin)*bl;
							var left = csLeft + (k+mScale)*csXOneLen + (columnOneW+csXOneLen*pScale)*ci;
							var columnH = (obj[key][j].data[k] - csYMin)*bl;

							var arr = [];
							arr.push(left, top, columnOneW, columnH, obj[key][j].color[0]);
							pst.push(arr);

						}
					}


				}
			}


			


		}

		// 将获得的个个定位数据进行匹配
		function matchPst(){
			var series = this.series;
			var obj = this.newObj; 
			var i = -1;
			for (var key in obj) {
				if(obj.hasOwnProperty(key)){
					i++;

					var sp = this.publicFn.spData2(obj[key]);
					for (var j = 0, len2 = obj[key].length; j < len2; j++) {

						var name = obj[key][j].name;
						
						var pst = obj[key][j].columnPst;

						series.map(function(value){
							if (value.name === name) {
								value.columnPst = pst;
							}
						});

					}


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


/*
	return ClusterStackedColumnChart;
});*/

module.exports = ClusterStackedColumnChart;
