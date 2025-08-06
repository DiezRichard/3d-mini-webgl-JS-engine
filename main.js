let viewMatrix=null;

let vpMatrix =null;
 
//~~~~~~~~~~~~~~~~~~~~~~~~~

 for(let mesh of meshes){
  
  precalcularNormal(mesh);
  
 }//meshes loop

gl.uniformMatrix4fv(
 projectionUniformLocation,
 false,
 new Float32Array(transposeMatrix(pMatrix))
);

//~~~~~~~~~~~~~~~~~~~~~~~~~

function main() {


//----FPS COUNTER--------//

frameCount++;
let currentTime = performance.now();
let elapsedTime = currentTime - lastFrameTime;

if (elapsedTime >= 500) {
fpsDisplay.textContent = frameCount*2;
frameCount = 0;
lastFrameTime = currentTime;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~


let skipNames = [
...animate(sword1Animation)
]
 


//~~~~~~~~~~~~~~~~~~~~~~~~~

//rotateMesh(tree, { x: 0, y: 1, z: 0 }, -0.005);


rotateAnimation(sword1Animation, { x: 0, y: 1, z: 0 }, 0.01);

//~~~~~~~~~~~~~~~~~~~~~~~~~

if(!viewMatrix)
{
 viewMatrix=updateViewMatrix();
}

if(camera.dirty)
{
 viewMatrix=updateViewMatrix();
}

 

gl.uniformMatrix4fv(
 viewMatrixUniformLocation,
 false,
 new Float32Array(transposeMatrix(viewMatrix))
);

//~~~~~~~~~~~~~~~~~~~~~~~~~

gl.clearColor(0.2, 0.2, 0.5, 0.2);

gl.clear(gl.COLOR_BUFFER_BIT);

//~~~~~~~~~~~~~~~~~~~~~~~~~
//MESHES LOOP{}
for (let mesh of meshes) {

if(skipNames.includes(mesh)) continue;

if(mesh.isRotating){
 
 precalcularNormal(mesh)
}

//~~~~~~~~~~~

let modelMatrix = toWorldView(mesh);


gl.uniformMatrix4fv(
 modelMatrixUniformLocation,
 false,
 new Float32Array(transposeMatrix(modelMatrix))
);
//~~~~~~~~~~~

drawMeshGl(mesh)

}//mesh loop

//~~~~~~~~~~~~~~~~~~~~~~~~~

if(camera.dirty)
{
 camera.dirty=false;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~

updateCamera();

requestAnimationFrame(main);
}//MAIN

//-----------------------//

window.onload=requestAnimationFrame(main);

//-----------------------//


function transposeMatrix(m) {
 return [
  m[0][0], m[1][0], m[2][0], m[3][0],
  m[0][1], m[1][1], m[2][1], m[3][1],
  m[0][2], m[1][2], m[2][2], m[3][2],
  m[0][3], m[1][3], m[2][3], m[3][3],
 ];
}