
import { enumStep, random } from "@/utils";

// can go in "./types/global.d.ts"
type P5jsContainerRef = HTMLDivElement;
type P5jsSketch = (p: p5Types, parentRef: P5jsContainerRef, actionFunc: Function) => void;

// Slide to the circle to collide and win points
const sketch2: P5jsSketch = (p5, parentRef, actionFunc: Function) => {
  let parentStyle: CSSStyleDeclaration;
  let canvasHeight: number;
  let canvasWidth: number;
  let cnv: any;
  let drawTime = 0;
  const limitTime = 60;
  let timeoutVictory: ReturnType<typeof setTimeout>;


  class Peon {
    x: number = null;
    y: number = null;
    nextX: number = null;
    nextY: number = null;
    caseX: number = null;
    caseY: number = null;
    direction: number = null;
    w: number = null;
    vel: number = null;
    etat: string = null;
    pixelParcouru: number = null;

    constructor() {
      this.x = 0;
      this.y = 0;
      this.nextX = 0;
      this.nextY = 0;
      this.caseX = 0;
      this.caseY = 0;
      this.direction = 1;
      this.w = 20;
      this.vel = 2;
      this.etat = "static";
      this.pixelParcouru = 0;
    }

    update() {
      if (this.etat == "move") {
        this.pixelParcouru += this.vel;
        if (this.y > this.nextY) {
          // if (p5.random(0, 5) > 2.5) this.createParticules();
          this.y = this.y - this.vel;
        } else if (this.x < this.nextX) {
          // if (p5.random(0, 5) > 2.5) this.createParticules();
          this.x = this.x + this.vel;
        } else if (this.y < this.nextY) {
          // if (p5.random(0, 5) > 2.5) this.createParticules();
          this.y = this.y + this.vel;
        } else if (this.x > this.nextX) {
          // if (p5.random(0, 5) > 2.5) this.createParticules();
          this.x = this.x - this.vel;
        } else {
          this.etat = "static";
        }
      }
    };

    display() {
      p5.noStroke();
      p5.fill(0, 196, 255);
      p5.push();
      p5.rectMode(p5.CENTER);
      p5.rect(this.x + caseTaille / 2, this.y + caseTaille / 2, this.w, this.w);
      p5.rectMode(p5.CORNER);
      p5.pop();
      addPoint(this.x + caseTaille / 2, this.y + caseTaille / 2);
    };

    detection() {
      let infiniti = 800;
      // if victory no move
      if (timeoutVictory) return;

      // haut
      if (
        p5.mouseX > this.x + offset &&
        p5.mouseX < this.x + caseTaille + offset &&
        p5.mouseY < this.y + offset &&
        p5.mouseY > this.y - infiniti + offset
      ) {
        this.move(0);
      }
      // droite
      if (
        p5.mouseX > this.x + caseTaille + offset &&
        p5.mouseX < this.x + caseTaille + infiniti + offset &&
        p5.mouseY > this.y + offset &&
        p5.mouseY < this.y + caseTaille + offset
      ) {
        this.move(1);
      }
      // bas
      if (
        p5.mouseX > this.x + offset &&
        p5.mouseX < this.x + caseTaille + offset &&
        p5.mouseY > this.y + caseTaille + offset &&
        p5.mouseY < this.y + caseTaille + infiniti + offset
      ) {
        this.move(2);
      }
      // gauche
      if (
        p5.mouseX < this.x + offset &&
        p5.mouseX > this.x - infiniti + offset &&
        p5.mouseY > this.y + offset &&
        p5.mouseY < this.y + caseTaille + offset
      ) {
        this.move(3);
      }
    };

    move(direction: number) {
      this.direction = direction;
      if (this.detectWall() === 0) {
        this.etat = "move";
        switch (this.direction) {
          case 0:
            this.caseY--;
            this.nextY -= caseTaille;
            break;
          case 1:
            this.caseX++;
            this.nextX += caseTaille;
            break;
          case 2:
            this.caseY++;
            this.nextY += caseTaille;
            break;
          case 3:
            this.caseX--;
            this.nextX -= caseTaille;
            break;
        }
      }
      if (!timeoutVictory && this.caseX == labyrinthes[randomLabyrinth].victoryPosition[0]
        && this.caseY == labyrinthes[randomLabyrinth].victoryPosition[1]) {

        timeoutVictory = setTimeout(() => {
          this.grandSucces();
        }, 2000);
      }
    };

    detectWall() {
      const labyrinthe = labyrinthes[randomLabyrinth].labyrinthe;
      let destination = labyrinthe[this.caseY][this.caseX];
      switch (this.direction) {
        case 0:
          if (typeof labyrinthe[this.caseY - 1] === "undefined") return false;
          break;
        case 1:
          if (typeof labyrinthe[this.caseY][this.caseX + 1] === "undefined")
            return false;
          break;
        case 2:
          if (typeof labyrinthe[this.caseY + 1] === "undefined") return false;
          break;
        case 3:
          if (typeof labyrinthe[this.caseY][this.caseX - 1] === "undefined")
            return false;
          break;
      }
      return correspondance[destination][this.direction];
    };

    createParticules() {
      let particuleX = this.x + caseTaille / 2 + p5.random(-10, 10);
      let particuleY = this.y + caseTaille / 2 + p5.random(-10, 10);
      particules.push(new Particule(particuleX, particuleY, this.direction));
    };

    grandSucces() {
      actionFunc(enumStep.victory);
    };
  }

  class Particule {
    x: number;
    y: number;
    direction: number;
    vel: number;
    life: number;
    size: number;

    constructor(
      x: number,
      y: number,
      direction: number,
    ) {
      this.x = x;
      this.y = y;
      this.vel = 0.1;
      this.life = p5.random(0.2, 0.6); // si grand alors vie moins longtemps
      this.size = p5.random(6, 12);
    }

    display() {
      p5.fill(255, 255, 255, 100);
      p5.noStroke();
      p5.rectMode(p5.CENTER);
      p5.ellipse(this.x, this.y, this.size);
    };

    update() {
      this.size -= this.life;

      switch (this.direction) {
        case 0:
          this.y += this.vel;
          break;
        case 1:
          this.x -= this.vel;
          break;
        case 2:
          this.y -= this.vel;
          break;
        case 3:
          this.x += this.vel;
          break;
      }
    };
    delete() { };
  }

  class Point {
    x: number;
    y: number;
    life: number;

    constructor(
      x: number,
      y: number,
    ) {
      this.x = x;
      this.y = y;
      this.life = 150;
    }

    display() {
      p5.noFill();
      p5.stroke(0, 196, 255, this.life);
      p5.strokeWeight(3);
      // totest
      p5.point(this.x, this.y);
    }

    update() {
      this.life = this.life - 1;
    }
  }

  function addPoint(x: number, y: number) {
    points.push(new Point(x, y));
  }

  let caseTaille = 50;
  let offset = 40;
  let bob = new Peon();
  let step = 1;
  const labyrinthes = [
    {
      // Easy1
      victoryPosition: [9, 4], //x-y,
      labyrinthe: [
        ["k", "f", "b", "f", "f", "f", "b", "f", "f", "o"],
        ["e", "h", "g", "m", "b", "h", "g", "m", "f", "h"],
        ["l", "g", "j", "f", "i", "g", "g", "k", "f", "i"],
        ["n", "j", "f", "h", "k", "d", "a", "a", "f", "c"],
        ["j", "f", "f", "f", "f", "i", "j", "d", "o", "l"],
      ],
    },
    {
      // Middle1
      victoryPosition: [9, 0], //x-y,
      labyrinthe: [
        ["k", "f", "b", "f", "b", "f", "k", "b", "f", "o"],
        ["e", "h", "g", "m", "b", "h", "g", "j", "f", "h"],
        ["l", "g", "j", "f", "i", "g", "l", "k", "f", "i"],
        ["n", "j", "f", "h", "k", "d", "a", "a", "f", "c"],
        ["j", "f", "f", "f", "f", "i", "j", "d", "o", "l"],
      ],
    },
    {
      // Hard1
      victoryPosition: [0, 4], //x-y,
      labyrinthe: [
        ["k", "f", "b", "f", "b", "f", "k", "b", "f", "o"],
        ["e", "h", "g", "m", "b", "h", "g", "j", "f", "h"],
        ["l", "g", "j", "f", "i", "g", "g", "k", "f", "i"],
        ["n", "j", "f", "f", "f", "d", "i", "a", "f", "c"],
        ["j", "f", "f", "f", "f", "f", "f", "d", "o", "l"],
      ],
    },
  ];
  let randomLabyrinth = random(3);
  randomLabyrinth = randomLabyrinth >= labyrinthes.length ? labyrinthes.length - 1 : randomLabyrinth;

  let correspondance: { [key: string]: number[] } = {
    a: [0, 0, 0, 0],// top right bottom left
    b: [1, 0, 0, 0],
    c: [0, 1, 0, 0],
    d: [0, 0, 1, 0],
    e: [0, 0, 0, 1],
    f: [1, 0, 1, 0],
    g: [0, 1, 0, 1],
    h: [1, 1, 0, 0],
    i: [0, 1, 1, 0],
    j: [0, 0, 1, 1],
    k: [1, 0, 0, 1],
    l: [0, 1, 1, 1],
    m: [1, 0, 1, 1],
    n: [1, 1, 0, 1],
    o: [1, 1, 1, 0]
  };
  let points: any = [];
  let particules: any = [];

  function labyrintheDisplay() {
    const labyrinthe = labyrinthes[randomLabyrinth].labyrinthe;
    const victory = labyrinthes[randomLabyrinth].victoryPosition;
    for (let y = 0; y < labyrinthe.length; y++) {
      for (let x = 0; x < labyrinthe[y].length; x++) {
        p5.stroke(255);
        p5.noFill();
        drawLineNew(labyrinthe[y][x], x, y);
        if (y == victory[1] && x == victory[0]) {
          p5.fill(255, 255, 255);
          p5.rectMode(p5.CORNER);
          p5.rect(
            caseTaille * x + 10,
            caseTaille * y + 10,
            caseTaille - 20,
            caseTaille - 20
          );
        }
      }
    }
  }

  function drawLineNew(type: string, x: number, y: number) {
    p5.strokeWeight(1);
    p5.stroke(255, 255, 255, 20);
    // haut
    if (
      type == "b" ||
      type == "f" ||
      type == "h" ||
      type == "k" ||
      type == "m" ||
      type == "n" ||
      type == "o"
    ) {
      p5.strokeWeight(2);
      p5.stroke(255, 255, 255, 255);
    }
    p5.line(
      x * caseTaille,
      y * caseTaille,
      x * caseTaille + caseTaille,
      y * caseTaille
    );
    p5.strokeWeight(1);
    p5.stroke(255, 255, 255, 20);

    // droite
    if (
      type == "c" ||
      type == "g" ||
      type == "h" ||
      type == "i" ||
      type == "l" ||
      type == "n" ||
      type == "o"
    ) {
      p5.strokeWeight(2);
      p5.stroke(255, 255, 255, 255);
    }
    p5.line(
      x * caseTaille + caseTaille,
      y * caseTaille,
      x * caseTaille + caseTaille,
      y * caseTaille + caseTaille
    );

    p5.strokeWeight(1);
    p5.stroke(255, 255, 255, 20);

    // bas
    if (
      type == "d" ||
      type == "f" ||
      type == "i" ||
      type == "j" ||
      type == "l" ||
      type == "m" ||
      type == "o"
    ) {
      p5.strokeWeight(2);
      p5.stroke(255, 255, 255, 255);
    }
    p5.line(
      x * caseTaille + caseTaille,
      y * caseTaille + caseTaille,
      x * caseTaille,
      y * caseTaille + caseTaille
    );

    p5.strokeWeight(1);
    p5.stroke(255, 255, 255, 20);

    // gauche
    if (
      type == "e" ||
      type == "g" ||
      type == "j" ||
      type == "k" ||
      type == "l" ||
      type == "m" ||
      type == "n"
    ) {
      p5.strokeWeight(2);
      p5.stroke(255, 255, 255, 255);
    }
    p5.line(
      x * caseTaille,
      y * caseTaille,
      x * caseTaille,
      y * caseTaille + caseTaille
    );

    p5.strokeWeight(1);
    p5.stroke(255, 255, 255, 20);
  }

  p5.setup = () => {
    parentStyle = window.getComputedStyle(parentRef);
    canvasWidth = parseInt(parentStyle.width) * 0.99;
    canvasHeight = 350;
    cnv = p5.createCanvas(canvasWidth, canvasHeight).parent(parentRef);

    p5.textSize(20);
    p5.textFont("Open Sans");

    //p5.noStroke();
    //p5.frameRate(30);
  };

  p5.draw = () => {
    //p5.textFont("Open Sans");
    p5.background(25);
    // labyrinthe et peon a afficher
    if (bob.etat == "static") {
      bob.detection();
    }
    p5.translate(offset, offset);

    labyrintheDisplay();

    /*
    for (let p = 0; p < particules.length; p++) {
      particules[p].update();
      particules[p].display();
      if (particules[p].size < 0.25) {
        particules.splice(particules[p], 1);
      }
    }
    */

    for (let i = 0; i < points.length; i++) {
      points[i].update();
      points[i].display();
      if (points[i].life <= 0) {
        points.splice(points[i], 1);
      }
    }
    bob.update();
    bob.display();

    // frameRATE * limittime
    if (drawTime >= 30 * limitTime) {
      actionFunc(enumStep.fail);
    }

    // time limit display
    p5.fill('yellow');
    p5.text(parseInt(limitTime - (drawTime / 30)), canvasWidth - 70, 10);

    drawTime += 1;
  }

}

export const ruleSketch2 = {
  title: 'Find the exit',
  description: 'Slide to the open door to exit the tunnel before the time limit'
}
export default sketch2;