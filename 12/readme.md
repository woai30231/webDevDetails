## 前言

* 之前有写过关于浏览器中关于js线程的文档，请移步[这里](https://github.com/woai30231/javascriptThreadStudy)查看！但觉得偏过于技术化了，对于实际理解意义不大，所以想乘此机会用一种大家都能懂的话语方式来记录一下自己对**浏览器中js线程**的理解，以及建立在此基础一些优化方案！

* 这篇文档不是技术文档，只是力求把相关概念用最土的话说清楚！

* 因为这部分技术在我看来是前端理解性能的高级话题了！所以我不敢保证我写的会很好，亦不敢保证能一定带给你实质性的超越。我唯恐自己经验、理解有限，难免会有表达出错的地方！所以欢迎你们[issue](https://github.com/woai30231/webDevDetails/issues)，我们一切来参与起来把这个话题向更好的方向完善！

### 什么是线程？

* 对于这个问题，我想没有一定的工作阅历沉淀或者相关专业方面的学习，恐怕难以叙述清除这个术语了！你要把这个问题问我，估计我也很难回答上来！但又如何？对于搞开发这种需要实际干事的工作来说，恐怕只是让你正确把一个专业术语表达出来，恐怕对你的工作没有多大意义！我们只要知道这个东西是干嘛的就行了！至于怎么把这个术语表达清楚，那是专门干这行的人的工作！好了，首先还是允许我把从搜索引擎上搜到的线程的描述粘贴在下面：

> 线程是程序中一个单一的顺序控制流程。进程内一个相对独立的、可调度的执行单元，是系统独立调度和分派CPU的基本单位指运行中的程序的调度单位。

* 从上面的描述中大概知道了几个关键点：计算机给线程单独分派的空间、独立的单元、可执行的执行单元及顺序控制流程！按我的理解就是“一个独立的程序顺序执行空间”！

* 如果做个比喻的话：线程就好比一个人去开公司，注册公司、运营、销售、推广都是他一个人在干，而且是按照一定的顺序干，比如需要先要有项目、再找供应商、等项目成熟了，再注册公司，最后一步一步做大！这个顺序都是最开始企划好的！这些话换到浏览器里就是：我们写的脚本只有一个执行单元来管理代码，并且按我们写代码的顺序依次执行代码。看下面代码例子：

```javascript
	var a = 'a';
	var b = 'b';
	console.log(a);
	console.log(b);
	//因为打印a的操作在前面，而打印b的操作在后面，那么打印a的代码先执行，而打印b的操作后执行
```

* 顺便说一下多线程呗，顾名思义就是多个单线程一起来管理我们的代码，比如上面那个开公司的例子，老板等公司做大了之后，他终于明白了：他一个人再牛、再能干，可是公司大到一定程度，他一个人是忙不过来的，即便他一个人能省一笔很大的请工人所带来的薪水开销！于是他确定聘请工人来帮他工作，于是大家一起努力，共同把公司做得更大，这里每个工人就相当于一个线程！

* 多线程和单线程的区别：还是拿前面开公司的例子来说明，一个人（单线程）做的时候，自己想怎么做就怎么做，不用怕影响别人，而且消耗的社会资源（吃喝拉撒）也少，因为一个人再消耗也消耗不到哪里去！而且还能省下很多费用（工人费用等），但是问题公司怎么做都做不大，做来做去还是一个小作坊，不能充分利用工人闲散资源来扩展公司等！多个人（多线程）一起工作的时候，效率提高了，但同时社会资源开销也大了，而且老板还要拿出一笔很大的费用来支付工人的工作，要不然老板估计的日子不好过！从这里我们作如下结论：

> 单线程：优点是简单、占用资源少，缺点就是不能有效利用资源，比如多核cpu等，不适用那种复杂的业务场景

> 多线程：优点是快速、充分利用资源，缺点是资源消耗大，容易造成让你的电脑死机等！

* 这样理解是不是就能很好理解线程了呢，**其实现实中很多道理是想通的**！

### 为什么浏览器是单线程的？

* 如果需要回答这个问题，我们首先需要知道浏览器的工作原理！浏览器在得到你的html之后，解析文档首先得到dom tree，然后解析css得到render tree。最后在通过js实现控制页面的显示、交互等！类似这种工作步骤就注定了浏览器里面的js不能是多线程的，为什么呢！试想一下如果是多线程的话：浏览器一边解析得到dom tree，一边又解析得到css tree，然后绘制页面，假如此时dom tree还没有完全解析得到，或者css tree没有完全解析完成，那么此时绘制页面会不会乱套？又或是一个还没有绘制完成的元素用实现某些逻辑会不会有问题？这些都是限制浏览器中js不能使用多线程的原因！

### 浏览器通过事件队列来实现处理异步逻辑

* 浏览器中js确实是单线程的，但是浏览器是怎么响应某个按钮的点击处理或者在将来某个时间执行特定脚本呢！这里就要提到时间队列了，这是个什么概念呢！按我自己的理解就是：浏览器给脚本又单独分配了一个线程，这里确实是多线程！只不过是浏览器宿主环境提供的，用来处理将来js中异步需要执行的代码或处理某些事件的回调！为什么叫队列呢！人家都叫队列了，说明这些异步脚本不是随便放进去的，而是按照一种方式有序地排在里面的！看下面的代码：

```html
	<!doctype html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<title>demo</title>
		</head>
		<body>
			<button id="demo">点击</button>
			<script type="text/javascript">
				window.onload = function(){
					var btn = document.getElementById('demo');
					setTimeout(function(){
						console.log('10之后');
					},10000);
					setTimeout(function(){
						console.log('5秒之后');
					},5000);
					btn.onclick = function(){
						console.log('btn');
					};//我们在打开页面大概5秒到10秒的时候点击button（说明一下，并不是准确的，只是方便举例）
					//我们发现先打印‘5秒之后’，再打印‘btn’，最后打印‘10秒之后’
				};
			</script>
		</body>
	</html>
```

上面的打印顺序说明异步代码是一种顺序（先来后到）在事件队列里面排序的！将来触发事件的时候总是以这样一个顺序去查找相应的代码然后执行之！

### 从单线程的角度出发怎么提升浏览器性能

* 前面的分析得知，单线程就是一个人在工作，所以你就不要一下子给很多工作给他做，比如给他本来是多个人（多线程）做的工作，这样即时能做，估计浏览器也会很卡，或者假死或卡死！实际上页面场景中这样的工作包括更新dom、监听某种滚动、resize事件回调处理等！我们来看一个例子，我们需要用是js实现渲染一个2万行6列的表格，我们首先不做代码优化，看下效果会怎么样，代码如下：

```javascript
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8"/>
		<title>渲染table测试</title>
		<style type="text/css">
			*{
				margin: 0px;
				padding: 0px;
			}
			.container{
				width: 1000px;
				margin: 0px auto;
				font-size: 14px;
				text-align: center;
				color: #000;
			}
			table{
				border-spacing: 0px;
				width: 100%;
				line-height: 1.5em;
			}
		</style>
	</head>
	<body>
		<div id="box" class="container"></div>
		<script type="text/javascript">
			window.onload = function(){
				var boxDom = document.getElementById('box');
				var cTable = document.createElement('table');
				var index = 0;//单元格索引，从0开始
				for(var i = 0;i<20000;i++){
					var tr = document.createElement('tr');
					for(var j= 0;j<6;j++){
						var td = document.createElement('td');
						td.innerHTML = index;
						tr.appendChild(td);
						index++;
					};
					cTable.appendChild(tr);
				};
				boxDom.appendChild(cTable);
			};
		</script>
	</body>
	</html>
```

* 我们在浏览器中看到实际效果：浏览器等待了一段时间才渲染出来，在此期间浏览器像是被卡主了一样什么都不能做！好，我们对上面的代码做一个优化，使其分几步完成上面的需求，这样每次要做的事情就不会太多了！代码如下：

```html
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8"/>
		<title>渲染table测试</title>
		<style type="text/css">
			*{
				margin: 0px;
				padding: 0px;
			}
			.container{
				width: 1000px;
				margin: 0px auto;
				font-size: 14px;
				text-align: center;
				color: #000;
			}
			table{
				border-spacing: 0px;
				width: 100%;
				line-height: 1.5em;
			}
		</style>
	</head>
	<body>
		<div id="box" class="container"></div>
		<script type="text/javascript">
			window.onload = function(){
				var boxDom = document.getElementById('box');
				var cTable = document.createElement('table');
				var index = 0;//单元格索引，从0开始
				//这次我们分5步来完成上面的任务，其实也可以分更多步
				var oneStepNum = 4000;
				var currentStep = 1;
				var renderTable = function renderTable(){
					for(var i = 0;i<oneStepNum;i++){
						var tr = document.createElement('tr');
						for(var j = 0;j<6;j++){
							var td = document.createElement('td');
							td.innerHTML = index;
							tr.appendChild(td);
							index++;
						};
						cTable.appendChild(tr);
					};
					boxDom.appendChild(cTable);
					currentStep++;
					if(currentStep>5){
						clearTimeout(timer);
						return;
					};
					var timer = setTimeout(renderTable,0);
				};
				renderTable();//渲染dom
			};
		</script>
	</body>
	</html>
```

* 我们发现代码经过这样优化之后，是不是dom很快就被渲染出来了呢！其思想就是：把一个很耗性能的操作或长时间的操作分解成一些耗性能较少或这耗时少的操作，并善于利用setTimeout用来分解一些操作，就不会造成耗时长的代码使浏览器卡死的情况了！而且能快速的把页面呈现在用户面前！

* 其实很多优化代码都是采用这种原理做的，比如防抖等！

### 今天就写到这里，后续有什么新的想法再加上来，或者你也可以[issue](https://github.com/woai30231/webDevDetails/issues)上来……