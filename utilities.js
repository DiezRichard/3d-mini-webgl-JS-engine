
function loadObj(file) {
  let request = new XMLHttpRequest();
  let mesh = [];
  
  request.open("GET", file, false);
  
  request.onreadystatechange = function() {
    if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
      let obj = request.responseText;
      let lines = obj.split(/\r?\n/);
      let vertices = [];
      
      for (let line of lines) {
        line = line.trim();
        if (line.startsWith("v ")) {
          let parts = line.slice(2).replace(/,/g, ".").trim().split(/\s+/);
          let v = {
            x: parseFloat(parts[0]),
            y: parseFloat(parts[1]),
            z: parseFloat(parts[2]),
            color: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 }
          };
          vertices.push(v);
        }
      }
      
      for (let line of lines) {
        line = line.trim();
        if (line.startsWith("f ")) {
          let parts = line.slice(2).trim().split(/\s+/);
          let indices = parts.map(p => parseInt(p.split("/")[0]) - 1);
          
          if (indices.length === 3) {
            let tri = [
              { ...vertices[indices[0]] },
              { ...vertices[indices[1]] },
              { ...vertices[indices[2]] },
            ];
            tri.visible = true;
            tri.color = { r: 0.5, g: 0.5, b: 0.5, a: 1.0 };
            mesh.push(tri);
          }
          
          if (indices.length === 4) {
            let tri1 = [
              { ...vertices[indices[0]] },
              { ...vertices[indices[1]] },
              { ...vertices[indices[2]] },
            ];
            tri1.visible = true;
            tri1.color = { r: 0.5, g: 0.5, b: 0.5, a: 1.0 };
            mesh.push(tri1);
            
            let tri2 = [
              { ...vertices[indices[0]] },
              { ...vertices[indices[2]] },
              { ...vertices[indices[3]] },
            ];
            tri2.visible = true;
            tri2.color = { r: 0.5, g: 0.5, b: 0.5, a: 1.0 };
            mesh.push(tri2);
          }
        }
      }
    }
  };
  
  request.send(null);
  return mesh;
}

//-----------------------//


function loadMiniMesh(file) {
  let request = new XMLHttpRequest();
  let mesh = [];
  
  request.open("GET", file, false);
  
  request.onreadystatechange = function() {
    if (request.readyState === 4 && (request.status === 200 || request.status === 0)) {
      let lines = request.responseText.split(/\r?\n/);
      
      for (let line of lines) {
        if (!line.trim().startsWith("t")) continue;
        
        let parts = line.trim().split(/\s+/);
        if (parts.length !== 13) continue;
        
        let [
          _t,
          x0, y0, z0,
          x1, y1, z1,
          x2, y2, z2,
          r, g, b
        ] = parts;
        
        let color = {
          r: parseInt(r)/255,
          g: parseInt(g)/255,
          b: parseInt(b)/255,
          a:1.0
        };
        
        let v0 = { x: parseFloat(x0), y: parseFloat(y0), z: parseFloat(z0), color: { ...color } };
        let v1 = { x: parseFloat(x1), y: parseFloat(y1), z: parseFloat(z1), color: { ...color } };
        let v2 = { x: parseFloat(x2), y: parseFloat(y2), z: parseFloat(z2), color: { ...color } };
        
        let tri = [v0, v1, v2];
        
        tri.color = color; // Color global del triángulo (por compatibilidad)
        tri.visible = true;
        
        mesh.push(tri);
      }
    }
  };
  
  request.send(null);
  return mesh;
}

//-----------------------//

//UTILITIES

//column major
function matrixTimesVector(v, matrix) {
let x1 = v.x * matrix[0][0] + v.y * matrix[1][0] + v.z * matrix[2][0];
let y1 = v.x * matrix[0][1] + v.y * matrix[1][1] + v.z * matrix[2][1];
let z1 = v.x * matrix[0][2] + v.y * matrix[1][2] + v.z * matrix[2][2];

let vec = { x: x1, y: y1, z: z1 };

return vec;
}



//-----------------------//

function cross(v1,v2)
{
let vx = v1.y*v2.z-v1.z*v2.y;
let vy = v1.x*v2.z-v1.z*v2.x;
let vz = v1.x*v2.y-v1.y*v2.x;

let newV={x:vx,y:vy,z:vz};

return newV;
};

