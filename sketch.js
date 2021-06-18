/**
 * Author: Arno Solo
 * Link: https://github.com/arnosolo
 */

// Settings
const G = 1 // Gravitational constant
const FRAME_RATE = 50
let moverConfigs = moverConfigs1
let referenceName = 'Origin'
let cameraFollow = 'Origin'
let editMode = false // true: edit init condition mode

// Globals
let cam1
let fontThinItalic
let camPos = { x: 0, y: 0, z: 500 }
let movers = []
let editViewMovers = []
let referencePicker
let cameraPicker
let prevReferenceName = referenceName
let prevmoverConfigs = JSON.parse(JSON.stringify(moverConfigs))
let EditModeMoverConfigs = JSON.parse(JSON.stringify(moverConfigs))
const originConfig = { tag: 'Origin', pathLenMax: 1, hide: true }
let origin
let showAllForce = false
let showAllVel = false
let applyConfigFlag = false

// Main
function preload() {
  fontThinItalic = loadFont('./libraries/Roboto-ThinItalic.ttf');
}

function setup() {
  let myCanvas = createCanvas(500, 400, WEBGL)
  myCanvas.parent("canvas-container");
  frameRate(FRAME_RATE)
  cam1 = createCamera();
  
  origin = new Mover(originConfig)
  movers.push(origin)
  moverConfigs.forEach(config => {
    movers.push(new Mover(config))
  })

  setGUI()
}

function draw() {
  if(editMode){
    drawInit()
  } else {
    drawRun()
  }

}

const drawRun = () => {
  background(220);

  // Check if initial condition changed
    if(JSON.stringify(prevmoverConfigs) != JSON.stringify(moverConfigs) 
      || applyConfigFlag){
    movers = []

    origin = new Mover(originConfig)
    movers.push(origin)
    moverConfigs.forEach(config => {
      movers.push(new Mover(config))
    })

    setGUI()

    prevmoverConfigs = JSON.parse(JSON.stringify(moverConfigs))
    applyConfigFlag = false
  }

  // 1. Set reference 
  // NOTE: Luna is the Center of Universe !!!! [Doge]
  let reference = movers.find(mover => mover.tag == referenceName)
  // let reference = getCenter(movers, 'Sun', 'Earth') // Get center point of two Movers
  if(!reference)reference = origin

  // reset path if reference change
  if(prevReferenceName != referenceName){
    movers.forEach(mover => mover.relativePath = [])
    prevReferenceName = referenceName
  }

  // 2. Apply gravity
  movers.forEach(mover => {
    if(mover.tag != 'Origin') {
      mover.attracted(movers.filter(item => item != mover))
    }
  })

  // 3. Update movers status (Can't be merged with last step!)
  movers.forEach(mover => {
    mover.update(reference)
  })

  // 4. Set Camera
  let temp = movers.find(mover => mover.tag == cameraFollow)
  if(temp) {
    camPos.x = temp.position.x
    camPos.y = temp.position.y
  } else {
    camPos.x = 0
    camPos.y = 0
  }
  cam1.setPosition(camPos.x, camPos.y, camPos.z);
  cam1.lookAt(camPos.x, camPos.y, 0);

  // 5. Draw
  movers.forEach(mover => {
    mover.show(reference)
  })
}
const drawInit = () => {
  background(220);

  // init editViewMovers
  if(editViewMovers.length == 0) {
    origin = new Mover(originConfig)
    editViewMovers.push(origin)
    moverConfigs.forEach(config => {
      editViewMovers.push(new Mover(config))
    })
    setEditViewGUI()
  }

  // Check if initial condition changed
    if(JSON.stringify(prevmoverConfigs) != JSON.stringify(moverConfigs)
      || applyConfigFlag){
    editViewMovers = []
    origin = new Mover(originConfig)
    editViewMovers.push(origin)
    moverConfigs.forEach(config => {
      editViewMovers.push(new Mover(config))
    })
    prevmoverConfigs = JSON.parse(JSON.stringify(moverConfigs))
    setEditViewGUI()
    applyConfigFlag = false
  }
  
  // 1. Set reference 
  // NOTE: Luna is the Center of Universe !!!! [Doge]
  let reference = editViewMovers.find(mover => mover.tag == referenceName)
  // let reference = getCenter(movers, 'Sun', 'Earth') // Get center point of two Movers
  if(!reference)reference = origin

  // reset path if reference change
  if(prevReferenceName != referenceName){
    editViewMovers.forEach(mover => {
      mover.relativePath = []
      mover.position.x = mover.initPosition.x
      mover.position.y = mover.initPosition.y
      mover.velocity.x = mover.initVelocity.x
      mover.velocity.y = mover.initVelocity.y
    })
    prevReferenceName = referenceName
  }

  // 2. Apply gravity
  editViewMovers.forEach(mover => {
    if(mover.tag != 'Origin') {
      mover.attracted(editViewMovers.filter(item => item != mover))
    }
  })

  // 3. Update movers status (Can't be merged with last step!)
  editViewMovers.forEach(mover => {
    mover.pathLenMax = 150
    mover.editViewUpdate(reference)
  })

  // 4. Set Camera
  let temp = editViewMovers.find(mover => mover.tag == cameraFollow)
  if(temp) {
    camPos.x = temp.initPosition.x
    camPos.y = temp.initPosition.y
  } else {
    camPos.x = 0
    camPos.y = 0
  }
  cam1.setPosition(camPos.x, camPos.y, camPos.z);
  cam1.lookAt(camPos.x, camPos.y, 0);

  // 5. Draw
  editViewMovers.forEach(mover => {
    // mover.hideVel = false
    mover.editViewShow(reference)
  })

  // draw grid
  drawGrid()
}


