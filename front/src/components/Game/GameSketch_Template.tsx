import { isCollide, enumStep, random, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

// Slide to the circle to collide and win points
const sketch1: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  let drawTime = 0;
  const limitTime = 60;

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
  };

  p5.draw = () => {  
    if (score === totalScore)
    	actionFunc(enumStep.victory);
    // frameRATE * limittime
    if (drawTime === 30 * limitTime) {
      actionFunc(enumStep.fail);
    }
    
    // time limit display
    //p5.fill('yellow');
    p5.text(parseInt(limitTime - (drawTime / 30)), width - 50, 20);

    drawTime += 1;
  }

}

export const ruleSketch1 = {
	title: 'SketchX',
	description: 'Description'
}
export default sketch1;