import * as Draw from  "./draw.js"

// Variables we use to access the canvas and drawing tools
var cnvs = document.getElementById("canvas");

function createPillar(pillarSpacing, gapPos, gapWidth, gapHeight) {
	return {
		spacing: pillarSpacing, 
		vertGapPos: gapPos,
		gapWidthSize: gapWidth, 
		gapHeightsize: gapHeight,
		draw: function(start) {
			Draw.pillar(
				start, 
				this.spacing, 
				this.vertGapPos, 
				this.gapWidthSize, 
				this.gapHeightSize
			)
		}
	};
}

function createBird(birdSize, birdSpeed) {
	return {
		speedX: birdSpeed,
		speedY: 0,
		size: birdSize,
		draw: function(x, y){Draw.bird(x, y, this.size, true /*(this.speed < 0 ? true : false)*/);}
	};
}

function update() {
	
}

function draw() {
	
}

function gameLoop (timestamp) {

	requestAnimationFrame(gameLoop);
}

export function initGame(){
	Draw.init(cnvs);
	const bird = createBird(10, 0);
	console.log(bird);
	bird.draw(100, 100);
	// gameLoop();
}


