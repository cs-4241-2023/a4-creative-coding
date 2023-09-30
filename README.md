Jazz Audio Visualizer (Assignment 4)
===
https://a4-colin-fyock.glitch.me/

Include a very brief summary of your project here. Images are encouraged when needed, along with concise, high-level text. Be sure to include:

- the goal of the application
The goal of my application was to make an audio visualizer for a song of my choosing. I chose a caged person by SaXi because it was a nice Jazz song that had a nice variety of instruments and loudness. I thought that this would be a good display of my visualizer.
- challenges you faced in realizing the application
For many hours I had a bug that only appeared when running the website on Google Chrome. I normally use FireFox for everything, but the glitch 'open preview panel' button would open a window that did nothing.
Whenever I would open it in a new tab in FireFox is would run perfectly fine and the code would run as I was expecting it to.
I checked on chrome in case something was wrong and I was getting a 'Uncaught DOMException: Failed to execute 'createMediaElementSource'
every single time I tried to use the app in chrome. The solution involved wrapping audio_source in an if to check if it existed. 
I think the bug happened whenever I used the app once in chrome but tried to generate a new visualization it would reuse the same
audio_source or at least redeclare it and fail. I would liken it to trying to plug an audio jack into an aux that already had a jack in it.
If audio_source did not exist I would create it, and if not I would just assume it existed and moved on with the rest of the visualization.
- the instructions you present in the website should be clear enough to use the application, but if you feel any need to provide additional instructions please do so here.
The instructions that are included in the alert should be sufficient but I will explain a little more. 
The number of bars at the top is a number between 32 and 32,768, which is 2^5 to 2^14 and you can only move in 2^x increments.
The user didn't really need to know this so I was just going to make a slider that incremeneted by 2^x but I looked around and 
html does not support custom sliders that go up by special increments its only 1-5 in increments of 1 for instance.
The dropdown represents this, and since their aren't too many options it suffices. It change the number of rectangles that canvas
draws making a more smooth or more rigid visualization. The higher numbers act more like a wave.
The center bars check centers the peak of the visualization around the center of the screen instead of the left side.
The add color check makes the canvas rectangles a random color using math.random instead of only being purple rectangles.
When using centered, the two sides (should) be different colors as they are both generated with different math.randoms.
The increase bar size doubles the y of the rectangles in the visualization.
The generate and play button plays the song and starts the visualization. 
