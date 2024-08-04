import { isCollide, enumStep, random, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

// Slide to the circle to collide and win points
const sketch5: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  let drawTime = 0;
  const limitTime = 60;

  let x = 300;
  let y = 0;
  let width: number = 720;
  let height: number = 350;
  let score = 0;
  let totalScore = 0;
  let speed = 2;
  let sizeBox = 50;
  const needToWin = 10;



  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
  };

  p5.draw = () => {  
    if (score >= needToWin)
    	actionFunc(enumStep.victory);
    // frameRATE * limittime
    /*if (drawTime === 30 * limitTime) {
      actionFunc(enumStep.fail);
    }*/

    p5.background(0);
    p5.rectMode(p5.CENTER);
    p5.fill(255);
    p5.rect(p5.mouseX, p5.height - 20, sizeBox, sizeBox);

    //score text
    p5.fill(255);
    p5.noStroke();
    p5.textStyle(p5.NORMAL);
    p5.text("Score: " + score, 50, 20);

    //change the y value
    y += speed;

    //circle 
    p5.fill(255);
    p5.stroke(255);
    p5.strokeWeight(5);
    p5.circle(x, y, 25);

    //screen to display when the ball goes out of the canvas
    if (y > height) {
      actionFunc(enumStep.fail);
    }
    //Area for the ball to collide and reverse direction
    if (y > height - 30 && x > p5.mouseX - sizeBox && x < p5.mouseX + sizeBox) {
      y = 0;
      score++;
      speed += 0.5;
      x = p5.random(width);
    }

    // time limit display
    /*p5.fill('yellow');
    p5.strokeWeight(0);
    p5.text(parseInt(limitTime - (drawTime / 30)), width - 50, 20);*/

    drawTime += 1;
  }

}

export const ruleSketch5 = {
	title: 'Catch the ball',
	description: 'Move your box to catch all the incoming balls'
}
export default sketch5;