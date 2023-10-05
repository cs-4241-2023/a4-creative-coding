//three tutorial from: https://www.youtube.com/watch?v=PPwR7h5SnOE&ab_channel=SimonDev
	//node: https://www.youtube.com/watch?v=puDiCbrjIzc&ab_channel=SimonDev
//dice wrap: https://www.pngwing.com/en/free-png-ycgvk
import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import DragControls from 'https://cdn.skypack.dev/three-dragcontrols';

const DEFAULT_MASS = 10;
let track;

class RigidBody {
	constructor() {
	}

	setRestitution(val) {
		this.body_.setRestitution(val);
	}

	setFriction(val) {
		this.body_.setFriction(val);
	}

	setRollingFriction(val) {
		this.body_.setRollingFriction(val);
	}

	createBox(mass, pos, quat, size) {
		this.transform_ = new Ammo.btTransform();
		this.transform_.setIdentity();
		this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
		this.transform_.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
		this.motionState_ = new Ammo.btDefaultMotionState(this.transform_);

		const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
		this.shape_ = new Ammo.btBoxShape(btSize);
		this.shape_.setMargin(0.05);

		this.inertia_ = new Ammo.btVector3(0, 0, 0);
		if (mass > 0) {
			this.shape_.calculateLocalInertia(mass, this.inertia_);
		}

		this.info_ = new Ammo.btRigidBodyConstructionInfo(
			mass, this.motionState_, this.shape_, this.inertia_);
		this.body_ = new Ammo.btRigidBody(this.info_);

		Ammo.destroy(btSize);
	}

	createSphere(mass, pos, quat, size) {
		this.transform_ = new Ammo.btTransform();
		this.transform_.setIdentity();
		this.transform_.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
		this.transform_.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
		this.motionState_ = new Ammo.btDefaultMotionState(this.transform_);

		const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
		this.shape_ = new Ammo.btSphereShape(btSize);
		this.shape_.setMargin(0.05);

		this.inertia_ = new Ammo.btVector3(0, 0, 0);
		if (mass > 0) {
			this.shape_.calculateLocalInertia(mass, this.inertia_);
		}

		this.info_ = new Ammo.btRigidBodyConstructionInfo(
			mass, this.motionState_, this.shape_, this.inertia_);
		this.body_ = new Ammo.btRigidBody(this.info_);

		Ammo.destroy(btSize);
	}
}


class DiceRoller {
	constructor() {}

