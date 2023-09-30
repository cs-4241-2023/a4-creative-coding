import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { Pane } from 'https://unpkg.com/tweakpane'

//const camera, scene, renderer, cubeMesh

const particleCount = 2000

const params = {
    amplitude: 200,
    frequency: 20,
    displacement: 0,
}

const particleSystem = {
    init() {
        this.clock = new THREE.Clock(true)

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 5, 3500)
        this.camera.position.z = 500
        this.camera.position.y = 300
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        this.createLight()
        this.cubeMesh = this.createCube()
        this.particleSystem = this.createParticleSystem()

        this.render = this.render.bind(this)
        this.render()

        // create a new tweakpane instance
        this.pane = new Pane()
        // setup our pane to control the know rotation on the y axis
        this.pane.addBinding(params, 'amplitude', {
            min: 0,
            max: 300,
        })
        this.pane.addBinding(params, "frequency", {
            min: 1,
            max: 200,
        }),
        this.pane.addBinding(params, "displacement", {
            min: 0,
            max: 10,
        })
    },
    createLight() {
        const pointLight = new THREE.DirectionalLight(0xcccccc, 2)
        pointLight.position.set(1, -1, 1).normalize();
        this.scene.add(pointLight)
    },
    createCube() {
        const mesh = new THREE.BoxGeometry(50, 50, 50)
        const material = new THREE.MeshPhongMaterial({ color: 0x0033ff, specular: 0x555555, shininess: 30 })
        const cube = new THREE.Mesh(mesh, material)
        cube.position.z = -30
        this.scene.add(cube)
        return cube
    },
    createParticleSystem() {

        this.particlesGeometry = new THREE.BufferGeometry()
        let positions = new Float32Array(particleCount * 3)
        let colors = new Float32Array(particleCount * 3)

        for(let i = 0; i < particleCount*3; i++){
            positions[i] = (Math.random() * 400 - 200)
            colors[i] = Math.random()
        }

        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const particleMaterial = new THREE.PointsMaterial(
            {
                size: 1,
                vertexColors: true
            }
        )

        const particles = new THREE.Points(this.particlesGeometry, particleMaterial)
        this.scene.add(particles)
        return particles
    },
    render() {
        this.deltaTime = this.clock.getDelta()

        for(let i = 0; i < particleCount; i++) {
            const vert = i*3
            //y value
            if(this.particlesGeometry.attributes.position.array[vert] > 200){
                this.particlesGeometry.attributes.position.array[vert] = -200
            }
            else{
                this.particlesGeometry.attributes.position.array[vert] += 10 * this.deltaTime
            }
            const xValue = this.particlesGeometry.attributes.position.array[vert]
            this.particlesGeometry.attributes.position.array[vert + 1] = params.amplitude* Math.sin(xValue/params.frequency + params.displacement)
        }
        this.particlesGeometry.attributes.position.needsUpdate = true

        this.renderer.render(this.scene, this.camera)
        window.requestAnimationFrame(this.render)
    }
}

window.onload = () => particleSystem.init()