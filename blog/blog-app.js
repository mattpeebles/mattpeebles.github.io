function getData(callback){
	const blog_data = {
		"blogposts": [
			{
				"id": "598bc5cb03cb480011ca6047",
				"title": "<p>As You Type Validation</p>",
				"content": "<h1 id=\"asyoutypevalidation\">As You Type Validation</h1>\n<p>I've recently completed a project that required users to create an account in order to use the service. The account uses their email address as a username, so each user must submit a unique email upon account creation otherwise things will get confusing. I wasn't using a front-end framework, so my solution needed to be pure javascript/jquery.</p>\n<p>I wanted to make the experience seamless for my user so that they didn't have to submit the form to see if an email was taken. But in order to check my database for a duplicate email, I had to submit an ajax call to my database each time the user typed.</p>\n<p>So my goal was fairly straightforward. Every time the user typed in an email, I wanted the user to receive instant feedback on whether or not the email had already been used to create an account. </p>\n<p>Luckily there is a jQuery plugin, <a href=\"https://jqueryvalidation.org/documentation/\">jQuery Validator</a> that will allow you to validate a form as the user types. The plugin validates according to rules you set on the form. \nSo let's take a simple html form that asks for an email: </p>\n<p>index.html</p>\n<pre><code>`&lt;form id=\"emailForm\"&gt;\n    &lt;label&gt;Email&lt;label&gt;\n    &lt;input type=\"text\" name=\"email\" id=\"email\"&gt; &lt;/input&gt;\n&lt;form&gt;`\n</code></pre>\n<p>And then in your javascript file, we use jquery to hook onto the top level of the form</p>\n<p>app.js</p>\n<pre><code>function validate(){\n    $('#emailForm').validate({})\n}\n</code></pre>\n<p>Within the validate function we can see that it takes an object. We'll be using the <a href=\"https://jqueryvalidation.org/validate/#rules\">rules</a> and <a href=\"https://jqueryvalidation.org/validate/#success\">success</a> methods today. But <a href=\"https://jqueryvalidation.org/validate/#normalizer\">normalizer</a> is also extremely powerful as it allows you to write functions that change the value before it is validator. It is more or less like middleware for the validator itself.</p>\n<p>Validator takes an object and where one of its keys are rules. Rules also takes an object where each of the keys is the <em>name</em> of the element that you'd like to validate. </p>\n<p>app.js</p>\n<pre><code>function validate(){\n    $('#emailForm').validate({\n            rules: {\n                email: {\n                    required: true,\n                    email: true\n                }\n        }\n    })\n}\n</code></pre>\n<p>The required key will ensure that there is a value in the input before it is submit. Likewise, email ensures that the value conforms to the standard email format. Normalizer, mentioned before, is also a key that can be placed within the named rules. </p>\n<p>Now, our form is actively validated as the user types. However, currently, this only ensures that the user types in a email, so duplicates are still possible.</p>\n<p>jQuery also comes with a method that allows you to call functions once a value is successfully validated. This <strong>success</strong> method calls the function everytime an input is validated, not once the entire form is validated. It takes label as an argument.</p>\n<p>This allows us to query our database once the user has entered an email into the email input. We'll use an ajax call to query our database. I've quickly set up an API hook that allows us to post an email to it which it uses to query the database for that email, counts the number of matching documents and returns a message with the result. If the count is greater than 0 than we have a duplicate email and it tells us so.</p>\n<p>For my project I've used node and express for my backend with a mongodb database.</p>\n<pre><code>app.post('/email', (req, res) =&gt; {\n    let {email} = req.body //the email the user has inputted\n    return Users\n        .find({email})\n        .count()\n        .exec() //returns a promise with the number of emails that match, that's passed to then as count\n        .then(count =&gt; {\n            if (count &gt; 0){\n                return res.json({message: 'Email has already been used to create an account'})\n            }\n            else {\n                return res.json({message: 'Valid email'})\n            }\n        })\n})\n</code></pre>\n<p>Now that we've got an api hook, we can use it within our success method in jquery validator. Success takes a label as an argument. If you <code>console.log(label)</code> you return an object. If you have a form with multiple variables, you obviously only want to make the ajax call with an email. The label object has a key called <code>htmlFor</code> that returns the name of the input that the success function is being called on. It's easy to set a conditional that checks for that to be true before posting the ajax call. </p>\n<p>app.js</p>\n<pre><code>function validate(){\n    $('#emailForm').validate({\n        rules: {\n            email: {\n                required: true,\n                email: true\n            }\n        },\n        success: function(label){\n\n            let data ={email: $('#email').val() } //now that we know it's a valid email we can use jquery to grab the value\n\n            $.ajax({\n                type: 'post',\n                url: '/email',\n                data: JSON.stringify(data),\n                contentType: 'application/json',\n                success: function(data){\n                        if (data.message === 'Email has already been used to create an account'){\n                               let parent = $('#email').parent()\n\n                                $('#email').removeClass('valid').addClass('error')\n                                $('#email-error').text(data.message)\n                        }\n                    }\n            })\n        }\n    })\n}\n</code></pre>\n<p>So within our ajax call, we've send a JSON object with the user email. Our api hook has returned a JSON object to the client side that has a message as a key. Calling data.message within the success method of the ajax call with let us read the message. If the message tells us that the email has already been taken, then we need to <em>overwrite</em> the validator added classes on #email and #email-error. #email-error is an element that is appended to #email once it has an error class. Editing the text of the error message will inform our user of the problem. </p>\n<p>We can also use some basic CSS to visualize the state of the input. </p>\n<p>main.css</p>\n<pre><code>input.error{\n    border: 1px solid red;\n}\n\ninput.error:focus{\n    border:1px solid red;\n    box-shadow: 0 0 5px red;\n}\n\ninput.valid{\n    border: 1px solid green;\n}\n\ninput.valid:focus{\n    border:1px solid green;\n    box-shadow: 0 0 5px green;\n}\n</code></pre>\n<p>Now every time the user inputs an appropriate email, they will receive instant feedback about whether it is a valid email and can adjust their input accordingly. </p>",
				"author": "Matt Peebles",
				"created": "2017-08-10T02:32:43.848Z"
			},
			{
				"id": "59dff1cdef43fb001229d8fe",
				"title": "<p>CSS Icon Animation</p>",
				"content": "<h1 id=\"cssiconanimation\">CSS Icon Animation</h1>\n<p>I've begun exploring minor css animations and stylings. I'll demonstrate an animation that I've recently used in one of my projects and explain how you can use them in your webpages yourself.</p>\n<p>The animation is an animated down arrow icon to inform your user that they should continue to scroll down to explore the webpage. I most recently used it in my <a href=\"https://mattpeebl.es\">portfolio site</a> to encourage the user to explore past the 100vh hero image with my name.</p>\n<div class=\"arrowFinal\">\n    <i class=\"material-icons iconFinal\">\n         keyboard_arrow_down\n    </i>\n</div>\n<p>First, we'll wrap our icon in a parent div. This particular animation requires that the parent has a set height. This is because our animation effects the <em>padding</em> of the icon. If our parent had no set height, it would automatically adjust for the animated padding and not actually give the illusion of animating the icon. </p>\n<p><code>&lt;div class=\"arrowExample1\"&gt;&lt;/div&gt;</code></p>\n<p>We'll give our <code>#arrowExample</code> div, a height of <code>90px</code>. Then we need an icon to animate. Google has a decent set of icons as part of their material design initiative. They're extremely easy to integrate. Instructions and more can be found <a href=\"https://material.io/icons/\">here</a>.</p>\n<pre><code>&lt;div class=\"arrowExample2\"&gt;\n    &lt;i class=\"material-icons iconExample2\"&gt;\n        keyboard_arrow_down\n    &lt;/i&gt;\n&lt;/div&gt;\n</code></pre>\n<p>Now that we have our HTML set up, we can begin styling. </p>\n<p>The animation property allows for shorthand passing of a number of animation properties. These are, in order,  duration, timing-function,  delay,  iteration-count, direction, fill-mode, play-state, and name. </p>\n<p>You can also call the specific animation property associated with the shorthand syntax above, just prepend <code>animation-</code> to those you'd like to call individually. I'll be demonstrating both later on.</p>\n<p>Our actual animation is called in the <strong>name</strong> property. </p>\n<p>This name property specifics an <code>@keyframes</code> rule that you create yourself. So for our example, we'll need to create a custom animation that gives us the <code>down-gesture</code> animation that we want. </p>\n<p>To do this, we'll create <code>@keyframes down-gesture{}</code> style rule. </p>\n<p>Within the <code>@keyframes</code>, we begin the actual process of animation by detailing the start and ends state style rules. These are called by passing  <code>from/0%</code> and <code>to/100%</code> respectively. </p>\n<p>Since we'd like our animation to smoothly go from beginning to end and back again, we'll be using the more precise percentages. These allow you to specify not only the start and end state but also every state in between.</p>\n<pre><code>.iconExample2{\n   animation-name: down-gesture;\n}\n\n@keyframes down-gesture{\n   0%{}\n   50%{}\n   100%{}\n}\n</code></pre>\n<p>You can think of the start and end states as subrules for the css to follow as it moves along the animation. </p>\n<p>Since we want it to smoothly cycle through the start and end states, our <code>0%</code> and <code>100%</code> will be the same. Our <code>50%</code> subrule will be the apex of our animation and is where the actual animation takes place.</p>\n<pre><code>@keyframes down-gesture{\n   0%{\n      padding-top: 20px;\n   }\n   50%{\n     padding-top: 30px;\n   }\n   100%{\n      padding-top: 20px;\n   }\n}\n</code></pre>\n<p>So to recap, down-gesture will apply a padding of 20px to our icon. The padding will increase to 28px until the animation is halfway complete.  Once it reaches the 50% point, it will reduce padding back down to 20px. </p>\n<p>The amount of time it takes for your animation to complete is set in the <code>duration property</code> and the amount of times it cycles through the animation is set in the <code>iteration-count</code> count property. We'll set these to <code>1.5s</code> and <code>infinite</code> respectively. This is, of course, where you get to play with the settings to find out what's right for you.</p>\n<pre><code>.iconExample2{\n   animation-name: down-gesture;\n   animation-duration: 1.2s;\n   animation-iteration-count: infinite;\n}\n</code></pre>\n<p>or</p>\n<pre><code>.iconExample2{\n   animation: 1.5s infinite down-gesture;\n}\n</code></pre>\n<p>And that's it! Our down-gesture arrow is now animated. In the end, our css will look like</p>\n<div class=\"arrowFinal\">\n    <i class=\"material-icons iconFinal\">\n         keyboard_arrow_down\n    </i>\n</div>\n<pre><code>&lt;div class=\"arrowFinal\"&gt;\n    &lt;i class=\"material-icons iconFinal\"&gt;\n         keyboard_arrow_down\n    &lt;/i&gt;\n&lt;/div&gt;\n</code></pre>\n<pre><code>.arrowFinal{\n  height: 90px;\n}\n\n.iconFinal{\n   animation-name: down-gesture;\n   animation-duration: 1.2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes down-gesture{\n   0%{\n      padding-top: 20px;\n   }\n   50%{\n     padding-top: 30px;\n   }\n   100%{\n      padding-top: 20px;\n   }\n}\n</code></pre>",
				"author": "Matt Peebles",
				"created": "2017-10-12T22:50:53.807Z"
			}
		]
	}
	
	callback(blog_data)
}

