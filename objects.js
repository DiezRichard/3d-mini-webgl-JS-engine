function createMesh({ path, name = null, scale = 1, position, rotation }) {
  let raw = loadMiniMesh(path); // array de triángulos
  
  centerMeshOnGround(raw);
  // centra en el suelo o en el origen según cómo esté definida
  
  // Aplica transformación local (escala y posición solamente)
  for (let tri of raw) {
    for (let v of tri) {
      v.x *= scale;
      v.y *= scale;
      v.z *= scale;
      
      v.x += position.x;
      v.y += position.y;
      v.z += position.z;
    }
  }
  
  if (!name) {
    let match = path.match(/\/([^\/]+)\.txt$/);
    name = match ? match[1] : "unnamed";
  }
  
  raw.name = name;
  raw.scale = scale;
  raw.position = position;
  raw.rotation = rotation;
  
  meshes.push(raw);
  
  return raw;
}
function loadAnimationFromFolder(folderPath, baseName, frameCount, options = {}) {
  let animationList = [];
  
  for (let i = 0; i < frameCount; i++) {
    let name = `${baseName}_${i}`;
    let path = `${folderPath}/${name}.txt`;
    
    let mesh = createMesh({
      path,
      name,
      scale: options.scale || 1,
      position: options.position || { x: 0, y: 0, z: 0 },
      rotation: options.rotation || { x: 0, y: 0, z: 0 }
    });
    
    animationList.push(mesh);
  }
  
  // Agrega estado de animación
  animationList.currentFrameIndex = 0;
  animationList.running = false;
  animationList.activeMeta = animationList[0];
  
  return animationList;
}

function animate(animationList) {
  if (!animationList.running) {
    setInterval(() => {
      animationList.currentFrameIndex = (animationList.currentFrameIndex + 1) % animationList.length;
      animationList.activeMeta = animationList[animationList.currentFrameIndex];
    }, animationSpeed);
    animationList.running = true;
  }
  
  // Devolver todos menos el actual
  return animationList.filter(mesh => mesh !== animationList.activeMeta);
}
/*
let pigAnimation = loadAnimationFromFolder(
  "obj/pig1",
  "pig",
  2,
  {
    scale: globalScale,
    position: { x: 8, y: 0, z: 50 }
  }
);

let pigAnimation2 = loadAnimationFromFolder(
  "obj/pig1",
  "pig",
  2,
  {
    scale: globalScale,
    position: { x: 6, y: 0, z: 40 }
  }
);


let sword1Animation2 = loadAnimationFromFolder(
  "obj/sword1",
  "sword1",
  17,
  {
    scale: globalScale,
    position: { x: 4, y: 0, z: 67 }
  }
);

let sword1Animation3 = loadAnimationFromFolder(
  "obj/sword1",
  "sword1",
  17,
  {
    scale: globalScale,
    position: { x: 2, y: 0, z: 68 }
  }
);

let sword1Animation4 = loadAnimationFromFolder(
  "obj/sword1",
  "sword1",
  17,
  {
    scale: globalScale,
    position: { x: 0, y: 0, z: 69 }
  }
);

let sword1Animation5 = loadAnimationFromFolder(
  "obj/sword1",
  "sword1",
  17,
  {
    scale: globalScale,
    position: { x: -2, y: 0, z: 71}
  }
);


let sword1Animation = loadAnimationFromFolder(
  "obj/sword1",
  "sword1",
  17,
  {
    scale: globalScale,
    position: { x: -4, y: 0, z: 65 }
  }
);



let tree1= createMesh({
  
  path:"obj/tree25.txt",
  name:"tree1",
  scale: globalScale || 1,
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 }
});



let tree2 = createMesh({
  
  path: "obj/tree25.txt",
  name: "tree2",
  scale: globalScale || 1,
  position: { x: 6, y: 0, z: 30 },
  rotation: { x: 0, y: 0, z: 0 }
});

let tree3 = createMesh({
  
  path: "obj/tree25.txt",
  name: "tree3",
  scale: globalScale || 1,
  position: { x: 0, y: 0, z: 30 },
  rotation: { x: 0, y: 0, z: 0 }
});

let tree4 = createMesh({
  
  path: "obj/tree25.txt",
  name: "tree4",
  scale: globalScale || 1,
  position: { x: 0, y: 0, z: 30 },
  rotation: { x: 0, y: 0, z: 0 }
});

let tree5 = createMesh({
  
  path: "obj/tree25.txt",
  name: "tree5",
  scale: globalScale || 1,
  position: { x: 8, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 }
});

*/
/*``
let mono = createMesh({
  
  path: "obj/mono.txt",
  name: "mono",
  scale: globalScale*2 || 1,
  position: { x: 0, y: 0, z: -10 },
  rotation: { x: 0, y: 0, z: 0}
});


let mono2 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono2",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -15 },
  rotation: { x: 0, y: 0, z: 0 }
});

let mono3 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono3",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -20 },
  rotation: { x: 0, y: 0, z: 0 }
});

let mono4 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono4",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -25},
  rotation: { x: 0, y: 0, z: 0 }
});


let mono5 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono5",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -30 },
  rotation: { x: 0, y: 0, z: 0 }
});

let mono6 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono6",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -35 },
  rotation: { x: 0, y: 0, z: 0 }
});


let mono7 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono7",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -40 },
  rotation: { x: 0, y: 0, z: 0 }
});


let mono8 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono8",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -45 },
  rotation: { x: 0, y: 0, z: 0 }
});

let mono9 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono9",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -50 },
  rotation: { x: 0, y: 0, z: 0 }
});

let mono10 = createMesh({
  
  path: "obj/mono.txt",
  name: "mono10",
  scale: globalScale * 2 || 1,
  position: { x: 0, y: 0, z: -55 },
  rotation: { x: 0, y: 0, z: 0 }
});

*/
/*
let tree = createMesh({
  
  path: "obj/tree25.txt",
  name: "tree",
  scale: globalScale || 1,
  position: { x: 0, y: 0, z: -10 },
  rotation: { x: 0, y: 0, z: 0 }
});
*/






let body = loadObj("obj/body.obj");
body.scale = globalScale * 4;
body.name = "body";
body.position = { x: 0, y: -2, z: 0 };
body.rotation = { x: 0, y: 0, z: 0 };

//=meshes.push(body)

function splitMesh(mesh, size, outMesh) {
  let numPieces = Math.ceil(mesh.length / size);
  
  for (let i = 0; i < numPieces; i++) {
    let start = i * size;
    let end = Math.min((i + 1) * size, mesh.length);
    
    let piece = mesh.slice(start, end);
    
    // Copiar propiedades del mesh original
    piece.scale = mesh.scale;
    piece.position = { ...mesh.position };
    piece.rotation = { ...mesh.rotation };
    piece.name = mesh.name + "_part" + i;
    
    outMesh.push(piece);
  }
}

meshes.push(body)

//splitMesh(body, Math.ceil(body.length/2), meshes);

