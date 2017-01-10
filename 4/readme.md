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