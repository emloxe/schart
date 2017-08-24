

var ChartsParent = require('./chartsParent');

/*
define(['chartsParent'], function(ChartsParent){
*/
	function LineChartsParent() {
		
	}

	var linepproto = LineChartsParent.prototype = new ChartsParent;



	// 进行第一次计算
	linepproto.firstCalculate = function(){
		this.paddingLR = 20 ;  // 设定左右留白区域
		this.isShowOriginal = true;  // 当前是否为初始图形

		var series = this.series;

		// 初始化series[i]全部为isShow = true
		this.initializationIsShowData(series);

		// 备份series中data
		this.dataBackUp();


		this.bindColor(series);

	}

	/*
	// 计算相关的比例
	linepproto.countBl = function(){
		
		var csYOneLen = this.opts.style.csYOneLen || 0;  // 纵坐标每个间距的值，由用户控制

		var arr = this.series;

		var maxNum = this.maxNum = this.publicFn.getMaxNum(arr);  // 数据中的最大值
		var minNum = this.minNum = this.publicFn.getMinNum(arr);


		var yCopies = this.cs.yCopies = 3; // 设置默认将y轴分为3分

		// 计算y轴刻度最小的值并把它转换为整数
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

	// 计算相关的比例
	linepproto.countBl = function(){
		
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



	linepproto.drawContent = function(){

		
		this.drawCS();
		this.drawGraph();

		// 存储鼠标移到x轴后所显示点的信息
		this.saveXDotsPsInfo();

	}


	linepproto.drawGraph = function(){

		var series = this.series;
		var ctx = this.ctx;
		var opts = this.opts;

		var csLeft = this.cs.csLeft ;
		var csTop = this.cs.csTop ;
		var csWidth = this.cs.csWidth;
		var csHeight = this.cs.csHeight;

		var bl = this.bl;
		var csYMin = this.cs.csYMin;
		var csXOneLen = this.cs.csXOneLen;

		// 生成数据图
		for(var i = 0, len = series.length; i < len; i++){
			var color = series[i].color || colors[i];   // 注意传入的color应该Wie一个数组
			draw.call(this, series[i]);		
		}

		


		/**
		 * 绘制曲线和阴影
		 * @param  {[type]} dataAll   对象{name:'邮件营销',data:[ 192, 201, 194, 290, 430, 310, 320] }
		 * @param  {[type]} color  颜色，为一个数组
		 */
		function draw( dataAll){

			
			

			var data = dataAll.data;
			// 将颜色和线条内容进行绑定

			ctx.beginPath();
			ctx.lineWidth = 1;  // 线条宽度
			ctx.strokeStyle = dataAll.color[0];

			//判断填充颜色是否为透明色
			if (opts.style.fillHyaline && opts.style.fillHyaline === true) {
				ctx.fillStyle= dataAll.color[1] || dataAll.color[1];
			}else{
				ctx.fillStyle= dataAll.color[0];
			}
			

			dataAll.dotsPst = [];  // 存储位置
			var tempX = 0;
			var tempY = 0;
			for(var i = 0, len = data.length; i < len; i++){

				var t = toCSNum(data[i], bl, csTop, csHeight, csYMin);
				var x = csLeft + csXOneLen*i;	
				
				dataAll.dotsPst.push([x, t]);

				
				if( i === 0){
					ctx.moveTo(x, t);
				}else{
					// ctx.lineTo(x, t);  // 终点
					ctx.arcTo(tempX,tempY,x,t,0);	
				}

				tempX = x;
				tempY = t;
				

				
				
			}

			ctx.arcTo(tempX,tempY,x,t,200);

			if (dataAll.isShow === false) { return; }

			ctx.stroke();

			//填充阴影,面积堆积图时进行填充
			if (this.opts.type === 'stackedAreaChart') {
				ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
				ctx.lineTo(csLeft + csXOneLen*(i - 1), csTop + csHeight);
				ctx.lineTo(csLeft, csTop + csHeight);
				var t = toCSNum(data[0], bl, csTop, csHeight, csYMin);
				ctx.lineTo(csLeft, t);
				ctx.stroke();
				ctx.fill();
			}

			
		}

		// 根据数值、比例、坐标系top值、坐标系高度 ，返回所需的在canvas顶部值和高度值
		function toCSNum(data, bl, t, h, min){

			return t + (h - (data-min)*bl);
			
		}
	}



	// 绘制坐标
	linepproto.drawCS = function(){
		var opts = this.opts;
		var ctx = this.ctx;
		var series = this.series;

		var style = this.opts.style;

		this.cs = {};
		var csLeft = this.cs.csLeft = this.content.conLeft + this.opts.style.csYTxtLen;
		var csTop = this.cs.csTop = this.content.conTop + 10;
		var csWidth = this.cs.csWidth = this.content.conWidth - this.opts.style.csYTxtLen;
		var csHeight = this.cs.csHeight = this.content.conHeight - this.opts.style.csXTxtLen - 10;
		

		var csXLen = opts.xAxis.length - 1;  // 横坐标需要绘制多少个值,根据数组长度决定



		// 绘制坐标系,data为传进来的数据数组
		
		var style = this.opts.style;



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

				ctx.fillText(xAxis[i], csLeft + csXOneLen*i , ft);  // 内容 起始位置 
				
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

			ctx.fillText(yAxis[j], csLeft + style.csYfontLeft , csTop + csYOneLenCanvas*j + style.csYfontTop );  // 内容 起始位置 
			
		}
		ctx.stroke();



		
		// 横坐标横线绘制,最后绘制防止覆盖
		ctx.beginPath();

		ctx.strokeStyle = style.csXLineColor;
		ctx.lineWidth = style.csXlineWidth;  // 线条宽度

		ctx.moveTo(csLeft , csTop + csHeight);  // 起始点，移动画笔到(0, 0)
		ctx.lineTo(csLeft + csWidth,  csTop + csHeight);  
		ctx.stroke();

		

	}


	linepproto.drawMain = function(){

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
	linepproto.reflow = function(opts){

		this.series = opts.series || this.series;
		this.xAxis = opts.xAxis || this.xAxis;

		this.drawMain();


		return this;

	}


	/**
	 * 特效，绘制圆点
	 * @param  {Object} obj series数组中的某一个
	 */
	linepproto.drawMoveChange = function(obj){

		if (!obj) {return;}

		this.showOriginal();

		var r = 3;  // 圆点半径
		var borderWidth = 2;  // 圆点边框 
		var fillColor = '#fff';  // 边框颜色

		var ctx = this.ctx;
		
		ctx.lineWidth = borderWidth;
		ctx.fillStyle = fillColor;
		ctx.strokeStyle = obj.color[0];

		var dotsPst = obj.dotsPst;
		for (var i = 0, len = dotsPst.length; i < len; i++) {
			ctx.beginPath();
			ctx.arc(dotsPst[i][0],dotsPst[i][1],r,0,2*Math.PI);
			ctx.stroke();
			ctx.fill();
		}

	}

	// 鼠标移动到主体区域时,绘制虚线、竖线、相关信息
	linepproto.moveToContent = function(cx, cy){
		
		var cs = this.cs;		
		var ctx = this.ctx;	
		var _this = this;
		
		 
		// 进入坐标轴内区域
		if (cx > cs.csLeft && cx < cs.csLeft + cs.csWidth && cy > cs.csTop && cy < cs.csTop + cs.csHeight) {
			this.showOriginal();
			this.isShowOriginal = false;

			drawHorizontalLine();

			drawHorizontalDimension();

			

			// 判断鼠标目前在哪个区域内，以x轴为标准
			var csXOneLen = this.cs.csXOneLen;
			var thisI ;
			for (var i = 0; i < this.xAxis.length; i++) {

				if (cx > cs.csLeft + i*csXOneLen -csXOneLen/2 && cx <= cs.csLeft + i*csXOneLen+ csXOneLen/2) {
					thisI = i;
				}
			}
			
			if (typeof thisI !== 'undefined') {
				drawVerticalLine(thisI);
				drawDots(this.xDotsPst[thisI]);
				drawVerticalInfo(thisI);
			}
			






		// 移出坐标轴区域内
		}else{
			if (!this.isShowOriginal) {
				this.showOriginal();
				this.isShowOriginal = true;
			}
			
		}


		// 绘制横向虚线
		function drawHorizontalLine(){
			ctx.beginPath();
			ctx.strokeStyle = '#aaa';

			var sl = 5;  // 横线为虚线，每个小虚线的长度
			var len = Math.floor(cs.csWidth/sl/2);

			
			for (var i = 0; i < len; i++) {
				ctx.moveTo(cs.csLeft + sl*i*2, cy );
				ctx.lineTo(cs.csLeft + sl*i*2 + sl, cy);
			}

			if (cs.csLeft + sl*i*2  < cs.csLeft + cs.csWidth) {
				ctx.moveTo(cs.csLeft + sl*i*2, cy );
				ctx.lineTo(cs.csLeft + cs.csWidth, cy);
			}
			ctx.shadowBlur = 0;
			ctx.stroke();
		}



		// 绘制横向标注
		function drawHorizontalDimension(){

			var fontSize = 12;
			var span = 5;  // 数值左右留的边距
			var boxColor = '#6A7985';

			ctx.font = fontSize + 'px Arial'
			ctx.strokeStyle = boxColor;  // 字体背景颜色
			ctx.fillStyle = boxColor;  

			var fixLen = -1;  // 精确到截取的位数
			if (_this.cs.csYOneLen < 1) {
				fixLen = _this.cs.csYOneLen.toString().length -1;
			}else{
				fixLen = 1;
			}

			var trueValue = (cs.csYMin + (cs.csHeight-(cy - cs.csTop))/_this.bl).toFixed(fixLen);  // 侧边的数值
			var trueValueLen = ctx.measureText(trueValue).width ; // 侧边数值的宽度
			var boxW = trueValueLen + span*2;  // 侧边数值背景的宽度
			var boxH = fontSize + span;

			ctx.beginPath();
			ctx.rect(cs.csLeft - boxW , cy - boxH/2, boxW, boxH);
			ctx.stroke();
			ctx.fill();


			ctx.fillStyle = '#FFF';  // 字体颜色
			ctx.textAlign = 'end';
			ctx.fillText(trueValue, cs.csLeft - span, cy + fontSize/2);

		}



		// 绘制小圆点
		// dots应该为一个二维数组[[x1, y1, color1],[x2, y2, color2]]
		function drawDots(dotsPst){
			var r = 3;  // 圆点半径
			
			ctx.fillStyle = '#fff';
			for (var i = 0, len = dotsPst.length; i < len; i++) {
				
				ctx.strokeStyle = dotsPst[i][2];
				ctx.beginPath();
				ctx.arc(dotsPst[i][0],dotsPst[i][1],r,0,2*Math.PI);
				ctx.stroke();
				ctx.fill();
			}

		}


		// 绘制纵向直线
		function drawVerticalLine(i){
			var csXOneLen = _this.cs.csXOneLen;

			ctx.strokeStyle = '#ababab';
			ctx.beginPath();
			ctx.moveTo(cs.csLeft + csXOneLen*i, cs.csTop );
			ctx.lineTo(cs.csLeft + csXOneLen*i, cs.csTop + cs.csHeight);
			ctx.stroke();
		}





 
		// 绘制纵向直线上的标注
		function drawVerticalInfo(i){
			var fontSize = 12;
			var span = 5;  // 数值左右留的边距
			var boxColor = '#6A7985';


			var x = cs.csLeft + cs.csXOneLen*i;
			var y = cs.csTop + cs.csHeight + 6;

			ctx.beginPath();
			ctx.font = fontSize + 'px Arial'
			ctx.strokeStyle = boxColor;  // 字体背景颜色
			ctx.fillStyle = boxColor;  
			var text = _this.xAxis[i];  // 侧边的数值
			var textLen = ctx.measureText(text).width ; // 侧边数值的宽度
			var boxW = textLen + span*2;  // 侧边数值背景的宽度
			var boxH = fontSize + span;
			ctx.rect(x - boxW/2 , y, boxW, boxH);
			ctx.stroke();
			ctx.fill();

			ctx.fillStyle = '#FFF';  // 字体颜色
			ctx.textAlign = 'center';
			ctx.fillText(text, x, y + fontSize +span/2);
		}


	}


	// 存储x轴相对应个个点的信息
	linepproto.saveXDotsPsInfo = function(){

		var series = this.series;
		var xDotsPst = this.xDotsPst = [];
		for (var m = 0, len3 = this.xAxis.length; m < len3; m++) {
			xDotsPst[m] = [];
		}


		for (var i = 0, len = series.length; i < len; i++) {
			var dotsPst = series[i].dotsPst;
			var color = series[i].color[0];
			for (var j = 0, len2 = dotsPst.length; j < len2; j++) {
				xDotsPst[j][i] = dotsPst[j];
				xDotsPst[j][i].push(color);
			}
		}


	}


	linepproto.publicFn = {

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


	}




	// 初始化的参数变量
	LineChartsParent.DEFAULTS = {
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
			text: '图表',
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
	linepproto.extendOpts = function(){
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
		this.opts.style = this.publicFn.extendObj( LineChartsParent.DEFAULTS.style, this.opts.style);


		// 标题信息
		if (opts.title) {
			this.title = this.publicFn.extendObj( LineChartsParent.DEFAULTS.title, this.opts.title);
		}else{
			this.title.isShow = false;
		}


	}

/*	return LineChartsParent;
})*/





module.exports = LineChartsParent;


