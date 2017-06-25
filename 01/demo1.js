

/**
**
**注：这段代码是截取曾经写过的代码，
**所以不能在浏览器查看结果，所以看
**看思路就好
**/

		  (function(){
		  	$scope.orderCacheData = {};//缓存数据，用于减少向服务器请求数据
		  	var isLoding = false;//是否正在拉取数据
		  	var isLodMore = true;//是否还有数据没有拉取
		  	var initPage = 1;//初始页
		  	$scope.kz_order_list = [];

		  	var getKzOrderList = $scope.getKzOrderList = function(){
		  		if(isLoding || !isLodMore)return;
		  		isLoding = true;
		  		base.get({
		  			url:base.url.hotelOrder_list_url+"?pageNow="+initPage+"&pageSize=10&orderStatus="+$scope.initOrderStatus,
		  			success : function(data){
		  				data = data.data;
		  				isLoding = false;
		  				initPage++;
		  				if(initPage>data.totalPage){
		  					isLodMore = false;
		  				};
		  				$scope.kz_order_list = $scope.kz_order_list.concat(data.datas||[]);
		  				//向缓存中填充数据
		  				(function(){
		  					$scope.orderCacheData[$scope.initOrderStatus] = {};
		  					$scope.orderCacheData[$scope.initOrderStatus].page = initPage;
		  					$scope.orderCacheData[$scope.initOrderStatus].isLodMore = isLodMore;
		  					$scope.orderCacheData[$scope.initOrderStatus].listData = $scope.kz_order_list;
		  				})();
		  				//console.log($scope.kz_order_list);
		  			},
		  			error : function(data){
		  				console.log(data);
		  			}
		  		});
		  	};

		  	//切换查询订单的状态
		  	$scope.switchItemOrderList = function(e,index){
		  		//默认把数据清空
		  		$scope.kz_order_list = [];
		  		switch(index){
		  			case 0:$scope.initOrderStatus = 0;break;//全部订单
		  			case 1:$scope.initOrderStatus = 1;break;//待支付订单
		  			case 2:$scope.initOrderStatus = 3;break;//待入住订单
		  			case 3:$scope.initOrderStatus = 4;break;//已入住订单
		  			default:$scope.initOrderStatus = 0;return;;
		  		};
		  		angular.element(".kz_order_statistical_switch .order-list li").removeClass('active').eq(index).addClass('active');
		  		if($scope.orderCacheData[$scope.initOrderStatus]){
		  			//从缓存中拿数据
		  			console.log("缓存");
		  			$scope.kz_order_list = $scope.orderCacheData[$scope.initOrderStatus].listData;
		  			initPage = $scope.orderCacheData[$scope.initOrderStatus].page;
		  			isLodMore = $scope.orderCacheData[$scope.initOrderStatus].isLodMore;
		  		}else{
		  			//从服务器拉取数据
		  			console.log("服务器");
		  			initPage = 1;
		  			isLodMore = true;
		  			isLoding = false;
		  			getKzOrderList();
		  		};
		  		$rootScope.stopProToUp(e);
		  	};
		  	getKzOrderList();


		  	//取消订单
		  	$scope.cancelHotelOrder =  function(e,orderId){
		  		var obj = {
		  			orderId : orderId
		  		};
		  		base.post({
		  			url:base.url.hotelOrder_cancel_url,
		  			data:obj,
		  			success:function(data){
		  				base.alert(data.message,1);
		  				$state.reload();
		  			},
		  			error:function(data){
		  				if(data.code == 2){
							base.alert(data.message,0);
						}else{
							$rootScope.$state.go('error',$rootScope.$stateParams);
						};
		  			}
		  		})
		  		$rootScope.stopProToUp(e);
		  	};


		  })();