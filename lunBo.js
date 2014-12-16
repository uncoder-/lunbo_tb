'use strict';
function lunBo(opts){
	this.selector = opts.selector;
	this.duration = opts.duration||3000;
	this.init();
}
lunBo.prototype={
	init:function (){
		this.container = document.querySelector(this.selector);
		this.items = [];
		for (var i = 0; i < container.children.length; i++) {//缓存容器内部的数据
			this.items.push(container.children[i]);
		};
		this.container.innerHTML = "";
		this.container.style.overflow = "hidden";
		this.ChangeElement();
		this.autoPlay();
		//this.addEvent();
	},
	ChangeElement:function(){
		var ul = document.createElement("ul");
			ul.style.position = "relative";
			ul.style.listStyleType = "none";
			ul.style.transform = "translate3d(0px,0px,0px)";
			ul.style.width = this.container.offsetWidth*this.items.length+"px";
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].style.width = "100%";
			this.items[i].style.maxWidth = "100%";
			this.items[i].style.maxHeight = "100%";
			var li = document.createElement("li");
				li.style.position = "absolute";
				li.style.height = this.container.offsetHeight+"px";
				li.style.width = this.container.offsetWidth+"px";
				li.style.float = "left";
				li.style.left = i*this.container.offsetWidth+"px";
				li.appendChild(this.items[i]);
			ul.appendChild(li);
		};
		this.container.appendChild(ul);    			//重新写入新构造的数据
	},
	addEvent:function (){
		var that = this;
		var step = parseFloat(that.container.children[0].children[0].style.width);
		var newX,moveX,n_tl,endX;
		this.container.addEventListener("touchstart",function(event){
			that.destroyTimmer();
			newX = event.changedTouches[0].pageX;
			moveX = 0;
			n_tl = parseFloat(that.getTranslate(that.container.children[0])[4]);
		},false);
		this.container.addEventListener("touchmove",function(event){
			moveX = event.changedTouches[0].pageX-newX;
			that.container.children[0].style.transform = "translate3d("+(n_tl+moveX)+"px,0px,0px)";
		},false);
		this.container.addEventListener("touchend",function(event){
			if(Math.abs(moveX) > 10){
				if(moveX<0){
					step = Math.abs(step)*(-1);
				}else if(moveX>0){
					step = Math.abs(step);
				}
				that.container.children[0].style.transform = "translate3d("+(n_tl+step)+"px,0px,0px)";
			};
			window.setTimeout(function(){that.autoPlay();},this.duration) ;
		},false);
	},
	autoPlay:function(size){
		this.move(true,size);
	},
	destroyTimmer:function(){
		clearInterval(this.Timmer);
	},
	move:function (auto,size){
		var that = this;
		var step = parseFloat(this.container.children[0].children[0].style.width);
		var vv = that.getTranslate(that.container.children[0])[4]!=0?that.getTranslate(that.container.children[0])[4]:null;
		var size = size||Math.abs(vv)||step;  //获取当前偏移量,没有设成step;
		function move(_self){
			_self.container.children[0].style.transform = "translate3d(-"+(size)+"px,0px,0px)";
			_self.container.children[0].style.transition = "transform 500ms ease";
			size = size + step;				//递增偏移
			var index = size/parseFloat(_self.container.children[0].style.width);
			if(index >= 1){
				var item = size - parseFloat(_self.container.children[0].style.width)*parseInt(index);
				var a = item/step;        	//获取当前元素索引
				_self.container.children[0].children[a].style.left = (size)+"px";
			}
		};
		if(auto){
			this.Timmer = window.setInterval(function(){ move(that); },this.duration);
		}
	},
	getTranslate:function(_self){
      var st = window.getComputedStyle(_self, null);
      var tr = st.getPropertyValue("-webkit-transform")||st.getPropertyValue("transform");
      var values = tr.split('(')[1].split(')')[0].split(',');
      return values;
    }
}