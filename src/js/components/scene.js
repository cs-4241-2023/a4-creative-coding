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
    MathUtils
  } from '../node_modules/three'
  import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
  import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js';
  import Stats from '../node_modules/stats-js'
  import LoaderManager from './managers/LoaderManager'
  import GUI from '../node_modules/lil-gui'
  import Shape from '/shape.js'
  import gsap from '../node_modules/gsap'
  
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
    #guiObj = {
      y: 0,
      showTitle: true,
    }
    #containerMesh = new Object3D()
    #shapes = []
    #mouse = {
      x: 0,
      y: 0,
    }
    #audioContext;
    #audioElement;
    #analyser;
    #dataArray;
  
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
          texture: './img/matcap.png',
        },
  
        {// Roboto font
          name: 'roboto-font',
          font: './font/roboto-slab.json',
        },
  
      ]
  
      await LoaderManager.load(assets)
  
      this.setupAudio(); 
      this.setStats()
      // this.setGUI()
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
  
    // Audio setup
    setupAudio() {
      this.#audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.#audioElement = new Audio('./audio/Summrs - Hope Your Happy.mp3');
      const source = this.#audioContext.createMediaElementSource(this.#audioElement);
      
      this.#analyser = this.#audioContext.createAnalyser();
      source.connect(this.#analyser);
      this.#analyser.connect(this.#audioContext.destination);
      
      this.#analyser.fftSize = 256;
      const bufferLength = this.#analyser.frequencyBinCount;
      this.#dataArray = new Uint8Array(bufferLength);
  
      // this.#audioElement.play();
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
      const material = new MeshMatcapMaterial({ matcap: LoaderManager.assets['matcap'].texture })
    
         // Torus Geometry
      const torusGeo = new TorusGeometry(2, 0.6, 16, 100)
      const torusShape = new Shape({
        geometry: torusGeo,
        material,
        parentMesh: this.#containerMesh,
        position: new Vector3(0, 0, 0),
        speed: 0.002,
        offsetspeed: 10,
        index: 1,});
  
      this.#shapes = [torusShape]
  
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
  
    setGUI() {
      const titleEl = document.querySelector('.main-title')
  
      const handleChange = () => {
        this.#mesh.position.y = this.#guiObj.y
        titleEl.style.display = this.#guiObj.showTitle ? 'block' : 'none'
      }
  
      const gui = new GUI()
      gui.add(this.#guiObj, 'y', -3, 3).onChange(handleChange)
      gui.add(this.#guiObj, 'showTitle').name('show title').onChange(handleChange)
    }
    /**
     * List of events
     */
    events() {
      window.addEventListener('resize', this.handleResize, { passive: true })
      // window.addEventListener('mousemove', this.handleMouse, { passive: true })
      window.addEventListener('keydown', this.handleKeyPress, { passive: true });
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
      this.#stats.begin()
  
      if (this.#controls) this.#controls.update() // for damping
      this.#renderer.render(this.#scene, this.#camera)
  
      // Update shapes with foreach loop
      this.#shapes.forEach((shape) => {
        shape.render(time) // Pass in time which is increasing ms value 
        // since page start to the render function to animate position of shape
      })
  
      this.updateTorusScale();
  
      // Rotate all shapes in container mesh with degrees based on mouse position
      this.#containerMesh.rotation.y = MathUtils.degToRad(this.#mouse.x * 10)
      this.#containerMesh.rotation.x = MathUtils.degToRad(this.#mouse.y * 10)
   
      this.#stats.end()
      this.raf = window.requestAnimationFrame(this.draw)
    }
  
    // Update torus scale based on audio data
    updateTorusScale() {
      this.#analyser.getByteFrequencyData(this.#dataArray);
      
      // Compute the average of the frequency values (for simplicity). 
      // You might want a specific frequency range or other metric.
      const avg = this.#dataArray.reduce((a, b) => a + b) / this.#dataArray.length;
  
      // Use the average to determine the scale. This is a basic example, you might need to normalize or adjust this.
      const scale = avg / 128;  // 128 is half of 256 (our fftSize)
  
      // Apply scale to torus
      this.#containerMesh.scale.set(scale, scale, scale);
    }
  
    // Toggle audio playback
    toggleAudioPlayback = () => {
      if (this.#audioElement.paused) {
          this.#audioElement.play();
      } else {
          this.#audioElement.pause();
      }
  }
  
  
    /**
     * Handle mouse move event
     * @param {MouseEvent} event
     */
    handleMouse = (e) => {
      this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1 // Center of screen is 0 and goes from -1 to 1
      this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1 // Center of screen is 0 and goes from -1 to 1
  
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
  
    // Toggle audio playback
    handleKeyPress = (e) => {
      if (e.code === 'Space') { // Check if the pressed key was the spacebar
          this.toggleAudioPlayback();
      }
  }
  
  
    
  }
  