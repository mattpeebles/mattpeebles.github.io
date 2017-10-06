const DATABASE_URL = "https://vanity-cathedral.herokuapp.com/api/posts" //this will need to be changed once app is fully deployed

const showdown = require('showdown')
const converter = new showdown.Converter()

	// GET posts from database
//*************************************//
	function getDataFromDatabase(callback){
		$.getJSON(DATABASE_URL, callback)
	}

	function printPosts(data){
		let posts = data.blogposts

		posts.forEach((post) => {
			let formatDate = $.format.date(post.created, "MMM D, yyyy")
			let prettyDate = $.format.prettyDate(post.created)

			let date = ((Math.floor(post.created - Date.now) / (1000*60*60*24)) > 30) ? formatDate : prettyDate 

			let blogTemplate = '<div class=\"row onePost\">' +
									'<div class=\"col-xs-12 post\">' +
										'<div class=\"row\">' +
											'<div class=\"btn-group btn-group-sm editGroup\" role=\"group\" aria-label=\"edit\">' +
												'<button type=\"button\" class=\"edit btn btn-default\" id=\"' + post.id + '\"><span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span></button>' +
												'<button type=\"button\" class=\"delete btn btn-default\" id=\"' + post.id + '\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></button>' +
											'</div>' +
										'</div>' +
										'<div class=\"postTitle\" contenteditable=\'false\'>' + post.title + "</div>" +
										'<div class=\"row\">' + 
											'<div class=\"col-xs-6 postAuthor\">' + post.author + '</div>' +
											'<div class=\"col-xs-6 postCreated\">' + date + '</div>' +
										'</div>' +
										'<div class=\"postContent\" contenteditable=\"false\">' + post.content + '</div>' +
									'</div>' +
							   '</div>';
			$("#blogPostEditSection").append(blogTemplate)
		})
	}

	function returnData(){
		getDataFromDatabase(printPosts)
	}
//****************************************//


	//POST new post
//*************************************//
	function createNewPostTemplate(){
		const formTemplate = "<div class=\'row\' id=\"newPostSection\">" +
								"<div class=\'col-xs-12\'>" +
									"<label id=\"newPostFormTitle\">New Post</label><form id=\"newPostForm\">" +
										"<label>Title</label><input type=\"text\" name=\"newPostTitle\" id=\'title\'>" +
										"<label id=\"contentDiv\">Content</label><textarea name=\"content\" id=\"content\" form=\"newPostForm\"></textarea>" +
										"<input type=\'submit\' value=\'Submit\' id=\"newPostSubmit\">" +
									"</form>" +
								"</div>" +
						 	 "</div>";


		$('#newPost').on('click', ()=> {
			$('#blogPostEditSection').empty()
			$('#blogPostEditSection').prepend(formTemplate)
		})

		postNewPostToDatabase()
	}

	function postNewPostToDatabase(){
		$('#blogPostEditSection').on('click', '#newPostSubmit', (event) => {
			event.preventDefault()
			let data = {
						"title": converter.makeHtml($('#title').val()), 
						"content": converter.makeHtml($('#content').val()),
						"created": Date.now()
						};

			let dataJSON = JSON.stringify(data)
			console.log(data, dataJSON)
			
			$.ajax({
			     url: DATABASE_URL,
			     type: 'POST',
			     data: dataJSON,
			     contentType: 'application/json',
			    success: function(msg){
			        alert(`${data.title} was posted`);
			    },
			});

			location.reload()

		})
	}
//****************************************//


	//PUT edit post from database and send update to databases
//*************************************//
	function editDataFromDatabase(){
		$('#blogPostEditSection').on('click', '.edit', function(){
			let postID = this.id;
			let parentDiv = $(this).parent().parent().parent()
			$(parentDiv).children('.postTitle').attr('contenteditable', true)
			$(parentDiv).children('.postContent').attr('contenteditable', true)
			$(parentDiv).children('.postContent').focus()
			$(parentDiv).append("<div id=\'buttonDiv\'><button class=\'btn btn-default\' id=\'editSubmit'>Submit</button></div>")
			putDataToDatabase(postID)
		})
	}

	function putDataToDatabase(id){
		$('#blogPostEditSection').on('click', '#editSubmit', () => {

			let parentDiv = $("#editSubmit").parent()
			let selectedTitle = $(parentDiv).siblings('.postTitle').text()
			$(parentDiv).siblings('.postTitle').attr('contenteditable', false)
			$(parentDiv).siblings('.postContent').attr('contenteditable', false)
			
			let editedTitle = $(parentDiv).siblings('.postTitle').text()
			let editedContent = $(parentDiv).siblings('.postContent').text()

			let putJSON = JSON.stringify({'title': converter.makeHtml(editedTitle), 'content': converter.makeHtml(editedContent), 'created': Date.now()}) 

			let putURL = DATABASE_URL + '/' + id

			$.ajax({
				url: putURL,
				type: 'PUT',
				data: putJSON,
				contentType: 'application/json',
				success: (data) => alert(`Updated ${selectedTitle}.`)
			})

			$(parentDiv).remove()

			location.reload()

		})
	}
//****************************************//

	//DELETE selected post from database
//*************************************//
	function deleteDataFromDatabase(){
		$('#blogPostEditSection').on('click', '.delete', function(){
			let postID = this.id;
			let parentDiv = $(this).parent().parent().parent()
			let selectedTitle = $(parentDiv).children('.postTitle').text()

			if (confirm(`Are you sure you want to delete post ${selectedTitle}?`) == true){
				let deleteURL = DATABASE_URL + '/' + postID
				$.ajax({
				    type: "DELETE",
				    url: deleteURL,
				    success: function(msg){
				        alert(`Deleted post ${selectedTitle}`);
				    }
				});
				location.reload()
			}
			else{
				alert(`Did not delete post ${selectedTitle}`)
			}
		})
	}
//****************************************//

$(() => {
	returnData();
	createNewPostTemplate()
	deleteDataFromDatabase()
	editDataFromDatabase()
})