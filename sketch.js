let font;
let flowers = [];
let fontsize = 200;

function preload() {
  font = loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
  );
}

function setup() {
  createCanvas(900, 300);
  textFont(font);
  textSize(80);
  let message = "Happy Mother's Day";
  let points = font.textToPoints(message, 50, 300, fontsize, {
    sampleFactor: 0.1, // More precise
    simplifyThreshold: 0,
  });

  for (let pt of points) {
    flowers.push(new Flower(random(width), random(height), pt));
  }

  background(255);
}

function draw() {
  background(255);
  for (let f of flowers) {
    f.update();
    f.show();
  }
}

class Flower {
  constructor(x, y, target) {
    this.pos = createVector(x, y);
    this.target = createVector(target.x, target.y);
    this.vel = p5.Vector.random2D().mult(4);
    this.acc = createVector();
    this.arrived = false;
    this.color = color(random(220, 255), random(100, 200), random(180, 255));
    this.size = random(4, 7);
  }

  update() {
    if (this.arrived) return;

    let force = p5.Vector.sub(this.target, this.pos);
    let d = force.mag();
    force.normalize();
    let strength = constrain(d * 0.1, 0, 8);
    force.mult(strength);
    this.acc = force;
    this.vel.add(this.acc);
    this.vel.limit(6);
    this.pos.add(this.vel);

    if (d < 1.5) this.arrived = true;
  }

  show() {
    noStroke();
    fill(this.color);
    if (this.arrived) {
      push();
      translate(this.pos.x, this.pos.y);
      for (let a = 0; a < TWO_PI; a += PI / 3) {
        let r = this.size;
        let x = cos(a) * r;
        let y = sin(a) * r;
        ellipse(x, y, r / 2, r / 2);
      }
      pop();
    } else {
      ellipse(this.pos.x, this.pos.y, 2, 2);
    }
  }
}
