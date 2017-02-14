## 前言

* 本案例带领大家一起认识微信JSSDK，带实例demo！集合自己的工作经历，争取用最简单的话描述一下怎么用微信JSSDK在微信端开发web！

* 当然了，本着把本复杂的事情简单化的道理，这篇文档不会大刀阔斧的介绍底层原理，只会告知怎么调用相关接口以及怎么利用后台返回的信息配置公众号。这篇文档实现了分享、隐藏菜单栏等功能，其他功能我相信原理是一样的，调用相关接口就好！**如果文中有表达的不到位的地方，欢迎[指正](https://github.com/woai30231/webDevDetails/issues)，因为确实本人经验有限**

* 需要准备什么：1、了解微信JSSDK说明文档，俗话说“工欲善其事，必先利其器”说的就是这个道理，所以你先了解下它的相关接口；2、下载微信web开发者工具，这个主要是用来调试的，它可以很好的把调用js某些api后出现的情况打印在控制台！

* 相关链接地址：[微信JSSDK说明文档](https://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E6.AD.A5.E9.AA.A4.E5.9B.9B.EF.BC.9A.E9.80.9A.E8.BF.87ready.E6.8E.A5.E5.8F.A3.E5.A4.84.E7.90.86.E6.88.90.E5.8A.9F.E9.AA.8C.E8.AF.81) [微信web开发者工具](https://mp.weixin.qq.com/wiki/10/e5f772f4521da17fa0d7304f68b97d7e.html)

## 开始

* 很多在微信里面的web页面都有的功能就是分享当前页面到到朋友圈、qq微博等，我们就实现这样一个功能！1、把当前页面分享出去！2、最后再来隐藏相关菜单！整个前台代码在[这里](https://github.com/woai30231/webDevDetails/blob/master/10/demo.html)

* 老规矩，我们先把前台代码写好吧！代码(js部分)如下（需要说明：首先你需要引入微信js接口包，其实我们用jquery获取后台返回的公众号配置信息，所以还需要引入jquery.js）：

```html
	<script type="text/javascript">
		$(function(){
			$.post('./get_jsapi_sign.php',{
				share_url:window.location.href
			},function(data){
				console.log(data);
			});
		});
	</script>
```

我们看下后台的代码：


```php
<?php
	/**
     * 用于微信JS-SDK
     */
    include_once 'includeRedPackApp.php';
    include_once SERVICE_PATH.'/lib/config/WxShare.config.php';
    include_once SERVICE_PATH.'/wxapi/Wx_Common_Util.php';
    $share_url = $_POST['share_url'];
    $share_url =  explode('#',$share_url);
    $wxBaseInterface_util = new WxBaseInterface_util();
    $signPackage = $wxBaseInterface_util->getSignPackage($share_url[0]);
    $shareData = array(
        'share_app_url'=>WxShare::SHARE_APP_URL,
        'share_app_title' => WxShare::SHARE_APP_TITLE,
        'share_app_imgurl' => WxShare::SHARE_APP_IMGURL,
        'share_app_desc' => WxShare::SHARE_APP_DESC
    );
    if($signPackage) {
    	//向前台返回一个json对象
        echo json_encode(array('message'=>'js签名成功','data'=>$signPackage, 'shareData'=>$shareData,'code'=>0));
    } else {
        echo json_encode(array('message'=>'js签名失败','data'=>array(),'code'=>-1));
    }
    exit();
?>
```

此时我们打开控制台，大概能看到如下信息，截图如下：

![](https://github.com/woai30231/webDevDetails/blob/master/image/10_1.png)

* 此时我们得到后台返回的公众号配置信息，我们必须现在配置相关权限，否则我们无法调用相关接口，配置接口为config方法，在我们引入微信js包的时候，全局引入了一个wx全局变量，接口config就是wx的一个方法，好，我们改一下js前台代码，如下：

```html

	<script type="text/javascript">
	$(function(){
			$.post('./get_jsapi_sign.php',{
				share_url:window.location.href
			},function(data){
				if(data.code == 0){
					//生成签名成功
					configWxAPI(data.data);
				}else{
					//生成签名失败
					alert('有错，请稍后尝试');
				};
			});
	});
	//配置权限
	function configWxAPI(conf){
		wx.config({
			debug:false,//开启调试模式，调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端
			            //打开，参数信息会通过log打出，仅在pc端时才会打印
			appId: conf.appId,//必填，公众号的唯一标识
			timestamp:conf.timestamp,//必填，生成签名的时间戳
			nonceStr:conf.nonceStr,//必填，生成签名的随机串
			signature:conf.signature,//必填，签名
			jsApiList:[
				'checkJsApi',
		        'onMenuShareTimeline',
		        'onMenuShareAppMessage',
		        'onMenuShareQQ',
		        'onMenuShareWeibo',
		        'hideMenuItems',
		        'showMenuItems',
		        'hideAllNonBaseMenuItem',
		        'showAllNonBaseMenuItem',
		        'onRecordEnd',
		        'openLocation',
		        'getLocation',
		        'hideOptionMenu',
		        'showOptionMenu',
		        'chooseImage',
		        'uploadImage',
		        'previewImage',
		        'closeWindow',
		        'scanQRCode',
		        'chooseWXPay'
			]//必填，需要使用的JS接口列表，也就是配置你想使用的调用接口
		});
	};
</script>

```
此时我们打开微信web开发者工具控制，会打开看到这样一个信息，截图如下：

![](https://github.com/woai30231/webDevDetails/blob/master/image/10_2.png)
