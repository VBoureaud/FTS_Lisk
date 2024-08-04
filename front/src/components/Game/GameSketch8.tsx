import { isCollide, enumStep, random, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

import background from "./assets/images/backgroundSmall.jpg";

// Slide to the circle to collide and win points
const sketch8: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  const limitTime = 60;
  let img: any;
  let radius = 15;
  let xCircle: number, yCircle: number;
  let drawTime: number = 0;
  let isMobile: boolean = false;
  let defaultWidth = 690;
  let defaultHeight = 388;

  function preload() {
    // load the original image
    const imgtoload = background;
    img = p5.loadImage(imgtoload);
  }

  function drawMobile() {
      for (let x = 0; x < defaultWidth; x++) {
          const NUM_DOTS = 10;
          for(let i = 0; i < NUM_DOTS; i++) {
            let xEllipse = Math.random() * defaultWidth;
            let yEllipse = Math.random() * defaultHeight;
            p5.fill(Math.random() * 10 > 5 ? 80 : 255);
            p5.ellipse(xEllipse, yEllipse, 10, 10);
          }
      }
  }

  p5.setup = () => {
    preload();
    //parentStyle = window.getComputedStyle(parentRef);
    //canvasWidth = parseInt(parentStyle.width) * 0.99;
    //canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(defaultWidth, defaultHeight).parent(parentRef);
    p5.pixelDensity(1);
    p5.frameRate(30);

    xCircle = Math.floor(Math.random() * p5.width);
    yCircle = Math.floor(Math.random() * p5.height);

    if (isMobile) drawMobile();
  };

  p5.draw = () => {  
    /*if (score === totalScore)
    	actionFunc(enumStep.victory);*/
    // frameRATE * limittime
    if (drawTime === 30 * limitTime) {
      actionFunc(enumStep.fail);
    }
    
    if (!isMobile) {
      p5.image(img, 0, 0);
      // Only need to load the pixels[] array once, because we're only
      // manipulating pixels[] inside draw(), not drawing shapes.
      p5.loadPixels();
      // We must also call loadPixels() on the PImage since we are going to read its pixels.
      img.loadPixels();
      for (let x = 0; x < img.width; x++) {
          for (let y = 0; y < img.height; y++ ) {
            // Calculate the 1D location from a 2D grid
            let loc = (x + y*img.width)*4;
            // Get the R,G,B values from image
            let r,g,b;
            r = img.pixels[loc];
            g = img.pixels[loc+1];
            b = img.pixels[loc+2];
            // Calculate an amount to change brightness based on proximity to the mouse
            // The closer the pixel is to the mouse, the lower the value of "distance"
            let maxdist = 50;//dist(0,0,width,height);
            let d = p5.dist(x, y, p5.mouseX, p5.mouseY);
            let adjustbrightness = 255*(maxdist-d)/maxdist;
            r += adjustbrightness;
            g += adjustbrightness;
            b += adjustbrightness;
            // Constrain RGB to make sure they are within 0-255 color range
            r = p5.constrain(r, 0, 255);
            g = p5.constrain(g, 0, 255);
            b = p5.constrain(b, 0, 255);
            // Make a new color and set pixel in the window
            let pixloc = (y*p5.width + x)*4;
            p5.pixels[pixloc] = r;
            p5.pixels[pixloc+1] = r;
            p5.pixels[pixloc+2] = r;
            p5.pixels[pixloc+3] = 255; // Always have to set alpha
          }
      }
      p5.updatePixels();
    }

    if (isMobile || drawTime > 50) {
      p5.fill(0);
      p5.ellipse(xCircle, yCircle, radius, radius);
    }

    // time limit display
    p5.fill('white');
    p5.text(parseInt(limitTime - (drawTime / 30)), defaultWidth - 25, 20);

    drawTime += 1;
  }

  p5.mousePressed = () => {
      if (isCollide(
          { x: p5.mouseX, y: p5.mouseY, width: radius, height: radius },
          { x: xCircle, y: yCircle, width: radius, height: radius })) {
          actionFunc(enumStep.victory);
      }
  }

}

export const ruleSketch8 = {
	title: 'Brightness',
	description: 'Find the hidden ball'
}
export default sketch8;