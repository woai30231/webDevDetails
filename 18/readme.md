我们在开发的过程中，经常会有这样一种情况，函数被频繁的调用，如果这个函数执行了某些dom操作的话，那么浏览器将会非常耗费性能，从而影响用户体验。

比如下面的代码，我们在滚动的过程中，会频繁的调用函数：

```html
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>demo</title>
    <style type="text/css">
        body{
            height:3000px;
        }
    </style>
</head>
<body>
    <script>
        function fn(){
            console.log("invoke fn function");
        };
        document.body.onscroll = fn;
    </script>
</body>
</html>
```

我们打开浏览器，然后打开控制台，滚动鼠标的时候，控制台频繁的打印“invoke fn function”。我们这里为了显示，所以没有涉及到相关dom操作，但是实际开发过程中，更多场景是操作dom，那么将会使你的浏览器瞬间卡卡的感觉，有没有法子来限制一下fn的调用频率呢，答案是可以的，对此，我们将上面的代码改变如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>demo</title>
    <style type="text/css">
        body{
            height:3000px;
        }
    </style>
</head>
<body>
    <script>
        function fn(){
            console.log("invoke fn function");
        };
        document.body.onscroll = avoidShak(fn,300);
        // 限制调用频率
        function avoidShak(fn,time){
            //设置定时器
            let timer;
            return function(...args){
                //清空上一次的定时器
                clearTimeout(timer);
                //获取执行环境的上下文
                let context = this;
                let _arguments = args;
                timer = setTimeout(()=>{
                    fn.apply(context,_arguments);
                },time);
            };
        };
    </script>
</body>
</html>
```

我们现在发现打开浏览器，滚动的时候不会那么频繁的调用fn函数了，只有当我们滚动的间隙稍微停顿300毫秒的时候才会调用一次，这样我们就做到了降低函数调用的频率了。

它的**原理**其实很简单：1 用闭包实现一个timer变量，用来保存上一次调用函数的定时器id;2 我们不是直接调用函数，而是中间需要一个间隔，如果两次调用之间的时间差小于我们传递的值，那么清空上一次的调用值；3 我们每一次调用的时候都清除一下上一次的调用定时器id，这样就保证了，如果间隔时间小于我们设置的值，那么上一次函数一定不会调用，从而达到了降低调用频率的效果。

上面这种通过设置定时器保证一段时间内事件回调函数只能执行一次的做法在javascript业界有一个专业的术语称谓——**防抖**！

上面的防抖操作，我们发现减少了回调函数调用的频率，但是它有一点点瑕疵：如果我们一直触发事件，回调函数只会在我们停止触发事件并达到了设置的时间间隔之后才会调用一次，也就是说在我们触发事件的过程中，回调函数一直没有执行，这在某些情况下，会跟实际业务需求不符。实际业务需求可能是，1 减少触发频率；2 但不能中间很大一段时间一直不执行。ok，那么此时我们就需要通过函数**节流**来实现！

把下面的代码在浏览器中打开，并水平缩放浏览器，看效果：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>demo</title>
    <style type="text/css">
        *{
            margin:0px;
            padding:0px;
            vertical-align:baseline;
            -webkit-box-sizing:border-box;
            -moz-box-sizing:border-box;
            box-sizing:border-box;
        }
        .box{
            width:1000px;
            height: 500px;
            background-color:#ccc;
            color:#fff;
            font-size:20px;
            padding:15px 20px;
            text-align:left;
        }
    </style>
</head>
<body>
    <div class="box" id="box">i am a div box,please resize the browser horizontally!</div>
    <script type="text/javascript">
        let dom = document.getElementById('box');
        function setWidth(){
            let windowWidth = window.innerWidth;
            if(windowWidth>=1000)return;
            dom.style.width = windowWidth + 'px';
        };
        //采用防抖实现限制回调函数调用频率
        function avoidShak(fn,time){
            let timer;
            return function(...args){
                clearTimeout(timer);
                let context = this;
                let _arguments = args;
                timer = setTimeout(()=>{
                    fn.apply(context,_arguments);
                },time);
            };
        };

        window.onresize = avoidShak(setWidth,300);

    </script>
</body>
</html>
```

先来说下上面的页面需求：打开页面，在浏览器水平缩放的过程中，如果浏览器宽度不小于1000，那么不做任何事，否则设置dom的宽度为当前浏览器的宽度。

但是我们发现，我们在缩放的过程中，dom的尺寸并未做相应的更新，只有在停止缩放一段时间后，dom的宽度才更新到浏览器的宽度，这跟业务需求不符，于是我们代码改变如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>demo</title>
    <style type="text/css">
        *{
            margin:0px;
            padding:0px;
            vertical-align:baseline;
            -webkit-box-sizing:border-box;
            -moz-box-sizing:border-box;
            box-sizing:border-box;
        }
        .box{
            width:1000px;
            height: 500px;
            background-color:#ccc;
            color:#fff;
            font-size:20px;
            padding:15px 20px;
            text-align:left;
        }
    </style>
</head>
<body>
    <div class="box" id="box">i am a div box,please resize the browser horizontally!</div>
    <script type="text/javascript">
        let dom = document.getElementById('box');
        function setWidth(){
            let windowWidth = window.innerWidth;
            if(windowWidth>=1000)return;
            dom.style.width = windowWidth + 'px';
        };
        //采用节流实现限制回调函数调用频率
        function ttrottle(fn,time){
            let isNeedInvoke = true;
            return function(...args){
                if(!isNeedInvoke)return;
                let context = this;
                let _arguments = args;
                isNeedInvoke = false;
                setTimeout(()=>{
                    fn.apply(context,_arguments);
                    isNeedInvoke = true;
                },time);
            };
        };

        window.onresize = ttrottle(setWidth,300);

    </script>
</body>
</html>
```
我们发现经过这样改过之后，dom的宽度变成在我们缩放的过程中也会更新了，满足了我们业务需求。

好了，我们来简单介绍下什么是**节流**！

节流其实从名字上就知道它的含义——就是限制函数调用频率。

主要有两种方式实现：

* 法一：时间差，原理无非就是两次调用之间的时间差小于设置时，那么不调用，反之调用。代码如下：

```javascript
function ttrottle(fn,time){
  //上一次调用时间
  let lastInvokeTime = new Date().getTime();
  //当前调用时间
  let currentInvokeTime;
  return function(){
    currentInvokeTime = new Date().getTime();
    if(currentInvokeTime - lastInvokeTime <= time)return;
    let context =
  };
};
```



