import { isCollide, enumStep, random, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

// Slide to the circle to collide and win points
const sketch6: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  let drawTime = 0;
  const limitTime = 60;

  let mx = 1;
  let my = 1;
  let easing = 0.05;
  let radius = 24;
  let edge = 100;
  let inner = edge + radius;
  let xCircle: number, yCircle: number;

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);

    p5.noStroke();
    p5.ellipseMode(p5.RADIUS);
    p5.rectMode(p5.CORNERS);

    xCircle = Math.floor(Math.random() * p5.width);
    yCircle = Math.floor(Math.random() * p5.height);
  };

  p5.draw = () => {  
    // frameRATE * limittime
    if (drawTime === 30 * limitTime) {
      actionFunc(enumStep.fail);
    }

    p5.background(230);

    if (p5.abs(p5.mouseX - mx) > 0.1) {
        mx = mx + (p5.mouseX - mx) * easing;
    }
    if (p5.abs(p5.mouseY - my) > 0.1) {
        my = my + (p5.mouseY - my) * easing;
    }

    mx = p5.constrain(mx, inner, p5.width - inner);
    my = p5.constrain(my, inner, p5.height - inner);
    p5.fill(237, 34, 93);
    p5.rect(edge, edge, p5.width - edge, p5.height - edge);
    p5.fill(255);
    p5.ellipse(mx, my, radius, radius);

    p5.fill(207, 34, 93);
    p5.ellipse(xCircle, yCircle, radius, radius);
    p5.fill(255);
    
    // time limit display
    p5.fill('black');
    p5.text(parseInt(limitTime - (drawTime / 30)), canvasWidth - 50, 20);

    drawTime += 1;
  }

  p5.mousePressed = () => {
      if (isCollide(
          { x: mx, y: my, width: radius, height: radius },
          { x: xCircle, y: yCircle, width: radius, height: radius })) {
          actionFunc(enumStep.victory);
      } else {
          xCircle = Math.floor(Math.random() * p5.width);
          yCircle = Math.floor(Math.random() * p5.height);
      }
  }

}

export const ruleSketch6 = {
	title: 'Out of the box',
	description: 'Find a way to make the ball collide'
}
export default sketch6;