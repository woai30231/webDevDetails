<h1 style="text-align:center;">javascript中event loop是什么</h1>

## 声明

这篇文章是基于[原英文版](http://altitudelabs.com/blog/what-is-the-javascript-event-loop/)文章翻译过来的，所以你有任何疑问可查看原文，感谢原文。

这篇文章不作说明的，情况下，JS或js指Javascript，请知悉！

示例代码在index.html文件中。

## 介绍

如何你跟我一样的话，那么你一定会爱上javascript！虽然它不是一种比较完美的编程语言，但是严格地说，还有其它比javascript更完美的语言来设计web吗？所以请忽视javascript的缺陷吧。我喜欢web工作，而javascript使得我可以用其来建立applications，从而跟web上的用户联系起来！

但是如果你深究javascript——你会发现，它的一些内部概念你需要花费许多时间才能真正理解！其中一个概念就是Event Loop，可能一个在web开发中工作了几年的开发人员也没有真正理解其含义和工作原理，不管怎样，我希望通过这篇文章，能带给你一些启发：什么是event loop?其实它并不是那么难以理解的！

## 浏览器中的Javascript

我们通常所说的javascript，都是指浏览器端使用的javascript——因为我们写的javascript代码大多数是用在客户端的！不管怎样，理解这些概念和技术是非常重要的：1、Javascript Engine（比如 [Chrome's V8](https://en.wikipedia.org/wiki/JavaScript_engine)），2、[Web API](https://developer.mozilla.org/en/docs/Web/API)（如 [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)），3、Event Loop 和 Event Quene。

你可能看过上面列举的这些概念之后，你可能会这样想：“好复杂呀！”，确实是这样的！但是通过这篇文章待会儿你会发现，其实它们并没有那么复杂！

在介绍event loop之前，我们需要对javascript engine做一个简单的理解来明白它是做什么的！

## Javascript Engine

有几种不同的js引擎，但是最流行的一个当属谷歌的V8了（它并不仅仅在浏览器环境中使用，通过nodejs，它也在服务器端使用）。但是js引擎的工作到底是什么呢？其实，引擎的工作非常简单——它会遍历我们写的所有js代码，然后一个一个的执行它们。也就是说我们的js是单线程的，单线程不好的地方就是，如果你同步执行了一段很长时间的代码的话，那么这段代码后面的逻辑会被阻塞从而等待很久才能执行。同门通常都不想写阻塞的代码——特别是在浏览器中，设想如果你点击了一个按钮之后去执行了一个很长时间的阻塞代码，这会导致你的页面的其它交互效果会暂停，严重影响用户体验！

那么js引擎是怎么知道一个一个的处理代码呢？其实它使用了call stack（调用栈）。你可以把调用栈看作一个电梯——第一个进电梯的人最后一个出来，最后一个进电梯的人第一个出来！

我们来看一个例子：

```javascript
 /*Within main.js*/
 var firstFunction = function(){
     console.log("I'm first!");
 };
 var secondFunction = function(){
     firstFunction();
     console.log("I'm second!");
 };
 secondFunction();
 /*Results:
 *=> I'm first!
 *=> I'm second!
 */
```

首先，js引擎会维护一个调用栈序列的：

* main.js第一次执行的时候，调用栈序列是这样的：

![](http://altitudelabs.com/blog/content/images/2014/Jul/1-u51csgcFDi7SYoxnFljJ6w.png)

* 当调用secondFunction的时候，调用栈序列：

![](http://altitudelabs.com/blog/content/images/2014/Jul/1-QY4CM881bCmS908GSwlJiA.png)

* 我们调用secondFunction导致firstFunction被调用，所以此时序列是这样的：

![](http://altitudelabs.com/blog/content/images/2014/Jul/1-pnI4YwJpXzt1mt1leOGl2Q.png)

* 当执行完firstFunction，会打印“I'm first！”，然后在其内部就没有其它代码执行了，所以调用栈序列需要把firstFunction移除，所以此时序列是这样的：

![](http://altitudelabs.com/blog/content/images/2014/Jul/1-AKybdhXXHbkvL6Eg4pNxDQ.png)

* 同样，secondFunction打印完“I'm second!”之后，在其内部也没有其它代码需要执行了，所以会移除其，所以此时序列是这样的：

![](http://altitudelabs.com/blog/content/images/2014/Jul/1-Wx7x-aKIq2o7DmWlejRpeQ.png)

* 最后，当main.js中没有其它代码需要执行的时候，那么匿名函数也会被从调用栈中移除，从而这样：

![](http://altitudelabs.com/blog/content/images/2014/Jul/1-iYM4rq0n0VqSptkCXaiesw.png)
