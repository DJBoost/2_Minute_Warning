var protag;
var enemies;
var enemyLength = 37;
var protagLength = 37;
let fieldHeight = 408;
var walkDirection = 0;
let d1;
let d2;
let gameState;
let start = window.onload
melody = [null, "A4", "A4", "A4", ["A4", "G4"], "F4" , "D4", "D4", ["D4", "C4"], "D4", "D4", "E4", "E4", "F4", "F4", "F4", "F4"];
bass = [null, "F2", "F2", "F2", "F2", "D2", "D2", "D2", "D2", "A1", ["A1", "A1"], "C2", ["C2", "C2"], "D2", "D2", "D2", "D2"];

// x position
let posX1 = 40;
let posX2 = 40;
let posX3 = 740;
// y position
let posY1 = Math.random(1) * 204;
let posY2 = (Math.random(1) * 204) + 204;
let posY3 = 204;



// timer variable
let timer = 120;

// for score counter
let score = 0;

//serial
let serialPDM;
let portName = '/dev/tty.usbmodem1101';
let sensors


//Tone
let synth1;
let synth2;
let baseURL = 'sounds/';
let soundOof = new Tone.Player(
  baseURL + "oof.wav"
).toDestination();
let soundPoint = new Tone.Player(
  baseURL + "point.wav"
).toDestination();

let sequence1 = new Tone.Sequence(function(time, note) {
  synth1.triggerAttackRelease(note, 0.25);
  console.log(note, time);
}, melody, '4n'); 

let sequence2 = new Tone.Sequence(function(time, note) {
  synth1.triggerAttackRelease(note, 0.25);
  console.log(note, time);
}, bass, '4n'); 

 
Tone.Transport.bpm.value = 154; 
Tone.Transport.start();


function preload() {
  // specify width and height of each frame and number of frames
  field = loadImage("football-field.jpg");
  imgEnemies1 = loadImage("enemy-sprites-1.png");
  imgEnemies2 = loadImage("enemy-sprites-2.png");
  imgProtag = loadImage("player-sprite.png");
}
function setup() {
  createCanvas(820, 408);
  serialPDM = new PDMSerial(portName);
  sensors = serialPDM.sensorData;


 synth1 = new Tone.Synth({
    oscillator:{
      type: "square"
    },
    envelope: {
      attack: 0,
      decay: 0.4,
      sustain: 0.1,
      release: 0.5
    }
  }).toDestination();
 

 synth2 = new Tone.Synth({
   oscillator:{
     type: "triangle"
   },
   envelope: {
    attack: 0.3,
    decay: 0.3,
    sustain: 0.5,
    release: 5
   }
  }).toDestination();
}

function draw() {
  background(51);
  image(field, 0, 0, 820, 408)

  image(imgEnemies1, posX1, posY1, enemyLength, 43);
  image(imgEnemies2, posX2, posY2, enemyLength, 43);
  if (sensors.joystick == undefined) {
    image(imgProtag, posX3, posY3, protagLength, 43)
  } else {
    image(imgProtag, posX3, sensors.joystick, protagLength, 43);
  };
  

  
  // timer and score
  textSize(50);
  text(score, 10, 50);
  textAlign(CENTER, CENTER);
  text(timer, width/2, height/2);
  if (frameCount % 60 == 0 && timer > 0) { 
    timer --;
  }
  if (timer == 0) {
      let page = "end.html";
        window.open(page);
    }

if (sensors.joystick == undefined) {
  d1 = dist(posX1 + 15, posY1 + 15, posX3, posY3)
  d2 = dist(posX2 + 15, posY2 + 15, posX3, posY3)
} else {
d1 = dist(posX1 + 15, posY1 + 15, posX3, sensors.joystick)
d2 = dist(posX2 + 15, posY2 + 15, posX3, sensors.joystick)
}

  // animate enemies right
  if (posX1 < (820 - enemyLength)) {
    posX1++;
  } else if (posX1 == (820 - enemyLength)) {
    posX1 = 40;
    posY1 = Math.random(1) * 204;
  }

  if (posX2 < (820 - enemyLength)) {
    posX2++;
  } else if (posX2 == (820 - enemyLength)) {
    posX2 = 40;
    posY2 = (Math.random(1) * 204) + 204;
  }
    // player char.
  if (posX3 > 40) {
    if ((d1 < 25) || (d2 < 25)) {
      posX3 = 740;
      console.log("collision");
      serialPDM.transmit("led", 1);
      serialPDM.transmit("led", 0);
      soundOof.start()

    } else {
      posX3--;
    }

    if (posX3 == 40) {
      posX3 = 740;
      score++;
      soundPoint.start()
    }

  }


  
  
keyPressed();
  if (posY3 > 371) {
    posY3 = 371;
  } else if (posY3 < 0) {
      posY3 = 0;
    }

  
  function keyPressed() {
    if (keyCode === DOWN_ARROW) {
      posY3 = posY3 + 1;
    } else if (keyCode === UP_ARROW) {
      posY3 = posY3 - 1;
    }
  }

sequence1 = new Tone.Sequence(function(time, note) {
  synth1.triggerAttackRelease(note, 0.5);
  console.log(note, time);
}, melody, '4n'); 
Tone.Transport.bpm.value = 167;
Tone.Transport.start();
}

if (timer == 120){
{sequence2.start();
}
}