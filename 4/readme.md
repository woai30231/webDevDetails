## 自定义bind函数实现任意绑定函数调用上下文

### 业务背景

* 我们在编写js的过程中经常会出现这样的逻辑需要：某个对象临时需要一个方法，用来处理一些业务，而这样的一个方法的逻辑已经在另一个对象的方法里或函数里面定义过了，所以我们可以不用再在这个对象下添加一个相同的方法了！那我们该怎么做呢？我们的逻辑就是调用已经实现了业务需要的方法或者函数，只是把它的上线文改为当前对象就好了，需要灵活使用的两个方法就是apply和call。好了，我们先来看下下面的示例代码吧：

```javascript
	var obj = {
		name : 'obj',
		getName : function(prefix){
			prefix = prefix || 'hello';
			var _newValue = prefix + ' ' + this.name;
			console.log(_newValue);
			return _newValue;
		}
	};
	var obj1 = {
		name : 'obj1'
	};
	//我们现在需要实现让obj1拥有和obj同样的getName方法
	obj.getName.call(obj1,'-prefix-obj1- hello');
	// 打印-prefix-obj1- hello obj1
```

到此，我们可以实现自由切换上下文了，这里说明一下就是apply和call的区别：从目的上来说，它们是一样的，唯一不同的地方传递参数的形式不同，apply是数组，而call跟我们平时写函数一样，一个一个传进去，所以怎么使用它们看具体业务场景的参数是什么形式的，总的来说就是你怎么爽就怎么用！看下面的代码：

```javascript
	function sum(){
		var num = 0;
		for(var i = 0,len = arguments.length;i<len;i++){
			num += arguments[i];
		};
		console.log(num);
		return num;
	};

	var arr = [1,2,5,7,78,14];
	var arrSum = sum.apply(null,arr);//output 107
	var argsSum = sum.call(null,1,2,5,7,78,14);//output 107
	//顺表说一句，如果上下文设置null,那么的浏览器中就是window
```

### 为什么有了apply和call函数我们还要实现自定的bind函数呢？

* 首先这样做肯定有它的道理的：1、上面的写法很不灵和，因为你每次调用的时候都要写一句--sum.apply(null,...)--,如果只是一次还好，如果你有很多次呢！是不是很烦，我们为什么不能一次性到位；2、其次使用bind的方式，可以保持原有代码风格的情况下实现需求，更利于理解对不；3、当然了还有其它好处，我也暂时没想到，需要集合业务场景说明。总之具体场景具体分析，那种方便就使用那种，又不是板上钉钉的事情！

### 怎么实现bind

* 首先我确实在这上面花了一些时间写出来，什么原因呢？说白了还是对javascript的一些细节不能一下子想通。好，我把我写的用于实现bind函数的每种方式依次说明，并带有代码示例，并说明当时是怎么想的？

* 第一次我是这样实现的，代码如下：

```javascript
	Function.prototype.bind = function(content){
		var _function = this;//用于保留原函数的引用
		var _args = Array.prototype.slice.call(arguments,1);//用于取出原函数的参数
		_function.apply(content,_args);
	};
```

好了，第一次总算是把bind的功能实现了，那我们看下怎么用呢？应用如下：

```javascript
	var surname = '全局';
	var name = '变量';
	function getFullName(surname,name){
		var fullName = this.surname + this.name;
		console.log(fullName);
		return fullName;
	};
	var person = {
		surname : '周',
		name:'杰伦'
	};
	getFullName.bind(person,surname,name);//output 周杰伦
```

恩，我们发现是可以实现需求的！但是我发现有个不好的地方：原来的getFullName是两个参数，可是我现在在调用它的时候函数参数量变了，我觉得这是不行的，因为将来这个bind函数要是给别人用，谁会知道新的上下文就是第一个参数呢！为什么我们不能保持原来的函数形式，这样别人用的时候就不会还要添加一个不必要的参数了。而且上面的bind函数不觉得写得好像硬编码一样吗？还需要算出参数在哪里截断才是我们原来函数的参数！ok，我们做如下修改：

```javascript
	//第二种方式
	Function.prototype.bind = function(content){
		var _function = this;
		return function(){
			return _function.apply(content,arguments);
		};	
	};
```

我们再来看一下在实际生产中怎么调用：

```javascript
	var surname = '全局';
	var name = '变量';
	var person = {
		surname : '周',
		name:'杰伦'
	};
	var getFullName = function(surname,name){
		var fullName = this.surname + this.name;
		console.log(fullName);
		return fullName;
	}.bind(person);
	getFullName(surname,name);//output 周杰伦
	//或者这样写
	//var getFullName = function(surname,name){
	//	var fullName = this.surname + this.name;
	//	console.log(fullName);
	//	return fullName;
	//};
	//getFullName.bind(person)(surname,name);
```

恩好，这一次我们实现了保持原有函数调用的熟悉形式，更利于理解对不！

说明一下从第一种方式到第二种方式经过了怎样的改变：1、我们并没有用slice方法用截断的方式去取得原函数的参数，而是保持了原有函数的代码，这样更灵活、更符合“封闭-开环”原则；2、我们并没有在bind函数内部调用我们的函数，而是返回了一个匿名函数，然后再在匿名函数里面调用我们的函数，这一点很重要，因为它实现了，我们可以不用改变我们原来函数的参数序列。**这里需要说明一下，我最开始是没有理解这一点的，因为我理解的是调用原函数时传的arguments是bind函数的参数队列，其实这样理解思路本来是没有问题的，只不过它已经返回了匿名函数，也就是在使用return的时候，arguments就跟bind函数没有关系了，所以这个arguments就是指的原函数的参数队列，理解这一点很重要！**为了说明这一点，我们来看下下面的代码：

```javascript
	function supFun(supValue){
		console.log(arguments);
		return function(){
			subFun.apply(null,arguments);
		};
	};
	function subFun(subValue1,subValue2){
		console.log(arguments);
	};
	//现在我们这样书写我们的函数调用
	supFun('父变量')//这一步打印arguments，我们发现它只是supFun的参数序列 -- 父变量
	('子变量1','子变量2');//我们发现这一步打印了的就是subFun的参数序列 -- 子变量1 , 子变量2
```

为了更形象的说明这一个过程，画了一个理解草图，如下：

![](https://github.com/woai30231/JavascriptDetails/blob/master/image/bind-1.jpg)

### 上面的方式发现的问题

* 因为上面的方式在原型上修改的，所以很容易造成冲突，因为很多第三方库，也实现了类似的方式，所以为了避免出现冲突，我们决定实现自己的bind函数，把它作为自己定义的命名空间上的一个方法，类似myNameSpace.bind的形式！但是了我们这里主要讲的函数的实现，所以为了更简单说明问题，我采用了写一个全局函数的方式来实现！

### 第三种方式

* 其实这种方式的实现的逻辑跟前面两种方式差不多的，原理是一样的，代码如下：

## 内容待续....