	initialize() {
		this.collisionConfiguration_ = new Ammo.btDefaultCollisionConfiguration();
		this.dispatcher_ = new Ammo.btCollisionDispatcher(this.collisionConfiguration_);
		this.broadphase_ = new Ammo.btDbvtBroadphase();
		this.solver_ = new Ammo.btSequentialImpulseConstraintSolver();
		this.physicsWorld_ = new Ammo.btDiscreteDynamicsWorld(
			this.dispatcher_, this.broadphase_, this.solver_, this.collisionConfiguration_);
		this.physicsWorld_.setGravity(new Ammo.btVector3(0, -100, 0));

		this.threejs_ = new THREE.WebGLRenderer({
			antialias: true,
		});
		this.threejs_.shadowMap.enabled = true;
		this.threejs_.shadowMap.type = THREE.PCFSoftShadowMap;
		this.threejs_.setPixelRatio(window.devicePixelRatio);
		this.threejs_.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(this.threejs_.domElement);

		window.addEventListener('resize', () => {
			this.onWindowResize_();
		}, false);

		window.addEventListener('mousedown', this.startClick);

		const fov = 60;
		const aspect = 1920 / 1080;
		const near = 1.0;
		const far = 1000.0;
		this.camera_ = new THREE.PerspectiveCamera(fov, aspect, near, far);
		this.camera_.position.set(0, 20, 50);

		this.scene_ = new THREE.Scene();

		let light = new THREE.AmbientLight(0xFFFFFF);
		this.scene_.add(light);

		this.scene_.background = new THREE.Color(0xFFFFFF);

		const plane = new THREE.Mesh(
			new THREE.BoxGeometry(70, 1, 30),
			new THREE.MeshStandardMaterial({color: 0x404040}));
		plane.castShadow = false;
		plane.receiveShadow = true;
		this.scene_.add(plane);
		const rbPlane = new RigidBody();
		rbPlane.createBox(0, plane.position, plane.quaternion, new THREE.Vector3(70, 1, 30));
		rbPlane.setRestitution(0.99);
		this.physicsWorld_.addRigidBody(rbPlane.body_);

		const wallLeft = new THREE.Mesh(
			new THREE.BoxGeometry(1, 40, 30),
			new THREE.MeshStandardMaterial({transparent: true}).transparent = true);
		wallLeft.position.set(-35, 20, 0);
		wallLeft.castShadow = false;
		wallLeft.receiveShadow = true;
		this.scene_.add(wallLeft);
		const rbWallLeft = new RigidBody();
		rbWallLeft.createBox(0, wallLeft.position, wallLeft.quaternion, new THREE.Vector3(1, 40, 30));
		rbWallLeft.setRestitution(0.99);
		this.physicsWorld_.addRigidBody(rbWallLeft.body_);

		const wallRight = new THREE.Mesh(
			new THREE.BoxGeometry(1, 40, 30),
			new THREE.MeshStandardMaterial({transparent: true}).transparent = true);
		wallRight.position.set(35, 20, 0);
		wallRight.castShadow = false;
		wallRight.receiveShadow = true;
		this.scene_.add(wallRight);
		const rbWallRight = new RigidBody();
		rbWallRight.createBox(0, wallRight.position, wallRight.quaternion, new THREE.Vector3(1, 40, 30));
		rbWallRight.setRestitution(0.99);
		this.physicsWorld_.addRigidBody(rbWallRight.body_);

		const wallBack = new THREE.Mesh(
			new THREE.BoxGeometry(70, 40, 1),
			new THREE.MeshStandardMaterial({transparent: true}).transparent = true);
		wallBack.position.set(0, 20, -15);
		wallBack.castShadow = false;
		wallBack.receiveShadow = true;
		this.scene_.add(wallBack);
		const rbWallBack = new RigidBody();
		rbWallBack.createBox(0, wallBack.position, wallBack.quaternion, new THREE.Vector3(70, 40, 1));
		rbWallBack.setRestitution(0.99);
		this.physicsWorld_.addRigidBody(rbWallBack.body_);

		const wallFront = new THREE.Mesh(
			new THREE.BoxGeometry(70, 40, 1),
			new THREE.MeshStandardMaterial({transparent: true}).transparent = true);
		wallFront.position.set(0, 20, 15);
		wallFront.castShadow = false;
		wallFront.receiveShadow = true;
		this.scene_.add(wallFront);
		const rbWallFront = new RigidBody();
		rbWallFront.createBox(0, wallFront.position, wallFront.quaternion, new THREE.Vector3(70, 40, 1));
		rbWallFront.setRestitution(0.99);
		this.physicsWorld_.addRigidBody(rbWallFront.body_);

		this.rigidBodies_ = [];

		const loader2 = new THREE.TextureLoader();
		const dieFaces = [
			new THREE.MeshStandardMaterial({map: loader2.load("./resources/1.png")}),
			new THREE.MeshStandardMaterial({map: loader2.load("./resources/6.png")}),
			new THREE.MeshStandardMaterial({map: loader2.load("./resources/2.png")}),
			new THREE.MeshStandardMaterial({map: loader2.load("./resources/5.png")}),
			new THREE.MeshStandardMaterial({map: loader2.load("./resources/3.png")}),
			new THREE.MeshStandardMaterial({map: loader2.load("./resources/4.png")})
		]

		const die = new THREE.Mesh(
		  new THREE.BoxGeometry(4, 4, 4),
		  dieFaces);
		die.position.set(0, 40, 0);
		die.castShadow = true;
		die.receiveShadow = true;
		this.scene_.add(die);

		const rbBox = new RigidBody();
		rbBox.createBox(1, die.position, die.quaternion, new THREE.Vector3(4, 4, 4));
		rbBox.setRestitution(0.25);
		rbBox.setFriction(1);
		rbBox.setRollingFriction(5);
		this.physicsWorld_.addRigidBody(rbBox.body_);

		this.rigidBodies_.push({mesh: die, rigidBody: rbBox});

		this.tmpTransform_ = new Ammo.btTransform();

		this.previousRAF_ = null;
		this.raf_();
	}

	onWindowResize_() {
		this.camera_.aspect = window.innerWidth / window.innerHeight;
		this.camera_.updateProjectionMatrix();
		this.threejs_.setSize(window.innerWidth, window.innerHeight);
	}

	startClick(e){
		let x = e.clientX;
		let y = e.clientY;
		console.log('down');
		//create sphere around mouse
		//teleport dice to mouse
		//track sphere to mouse position
		window.addEventListener('mouseup', this.endClick);
	}

	endClick(e){
		console.log('up');
		window.removeEventListener('mouseup', this.endClick)
	}

	raf_() {
		requestAnimationFrame((t) => {
			if (this.previousRAF_ === null) {
				this.previousRAF_ = t;
			}

			this.step_(t - this.previousRAF_);
			this.threejs_.render(this.scene_, this.camera_);
			this.raf_();
			this.previousRAF_ = t;
		});
	}

	step_(timeElapsed) {
		const timeElapsedS = timeElapsed * 0.001;

		this.physicsWorld_.stepSimulation(timeElapsedS, 10);

		for (let i = 0; i < this.rigidBodies_.length; ++i) {
			this.rigidBodies_[i].rigidBody.motionState_.getWorldTransform(this.tmpTransform_);
			const pos = this.tmpTransform_.getOrigin();
			const quat = this.tmpTransform_.getRotation();
			const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
			const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());

			this.rigidBodies_[i].mesh.position.copy(pos3);
			this.rigidBodies_[i].mesh.quaternion.copy(quat3);
		}
	};
}


let APP_ = null;

window.addEventListener('DOMContentLoaded', async () => {
	Ammo().then((lib) => {
		Ammo = lib;
		APP_ = new DiceRoller();
		APP_.initialize();
	});
});
