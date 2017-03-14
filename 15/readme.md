## 前言

* 在web开发中，你是否会有这样的体验：随便建立.css文件，然后从上到下依次编写你的网页样式，在此期间你无时无刻不在为怎样取类名而烦劳，因为害怕取重名了，把前面的样式覆盖了。同时你写的样式代码总是很随性的，想到那里就写到那里，可是你发现没有，你已经犯错了————什么错误呢？因为你可能前面已经写过了某些“元件”的样式，你后面又写了一次，造成你的css代码复用率很低，浪费你的时间写重复的代码。等等，你在写样式的时候不小心的话总会出现这样那样的问题！总结了一下，这些问题包括以下四个方面：

> 1、不能重用代码；

> 2、总是不可避免的复制/粘贴；

> 3、在维护代码的时候，怎么减少复杂度及简单地重构；

> 4、怎么减少命名冲突。

* 好了，怎么解决这些问题呢！现在就有一种技术可以减轻这些问题————[BEM](https://en.bem.info/):(Block、Element、Modifled)，也不能说这是一种技术哈，你可以把它理解为一种“约束、规则”等！我觉它就是让你在写css的时候形成一种规范，这样就可以减少上面出现的那些问题了，这个后文会讲到！

* 这篇文档的编写是建立在[BEM](https://en.bem.info/)官网的基础上的，所有有什么不对的地方，请以官网的解释为主！

### 相关链接

* [bem官网](https://en.bem.info/)

* [what problems the bem can solve?](https://en.bem.info/methodology/)

* [bem————quick start](https://en.bem.info/methodology/quick-start/)


### 什么是bem

* BEM是一种以组件为基础的开发模式、规范！其背后的原理把用户的“用户界面”分开成一个个独立的组件，这样当我们构建一个复杂的用户界面的时候就会使开发起来变得简单、同时也加大了开发效率，同样它也会使你充分利用你写过的代码，而不是去机械地一步一步复制和粘贴来实现复用你的代码！

* BEM主要包括三部分内容：Block、Element、Modifled！

### Block

* Block是BEM的基础的，因为你可以理解BEM里面所说的一个组件就是一个Block，它是一个你以后可以重用的单元！

* 特点：Block的取名（名字）应该描述的是你这个组件是什么，而不是描述它像什么！

* 例子：

```html

	<!--正确的：‘error’Block表示含义就非常广-->
	<div class="error"></div>

	<!--错误的：这里描述了外观-->
	<div class="red-text"></div>
```

> 1、因为block描述的不影响它的使用环境，所以block的名字不能取描述外观的文字；

> 2、在用BEM的时候，你也应该不使用id选择器。

这样做了，就能使你的block到处用了。

#### 怎么使用blocks

> 1、你可以嵌套不同的block；

> 2、嵌套的层级也可以无限制。

* 例子：

```html
	<!--'header' block-->
	<header class="header">
		<!--嵌套了'logo'block-->
		<div class="logo"></div>
		<!--嵌套了'search-form' block-->
		<form class="search-form"></form>
	</header>
```

### Element

* Element其实就是Block的一部分，并且不能离开Block单独使用。

* 特点：

> Element的取名（名字）应该描述它的目标，而不是描述它的外貌；

> Element的取名应该保持这种格式——block-name__element-name，element的名字应该跟他的block名字以双划线“__”连接起来。

* 例子：

```html
	<!--'search-form' block-->
	<form class="search-form">
		<!--'search-form' block 中的 'input' element-->
		<input class="search-form__input" />

		<!--'search-form' block 中的 'button' element-->
		<button class="search-form__button">Search</form>
	</form>
```