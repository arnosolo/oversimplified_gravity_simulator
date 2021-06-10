### Oversimplified Gravity Simulator

![2021_6_9下午9_15_45.new](README.assets/2021_6_9下午9_15_45.new.gif)

##### Introduction

​	A simple gravity simulator, based on [p5js](https://p5js.org/). [Click here](https://arnosolo.github.io/oversimplified_gravity_simulator/) to enter the demo page.



##### Change initial condition

```json
[
    {
        "tag":"Sun",	  // Name
        "pX":0,"pY":-100, // Init Position
        "vX":0,"vY":0, 	  // Init velocity
        "mass":6000,	  // mass
        "radius":12,	  // size
        "pathLenMax":200, // trajectory length
        "color":{"r":230,"g":150,"b":0}
    },{"pX":-60,"pY":-100,"vX":0,"vY":30,"mass":80,"radius":4,"tag":"Mercury","color":{"r":120,"g":180,"b":0},"pathLenMax":80}]
```



