
import { isCollide, enumStep, randomInt, findRandom } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p5: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

import abeilleImg from "./assets/images/ABEILLE_40.png";
import abeilleReverseImg from "./assets/images/ABEILLE_40_reverse.png";
import rucheImg from "./assets/images/RUCHE_50.png";
import ruche_darkImg from "./assets/images/RUCHE_50_dark.png";

// Select all available beehives - credit @AdrienB
const sketch3: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  let drawTime = 0;
  const limitTime = 10;
  let defaultWidth, defaultHeight;

  let difficultycoef = 0;
  //let hght = 400;
  //let wdth = 400;
  let sizehoney = 50;
  let sizebee = 40;
  let result: boolean | null = null;
  let arrayOfBees: Bee[] = [];
  let arrayOfHoney: Honey[] = [];
  let numberOfHoney = 5 + difficultycoef;
  let countertest = 0;

  // img to load for display
  let imgAbeille: any;
  let imgAbeilleReverse: any;
  let imgRuche: any;
  let imgRucheDark: any;

  //movement of bee
  const cx = 300;
  const cy = 300;
  const cr = 100;

  function collideHoney(a: { x: number, y: number }, b: { x: number, y: number }, dis: number) {
    var d = p5.dist(a.x, a.y, b.x, b.y);
    if (d < dis * sizehoney) {
      return true
    } else {
      return false
    }
  }

  function collideMouse(ax: number, ay: number, bx: number, by: number, dis: number) {
    var d = p5.dist(ax, ay, bx, by);
    if (d < dis * sizehoney) {
      return true
    } else {
      return false
    }
  }

  function overHoney(rayon: number, index: number) {
    if (arrayOfBees.length && p5.dist(arrayOfBees[index].x, arrayOfBees[index].y, arrayOfHoney[arrayOfBees[index].isSelected()].x, arrayOfHoney[arrayOfBees[index].isSelected()].y) < rayon) {
      return true;
    } else {
      return false;
    }
  }

  function movebee(i: number) {
    if (arrayOfBees.length) {
      arrayOfBees[i].targetX = arrayOfHoney[arrayOfBees[i].isSelected()].x
      arrayOfBees[i].targetY = arrayOfHoney[arrayOfBees[i].isSelected()].y
    }
  }

  function checkresult() {
    let counter = 0;
    for (let i = 0; i < arrayOfHoney.length; i++) {
      if (arrayOfHoney[i].clicked == 1) {
        counter++;
      }
    }
    if (counter == arrayOfHoney.length) {
      return true;
    }
  }

  class Honey {
    x: number = null;
    y: number = null;
    clicked: number = null;
    imgRuche: any | undefined = null;
    imgRucheDark: any | undefined = null;

    constructor(
      cColor: string,
      x: number,
      y: number,
      imgRuche: any,
      imgRucheDark: any) {
      this.x = x;
      this.y = y;
      this.clicked = 0;
      this.imgRuche = imgRuche;
      this.imgRucheDark = imgRucheDark;
    }

    display() {
      p5.image(
        !this.clicked ? this.imgRuche : this.imgRucheDark,
        this.x - sizehoney / 2,
        this.y - sizehoney / 2,
      );
      //p5.loadPixels();
      //imgRuche.loadPixels();

      //p5.fill(this.color);
      //p5.ellipse(this.x, this.y, sizehoney,sizehoney);
    }

    getX() {
      return this.x;
    }

    getY() {
      return this.y;
    }

    getClicked() {
      return this.clicked;
    }

    setClicked(clicked: number) {
      this.clicked = clicked;
    }
  }

  class Bee {
    reversed: boolean = false;
    x: number = null;
    y: number = null;
    selectedhoney: number = null;
    overhoney: boolean = null;
    cx: number = null;
    cy: number = null;
    targetX: number = null;
    targetY: number = null;
    easing: number = null;
    imgAbeille: any = null;
    imgAbeilleReverse: any = null;

    constructor(
      cColor: string,
      x: number,
      y: number,
      selectedhoney: number,
      easing: number,
      imgAbeille: any,
      imgAbeilleReverse: any,
    ) {
      this.reversed = false;
      this.x = x;
      this.y = y;
      this.selectedhoney = selectedhoney;
      this.overhoney = false;
      this.cx = cx;
      this.cy = cy;
      this.targetX = cx;
      this.targetY = cy;
      this.easing = easing;
      this.imgAbeille = imgAbeille;
      this.imgAbeilleReverse = imgAbeilleReverse;
    }

    getTargetX() {
      return this.targetX;
    }
    getTargetY() {
      return this.targetY;
    }
    setTargetX(x: number) {
      this.targetX = x;
    }
    setTargetY(y: number) {
      this.targetY = y;
    }
    getEasing() {
      return this.easing;
    }

    display() {
      /*p5.fill(this.color);
      p5.ellipse(this.x,
          this.y, sizebee,sizebee);*/

      p5.image(
        this.reversed ? this.imgAbeilleReverse : this.imgAbeille,
        this.x - sizebee / 2,
        this.y - sizebee / 2,
      );
    }

    getCx() {
      return this.cx;
    }
    getCy() {
      return this.cy;
    }
    setCx(cx: number) {
      this.reversed = this.cx > cx;
      this.cx = cx;
    }
    setCy(cy: number) {
      this.cy = cy;
    }

    getX() {
      return this.x;
    }
    getY() {
      return this.y;
    }

    setX(x: number) {
      this.x = x;
    }
    setY(y: number) {
      this.y = y;
    }

    isSelected() {
      return this.selectedhoney;
    }

    setSelected(selected: number) {
      this.selectedhoney = selected;
    }
  }

  function preload() {
    // load the original image
    imgAbeille = p5.loadImage(abeilleImg);
    imgAbeilleReverse = p5.loadImage(abeilleReverseImg);
    imgRuche = p5.loadImage(rucheImg);
    imgRucheDark = p5.loadImage(ruche_darkImg);
  }

  p5.setup = () => {
    preload();
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = parseInt(parentStyle.width) * 0.4;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);
    defaultWidth = canvasWidth;
    defaultHeight = canvasHeight;

    // init game
    let limitWhile = 100;
    let counterWhile = 0;
    let x = null;
    let y = null;
    let collision = false;
    arrayOfHoney = [];

    // create honeys
    while (arrayOfHoney.length != numberOfHoney && counterWhile++ < limitWhile) {
      if (arrayOfHoney.length == 0) {
        x = randomInt(2 * sizehoney, defaultWidth - sizehoney);
        y = randomInt(2 * sizehoney, defaultHeight - sizehoney);
        arrayOfHoney.push(new Honey("randomName", x, y, imgRuche, imgRucheDark));
      }

      countertest = 0;
      x = randomInt(2 * sizehoney, defaultWidth - sizehoney);
      y = randomInt(2 * sizehoney, defaultHeight - sizehoney);
      for (let j = 0; j < arrayOfHoney.length; j++) {
        if (collideHoney({ x, y }, arrayOfHoney[j], 2) == false) {
          countertest++;
        }
      }
      if (countertest == arrayOfHoney.length) {
        arrayOfHoney.push(new Honey("randomName", x, y, imgRuche, imgRucheDark));
      }
    }

    // create bees
    for (let i = 0; i < arrayOfHoney.length + difficultycoef; i++) {
      let x = randomInt(2 * sizebee, defaultWidth - sizebee);
      let y = randomInt(2 * sizebee, defaultHeight - sizebee);
      let selectedhoney = randomInt(0, arrayOfHoney.length - 1);
      let easing = p5.random(0.01, 0.05);
      arrayOfBees.push(
        new Bee("randomName",
          x,
          y,
          selectedhoney,
          easing,
          imgAbeille,
          imgAbeilleReverse
        )
      );
    }
  }

  p5.draw = () => {
    p5.background("beige");

    for (let i = 0; i < arrayOfHoney.length; i++) {
      arrayOfHoney[i].display();
      p5.fill(65);
      p5.text(p5.str(i), arrayOfHoney[i].getX(), arrayOfHoney[i].getY());
    }
    for (let i = 0; i < arrayOfBees.length; i++) {
      arrayOfBees[i].setCx(
        arrayOfBees[i].getCx()
        + (arrayOfBees[i].getTargetX() - arrayOfBees[i].getCx())
        * arrayOfBees[i].getEasing()
      );

      arrayOfBees[i].setCy(
        arrayOfBees[i].getCy()
        + (arrayOfBees[i].getTargetY() - arrayOfBees[i].getCy())
        * arrayOfBees[i].getEasing()
      );

      arrayOfBees[i].display();
      arrayOfBees[i].setX(arrayOfBees[i].getCx());
      arrayOfBees[i].setY(arrayOfBees[i].getCy());

      if (overHoney(1, i) == true) {
        arrayOfBees[i].setSelected(randomInt(0, arrayOfHoney.length - 1));
      }
      movebee(i);
    }

    result = checkresult();
    if (result) {
      actionFunc(enumStep.victory);
    }

    // default frameRate 60
    // frameRATE * limittime
    if (drawTime === 60 * limitTime) {
      actionFunc(enumStep.fail);
    }

    // time limit display
    //p5.fill('yellow');
    p5.text(parseInt(limitTime - (drawTime / 60)), defaultWidth - 10, 20);

    drawTime += 1;
  }

  p5.mousePressed = () => {
    for (let i = 0; i < arrayOfHoney.length; i++) {
      if (collideMouse(p5.mouseX, p5.mouseY, arrayOfHoney[i].getX(), arrayOfHoney[i].getY(), 0.75) == true) {
        arrayOfHoney[i].setClicked(1);
      }
    }

    for (let i = 0; i < arrayOfBees.length; i++) {
      if (collideMouse(p5.mouseX, p5.mouseY, arrayOfBees[i].getX(), arrayOfBees[i].getY(), 0.5) == true) {
        result = false;
      }
    }

    if (result === false) {
      arrayOfHoney.forEach(elt => elt.setClicked(0));
    }
  }

}

export const ruleSketch3 = {
  title: 'Bee Game',
  description: 'Select all available beehives'
}
export default sketch3;