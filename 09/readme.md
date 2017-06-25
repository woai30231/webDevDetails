## 前言

* 上个星期接到运营部门的提出的一个简单活动页面项目前端需求！需求是这样的：需要统计用户公司某款产品用户的回馈情况，美工给的设计多个psd，每个页面里面都有一个选择题，让用户选择自己的答案，最后经过几次选择之后在最后一个页面统一提交到后台！所以这里引出的技术需求就是：如何在每个页面之间实现数据共享，比如用户进入下个选择页面之后怎么保存用户在上一个页面选择的数据，以便最后统一提交，因为这个项目比较独立，而且也只是简单的几个页面做统计需求，所以我并没有采用angularjs来搭建项目，所以没有用angular里面路由带参数的形式来向下一个页面传递数据，但是我这里使用的方法原理其实是一样的！

* 首先说一下当时想到的几个解决方法：1、每次用户在上一个页面选择之后，用localStorage/sessionStorage来保存用户的选择；2、使用cookie来保存用户选择，然后在后面的页面获取cookie来实现共享数据；3、使用url来实现传递数据，类似发送get请求的把数据带在url查询参数里；4、不要做成多个页面的形式，而是做成一个大页面，采用javascript控制某些“页面”的显示/隐藏的方式来模拟多页面形式，同时通过闭包实现保存用户提交的数据！

