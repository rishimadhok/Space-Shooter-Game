

function loadImages(){
	// To load custom images as enemy and ship
	enemyImage = new Image();
	shipImage = new Image();
	bulletImage = new Image();

	enemyImage.src = "Images/enemy.png";
	shipImage.src = "Images/player.png"
	bulletImage.src = "Images/bullet.png"
}


function init(){
// document.getElementById('mycanvas') retrieves the canvas element defined in the html file by using its id.
canvas = document.getElementById('mycanvas');
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;
console.log(canvas);
gameover = false;

// pen is an object created using the getContext() function.
pen = canvas.getContext('2d'); // 2d is passed to make 2d games in html

W = canvas.width;
H = canvas.height;
prev_counter = 0;
counter = 0;

loadImages();

// ship is the spaceship we are creating.
ship = {
	x : 300,
	y : H-50,
	w : 50,
	h : 50,
	speed : 25,
	bullets : [],

	update : function(){
		//this.x = this.x + this.speed;

		// To test the boundary conditions
		//if(this.x >= W-this.w || this.x<=0){
		//	this.speed *= -1;
		//}
	},

	draw : function(){
		// pen.drawImage() is used to load a custom image
		pen.drawImage(shipImage,ship.x,ship.y,ship.w,ship.h)

		// pen.fillRect() is used to create a rectangle
		//pen.fillRect(ship.x,ship.y,ship.w,ship.h) // (10,10) is the co-ordinate of the upper left vertex of rectange. (20,20) = (width,height)
	},

	shoot : function(){

		if(counter-prev_counter>=1){
			console.log("Shooting a bullet");

			var b = new bullet(this.x + (this.w)/2, this.y,10);
			this.bullets.push(b);
			prev_counter = counter;

			enemies.forEach(function(enemy){

			//if(isColliding(this.bullets[this.bullets.length()-1],enemy)){
			if(isCollidingWithBullet(b,enemy)){
				this.state = "inactive";
				console.log("enemy died");
				var index = enemies.indexOf(enemy);
				enemies.splice(index,1);
				}

			});

		}
		
	}

};

// Listener for events
function buttonGotPressed(e){
	if(e.key==" "){
		ship.shoot();
	}
	if(e.key=="ArrowLeft"){
		ship.x = ship.x - ship.speed;
		if(ship.x<=0){
			ship.x= 0;
		}
	}
	if(e.key=="ArrowRight"){
		ship.x = ship.x + ship.speed;
		if(ship.x >= W-ship.w){
			ship.x = W-ship.w;
		}
	}
}

document.addEventListener('keydown', buttonGotPressed);   // When spacebar is pressed, then the ship shoots the bullet

enemies = [];
var e = new enemy(10,20,5);
enemies.push(e);

}

// Class defined for a bullet
function bullet(x,y,speed){
	this.x = x;
	this.y = y;
	this.w = 4;
	this.h = 14;
	this.state = "active"
	this.speed = speed;

	this.draw = function(){

		//pen.fillStyle = "red"
		//pen.fillRect(this.x,this.y,this.w,this.h);
        pen.drawImage(bulletImage,this.x,this.y,this.w,this.h);

	}

	this.update = function(){
		this.y -= this.speed;

		if(this.y<=0){
			this.state = "inactive"
		}
	}

}

// Class defined for an enemy
function enemy(x,y,speed){
	this.x = x;
	this.y = y;
	this.w = 50;
	this.h = 50;
	this.state = "active"
	this.speed = speed;

	this.draw = function(){

		pen.drawImage(enemyImage,this.x,this.y,this.w,this.h);

	}

	this.update = function(){

		this.x = this.x + this.speed;

		// To test the boundary conditions
		if(this.x >= W-this.w || this.x<=0){
			this.speed *= -1;
		}

		this.y++;

		if(this.y<=0){
			this.state = "inactive"
		}
	}

}


function draw(){
	// In the canvas, towards the right, it is +ve x axis and towards bottom, it is +ve y axis.

	//pen.fillStyle = "green" // to fill with green color.
	//pen.fillRect(10,10,50,50) // (10,10) is the co-ordinate of the upper left vertex of rectange. (50,50) = (width,height)

	//to erase the old screen. Here, we erase the whole screen and redraw it again.
	pen.clearRect(0,0,W,H);

	pen.fillStyle = "red"  // to fill with red color.
	//Drawing the ship
	ship.draw()

	//Drawing the bullets
	ship.bullets.forEach(function(bullet){
		bullet.draw();
	});

	//Drawing the enemy
	enemies.forEach(function(enemy){
		enemy.draw();

	});

}

function update(){
	ship.update()

	ship.bullets.forEach(function(bullet){
		bullet.update();

	});

	enemies.forEach(function(enemy){
		enemy.update();
	});

    // Math.random() generates a random number between 0 and 1.
	var no =  Math.random();
	if(no<0.01){
		var x = Math.floor(Math.random()*(W-50));
		// multiplied by 100 to generate enemies in the region from 0 to 100px.
		var y = Math.floor(Math.random()*100);

		var speed = Math.random()*10 +2;
		var negative = Math.random();
		if(negative<0.5){
			speed = -speed;
		}

		var e = new enemy(x,y,speed);
		enemies.push(e);
	}

	enemies.forEach(function(enemy){
		if(isColliding(ship,enemy)){
			alert("Game over. Press OK to restart!");
			gameover = true;
		}

	});
}

function isColliding(r1,r2){
	var x_axis = Math.abs(r1.x - r2.x)<= Math.max(r1.w,r2.w);
	var y_axis = Math.abs(r1.y - r2.y)<= Math.max(r1.h,r2.h);

	return x_axis && y_axis;
}

function isCollidingWithBullet(r1,r2){
	var x_axis = Math.abs(r1.x - r2.x)<= Math.max(r1.w,r2.w);
	var y_axis = Math.abs(r1.y - r2.y)<= Math.max(r1.h,r2.h);

	return x_axis || y_axis;
}

// a function to call update() and draw()
function render(){
	draw();
	update();
	console.log("in render");
	counter++;

	// similar to setInterval()
	if(gameover == false){
		// similar to setInterval()
		window.requestAnimationFrame(render);
	}
	else{
		startGame();
	}
	}
	
function startGame(){
	init();
	render();
}

startGame();





