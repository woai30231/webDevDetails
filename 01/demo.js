//缓存运算结果


	function add(){
		// var cache = Array.prototype.join.apply(arguments,[',']);
		var cache = Array.prototype.join.call(arguments,',');
		if(add[cache]){
			return add[cache];
		}else{
			var num = 0;
			for(var i = 0,len = arguments.length;i<len;i++){
				if(Object.prototype.toString.apply(arguments[i]) != '[object Number]'){
					alert("请准确输入数字参数！");
					try{
						throw new Error();
					}catch(e){
						console.log(e.message);
						return "输入参数无效！";
					};
				};
				num += arguments[i];
			};
			return  add[cache] = num;
		};
	};