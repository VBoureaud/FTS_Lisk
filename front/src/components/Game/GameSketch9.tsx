import { isCollide, enumStep, random, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

// Slide to the circle to collide and win points
const sketch9: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  let drawTime = 0;
  const limitTime = 60;

  let x:number[] = [],
    y:number[] = [],
    segNum = 20,
    segLength = 18;
  let winCircle: number[] = [];
  let eatTime = 0;
  const snakeNeed = 5;

  for (let i = 0; i < segNum; i++) {
      x[i] = 0;
      y[i] = 0;
    }

  let width: number = 720;
  let height: number = 350;

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);

    p5.strokeWeight(9);
    p5.stroke(255, 100);

    winCircle = findRandom([p5.mouseX, p5.mouseY], width, height, 9);
  };

  p5.draw = () => {  
    // frameRATE * limittime
    if (drawTime === 60 * limitTime) {
      actionFunc(enumStep.fail);
    }
    

    p5.background(0);
      // draw mouse

    dragSegment(0, drawTime < 100 ? width / 2 : p5.mouseX, drawTime < 100 ? height / 2 : p5.mouseY);
    // draw points
    for (let i = 0; i < x.length - 1; i++) {
      dragSegment(i + 1, x[i], y[i]);
      if (isCollide(
          { x: p5.mouseX, y: p5.mouseY, width: 9, height: 9 },
          { x: x[i], y: y[i], width: 9, height: 9 })) {
          actionFunc(enumStep.fail);
      }
    }

    p5.circle(winCircle[0], winCircle[1], 9);

    if (isCollide(
        { x: p5.mouseX, y: p5.mouseY, width: 9, height: 9 },
        { x: winCircle[0], y: winCircle[1], width: 9, height: 9 })) {
        if (eatTime < snakeNeed) {
          eatTime++;
          for (let i = 0; i < 5; i++) {
            x.push(0);
            y.push(0);
          }
          winCircle = findRandom([p5.mouseX, p5.mouseY], width, height, 9);
        } else {
          actionFunc(enumStep.victory);
        }
    }

    // time limit display
    p5.fill('yellow');
    p5.strokeWeight(1);
    p5.stroke(0, 0);
    p5.text(parseInt(limitTime - (drawTime / 60)), canvasWidth - 25, 20);

    p5.strokeWeight(9);
    p5.stroke(255, 100);

    drawTime += 1;
  }

  function dragSegment(i: number, xin: number, yin: number) {
    const dx = xin - x[i];
    const dy = yin - y[i];
    const angle = p5.atan2(dy, dx);
    x[i] = xin - p5.cos(angle) * segLength;
    y[i] = yin - p5.sin(angle) * segLength;
    segment(x[i], y[i], angle);
  }

  function segment(x: number, y: number, a: number) {
    p5.push();
    p5.translate(x, y);
    p5.rotate(a);
    p5.line(0, 0, segLength, 0);
    p5.pop();
  }
}

export const ruleSketch9 = {
	title: 'Snake',
	description: 'Eat all the balls but be careful'
}
export default sketch9;