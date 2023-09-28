import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = 'black';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const cubeSpeed = 0.1;
const cubeBounds = { minX: -5, maxX: 5 };

const keyState = {};

document.addEventListener('keydown', (event) => {
  keyState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  keyState[event.key] = false;
});

let score = 0;
const obstacles = [];
const obstacleGeometry = new THREE.BoxGeometry();
const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

function createObstacle() {
  const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  obstacle.position.x = Math.random() * 10 - 5;
  obstacle.position.z = -10;
  scene.add(obstacle);
  obstacles.push(obstacle);
}

const instructionsPanel = document.createElement('div');
instructionsPanel.style.position = 'absolute';
instructionsPanel.style.top = '50%';
instructionsPanel.style.left = '50%';
instructionsPanel.style.transform = 'translate(-50%, -50%)';
instructionsPanel.style.color = 'white';
instructionsPanel.style.fontFamily = 'Arial';
instructionsPanel.style.fontSize = '36px';
instructionsPanel.innerHTML = 'Welcome to Cube Dash. Try to avoid as many obstacles as possible. Press WASD or Arrow keys to move. Click this text to start.';
document.body.appendChild(instructionsPanel);

let gameCanBePlayed = false;

instructionsPanel.addEventListener('click', () => {
  document.body.removeChild(instructionsPanel);
  gameCanBePlayed = true;
  gameLoop();
});

const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontFamily = 'Arial';
scoreElement.style.fontSize = '24px';
document.body.appendChild(scoreElement);

const gameLoop = () => {
  if (!gameCanBePlayed) {
    return;
  }
  
  requestAnimationFrame(gameLoop);

  renderer.clear();

  if (keyState['w'] || keyState['ArrowUp']) {
    if (cube.position.z - cubeSpeed >= -10) {
      cube.position.z -= cubeSpeed;
    }
  }
  if (keyState['s'] || keyState['ArrowDown']) {
    if (cube.position.z + cubeSpeed <= 10) {
      cube.position.z += cubeSpeed;
    }
  }
  if (keyState['a'] || keyState['ArrowLeft']) {
    if (cube.position.x - cubeSpeed >= cubeBounds.minX) {
      cube.position.x -= cubeSpeed;
    }
  }
  if (keyState['d'] || keyState['ArrowRight']) {
    if (cube.position.x + cubeSpeed <= cubeBounds.maxX) {
      cube.position.x += cubeSpeed;
    }
  }

  camera.position.x = cube.position.x;
  camera.position.z = cube.position.z + 5;
  camera.lookAt(cube.position);

  obstacles.forEach((obstacle) => {
    obstacle.position.z += 0.05;
    if (cube.position.distanceTo(obstacle.position) < 0.5) {
      alert(`Game Over! Your Score: ${score}`);
      resetGame();
    }
    if (obstacle.position.z > 5) {
      score++;
      scene.remove(obstacle);
      obstacles.shift();
    }
  });

  if (Math.random() < 0.02) {
    createObstacle();
  }

  scoreElement.textContent = `Score: ${score}`;

  renderer.render(scene, camera);
};

function resetGame() {
  score = 0;
  cube.position.set(0, 0, 0);
  camera.position.set(0, 1, 5);
  camera.rotation.set(0, 0, 0);
  obstacles.forEach((obstacle) => scene.remove(obstacle));
  obstacles.length = 0;
}

function getRandomColor() {
  const colors = [
    0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 
    0xff6600, 0x9900cc, 0x66ff33, 0x0099cc, 0xcc0099
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
