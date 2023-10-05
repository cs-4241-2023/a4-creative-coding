Assignment 4 - Creative Coding: Interactive Multimedia Experiences
===

Due: ~~October 2nd, by 11:59 AM.~~ Given extension by the Professor.

For this assignment we will focus on client-side development using popular audio/graphics/visualization technologies. The goal of this assignment is to refine our JavaScript knowledge while exploring the multimedia capabilities of the browser.

## The Game Of Life

Link: https://a4-thea-caplan.glitch.me/

Include a very brief summary of your project here. Images are encouraged when needed, along with concise, high-level text. Be sure to include:

The goal of the application was to recreate John Conway's Game of Life, and creating a UI with at least 4 user controls. The process of making this application helped with understanding of the Canvas library. Some challenges I faced when creating the application was adding separate functionality to each feature of the game, while still having interact with each other. For instance, being able to update the color of the squares while still having them evolve in time. I figured out the best way to do this was to have events that would alter the squares and redraw them separate of the rendering timer. Instructions on how to play the game and the possible controls are listed on the application.


Baseline Requirements
---

- A server created using Express
- A client-side interactive experience using at least one of the following web technologies frameworks.
  - [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API): A 2D raster drawing API included in all modern browser
- A user interface for interaction with four parameters for user control.
- Your application should display basic documentation for the user interface when the application first loads.

The interactive experience should possess a reasonable level of complexity. Some examples:
### Canvas
- Implement a generative algorithm such as [Conway's Game of Life](https://bitstorm.org/gameoflife/) (or 1D cellular automata) and provide interactive controls. Note that the Game of Life has been created by 100s of people using `<canvas>`; we'll be checking to ensure that your implementation is not a copy of these.