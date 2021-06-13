class Mover {
  constructor(moverProps) {
    const { pX, pY, vX, vY, accX, accY, mass, radius,
      tag, color, pathLenMax, hide, hideTag, hidePath,
      hideVel, hideForce } = moverProps;
    this.position = createVector(pX, pY);
    this.initPosition = createVector(pX, pY);
    this.velocity = createVector(vX, vY);
    this.initVelocity = createVector(vX, vY);
    this.acc = createVector(accX, accY);
    this.mass = mass || 0;
    this.radius = radius || 5;
    this.tag = tag || '';
    this.dt = 0.1
    this.path = []
    this.relativePath = []
    this.color = color || '#9c9891'
    this.pathLenMax = pathLenMax || 300
    this.hide = hide || false
    this.hideTag = hideTag || false
    this.hidePath = hidePath || false
    this.hideVel = hideVel || true
    this.hideForce = hideForce || true
    this.velScale = 1
    this.forceScale = 0.2
  }

  attracted(others) {
    this.acc = createVector(0, 0)
    others.forEach((other, i) => {
      let distance = p5.Vector.sub(other.position, this.position)
      let distanceSq = distance.magSq(); // Sq: square
      let acc = distance.normalize().mult(G * other.mass / distanceSq); // 对象的方法会修改对象的值
      this.acc.add(acc)
    })
  }

  applyAcc(anotherAcc) {
    this.acc.add(anotherAcc)
  }

  update(reference) {
    // Update Position
    let dv = p5.Vector.mult(this.acc, this.dt)
    this.velocity.add(dv);
    let dx = p5.Vector.mult(this.velocity, this.dt)
    this.position.add(dx);

    // Update Path (relative to reference)
    if (this.relativePath.length < this.pathLenMax) {
      let x = this.position.x - reference.position.x
      let y = this.position.y - reference.position.y
      this.relativePath.unshift({ x, y })
    } else {
      this.relativePath.splice(-1, 1)
    }
  }

  editViewUpdate(reference) {
    // Update Position
    if (this.relativePath.length < this.pathLenMax) {
      let dv = p5.Vector.mult(this.acc, this.dt)
      this.velocity.add(dv);
      let dx = p5.Vector.mult(this.velocity, this.dt)
      this.position.add(dx);
    }

    // Update Path (relative to reference)
    if (this.relativePath.length < this.pathLenMax) {
      let x = this.position.x - reference.position.x
      let y = this.position.y - reference.position.y
      this.relativePath.push({ x, y })
    }
  }

  show(reference) {
    if (!this.hide) {
      // Draw circle
      stroke(120);
      fill(this.color)
      circle(this.position.x, this.position.y, 2 * this.radius);

      // Draw tag
      if (!this.hideTag) {
        fill(50)
        textSize(20);
        textFont(fontThinItalic);
        text(`${this.tag}`, this.position.x, this.position.y - this.radius - 2)
      }

      // Draw velocity
      if (!this.hideVel) {
        // let vX = this.velocity.x - reference.velocity.x
        // let vY = this.velocity.y - reference.velocity.y
        // let vel = createVector(vY, vX)
        // let theta = PI / 2 - vel.heading()
        // let mag = vel.mag()
        // let size = 3
        // push()
        // stroke(140);
        // fill(140)
        // translate(this.position.x, this.position.y)
        // rotate(theta)
        // line(0, 0, mag,0)
        // beginShape();
        // vertex(mag, 0);
        // vertex(mag - 3 * size, size);
        // vertex(mag - 3 * size, -size);
        // endShape(CLOSE);
        // pop()
        push()
        let vX = this.velocity.x - reference.velocity.x
        let vY = this.velocity.y - reference.velocity.y
        let scale = this.velScale;
        translate(this.position.x, this.position.y)
        stroke(200, 100, 0);
        strokeWeight(1)
        line(0, 0, vX * scale, vY * scale)
        pop()
      }

      // Draw Force
      if (!this.hideForce) {
        stroke(0, 100, 200);
        let forceScale = this.forceScale;
        line(this.position.x, this.position.y,
          forceScale * this.acc.x * this.mass + this.position.x, forceScale * this.acc.y * this.mass + this.position.y)
      }

      // Draw Path (relative to reference)
      if (!this.hidePath) {
        push()
        translate(reference.position.x, reference.position.y)
        stroke(this.color)
        strokeWeight(1)
        noFill()
        beginShape()
        this.relativePath.forEach((dot, i) => {
          vertex(dot.x, dot.y)
        })
        endShape()
        pop()
      }
    }
  }

  editViewShow(reference) {
    if (!this.hide) {
      // Draw circle
      stroke(120);
      fill(this.color)
      circle(this.initPosition.x, this.initPosition.y, 2 * this.radius);

      // Draw tag
      if (!this.hideTag) {
        fill(50)
        textSize(20);
        textFont(fontThinItalic);
        text(`${this.tag}`, this.initPosition.x, this.initPosition.y - this.radius - 2)
      }

      // Draw velocity
      if (!this.hideVel) {
        push()
        let vX = this.initVelocity.x - reference.initVelocity.x
        let vY = this.initVelocity.y - reference.initVelocity.y
        let scale = this.velScale;
        translate(this.initPosition.x, this.initPosition.y)
        stroke(200, 100, 0);
        strokeWeight(1)
        line(0, 0, vX * scale, vY * scale)
        pop()
      }

      // Draw Force
      if (!this.hideForce) {
        stroke(0, 100, 200);
        let forceScale = this.forceScale;
        line(this.position.x, this.position.y,
          forceScale * this.acc.x * this.mass + this.position.x, forceScale * this.acc.y * this.mass + this.position.y)
      }

      // Draw Path (relative to reference)
      if (!this.hidePath) {
        push()
        translate(reference.initPosition.x, reference.initPosition.y)
        stroke(this.color)
        strokeWeight(1)
        noFill()
        beginShape()
        this.relativePath.forEach((dot, i) => {
          vertex(dot.x, dot.y)
        })
        endShape()
        pop()
      }
    }
  }

}