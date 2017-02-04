## 前言

* 这边文档希望通过自己对jsonp的理解，能够采用最简单、最直白的语言告诉大家jsonp是干嘛的！当然，其间难免有纰漏之处，希指正出来！

### jsonp能解决的问题

* 首先我们需要jsonp是干嘛的，它是一种解决浏览器跨域问题的方案，说道这里什么是浏览器跨域呢！说白了，就是浏览器内部有一种机制为了保证每个站点之间的请求达到安全、独立，相互交互不乱套等，浏览器阻止了不同源站点之间的请求。如果不采用跨域的话，浏览器将会报错的。我们先来看个简单例子吧：[实例代码1](https://github.com/woai30231/webDevDetails/blob/master/7/demo1.html)

```html

<!DOCTYPE html>
<html lang="Zh-cn">
<head>
	<meta http-equiv="content-type" content="text/html;charset=utf-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1.0"/>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no"/>
	<meta name="renderer" content="webkit"/>
	<meta name="Keywords" content=""/>
	<meta name="description" content=""/>
	<title>demo</title>
</head>
<body>

<script type="text/javascript">
	(function(){
		var xhr = new XMLHttpRequest();
		xhr.open('GET','http://localhost/demo/demo1.php',true);
		xhr.send();
		xhr.onreadystatechange = function(){
			if(xhr.status == 200 && xhr.readyState == 4){
				console.log(xhr.responseText);
			}else{
				console.log('什么都没有');
			};
		};
		xhr.onerror = function(){
			console.log('请求出错了！');
		};
	})();
</script>
</body>
</html>

```

我们通过上面的页面在请求资源时可以看到下面请求跨域错误提示：

![](https://github.com/woai30231/webDevDetails/blob/master/image/7_1.png)


### 怎样理解跨域，以及它跟浏览器的关系呢！

* 首先我们不想把概念说的神乎其神，但是大家要理解下面说的话，可以先看下《http报文权威指南》了解下相关概念！这里指出一下，如果只是从http请求的方面来说，上面的页面请求是没有什么问题的，而且也不会报错，因为http本身是无状态的，它也不知道请求的是谁，被请求的是谁，它只知道客户端有请求，服务器把客户端需要的东西返回就好了！**上面的页面之所以会报错，是由于浏览器自己带有了一种叫做同源策略的安全机制产生的！**

* 什么是同源策略，相关概念可以自行google或百度，说白了就是一种机制促使浏览器限制不同源之间的请求。这里说一下什么样的请求是不同源的，看下面的表格：



<table>
	<tr>
		<td>http://www.demo.com</td>
		<td>https://www.demo.com</td>
		<td>这是不同源的，因为协议不同</td>
	</tr>
	<tr>
		<td>http://www.demo1.com</td>
		<td>http://www.demo2.com</td>
		<td>这是不同源的，因为主机不同</td>
	</tr>
	<tr>
		<td>http://www.demo.com:80</td>
		<td>http://www.demo.com:8080</td>
		<td>这是不同源的，因为端口号不同</td>
	</tr>
</table>


### 怎么解决跨域请求问题呢！

* 常见的和自己熟悉有几种方案，如：1、用cros；2、用代理；3、使用jsonp。这里只对jsonp介绍，其他的方案可以自行查看相关文档。

### jsonp的原理

* jsonp原理其实很简单，首先我们先回归一个现实：我们发现，当我们在html插入img、a、script标签的时候，它们是没有同源限制的。所以jsonp的原理就是利用img、script等标签插入一个请求地址，让不同源的请求远离浏览器的同源策略限制。

### 实（示）例

* 我们来先看一个例子吧: [前台代码](https://github.com/woai30231/webDevDetails/blob/master/7/demo2.html)