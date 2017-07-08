## 前言

当前前端发展的很快，相关的框架更是此起彼伏，但纵观局势，也有angular、vue及react三个框架在前端web app搭建方面成三足鼎立之势！它们之间彼此有类似的地方，也有属于自己的不同的实现原理，它们之间没有谁能够一定取代另外两个框架从而成垄断技术，就像web发展到今天，没有永恒的框架一样，新框架出的很快，旧框架都会被新框架淘汰，说不定明天就有一个框架出来，它兼顾了angular1、react、vue三者所具有的好处！只是结合你项目，它们在实现上、性能以及效率方面有不同的着重点而已。

由于我自己实话说也算不上所谓的这方面技术大牛（但我会坚持朝这个方向靠拢），所以本篇文档并不会给你介绍三种框架的内部实现和底层原理！本文档只会从他们之间的共同点、思想上来说明一下他们之间的区别，从而告诉你在分别学习这个三个框架的时候有的放矢！

相关示例代码可以到对应[angular]()、[vue]()及[react]()目录下查看！

**注：文档都是建立在我自己在开放过程中一些实际操作上，所以跟你自己实现上有点区别，请知悉！**

当然了，不对的地方，欢迎来[这里]()讨论！

## 组件思想

首先说下三个框架都有组件的概念，首先说一下组件到底是个什么东西，以及在三个框架中怎么去理解他们！按我自己的理解，组件就是一个个独立的单元，里面封装了一些特定的功能，这样一些组件可是实现复用！形象地作一个比喻：如何把一个人看作一个整体，那么你可以理解成这个人是由眼睛、鼻子、嘴巴以及穿衣等等构成的，这些每个独立的功能单元你就可以把它理解成组件，更有甚者，一个html文件，每个标签也可以看作一个组件，由这些组件构成了我们的html文档。好，我们来分别看看三个框架是怎么封装一个组件的！

* **angular1**:严格来说，angular是没有组件这样一个概念的，但是它可以通过指令去封装一些特定功能的单元，从而实现类似其它框架的组件功能。如：

``` html 
    <!--实现一个自定义组件 custom-component-->
    <div ng-app="app">
        <custom-component></custom-component>
    </div>
```

```javascript
    angular.module('app',[])
    .directive('customComponent',function(){
        return {
            restrict:'EA',
            template:'<div></div>i am directive,i can encapsulate some features</div>',
            scope:{}
        };
    });
```

* **vue**:vue是有组件的概念的，vue的组件概念其实跟angular的指令差不多，只不过更形象的一点。有两种方法可以实现组件：

```html
    <div id="app"></div>
```

```javascript
    Vue.component('customComponent',{
        template:'<p>i am component,i can get data from parent element with props. i can get data from data setter yet,eg: {{msg}}</p>',
        data:function(){
            return {
                msg:'hello world!'
            };
        }
    });
    new Vue({
        el:'#app',
        template:'<custom-component></custom-component>'
        /*data:{
            currentView:'customComponent'
        },
        render(h){return h(this.currentView);}*/
    });
```

* **react**:在react中，最核心的就是组件概念了，因为react的思想就是专注于ui层，通过构建组件，来构成我们的用户界面。我们来看一下在react中怎么实现组件。

```html
    <div id="app"></div>
```

```javascript
    function CustomComponent(props){
        return (<div>
            i am a react component,i can get data from props and state!
        </div>);
    };

    ReactDOM.render(
        <CustomComponent />,
        document.getElementById('app')
    );
```