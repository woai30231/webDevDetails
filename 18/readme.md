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
