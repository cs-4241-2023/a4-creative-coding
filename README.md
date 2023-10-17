## Audio Visualizer

Hosting link: https://a4-tim-connors.glitch.me/

### App Description

My app visualizes the audio of the song [Master of the Feast](https://freemusicarchive.org/music/Kevin_MacLeod/Best_of_2014_1461/Master_of_the_Feast/) by Kevin MacLeod. This song is publicly available to download, so I thought it would be a good song to use. You can press play to see the visualization of the song, pause it, and restart it. You can also alter the bars of the visualization using the sliders on the page, and you can change the bars' color. 

### Goal

The goal of this project was familiarize myself with the Canvas API by creating a very simple audio visualization with a user interface to allow for user control.

### Challenges Faced

- I wanted to use the tweakpane library to implement the user controls for the visualization, but unfortunately, I had difficulty getting the imports working for the tool. Therefore, I built my own basic user controls instead. 
- Additionally, there was the challenge of updating the animation with the altered values when the user changed an input through the user interface. To solve this, I added event listeners on the input to each interface element and called an update function whenever they changed. Since the animation gets re-rendered regularly, I was able to simply alter the corresponding values for the inputs, and the visualization would re-render with their changes.