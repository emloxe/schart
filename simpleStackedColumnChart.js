


var ColumnChartsParent = require('./columnChartsParent');

/*
define(['columnChartsParent'], function(ColumnChartsParent){
*/


function SimpleStackedColumnChart(opts){
	this.opts = opts;
	this.ctx = opts.dom.getContext("2d");
	this.ctx.translate(0.5,0.5);  // 使1px线变细
	this.init();
}

var proto = SimpleStackedColumnChart.prototype = new ColumnChartsParent();





/*// 计算相关的比例
proto.countBl = function(){
	
	var csYOneLen = this.opts.style.csYOneLen || 0;  // 纵坐标每个间距的值，由用户控制

	var arr = this.publicFn.spData2(this.series);

	var maxNum = this.maxNum = this.publicFn.getMaxNum(arr);  // 数据中的最大值
	var minNum = this.minNum = this.publicFn.getMinNum(arr);


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

}*/

// 计算相关的比例
proto.countBl = function(){
	
	var csYOneLen = this.opts.style.csYOneLen || 1;  // 纵坐标每个间距的值，由用户控制


	var arr = this.publicFn.spData2(this.series);

	var maxNum = this.maxNum = this.publicFn.getMaxNum(arr);  // 数据中的最大值



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


	setColumnPst.call(this);
	fillRectColumn.call(this);


	// 存储柱形个个的坐标，宽高
	function setColumnPst(){
		var sumHeightArr = this.publicFn.spData2(series);  // 累加后数组
		var bl = this.bl;
		var csYMin = this.cs.csYMin;

		for (var i = 0, len = series.length; i < len; i++) {
			var pst = series[i].columnPst = [];
			for (var j = 0; j < series[i].data.length; j++) {

				
				var top = csTop + csHeight - (sumHeightArr[i].data[j] - csYMin)*bl;
				var columnH = series[i].data[j]*bl;

				


				var arr = [];
				arr.push(csLeft + (j+mScale)*csXOneLen, top, columnW, columnH, series[i].color[0]);
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






proto.clickFlow = function(){
	

	this.ctx.clearRect(0, 0, this.width, this.height);

	// 将需要隐藏的柱形值设置为0
	this.publicFn.restoreData(this.series);


	this.drawTitle();
	this.drawCutLine();
	this.drawContent();
	this.saveOriginal();
}





proto.publicFn = {
	// data为三维数组，获得所有数据中的最大值
	getMaxNum: function (data){
		var max = 0;
		for(var i = 0, len = data.length; i < len; i++){
			for(var j = 0, lenj = data[i]['data'].length; j < lenj; j++){

				if (data[i]['data'][j] > max) {
					max = data[i]['data'][j];
				}
			}
		}

		return max;
	},
	getMinNum: function(series){
		var endData = series[series.length - 1].data;
		var min = -1;
		for (var i = 0; i < endData.length; i++) {

			if (i === 0) {
				min = endData[i]
			}
		 	if (endData[i] < min) {
		 		min = endData[i];
		 	}
		} 
		return min;
	},

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

	// 生成随机颜色，返回的数组，数组中有两个颜色值
	makeColor: function(){
		var arr = [];
		var a = Math.floor(Math.random()*256);
		var b = Math.floor(Math.random()*256);
		var c = Math.floor(Math.random()*256);
		var color1 = '#'+a.toString(16)+b.toString(16)+c.toString(16);
		arr.push(color1)
		var color2 = 'rgba('+a+', '+b+', '+c+', .5)';
		arr.push(color2);
		return arr;
	},

	// 数据累加
	spData2: function(series){
		var cloneData = JSON.parse(JSON.stringify(series));  // 克隆一个对象 
		var len = cloneData.length;
		var len2 = cloneData[0].data.length;  // 应保证 每一行的数据长度相同，这里默认为数据格式正确

		
		for (var i = 0, len = series.length - 1; i < len; i++) {

			for (var j = 0; j < len2; j++) {

				cloneData[i+1].data[j] = cloneData[i].data[j] + cloneData[i+1].data[j];
			} 

		}
		return cloneData;
	},

	// 将data恢复为原始数据
	restoreData: function(series){
		
		for (var i = 0, len = series.length; i < len ; i++) {
			if (series[i].isShow === false) {
				for (var j = 0, len2 = series[i]['data'].length; j < len2; j++) {
					series[i]['data'][j] = 0;
					
				}
			}else{
				series[i].data = JSON.parse(JSON.stringify(series[i].dataBackUp));
			}
			
		}
		
	},

	/**
	 * 计算起始的top值
	 * @param  {Number} outTop   外部的top
	 * @param  {Number} csHeight 坐标的高度
	 * @param  {Number} bl       比例
	 * @param  {Number} h        柱形需要占据的高度
	 * @return {Number}          起始的top值
	 */
	countStartTop: function(outTop, csHeight, bl, h){
		return outTop + csHeight - h*bl;
	}


}





/*return SimpleStackedColumnChart;
})
*/


module.exports = SimpleStackedColumnChart;
