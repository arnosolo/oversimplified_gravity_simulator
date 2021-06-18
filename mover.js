class Mover {
  constructor(moverProps) {
    const { pX, pY, vX, vY, accX, accY, mass, radius,
      tag, color, pathLenMax, hide, hideTag, hidePath,
      hideVel, hideForce, velScale, forceScale,
      forceColor, velColor } = moverProps;
    this.position = createVector(pX, pY);
    this.initPosition = createVector(pX, pY);
    this.velocity = createVector(vX, vY);
    this.initVelocity = createVector(vX, vY);
    this.acc = createVector(accX, accY);
    this.initAcc = createVector();
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
    this.velScale = velScale || 1
    this.forceScale = forceScale || 0.02
    this.forceColor = forceColor || '#7f8fa6'
    this.velColor = velColor || '#8c7ae6'
    this.frameCount = 0
  }

  attracted(others) {
    this.acc = createVector(0, 0)
    others.forEach(other => {
      // console.log(this.frameCount, other.tag);
      let distance = p5.Vector.sub(other.position, this.position)
      let distanceSq = distance.magSq(); // Sq: square
      if(distanceSq === 0){
        distanceSq = 1
      }
      let acc = distance.copy().setMag(G * other.mass / distanceSq)
      this.acc.add(acc)
    })
    
    // Get initAcc
    if(this.frameCount == 0) {
      this.initAcc = this.acc.copy()
    }
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

    this.frameCount ++
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

    this.frameCount ++
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
        let size = 0
        let vX = this.velocity.x - reference.velocity.x
        let vY = this.velocity.y - reference.velocity.y
        let vel = createVector(vY, vX)
        let theta = PI / 2 - vel.heading()
        let mag = vel.mag() * this.velScale

        // Dynamically change arrow size
        if(mag > 30) {
          size = 3
        } else if(mag > 5) {
          size = map(mag, 5, 30, 1, 3)
        }

        push()
        stroke(this.velColor);
        fill(this.velColor)
        translate(this.position.x, this.position.y)
        rotate(theta)
        line(0, 0, mag, 0)
        beginShape();
        vertex(mag, 0);
        vertex(mag - 3 * size, size);
        vertex(mag - 3 * size, -size);
        endShape(CLOSE);
        pop()
        // push()
        // let vX = this.velocity.x - reference.velocity.x
        // let vY = this.velocity.y - reference.velocity.y
        // let scale = this.velScale;
        // translate(this.position.x, this.position.y)
        // stroke(200, 100, 0);
        // strokeWeight(1)
        // line(0, 0, vX * scale, vY * scale)
        // pop()
        
      }

      // Draw Force
      if (!this.hideForce) {
        let size = 0
        let force = p5.Vector.mult(this.acc,this.mass * this.forceScale)
        let theta = force.heading()
        let mag = force.mag()
        // Dynamically change arrow size
        if(mag > 30) {
          size = 3
        } else if(mag > 5) {
          size = map(mag, 5, 30, 1, 3)
        }

        push()
        stroke(this.forceColor);
        fill(this.forceColor)
        translate(this.position.x, this.position.y)
        rotate(theta)
        line(0, 0, mag,0)
        beginShape();
        vertex(mag, 0);
        vertex(mag - 3 * size, size);
        vertex(mag - 3 * size, -size);
        endShape(CLOSE);
        pop()
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
        let size = 0
        let vX = this.initVelocity.x - reference.initVelocity.x
        let vY = this.initVelocity.y - reference.initVelocity.y
        let vel = createVector(vY, vX)
        let theta = PI / 2 - vel.heading()
        let mag = vel.mag()

        // Dynamically change arrow size
        if(mag > 30) {
          size = 3
        } else if(mag > 5) {
          size = map(mag, 5, 30, 1, 3)
        }

        push()
        stroke(this.velColor);
        fill(this.velColor)
        translate(this.initPosition.x, this.initPosition.y)
        rotate(theta)
        line(0, 0, mag,0)
        beginShape();
        vertex(mag, 0);
        vertex(mag - 3 * size, size);
        vertex(mag - 3 * size, -size);
        endShape(CLOSE);
        pop()
      }

      // Draw Force
      if (!this.hideForce) {
        let size = 0
        let force = p5.Vector.mult(this.initAcc, this.mass*this.forceScale)
        let theta = force.heading()
        let mag = force.mag()
        // Dynamically change arrow size
        if(mag > 30) {
          size = 3
        } else if(mag > 5) {
          size = map(mag, 5, 30, 1, 3)
        }

        push()
        stroke(this.forceColor);
        fill(this.forceColor)
        translate(this.initPosition.x, this.initPosition.y)
        rotate(theta)
        line(0, 0, mag,0)
        beginShape();
        vertex(mag, 0);
        vertex(mag - 3 * size, size);
        vertex(mag - 3 * size, -size);
        endShape(CLOSE);
        pop()
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