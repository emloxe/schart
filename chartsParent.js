/*define(function(){*/
	function ChartsParent(){
	}

	var chartsproto = ChartsParent.prototype;


	chartsproto.init = function(){

		this.extendOpts();

		this.firstCalculate();

		this.drawMain();	

		this.listenWindow();

		this.addListenDynamic();

		this.addListenClick();
	};


	chartsproto.extendOpts = function(){
		throw new Error('子类必须重写 extendOpts');
	};



	chartsproto.drawMain = function(){
		throw new Error('子类必须重写 drawMain');
	};


	// 添加事件监听
	chartsproto.listenWindow = function(){
		var dom = this.dom;
		var c = 10; // 当元素宽度改变超过10时重绘
		var _this = this;

		window.addEventListener('resize', function(){
			if (_this.opts.dom.width !== this.width) {
				_this.drawMain();
				_this.saveOriginal();
			}
			
		})		

	}


	// 绘制标题
	chartsproto.drawTitle = function(){
		var opts = this.opts;
		var ctx = this.ctx;
		var width = this.width;
		var height = this.height;

		this.titleNeedH = 10;



		// 绘制标题


			var title = this.title;
			var font = title.font;
			var fontSize = title.fontSize = font.slice(0, 2); // 将标题的字体大小传出去

			ctx.font = font;
			ctx.fillStyle = title.color;
			ctx.textAlign = "start";

			ctx.beginPath();

			var paddingLR = this.paddingLR;
			var draw ;
			var tLen = ctx.measureText(title.text).width;
			var tLeft ;
			switch(title.position)
			{
			    case 'center':
			    	tLeft = Math.floor((width-tLen)/2) - 5;     // 减5的目的是为了人的视觉差，更感觉居中
			        break;
			    case 'left':
			        tLeft = paddingLR;
			        break;
			    case 'right':
			    	tLeft = Math.floor(width - paddingLR);
			    	ctx.textAlign = "right";
			        break;
			}
			ctx.fillText(title.text, tLeft, fontSize*1.5);  // 内容 起始位置 
			this.titleNeedH = Math.floor(fontSize*2); // 将titleNeedH外传，预留头部的位置

	}


	// 绘制图例信息
	chartsproto.drawCutLine = function(){

		var title = this.title;
		var cutLine = this.cutLine = this.opts.cutLine;
		var ctx = this.ctx;	
		var arr = this.series;
		var width = this.width;
		var height = this.height;



		if (!cutLine) {
			cutLine = this.cutLine = {}
		}
		var pst = cutLine.position ? cutLine.position : 'bottom';  // 图例的位置
		this.cutLine.position = pst;


		/***********  外部目前不可修改  ***********/
		var maxHeightPer = 0.8;
		var boxW = 10;  // 小区块的宽
		var boxH = 6;   // 小区块的高
		var boxMargin  = 3;  // 小区块右的留白
		var space = 10;  // 每个信息间间距
		var minTextW = 60;  // 最小文本宽度 
		var maxTextW = 100;  // 最小文本宽度
		var needLen = this.cutLine.needLen = 1;  // 需要的行数，默认为1
		var fontSize = this.cutLine.fontSize = 12;
		var fontColor = '#000';
		/****************************************/

		ctx.font = fontSize + 'px Arial';

		var len = arr.length;  // 需要绘制的个数
		var canW = width - this.paddingLR*2;  // 可以占据的宽度
		var canH = height - this.titleNeedH;  // 可以占据的高度


		var cutLineNeedH = this.cutLineNeedH = 10;
		var cutLineNeedW = this.cutLineNeedW = (minTextW + boxW + boxMargin) + this.paddingLR;  // 当前预留的宽度为最小宽度+左边距

		if(pst === 'bottom' || pst === 'top'){
			tb.call(this);
		}else if(pst === 'right' || pst === 'left'){
			lr.call(this);
		}

		function tb(){
			var allCxtLength = 0;  // 最终的总文本长度
			var needAllLen = 0;  // 总文本长度+图例小方块宽度边距以及间距
			var drawNum = 0;  // 所需绘制的个数
			var arrLen = arr.length;

			// 将截取文本和截取后的文本长度传入数组，并且获得最终的总文本长度
			for (var i = 0; i < arrLen; i++) {
				var str = arr[i]['name'];
				if (ctx.measureText(str).width > maxTextW) {
					str = arr[i]['cutName'] = cutString(str, maxTextW);
				}else{
					arr[i]['cutName'] = str;
				} 

				var ctxLen = Math.floor(ctx.measureText(str).width);
				arr[i]['ctxLen'] = ctxLen;
				allCxtLength += ctxLen;
				
			}
			

			needAllLen = allCxtLength + arrLen*(boxMargin + boxW) + (arrLen-1)*space;
			drawNum = arrLen;

			// 判断坐标左边预留的是否有位置
			if (typeof this.opts.style === 'undefined') {
				this.opts.style = {}
			}
			var style = this.opts.style;
			if(typeof style.csYTxtLen === 'undefined'){
				style.csYTxtLen = 0;
			}

			// 判断需要绘制几行，最大为两行	
			if(needAllLen > canW - style.csYTxtLen){  // 需要绘制两行
				canW = canW - style.csYTxtLen;
				needLen = this.cutLine.needLen  = 2;
				this.cutLineNeedH = 3*fontSize;  // 设置其预留的高度
				var firstNum = getOneLenNum(0, canW, 1);  // 获取一行可以排几个图例信息,2为定位的高度
				var secondNum = getOneLenNum(firstNum, canW, 2.5);

				this.cutLine.firstNum = firstNum;  // 第一排可放个数
				this.cutLine.secondNum = secondNum;  // 第一排可放个数
				drawNum = firstNum + secondNum;

			}else{
				canW = needAllLen;
				this.cutLineNeedH = 2*fontSize;
				getOneLenNum(0, needAllLen+1, 1);
			}

			var outTop = 0;  // 计算外部的高度
			var outLeft = 0;
			if (needLen === 2) {
				outLeft = Math.floor(this.paddingLR + style.csYTxtLen);
			}else{
				outLeft = Math.floor((width - canW)/2);
			}
			
			if (pst === 'top') {
				outTop = this.titleNeedH;
			}else{

				outTop = height - this.cutLineNeedH;
			}
			this.cutLine.outTop = outTop;
			this.cutLine.outLeft = outLeft;
			setPostionTB(arr, outTop, outLeft);


			// 绘制
			ctx.font = fontSize +'px Arial';
			ctx.textAlign = "start";

			for (var i = 0; i < drawNum; i++) {
				var pstAbsolute = arr[i]['cutLinePst'];

				ctx.beginPath();

				if (arr[i].isShow) {
					ctx.fillStyle= arr[i]['color'][0];
				}else{
					ctx.fillStyle= '#ccc';
				}
								
				ctx.rect(pstAbsolute['boxLeftA'] , pstAbsolute['boxTopA'] , boxW, boxH);
				ctx.fill();
				ctx.beginPath();
				if (arr[i].isShow) {
					ctx.fillStyle = fontColor;
				}else{
					ctx.fillStyle = '#ccc';
				}
				
				ctx.fillText(arr[i]['cutName'], pstAbsolute['textLeftA'], pstAbsolute['textTopA']);
		
			}	

		}


		function lr(){

			var sTop = this.titleNeedH; // 默认绘制的起始位置

			var thisH = len*(fontSize + boxMargin*2) - boxMargin*2; // 所需的总共高度


			// 如果所需高度大于可放置内容的高度
			var showLen = len; // 需要绘制的长度
			if (thisH > canH) {
				showLen = Math.floor(canH/(fontSize + boxMargin*2));
				var showLenL = showLen*(fontSize + boxMargin*2) + fontSize; // 再加一排的高度 
				if (showLenL <= canH) {
					showLen ++;
				}
			}else{
				sTop = Math.floor((height - thisH)/2) + this.titleNeedH;
			}


			var picW = minTextW;
			if(width*0.1 > cutLineNeedW){
				cutLineNeedW = this.cutLineNeedW = width*0.2;
				picW = cutLineNeedW - this.paddingLR - boxMargin - boxW;

			}


			// 如果文本过长，截取内容
			for (var i = 0; i < len; i++) {

				var txt = arr[i]['name'];
				var thisLen = Math.floor(ctx.measureText(txt).width);

				if (thisLen > picW) {

					arr[i]['cutName'] = cutString(txt, picW)
					change = 1;
				}else{
					arr[i]['cutName'] = txt;
				}

				arr[i]['ctxLen'] = 	Math.floor(ctx.measureText(arr[i]['cutName']).width);
			}


			var sLeft = this.paddingLR;
			if (pst === 'right') {
				sLeft = Math.floor(width - cutLineNeedW);
			}

			// 将起始绘制的位置传出
			this.cutLine.outLeft = sLeft;
			this.cutLine.outTop = sTop;
			this.cutLine.W = picW + boxMargin + boxW;  // 总体图例的宽度
			this.cutLine.showLen = showLen;


			setPostionLF(arr, sTop, sLeft);
			
			// 绘制
			ctx.font = fontSize + 'px Arial';
			for (var i = 0; i < len; i++) {

				var pstAbsolute = arr[i]['cutLinePst'];

				ctx.beginPath();

				if (arr[i].isShow) {
					ctx.fillStyle= arr[i]['color'][0];
				}else{
					ctx.fillStyle= '#ccc';
				}


				ctx.rect(pstAbsolute['boxLeftA'] , pstAbsolute['boxTopA'] , boxW, boxH);
				ctx.fill();
				ctx.beginPath();

				if (arr[i].isShow) {
					ctx.fillStyle = fontColor;
				}else{
					ctx.fillStyle= '#ccc';
				}

				ctx.fillText(arr[i]['cutName'], pstAbsolute['textLeftA'], pstAbsolute['textTopA'])
				


			}
		}

		/**
		 * 返回一行可以排几个图例信息，并将每个的位置信息写入数组中的对象
		 * @param  {number} start 起始计算的位置
		 * @param  {number} width 可以放置的长度
		 * @return {number}       可以放置的个数
		 */
		function getOneLenNum(start, width, n){
			var num = 0;  // 返回的可以放置的个数
			var lenSum = 0;

			for (var i = start, arrLen = arr.length; i < arrLen; i++) {

				var pst = arr[i]['cutLinePst'] = {};
				pst['textTop'] = fontSize*n;
				pst['boxTop'] = fontSize*(n - 0.5) - boxH/2 + 1;
				pst['boxLeft'] = lenSum;
				pst['textLeft'] = boxW + boxMargin + lenSum; 

				lenSum += arr[i]['ctxLen'] + boxW + boxMargin + space;

				if (lenSum > width) {
					num = i - start;
					break;				
				}else{
					num = arrLen - start;				
				}
				
			}

			return num;
		}

		/**
		 * 设置在canvas画布上的绝对定位
		 * @param {Arrage} arr [description]
		 * @param {Number} top    开始绘制图例区域的距canvas画布top的位置
		 * @param {Number} left   开始绘制图例区域的距canvas画布left的位置
		 */
		function setPostionTB(arr, top, left){
			for (var i = 0, arrLen = arr.length; i < arrLen; i++) {

				var pst = arr[i]['cutLinePst'];
				pst['textTopA'] = pst['textTop'] + top;
				pst['boxTopA'] = pst['boxTop'] + top;
				pst['boxLeftA'] = pst['boxLeft'] + left;
				pst['textLeftA'] = pst['textLeft'] + left; 
				
			}
		}

		function setPostionLF(arr, top, left){
			for (var i = 0, arrLen = arr.length; i < arrLen; i++) {

				var pst = arr[i]['cutLinePst'] = {};
				pst['textTopA'] = fontSize*i + boxMargin*2*(i-1) + top; // 两个文本间距为2个boxMargin
				pst['boxTopA'] = fontSize*i + boxMargin*2*(i-1) - fontSize/2 - boxH/2 + top + 2;
				pst['boxLeftA'] = left;
				pst['textLeftA'] = boxW + boxMargin + left; 
				
			}
		}
		function getOneTextMaxW(len){
			var num = Math.floor((canW - space*(len - 1))/len)-boxW-boxMargin;  // 每个文本最大距离
			return num;
		}  

		// 	判断数据是否需要截取,返回截取后的数据
		function cutString(str, maxL){
			
			var i = 1;
			var w = ctx.measureText(str.slice(0, 1)).width;
			while(w < maxL){

				var newStr = str.slice(0, i);
				i++;
				w = ctx.measureText(newStr).width;
			}

			rStr = str.slice(0, i-2) + '..';

			return rStr;
		}

	}



	// 确定主体的绘制区域
	chartsproto.confirmContentRegion = function(){

		// 	确定需要给坐标预留的空间
		var cutLine = this.cutLine;
		var title = this.title;
		var picPst = cutLine.position;
		var width = this.width;
		var height = this.height;

		var titleNeedH = this.titleNeedH;
		var cutLineNeedH = this.cutLineNeedH;
		var cutLineNeedW = this.cutLineNeedW;
		var paddingLR = this.paddingLR;

		var content = this.content = {};
	 	content.conTop = titleNeedH;
	 	content.conHeight = titleNeedH;
		if (picPst === 'left' || picPst === 'right') {
			content.conHeight = height - titleNeedH;
			content.conWidth = width - paddingLR*2 - cutLineNeedW;

			if (picPst === 'left') {			
				content.conLeft = paddingLR + cutLineNeedW ;			
			}else{
				content.conLeft = paddingLR;
			}


		}else if(picPst === 'top' || picPst === 'bottom'){
			
			content.conHeight = height - titleNeedH - cutLineNeedH;
			content.conWidth = width - paddingLR*2;
			content.conLeft = paddingLR;

			if (picPst === 'top') {
				content.conTop = titleNeedH + cutLineNeedH;
			}else{
				content.conTop = titleNeedH;
			}
			
		}


	}


	chartsproto.chartInit = function(){


		this.drawTitle();

		this.drawCutLine();

		this.confirmContentRegion();

		this.drawContent();

	}


	// 添加监听鼠标移动的特效动效
	chartsproto.addListenDynamic = function(){


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

				var pst = _this.cutLine.position;
				var series = _this.series;


				
				// 区域分为两部分判断,图例左右显示
				if ( pst === 'left' || pst === 'right') {


					if (cx > _this.cutLine.outLeft && cx < _this.cutLine.outLeft + _this.cutLine.W) {

						analyzingConditionsAreaY(_this.cutLine.showLen, _this.cutLine.fontSize);




					// 进入中间主体区域
					}else if (cx > _this.content.conLeft && cx < _this.content.conLeft + _this.content.conWidth){
						


						if (isShowDots) {
							// console.log('第一次清除');
							_this.showOriginal();
							isShowDots = false;
							isMovein = false;
							_this.opts.dom.style.cursor = 'default';


						}
						_this.moveToContent(cx, cy);
						
					}else {

						if (isShowDots) {
							// console.log('第一次清除');
							_this.showOriginal();
							isShowDots = false;
							isMovein = false;
							_this.opts.dom.style.cursor = 'default';
						}
					}



				// 图例上下显示
				}else {
					if (cy > _this.cutLine.outTop && cy < _this.cutLine.outTop + _this.cutLineNeedH) {


						
						// 图例只有一排
						if (_this.cutLine.needLen === 1) {
							analyzingConditionsAreaX(0, _this.series.length);
						// 图例有两排
						}else if (_this.cutLine.needLen === 2) {
							// 第一排
							if (cy > _this.cutLine.outTop && cy < _this.cutLine.outTop + _this.cutLineNeedH*0.5) {
								analyzingConditionsAreaX(0, _this.cutLine.firstNum)

							// 第二排
							}else if(cy > _this.cutLine.outTop + _this.cutLineNeedH*0.5 && cy < _this.cutLine.outTop + _this.cutLineNeedH){
								analyzingConditionsAreaX(_this.cutLine.firstNum, _this.cutLine.firstNum + _this.cutLine.secondNum)

							}
						}

					}else if (cy > _this.content.conTop && cy < _this.content.conTop + _this.content.conHeight) {
						
						if (isShowDots) {
							// console.log('第一次清除');
							_this.showOriginal();
							isShowDots = false;
							isMovein = false;
							_this.opts.dom.style.cursor = 'default';
						}
						
						_this.moveToContent(cx, cy);
						
					}else{
						if (isShowDots) {
							// onsole.log('第一次清除');
							_this.showOriginal();
							isShowDots = false;
							isMovein = false;
							_this.opts.dom.style.cursor = 'default';

						}

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


	// 添加图例的点击事件
	chartsproto.addListenClick = function(){
		var dom = this.opts.dom;
		var _this = this;
		var series = this.series;



		dom.addEventListener('click', function(e){

			var gbc = dom.getBoundingClientRect();
			var top = gbc.top;
			var left = gbc.left;
			
			var x = e.clientX;
			var y = e.clientY;

			var cx = x - left;
			var cy = y - top;


			var pst = _this.cutLine.position;
			var series = _this.series;
			


			// 区域分为两部分判断,图例左右显示
			if ( pst === 'left' || pst === 'right') {

				if (cx > _this.cutLine.outLeft && cx < _this.cutLine.outLeft + _this.cutLine.W) {

					showAndHideY(_this.cutLine.showLen, _this.cutLine.fontSize);
				
				}


			// 图例上下显示
			}else {
				if (cy > _this.cutLine.outTop && cy < _this.cutLine.outTop + _this.cutLineNeedH) {


					
					// 图例只有一排
					if (_this.cutLine.needLen === 1) {
						showAndHideX(0, _this.series.length);
					// 图例有两排
					}else if (_this.cutLine.needLen === 2) {
						// 第一排
						if (cy > _this.cutLine.outTop && cy < _this.cutLine.outTop + _this.cutLineNeedH*0.5) {
							showAndHideX(0, _this.cutLine.firstNum)

						// 第二排
						}else if(cy > _this.cutLine.outTop + _this.cutLineNeedH*0.5 && cy < _this.cutLine.outTop + _this.cutLineNeedH){
							showAndHideX(_this.cutLine.firstNum, _this.cutLine.firstNum + _this.cutLine.secondNum)

						}
					}

				}
			}


 
			/**
			 * 确定点击的是哪个图例，当图例为横排时
			 * @param {Number} start 起始值
			 * @param {Number} len   当前条件下的一排的个数
			 */
			function showAndHideX(start, len){
				var thisI ;
				var isMovein = false;  // 是否移入了图标

				for (var i = start; i < len; i++) {
					
					if ( cx > series[i].cutLinePst.boxLeftA && cx < series[i].cutLinePst.textLeftA + series[i].ctxLen) {									
						isMovein = true;
						thisI = i;
						
						
					}
				}


				if (isMovein === true) {
					_this.series[thisI].isShow = !series[thisI].isShow;
					_this.clickFlow();
				}

				

			}


			/** 
			 * 确定点击的是哪个图例，当图例为竖排时
			 * @param {Number} len      当前条件下的竖排的个数
			 * @param {Number} fontSize 图例的字体大小
			 */
			function showAndHideY(len, fontSize){
				var thisI ;
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
					_this.series[moveI].isShow = !series[moveI].isShow;

					_this.clickFlow();
				}




			}



		})





		// 返回与原数组长度相同的全为0的数组
		function changeZero(data){
			var arr = [];

			for (var i = 0, len = data.length; i < len; i++) {
				arr.push(0);
			}
			return arr;

		}
	}



	// 初始化series[i]全部为isShow = true
	chartsproto.initializationIsShowData = function(series){

		for (var i = 0, len = series.length; i < len; i++) {
			series[i].isShow = true;

		}
	}



	// 将之前绘制好的图片重新绘制到画板上 
	chartsproto.showOriginal = function(){
		
		this.ctx.clearRect( 0 , 0 , this.width , this.height );
		this.ctx.drawImage(this.newCanvas, 0, 0);		

	}	


	// 保存原始绘制好的图片
	chartsproto.saveOriginal = function(){
		if(!this.newCanvas){
			this.newCanvas = document.createElement('CANVAS'); 
			this.newCtx = this.newCanvas.getContext('2d');

		}
		this.newCanvas.width = this.width;
		this.newCanvas.height = this.height;
		
		var dom = this.opts.dom;

		this.newCtx.drawImage( dom, 0, 0 )

	}


	// 备份data
	chartsproto.dataBackUp = function(){
		var series = this.series;
		for (var i = 0, len = series.length; i < len; i++) {

			series[i].dataBackUp = JSON.parse(JSON.stringify(series[i].data));
			series[i].isShow = true;

		}
	}


	chartsproto.bindColor = function(series){
		var colors = ChartsParent.DEFAULTS.colors;
		while (colors.length < series.length) {
			var makeColor = chartsproto.publicFn.makeColor;
			colors.push(makeColor());
		}
		// 颜色数组不够用
		for(var i = 0, len = series.length; i < len; i++){
			if(!series[i]['color']){
				series[i]['color'] = colors[i];
			}
		}

	}



	chartsproto.publicFn = {
		// 生成随机颜色，返回的数组，数组中有两个颜色值
		makeColor: function(){
			var arr = [];
			var a = Math.floor(Math.random()*256);
			var b = Math.floor(Math.random()*256);
			var c = Math.floor(Math.random()*256);
			var color1 = '#'+ fill2(a.toString(16))+fill2(b.toString(16))+fill2(c.toString(16));
			arr.push(color1)
			var color2 = 'rgba('+a+', '+b+', '+c+', .5)';
			arr.push(color2);

			function fill2(str){
				if (str.length === 1) {
					str = '0'+str;
				}

				return str;
			}
			
			return arr;
		}


	}



	ChartsParent.DEFAULTS = {
		colors: [  // 预定义的颜色信息
			['#35A5ED', 'rgba(53, 165, 237, .5)'], 
			['#D7BB6A', 'rgba(221, 192, 93, .5)'], 
			['#4EC56D', 'rgba(86, 180, 118, .5)'], 
			['#B293E3', 'rgba(193, 157, 235, .5)'],
			['#14446A', 'rgba(20, 60,106, .5)'],
			['#D51a21', 'rgba(213, 26, 33, .5)']
		]


	};




/*	return ChartsParent;
})*/


module.exports = ChartsParent;


