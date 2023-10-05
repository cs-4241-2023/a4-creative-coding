# Falling Blocks game

Glitch link: https://a4-matthew-mcgourty.glitch.me

This application was created using Three JS. 

The goal of this application is to move your cube using the WASD keys and avoid the blocks falling from the sky.
The game gets more difficult over time no matter which difficulty is chosen, as blocks spawn and move faster.

One main challenge I faced for this application was collision detection with 3d rotating objects. In the end, I was able to do this 
using a hit() function that takes in an two objects and their widths. It then detects if the objects have collided by getting each objects
edge by its current position (center) +- its width/2. It does this for both x and y axis, and each time the animate() function is called,
each block is looped through and checks if it has hit the player, if it has the player is sent to the game over screen. This function is not perfect,
but works well enough that the game is playable.

For additional UI elements, there is three difficulties the user can choose from. The difficulties each have a corresponding html and js file,
and the main difference in them is the rate of the falling blocks being spawned, the speed of the falling blocks being spawned, and the rate at
which the game gets more difficult. Other than that, the game remains the same. Once a user dies, they are also taken to a game over screen, 
where they can choose to go back to the main page or play again and choose another difficulty, or the same one.

