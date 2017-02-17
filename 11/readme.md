## 前言

* 因为平时在写代码的过程中，有些算法会经常重复写，比如数组去重、数组抽取随机值等！虽然这些不是很难的逻辑，但是每次刚开始遇到需求的时候，还是需要琢磨一些时间才能想出来，所以此文档把这些常见算法的思想记录下来，以便下次再遇到的时候不会手脚无措了！

* **这篇文档不考虑es6等语法，也不考虑Array自带的一些过滤方法！**

### 数组去重

* 我们这里不考虑数组上的一个自带的过滤算法，比如map、filter等方法！数组去重的关键是需要一个中间数组来存数组来帮助实现数组去重！

* 方法一：

```javascript
	var arr = [1,2,3,1,1,1,1];
	function toHeavy(array){
		//这是一个缓存对象，用来实现过滤到重复的数据
		var cache = {};
		//定义一个中间数组，用来实现当容器
		var cacheArr = [];
		for(var i = 0,len = array.length;i<len;i++){
			if(!cache[array[i]]){
				cacheArr.push(array[i]);
				cache[array[i]] = array[i];
			};
		};
		return cacheArr;
	};
	arr = toHeavy(arr);//arr ==  [1,2,3]
```

* 方法二：

```javascript
	//其实思想跟第一个差不多
	var arr = [1,2,3,1,1,1,1,1,1];
	function toHeavy(array){
		var cache = [];
		for(var i = 0,len = array.length;i<len;i++){
			//用闭包，防止isHeavy向外部暴露，当然如果用es6的话，可以用let对isHeavy进行声明也能达到同样的目的
			//因为js中没有块级作用域
			(function(){
				var isHeavy = false;
				for(var j = 0,_len = cache.length;j<_len;j++){
					if(cache[j] == array[i]){
						isHeavy = true;
						break;
					};
				};
				if(!isHeavy){
					//如果不是重复的，那么就执行把当前值推送的cache里面
					cache.push(array[i]);
				};
			})();
		};
		return cache;
	};

	arr = toHeavy(arr);
```

最后说一句，现实中的数据肯定不会这么简单，可能会是一个稍微复杂的数据，要给这些数组去重你也不要被吓住，其实原理是一样的，只是你被迷惑了而已！


### 在一个数组中随机抽取一部分值

* 这个算法的关键要使用Math.random，不说了直接上代码:

```javascript
	var arr = ['小明','小红','小陈','小于','小兰','小法','小p','小张','小镇','小王','傻逼','怂逼'];

	function getArr(num,array){
		//num表示要去多少个，它不能大于要取的那个数组的最大长度，如果超过了那么就等于它的长度
		var aLength = array.length;
		if(num>=aLength){
			num = aLength;
		};
		var cacheArr = [];
		//我们用一个数组保存原来的数组
		//记住千万能直接赋值，因为数组是一个引用，这样不能保持原来的数组
		//这里也可以用originArr = array.slice()
		var originArr = (function(){
			var arr = [];
			for(var i = 0,len = array.length;i<len;i++){
				arr.push(array[i]);
			};
			return arr;
		})();
		for(var i = 0;i<num;i++){
			//array.length不能写成上面的aLength，因为aLength是固定的值，而array.length随着array的改变是自动更新的
			//Math.random() * array.length得到的是一个介于长度和零之间的一个值，包括0但不包含长度值
			//我们算出的是一个浮点值，所以我们必须把它转化成整数
			//因为不能超过最大长度值，所以应该向下取整
			var _index = Math.floor(Math.random() * array.length);
			cacheArr.push(array[_index]);
			//记住一定，取出来之后，一定删除原来位置上的数组值
			//要不然数组更新不了
			array.splice(_index,1);
		};
		//取回原来的数组
		array = originArr;
		console.log(array);
		return cacheArr;
	};
	var brr = getArr(5,arr);
```

### 得到某个区间的字母组成的数组

* 这里主要应用两个方法，一个字符串的charCodeAt和String上的一个静态方法fromCharCode。其思想主要是：先得到这个区间开头字母和结束字母的数字表示，然后就可以在这个区间内做一个循环，并且得到这个区间字母的数字表示，最后把数字传唤成字母依次push到数组里面返回。直接上代码：

```javascript
	function getArrForAlphabet(startLetter,endLetter){
		//var regExp = /^[a-zA-Z]$/gi;
		var regExp = new RegExp("^[a-zA-Z]$");
		if(!regExp.test(startLetter) || !regExp.test(endLetter)){
			//console.log(regExp.test(startLetter));
			//console.log(regExp.test(endLetter));
			console.log('请传入字母！');
			return false;
		};
		//i是得到开始字母的数字表示，j得到结束字母的数字表示
		var i = startLetter.charCodeAt(0),j = endLetter.charCodeAt(0);
		//定义一个数组用于取出将来的字母
		var arr = [];
		//这里取<=符号是因为要取出结束的字母
		for(;i<=j;i++){	
			//fromCharCode是String上的一个静态方法，用于将一个数字转换成对应的字母
			var letter = String.fromCharCode(i);
			arr.push(letter);
		};
		//记得最后返回arr
		return arr;
	};
```

![](https://github.com/woai30231/webDevDetails/blob/master/image/11_1.png)

# 后续代码待更新……

