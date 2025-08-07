// TODO
// Organize all of the code below
// Create a 


const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

ctx.beginPath(); 
ctx.rect(20, 40, 50, 50)
ctx.fillStyle = "#FF0000"
ctx.fill() 
ctx.closePath()

ctx.beginPath(); 
ctx.arc(240, 160, 20, 0, Math.PI * 2, false)
ctx.fillStyle = "green"
ctx.fill() 
ctx.closePath()

ctx.beginPath(); 
ctx.rect(160, 10, 100, 40) 
ctx.strokeStyle = "green"
ctx.stroke() 
ctx.closePath()

let x=canvas.width/2
let y=canvas.height - 30
let dx = 2
let dy = -2

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.beginPath(); 
	ctx.rect(x, y, 100, 40) 
	ctx.strokeStyle = "green"
	ctx.stroke() 
	ctx.closePath()
	x+=dx
	y+=dy
}

setInterval(draw, 10)


// import * as Draw from  "./draw.js"
//
// // Variables we use to access the canvas and drawing tools
// var cnvs = document.getElementById("canvas");
//
// function createPillar(pillarSpacing, gapPos, gapWidth, gapHeight) {
// 	return {
// 		spacing: pillarSpacing, 
// 		vertGapPos: gapPos,
// 		gapWidthSize: gapWidth, 
// 		gapHeightsize: gapHeight,
// 		draw: function(start) {
// 			Draw.pillar(
// 				start, 
// 				this.spacing, 
// 				this.vertGapPos, 
// 				this.gapWidthSize, 
// 				this.gapHeightSize
// 			)
// 		}
// 	};
// }
//
// function createBird(birdSize, birdSpeed) {
// 	return {
// 		speedX: birdSpeed,
// 		speedY: 0,
// 		size: birdSize,
// 		draw: function(x, y){Draw.bird(x, y, this.size, true /*(this.speed < 0 ? true : false)*/);}
// 	};
// }
//
// function update() {
// 	
// }
//
// function draw() {
// 	
// }
//
// function gameLoop (timestamp) {
//
// 	requestAnimationFrame(gameLoop);
// }
//
// export function initGame(){
// 	Draw.init(cnvs);
// 	const bird = createBird(10, 0);
// 	console.log(bird);
// 	bird.draw(100, 100);
// 	// gameLoop();
// }
//
//
