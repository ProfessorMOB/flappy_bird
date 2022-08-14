// TODO:
// 	test collider, game object, and game manager classes
// 	fix issues

/*			Points
 * 
 * This is arguably the most important class of the engine.
 * It's used to to define a coordinate so all the other
 * classes of the engine and games can use to implement the
 * game.
 */


// objectPoint class, create a point object for us to use
class point {

	x = 0; // x coordinate
	y = 0; // y coordinate

	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}

}


/*			Displacement
 * 
 * The objectDisplacement class defines how many pixels an object 
 * goes for each millisecond. i.e. game object x can go 20 pixels
 * for each millisecond. 
 */


// describes how a game object moves
class objectDisplacement {
	
	velx = 0; // x velocity
	vely = 0; // y velocity
	
	accx = 0; // x acceleration
	accy = 0; // y acceleration

	constructor(velx=0, vely=0, accx=0, accy=0){
		
		this.velx = velx; 
		this.vely = vely;
		
		this.accx = accx; 
		this.accy = accy; 
	}
}

/* 				Shapes
 *
 * Below are the functions used to make the shapes. You build 
 * a new shape with them, and with the shape function, you can 
 * offset and (re)draw them. 
 * 
 * The polygon function has an array of points which are used to
 * draw a polygon. 
 *
 * The arc function has several arguments which are used to draw
 * an arc. 
 *
 * And etc. etc.
 */


// function to create a polygon object
var polygon = (...points) => ({
	
	Polygon: Array.from(points), 	// points of the polygon
	
	offset(offsetx, offsety) {

		// offset each point in the Polygon array
		for (var x = 0; x < this.Polygon.length; x++) {
			this.Polygon[x].x+=offsetx; this.Polygon[x].y+=offsety;
		}
	},
	
	// draw the Polygon onto a path
	draw(path) {this.Polygon.forEach((point) => {path.lineTo(point.x, point.y)})}
});

// functiont to create an arc object
var arc = (cp, sa, ea, r) => ({

	centerPoint: cp,		// the point in which the arc is centered
	startAngle: sa,			// the angle to start at
	endAngle: ea,			// the angle to end with
	radius: r,			// radius of the circle the arc is going to be based on
	endPoint: {			// the end point of the circle to move to
		x: cp.x+Math.cos(ea)*r, 
		y: cp.y+Math.sin(ea)*r
	},
	
	// offset the center and end points
	offset(offsetx, offsety) {this.endPoint.x+=offsetx; this.endPoint.y+=offsety; this.centerPoint.x+=offsetx; this.centerPoint.y+=offsety},
	
	draw(path) {
		path.arc(this.centerPoint.x, this.centerPoint.y, 
			this.radius, this.startAngle, this.endAngle); 
		
		path.moveTo(this.endPoint.x, this.endPoint.y);
	}
});

// the shape function, it returns a path to draw with ctx.fill or ctx.stroke
var shape = (beginPoint, ...shapes) => ({
	
	begin: beginPoint, 
	shapeList: shapes,		// the shapes to draw the final

	drawShape(offsetPoint) {
		let path = new Path2D();

		this.begin.x+=offsetPoint.x; this.begin.y+=offsetPoint.y;
		path.moveTo(this.begin.x, this.begin.y);

		for (var shape of this.shapeList) {
			
			shape.offset(offsetPoint.x, offsetPoint.y);
			shape.draw(path);
		}

		path.closePath();

		return path;
	}

});


/*			Collision Detection
 * 
 * The objectCollider class creates a collision box for
 * the game objects. It's used to detect the collision,
 * but not to do anything with it. That job belongs to
 * the gameObject class. It uses AABB collision 
 * detection. 
 */


// creates collider for gameObject
class objectCollider{

	startPoint = {};	// the point to start the box
	width = 0;		// the width of the box
	height = 0;		// the height of the box

	constructor(start, width, height) {

		this.startPoint.x=start.x;
		this.startPoint.y=start.y;
		
		this.width=width;
		this.height=height;
	}
	
