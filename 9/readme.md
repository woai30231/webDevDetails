## 前言

* 上个星期接到运营部门的提出的一个简单活动页面项目前端需求！需求是这样的：需要统计用户公司某款产品用户的回馈情况，美工给的设计多个psd，每个页面里面都有一个选择题，让用户选择自己的答案，最后经过几次选择之后在最后一个页面统一提交到后台！所以这里引出的技术需求就是：如何在每个页面之间实现数据共享，比如用户进入下个选择页面之后怎么保存用户在上一个页面选择的数据，以便最后统一提交，因为这个项目比较独立，而且也只是简单的几个页面做统计需求，所以我并没有采用angularjs来搭建项目，所以没有用angular里面路由带参数的形式来向下一个页面传递数据，但是我这里使用的方法原理其实是一样的！

* 首先说一下当时想到的几个解决方法：1、每次用户在上一个页面选择之后，用localStorage/sessionStorage来保存用户的选择；2、使用cookie来保存用户选择，然后在后面的页面获取cookie来实现共享数据；3、使用url来实现传递数据，类似发送get请求的把数据带在url查询参数里；4、不要做成多个页面的形式，而是做成一个大页面，采用javascript控制某些“页面”的显示/隐藏的方式来模拟多页面形式，同时通过闭包实现保存用户提交的数据！

* 最后我采用了url的形式来实现保存数据，我后面会说一下为什么会选择这种方式，以及会说明其它方法为什么不适合在这里使用！当然了，这里我写这篇文档的目的除了要记录自己在实现这个需求的一些所思所想以外，因为上面的需求都是介于同一个服务器上的数据共享，没有出现跨域相关的问题，所以我还想对跨域时候发生数据共享问题及解决方法作统计记录，所以本文档将分为两个部分：同域实现数据共享和跨域数据共享，同域部分就以上面这个例子为例说明，跨域部分则会自由、发散说明！**最后说一下，因个人经验有欠缺或不到位，所以其中难免有疏漏的地方，所以你有更好的思路，或者我有写错的地方，欢迎来到[这里](https://github.com/woai30231/webDevDetails/issues)给我讲解一下！**

## 同域部分实现数据共享

### 采用localStorage/sessionStorage来保存数据

* 首先说一下原理，localStorage/sessionStorage都是一个本地存储数据接口，它们两的用法都差不多的，唯一的区别就是在保存时效上：localStorage是永久保存的本地的，除非你主动清空浏览器本地数据，否则即使你关闭浏览器重启，数据照样保存在哪里，而sessionStorage也是持久保存数据的，但是它在浏览器当前窗口关闭之后再重启的时候保存的数据会清空就！

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