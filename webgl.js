let positionAttributeLocation;
let colorAttributeLocation;
let normalAttributeLocation;
let projectionUniformLocation;
let viewMatrixUniformLocation;
let modelMatrixUniformLocation;

let lightDirLocation;
let viewPosLocation;
let ambientColorLocation;
let lightColorLocation;
let shininessLocation;

let vertexBuffer;
let colorBuffer;
let normalBuffer;

function initWebGL() {
  
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL); // o gl.LEQUAL, dependiendo
let vertexShaderSource = `
attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform mat4 projection;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vFragPos;

void main() {
vec4 worldPos = modelMatrix * vec4(position, 1.0);
vFragPos = vec3(viewMatrix * worldPos);
vNormal = mat3(viewMatrix * modelMatrix) * normal;
vColor = color;

gl_Position = projection * viewMatrix * worldPos;
}
`;
/*
let fragmentShaderSource = 
`
precision mediump float;

varying vec4 vColor;
varying vec3 vNormal;

uniform vec3 lightDir;

void main() {
  vec3 norm = normalize(vNormal);
  vec3 light = normalize(lightDir);
  
  float diff = max(dot(norm, light), 0.0);
  
  // Color con luz difusa simple y sin especular
  vec3 color = vColor.rgb * (0.2 + 0.8 * diff); // 0.2 ambient fijo
  
  gl_FragColor = vec4(color, vColor.a);
}
`;
*/

let fragmentShaderSource = `
precision mediump float;

varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vFragPos;

uniform vec3 lightDir;
uniform vec3 viewPos;
uniform vec3 ambientColor;
uniform vec3 lightColor;
uniform float shininess;

void main() {
vec3 norm = normalize(vNormal);
vec3 lightDirNorm = normalize(lightDir);
vec3 viewDir = normalize(viewPos - vFragPos);
vec3 halfDir = normalize(lightDirNorm + viewDir);

float diff = max(dot(norm, lightDirNorm), 0.0);
float spec = pow(max(dot(norm, halfDir), 0.0), shininess);

vec3 ambient = ambientColor * vColor.rgb;
vec3 diffuse = lightColor * diff * vColor.rgb;
vec3 specular = lightColor * spec;

vec3 result = ambient + diffuse+ specular;

gl_FragColor = vec4(result, vColor.a);
}
`;


let vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

let program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);


positionAttributeLocation = gl.getAttribLocation(program, "position");
colorAttributeLocation = gl.getAttribLocation(program, "color");
normalAttributeLocation = gl.getAttribLocation(program, "normal");

projectionUniformLocation = gl.getUniformLocation(program, "projection");
viewMatrixUniformLocation = gl.getUniformLocation(program, "viewMatrix");
modelMatrixUniformLocation = gl.getUniformLocation(program, "modelMatrix");

lightDirLocation = gl.getUniformLocation(program, "lightDir");
viewPosLocation = gl.getUniformLocation(program, "viewPos");
ambientColorLocation = gl.getUniformLocation(program, "ambientColor");
lightColorLocation = gl.getUniformLocation(program, "lightColor");
shininessLocation = gl.getUniformLocation(program, "shininess");


vertexBuffer = gl.createBuffer();
colorBuffer = gl.createBuffer();
normalBuffer = gl.createBuffer();

gl.uniform3f(lightDirLocation, 0.0, 0.0, 1.0);
gl.uniform3f(viewPosLocation, 0.0, 0.0, 0.0); 
gl.uniform3f(ambientColorLocation, 0.1, 0.1, 0.1); 
gl.uniform3f(lightColorLocation, 1.0, 1.0, 1.0);
gl.uniform1f(shininessLocation, 200.0); 
}


function uploadMeshToGPU(mesh) {
  const vertices = [];
  const colors = [];
  const normals = [];
  
  for (let tri of mesh) {
    for (let v of tri) {
      vertices.push(v.x, v.y, v.z);
      colors.push(
        tri.color.r,
        tri.color.g,
        tri.color.b,
        tri.color.a !== undefined ? tri.color.a : 1.0
      );
      normals.push(v.normal.x, v.normal.y, v.normal.z);
    }
  }
  
  mesh.vertexCount = mesh.length * 3;
  
  mesh.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  mesh.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  mesh.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
}


function drawMeshGl(mesh) {
  // Posiciones
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  // Colores
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.colorBuffer);
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
  
  // Normales
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
  gl.enableVertexAttribArray(normalAttributeLocation);
  gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  
  // Dibujar
  gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexCount);
}

initWebGL();