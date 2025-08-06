function move(touchesArray)
{
let factor=.1;
let input=touchesArray;
if(input.length>0)
{
  
for(let i=0;i<input.length;i++)
{
if (input[i]== "ArrowLeft" || input[i] == "a" || input[i] == "4")
{
moveCameraLeft();

//break;
}

if (input[i] == "ArrowRight" || input[i] == "d" || input[i] == "6")
{

moveCameraRight();

// break;
}

if (input[i] == "ArrowUp" || input[i] == "w" || input[i] == "8")
{
 
moveCameraForward();

//break;
}

if (input[i] == "ArrowDown" || input[i] == "s" || input[i] == "2")
{
moveCameraBackward();

// break;
}

if(input[i]==",")
{
lookCameraLeft();
//break;
}

if (input[i] == ".")
{
  lookCameraRight();
//break;
}
 
if (input[i] == "i")
{
  lookCameraUP();

//break;
}
 
if (input[i] == "k")
{
  lookCameraDown();
//break;
}

}//loop


 }
 

//-----------------------------//
/*
//LOCAL EVENT
window.addEventListener('keydown', e => {

move3d(e.key, xAxis, yAxis, zAxis);

});
*/

//touchesArray = [];

} //END MOVE

//-----------------------------//

let moveWaveFrequency=0.015;
let moveWaveAmplitude=1;
function moveCameraForward() 
{

 let sinMove=0;// Math.sin(Date.now() * moveWaveFrequency) * moveWaveAmplitude;
  
camera.position.x += camera.forward.x* moveSpeed;
camera.position.y += camera.forward.y* moveSpeed+sinMove;
camera.position.z += camera.forward.z * moveSpeed;
//light.rotation.x+=moveSpeed;
}

function moveCameraBackward() {
  let sinMove=0;// Math.sin(Date.now() * moveWaveFrequency) * moveWaveAmplitude;
camera.position.x -= camera.forward.x * moveSpeed;
camera.position.y -= camera.forward.y * moveSpeed+sinMove;
camera.position.z -= camera.forward.z * moveSpeed;
//light.rotation.x-=moveSpeed;
}

function moveCameraLeft() {
  
  let sinMove=0;// Math.sin(Date.now() * moveWaveFrequency) * moveWaveAmplitude;
  
  
camera.position.x += camera.right.x * moveSpeed;
camera.position.y += camera.right.y * moveSpeed+sinMove;
camera.position.z += camera.right.z * moveSpeed;
//light.rotation.z-=moveSpeed;

}

function moveCameraRight() {
  let sinMove=0;// Math.sin(Date.now() * moveWaveFrequency) * moveWaveAmplitude;
  
camera.position.x -= camera.right.x * moveSpeed;
camera.position.y -= camera.right.y * moveSpeed+sinMove;
camera.position.z -= camera.right.z * moveSpeed;
//light.rotation.z+=moveSpeed;
}

function moveCameraUp() {
camera.position.x += camera.up.x * moveSpeed;
camera.position.y += camera.up.y * moveSpeed;
camera.position.z += camera.up.z * moveSpeed;

}

function moveCameraDown() {
camera.position.x -= camera.up.x * moveSpeed;
camera.position.y -= camera.up.y * moveSpeed;
camera.position.z -= camera.up.z * moveSpeed;

}

function lookCameraUP() {
camera.rotation.x += rotationSpeed;
}

function lookCameraDown() {
camera.rotation.x -= rotationSpeed;

}

function lookCameraLeft() {
camera.rotation.y -= rotationSpeed;
//light.rotation.z-=0.1;

}

function lookCameraRight() {
camera.rotation.y += rotationSpeed;
//light.rotation.z+=0.1;
}


//-------------------------------------//


function fall(object)
{
  let plane = layers[0].objects[0].mesh;
  
  object.velocity.y-=0.05;
  
  let tolerance=35;
//console.log(plane); duck
let planeNormal=calculateTriangleNormal(plane[0]);

  
  // Calculate x and z limits based on the plane's vertices
  let xLimits = calculateXAxisLimits(plane);
  let zLimits = calculateZAxisLimits(plane);
  //console.log(xLimits); fuck
  //console.log(camera.position); fuck
  // Check if the object is outside x and z limits
  if(isAbovePlane(object.position, planeNormal, plane[0][0], tolerance ))
  {
  if ((object.position.x < xLimits.min ||
    object.position.x > xLimits.max ||
    object.position.z < zLimits.min ||
    object.position.z > zLimits.max
 )  )
  {
    // Apply falling velocity
    object.velocity.y -= 0.05;
  } 
  else 
  {
    // Reset falling velocity if within limits
    object.velocity.y = 0;
  }
  }
  
  

object.position.x += object.velocity.x;
  object.position.y += object.velocity.y;
  object.position.z += object.velocity.z;
  
  
}

