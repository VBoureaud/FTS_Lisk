
import { isCollide, enumStep, random, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

// Slide to the circle to collide and win points
const sketch4: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  let drawTime = 0;
  const limitTime = 20;

  let num = 2000;
  let range = 15;

  let ax: number[] = [];
  let ay: number[] = [];
  let width: number = 720;
  let height: number = 350;

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
  
    for ( let i = 0; i < num; i++ ) {
      ax[i] = width / 2;
      ay[i] = height / 2;
    }
    p5.frameRate(30);
  };

  p5.draw = () => {  
    // frameRATE * limittime
    if (drawTime === 30 * limitTime) {
      actionFunc(enumStep.victory);
    }

    p5.background(51);
    // Shift all elements 1 place to the left
    for ( let i = 1; i < num; i++ ) {
      ax[i - 1] = ax[i];
      ay[i - 1] = ay[i];
    }

    // Put a new value at the end of the array
    ax[num - 1] += p5.random(-range, range);
    ay[num - 1] += p5.random(-range, range);

    // Constrain all points to the screen
    ax[num - 1] = p5.constrain(ax[num - 1], 0, width);
    ay[num - 1] = p5.constrain(ay[num - 1], 0, height);

    // Draw a line connecting the points
    for ( let j = 1; j < num; j++ ) {
      let val = j / num * 204.0 + 51;
      p5.stroke(val);
      p5.line(ax[j - 1], ay[j - 1], ax[j], ay[j]);
    }
    
    // time limit display
    p5.fill('yellow');
    p5.text(parseInt(limitTime - (drawTime / 30)), canvasWidth - 50, 20);

    drawTime += 1;
  }

}

export const ruleSketch4 = {
	title: 'Contemplation game',
	description: 'Observe and relax'
}
export default sketch4;