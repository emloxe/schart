


var ChartsParent = require('./chartsParent');


/*
define(['chartsParent'], function(ChartsParent){
*/
	function ColumnChartsParent() {
		
	}

	var proto = ColumnChartsParent.prototype = new ChartsParent;



	// 进行第一次计算
	proto.firstCalculate = function(){
		this.paddingLR = 20 ;  // 设定左右留白区域
		this.isShowOriginal = true;  // 当前是否为初始图形

		var series = this.series;

		// 初始化series[i]全部为isShow = true
		this.initializationIsShowData(series);

		// 备份series中data
		this.dataBackUp();

		this.bindColor(series);


	}


	proto.drawContent = function(){
		
		this.drawCS();
		this.drawGraph();

	}


/*	proto.countBl = function(){
		var csYOneLen = this.opts.style.csYOneLen || 0;  // 纵坐标每个间距的值，由用户控制

		var arr = this.series;

		var maxNum = this.maxNum = this.publicFn.getMaxNum(arr);  // 数据中的最大值
		var minNum = this.minNum = this.publicFn.getMinNum(arr);


		var yCopies = this.cs.yCopies = 3; // 设置默认将y轴分为3分

		// 计算y轴刻度最小的值直接从0开始算
		var csYMin = Math.floor(minNum*0.8);

		var n2 = csYMin.toString().length;
		if (n2 > 1) {
			var n3 = Math.floor(csYMin/10);
			csYMin = this.cs.csYMin = parseInt(n3.toString() + '0')
		}else{
			this.cs.csYMin = csYMin;
		} 

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


/*	// 计算相关的比例,不从0开始算
	proto.countBl = function(){
		
		var csYOneLen = this.opts.style.csYOneLen || 1;  // 纵坐标每个间距的值，由用户控制

		var arr = this.series;

		var maxNum = this.maxNum = this.publicFn.getMaxNum(arr);  // 数据中的最大值
		var minNum = this.minNum = this.publicFn.getMinNum(arr);

		var csYMin = minNum*0.8; 

		var n4 = csYMin.toString().length;
		
		if (n2 > 1) {
			var n3 = Math.floor(csYMin/10);
			csYMin = this.cs.csYMin = parseInt(n3.toString() + '0')
		}else{
			this.cs.csYMin = csYMin;
		}
		var yCopies = 0;  // 设置默认将y轴分为0份

		// 计算y轴刻度最小的值
		this.cs.csYMin = csYMin; 

		var n2 = csYMin.toString().length;
		
		if (n2 > 1) {
			var n3 = Math.floor(csYMin/10);
			csYMin = this.cs.csYMin = parseInt(n3.toString() + '0')
		}else{
			this.cs.csYMin = csYMin;
		}

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

			console.log(yAxis);

			
		}

	}*/

	// 计算相关的比例
	proto.countBl = function(){
		
		var csYOneLen = this.opts.style.csYOneLen || 1;  // 纵坐标每个间距的值，由用户控制

		var arr = this.series;

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
/*			if (divisor === 1) {
				diff +=1;  // 当数值过小时，扩大差值
			}*/
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




	// 绘制绘制横纵坐标
	proto.drawCS = function(){
		var opts = this.opts;
		var ctx = this.ctx;
		var series = this.series;


		var style = this.opts.style;

		this.cs = {};
		var csLeft = this.cs.csLeft = this.content.conLeft + this.opts.style.csYTxtLen;
		var csTop = this.cs.csTop = this.content.conTop + 10;
		var csWidth = this.cs.csWidth = this.content.conWidth - this.opts.style.csYTxtLen;
		var csHeight = this.cs.csHeight = this.content.conHeight - this.opts.style.csXTxtLen - 10;

		var csXLen = opts.xAxis.length ;  // 横坐标需要绘制多少个值,根据数组长度决定




		var csXOneLen = this.cs.csXOneLen = csWidth/csXLen;   // 每一个横坐标的间距

		var xAxis = this.xAxis;
		var series = this.series;

		this.countBl();


		// 横坐标横线绘制
		ctx.beginPath();

		ctx.strokeStyle = style.csXLineColor;
		ctx.lineWidth = style.csXlineWidth;  // 线条宽度

		ctx.moveTo(csLeft , csTop + csHeight);  // 起始点，移动画笔到(0, 0)
		ctx.lineTo(csLeft + csWidth,  csTop + csHeight);  
		ctx.stroke();


		// 判断是否绘制横坐标底部参数
		if(xAxis && this.showXAxis){

			ctx.fillStyle = style.csXfontColor;
			ctx.textAlign = "center";
			var bt = csTop + csHeight;  // 横坐标小短横起始纵位置
			var bb = csTop + csHeight + style.csXEveLen;  // 横坐标小短横结束纵位置 
			var ft = bb + style.csXfontTop;  // 横坐标字体的纵位置

			for(var i = 0; i < csXLen + 1; i++ ){
				ctx.moveTo(csLeft + csXOneLen*i, bt);  
				ctx.lineTo(csLeft + csXOneLen*i,  bb);

				ctx.font = style.csXfont;  // 字号 字体

				if (i == csXLen) { continue;}

				ctx.fillText(xAxis[i], csLeft + csXOneLen*i + csXOneLen/2, ft);  // 内容 起始位置 
				
			}

			ctx.stroke();
		}



		var bl = this.bl;
		var csYOneLen = this.cs.csYOneLen;
		var yCopies = this.cs.yCopies;
		var csYMin = this.cs.csYMin;
		var yAxis = this.yAxis;


		csYOneLenCanvas = bl*csYOneLen; // 跨度比例转换为canvas宽度


		// 绘制纵坐标
		ctx.strokeStyle = style.csYLineColor;
		ctx.fillStyle = style.csYfontColor;
		ctx.lineWidth = style.csYlineWidth;
		ctx.textAlign = "right";

		for(var j = 0; j <= yCopies; j++ ){

			ctx.moveTo(csLeft, csTop + csYOneLenCanvas*j);  
			ctx.lineTo( csLeft + csWidth,  csTop + csYOneLenCanvas*j);

			ctx.font = style.csYfont;  // 字号 字体
			ctx.fillText(yAxis[j], csLeft + style.csYfontLeft, csTop + csYOneLenCanvas*j + style.csYfontTop );  // 内容 起始位置 
			
		}
		ctx.stroke();

		


		// 根据数值、比例、坐标系top值、坐标系高度 ，返回所需的在canvas顶部值和高度值
		function toCSNum(data, bl, t, h, min){

			return t + (h - (data-min)*bl);
			
		}

	}


	proto.drawMain = function(){

		var dom = this.opts.dom;


		/*
		var width = this.width = dom.width ;  // canvas宽
		var height = this.height = dom.height;  // canvas高
		*/


			
		var width = this.width = dom.width = dom.offsetWidth ;  // canvas宽
		var height = this.height = dom.height = dom.offsetHeight;  // canvas高


		this.ctx.clearRect( 0, 0, width, height);


		this.chartInit();

	}




	// 更新数据进行重绘
	proto.reflow = function(opts){

		this.series = opts.series || this.series;
		this.xAxis = opts.xAxis || this.xAxis;

		this.drawMain();


		return this;

	}




	// 鼠标移动到主体区域时,绘制虚线、竖线、相关信息
	proto.moveToContent = function(cx, cy){
		
	}


	// 移动到特定的图例时，特定的颜色加深
	proto.drawMoveChange = function(data){
		var ctx = this.ctx;
		this.showOriginal();
		ctx.beginPath();
		ctx.fillStyle = 'rgba(0, 0, 0, .1)';

		var pst = data.columnPst;
		
		for (var j = 0; j < pst.length; j++) {

			ctx.fillRect(pst[j][0], pst[j][1], pst[j][2], pst[j][3]);  
		}

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


		// data为三维数组，获得所有数据中的最大值
		getMinNum: function (data){
			var min = 0;
			for(var i = 0, len = data.length; i < len; i++){

				if (data[i].isShow === false) {continue;}
				for(var j = 0, lenj = data[i]['data'].length; j < lenj; j++){
					if(i === 0 && j === 0){
						min = data[i]['data'][j];
					}

					if (data[i]['data'][j] < min) {
						min = data[i]['data'][j];
					}
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

		// 数据累加,不改变原数组
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
		}



	}




	// 初始化的参数变量
	ColumnChartsParent.DEFAULTS = {
		style: {
			csYTxtLen: 30,  // 设置y轴的数据预留宽度
			csXTxtLen: 40,

			csXLineColor :'#000',  // 坐标轴X的颜色
			csXlineWidth: 1,  // 坐标轴X线条的宽度
			csXEveLen: 5,  // 横坐标小短横的长度
			csXfont: "10px Arial",  // 横坐标参数的 字号 字体
			csXfontColor: "#000",  // 横坐标参数的颜色
			csXfontTop: 15,  // 横坐标参数距小短横的上位置

			csYLineColor: '#aaa',  // 坐标轴Y的颜色
			csYlineWidth: .2,  // 坐标轴Y线条的宽度
			csYfont: "12px Arial",  // 纵坐标参数的 字号 字体
			csYfontColor: "#000",  // 纵坐标参数的颜色
			csYfontLeft: -10,  // 纵坐标参数距当前长横的左位置
			csYfontTop: 5  // 纵坐标参数距当前长横的上位置
		}
		,
		title: { //图表绘制的区域
			text: '柱状图表',
			color: '#000',
			font: '16px Arial',
			position: 'center',
			isShow: true
		},
	 /*	colorInfo: {
			font: '12px Arial',
			fontColor: '#000',
			boxWidth: 20,
			boxHeight: 20
		},*/
		

	}

	// 参数填充
	proto.extendOpts = function(){
		var opts = this.opts;
		var dom = opts.dom;
		this.xAxis = JSON.parse(JSON.stringify(opts.xAxis));
		this.series =JSON.parse(JSON.stringify(opts.series));


		this.showXAxis = true;
		if(opts.showXAxis != 'undefind'){
			
			this.showXAxis = opts.showXAxis;
		}


		// 坐标系样式信息
		if (!opts.style) {
			this.opts.style = {};
		}
		this.opts.style = this.publicFn.extendObj( ColumnChartsParent.DEFAULTS.style, this.opts.style);


		// 标题信息
		if (opts.title) {
			this.title = this.publicFn.extendObj( ColumnChartsParent.DEFAULTS.title, this.opts.title);
		}else{
			this.title.isShow = false;
		}


	}






/*	return ColumnChartsParent;
})
*/



module.exports = ColumnChartsParent;