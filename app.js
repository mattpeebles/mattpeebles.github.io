var sticky = $('#name').offset().top - 12;

const isEventTriggerVisible = () => (window.pageYOffset || $(window).scrollTop()) < $("#event-trigger").offset().top;

function logoSetup(){
	let navbarLogo = $("#navbar-logo");
		
	if(!isEventTriggerVisible())
	{
		navbarLogo.css("opacity", 1);
	}
	else
	{
		navbarLogo.css("opacity", 0);
	}
}


let navbarLogoCanAnimateIn = true;
let navbarLogoCanAnimateOut = true;

function adjustLogos(shrink)
{
	let navbarLogo = $("#navbar-logo");

	if(shrink)
	{
		if(isEventTriggerVisible() == false && navbarLogoCanAnimateIn)
		{
			navbarLogoCanAnimateIn = false;
			navbarLogo.animate({
				opacity: 1
			}, 1000, () => {
				navbarLogoCanAnimateIn = true;
			})
		}
	}
	else
	{
		if(isEventTriggerVisible() && navbarLogoCanAnimateOut)
		{
			navbarLogoCanAnimateOut = false;

			navbarLogo.animate({
				opacity: 0
			}, 500, () => 
			{
				navbarLogoCanAnimateOut = true;
			})
		}
	}
	
}

function stickyNav(){
	var scrollTop = $(window).scrollTop();
	
	if (scrollTop > sticky) { 
	    $('#name').addClass('sticky');
	} else {
	    $('#name').removeClass('sticky'); 
	}
};

// function navBarHide(){
// 	let navMain = $(".navbar-collapse");
// 	$('.nav-link').on("click", () => {
// 	   console.log('hi')
// 	   navMain.collapse('hide');
// 	});
// }

// function smoothScroll(){
// 	$('a[href*="#"]:not([href="#"])').on('click', function(e){
// 		e.preventDefault();
		
// 		if( $( $.attr(this, 'href') ).length > 0 ){
// 			$('html, body').animate(
// 			{
// 				scrollTop: $( $.attr(this, 'href') ).offset().top
// 			}, 400);
// 		}
// 		return false;
// 	});
// }

// function prettifyUrl(){
// 	history.replaceState("", document.title, window.location.pathname)
// }

// function highlight(){
// 	if($('#summaryNav').hasClass('active')){
// 		$('#navHeader').addClass('highlight');
// 	}
// 	else{
// 		$('#navHeader').removeClass('highlight');
// 	}
// }

$(() => {
	// stickyNav()
	logoSetup()
	// smoothScroll()
	// highlight()
	// navBarHide()
	// prettifyUrl()

	let lastScrollTop = window.pageYOffset || $(window).scrollTop()

	$(window).scroll((x) => {
		// stickyNav()
		
		let currentOffset = $(window).scrollTop();
		let shrink = lastScrollTop < currentOffset;
		lastScrollTop = currentOffset;
		
		adjustLogos(shrink);
	})
})