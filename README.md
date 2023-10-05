This has a very basic server that hosts the webpage. This implements Three.js and Ammo.js for 3d spaces and physics.
Unfortunately three.js' drag functionality was not able to be implemented, as the raytrace was unable to find any objects.
In place, there has been started an idea to create a sphere around the cursor that will act as a holder for the dice, 
tracking the mouse movements to shake the dice, before despawning to release the dice into the box. 
Further functionality would include waiting for the dice objects' velocities and accelerations to reach 0 (meaning they have stopped moving),
before reading the orientation of their axis' to "read" what the result is.

Currently you should see a die falling to the ground.
Numerous hurdles were faced, with Ammo not loading, transparency not being intuitively implementable (there are 4 transparent walls around the ground), and three/dragControls not working