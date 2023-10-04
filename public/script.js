import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a spaceship
const spaceshipGeometry = new THREE.BoxGeometry(1, 1, 1);
const spaceshipMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
scene.add(spaceship);

// Position the camera
camera.position.z = 5;

// Game variables
let spaceshipSpeed = 0.05;
let targets = [];
let shooting = false;

// Create moving targets
function createTarget() {
    const targetGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const target = new THREE.Mesh(targetGeometry, targetMaterial);
    target.position.x = Math.random() * 10 - 5; // Random x position
    target.position.y = 5; // Start from the top
    target.position.z = -5; // Initial depth
    scene.add(target);
    targets.push(target);
}

// Shooting functionality
function shoot() {
    const bulletGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(spaceship.position);
    scene.add(bullet);

    const bulletSpeed = 0.2;
    const bulletUpdate = () => {
        bullet.position.y += bulletSpeed;
        if (bullet.position.y > 5) {
            scene.remove(bullet);
        }
    };

    const bulletInterval = setInterval(bulletUpdate, 16);

    // Remove bullet after a timeout
    setTimeout(() => {
        clearInterval(bulletInterval);
        scene.remove(bullet);
    }, 2000);
}

// Game loop
const animate = () => {
    requestAnimationFrame(animate);

    // Move the spaceship left and right
    if (spaceship.position.x < -4) {
        spaceship.position.x = -4;
    } else if (spaceship.position.x > 4) {
        spaceship.position.x = 4;
    }

    // Move the targets
    targets.forEach((target, index) => {
        target.position.y -= 0.02; // Move down
        if (target.position.y < -5) {
            // Remove targets that go out of view
            scene.remove(target);
            targets.splice(index, 1);
        }
    });

    // Check for collisions (simple bounding box collision)
    targets.forEach((target, index) => {
        if (
            spaceship.position.x - 0.5 < target.position.x + 0.25 &&
            spaceship.position.x + 0.5 > target.position.x - 0.25 &&
            spaceship.position.y - 0.5 < target.position.y + 0.25 &&
            spaceship.position.y + 0.5 > target.position.y - 0.25
        ) {
            // Collision occurred
            alert("Game Over!");
            location.reload(); // Reload the page to restart the game
        }
    });

    // Render the scene
    renderer.render(scene, camera);
};

// Handle user input (left, right, and spacebar to shoot)
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            // Move left
            spaceship.position.x -= spaceshipSpeed;
            break;
        case 'ArrowRight':
            // Move right
            spaceship.position.x += spaceshipSpeed;
            break;
        case ' ':
            // Spacebar to shoot
            if (!shooting) {
                shooting = true;
                shoot();
                setTimeout(() => {
                    shooting = false;
                }, 200); // Cooldown time between shots
            }
            break;
    }
});

// Start the game loop
animate();

// Create moving targets at regular intervals
setInterval(createTarget, 2000);
