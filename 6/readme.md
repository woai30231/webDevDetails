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


