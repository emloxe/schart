



var ChartsParent = require('./chartsParent');
var LineChartsParent = require('./lineChartsParent');

/*
define(['chartsParent', 'lineChartsParent'], function(ChartsParent, LineChartsParent){
*/
	function StackedAreaChart(opts) {
		this.opts = opts;
		this.ctx = opts.dom.getContext("2d");
		this.ctx.translate(0.5,0.5);  // 使1px线变细
		this.init();
		
	}
	
	var stackproto = StackedAreaChart.prototype = new LineChartsParent;


	// 计算相关的比例
	stackproto.countBl = function(){
		
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



	// 进行第一次计算
	stackproto.firstCalculate = function(){

		this.paddingLR = 20 ;  // 设定左右留白区域

		var series = this.series;

		// 初始化series[i]全部为isShow = true
		// this.initializationIsShowData(series);

		// 备份series中data
		this.dataBackUp();



		this.bindColor(series);	


		// 适配处理数据
		this.dataAdapter();

	}




	// 数组格式适配，数组排序为从大到小排列
	stackproto.dataAdapter = function(){
		var series = this.series;

		// 计算和并排序数组
		// stackproto.publicFn.sumData(series);
		// stackproto.publicFn.sortData(series);
		this.series = stackproto.publicFn.spData(this.series);

		
	}


	stackproto.clickFlow = function(){

		this.ctx.clearRect(0, 0, this.width, this.height);

		// 重新计算
		stackproto.publicFn.restoreData(this.series);
		this.series = stackproto.publicFn.spData(this.series);




		this.drawTitle();
		this.drawCutLine();
		this.drawContent();
		this.saveOriginal();
	}




	stackproto.publicFn = {

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


		/** 将数据转化为叠加模式
		 * @param  {Array} series形如 [{
		            name:'邮件营销',
		            data:[ 194, 290, 430, 310, 320, 342, 370]
		        },
		        {
		            name:'联盟广告',
		            data:[ 191, 234, 290, 330, 310, 250, 300]
		        }]
		 * @return {Array}  返回数据格式与传入格式相同，但data值为累计叠加
		 */
		spData: function (series){
			var newData = JSON.parse(JSON.stringify(series));  // 克隆一个对象 

			var arr = [];

			for (var len = series.length - 1, i = len; i > 0; i--) {
				if (i == len) {
					arr = series[len]['data'];
				}
				var arrPre = series[i-1]['data'];
				var sArr = [];

				for (var j = 0, lenj = arr.length; j < lenj; j++) {
				 	sArr.push(arr[j]+arrPre[j]);
				} 
				newData[i-1]['data'] = sArr;
				arr = sArr; 
			}
			return newData;

		},
		/**
		 * 计算数据的和
		 * @param  {Arrage} series 
		 * @return {Arrage} 无会改变当前数组的值
		 */
		sumData: function(series){
			for (var i = 0, len = series.length; i < len; i++) {
				var sum = series[i].data.reduce(function(total, num){
					return total + num;
				});
				series[i].sum = sum;
			}

		},
		/**
		 * 排序数组
		 * @param  {Arrage} series 
		 * @return {Arrage} 无返回值在原数组上进行排序
		 */
		sortData: function(series){

			series.sort(function(a, b){
				return a.sum - b.sum;
			});

		}

	}

/*	return StackedAreaChart;
});*/



module.exports = StackedAreaChart;


