let scene, camera, renderer, player, obstacles = [];
const playerSpeed = 1;
let obstacleSpeed = 1;
const numObstacles = 30;
let score = 0;
let canMove = true;
let lastSpawnTime = Date.now();
let startTextMesh, instructionTextMesh;
let gameStarted = false;


function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-5, 10, 5);
  camera.lookAt(0, 0, 0);

  const scoreElement = document.createElement('div');
  scoreElement.id = "score";
  scoreElement.style.position = 'absolute';
  scoreElement.style.top = '10px';
  scoreElement.style.right = '10px';
  scoreElement.style.fontSize = '20px';
  document.body.appendChild(scoreElement);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  createPlayer();

  window.addEventListener('keydown', movePlayer, false);
  window.addEventListener('resize', onWindowResize, false);
   const gameContainer = document.querySelector('.middle');
  gameContainer.appendChild(renderer.domElement);
 
let scoreInterval = setInterval(() => {
    if (gameStarted) {
        score += 1;
        document.getElementById('score').innerText = `Score: ${Math.round(score)}`;
    }
}, 1000); // 1000ms = 1 second

}

function createPlayer() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(geometry, material);
  scene.add(player);
}

function createObstacle() {
  const geometry = new THREE.BoxGeometry(1, 1, 3);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const obstacle = new THREE.Mesh(geometry, material);

  obstacle.position.x = (Math.random() - 0.5) * 20;
  obstacle.position.z = player.position.z - 50 - Math.random() * 20;
  
  scene.add(obstacle);
  obstacles.push(obstacle);
}
function spawnObstacle() {
  const timeNow = Date.now();
  const timeSinceLastSpawn = timeNow - lastSpawnTime;
  const spawnInterval = Math.max(1000 - score * 5, 400); 

  if (timeSinceLastSpawn > spawnInterval) {
    createObstacle();
    lastSpawnTime = timeNow;
  }
}

function movePlayer(e) {
    e.preventDefault(); 
    
    if (!canMove) return;
    
    if (!gameStarted && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        document.getElementById('gameMessages').innerHTML = ''; 
        gameStarted = true;
    }

    let proposedXPosition;
    if (e.key === "ArrowRight") {
        proposedXPosition = player.position.x + playerSpeed;
    } else if (e.key === "ArrowLeft") {
        proposedXPosition = player.position.x - playerSpeed;
    }

    
    if (proposedXPosition > -10 && proposedXPosition < 10) {
        player.position.x = proposedXPosition;
        score += Math.abs(playerSpeed); 

        camera.position.x = player.position.x;
        camera.position.z = player.position.z + 10;
        camera.lookAt(player.position.x, 0, player.position.z);
    }

    player.position.y += 0.5;
    setTimeout(() => {
        player.position.y -= 0.5;
    }, 200);

    document.getElementById('score').innerText = `Score: ${score}`;

    canMove = false;
    setTimeout(() => {
        canMove = true;
    }, 200);
}


function animate() {
  
  requestAnimationFrame(animate);

  score += 0.01; 
  obstacleSpeed = 0.05 + 0.006 * score;

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].position.z += obstacleSpeed;
    if (obstacles[i].position.z - player.position.z > 20) {
      scene.remove(obstacles[i]);
      obstacles.splice(i, 1);
    }
  }

  spawnObstacle(); 

  checkCollisions();
  renderer.render(scene, camera);

  document.getElementById('score').innerText = `Score: ${Math.round(score)}`;
  }



function checkCollisions() {
    for (let obstacle of obstacles) {
        if (player.position.distanceTo(obstacle.position) < 1.5) {
            console.log('Collision detected!');
            
            document.getElementById('gameMessages').innerHTML = 'Game Over';

           
            const finalScoreElement = document.getElementById('finalScore');
            finalScoreElement.innerHTML = `Final Score: ${Math.round(score)}`;
            finalScoreElement.style.display = 'block';
          resetGame();
        }
    }
}



function resetGame() {
  player.position.set(0, 0.5, 0);
  score = 0;
  console.log("Score reset");
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