function printPosts(data){
	console.log(data)
	let posts = data.blogposts

	posts.forEach((post, index) => {
		let formatDate = $.format.date(post.created, "MMMM D, yyyy")
		let prettyDate = $.format.prettyDate(post.created)
		
		//if date post was created 30 days past then use formatDate otherwise use a pretty date e.g. 2 hours ago
		let date = (prettyDate === 'more than 5 weeks ago') ? formatDate : prettyDate 

		let blogTemplate = '<div class=\"onePost row\">' +
								'<div class=\"col-sm-12 post\">' +
									'<div class=\"titleRow row\">' +
										'<h2 class=\"postTitle col-10\">' + post.title + "</h2>" +
										'<i class=\"material-icons col-2 viewMore\">keyboard_arrow_down</i>' +
									'</div>' +
									'<div class=\"infoRow row\">' + 
										'<div class=\"col-6 postAuthor\"><img src=\"/resources/images/personal-photo.jpg\">' + post.author + '</div>' +
										'<div class=\"col-6 postCreated\">' + date + '</div>' +
									'</div>' +
									'<div class=\"postContent hidden\">' + 
										post.content + 
										"<div id=\"contentButton\">" +	
											'<button class=\"btn btn-default viewLess\">View Less</button>' +
										"</div>" +
									'</div>' +
								'</div>' +
						   '</div>'+
						   '<hr class="breakLine">';
		$("#blogPostSection").prepend(blogTemplate)
		removeLoading()
	})
}


