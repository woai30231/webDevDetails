

/*****
***
**这里假设有三个函数a、b、c,它们的函数体内都用到了数字相加的函数add。
**当然了实际生产过程中，需要公用add的函数可能还会更多。
**因为这里只是举例，a、b、c之间还可能公用了其它功能，都被省略了
*****/


//首先定义公用的函数
function add(num1,num2){
	return num1+num2;
};

//a函数
function a(num1,num2){
	var sum = add(num1,num2);
	/*
	* a函数的其它功能、省略不写
	*/
};


//b函数
function b(num1,num2){
	var sum = add(num1,num2);
	/*
	* b函数的其它功能、省略不写
	*/
};


//c函数
function c(num1,num2){
	var sum = add(num1,num2);
	/*
	* c函数的其它功能、省略不写
	*/
};


/******
****
**作为对比，如果不把公用的部分提炼出来的话，
**那么a、b、c函数像下面一样
****
*******/


//a函数
function a(num1,num2){
	var sum = (function(a,b){
		return a+b;
	})(num1,num2);
	/*
	* a函数的其它功能、省略不写
	*/
};


//b函数
function b(num1,num2){
	var sum = (function(a,b){
		return a+b;
	})(num1,num2);
	/*
	* b函数的其它功能、省略不写
	*/
};


//c函数
function c(num1,num2){
	var sum = (function(a,b){
		return a+b;
	})(num1,num2);
	/*
	* c函数的其它功能、省略不写
	*/
};



/***
**
**总结：函数可以复用了！
**
****/