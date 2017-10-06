const DATABASE_URL = window.location.origin
function getDataFromDatabase(callback){
	$.ajax(DATABASE_URL + '/api/posts', callback)
}

function printPosts(data){
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
	})
}


function returnData(){
	getDataFromDatabase(printPosts)
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
	   console.log('hi')
	   navMain.collapse('hide');
	});
}

$(() => {
	returnData()
	showContent()
	navBarHide()
})