let font;
let flowers = [];
let message = "Happy Mother's Day";
let fontSizeAdjusted;
let targetPoints = [];
let readyToAnimate = false;

function preload() {
  font = loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);

  // Calculate appropriate font size based on canvas width
  fontSizeAdjusted = min(width / 10, height / 6);

  generateTargetPoints();
  createFlowers();

  background(255);
}

function generateTargetPoints() {
  // Clear previous points
  targetPoints = [];

  // Calculate text positioning to center it
  textSize(fontSizeAdjusted);
  let bbox = font.textBounds(message, 0, 0, fontSizeAdjusted);
  let x = (width - bbox.w) / 2;
  let y = (height + bbox.h) / 2;

  // Generate points with adaptive sampling factor (more points for larger screens)
  let sampleFactor = constrain(0.1 * (width / 1000), 0.05, 0.2);
  targetPoints = font.textToPoints(message, x, y, fontSizeAdjusted, {
    sampleFactor: sampleFactor,
    simplifyThreshold: 0,
  });
}

function createFlowers() {
  flowers = [];
  for (let pt of targetPoints) {
    flowers.push(new Flower(random(width), random(height), pt));
  }
  readyToAnimate = true;
}

function draw() {
  background(255);
  if (readyToAnimate) {
    for (let f of flowers) {
      f.update();
      f.show();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  fontSizeAdjusted = min(width / 10, height / 6);
  generateTargetPoints();
  createFlowers();
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
