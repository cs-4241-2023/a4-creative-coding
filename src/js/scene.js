import * as THREE from 'three'
import { Pane } from 'tweakpane'

import {
  Color,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  SphereGeometry,
  MeshMatcapMaterial,
  AxesHelper,
  Object3D,
  MeshBasicMaterial,
  Vector3,
  TorusGeometry,
  CylinderGeometry,
  MathUtils,
  AudioListener,
  AudioLoader,
  AudioAnalyser,
  Audio,

} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats-js'
import LoaderManager from './LoaderManager'
import Shape from './shape'
import gsap from 'gsap'

export default class MainScene {
  #canvas
  #renderer
  #scene
  #camera
  #controls
  #stats
  #width
  #height
  #mesh
  #containerMesh = new Object3D()
  #shapes = []
  #mouse = {
    x: 0,
    y: 0,
  }
  #sound
  #analyser

  constructor() {
    this.#canvas = document.querySelector('.scene')

    this.init()
  }

  init = async () => {
    // Preload assets before initiating the scene
    const assets = [
      {
        // Matcap texture simulates light on the surface of an object
        // No lighting so less calculations
        name: 'matcap',
        texture: './matcap.png',
      },
      {
        // music
        name: 'music',
        audio: './perfect_pair.mp3',
      },

    ]

    await LoaderManager.load(assets)

    // this.setStats()
    this.setScene()
    this.setRender()
    this.setCamera()
    this.setControls()
    // this.setAxesHelper()

    this.setShapes()

    this.handleResize()

    // start RAF
    this.events()
  }

  /**
   * Our Webgl renderer, an object that will draw everything in our canvas
   * https://threejs.org/docs/?q=rend#api/en/renderers/WebGLRenderer
   */
  setRender() {
    this.#renderer = new WebGLRenderer({
      canvas: this.#canvas,
      antialias: true,
    })
  }

  /**
   * This is our scene, we'll add any object
   * https://threejs.org/docs/?q=scene#api/en/scenes/Scene
   */
  setScene() {
    this.#scene = new Scene()
    this.#scene.background = new Color(0xf8c291)
  }

  /**
   * Our Perspective camera, this is the point of view that we'll have
   * of our scene.
   * A perscpective camera is mimicing the human eyes so something far we'll
   * look smaller than something close
   * https://threejs.org/docs/?q=pers#api/en/cameras/PerspectiveCamera
   */
  setCamera() {
    const aspectRatio = this.#width / this.#height
    const fieldOfView = 60
    const nearPlane = 0.1
    const farPlane = 10000

    this.#camera = new PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
    this.#camera.position.y = 0
    this.#camera.position.x = 0
    this.#camera.position.z = 10
    this.#camera.lookAt(0, 0, 0)

    this.#scene.add(this.#camera)
  }

  /**
   * Threejs controls to have controls on our scene
   * https://threejs.org/docs/?q=orbi#examples/en/controls/OrbitControls
   */
  setControls() {
    this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement)
    this.#controls.enableDamping = true
    // this.#controls.dampingFactor = 0.04
  }

  /**
   * Axes Helper
   * https://threejs.org/docs/?q=Axesh#api/en/helpers/AxesHelper
   */
  setAxesHelper() {
    const axesHelper = new AxesHelper(3)
    this.#scene.add(axesHelper)
  }

  /**
   * Create Shapes
   * https://threejs.org/docs/?q=box#api/en/geometries/SphereGeometry
   * with a Basic material
   * https://threejs.org/docs/?q=mesh#api/en/materials/MeshBasicMaterial
   */
  setShapes() {
    // Adding all shapes into container mesh
    const sphereGeo = new SphereGeometry(0.5, 32, 32)
    const material = new MeshMatcapMaterial({ matcap: LoaderManager.assets['matcap'].texture })

    // Sphere 1
    const sphere1 = new Shape({
      geometry: sphereGeo,
      material,
      parentMesh: this.#containerMesh,
      position: new Vector3(0, 0, 0),
      index: 0,
    });

    // Sphere 2
    const sphere2 = new Shape({
      geometry: sphereGeo,
      material,
      parentMesh: this.#containerMesh,
      position: new Vector3(0, 0, 0),
      angleOffset: Math.PI / 2,
      index: 1,
    });

    // Sphere 3
    const sphere3 = new Shape({
      geometry: sphereGeo,
      material,
      parentMesh: this.#containerMesh,
      position: new Vector3(0, 0, 0),
      angleOffset: Math.PI,
      index: 2,
    });

    // Sphere 4
    const sphere4 = new Shape({
      geometry: sphereGeo,
      material,
      parentMesh: this.#containerMesh,
      position: new Vector3(0, 0, 0),
      angleOffset: Math.PI * 1.5,
      index: 3,
    });

    this.#shapes = [sphere1, sphere2, sphere3, sphere4]

    this.#scene.add(this.#containerMesh)
  }


  /**
   * Build stats to display fps
   */
  setStats() {
    this.#stats = new Stats()
    this.#stats.showPanel(0) // fps panel
    document.body.appendChild(this.#stats.dom)
  }

  /**
   * List of events
   */
  events() {
    window.addEventListener('resize', this.handleResize, { passive: true })
    // start button click event
    document.querySelector('#start').addEventListener('click', (e) => {
      this.start(e);
      e.target.removeEventListener('click', this.start); // This removes the event listener after the first click
    });

    // spacebar push should pause music
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.#sound.isPlaying ? this.#sound.pause() : this.#sound.play();
      }
    })

    this.draw(0)
  }

  // EVENTS

  /**
   * Request animation frame function
   * This function is called 60/time per seconds with no performance issue
   * Everything that happens in the scene is drawed here
   * @param {Number} now
   */
  draw = (time) => {
    // now: time in ms
    // this.#stats.begin()

    if (this.#controls) this.#controls.update() // for damping
    this.#renderer.render(this.#scene, this.#camera)

    // Scale shapes based on audio
    if (this.#analyser) {
      // Get the average volume
      const averageVolume = this.#analyser.getAverageFrequency() / 256;  // this gives a value between 0 and 1

      // Map the average volume to a scale range, e.g., [1, 3]
      const minScale = 0.5;
      const maxScale = 5.0;
      const scale = minScale + averageVolume * (maxScale - minScale);

      // Apply the scale to each shape
      this.#shapes.forEach((shape) => {
          shape.scale(scale, scale, scale);
      });
  }

    // Update shapes with foreach loop
    this.#shapes.forEach((shape) => {
      shape.render(time) // Pass in time which is increasing ms value 
      // since page start to the render function to animate position of shape
    })

    // Rotate all shapes in container mesh with degrees based on mouse position
    this.#containerMesh.rotation.y = MathUtils.degToRad(this.#mouse.x * 10)
    this.#containerMesh.rotation.x = MathUtils.degToRad(this.#mouse.y * 10)

    // this.#stats.end()
    this.raf = window.requestAnimationFrame(this.draw)
  }

  /**
   * On resize, we need to adapt our camera based
   * on the new window width and height and the renderer
   */
  handleResize = () => {
    this.#width = window.innerWidth
    this.#height = window.innerHeight

    // Update camera
    this.#camera.aspect = this.#width / this.#height
    this.#camera.updateProjectionMatrix()

    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1

    this.#renderer.setPixelRatio(DPR)
    this.#renderer.setSize(this.#width, this.#height)
  }


  // when start button clicked hide all text and zoom in to scene
  start = () => {

    // hide text and then remove
    gsap.to('#container', {
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'expo.out',
      onComplete: () => { // Add this callback
        const containerElem = document.querySelector('#container');
        if (containerElem) {
          containerElem.remove();
        }
      }
    })

    // zoom in to scene
    gsap.to(this.#camera.position, { x: 0, y: 7, z: 7, duration: 2.0, delay: 0.5, ease: 'expo.out' ,
    onComplete: () => { // Add this callback
      // Create the listener and add it to the camera
    const listener = new AudioListener();
    this.#camera.add(listener);
    this.#sound = new Audio(listener);
    this.#sound.setBuffer(LoaderManager.assets['music'].buffer);
    this.#sound.play();
    this.#analyser = new AudioAnalyser(this.#sound, 256);
    }})

    // rotate shapes
    gsap.to(this.#containerMesh.rotation, { y: Math.PI * 2, duration: 5, delay: 0.5, ease: 'expo.out' })
  }


}