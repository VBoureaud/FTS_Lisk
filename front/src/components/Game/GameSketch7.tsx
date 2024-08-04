import { isCollide, enumStep, random, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

// Slide to the circle to collide and win points
const sketch7: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  let drawTime = 0;
  const limitTime = 30;

  let message = 'tickle',
  x: number,
  y: number,
  xCircle: number,
  yCircle: number;

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    
    x = p5.width / 2;
    y = p5.height / 2;
    xCircle = Math.floor(Math.random() * p5.width);
    yCircle = Math.floor(Math.random() * p5.height);
  };

  p5.draw = () => {  
    // frameRATE * limittime
    if (drawTime === 60 * limitTime) {
      actionFunc(enumStep.fail);
    }

    p5.background(204, 120);
    p5.fill(0);
    
    p5.textSize(65);
    p5.text(message, x, y);
    
    p5.circle(xCircle, yCircle, 50)
    
    // time limit display
    //p5.fill('yellow');
    p5.textSize(20);
    p5.text(parseInt(limitTime - (drawTime / 60)), canvasWidth - 25, 20);

    drawTime += 1;
  }

  p5.mousePressed = () => {
      x += x < p5.mouseX ? p5.random(1, 10) : p5.random(-10, -1);
      y += y < p5.mouseY ? p5.random(1, 10) : p5.random(-10, -1);

      if (isCollide(
          { x, y, width: 130, height: 30 },
          { x: xCircle, y: yCircle, width: 50, height: 50 })) {
          actionFunc(enumStep.victory);
      }
  }

}

export const ruleSketch7 = {
	title: 'Tickle',
	description: 'Find a way to reach the ball'
}
export default sketch7;