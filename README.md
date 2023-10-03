
Nelson Diaz

Link to Project: http://a4-nelson-diaz.glitch.me

# Conway's Game of Life


Include a very brief summary of your project here. Images are encouraged when needed, along with concise, high-level text. Be sure to include:

- the goal of the application
- challenges you faced in realizing the application
- the instructions you present in the website should be clear enough to use the application, but if you feel any need to provide additional instructions please do so here.


## Summary
This application is an interactive implementation on Conway's Game of Life. It is implemented using the Canvas API, Pointer Events API, and Tweakpane. A user is able to interact with the game by Starting/Pausing the simulation, changing the speed of the simulation, changing the rules for cell survival on the grid, changing the rules for cell generation on the grid, creating/removing cells at will by clicking & dragging, and more. The instructions for how to use the application are displayed on the right side of the screen when first navigating to the website. Challenges for this project included implementing click/drag functionality as well has using the [tweakpane-infodump](https://github.com/doersino/tweakpane-plugin-infodump) plugin to add the 'Information' tab.

### Infodump plugin difficulty
When searching for how to add plain text into tweakpane, I came across this plugin that would allow me to do exactly what I wanted. The only problem was that the plugin was out of date compared to the most recent version of tweakpane. To resolve this issue I needed to step through the tweakpane execution with the debugger to see where it was failing so that I could resolve the issue. Eventually, I discovered that the only thing I needed to get the plugin in load was to add a variable specifying what version it was valid for. However, after I got the plugin loaded, I also needed to put the css that should have been loaded with the plugin into it's own CSS file named "tweakpane-plugin-infodump.css". This resolved the issue of the plugin's visual components not being rendered with CSS.

### Click & Drag difficulty
When implementing click and drag I ran into a bug caused by the user clicking withing the canvas, dragging the cursor outside the canvas, and then releasing outside the canvas. This caused the cursor to paint cells when hovering over the canvas grid even without clicking. To remedy this I use the [MouseEvent.buttons](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons) property to check and see if the user is currently pressing a button while draggin over the canvas and only painting the grid if so.