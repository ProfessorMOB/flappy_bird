let canvas; 
let ctx;

export const init = newCanvas => {
	canvas = newCanvas;
	ctx = canvas.getContext('2d');
	canvas.width = innerWidth; 
	canvas.height = innerHeight;
}

const circle = (x, y, radius) => {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2);
	ctx.fill();
}

const triangle = (x1, y1, x2, y2, x3, y3) => {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2); 
	ctx.lineTo(x3, y3);
	ctx.fill();
}

// notes for future development:
// 	start describes where to start
// 	the spacing parameter describes the amount of space AFTER the previous pillar
// 	the vertGapPos param describes how far UP the gap will be placed
// 	the gap width size describes how wide the gap will be
// 	the gap height size describes how tall the gap will be

export const pillar = (start, spacing, vertGapPos, gapWidthSize, gapHeightSize) => {
	startPos = start+spacing;
	
	ctx.beginPath();
	ctx.rect(startPos, canvas.height, gapWidthSize, vertGapPos);
	ctx.fill();
	
	ctx.beginPath();
	ctx.rect(startPos, vertGapPos-gapHeightSize, gapWidthSize, 0);
	ctx.fill();
}

export const bird = (startX, startY, size, isBirdFalling) => {
	circle(startX, startY, size); 
	
	//if (isBirdFalling) {
		triangle(startX, startY, startX+50, startY+50, startX-20, 
			startY-20);
	//}
	
	triangle(startX, startY, (startX-size)*1.2, (startY-size)*1.2, (startX-size)*0.6, 
		(startY-size)*0.6);

}

