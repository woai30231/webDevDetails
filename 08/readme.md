## 前言

* 请记住，这篇文档并不是实际搭建一个网页项目，而是告诉我们在**纯手工、不用相关生成器的情况下**怎么从零开始搭建一个工程化的网页项目，所以主要要告诉的就是我们在这一过程中思路是怎么样的！通过这篇文档，能让大家了解相关框架、工具的使用原理以及以及如何构建自动化项目。**_诚然，前端技术日新月异，各种框架满天飞，所以自己在某些方面也感觉到不足，所以还请看到该文档的前辈能够不吝不吝赐教，请移步_**[这里](https://github.com/woai30231/webDevDetails/issues)

* 假定现实情况：假设有个网页需求，有一个主页index.html，有三个子页contact.html、introduct.html、product.html，这三个子页分别从index.html连接过来，又可以从三个子页返回index.html。我们采用spa的方式构建单页面app，采用grunt管理前台代码程序，采用bower管理各种第三方依赖库。最终项目在[这里](https://github.com/woai30231/webDevDetails/tree/master/8/app)

* **注意：本文档已经默认你有js、css、html基础，并且知道了解angularjs框架！**

* 最后还想告诉大家一种**“大繁至简”**的意思，其实很多很高深的道理，回归到简单层面上来其实就是简单的叠加，最后变成了复杂！

### 开始着手完成项目

* 我们每做一个事情，都会在心里有个默认次序，先做什么，再做什么，最后做什么，依次类推！我们搭建这个项目也是一样，我们需要先确定每一步该做什么，以此来理清思绪！

#### 第一步：确定项目结构

* 如何熟悉angular搭建项目的目录结构的话，我们就采用下面的目录结构来组织我们的app

> app
>> contact

>>> contact.css

>>> contact.js

>>> contact.controller.js

>>> contact.html

>> introduct

>>> introduct.css

>>> introduct.js

>>> introduct.controller.js

>>> introduct.html

>> product

>>> product.js

>>> product.css

>>> product.controller.js

>>> product.html

>> index.html

>> app.js

>> app.css

采用这样的结构方便我们把每一个路由当作一个模块，从而方便管理每个页面下的css、js等！

#### 第二步：先用几个静态页面写出来

* 这一步你不要使用js等，只需要用html、css勾勒出静态页面！下面是效果截图，html、css代码请查略[源项目](https://github.com/woai30231/webDevDetails/tree/master/8/app)

预览图截图如下：

![](https://github.com/woai30231/webDevDetails/blob/master/image/8_1.png)

![](https://github.com/woai30231/webDevDetails/blob/master/image/8_2.png)

![](https://github.com/woai30231/webDevDetails/blob/master/image/8_3.png)

![](https://github.com/woai30231/webDevDetails/blob/master/image/8_4.png)

#### 第三步 安装相关管理工具

* 在这里我们需要用到grunt管理代码，用bower管理第三方依赖，所以我们需要安装这些工具，首先这些工具是基于nodejs平台的，所以在这之前你需要在你的电脑里安装nodejs，怎么安装nodejs，可以自行google，或者百度。

* node安装之后，用npm（node自带）在全局安装grunt-cli和bower，命令如下：

```bash
	npm install -g grunt-cli bower
```
安装完成之后，我们需要在项目根部初始化一个package.json文件，这个文件的作用就是告诉其它使用你这个项目的人你这个的项目是什么情况，比如作者、版本、依赖什么的，采用如下命令，然后bash询问式一步一步要求填写你自己的内容：

```bash
	npm init
```
当然了，你也可以采用默认初始化操作来实现封装一个package.json文件，所有内容都是系统默认填写的，命令如下：

```bash
	npm init -yes
```

我们再来在本地安装grunt并把它添加到包依赖devDependencies中，命令如下：

```bash
	npm  install grunt --save-dev
```

至此，我的package将会是如下内容：

```json
	{
	  "name": "demoapp",
	  "version": "1.0.0",
	  "description": "this is a demo for how to get up a SPA site",
	  "main": "index.js",
	  "scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "keywords": [
	    "''\u001b[Dtest"
	  ],
	  "author": "lijianfeng",
	  "license": "ISC",
	  "devDependencies": {
	    "grunt": "^1.0.1"
	  }
	}
```

#### 第四步，用bower安装第三方依赖库

* 在本文档中，我们需要的第三方库有angular.js以及angular-ui-router.js，同样，我们需要初始话一个bower.json文件，这个文件的作用就是告诉bower它自己管理了那些第三方库，命令如下：

```bash
	bower init
```

通过填写相关信息，bower.json如下：

```json
	{
	  "name": "demoapp",
	  "description": "this is a demo for how to get up a SPA site",
	  "main": "index.js",
	  "authors": [
	    "lijianfeng"
	  ],
	  "license": "ISC",
	  "keywords": [
	    "test"
	  ],
	  "homepage": "https://github.com/woai30231/webDevDetails"
	}
```

同时，我们还可以通过配置一个.bowerrc文件来告诉bower安装的库放在哪里，.bowerrc内容如下：

```json
	{
		"directory":"./bower_js"
	}
```

ok，到这里我就可以开始用bower安装库了，并且会安装到指定目录下，相关的bower API可以查看官方文档，那我们首先安装angular-ui-router，通过安装angular-ui-router，bower会自动安装angular.js，因为angular.js是angular-ui-router.js的依赖。命令如下：

```
	bower install angular-ui-router#0.2.15 --save-dev
```

ok，我们看到我们的项目结构中多了一层目录如：


![](https://github.com/woai30231/webDevDetails/blob/master/image/8_5.png)

当然了，在我们用git做版本控制的过程中，为了减少给远程版本仓库存贮不必要的文件，我们可以配置一个.gitignore文件来配置什么文件需要提交到远程仓库，什么文件不需要提交的远程仓库。，比如这里我不希望node_modules和bower_js下的文件提交到远程仓库，那么就可以这样配置.gitignore，当然了实际开发过程中，你根据实际需要自行配置：

```
	node_modules
	bower_js
```

#### 第五步，万事俱备，只欠东风，配置Gruntfile.js来管理前台代码吧

* 首先说明一下grunt是干嘛的，说白了就是个基于任务的命令配置文件，你写好配置文件，然后运行命令，它会在后台自动跑你要做的那些操作，比如有两个js文件a.js和b.js，希望压缩成一个文件，就可以利用grunt来实现，好了，我们来实现第一个任务吧：我们每次写完一个js文件或者css文件，然后在需要的页面手动引入它们，这个过程是不是很烦呢！其实通过grunt可是实现使用命令自动引入它们，那我们该怎么做呢？我们来看一下grunt官方文档：

![](https://github.com/woai30231/webDevDetails/blob/master/image/8_6.png)

说白了就是欲练此功，必先配置Gruntfile.js的道理，那怎么配置Gruntfile.js呢！我相信官方文档里面会有的！好，话不多说，我们来实现自动引入css、js文件的任务，首先在根目录下新建一个Gruntfile.js文件，相关代码如下：

```javascript

```