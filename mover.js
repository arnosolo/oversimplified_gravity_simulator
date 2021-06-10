class Mover {
  constructor(moverProps) {
    const { pX, pY, vX, vY, accX, accY, mass, radius, 
      tag, color, pathLenMax, hide, hideTag, hidePath,
      hideVel, hideForce } = moverProps;
    this.position = createVector(pX, pY);
    this.velocity = createVector(vX, vY);
    this.acc = createVector(accX, accY);
    this.mass = mass || 0;
    this.radius = radius || 5;
    this.tag = tag || '';
    this.dt = 0.1
    this.path = []
    this.relativePath = []
    this.color = color || {r:230, g:150, b:0}
    this.pathLenMax = pathLenMax || 300
    this.hide = hide || false
    this.hideTag = hideTag || false
    this.hidePath = hidePath || false
    this.hideVel = hideVel || true
    this.hideForce = hideForce || true
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

    // Update Path
    // if(this.path.length < 800) {
    //   let {x, y} = this.position
    //   this.path.unshift({x, y})
    // } else {
    //   this.path.splice(-1, 1)
    // }

    // Update Path (relative to reference)
    if (this.relativePath.length < this.pathLenMax) {
      let x = this.position.x - reference.position.x
      let y = this.position.y - reference.position.y
      this.relativePath.unshift({ x, y })
    } else {
      this.relativePath.splice(-1, 1)
    }
  }

  show(reference) {
    if (!this.hide) {
      let { r, g, b } = this.color
      // Draw circle
      stroke(120);
      fill(r, g, b)
      circle(this.position.x, this.position.y, 2 * this.radius);

      // Draw tag
      if(!this.hideTag) {
        fill(50)
        textSize(20);
        textFont(fontThinItalic);
        text(`${this.tag}`, this.position.x, this.position.y - this.radius - 2)
      }

      // Draw velocity
      if(!this.hideVel) {
        push()
        let vX = this.velocity.x - reference.velocity.x
        let vY = this.velocity.y - reference.velocity.y
        translate(this.position.x, this.position.y)
        stroke(200, 100, 0);
        strokeWeight(1)
        let velScale = 1;
        line(0,0,vX*velScale,vY*velScale)
        pop()
      }

      // Draw Force
      if(!this.hideForce) {
        stroke(0, 100, 200);
        let forceScale = 0.02;
        line(this.position.x, this.position.y,
          forceScale * this.acc.x * this.mass + this.position.x, forceScale * this.acc.y * this.mass + this.position.y)
      }

      // Draw Path
      // stroke(r, g, b, 20)
      // strokeWeight(1)
      // noFill()
      // beginShape()
      // this.path.forEach((dot, i) => {
      //   vertex(dot.x, dot.y)
      // })
      // endShape()

      // Draw Path (relative to reference)
      if(!this.hidePath){
        push()
        translate(reference.position.x, reference.position.y)
        stroke(r, g, b, 20)
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