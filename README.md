Brendan Mannion
http://a4-brendan-mannion.glitch.me

This project is an online drawing pad:

## Draw!:

The goal of this website is to allow for users to draw whatever they desire on their canvas. 
The site also provides tools and buttons such as changing the color, customizing the size of the 
brush, clearing the page, rotating the page, and undoing recent changes. All of these customizations
give the user more freedom to create what they want and let people unleash their true creativity.

This project makes the most use out of the Canvas library for creating the interactive and dynamic
drawing platform. The canvas library makes rendering drawings and designs much easier compared to other
options. The canvas library is used extensively in providing the drawing surface, listening to interactions
like mouse clicks and movements on the Canvas, updating the drawing surface, and keeping track of past drawings
for the undo functionality.

One of the biggest challenges I faced was creating the Undo functionality. At first it seems quite straightforward,
but in reality it took a lot of thinking and changes. I ended up having to create a method that keeps track of all
the drawing movements made, saving the color and specific pixels and lines that were used. These movements are stored
in an array, so that whenever I need to use the undo button I can just remove the last drawing movement from the array.
After removing it from the array, I created a new function that will draw the page based on the array of drawings given,
so that the page looks exactly how it was previously. 




