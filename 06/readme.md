## 前言

* 因为之前一直不理解javascript里面回调函数的含义，直到后面用的多了，才慢慢理解怎么使用回调函数！所以今天想把自己对回调函数的理解记录下来加深印象！这篇文档尽量把相关概念说得尽可能简单，所以认认真真看完我相信对怎样理解回调函数还是有一定帮助的！当然了有说的不对的地方，也希望提出意见，让我们一起共同成长！

### 什么是回调函数

* 首先我们把“回调函数”分为两个部分来理解：“回调”和“函数”！作了这样的划分之后，我们可以首先得到一个印象————回调函数本质上是一个普通的javascript函数而已，其实javascript中很多概念它们都是函数另外一种称呼而已，比如闭包什么的！关键看你怎么理解了！再从“回调”上理解，“回调”说明回调函数调用是被动的，颇有点“回头再用”的意思，怎么理解呢！就是一个函数我们定义了之后，我们并不是单独调用它 ，而是把它放到某个“大的函数”里面，等到“大函数”一些“状态”满足之后再来调用回调函数，也就是说回调函数是等着别人来调用它的，它本身是不直接调用自己的！从某种意义上来说，javascript里面所有函数都是回调函数，因为你可以这样理解———所有的函数都是等js文件准备好之后，再调用，它们是“等待着被动调用的”！来看个例子吧：

```javascript
	function a(){
		console.log('a');
	};

	function b(){
		console.log('b');
		a();
	};

	b();//输出b ， a
```

这里a就是一个回调函数，因为它是等待着b函数调用之后在b函数里面调用的！

### 常见的回调函数形式

* 在介绍回调函数的常用形式之前，我们先来说一下javascript里面的函数————首先js函数是一个很强大的概念，得益于函数在javascript中是第一等对象，函数既可以作对象的方法，也可以当作参数传递给其他函数，更可以作为返回值在函数里面返回等等。所以等等，函数可以出现的地方，都有可能是回调函数出现的形式，大致上分为三种吧：

_ 1、作为响应事件的处理函数，如下：

```javascript
	document.body.onclick = function(){
	  alert("this is body");
	};
```

_ 2、作为参数传递给其它函数，如下：

```javascript
	 function inputTwoNumber(x,y,callback){
	 	if(Object.prototype.toString.call(x) !== '[object Number]' || Object.prototype.toString.call(y) !== '[object Number]'){
		 	return;
		 }else{
		 	return callback(x,y);
		};
	};


	inputTwoNumber(3,5,function(num1,num2){
		return num1+num2;
	});//return 8
```

上面，我们在inputTwoNumber的第三个参数上传递了一个匿名函数实现回调，其实我们我们也可以按下面的方式，性质是一样的：

```javascript
	function add(num1,num2){
		return num1+num2;
	};
	inputTwoNumber(3,5,add);
```

采用匿名函数的方式之所以能实现是因为js中函数是一等对象，可以传递传递给其他函数作参数！

_ 3、作为普通方法在其它函数里面调用，如：

```javascript
	function a (){
		console.log('a');
	};

	function b(){
		console.log('b');
		a();
	};
```

当然了可能还有其他形式，就不一一列举了，这里没有列出来的，可能我一下子没有想到，但是只要能理解就好了！

###　回调函数有什么好处

* 1、把一个大函数分解成一些小函数，提高代码复用，比如上面的inputTwoNumber函数，即使不用回调函数它也可以实现相加的操作，但是把所有逻辑都写在一个函数里面是很不好了，将来函数越来越到，将变得难以维护。而且我们使用回调函数之后，可以把回调函数用在其它实现相加运算的地方，这样代码复用率也提高起来了！

* 2、代码更灵活了，还是拿上面inputTwoNumber函数来说，如果不用回调函数，直接把加法逻辑写在函数体里面，我们能想到的问题就是，你这个函数最后只能实现加法运算了，并不能做其他事情了，但是我们通过回调函数就可以实现inputTwoNumber只是一个传递数值的“身体”而已，而我们具体做什么我们可以自由发挥，这样是不是很舒服呢！

* 3、实现异步调用，因为我们有些操作并不是同步的，所有我们需要编写回调函数，用于将来在某个事件触发的时候再来调用，比如，事件响应函数、所有异步操作之后调用的函数！如下：