//-----------------------//

function vectorSub(v1,v2)
{
let newV={x:(v1.x-v2.x),y:(v1.y-v2.y),z:(v1.z-v2.z)};

return newV;
}

//-----------------------//

function vectorAdd(v1, v2)
{
let newV = { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };

return newV;
}

//-----------------------//

function normV(v)
{
let len=(Math.sqrt((v.x*v.x+v.y*v.y+v.z*v.z)));
//len=Math.floor(len);
let newV={x:v.x/len,y:v.y/len,z:v.z/len};

return newV;
}

//-----------------------//

function dotP(v1,v2)
{
let result= v1.x*v2.x+v1.y*v2.y+v1.z*v2.z;

return result;
}


//-----------------------//

function vectorMultif(v, f)
{
let newV= {x:v.x*f,y:v.y*f,z:v.z*f};

return newV;
}

//-----------------------//



//inplace
function meshByMatrix(mesh, matrix) {
  for (let i = 0; i < mesh.length; i++) {
    const tri = mesh[i];
    
    for (let j = 0; j < 3; j++) {
      const v = tri[j];
      
      const x = v.x;
      const y = v.y;
      const z = v.z;
      
      v.x = x * matrix[0][0] + y * matrix[0][1] + z * matrix[0][2] + matrix[0][3];
      v.y = x * matrix[1][0] + y * matrix[1][1] + z * matrix[1][2] + matrix[1][3];
      v.z = x * matrix[2][0] + y * matrix[2][1] + z * matrix[2][2] + matrix[2][3];
      v.w = x * matrix[3][0] + y * matrix[3][1] + z * matrix[3][2] + matrix[3][3];
    }
    // No es necesario tocar tri.color, tri.visible, etc., ya están en el objeto
  }
  
  // No retorna nada porque modifica in-place
}

//-----------------------//


function normalizeVector(vector) 
{
let length = vectorLength(vector);
return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}

//-----------------------//

