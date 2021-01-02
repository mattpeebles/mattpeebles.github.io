var sticky = $('#name').offset().top - 12;

const isEventTriggerVisible = () => (window.pageYOffset || $(window).scrollTop()) < $("#event-trigger").offset().top + $("#event-trigger").height();

function logoSetup()
{
	let navbarLogo = $("#navbar");

	if (!isEventTriggerVisible())
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
	let navbarLogo = $("#navbar");
	
	if (shrink)
	{
		if (isEventTriggerVisible() == false && navbarLogoCanAnimateIn)
		{
			navbarLogoCanAnimateIn = false;
			navbarLogo.removeClass("hidden");
			navbarLogo.animate({
				opacity: 1
			}, 1000, () =>
			{
				navbarLogoCanAnimateIn = true;
			})
		}
	}
	else
	{
		if (isEventTriggerVisible() && navbarLogoCanAnimateOut)
		{
			navbarLogoCanAnimateOut = false;

			navbarLogo.animate({
				opacity: 0
			}, 500, () => 
			{
				navbarLogoCanAnimateOut = true;
				navbarLogo.addClass('hidden');
			})
		}
	}

}

function stickyNav()
{
	var scrollTop = $(window).scrollTop();

	if (scrollTop > sticky)
	{
		$('#name').addClass('sticky');
	} else
	{
		$('#name').removeClass('sticky');
	}
};

function highlightCurrentSection()
{
	const about = $("#summary");
	const projects = $("#projects");
	const contact = $("#contact");

	$(".navbar-menu-link").removeClass("nav-select");

	if (isVisible(about))
	{
		$(".navbar-menu-item-summary").addClass("nav-select");
	}
	else if (isVisible(projects))
	{
		$(".navbar-menu-item-projects").addClass("nav-select");
	}
	else if (isVisible(contact))
	{
		$(".navbar-menu-item-contact").addClass("nav-select");
	}

}

/// item: jquery
function isVisible(item)
{
	return item.visible(true);
}

$(() =>
{
	logoSetup()

	let lastScrollTop = window.pageYOffset || $(window).scrollTop()

	$(".container").scroll((x) =>
	{
		let currentOffset = $(".container").scrollTop();
		let shrink = lastScrollTop < currentOffset;
		lastScrollTop = currentOffset;

		adjustLogos(shrink);
		highlightCurrentSection();
	})
})