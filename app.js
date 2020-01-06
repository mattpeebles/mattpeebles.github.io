var sticky = $('#name').offset().top - 12;

let items = [
	{target: $("#logo-box"), adjustment: 25},
	{target: $("#name"), adjustment: 2}
]

let itemMaxSize = {};

function determineMaxSizes()
{
	items.forEach(item => {
		itemMaxSize[item.target.attr("id")] = 
		{
			width: item.target.width(), 
			height: item.target.height(),
			fontSize: item.target.css("font-size")
		};
	})
}

function logoSetup(){
	let eventTriggerOnScreen = (window.pageYOffset || $(window).scrollTop()) < $("#event-trigger").offset().top
		
	if(!eventTriggerOnScreen)
	{
		let name = $("#name");
		let navbarLogo = $("#navbar-logo");
		let eventTrigger = $("#event-trigger");

		name.css("opacity", 0);
		navbarLogo.css("opacity", 1);
	}
}

function adjustLogos(shrink)
{
	let name = $("#name");
	let navbarLogo = $("#navbar-logo");
	let eventTrigger = $("#event-trigger");

	if(shrink)
	{
		if(name.hasClass("sticky") && !name.hasClass("disappeared"))
		{
			name.animate({
				marginLeft: "-17%",
				opacity: 0,
				fontSize: "16px"
			}, 500)
			
			navbarLogo.animate({
				opacity: 1
			}, 1500)

			name.addClass("disappeared")
		}
	}
	else
	{
		if(!name.hasClass("sticky") && name.hasClass("disappeared"))
		{
			name.animate({
				marginLeft: "10%",
				opacity: 1,
				fontSize: "36px"
			}, 1000)

			name.removeClass("disappeared")

			navbarLogo.animate({
				opacity: 0
			}, 500)
		}
	}
	
}

function adjustBox(shrink)
{
	let box = $("#logo-box");
	function shrinkFunc(adjustment, target)
	{
		target.height(Math.max(target.height() - Math.abs(adjustment), 25));
		target.width(Math.max(target.width() - Math.abs(adjustment), 25));
	}

	function growFunc(adjustment, target){
		let id = target.attr("id");
		let maxsize = itemMaxSize[id];

		let maxHeight = maxsize.height;
		let maxWidth = maxsize.width;
		
		let adjustedHeight = target.height() + Math.abs(adjustment);
		let adjustedWidth = target.width() + Math.abs(adjustment);

		//always ensure it's a box no matter the size
		let adjustDimension = Math.max(adjustedHeight, adjustedWidth);
		target.height(Math.min(maxHeight, adjustDimension));
		target.width(Math.min(maxWidth, adjustDimension));
	}
	
	shrink ? shrinkFunc(1.5, box) : growFunc(10, box)

}

function adjustName(shrink)
{
	let name = $("#name");

	function removePx(size){
		let value = parseFloat(size.replace("px", ""))
		return value
	}

	function shrinkFunc(adjustment, target)
	{
		let size = Math.max(removePx(target.css("font-size")) - adjustment, 18);
		target.css("font-size", `${size}px`);
	}

	function growFunc(adjustment, target){
		if(target.hasClass("sticky")) return;

		let id = target.attr("id");
		let maxsize = itemMaxSize[id];

		let maxFont = maxsize.fontSize;
		let size = Math.min(removePx(maxFont), removePx(target.css("font-size")) + adjustment)
		

		target.css("font-size", `${size}px`);
	}
	
	shrink ? shrinkFunc(.4, name) : growFunc(12, name)
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
	stickyNav()
	logoSetup()
	// smoothScroll()
	// highlight()
	// navBarHide()
	// prettifyUrl()

	determineMaxSizes();
	let lastScrollTop = window.pageYOffset || $(window).scrollTop()

	$(window).scroll((x) => {
		stickyNav()
		
		let currentOffset = $(window).scrollTop();
		let shrink = lastScrollTop < currentOffset;
		lastScrollTop = currentOffset;
		
		adjustLogos(shrink);
		adjustBox(shrink)
		adjustName(shrink)
	})
})