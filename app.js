var sticky = $('.navbar').offset().top;

function stickyNav(){
	var scrollTop = $(window).scrollTop();
	     
	if (scrollTop > sticky) { 
	    $('.navbar').addClass('sticky');
	} else {
	    $('.navbar').removeClass('sticky'); 
	}
};

function navBarHide(){
	let navMain = $(".navbar-collapse");
	$('.nav-link').on("click", () => {
	   console.log('hi')
	   navMain.collapse('hide');
	});
}

function smoothScroll(){
	$('a[href*="#"]:not([href="#"])').on('click', function(e){
		e.preventDefault();
		
		if( $( $.attr(this, 'href') ).length > 0 ){
			$('html, body').animate(
			{
				scrollTop: $( $.attr(this, 'href') ).offset().top
			}, 400);
		}
		return false;
	});
}

function applyScrollSpy(){

	if($('.nav-item').children('.active').length == 0 && window.location.hash !== ''){
		 history.pushState("", document.title, window.location.pathname)
	}

	$(window).on('activate.bs.scrollspy', (e) => {
		let hash = $('.nav-item').children('.active').attr('href').split('S')[0]
		window.location.hash = hash.replace('#', '#/')
	});
}

function highlight(){
	if($('#summaryNav').hasClass('active')){
		$('#navHeader').addClass('highlight');
	}
	else{
		$('#navHeader').removeClass('highlight');
	}
}

prettifyUrl(){
	let hash = 
}

$(() => {
	stickyNav()
	smoothScroll()
	highlight()
	navBarHide()
	applyScrollSpy()
	$(window).scroll(() => {
		stickyNav()
		highlight()
		applyScrollSpy()
	})
})