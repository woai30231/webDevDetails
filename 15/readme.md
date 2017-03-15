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

#### 怎么使用Elements?

> 1、Elements可以彼此嵌套；

> 2、并且嵌套层级不限制；

> 3、一个Element总是对应的Block的一部分，而不是另外一个Element的一部分，所以不应该做这样的取名：block__elem1__elem2。

* 例子：

```html
	<!--正确的：Element的名字格式"block-name__element-name"-->
	<form class="search-form">
		<div class="search-form__content">
			<input class="search-form__input" />
			<button class="search-form__button">Search</button>
		</div>
	</form>

	<!--错误的：Element的名字格式不能是这样："block-name__element-name__element-name"-->
	<form class="search-form">
		<div class="search-form__content">
			<!--推荐使用：'search-form__input'或者'search-form__content-input'-->
			<input class="search-form__content__input"/>

			<!--推荐使用：'search-form__content'或者'search-form__content-button'-->
			<button class="search-form__content__button">Search</button>
		</div>
	</form>
```
Block名字定义了命名空间，从而保证Elements可以依赖于Block而存在！一个Block可以嵌套多Elements，如：

```html
	<div class="block">
		<div class="block__elem1">
			<div class="block__elem2">
				<div class="block__elem3"></div>
			</div>
		</div>
	</div>
```

下面这种格式是bem通用的格式：

```css
	.block {}
	.block__elem1 {}
	.block__elem2 {}
	.block__elem3 {}
```

这种格式可以使你在改变dom-tree的情况下，不改变css就能使用：

```html
	<div class="block">
		<div class="block__elem1">
			<div class="block__elem2"></div>
		</div>
		<div class="block__elem3"></div>
	</div>
```

一个Element永远是一个Block的一部分，你不能离开Block单独使用它，如：

```html
	<!--正确的：Elements出于‘search-form’block之中-->
	<!--'search-form block'-->
	<form class="search-form">
		<!--'input' element在‘search-block’中-->
		<input class="search-form__input" />

		<!--'button' element在‘search-form’中-->
		<input class="search-form__button">Search</form>
	</form>

	<!--错误的：Elements不能存在‘search-block’block之外-->
	<form class="search-form">
	</form>

	<!--'input' element in the 'search-form' block-->
	<input class="search-form__input"/>

	<!--'button' element in the 'search-form' block-->
	<button class="search-form__button">Search</button>
```

Elements对于Block来说是可选的，并不是所有的Block都有Elements，如：

```html
	<!--'search-form' block-->
	<div class="search-form">
		<!--'input' block-->
		<input class="input"/>

		<!--'button' block-->
		<button class="button">Search</button>
	</div>
```

###　我什么时候该建立一个Block或者一个Element?

> 1、如果一个板块将来需要复用，并且不依赖其它任何组件，那么这个时候就应该建立一个Block；

> 2、如果一个板块不能离开一个实体而单独使用，那么这个时候就应该建立一个Element。

### Modifier

* Modifier主要定义了Block或者Element的状态、外观等“附加”的样式！

* 特点：

> Modifier的取名（名字）描述了组件的外观（比如尺寸什么的！）或者状态（比如disabled等！）；

> Modifieer的名字应该跟Block名字或者Element名字以“_”连接。

* 例子：

```html
	<!-- The `search-form` block has the `focused` Boolean modifier -->
	<form class="search-form search-form_focused">
	    <input class="search-form__input">

	    <!-- The `button` element has the `disabled` Boolean modifier -->
	    <button class="search-form__button search-form__button_disabled">Search</button>
	</form>
```

```html
	<!-- The `search-form` block has the `theme` modifier with the value `islands` -->
	<form class="search-form search-form_theme_islands">
	    <input class="search-form__input">

	    <!-- The `button` element has the `size` modifier with the value `m` -->
	    <button class="search-form__button search-form__button_size_m">Search</button>
	</form>

	<!-- You can't use two identical modifiers with different values simultaneously -->
	<form class="search-form
	             search-form_theme_islands
	             search-form_theme_lite">

	    <input class="search-form__input">

	    <button class="search-form__button
	                   search-form__button_size_s
	                   search-form__button_size_m">
	        Search
	    </button>
	</form>
```

#### 怎样使用Modifier？

* 1、Modifier不能离开Block和Element单独使用，如：

```html
<!--
    Correct. The `search-form` block has the `theme` modifier with
    the value `islands`
-->
<form class="search-form search-form_theme_islands">
    <input class="search-form__input">

    <button class="search-form__button">Search</button>
</form>

<!-- Incorrect. The modified class `search-form` is missing -->
<form class="search-form_theme_islands">
    <input class="search-form__input">

    <button class="search-form__button">Search</button>
</form>
```

### Mix

* Mix描述的是一种同时使用多个不同的BEM来封装一个组件的技术！它能帮你解决如下问题：

> 1、组合多个BEM的样式和外貌，而不需要复制代码；

> 2、在建立这个新组件的同时其实你又建立了一个新的组件，以便以后复用。

* 例子：

```html
	<!-- `header` block -->
	<div class="header">
	    <!--
	        The `search-form` block is mixed with the `search-form` element
	        from the `header` block
	    -->
	    <div class="search-form header__search-form"></div>
	</div>
```

在这里我们在'search-form'block中混合使用了'header'block的element'header__search-form'，这样我们就能组合使用两者的样式了！其实这得益于我们在相关样式代码的时候，应该尽量保证代码各部分独立、通用！这样才能独立在其它block中调用另一个block中的样式代码！

### File structure

* 其实类似BEM这种技术思想，我们也可以在构建项目文档目录结构的用到！套用到这里就是Block、Element、Modifier分别代表独立的文件！

* 特点：

> 1、一个Block就是一个目录；

> 2、Block的名字就是目录的名字，比如'header'Block对应的目录就是'/header'；

> 3、Block由分开的文件组成，系统使用的过程中，再安装对应的模块，比如'header'Block由header.css和header.js等构成；

> 4、Block所在的目录应该是它的Element和Modifier的根目录；

> 5、在命名Element目录的时候应该用双下划线"__"开头，如"header/__logo"；

> 6、在命名Modifier目录的时候应该用单下划线"_"开头，如"header/_fixed"和"header/_theme_islands"；

> 7、同样Element和Modifier由不同的文件组成，如："header__logo.js"和"header_theme_islands.css"。


* 例子：

<pre class="color:#657683;border-left:5px solid #ddd;padding-left:15px;">
	search-form/                           # Directory of the search-form

    __input/                           # Subdirectory of the search-form__input
        search-form__input.css         # CSS implementation of the
                                       # search-form__input element
        search-form__input.js          # JavaScript implementation of the
                                       # search-form__input element

    __button/                          # Subdirectory of the search-form__button
                                       # element
        search-form__button.css
        search-form__button.js

    _theme/                            # Subdirectory of the search-form_theme
                                       # modifier
        search-form_theme_islands.css  # CSS implementation of the search-form block
                                       # that has the theme modifier with the value
                                       # islands
        search-form_theme_lite.css     # CSS implementation of the search-form block
                                       # that has the theme modifier with the value
                                       # lite

    search-form.css                    # CSS implementation of the search-form block
    search-form.js                     # JavaScript implementation of the
                                       # search-form block
</pre>

### 先撤，后期内容待我回来更新………………