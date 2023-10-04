import {Mesh} from 'three'
import gsap from 'gsap'

export default class Shape {

    constructor({geometry, material, parentMesh, position, speed = 0.001, offsetspeed = 0, index}){

    this.mesh = new Mesh(geometry, material)
    this.mesh.position.copy(position) // Set position of the mesh

    parentMesh.add(this.mesh)

    this.speed = speed
    this.offsetspeed = offsetspeed
    this.initPosition = position

     // animate
     gsap.fromTo(
        this.mesh.scale,
        {x: 0, y: 0, z: 0},
        {x: 1, y: 1, z: 1, duration: 2, delay: 0.2 + index * 0.1, ease: 'expo.out'}
      )

    }

    // Update position of the mesh
    render = (time) => {
        // Add initial position for starting point. Then from there, add the sin wave which moves the shape up and down
        // this.mesh.position.y = Math.sin(time * this.speed + this.offsetspeed) + this.initPosition.y; 

        // Rotation in three.js uses radians MathUtils.degToRad()
        this.mesh.rotation.y += 0.01;
        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.z += 0.01;
    }




}


