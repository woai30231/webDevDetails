//缓存运算结果


	function add(){
		var cache = Array.prototype.join.apply(arguments,',');
		if(add[cache]){
			return add[cache];
		}else{
			var num = 0;
			for(var i = 0,len = arguments.length;i<len;i++){
				if(Object.prototype.toString.apply(arguments[i]) == '[object Number]'){
					alert("请准确输入数字参数！");
					return 0;
				};
				num += arguments[i];
			};
			return  add[cache] = num;
		};
	};