// GUI
const setGUI = () => {
  let controlPanel = document.getElementById('controlPanel1')
  controlPanel.innerHTML = ''

  // referencePicker
  let referenceLabel = document.createElement('label')
  referenceLabel.innerHTML = '📍 Reference'
  referencePicker = document.createElement('select')
  movers.forEach(mover => {
    let option = document.createElement('option')
    option.nodeValue = mover.tag
    option.innerHTML = mover.tag
    referencePicker.appendChild(option)
  })
  referencePicker.onchange = (event) => {
    let picker=event.target
    let moverName = picker.options[picker.selectedIndex].value;
    referenceName = moverName
  }
  referenceLabel.appendChild(referencePicker)
  referenceLabel.className = 'moverPicker'
  controlPanel.append(referenceLabel)

  // cameraPicker
  let cameraLabel = document.createElement('label')
  cameraLabel.innerHTML = '📹 Cam follow '
  cameraPicker = document.createElement('select')
  movers.forEach(mover => {
    let option = document.createElement('option')
    option.nodeValue = mover.tag
    option.innerHTML = mover.tag
    cameraPicker.appendChild(option)
  })
  cameraPicker.onchange = (event) => {
    let picker=event.target
    let moverName = picker.options[picker.selectedIndex].value;
    cameraFollow = moverName
  }
  cameraLabel.appendChild(cameraPicker)
  cameraLabel.className = 'moverPicker'
  controlPanel.append(cameraLabel)

  // hide/show path
  let hidePathBtn = document.createElement('button')
  hidePathBtn.innerHTML = '💫Hide Path'
  hidePathBtn.onclick = (e) => {
    if(hidePathBtn.innerHTML == '💫Hide Path'){
      hidePathBtn.innerHTML = '💫Show Path'
    } else {
      hidePathBtn.innerHTML = '💫Hide Path'
    }
    movers.forEach(m => m.hidePath = !m.hidePath)
  }
  hidePathBtn.className = 'button'
  controlPanel.append(hidePathBtn)

  // hide/show Force
  let hideForceBtn = document.createElement('button')
  showAllForce = false
  hideForceBtn.innerHTML = showAllForce ? '↗️ Hide Net Force' : '↗️ Show Net Force'
  hideForceBtn.onclick = (e) => {
    showAllForce = !showAllForce
    hideForceBtn.innerHTML = showAllForce ? '↗️ Hide Net Force' : '↗️ Show Net Force'
    movers.forEach(m => m.hideForce = !m.hideForce)
  }
  hideForceBtn.className = 'button'
  controlPanel.append(hideForceBtn)

  // hide/show vel
  let hideVelBtn = document.createElement('button')
  showAllVel = false
  hideVelBtn.innerHTML = showAllVel ? '🏃‍♂️ Hide Velocity' : '🏃‍♂️ Show Velocity'
  movers.forEach(m => m.hideVel = true)
  hideVelBtn.onclick = (e) => {
    showAllVel = !showAllVel
    hideVelBtn.innerHTML = showAllVel ? '🏃‍♂️ Hide Velocity' : '🏃‍♂️ Show Velocity'
    movers.forEach(m => m.hideVel = !m.hideVel)
  }
  hideVelBtn.className = 'button'
  controlPanel.append(hideVelBtn)
  
  // Initial condition editor
  let initCondiEditor = document.getElementById('initial_condition')
  initCondiEditor.innerHTML = ''

  // let applyConditionBtn = document.createElement('button')
  // applyConditionBtn.className = 'button'
  // applyConditionBtn.innerHTML = '✔️ Apply Init condition'
  // applyConditionBtn.onclick = (e) => {
  //   moverConfigs = JSON.parse(initCondition.value)
  // }

  let saveConditionBtn = document.createElement('button')
  saveConditionBtn.className = 'button'
  saveConditionBtn.innerHTML = '💾 Save Init condition'
  let funDownload = function (content, filename) {
    // 创建隐藏的下载链接
    let link = document.createElement('a');
    link.download = filename;
    link.style.display = 'none';
    // 字符内容 -> blob
    let blob = new Blob([content]);
    link.href = URL.createObjectURL(blob);
    // 点击下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  saveConditionBtn.onclick = (e) => {
    const filename = `init_condition_${new Date().toLocaleTimeString()}.json`
    funDownload(JSON.stringify(moverConfigs), filename)
  }

  let readConditionBtn = document.createElement('button')
  readConditionBtn.className = 'button'
  readConditionBtn.innerHTML = '📂 Read from file'
  readConditionBtn.onclick = (e) => {
    let input = document.createElement('input');
    input.type = 'file'
    input.accept = 'json'
    input.style.display = 'none';
    input.click();
    input.onchange = (event) => {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        document.getElementById('initCondition').value = reader.result;
        moverConfigs = JSON.parse(reader.result)
      };
      reader.readAsText(file);
   }
    }

  let editViewBtn = document.createElement('button')
  editViewBtn.className = 'button'
  editViewBtn.innerHTML = editMode ? '🚪🚶 Quit Edit view' : '✍️ Edit view'
  editViewBtn.onclick = () => {
    cameraFollow = 'cameraFollow'
    referenceName = 'Origin'
    applyConfigFlag = true
    editMode = !editMode
    editViewBtn.innerHTML = editMode ? '🚪🚶 Quit Edit view' : '✍️ Edit view'
    // moverConfigs = JSON.parse(initCondition.value)
  }

  initCondiEditor.append(editViewBtn)
  // initCondiEditor.append(applyConditionBtn)
  initCondiEditor.append(saveConditionBtn)
  // initCondiEditor.append(readConditionBtn)
  
  // Mover Config Editor
  let configList = document.createElement('div')
  configList.id = 'mover-list-app'
  configList.className = 'control-panel'
  initCondiEditor.append(configList)

  const MoverConfigList = {
    data() {
      return {
        EditModeMoverConfigs
      }
    },
    methods: {
      removeConfigItem(index) {
        const r = confirm(`Remove ${this.EditModeMoverConfigs[index].tag} ?`)
        if(r) this.EditModeMoverConfigs.splice(index, 1)
      },
      addMover() {
        const moverConfig = {
          tag: 'New mover', pX: 5, pY: 5, vX: 0, vY: 0,
          mass: 0, radius: 10, color: '#9c9891', pathLenMax:50
        }
        this.EditModeMoverConfigs.unshift(moverConfig)
      },
      applyConfig() {
        moverConfigs = JSON.parse(JSON.stringify(this.EditModeMoverConfigs))
        applyConfigFlag = true
      },
      readConfig() {
        let e = document.createElement('input');
        e.type = 'file'
        e.accept = 'json'
        e.style.display = 'none';
        e.click();
        e.onchange = (event) => {
          const file = event.target.files[0];
          let reader = new FileReader();
          reader.onload = () => {
            EditModeMoverConfigs = JSON.parse(reader.result)
            moverConfigs = JSON.parse(reader.result)
          };
          reader.readAsText(file);
        }
      }
    },
    template: `
      <button @click="readConfig" class="button">📂 Read from file</button>
      <button @click="applyConfig" class="button">✔️ Apply Init condition</button>
      <button @click="addMover" class="button">➕ Add Mover</button>
      <ul class="edit-area">
        <mover-config-item v-for="(m,i) in EditModeMoverConfigs" 
          v-bind:moverConfig="m"
          v-bind:index="i"
          v-bind:removeConfigItem="removeConfigItem"
          class="mover-config-item">
        </mover-config-item>
      </ul>
      `
  }
  const app = Vue.createApp(MoverConfigList)

  app.component('mover-config-item', {
    props:['moverConfig', 'index', 'removeConfigItem'],
    template: `<li>
      <h3>{{moverConfig.tag}}</h3>
      <div><label>Tag</label>  <input v-model="moverConfig.tag" /> </div>
      <div><label>PosX</label> <input v-model.number="moverConfig.pX" type="number" step="5"/> </div>
      <div><label>PosY</label> <input v-model.number="moverConfig.pY" type="number" step="5"/> </div>
      <div><label>VelX</label> <input v-model.number="moverConfig.vX" type="number" step="0.1"/> </div>
      <div><label>VelY</label> <input v-model.number="moverConfig.vY" type="number" step="0.1"/> </div>
      <div><label>Mass</label> <input v-model.number="moverConfig.mass" type="number"/> </div>
      <div><label>Color</label> <input v-model="moverConfig.color" /> </div>
      <div><label>Radius</label> <input v-model.number="moverConfig.radius" type="number"/> </div>
      <div><label>PathLength</label> <input v-model.number="moverConfig.pathLenMax" type="number" step="10"/> </div>
      <div><label>HideTag </label><input v-model.number="moverConfig.hideTag" type="checkbox"/> </div>
      <div><button @click="removeConfigItem(this.index)" class="button"> Remove </button></div>
      </li>`
  })

  app.mount('#mover-list-app')

}

