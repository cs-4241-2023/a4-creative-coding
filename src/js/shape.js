import { Mesh } from 'three'
import gsap from 'gsap'

export default class Shape {

  constructor({ geometry, material, parentMesh, position, speed = 0.001, offsetspeed = 0, angleOffset = 0, index }) {

    this.mesh = new Mesh(geometry, material)
    this.mesh.position.copy(position) // Set position of the mesh

    parentMesh.add(this.mesh)

    this.speed = speed
    this.offsetspeed = offsetspeed
    this.angleOffset = angleOffset;
    this.initPosition = position

    // animate
    gsap.fromTo(
      this.mesh.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 2, delay: 0.3 + index * 0.1, ease: 'expo.out' }
    )
  }


  // Scale method
  scale(scaleX, scaleY, scaleZ) {
    this.mesh.scale.set(scaleX, scaleY, scaleZ);
  }


  // Update position of the mesh
  render = (time) => {

    const angle = time * this.speed + this.offsetspeed + this.angleOffset;

    // make shape move in circular path in x z plane
    this.mesh.position.x = Math.sin(angle) * 3 + this.initPosition.x;
    this.mesh.position.z = Math.cos(angle) * 3 + this.initPosition.z;

  }




}


