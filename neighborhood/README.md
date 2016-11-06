## Website Performance Optimization Portfolio Project

Welcome to my website optimization project. This project has three parts:

* Part 1: [PageSpeed Insights](#pagespeed)
* Part 2: [Animated Pizzas](#pizzeria)
* Part 3: [Pizza Slider](#slider)

Each change introduced to improve performance is described in the tables below.

### <a name="pagespeed"></a>Part 1: PageSpeed Insights

Web site URL:  [https://sjkordis.github.io/optimization/src/](https://sjkordis.github.io/optimization/src/)

Original PageSpeed Insights score = 27 mobile / 29 desktop

Final result = 83 mobile / 94 desktop

File | Location | Change Made | Mobile Score | Desktop Score |
---- | -------- | ----------- | ------------ | ------------- |
index.html | 14 | Added `media = "print"` attribute to stylesheet link for print.css | 27 | 29
pizzeria.jpg | n/a | Resized to 100x75 px for thumbnail | 72 | 86
index.html | 24 | Added `async` attribute to google-analytics link | 72 | 86
css/style.css | 11 | Changed font-family to "san serif" in css/style.css (also removed link to OpenSans web font in index.html) | 85 | 91
index.html | 73 | Inlined CSS at end of HTML file | 93 | 94
index.html | 76 | Minified CSS using cssminifier.com | 93 | 94

### <a name="pizzeria"></a>Part 2: Animated Pizzas

Web site URL:  [https://sjkordis.github.io/optimization/src/views/pizza.html](https://sjkordis.github.io/optimization/src/views/pizza.html)

Original animation speed = 6 fps

Final result = 60+ fps

Note: The Speed column reflects the lowest frames per second observed during scrolling.

File | Location | Pipeline Stage | Change | Speed
---- | -------- | -------------- | ------ | -----
main.js | updatePositions (516) | Scripting | Moved the DOM reference and math out of the FOR loop | 24 fps
main.js | updatePositions (512) | Scripting | Changed querySelectorAll call to document.getElementsByClassName | 24 fps
main.js | updatePositions (525) | Scripting | Used "transform" instead of "left" to reduce painting time | 36 fps
main.js | addEventListener (552) | Scripting, Painting, Compositing | Reduced number of pizzas from 200 to 64 | 52 fps
css/style.css | .movers (36) | Painting | Added `backface-visibility: hidden` property to put each animated pizza on its own layer | 60+ fps

NOTES:

1.  I tested requestAnimationFrame(), but it added significant scripting overhead, so I didn't use it.

2. Google Dev tools is still complaining about jank in the Recalculating Styles step, but that step is consistently only 1-2 ms, so I decided not to worry about it. This pertains to the update of the `transform` property inside the FOR loop in updatePositions(). Not sure how I could eliminate this jank if I want to update a style property.

3. I noticed that how and where I scrolled (for example: mouse button vs. wheel, quickly vs. slowly, once vs. back and forth, etc.) affected the FPS. This was true on both my laptop and my mobile phone.

4. I didn't see anyplace where a web worker would add value, so I did not use one.

### <a name="slider"></a>Part 3: Pizza Slider

Web site URL:  [https://sjkordis.github.io/optimization/src/views/pizza.html](https://sjkordis.github.io/optimization/src/views/pizza.html)

Original time to resize the pizzas = 275 ms

Final result = 1 ms

File | Location | Pipeline Stage | Change | Time to resize the pizzas
---- | -------- | -------------- | ------ | -------------------------
main.js | changePizzaSizes (469) | Scripting | Moved the DOM references out of the FOR loop | 160 ms
main.js | changePizzaSlides (442-464) | Scripting | Simplified new size calculation to use a fixed percentage for the new width - no need for the complex Dx calculation here | 1 ms
