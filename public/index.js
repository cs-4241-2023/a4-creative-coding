//tutorial followed: https://www.youtube.com/watch?v=PPwR7h5SnOE&ab_channel=SimonDev class DiceTray{//what you roll dice in
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import * as Ammo from "https://cdn.jsdelivr.net/gh/kripken/ammo.js@HEAD/builds/ammo.wasm.js";


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
}


class DiceTray{//what you roll dice in
	constructor(){
		this._Initialize();
	}

	_Initialize(){
		this.collisionConfiguration_ = new Ammo.btDefaultCollisionConfiguration();
		this.dispatcher_ = new Ammo.btCollisionDispatcher(this.collisionConfiguration_);
		this.broadphase_ = new Ammo.btDbvtBroadphase();
		this.solver_ = new Ammo.btSequentialImpulseConstraintSolver();
		this.physicsWorld_ = new Ammo.btDiscreteDynamicsWorld(
			this.dispatcher_, this.broadphase_, this.solver_, this.collisionConfiguration_);
		this.physicsWorld_.setGravity(new Ammo.btVector3(0, -10, 0));


		this._threejs = new THREE.WebGLRenderer();
		this._threejs.shadowMap.enabled = true;
		this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
		this._threejs.setPixelRatio(window.devicePixelRatio);
		this._threejs.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this._threejs.domElement);

		const fov = 60;
		const aspect = 1920/1080;
		const near = 1;
		const far = 1000;
		this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		this._camera.position.set(0, 29, 100);

		this._scene = new THREE.Scene();

		let light = new THREE.DirectionalLight(0xFFFFFF);
		light.position.set(100,100,100);
		light.target.position.set(0,0,0);
		light.castShadow = true;
		light.shadow.bias = -0.01;
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;
		light.shadow.camera.near = 1.0;
		light.shadow.camera.far = 500;
		light.shadow.camera.left = 200;
		light.shadow.camera.right = -200;
		light.shadow.camera.top = 200;
		light.shadow.camera.bottom = -200;
		this._scene.add(light);

		light = new THREE.AmbientLight(0x040404);
		this._scene.add(light);

		// const controls = new OrbitControls(
		// 	this._camera, this._threejs.domElement);
		// controls.target.set(0, 20, 0);
		// controls.update();

		const loader = new THREE.CubeTextureLoader();
		const texture = loader.load([
			"/resources/posx.png",
			"/resources/negx.png",
			"/resources/posy.png",
			"/resources/negy.png",
			"/resources/posz.png",
			"/resources/negz.png"
		]);
		this._scene.background = texture;

		//plane -> enclosed cage, make it a rectangular prism the size of the screen?
		const plane = new THREE.Mesh(
			new THREE.BoxGeometry(100, 1, 100),
			new THREE.MeshStandardMaterial({color:0x0000FF})
		);
		plane.castShadow = false;
		plane.receiveShadow = true;
		this._scene.add(plane);

		const rbPlane = new RigidBody();
		rbPlane.createBox(0, plane.position, plane.quaternion, THREE.Vector3(100,1,100));
		this.physicsWorld_.addRigidBody(rbPlane.body_);

		//die
		const die = new THREE.Mesh(
			new THREE.BoxGeometry(100, 1, 100),
			new THREE.MeshStandardMaterial({color:0x808080})
		);
		die.castShadow = true;
		die.receiveShadow = true;
		this._scene.add(die);

		const rbDie = new RigidBody();
		rbDie.createBox(10, die.position, die.quaternion, THREE.Vector3(100,100,100));
		this.physicsWorld_.addRigidBody(rbPlane.body_);

		this._scene.add(die);

		this.RAF();
	}

	_OnWindowResize(){
		this._camera.aspect = window.innerWidth/window.innerHeight;
		this._camera.updateProjectionMatrix();
		this._threejs.setSize(window.innerWidth, window.innerHeight);
	}

	RAF(){
		requestAnimationFrame((t) => {
			if (this.previousRAF_ === null) {
				this.previousRAF_ = t;
			}

			this.step(t - this.previousRAF_);
			this._threejs.render(this._scene, this._camera);
			this.RAF();
		});
	}

	step(timeElapsed){
		const timeElapsedS = timeElapsed*0.001;
		this.physicsWorld_.stepSimulation(timeElapsedS, 10);
	}
}

let APP = null;
window.addEventListener('DOMContentLoaded', () => {
	Ammo().then((lib)=>{
		Ammo = lib;
		APP = new DiceTray();
	});
});