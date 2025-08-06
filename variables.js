
let canvas = document.getElementById("myCanvas");
let canvasDiv = document.getElementById("canvasDiv");

canvas.height = canvasDiv.clientWidth*2;
canvas.width = canvasDiv.clientWidth*2;

let gl = canvas.getContext("webgl2", {antialias:true},{depth:true});


/*
let canvas = document.getElementById("myCanvas");

let ctx = canvas.getContext("2d");

// Multiplicador de resolución
let scale = window.devicePixelRatio || 1;

// Tamaño lógico (en CSS)
let width = 300;

let height = 300;

canvas.style.width = width + "px";
canvas.style.height = height + "px";

canvas.width = width * scale;
canvas.height = height * scale;

ctx.scale(scale, scale);

ctx.isSmoothEnable = false;

*/
let camera = {
position: {x: 0,y: 5,z:20},

right :{ x: 1, y: 0, z: 0 },

up : { x: 0, y: 1, z: 0 },

forward : { x: 0, y: 0, z: -1 },
velocity : { x: 0, y: -0.1, z: 0},

rotation:{x:0,y:0,z:0},
speed:1,
near:0.001,
far:200,
fov:60
};

let lightDir = { x: 0, y: 0, z: -1 }

let rotationSpeed = 0.1;

let moveSpeed = camera.speed;

let radian = Math.PI / 180;

let f= 1 / Math.tan((camera.fov / 2)*(radian));

let aspectR=canvas.height/canvas.width;

let pMatrix = [
 [f / aspectR, 0, 0, 0],
 [0, f, 0, 0],
 [0, 0, (camera.far + camera.near) / (camera.near - camera.far), (2 * camera.far * camera.near) / (camera.near - camera.far)],
 [0, 0, -1, 0]
];

//performance depends on factor too
let halfFov = (camera.fov || 60) * 1 * Math.PI / 180;

let cosHalfFov = Math.cos(halfFov);

let alltris = [];

let triCount=0;

let globalScale = 0.15;

let animationSpeed = 100;

let meshes = [];

let gridSize = 5;
let cellSize = 5;
let tileScale = 30;
let offset = 0;
let quadSize = 1;
let gridLimit=1000000;
let frequency=0.001;
let beef = 5; //tall
let random = Math.random() * 1000;

let perm = [];
for (let i = 0; i < 256; i++) perm[i] = i;
perm.sort(() => Math.random() - 0.5);
perm = perm.concat(perm);

let isDynamicLight=true;

let isStepShading=false;
let isFlatShading=false;
let isSpecularShading=false;







// Initialize variables for frame timing
var frameCount = 0;
var totalFrameTime = 0; // Total time accumulated over a period
var lastFrameTime = performance.now(); // Time of the last frame

// Create and style the display element
var fpsDisplay = document.createElement('div');
fpsDisplay.style.position = 'fixed';
fpsDisplay.style.top = '20px';
fpsDisplay.style.left = '37px';
fpsDisplay.style.padding = '5px 10px';
fpsDisplay.style.background = 'rgba(0, 0, 0, 0.3)';
fpsDisplay.style.color = '#ffffff';
fpsDisplay.style.fontFamily = 'Arial, sans-serif';
fpsDisplay.style.fontSize = '16px';
document.body.appendChild(fpsDisplay);
