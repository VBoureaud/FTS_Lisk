
import { isCollide, enumStep, random, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

// Slide to the circle to collide and win points
const sketch1: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let audioState: string;
  let cnv: any;
  let sine: any;

  let centerX = 0.0, centerY = 0.0;
  let radius = 45, rotAngle = -90;
  let accelX = 0.0, accelY = 0.0;
  let deltaX = 0.0, deltaY = 0.0;
  let springing = 0.0009, damping = 0.98;
  let drawTime = 0;
  let score = 0;
  const totalScore = 2;
  const limitTime = 60;

  //corner nodes
  let nodes = 5;

  // mouse
  let x: number,
    y: number;

  //zero fill arrays
  let nodeStartX: number[] = [];
  let nodeStartY: number[] = [];
  let nodeX: number[] = [];
  let nodeY: number[] = [];
  let angle: number[] = [];
  let frequency: number[] = [];
  let winCircle: number[] = [];

  // soft-body dynamics
  let organicConstant = 1.0;

  let width: number = 720;
  let height: number = 350;

  // game variable
  let num = 2000;
  let range = 15;
  let ax: number[] = [];
  let ay: number[] = [];

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);

    centerX = parseInt('' + canvasWidth) / 2;
    centerY = parseInt('' + canvasHeight) / 2;

    //initialize arrays to 0
    for (let i = 0; i < nodes; i++) {
      nodeStartX[i] = 0;
      nodeStartY[i] = 0;
      nodeY[i] = 0;
      nodeY[i] = 0;
      angle[i] = 0;
    }

    // iniitalize frequencies for corner nodes
    for (let i = 0; i < nodes; i++) {
      frequency[i] = p5.random(5, 12);
    }

    winCircle = findRandom([centerX, centerY], width, height, 50);
    x = p5.width / 2;
    y = p5.height / 2;


    p5.textSize(20);

    p5.noStroke();
    p5.frameRate(30);
  };

  p5.draw = () => {
    p5.fill(0, 50);
    p5.rect(0, 0, width, height);

    for (let i = 0; i < nodes; i++) {
      nodeStartX[i] = centerX + p5.cos(p5.radians(rotAngle)) * radius;
      nodeStartY[i] = centerY + p5.sin(p5.radians(rotAngle)) * radius;
      rotAngle += 360.0 / nodes;
    }

    // draw polygon
    p5.curveTightness(organicConstant);
    p5.fill(255);
    p5.beginShape();
    for (let i = 0; i < nodes; i++) {
      p5.curveVertex(nodeX[i], nodeY[i]);
    }
    for (let i = 0; i < nodes - 1; i++) {
      p5.curveVertex(nodeX[i], nodeY[i]);
    }
    p5.endShape(p5.CLOSE);

    //move center point
    deltaX = p5.mouseX - centerX;
    deltaY = p5.mouseY - centerY;

    // create springing effect
    deltaX *= springing;
    deltaY *= springing;
    accelX += deltaX;
    accelY += deltaY;

    // move predator's center
    centerX += accelX;
    centerY += accelY;

    // slow down springing
    accelX *= damping;
    accelY *= damping;

    // change curve tightness
    organicConstant = 1 - ((p5.abs(accelX) + p5.abs(accelY)) * 0.1);

    //move nodes
    for (let i = 0; i < nodes; i++) {
      nodeX[i] = nodeStartX[i] + p5.sin(p5.radians(angle[i])) * (accelX * 2);
      nodeY[i] = nodeStartY[i] + p5.sin(p5.radians(angle[i])) * (accelY * 2);
      angle[i] += frequency[i];
    }

    p5.circle(winCircle[0], winCircle[1], 50);

    // action
    if (isCollide(
      { x: centerX, y: centerY, width: 20, height: 20 },
      { x: winCircle[0], y: winCircle[1], width: 50, height: 50 })) {
      score = score + 1;
      if (score === totalScore)
        actionFunc(enumStep.victory);

      winCircle = findRandom([centerX, centerY], width, height, 50);
    }

    if (drawTime % 100 === 0)
      winCircle = findRandom([centerX, centerY], width, height, 50);

    // frameRATE * limittime
    if (drawTime === 30 * limitTime) {
      actionFunc(enumStep.fail);
    }

    // score display
    p5.fill('yellow');
    p5.text(`Score: ${score}/${totalScore}`, 10, 20);

    // time limit display
    p5.fill('yellow');
    p5.text(parseInt(limitTime - (drawTime / 30)), width - 50, 20);

    drawTime += 1;
  }

}

export const ruleSketch1 = {
  title: 'Slider',
  description: 'Slide to the circle to collide and win points before the time limit'
}
export default sketch1;