function returnData(){
	getData(printPosts)
}

function removeLoading(){
	if($('#blogPostSection').children().length > 0){
		$('#loading').remove()
	}
}

function showContent(){
	$('body').on('click', '.material-icons.viewMore', (e) => {
		$(e.currentTarget).parent().siblings('.postContent').toggleClass('hidden');
		$(e.currentTarget).text('keyboard_arrow_up');
		$(e.currentTarget).removeClass('viewMore').addClass('viewLess');

	})

	$('body').on('click', '.material-icons.viewLess', (e) => {
		$(e.currentTarget).parent().siblings('.postContent').toggleClass('hidden');
		$(e.currentTarget).removeClass('viewLess').addClass('viewMore');
		$(e.currentTarget).text('keyboard_arrow_down');
	})

	$('body').on('click', '.btn.viewLess', (e) => {
		$(e.currentTarget).parent().parent().toggleClass('hidden');
		$(e.currentTarget).parent().parent().siblings('.titleRow').children('.material-icons').removeClass('viewLess').addClass('viewMore');
		$(e.currentTarget).parent().parent().siblings('.titleRow').children('.material-icons').text('keyboard_arrow_down');
	})
}

function navBarHide(){
	let navMain = $(".navbar-collapse");
	$('.nav-link').on("click", () => {
	   navMain.collapse('hide');
	});
}

$(() => {
	returnData()
	showContent()
	navBarHide()
	removeLoading()
})