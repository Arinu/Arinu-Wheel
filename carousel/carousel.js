var box = document.querySelector('.box'),
		prev = document.querySelector('.prev'),
		next = document.querySelector('.next'),
		carousel = document.querySelector('.carousel'),
		li_group = document.querySelector('.li-group'),
		list = li_group.getElementsByTagName('li'),
		box_width, // 每张图片的宽度===当前可见视图宽度
		carousel_left_arr=[], // 用来储存所有图片的位置数组，每次更改浏览器窗口都会更新
		j, // for循环使用
		left_px, // 细分动画帧,每帧位移像素值
		left_target, // 下一张图片的图片的位置
		interval_anime=[], // 单次轮播动画定时器ID
		interval_auto='', // 自动播放定时器ID
		left_num=1; // 当前图片的位置索引
if(document.addEventListener){
  this.addEvent = function (type,ele,callback){
    ele.addEventListener(type,callback,false);
    return callback;// 此处是为了对称IE的专有事件，确保跨浏览器;
  }
  this.removeEvent = function (type,ele,callback){
    ele.removeEventListener(type,callback,false);
  }
}else if(document.attachEvent){
  this.addEvent = function (type,ele,callback){
    var fn = function (){
      return callback.apply(ele,arguments);
    }
    ele.attachEvent('on'+type,fn);
    return fn;// 返回已经绑定了this的函数;
  }
  this.removeEvent = function (type,ele,callback){
    ele.detachEvent('on'+type,callback);
  }
}
// 更新储存所有图片的位置数组
function up_arr(){ 
	box_width = box.clientWidth;
	carousel_left_arr = [];
	for(j=0; j<7; j++){
		carousel_left_arr.push(-box_width*j);
	}
	// console.log(carousel_left_arr)
}
function anime_auto(){
	interval_auto = setInterval(function() {
		anime(-box_width);
	}, 2500);
}
function anime_auto_clear(){
	clearInterval(interval_auto);
}
// 轮播动画控制总部
function anime(num){ 
	// 避免多次点击而触发
	if(interval_anime.length===1){return false}
	left_target = carousel.style.left.match(/[-.\d]*/)[0]-0 + num;
	left_px =  num / 100;
	interval_anime[interval_anime.length] = setInterval(function(){
		if((carousel.style.left.match(/[-.\d]*/)[0]-0 > left_target && num<0) || (carousel.style.left.match(/[-.\d]*/)[0]-0 < left_target && num>0) ){
			carousel.style.left = carousel.style.left.match(/[-.\d]*/)[0]-0+left_px+'px';
		}else{
			for(j=0; j<interval_anime.length; j++){
				clearInterval(interval_anime[j]);
			}
			carousel.style.left = left_target +'px';
			left_num = carousel_left_arr.indexOf(left_target)!==-1 ? carousel_left_arr.indexOf(left_target) : 0;
			if(left_num===6&&num<0){left_num = 1;carousel.style.left = carousel_left_arr[left_num]+'px';}
			if(left_num===0&&num>0){left_num = 5;carousel.style.left = carousel_left_arr[left_num]+'px';}
			for(j=0; j<list.length; j++){
				list[j].className = '';
			}
			list[left_num-1].className = 'active';
			interval_anime = [];
		}
	}, 8)
}
window.onload = function(){
	prev.style.lineHeight = next.style.lineHeight = box.clientHeight + 'px';
	addEvent('click',prev,function(){
		anime(+box_width)
	});
	addEvent('click',next,function(){
		anime(-box_width)
	});
	up_arr();
  carousel.style.left = carousel_left_arr[left_num]+'px';
	for(j=0; j<list.length; j++){
		(function(j){ // 循环闭包绑定每个li的单击事件，确保能闭包回调中的i
			addEvent('click',list[j],function(){
				anime(box_width*(left_num-1-j));
			})
		})(j)
	}
	addEvent('mouseenter',box,anime_auto_clear);
	addEvent('mouseleave',box,anime_auto);
	anime_auto();
}
// 浏览器窗口大小发生变化时
window.onresize = function(){
	anime_auto_clear();
  prev.style.lineHeight = next.style.lineHeight = box.clientHeight + 'px';
  up_arr();
  carousel.style.left = carousel_left_arr[left_num]+'px';
}