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
	$('a[href*="#"]:not([href="#"])').on('click', function(e)
	{
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

function highlight(){
	if($('#summaryNav').hasClass('active')){
		$('#navHeader').addClass('highlight');
	}
	else{
		$('#navHeader').removeClass('highlight');
	}
}

$(() => {
	stickyNav()
	smoothScroll()
	highlight()
	navBarHide()
	$(window).scroll(() => {
		stickyNav()
		highlight()
	})
})