	// check a collision with another collider object
	checkCollision(collisionBox) {
		if (this.startPoint.x < (collisionBox.startPoint.x + collisionBox.width) && (this.startPoint.x + this.width) > collisionBox.startPoint.x && this.startPoint.y < (collisionBox.startPoint.y + collisionBox.height) && (this.startPoint.y + this.height) > collisionBox.startPoint.y) {
			return true;
		}
	}
}

class gameObject {
	
	name = "";			// name of game object
	shape = {};			// shape of game object 
	shapePath = undefined; 
	// displacement properties
	displacement = {};		// how game object moves
	usePhysics = true;		// enable physics, enabled
	
	// collider properties
	collider = {}; 			// collider of game object
	useCollider = true;		// option to use collider
	collisionListeners = [];	// execute upon collision
	
	gameObjectActions = [];		// actions to perform
	
	constructor(name, displacement, shape, collider){
		
		this.name = name;

		this.displacement.velx = displacement.velx;
		this.displacement.vely = displacement.vely;

		this.displacement.accx = displacement.accx;
		this.displacement.accy = displacement.accy;
		
		this.shape = shape;
		this.collider = collider;
	}

	// move game object to desired position from offset
	move(deltaTime){
		
		if (!deltaTime) return;
		
		let velx = this.displacement.velx / deltaTime;
		let vely = this.displacement.vely / deltaTime;

		this.shapePath = this.shape.drawShape({x: velx, y: vely});
		
		this.collider.startPoint.x+=velx;
		this.collider.startPoint.y+=vely;

		velx += this.displacement.accx / deltaTime;
		vely += this.displacement.accy / deltaTime; 
	}
	
	// add listener to execute function(s) after collision
	addCollisionListener(listener) {

		this.collisionListeners.push(listener);
	}
	addGameObjectAction(action){

		this.gameObjectActions.push(action);
	}
}

// the game manager to process the game
class gameManager {
	
	previousTime = 0;	// the previous timestamp
	gameObjects = [];	// array of gameObjects
	canvas = undefined;	// the canvas
	ctx = undefined;	// the context
	
	// create the manager with the canvas and gameObjects
	constructor(canvas, ...gameObjects) {
		
		this.gameObjects = [...gameObjects];
		
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}
	
	// retrieve the game object by its name
	getGameObjectIndexByName(name){
		for(var x = 0; x < this.gameObjects.length; x++) {
			if (this.gameObjects[x].name == name) {
				return x
			}
		}
		return -1;
	}
	
	// the function we run on loop
	gameLoop(timestamp){
		
		let deltaTime = timestamp - this.previousTime;		// we retrieve the change in time from now and the last time
		this.previous = timestamp;				// reset the time
		
		
		console.log(deltaTime);

		for (var x = 0; x < this.gameObjects.length; x++){
			
			// execute the game object's actions
			for ( var j = 0; j < this.gameObjects[x].gameObjectActions.length; j++) {
				this.gameObjects[x].gameObjectActions[j]();
			}
			
			// we update the position depending on the velocity and acceleration
			if (this.gameObjects[x].usePhysics == true) {
				
				this.gameObjects[x].move(deltaTime); // the deltatime to be inserted
			}
			
			// execute collision listeners upon a collision
			if (this.gameObjects[x].useCollider == true) {

				for(var f=1+x; f < this.gameObjects.length; f++){

					if(this.gameObjects[x].collider.checkCollision(this.gameObjects[f].collider)) {
					
						for(var o = 0; o < this.gameObjects[x].collisionListeners.length; o++){
						
							this.gameObjects[x].collisionListeners[o]();
						}
					}
				}
			}
			
			this.ctx.stroke(this.gameObjects[x].shapePath);
		}
		requestAnimationFrame(gameLoop);
	}
}


export {
	point, 
	objectDisplacement, 
	polygon, 
	arc, 
	shape, 
	objectCollider, 
	gameObject, 
	gameManager
};

