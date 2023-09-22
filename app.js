import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = 'black';

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 5); // Adjust camera position

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const cubeSpeed = 0.1;
    const cameraSpeed = 0.02;

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

    // Create a div element to display the score
    const scoreElement = document.createElement('div');
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '10px';
    scoreElement.style.left = '10px';
    scoreElement.style.color = 'white';
    scoreElement.style.fontFamily = 'Arial';
    scoreElement.style.fontSize = '24px';
    document.body.appendChild(scoreElement);

    const gameLoop = () => {
      requestAnimationFrame(gameLoop);

      renderer.clear();

      if (keyState['w'] || keyState['ArrowUp']) cube.position.z -= cubeSpeed;
      if (keyState['s'] || keyState['ArrowDown']) cube.position.z += cubeSpeed;
      if (keyState['a'] || keyState['ArrowLeft']) cube.position.x -= cubeSpeed;
      if (keyState['d'] || keyState['ArrowRight']) cube.position.x += cubeSpeed;

      // Update camera position relative to the cube
      camera.position.x = cube.position.x;
      camera.position.z = cube.position.z + 5; // Adjust the distance behind the cube
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

      // Update the score element
      scoreElement.textContent = `Score: ${score}`;

      renderer.render(scene, camera);
    };

    function resetGame() {
      score = 0;
      cube.position.set(0, 0, 0);
      camera.position.set(0, 1, 5); // Reset camera position
      camera.rotation.set(0, 0, 0); // Reset camera rotation
      obstacles.forEach((obstacle) => scene.remove(obstacle));
      obstacles.length = 0;
    }

    function getRandomColor() {
      const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    }

    gameLoop(); 