const setEditViewGUI = () => {
  let controlPanel = document.getElementById('controlPanel1')
  controlPanel.innerHTML = ''

  // referencePicker
  let referenceLabel = document.createElement('label')
  referenceLabel.innerHTML = '📍 Reference'
  referencePicker = document.createElement('select')
  editViewMovers.forEach(mover => {
    let option = document.createElement('option')
    option.nodeValue = mover.tag
    option.innerHTML = mover.tag
    referencePicker.appendChild(option)
  })
  referencePicker.onchange = (event) => {
    let picker=event.target
    let moverName = picker.options[picker.selectedIndex].value;
    referenceName = moverName
  }
  referenceLabel.appendChild(referencePicker)
  referenceLabel.className = 'moverPicker'
  controlPanel.append(referenceLabel)

  // cameraPicker
  let cameraLabel = document.createElement('label')
  cameraLabel.innerHTML = '📹 Cam follow '
  cameraPicker = document.createElement('select')
  editViewMovers.forEach(mover => {
    let option = document.createElement('option')
    option.nodeValue = mover.tag
    option.innerHTML = mover.tag
    cameraPicker.appendChild(option)
  })
  cameraPicker.onchange = (event) => {
    let picker=event.target
    let moverName = picker.options[picker.selectedIndex].value;
    cameraFollow = moverName
  }
  cameraLabel.appendChild(cameraPicker)
  cameraLabel.className = 'moverPicker'
  controlPanel.append(cameraLabel)

  // hide/show path
  let hidePathBtn = document.createElement('button')
  hidePathBtn.innerHTML = '💫Hide Path'
  hidePathBtn.onclick = (e) => {
    if(hidePathBtn.innerHTML == '💫Hide Path'){
      hidePathBtn.innerHTML = '💫Show Path'
    } else {
      hidePathBtn.innerHTML = '💫Hide Path'
    }
    editViewMovers.forEach(m => m.hidePath = !m.hidePath)
  }
  hidePathBtn.className = 'button'
  controlPanel.append(hidePathBtn)

  // hide/show Force
  let hideForceBtn = document.createElement('button')
  showAllForce = true
  hideForceBtn.innerHTML = showAllForce ? '↗️ Hide Net Force' : '↗️ Show Net Force'
  editViewMovers.forEach(m => m.hideForce = false)
  hideForceBtn.onclick = (e) => {
    showAllForce = !showAllForce
    hideForceBtn.innerHTML = showAllForce ? '↗️ Hide Net Force' : '↗️ Show Net Force'
    editViewMovers.forEach(m => m.hideForce = !m.hideForce)
  }
  hideForceBtn.className = 'button'
  controlPanel.append(hideForceBtn)

  // hide/show velocity
  let hideVelBtn = document.createElement('button')
  showAllVel = true
  hideVelBtn.innerHTML = showAllVel ? '🏃‍♂️ Hide Velocity' : '🏃‍♂️ Show Velocity'
  editViewMovers.forEach(m => m.hideVel = false)
  hideVelBtn.onclick = (e) => {
    showAllVel = !showAllVel
    hideVelBtn.innerHTML = showAllVel ? '🏃‍♂️ Hide Velocity' : '🏃‍♂️ Show Velocity'
    editViewMovers.forEach(m => m.hideVel = !m.hideVel)
  }
  hideVelBtn.className = 'button'
  controlPanel.append(hideVelBtn)
  
  // Initial condition editor
  let initCondiEditor = document.getElementById('initial_condition')
  initCondiEditor.innerHTML = ''

  let editViewBtn = document.createElement('button')
  editViewBtn.className = 'button'
  editViewBtn.innerHTML = editMode ? '🚪🚶 Quit Edit view' : '✍️ Edit view'
  editViewBtn.onclick = () => {
    cameraFollow = 'cameraFollow'
    referenceName = 'Origin'
    applyConfigFlag = true
    editMode = !editMode
    editViewBtn.innerHTML = editMode ? '🚪🚶 Quit Edit view' : '✍️ Edit view'
    // moverConfigs = JSON.parse(initCondition.value)
  }

  let initCondition = document.createElement('textarea')
  initCondition.id = 'initCondition'
  initCondition.className = 'initCondition'
  initCondition.cols = 30
  initCondition.rows = 18
  initCondition.value = JSON.stringify(moverConfigs)

  let applyConditionBtn = document.createElement('button')
  applyConditionBtn.className = 'button'
  applyConditionBtn.innerHTML = '✔️ Apply Init condition'
  applyConditionBtn.onclick = (e) => {
    moverConfigs = JSON.parse(initCondition.value)
  }

  let saveConditionBtn = document.createElement('button')
  saveConditionBtn.className = 'button'
  saveConditionBtn.innerHTML = '💾 Save Init condition'
  let funDownload = function (content, filename) {
    // 创建隐藏的下载链接
    let link = document.createElement('a');
    link.download = filename;
    link.style.display = 'none';
    // 字符内容 -> blob
    let blob = new Blob([content]);
    link.href = URL.createObjectURL(blob);
    // 点击下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  saveConditionBtn.onclick = (e) => {
    const filename = `init_condition_${new Date().toLocaleTimeString()}.json`
    funDownload(JSON.stringify(moverConfigs), filename)
  }

  let readConditionBtn = document.createElement('button')
  readConditionBtn.className = 'button'
  readConditionBtn.innerHTML = '📂 Read from file'
  readConditionBtn.onclick = (e) => {
    let input = document.createElement('input');
    input.type = 'file'
    input.accept = 'json'
    input.style.display = 'none';
    input.click();
    input.onchange = (event) => {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        document.getElementById('initCondition').value = reader.result;
        moverConfigs = JSON.parse(reader.result)
      };
      reader.readAsText(file);
   }
    }

  initCondiEditor.append(editViewBtn)
  // initCondiEditor.append(applyConditionBtn)
  initCondiEditor.append(saveConditionBtn)
  // initCondiEditor.append(readConditionBtn)
  // initCondiEditor.append(initCondition)

  // Mover Config Editor
  let configList = document.createElement('div')
  configList.id = 'mover-list-app'
  configList.className = 'control-panel'
  initCondiEditor.append(configList)

  const MoverConfigList = {
    data() {
      return {
        EditModeMoverConfigs
      }
    },
    methods: {
      removeConfigItem(index) {
        const r = confirm(`Remove ${this.EditModeMoverConfigs[index].tag} ?`)
        if(r) this.EditModeMoverConfigs.splice(index, 1)
      },
      addMover() {
        const moverConfig = {
          tag: 'New mover', pX: 5, pY: 5, vX: 0, vY: 0,
          mass: 0, radius: 10, color: '#9c9891', pathLenMax:50
        }
        this.EditModeMoverConfigs.unshift(moverConfig)
      },
      applyConfig() {
        moverConfigs = JSON.parse(JSON.stringify(this.EditModeMoverConfigs))
        applyConfigFlag = true
      },
      readConfig() {
        let e = document.createElement('input');
        e.type = 'file'
        e.accept = 'json'
        e.style.display = 'none';
        e.click();
        e.onchange = (event) => {
          const file = event.target.files[0];
          let reader = new FileReader();
          reader.onload = () => {
            EditModeMoverConfigs = JSON.parse(reader.result)
            moverConfigs = JSON.parse(reader.result)
          };
          reader.readAsText(file);
        }
      }
    },
    template: `
      <button @click="readConfig" class="button">📂 Read from file</button>
      <button @click="applyConfig" class="button">✔️ Apply Init condition</button>
      <button @click="addMover" class="button">➕ Add Mover</button>
      <ul class="edit-area">
        <mover-config-item v-for="(m,i) in EditModeMoverConfigs" 
          v-bind:moverConfig="m"
          v-bind:index="i"
          v-bind:removeConfigItem="removeConfigItem"
          class="mover-config-item">
        </mover-config-item>
      </ul>
      `
  }
  const app = Vue.createApp(MoverConfigList)

  app.component('mover-config-item', {
    props:['moverConfig', 'index', 'removeConfigItem'],
    template: `<li>
      <h3>{{moverConfig.tag}}</h3>
      <div><label>Tag</label>  <input v-model="moverConfig.tag" /> </div>
      <div><label>PosX</label> <input v-model.number="moverConfig.pX" type="number" step="5"/> </div>
      <div><label>PosY</label> <input v-model.number="moverConfig.pY" type="number" step="5"/> </div>
      <div><label>VelX</label> <input v-model.number="moverConfig.vX" type="number" step="0.1"/> </div>
      <div><label>VelY</label> <input v-model.number="moverConfig.vY" type="number" step="0.1"/> </div>
      <div><label>Mass</label> <input v-model.number="moverConfig.mass" type="number"/> </div>
      <div><label>Color</label> <input v-model="moverConfig.color" /> </div>
      <div><label>Radius</label> <input v-model.number="moverConfig.radius" type="number"/> </div>
      <div><label>PathLength</label> <input v-model.number="moverConfig.pathLenMax" type="number" step="10"/> </div>
      <div><label>HideTag </label><input v-model.number="moverConfig.hideTag" type="checkbox"/> </div>
      <div><button @click="removeConfigItem(this.index)" class="button"> Remove </button></div>
      </li>`
  })

  app.mount('#mover-list-app')

}

const drawGrid = () => {
  stroke(210,150,20, 1)
  line(0,-height, 0, height)
  line(-width, 0, width, 0)

  let gap = 50
  stroke(100,30)
  for(let i = -width; i<=width; i+=gap) {
    if(i != 0) line(i,-height, i, height)
  }
  for(let i = -height; i<=height; i+=gap) {
    if(i != 0) line(-width, i, width, i)
  }
}

// Utils
/**
 * Get Center point of two Movers by tagname
 * @param {Array} movers An array of movers
 * @param {string} tag1 TagName of Mover1
 * @param {string} tag2 TagName of Mover2
 * @return {Object} { position: {x: ,y: ,z: } }
 */
const getCenter = (movers, tag1, tag2) => {
  let m1 = movers.find(mover => mover.tag == tag1)
  let m2 = movers.find(mover => mover.tag == tag2)
  return {
    position: {
      x: (m1.position.x + m2.position.x) * 0.5,
      y: (m1.position.y + m2.position.y) * 0.5,
      z: (m1.position.z + m2.position.z) * 0.5,
    }
  }
}