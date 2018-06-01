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
