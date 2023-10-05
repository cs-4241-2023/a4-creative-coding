const { THREE } = window;

// Create a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Lighting 
const directionalLight = new THREE.DirectionalLight(0xffffff, 7);
scene.add(directionalLight);

// Size and background of renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x4CDAE6); // bg color
document.body.appendChild(renderer.domElement);

// Add player cube
const playerGeometry = new THREE.BoxGeometry(5, 5, 5);
const playerMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

camera.position.z = 30;

// Key booleans
const keys = {
  left: {
    pressed: false,
  },
  right: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
  down: {
    pressed: false,
  },
};

// Press keys
window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyA":
      keys.left.pressed = true;
      break;
    case "KeyD":
      keys.right.pressed = true;
      break;
    case "KeyW":
      keys.up.pressed = true;
      break;
    case "KeyS":
      keys.down.pressed = true;
      break;
  }
});

// Release keys
window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
      keys.left.pressed = false;
      break;
    case "KeyD":
      keys.right.pressed = false;
      break;
    case "KeyW":
      keys.up.pressed = false;
      break;
    case "KeyS":
      keys.down.pressed = false;
      break;
  }
});

let frames = 0;
let spawnRate = 120;
let blockSpeed = 0.1;

const blocks = [];

/*
Check if two objects have hit each other
Takes in two objects and their width (cubes so width same as height)
Return true if they have intersected on both x and y axis
*/
function hit(ob1, w1, ob2, w2) {
  const hitX = ((ob1.position.x + w1/2) >= (ob2.position.x - w2/2)
  && (ob1.position.x - w1/2) <= (ob2.position.x + w2/2));
  const hitY = ((ob1.position.y - w1/2) <= (ob2.position.y + w2/2)
  && (ob1.position.y + w1/2) >= (ob2.position.y - w2/2));
  return hitX && hitY;
}

// Animate game loop 
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // Add new falling block based on spawnrate
  if (frames % spawnRate == 0) {
    const blockGeometry = new THREE.BoxGeometry(2,2,2);
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0xFF2D00 });
    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    block.position.y += 25;
    block.position.x += Math.random() * (-40 - 40) + 40;
    scene.add(block);
    blocks.push(block);
  }
  
  // Increase spawn rate and block speed as game goes on
  if (frames % 200 == 0) {
    if (spawnRate >= 30) spawnRate -= 5; // increase spawn rate
    blockSpeed += 0.01; // increase block speed
  }
  
  // Move player
  if (keys.left.pressed) {
    player.position.x -= 0.2;
    player.rotation.y += 0.05;
  }
  if (keys.right.pressed) {
    player.position.x += 0.2;
    player.rotation.y -= 0.05;
  }
  if (keys.up.pressed) {
    player.position.y += 0.2;
    player.rotation.x -= 0.05;
  }
  if (keys.down.pressed) {
    player.position.y -= 0.2;
    player.rotation.x += 0.05;
  }

  // Move falling blocks and check if they have hit player
  blocks.forEach((block) => {
    block.position.y -= blockSpeed;
    block.rotation.x += 0.02;
    block.rotation.y += 0.02;
    if (hit(player, 2.5, block, 1)) {
      location.replace("/gameover");
    }
  });
  
  // increase frames
  frames++;
}

animate();
