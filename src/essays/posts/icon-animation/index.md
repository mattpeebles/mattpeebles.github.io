# CSS Icon Animation

\n

I've begun exploring minor css animations and stylings. I'll demonstrate an animation that I've recently used in one of my projects and explain how you can use them in your webpages yourself.

\n

The animation is an animated down arrow icon to inform your user that they should continue to scroll down to explore the webpage. I most recently used it in my [portfolio site](\"https://mattpeebl.es\") to encourage the user to explore past the 100vh hero image with my name.

\n

<div class="\&quot;arrowFinal\&quot;">\n _\n keyboard_arrow_down\n_ \n</div>

\n

First, we'll wrap our icon in a parent div. This particular animation requires that the parent has a set height. This is because our animation effects the _padding_ of the icon. If our parent had no set height, it would automatically adjust for the animated padding and not actually give the illusion of animating the icon.

\n

`<div class=\"arrowExample1\"></div>`

\n

We'll give our `#arrowExample` div, a height of `90px`. Then we need an icon to animate. Google has a decent set of icons as part of their material design initiative. They're extremely easy to integrate. Instructions and more can be found [here](\"https://material.io/icons/\").

\n

    <div class=\"arrowExample2\">\n    <i class=\"material-icons iconExample2\">\n        keyboard_arrow_down\n    </i>\n</div>\n

\n

Now that we have our HTML set up, we can begin styling.

\n

The animation property allows for shorthand passing of a number of animation properties. These are, in order, duration, timing-function, delay, iteration-count, direction, fill-mode, play-state, and name.

\n

You can also call the specific animation property associated with the shorthand syntax above, just prepend `animation-` to those you'd like to call individually. I'll be demonstrating both later on.

\n

Our actual animation is called in the **name** property.

\n

This name property specifics an `@keyframes` rule that you create yourself. So for our example, we'll need to create a custom animation that gives us the `down-gesture` animation that we want.

\n

To do this, we'll create `@keyframes down-gesture{}` style rule.

\n

Within the `@keyframes`, we begin the actual process of animation by detailing the start and ends state style rules. These are called by passing `from/0%` and `to/100%` respectively.

\n

Since we'd like our animation to smoothly go from beginning to end and back again, we'll be using the more precise percentages. These allow you to specify not only the start and end state but also every state in between.

\n

    .iconExample2{\n   animation-name: down-gesture;\n}\n\n@keyframes down-gesture{\n   0%{}\n   50%{}\n   100%{}\n}\n

\n

You can think of the start and end states as subrules for the css to follow as it moves along the animation.

\n

Since we want it to smoothly cycle through the start and end states, our `0%` and `100%` will be the same. Our `50%` subrule will be the apex of our animation and is where the actual animation takes place.

\n

    @keyframes down-gesture{\n   0%{\n      padding-top: 20px;\n   }\n   50%{\n     padding-top: 30px;\n   }\n   100%{\n      padding-top: 20px;\n   }\n}\n

\n

So to recap, down-gesture will apply a padding of 20px to our icon. The padding will increase to 28px until the animation is halfway complete. Once it reaches the 50% point, it will reduce padding back down to 20px.

\n

The amount of time it takes for your animation to complete is set in the `duration property` and the amount of times it cycles through the animation is set in the `iteration-count` count property. We'll set these to `1.5s` and `infinite` respectively. This is, of course, where you get to play with the settings to find out what's right for you.

\n

    .iconExample2{\n   animation-name: down-gesture;\n   animation-duration: 1.2s;\n   animation-iteration-count: infinite;\n}\n

\n

or

\n

    .iconExample2{\n   animation: 1.5s infinite down-gesture;\n}\n

\n

And that's it! Our down-gesture arrow is now animated. In the end, our css will look like

\n

<div class="\&quot;arrowFinal\&quot;">\n _\n keyboard_arrow_down\n_ \n</div>

\n

    <div class=\"arrowFinal\">\n    <i class=\"material-icons iconFinal\">\n         keyboard_arrow_down\n    </i>\n</div>\n

\n

    .arrowFinal{\n  height: 90px;\n}\n\n.iconFinal{\n   animation-name: down-gesture;\n   animation-duration: 1.2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes down-gesture{\n   0%{\n      padding-top: 20px;\n   }\n   50%{\n     padding-top: 30px;\n   }\n   100%{\n      padding-top: 20px;\n   }\n}\n