function vectorLength(vector) 
{
return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

//-----------------------//

function calculateTriangleNormal(triangle) 
{
// Calculate the cross product of two vectors formed by the triangle's vertices
let v1 = vectorFromVertices(triangle[0], triangle[1]);
let v2 = vectorFromVertices(triangle[0], triangle[2]);

let normal = {
x: v1.y * v2.z - v1.z * v2.y,
y: v1.z * v2.x - v1.x * v2.z,
z: v1.x * v2.y - v1.y * v2.x
};

return normal;
}

//-----------------------//

function vectorFromVertices(v1, v2) {
return { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
}

//-----------------------//

function matrixMultiply(matrix1, matrix2)
{
let result = [];
for (let i = 0; i < matrix1.length; i++) {
result[i] = [];
for (let j = 0; j < matrix2[0].length; j++) {
let sum = 0;
for (let k = 0; k < matrix1[0].length; k++) {
sum += matrix1[i][k] * matrix2[k][j];
}
result[i][j] = sum;
}
}
return result;
}

//-----------------------//

function createRotationMatrix(axis, angle) {
let cos = Math.cos(angle);
let sin = Math.sin(angle);
let t = 1 - cos;

let matrix = [
[t * axis.x * axis.x + cos, t * axis.x * axis.y - sin * axis.z, t * axis.x * axis.z + sin * axis.y, 0],
[t * axis.x * axis.y + sin * axis.z, t * axis.y * axis.y + cos, t * axis.y * axis.z - sin * axis.x, 0],
[t * axis.x * axis.z - sin * axis.y, t * axis.y * axis.z + sin * axis.x, t * axis.z * axis.z + cos, 0],
[0, 0, 0, 1]
];

return matrix;
}

//-----------------------//


function centerMeshOnGround(mesh) {
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  let minY = Infinity;

  for (let tri of mesh) {
    for (let v of tri) {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
      if (v.z < minZ) minZ = v.z;
      if (v.z > maxZ) maxZ = v.z;
      if (v.y < minY) minY = v.y;
    }
  }

  let offsetX = (minX + maxX) / 2;
  let offsetZ = (minZ + maxZ) / 2;

  for (let tri of mesh) {
    for (let v of tri) {
      v.x -= offsetX;
      v.z -= offsetZ;
      v.y -= minY; // base toca suelo
    }
  }
}

//-----------------------//



function precalcularNormal(mesh) {
  for (let tri of mesh) {
    let [v0, v1, v2] = tri;
    
    // Vector U = v1 - v0
    let ux = v1.x - v0.x;
    let uy = v1.y - v0.y;
    let uz = v1.z - v0.z;
    
    // Vector V = v2 - v0
    let vx = v2.x - v0.x;
    let vy = v2.y - v0.y;
    let vz = v2.z - v0.z;
    
    // Producto cruzado U × V
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    
    // Normalizar
    let len = Math.hypot(nx, ny, nz);
    if (len < 0.0001) {
      nx = ny = nz = 0; // triángulo degenerado
    } else {
      nx /= len;
      ny /= len;
      nz /= len;
    }
    
    // Asignar normal a los 3 vértices
    v0.normal = { x: nx, y: ny, z: nz };
    v1.normal = { x: nx, y: ny, z: nz };
    v2.normal = { x: nx, y: ny, z: nz };
    
    // (opcional) Guardar también en tri.normal si quieres
    tri.normal = { x: nx, y: ny, z: nz };
  }
}

//-----------------------//

function rotateMesh(mesh, axis, angle) {
  
  mesh.isRotating=true;
  
  // Crear matriz de rotación 4x4
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  let t = 1 - cos;
  let x = axis.x, y = axis.y, z = axis.z;

  let rotMatrix = [
    [t*x*x + cos,     t*x*y - sin*z,  t*x*z + sin*y],
    [t*x*y + sin*z,   t*y*y + cos,    t*y*z - sin*x],
    [t*x*z - sin*y,   t*y*z + sin*x,  t*z*z + cos]
  ];

  // Para rotar alrededor del centro, primero calcular centro
  let center = { x: 0, y: 0, z: 0 };
  let count = 0;
  for (let tri of mesh) {
    for (let v of tri) {
      center.x += v.x;
      center.y += v.y;
      center.z += v.z;
      count++;
    }
  }
  center.x /= count;
  center.y /= count;
  center.z /= count;

  // Rotar cada vértice respecto al centro
  for (let tri of mesh) {
    for (let v of tri) {
      // Trasladar a origen
      let px = v.x - center.x;
      let py = v.y - center.y;
      let pz = v.z - center.z;

      // Multiplicar por matriz rotación
      let rx = rotMatrix[0][0] * px + rotMatrix[0][1] * py + rotMatrix[0][2] * pz;
      let ry = rotMatrix[1][0] * px + rotMatrix[1][1] * py + rotMatrix[1][2] * pz;
      let rz = rotMatrix[2][0] * px + rotMatrix[2][1] * py + rotMatrix[2][2] * pz;

      // Trasladar de nuevo
      v.x = rx + center.x;
      v.y = ry + center.y;
      v.z = rz + center.z;
    }
  }
}

function computeRotationMatrix(axis, angle) {
  let x = axis.x, y = axis.y, z = axis.z;
  let len = Math.hypot(x, y, z);
  if (len === 0) return mat4.identity();

  x /= len; y /= len; z /= len;

  let s = Math.sin(angle);
  let c = Math.cos(angle);
  let t = 1 - c;

  return [
    [t*x*x + c,     t*x*y - s*z,   t*x*z + s*y,   0],
    [t*x*y + s*z,   t*y*y + c,     t*y*z - s*x,   0],
    [t*x*z - s*y,   t*y*z + s*x,   t*z*z + c,     0],
    [0,             0,             0,             1],
  ];
}

//-----------------------//

function rotateAnimation(animation, axis, angle) {
  // Crear matriz de rotación 3x3
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  let t = 1 - cos;
  let x = axis.x, y = axis.y, z = axis.z;

  let rotMatrix = [
    [t*x*x + cos,     t*x*y - sin*z,  t*x*z + sin*y],
    [t*x*y + sin*z,   t*y*y + cos,    t*y*z - sin*x],
    [t*x*z - sin*y,   t*y*z + sin*x,  t*z*z + cos]
  ];

  // Calcular el centro de todos los vértices en toda la animación
  let center = { x: 0, y: 0, z: 0 };
  let count = 0;

  for (let mesh of animation) {
    for (let tri of mesh) {
      for (let v of tri) {
        center.x += v.x;
        center.y += v.y;
        center.z += v.z;
        count++;
      }
    }
  }

  center.x /= count;
  center.y /= count;
  center.z /= count;

  // Aplicar rotación a todos los vértices
  for (let mesh of animation) {
    
    mesh.isRotating=true;
    for (let tri of mesh) {
      for (let v of tri) {
        // Trasladar a origen
        let px = v.x - center.x;
        let py = v.y - center.y;
        let pz = v.z - center.z;

        // Rotar
        let rx = rotMatrix[0][0] * px + rotMatrix[0][1] * py + rotMatrix[0][2] * pz;
        let ry = rotMatrix[1][0] * px + rotMatrix[1][1] * py + rotMatrix[1][2] * pz;
        let rz = rotMatrix[2][0] * px + rotMatrix[2][1] * py + rotMatrix[2][2] * pz;

        // Volver a trasladar
        v.x = rx + center.x;
        v.y = ry + center.y;
        v.z = rz + center.z;
      }
    }
  }
}

//-----------------------//

function multiplyMatrices(...matrices) {
  return matrices.reduce((acc, m) => matrixMultiply(acc, m));
}

//-----------------------//

function toWorldView(mesh) {
  let xMatrix = createRotationMatrix({ x: 1, y: 0, z: 0 }, mesh.rotation.x);
  let yMatrix = createRotationMatrix({ x: 0, y: 1, z: 0 }, mesh.rotation.y);
  let zMatrix = createRotationMatrix({ x: 0, y: 0, z: 1 }, mesh.rotation.z);
  
  let tMatrix = [
    [mesh.scale, 0, 0, mesh.position.x],
    [0, mesh.scale, 0, mesh.position.y],
    [0, 0, mesh.scale, mesh.position.z],
    [0, 0, 0, 1],
  ];
  
  return multiplyMatrices(tMatrix, zMatrix, yMatrix, xMatrix);
  
  //return meshByMatrix(mesh, composedMatrix);
}


function toWorldView(mesh) {
  
  let axis = { x: 0, y: 1, z: 0 }; // eje Y

  let rotationMatrix = computeRotationMatrix(axis, rotAngle);
  
  // Matriz de escala 4x4
  let scaleMatrix = [
    [mesh.scale, 0, 0, 0],
    [0, mesh.scale, 0, 0],
    [0, 0, mesh.scale, 0],
    [0, 0, 0, 1],
  ];
  
  // Matriz de traslación 4x4
  let translationMatrix = [
    [1, 0, 0, mesh.position.x],
    [0, 1, 0, mesh.position.y],
    [0, 0, 1, mesh.position.z],
    [0, 0, 0, 1],
  ];
  
  // Multiplica matrices en orden: T * R * S
  let trsMatrix = multiplyMatrices(translationMatrix, rotationMatrix, scaleMatrix);
  
  return trsMatrix;
}

//-----------------------//

function getRotationMatrix(mesh) {
  let xMatrix = createRotationMatrix({ x: 1, y: 0, z: 0 }, mesh.rotation.x);
  let yMatrix = createRotationMatrix({ x: 0, y: 1, z: 0 }, mesh.rotation.y);
  let zMatrix = createRotationMatrix({ x: 0, y: 0, z: 1 }, mesh.rotation.z);
  return multiplyMatrices(zMatrix, yMatrix, xMatrix);
}
//-----------------------//

function updateViewMatrix() {

  let camPosMatrix = [
    [1, 0, 0, -camera.position.x],
    [0, 1, 0, -camera.position.y],
    [0, 0, 1, -camera.position.z],
    [0, 0, 0, 1]
  ];
  

  let  rx = createRotationMatrix({ x: 1, y: 0, z: 0 }, camera.rotation.x);
  let  ry = createRotationMatrix({ x: 0, y: -1, z: 0 }, camera.rotation.y);
  let  rz = createRotationMatrix({ x: 0, y: 0, z: 1 }, camera.rotation.z);
  

  let  rotationMatrix = matrixMultiply(rx, ry, rz);
  

  camera.forward = matrixTimesVector({ x: 0, y: 0, z: -1 }, rotationMatrix);

camera.up = matrixTimesVector({ x: 0, y: 1, z: 0 }, rotationMatrix);
  camera.right = matrixTimesVector({ x:1, y: 0, z: 0 }, rotationMatrix);
  
  return matrixMultiply(rotationMatrix, camPosMatrix);
}

//-----------------------//