//-------------------------------------//

  function isAbovePlane(objectPosition, planeNormal, planePoint, tolerance) {
    // Calculate the distance between the object and the plane
    let distance = {
      x: objectPosition.x - planePoint.x,
      y: objectPosition.y - planePoint.y,
      z: objectPosition.z - planePoint.z
    };
  
    // Calculate the dot product between the distance vector and the plane's normal
    let dotProduct = distance.x * planeNormal.x + distance.y * planeNormal.y + distance.z * planeNormal.z;
  
    // Check if the object is above the plane
    return dotProduct > -tolerance;
  }
  
  //-------------------------------------//
  
function calculateXAxisLimits(plane) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  // Iterate over vertices to find min and max values along the specified axis
  for (let i = 0; i < plane.length; i++) {
  
  let tri=plane[i];
  for(let u=0; u<tri.length;u++)
  {
    let value = tri[u].x;

    // Update min and max values
    if (value < min) min = value;
    if (value > max) max = value;
    //console.log(plane[i][]); duck
  }
  }

min *= plane.scale;
max *= plane.scale;

min += plane.position.x;
max += plane.position.x;
//console.log(max);
  return { min, max };
}

//-------------------------------------//

function calculateZAxisLimits(plane) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  // Iterate over vertices to find min and max values along the specified axis
  for (let i = 0; i < plane.length; i++) {
  
  let tri=plane[i];
  for(let u=0; u<tri.length;u++)
  {
    let value = tri[u].z;

    // Update min and max values
    if (value < min) min = value;
    if (value > max) max = value;
    //console.log(plane[i][]); duck
  }
  }
  
  min *= plane.scale;
  max *= plane.scale;
  
  min += plane.position.z;
  max += plane.position.z;
  return { min, max };
}

//-------------------------------------//

function respawn()
{
  if(camera.position.y<-1000)
  {
    camera.position.y=0;
    camera.position.x=-50;
    camera.position.z=-170;
  }
}

//-------------------------------------//

let joystickBase = document.getElementById('joystick-base');
let joystickStick = document.getElementById('joystick-stick');

let dragging = false;
let center = { x: 0, y: 0 };

let rotate = 0;
let moveForward = 0;

joystickBase.addEventListener('touchstart', e => {
  let touch = e.touches[0];
  let rect = joystickBase.getBoundingClientRect();
  center.x = rect.left + rect.width / 2;
  center.y = rect.top + rect.height / 2;
  dragging = true;
});

joystickBase.addEventListener('touchmove', e => {
  if (!dragging) return;
  let touch = e.touches[0];
  let dx = touch.clientX - center.x;
  let dy = touch.clientY - center.y;
  
  let maxDist = 40;
  let dist = Math.min(maxDist, Math.hypot(dx, dy));
  let angle = Math.atan2(dy, dx);
  
  let offsetX = Math.cos(angle) * dist;
  let offsetY = Math.sin(angle) * dist;
  
  joystickStick.style.left = `${40 + offsetX}px`;
  joystickStick.style.top = `${40 + offsetY}px`;
  
  rotate = offsetX / maxDist;
  moveForward = -offsetY / maxDist;
});

joystickBase.addEventListener('touchend', () => {
  joystickStick.style.left = '40px';
  joystickStick.style.top = '40px';
  dragging = false;
  rotate = 0;
  moveForward = 0;
});


let lastUpdateTime = 0;
let updateInterval = 20; // ms

function updateCamera() {
  let now = Date.now();
  if (now - lastUpdateTime < updateInterval) return;
  lastUpdateTime = now;
  
  let threshold = 0.4;
  
  if (moveForward > threshold) {
    moveCameraForward();
    camera.dirty=true;
  } else if (moveForward < -threshold) {
    moveCameraBackward();
    camera.dirty=true;
  }
  
  if (rotate > threshold) {
    lookCameraLeft();
    camera.dirty=true;
  } else if (rotate < -threshold) {
    lookCameraRight();
    camera.dirty=true;
  }
}