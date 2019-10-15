;(function(){
		var score=0;
		var level=1;
		var scoreBoard=document.getElementById('scoreCounter');
		var levelBoard=document.getElementById('levelCounter');
		setInterval(function(){
			score+=1;
			if(score%10==0){
				level=level+1;
			}
			scoreBoard.innerHTML=score;
			levelBoard.innerHTML=level;
		},1000);
function gameLoop(){
	this.canvas=document.getElementById('canvas');
	this.ctx=canvas.getContext('2d');
	this.position=0;
	var that=this;
	this.car = new draw(10).init();
	this.myroad= new road();
	this.array=[];
	for(var i=0;i<3;i++){
	this.obstacle= new walls().init();
	this.array.push(this.obstacle);
	}
	
	document.addEventListener("keydown",keyDownHandler,false);
	document.addEventListener("keydown",keyUpHandler,false);
	document.addEventListener("keyUp",keyUpHandler,false);
	document.addEventListener("keydown",keyRightHandler,false);
	document.addEventListener("keydown",keyLeftHandler,false);
	var interval=setInterval(function(){
		that.ctx.clearRect(0,0,that.canvas.width,that.canvas.height);
		that.myroad.init();
		that.myroad.move();
		that.car.update();
		that.car.collide();
	for(var i=0;i<3;i++){
	that.array[i].moveWall();
	that.array[i].upperCollide();
	var stop=that.array[i].ballCollide(that.car);
	if(!stop){
		document.removeEventListener("keydown",keyDownHandler);
		document.removeEventListener("keydown",keyRightHandler);
		document.removeEventListener("keydown",keyLeftHandler);
		that.array[i].stop();
		setTimeout(function(){
		document.location.reload();
		clearInterval(interval);
	},1000);
	}
	}	
	},10);

	function keyDownHandler(e){
		if(e.key=="Up"||e.key=="ArrowUp"){
			that.myroad.move();
		}
	}

	function keyUpHandler(e){
		if(e.key=="Down"||e.key=="ArrowDown"){
			that.car.moveDown();
		}
	}
	function keyRightHandler(e){
		if(e.key=="Right"||e.key=="ArrowRight"){
			that.car.moveRight();
		}
	}
	function keyLeftHandler(e){
		if(e.key=="Left"||e.key=="ArrowLeft"){
			that.car.moveLeft();
		}
	}

}
function draw(gap){
	this.canvas=document.getElementById('canvas');
	this.ctx=this.canvas.getContext('2d');
	this.width=30;
	this.height=50;
	this.dy=-5;
	var that=this;
	this.carImage=new Image();
	this.carImage.src='./images/car.png';
	
	this.x=(this.width+(this.canvas.width/2));
	this.y=(this.canvas.height-this.height)/2;
	this.dx=-(this.canvas.width/4);
	this.density=2;
	this.volume=this.height*this.width;
	this.mass=this.volume*this.density;


	

	this.init=function(){
		this.ctx.fillStyle='red';
		this.ctx.beginPath();
		this.ctx.drawImage(this.carImage,0,0,40,70,this.x,this.y,this.width,this.height);
		/*this.ctx.rect(this.x,this.y,this.width,this.height);*/
		this.ctx.fill();
		document.onclick=function(){
			this.ctx.beginPath();
			this.ctx.fillStyle='blue';
			this.ctx.rect(this.x,this.y,30,30);
			this.ctx.fill();
		}
		return this;
	}

	this.update=function(){
		this.init();
	}
	this.moveUp=function(){
		this.y+=this.dy;
	}
	this.moveDown=function(){
		this.y-=this.dy;
	}
	this.moveRight=function(){
		this.x-=this.dx;
	}
	this.moveLeft=function(){
		this.x+=this.dx;
	}

	this.collide=function(){
		if(this.x+this.dx+this.width<0){
			this.x=this.width;
		}
		if(this.x+this.width>this.canvas.width){
			this.x=this.canvas.width-2*this.width;
		}
	}



}

function road(){
	this.lanes=3;

	this.canvas=document.getElementById('canvas');
	this.ctx=this.canvas.getContext('2d');
	this.width=this.canvas.width/this.lanes;
	this.ypos=0;
	this.init=function(){
		for(var i=0;i<this.lanes;i++){
		this.ctx.beginPath();
		this.ctx.fillStyle="black";
		this.ctx.rect(i*this.width,0,this.width,this.canvas.height);
		this.ctx.fill();

		for (var j=0;j<30;j++){
			this.ctx.beginPath();
			this.ctx.fillStyle="white";
			this.ctx.rect(this.canvas.width/3,this.ypos+j*50,10,40);
			this.ctx.fill();
			this.ctx.closePath();
		}
		for (var j=0;j<30;j++){
			this.ctx.beginPath();
			this.ctx.fillStyle="white";
			this.ctx.rect(2*this.canvas.width/3,this.ypos+j*50,10,40);
			this.ctx.fill();
			this.ctx.closePath();
		}
	}
	this.move=function(){
		this.ypos+=level*1;
		if(this.ypos+700>this.canvas.height){
			this.ypos=-this.canvas.height;
		}
		this.init();
	}
		}
}
function walls(){
	this.canvas=document.getElementById('canvas');
	this.ctx=this.canvas.getContext('2d');
	this.wallWidth=50;
	this.wallHeight=50;
	this.x=Math.floor(Math.random()*this.canvas.width-this.wallWidth);
	this.y=this.canvas.height+this.wallHeight;
	this.vehicleImage=new Image();
	this.vehicleImage.src='./images/truck.png';

	this.dx=0;
	this.dy=2;
	var that=this;

	this.init=function(){
		
		this.ctx.beginPath();
		this.ctx.fillStyle="blue";
		this.ctx.drawImage(this.vehicleImage,0,0,50,50,this.x,this.y,this.wallWidth,this.wallHeight);
		/*this.ctx.rect(this.x,this.y,this.wallWidth,this.wallHeight);*/
		this.ctx.fill();
		return this;
	}

	this.moveWall=function(){
		this.y+=this.dy;
		this.init();
	}

		this.upperCollide=function(){
			var change=Math.random()<0.5?Math.floor(Math.random()*100):-Math.floor(Math.random()*100);
			this.dy=level*2;
			if(this.y+this.dy+this.wallHeight>this.canvas.height){
				this.y=-this.canvas.height;
				this.wallHeight-=change;
					if(this.wallHeight<0||this.wallHeight>50){
						this.wallHeight=50;
					}
					this.y=Math.floor(Math.random()*(0-this.canvas.height));
					this.x=Math.floor(Math.random()*(this.canvas.width-this.wallWidth));
				if(this.x+this.dx+this.wallWidth>this.canvas.width){
					this.dx=-this.dx;
			}

			}
		}

	this.ballCollide=function(ball){
		if(ball.x < this.x + this.wallWidth &&
		   ball.x + ball.width > this.x &&
		   ball.y < this.y + this.wallHeight &&
		   ball.y + ball.height > this.y){
				this.ctx.drawImage(this.vehicleImage,50,0,50,50,this.x,this.y,this.wallWidth,this.wallHeight);
				return false;
			}
			else{
				return true;
			}
		}

		this.stop=function(){
			this.dy=0;
			this.dx=0;
		}
}


new gameLoop();
var application=document.getElementById('app');

var restartButton=document.getElementById('restart');
restartButton.onclick=function(){
	var canvas=document.getElementById('canvas');
	application.removeChild(canvas);
	var newCanvas=document.createElement('canvas');
	newCanvas.width=1000;
	newCanvas.height=600;
	newCanvas.id='canvas';
	application.appendChild(newCanvas);
	score=0;
	level=1;
	new gameLoop();
}



})()