```javascript
	document.body.onclick = function(){
		alert("我等点击触发的时候才调用！");
	};
```

### 用回调函数实现一个异步向后台实现读出json数据的例子

* 我们来看一下如下的一段代码：

```javascript
	var xhr = new XMLHttpRequest();
	xhr.open('GET','./test.json',true);
	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			setDataToUrl(xhr.responseText);
		};
	};

	function setDataToUrl(data){
		data = JSON.parse(data);
		var dom = document.getElementById('test');
		var oul = document.createElement('ul');
		for(var pro in data){
			var oli = document.createElement('li');
			oli.innerHTML = data[pro];
			oul.appendChild(oli);
		};
		dom.appendChild(oul);
	};
```

后台的json文件如下：

```json
	/*test.json*/
	{
		"name":"myCustomJson",
		"description":"this is a test json file"
	}
```

结果截图如下：

![](https://github.com/woai30231/JavascriptDetails/blob/master/image/6_1.png)

### 回调函数是异步的吗？

* 曾经这个问题困扰我很久，因为我一直理解回调函数就是一个函数而已，为什么很多人是它是异步的呢！所以我不认为回调函数不是异步的，最后通过不断练习才证明了我的观点是正确的————回调函数本身不是异步的，只是引起回调函数调用的这个行为本身是异步的而已，还是看下面的代码：

```javascript
	document.body.onclick = function(){
		console.log("回调函数");
	};
```

就像上面的事件处理函数它就是一个普通的匿名函数，它本身不是异步的，我们之所以说他是异步的，是因为本身点击这个事件是异步的，而通常我们所说的异步函数函数又用在这样的场景中，所以我们久而久之就习惯把回调函数说成异步的了，这点要切记，**但是回调函数本身来说不是异步的，只是引起它调用的那个操作是异步的**！

###　回调函数不好的地方

* 回调函数一个最大的影响就是，就是容易形成回调地狱，设想这样的场景：a函数回调b，b函数回调c，c函数回调d...如此下去，是不是很绕呢！你的代码将变得晦涩难懂，而你也很难管理。这样的场景在向后台获取数据的时候经常遇到，看下面的示例代码：

```javascript
	$('xx').animate({xxxx}, function(){
	    $('xx').animate({xx},function(){
	        //do something，后面可能还有回调
	    },1000)
	},1000)
```

### 解决回调函数地狱的一些方法

* 在es6中实现了几种方式来解决回调函数所带来的回调地狱问题如：Generator函数、THUNK函数、async函数及Promise等。有机会大家可以去了解下，这里只简单介绍一下Promise方式，其它方式不介绍。

* Promise英文译为“承诺”，意思在将来某个时间会给出答复，所以这里用这个意思来理解是非常合适的，Promise把异步操作化作三个状态：Pending(进行中)、Resolved（已成功）及 Rejected(以失败)。这三个状态之间只有两种转换方式:pending -> Resolved和 Pending -> Rejected。再无没有其它状态转换方式。对于Promise的细节这里不做介绍，因为相关文档肯定比这里介绍的仔细哦！

* Promise的原理：Promise接受两个参数，一个用于处理异步成功之后的操作，一个用于失败之后的操作。这两个参数所需要的参数都是异步操作返回的数据！我们用Promise实现上面的从后台得到json数据：

```javascript
	 function getJson(){
 	var xhr = new XMLHttpRequest();
 	xhr.open('GET','./test.json',true);
 	xhr.send();
 	return new Promise(function(resolve,reject){
 		xhr.onreadystatechange = function(){
 			if(xhr.readyState == 4 && xhr.status == 200){
 				resolve(xhr.responseText);//成功之后返回的数据放在Promise第一个参数里面
 			}else if(xhr.status>=300 || xhr.status <200){
 				reject('');//请求失败之后，在第二个参数实现出错提示
 			};
 		};
 	});
 };
 var printDiv = getJson();
 printDiv.then(function(data){
 	data = JSON.parse(data);
 	var dom = document.getElementById('test');
 	var oul = document.createElement('ul');
 	for(var pro in data){
 		var oli = document.createElement('li');
 		oli.innerHTML = data[pro];
 		oul.appendChild(oli);
 	};
 	dom.appendChild(oul);
 });
```

### 后续内容正在补充中.......




