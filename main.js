

require(['schart'], function(schart){
	var cvs =document.getElementById("myCanvas");	

	// 面积堆积图数据
	var data = {
		
		xAxis: ['周一','周二','周三','周四','周五','周六','周日'],
		series:
		[	
			{
	            name:'1邮件营销',
	            data:[ 192, 201, 194, 290, 430, 310, 320]
	        },				
	        {
	            name:'2联盟广告',
	            data:[140, 182, 191, 234, 290, 330, 310]
	        },
	        {
	            name:'3口碑营销',
	            data:[120, 132, 101, 134, 90, 230, 210]
	        },
	        {
	            name:'4邮件营销',
	            data:[176, 200, 243, 100, 120, 130, 140]
	        }/*,
	        {
	            name:'5邮件营销',
	            data:[120, 132, 101, 134, 90, 230, 210]
	        },
	        {
	            name:'6邮件营销',
	            data:[123, 100, 140, 130, 190, 200, 200]
	        },
	        {
	            name:'7邮件营销',
	            data:[123, 100, 140, 130, 190, 200, 200]
	        },
	        {
	            name:'8邮件营销',
	            data:[123, 100, 140, 130, 190, 200, 200]
	        },
	        {
	            name:'9邮件营销',
	            data:[123, 100, 140, 130, 190, 200, 200]
	        }*/


		]
	}
	var data1 = {
		
		xAxis: ['周二','周三','周四','周五','周六','周日','周一'],
		series:
		[
			
	        {
	            name:'邮件营销1',
	            data:[  .02, .01, .02, .04, .03, .03, .03]
	        },
	        {
	            name:'联盟广告12',
	            data:[ .01, .01, .02, .02, .03, .03, .02]
	        },
	        {
	            name:'邮件营销123',
	            data:[ .01, .01, .01, .09, .02, .02, .02]
	        }
		]
	};
	var data2 = {
		
		xAxis: ['周三','周四','周五','周六','周日','周一','周二'],
		series:
		[
			
	        {
	            name:'邮件营销1',
	            data:[ .194, .290, .430, .310, .320, .342, .587]
	        },
	        {
	            name:'联盟广告12',
	            data:[ .191, .234, .290, .330, .310, .250, .300]
	        },
	        {
	            name:'邮件营销123',
	            data:[  0, .134, .90, .230, .210, .220, .240]
	        }
		]
	}
	window.dg = schart({
		dom: cvs,
		type: 'stackedAreaChart',
		title:{
			text: 'stackedAreaChart'
		} ,
		
		xAxis: data.xAxis,
		series: data1.series,
		style: {
			
		},
		grid: {
			csLeftPer: .1
		},
		showXAxis: true,
		cutLine: {
	        position: 'right'
	    }

	});


			
	/*		
	setTimeout(function(){
		dg.reflow(data1);
	}, 2000);

	setTimeout(function(){
		dg.reflow(data2);
	}, 4000);
	*/




	// 数据
	var data3 = {	
		xAxis: ['周一','周二','周三','周四','周五','周六','周日'],		
		series:
		[	
			{
	            name:'1邮件营销',
	            data:192
	        },				
	        {
	            name:'2联盟广告233',
	            data:234
	        },
	        {
	            name:'3口碑营销',
	            data:90
	        },
	        {
	            name:'4邮件营销',
	            data:120
	        },
	        {
	            name:'5邮件营销',
	            data:12
	        }/*,
	        {
	            name:'6邮件营销',
	            data:1000
	        },
	        {
	            name:'7邮件营销',
	            data:12
	        },
	        {
	            name:'8邮件营销',
	            data:12
	        },
	        {
	            name:'9邮件营销',
	            data:12
	        }*/


		]
	}

	// 饼图数据
	var cvs1 =document.getElementById("myCanvas1");	
	schart({
		dom: cvs1,
		type: 'pieChart',
		title:{
			text: 'pieChart'
		} ,
		series: data3.series,
		radius : 0.9,
		cutLine: {
	        position: 'left'
	    }

	});		


	// 折线图
	var cvs2 =document.getElementById("myCanvas2");	
	schart({
		dom: cvs2,
		type: 'lineChart',
		title:{
			text: 'lineChart',
			position: 'center',
			font: '16px Arial',
			isShow: true
		} ,
		
		xAxis: data.xAxis,
		series: data2.series,
		style: {
			
		},
		grid: {
			csLeftPer: .1
		},
		showXAxis: true,
		cutLine: {
	        position: 'top'
	    }
	    
	});



	// 数据
	var data4 = {	
		xAxis: ['周一','周二','周三','周四','周五','周六','周日'],		
		series:
		[	
			{
	            name: '1邮件营销',
	            data: [12, 24, 13, 45, 41, 32, 29]
	        }

		]
	}

	// 简单柱状图
	var cvs3 =document.getElementById("myCanvas3");	
	schart({
		dom: cvs3,
		type: 'simpleColumnChart',
		title:{
			text: 'simpleColumnChart',
			position: 'center',
			font: '16px Arial',
			isShow: true
		} ,
		
		xAxis: data4.xAxis,
		series: data4.series,
		style: {
			
		},
		grid: {
			csLeftPer: .1
		},
		showXAxis: true,
		cutLine: {
	        position: 'top'
	    }
	    
	});



	// 简单堆积柱状图
	var cvs4 = document.getElementById('myCanvas4');
	schart({
		dom: cvs4,
		type: 'simpleStackedColumnChart',
		title:{
			text: 'simpleStackedColumnChart'
		},
		
		xAxis: data.xAxis,
		series: data.series,
		style: {
			
		},
		showXAxis: true,
		cutLine: {
	        position: 'right'
	    }

	});


	// 簇状柱状图
	var cvs5 = document.getElementById('myCanvas5');
	schart({
		dom: cvs5,
		type: 'clusterColumnChart',
		title:{
			text: 'clusterColumnChart'
		} ,
		
		xAxis: data.xAxis,
		series: data.series,
		style: {
			
		},
		showXAxis: true,
		cutLine: {
	        position: 'top'
	    }

	});


	var data6 = {
		
		xAxis: ['周一','周二','周三','周四','周五','周六','周日'],
		series : [
        {
            name:'直接访问',
            data:[320, 332, 301, 334, 390, 330, 320]
        },
        {
            name:'邮件营销',
            stack: '广告',
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'联盟广告',
            stack: '广告',
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'视频广告',
            stack: '广告',
            data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
            name:'百度',
            stack: '搜索引擎',
            data:[120, 232, 201, 134, 290, 230, 320]
        },
        {
            name:'谷歌',
            stack: '搜索引擎',
            data:[420, 532, 301, 434, 490, 630, 520]
        },
        {
            name:'必应',
            stack: '搜索引擎',
            data:[60, 72, 71, 74, 190, 130, 110]
        },
        {
            name:'其他',
            stack: '搜索引擎',
            data:[62, 82, 91, 84, 109, 110, 120]
        }
    ]
	}
	var cvs6 = document.getElementById('myCanvas6');
	schart({
		dom: cvs6,
		type: 'clusterStackedColumnChart',
		title:{
			text: 'clusterStackedColumnChart'
		} ,
		
		xAxis: data6.xAxis,
		series: data6.series,
		style: {
			
		},
		showXAxis: true,
		cutLine: {
	        position: 'top'
	    }

	});

/*	var cvs7 = document.getElementById('myCanvas7');
	schart({
		dom: cvs7,
		type: 'simpleStackedColumnChart',
		title:{
			text: 'simpleStackedColumnChart'
		} ,
		
		xAxis: data.xAxis,
		series: data.series,
		style: {
			
		},
		showXAxis: true,
		cutLine: {
	        position: 'right'
	    }

	});*/


})
