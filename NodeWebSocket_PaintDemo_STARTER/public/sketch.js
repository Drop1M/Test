// Create connection to Node.JS Server
const socket = io();

let bSize = 30; // brush size
let canvas;
let drawIsOn = false;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed(startDrawing);//we only want to start draw when clicking on canvas element

  //set styling for the sketch
  background(255);
  noStroke();
}

function draw() {

  if(drawIsOn){
    fill(0);
    circle(mouseX,mouseY,bSize);
  }

}

//we only want to draw if the click is on the canvas not on our GUI
function startDrawing(){
  drawIsOn = true;
}

function mouseReleased(){
  drawIsOn = false;
}

function mouseDragged() {

  //don't emit if we aren't drawing on the canvas
  if(!drawIsOn){
    return;
  }

  socket.emit("drawing", {
    xpos: mouseX,
    ypos: mouseY,
    userS: bSize
  });

}

// draw other user's brushes
function onDrawingEvent(data){
  fill(0);
  circle(data.xpos,data.ypos,data.userS);
}

//Events we are listening for
// Connect to Node.JS Server
socket.on("connect", () => {
  console.log(socket.id);
});

// Callback function on the event we disconnect
socket.on("disconnect", () => {
  console.log(socket.id);
});

// Callback function to recieve message from Node.JS
socket.on("drawing", (data) => {
  console.log(data);

  onDrawingEvent(data);

});