* 最后我采用了url的形式来实现保存数据，我后面会说一下为什么会选择这种方式，以及会说明其它方法为什么不适合在这里使用！当然了，这里我写这篇文档的目的除了要记录自己在实现这个需求的一些所思所想以外，因为上面的需求都是介于同一个服务器上的数据共享，没有出现跨域相关的问题，所以我还想对跨域时候发生数据共享问题及解决方法作统计记录，所以本文档将分为两个部分：同域实现数据共享和跨域数据共享，同域部分就以上面这个例子为例说明，跨域部分则会自由、发散说明！**最后说一下，因个人经验有欠缺或不到位，所以其中难免有疏漏的地方，所以你有更好的思路，或者我有写错的地方，欢迎来到[这里](https://github.com/woai30231/webDevDetails/issues)给我讲解一下！**

## 同域部分实现数据共享

### 采用localStorage/sessionStorage来保存数据

* 首先说一下原理，localStorage/sessionStorage都是一个本地存储数据接口，它们两的用法都差不多的，唯一的区别就是在保存时效上：localStorage是永久保存的本地的，除非你主动清空浏览器本地数据，否则即使你关闭浏览器重启，数据照样保存在哪里，而sessionStorage也是持久保存数据的，但是它在浏览器当前窗口关闭之后再重启的时候保存的数据就会被清空！

* 对于这两个接口，你只要记住它们主要的两个方法就好了，如下：

```javascript
	localStorage.setItem('localData','localStorage test data');//设置数据
	var localData = localStorage.getItem('localData');//取出数据
	sessionStorage.setItem('sessionData','session test data');//设置数据
	var sessionData = sessionStorage.getItem('sessionData');//取出数据
```

* 此时我们打开chrome浏览器控制台resources选项，相关数据截图如下:

![](https://github.com/woai30231/webDevDetails/blob/master/image/9_1.png)

![](https://github.com/woai30231/webDevDetails/blob/master/image/9_2.png)

* 好了说一下，如果使用这两个方法实现数据共享的话，思路就是，每次用户选择完成的时候，用localStorage/sessionStorage保存当前的数据，最后在提交的页面获取全部数据，然后提交到后台！理论上这样做是没有问题的，但是我想了一下在这里不适合用这种方式。因为这个两个接口保存的数据都是永久性保存的，也就是说用户第一次选择好选项之后，然后没有提交，而关闭了页面，但是他第二次直接进入最后提交的那个页面，而此时用户本来是想改它之前选择的选项的，可是这里没有提示，用户就直接提交了！所以这里有点业务逻辑不行！当然了，也可以采用js告诉浏览器，在用户最后关闭浏览器的时候清空相关数据，代码如下：

```javascript
	localStorage.removeItem('localData');//删除数据
	sessionStorage.removeItem('sessionData');//删除数据
```

* 个人觉得，localStorage/sessionStorage适合保存那种在较久不需要修改的数据信息，比如用户登陆网站的配置信息等！而不适合保存一次性数据！

### 采用cookie保存数据

* cookie也是一种客户端在本地保存数据的方式，设置方式如下：

```javascript
	document.cookie = "cookieData='cookie test data'";//设置cookie
	document.cookie;//获取所有cookie
	(function(){
		//获取某一个cookie
		function getCookie(cookieName){
			var regexp = new RegExp("(;?|^)"+cookieName+"=([^;]*)(;|$)","mi");
			var arr = document.cookie.match(regexp);
			console.log(arr);
			return arr[2];
		};
	})();
```

chrome浏览器控制台截图如下：

![](https://github.com/woai30231/webDevDetails/blob/master/image/9_3.png)

删除cookie只需要给某个cookie设置一个过期时间就可以了，比如我设置上面的cookieData，只需要像下面这样做一下就可以轻松实现删除cookie:

```javascript
	var nowTime = new Date().getTime();//获取当前时间
	var expirAtionTime = new Date(nowTime-1);//设置过去时间
	document.cookie = "cookieData='cookie test data';expires="+expirAtionTime.toGMTString();
```

控制台截图如下：

![](https://github.com/woai30231/webDevDetails/blob/master/image/9_4.png)

当然了，cookie还可以设置很多其它参数，比如安全域、主机等，总之我的理解就是cookie和localStorage/sessionStorage是差不多的数据存储方式，只是cookie更灵活一点，但设置起来要难一点！

虽然我刚开始是想使用cookie来实现上面的需求，但我后来发现cookie除了存在跟localStorage/sessionStorage一样的问题以外，保存的数据在用户退出重进不能很好的更新，还存在兼容性，在移动端有的浏览器存在不支持cookie，（**注：cookie在移动端什么情况，在这里不深究！具体可自行查阅相关资料！**）所以这种方式被终止！

### 通过URL方式来保存数据

* 这种方式就是通过给url带参数和查询的方式来实现传递、共享数据，如要在a页面跳到b页面实现向b页面传送testData可以像下面那样实现：

```html
	<!--a页面-->
	<a href="./b.html?shareData=testData">链接b</a>

	<!--b页面-->
	<script type="text/javascript">
		var data = location.search.slice(1).split('&')[0].replace('shareData=','');//testData
	</script>
```

我这里就采用了这种方式，因为采用url的方式传输数据不会存在localStorage/sessionStorage、cookie发现的问题，但是这种方式也有它不好的地方，因为url不能传输太大的数据，有字节数限制，当然了我结合这个需求的实际情况，我觉得这里可以采用这种方法。

### 采用闭包方式实现保存数据

* 这种方式的原理就是模拟一个选项卡的点击切换的效果来实现多页面的需要，但实际上是一个页面，同时在全局保存一个变量用来存储将来要提交的数据，这种方式不会存在前面的提到的一些问题，数据是临时的，能很好的即时刷新。但集合实际情况我没有选择在这里使用这种方式来时间保存数据，因为这会使得html、css、javascript耦合太强了，将来如果需求要改的话，很不灵活，所以终止！


#### 注：这里不讨论worker方式

## 跨域方式实现数据共享

* 因为这里没有案例参考，那我们自由发挥吧，想到哪里就讲到哪里！其实同域和跨域代码在主要逻辑什么没有什么不同，就是跨域多了一层跨域的处理，所以我们这里说下怎么实现跨域就好，因为其它的逻辑还是原来同域的那个部分！那我们说下怎么解决跨域问题。

_ 1、使用cors：

这种方法的好处就是你根本不用改变你前台的写的代码，你同域的时候怎么写的，现在跨域就怎么写，只是需要在后台服务器端响应的时候配置一下"Access-Control-Allow-Origin"响应头就好，把它的设置成你允许访问的那个服务器就好，就是你想获取数据的那个页面所在的服务器。可以设置__*__，这样所有服务器都可以访问这个资源了。

_ 2、使用jsonp

相关描述可以来[这里](https://github.com/woai30231/webDevDetails/tree/master/7)查看

_ 3、使用代理服务器

理解这种方法的前提是首先需要知道为什么会出现跨域问题？因为浏览器有个同源策略，所以才会出现跨域问题，那么我们把数据放在后台去请求呢！问题就会迎刃而解了，因为服务器端是没有同源策略的！

_ 4、其它方式

还有其他的方式，比如frame、postMessage等，这些我用的比较少，所以在这里不做介绍了！

#### 时间仓促，写的不对的地方，希望及时提醒我一下，当然了你也可以多看看其它地方，以作对比、权衡从而发现细节问题，后期持续更新……