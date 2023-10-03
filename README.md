## Browser Instrument

http://a4-jade-logan.glitch.me

The goal of the application is to provide a screen-based instrument that is played by clicking and dragging the mouse on the screen. The pitch and volume changes depending on the mouse position. The user is able to lock the volume so it isn't controlled by movement and adjust the volume dial. The user can change the waveform for the oscillator, and set a scale so that the screen is divided into regions corresponding to notes on the chosen scale rather than the frequency being totally dependant on mouse position.

I used Web Audio API for the sound, Canvas for the mouse movement visual and the scale bars, and Nexus UI for the interface. Pointer Events API was used for mouse/touch events.

It had initially been challenging to get the oscillator to play every time the mouse dragged. I hadn't realized once the oscillator stopped it couldn't be started again. It then took a bit of trial and error to get rid of the click noise every time the oscillator was stopped by fading the audio first. Getting the scales to work with the visual accurately representing which space would play which note also took trial and error.

When the page is first loaded, basic instructions about the mouse/touch controls are displayed. The instructions disappear when the user interacts with the interface or plays a note.

If the screen is resized, the page should be reloaded so that the canvas will be the right size.