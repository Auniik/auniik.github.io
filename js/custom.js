jQuery(document).ready(function() { 
	
	/* ---------------------------------------------------------------------- */
	/*	Custom Functions
	/* ---------------------------------------------------------------------- */

	// Logo
	var $logo 	= $('#logo');

    if (location.hash && location.hash != "#profile") {
        $logo.show();
    }
	// Show logo 
	$('.menu .tabs a').click(function() {
	  $logo.fadeIn('slow');
	});
	// Hide logo
	$('.tab-profile').click(function() {
	  $logo.fadeOut('slow');
	});	

	/* ---------------------------------------------------------------------- */
	/*	Resume
	/* ---------------------------------------------------------------------- */
	
	// Rating bars
	$(".skills li .rating").each(function(index,e) { 

		// Vars
		var 
			$ratNum = 7,
			$rat = $(e).attr("data-rat"),
			$point = "<span></span>";

		// Append points
		while($ratNum > 0){
		     $(e).append($point);
		     $ratNum--;
		}

		$(e).find("span").each(function(index,e) { 
			if(index >= $rat) return false;
			// Append Disabled Rats
			$(e).animate({
			    opacity: 1
			  });
		});

    });
	 
	/* ---------------------------------------------------------------------- */
	/*	Menu
	/* ---------------------------------------------------------------------- */
	
	// Needed variables
	var $content 		= $("#content");
	
	// Run easytabs
  	$content.easytabs({
	  animate			: true,
	  updateHash		: false,
	  transitionIn		:'slideDown',
	  transitionOut		:'slideUp',
	  animationSpeed	:600,
	  tabs				:".tmenu",
	  tabActiveClass	:'active',
	});

	// Keep the active tab in the URL so reloads and back/forward survive.
	// pushState instead of easytabs' updateHash avoids the browser jumping to the panel.
	$content.bind('easytabs:after', function(e, $tab, $panel) {
		var hash = '#' + $panel.attr('id');
		if ((location.hash || '#profile') != hash) {
			history.pushState(null, '', hash);
		}
	});
	$(window).bind('popstate', function() {
		var hash = location.hash || '#profile';
		$content.easytabs('select', hash);
		$logo[hash == '#profile' ? 'fadeOut' : 'fadeIn']('slow');
	});
	if (location.hash) {
		window.scrollTo(0, 0);
	}

	
	// Hover menu effect
	$content.find('.tabs li a').hover(
		function() {
			$(this).stop().animate({ marginTop: "-7px" }, 200);
		},function(){
			$(this).stop().animate({ marginTop: "0px" }, 300);
		}
	);

	
	/* ---------------------------------------------------------------------- */
	/*	Cats Filter
	/* ---------------------------------------------------------------------- */ 

	var $catsfilter 		= $('.cats-filter');

	// Copy categories to item classes
	$catsfilter.find('a').click(function() {
		var currentOption = $(this).attr('data-filter');
		$(this).parent().parent().find('a').removeClass('current');
		$(this).addClass('current');
	});	
	
	/* ---------------------------------------------------------------------- */
	/*	Portfolio
	/* ---------------------------------------------------------------------- */ 
	
	// Needed variables
	var $plist	 	= $('#projects-list');
	var $pfilter 		= $('#projects-filter');
		
	// Run Isotope  
	$plist.isotope({
		filter				: '*',
		layoutMode   		: 'masonry',
		animationOptions	: {
			duration			: 750,
			easing				: 'linear'
		}
	});	
	
	// Isotope Filter 
	$pfilter.find('a').click(function(){
		var selector = $(this).attr('data-filter');
		$plist.isotope({ 
			filter				: selector,
			animationOptions	: {
				duration			: 750,
				easing				: 'linear',
				queue				: false,
			}
		});
		return false;
	});	
	
	// Portfolio image animation 
	$plist.find('img').adipoli({
		'startEffect' 	: 'transparent',
		'hoverEffect' 	: 'boxRandom',
		'imageOpacity' 	: 0.6,
		'animSpeed' 	: 100,
	});
	
	/* ---------------------------------------------------------------------- */
	/*	prettyPhoto
	/* ---------------------------------------------------------------------- */

	$("a[rel^='projects']").prettyPhoto({
		animation_speed: 'fast', /* fast/slow/normal */
		social_tools: '',
		theme: 'pp_default',
		horizontal_padding: 5,
	});



	/* ---------------------------------------------------------------------- */
	/*	Contact Form
	/* ---------------------------------------------------------------------- */

	var form = document.getElementById("contactform");
	var button = document.getElementById("my-form-button");
	var status = document.getElementById("my-form-status");

	// Returns the problem with a field, or "" when it is fine
	function fieldError(field) {
		var value = field.value.trim();
		if (!value) return "Please fill this in.";
		if (field.type === "email" && field.validity.typeMismatch) return "That email address doesn't look right.";
		if (field.minLength > 0 && value.length < field.minLength) return "A little more detail, please (at least " + field.minLength + " characters).";
		return "";
	}

	function showError(field) {
		var message = fieldError(field);
		field.classList.toggle("invalid", !!message);
		field.parentNode.querySelector(".field-error").textContent = message;
		return !message;
	}

	var fields = form.querySelectorAll("[required]");
	fields.forEach(function(field) {
		// Re-check as they type, but only once a field has been flagged
		field.addEventListener("input", function() {
			if (field.classList.contains("invalid")) showError(field);
		});
	});

	function setStatus(text, type) {
		status.innerHTML = text;
		status.className = type || "";
	}

	form.addEventListener("submit", function(event) {
		event.preventDefault();

		var valid = true;
		fields.forEach(function(field) { valid = showError(field) && valid; });
		if (!valid) {
			form.querySelector(".invalid").focus();
			return;
		}

		var name = form.elements.name.value.trim();
		form.elements._subject.value = "Portfolio message from " + name;
		button.disabled = true;
		button.textContent = "Sending…";
		setStatus("");

		fetch(form.action, {
			method: form.method,
			body: new FormData(form),
			headers: { "Accept": "application/json" }
		}).then(function(response) {
			if (response.ok) {
				form.reset();
				setStatus("Thanks, " + name.split(" ")[0] + "! Your message is on its way. I'll reply soon.", "success");
				return;
			}
			return response.json().then(function(data) {
				var detail = data && data.errors ? data.errors.map(function(e) { return e.message; }).join(", ") : "";
				throw new Error(detail);
			});
		}).catch(function(error) {
			// main.js puts the address from data.json on the form
			var mail = form.dataset.email;
			setStatus((error.message ? error.message + ". " : "Couldn't send your message right now. ") +
				(mail ? 'You can also email me at <a href="mailto:' + mail + '">' + mail + '</a>.' : ''), "error");
		}).then(function() {
			button.disabled = false;
			button.textContent = "Send message";
		});
	});

	/* ---------------------------------------------------------------------- */
	/*	Google Maps
	/* ---------------------------------------------------------------------- */
	
	// Needed variables
	// var $map 				= $('#map'),
	// 	$tabContactClass 	= ('tab-contact'),
	// 	$lat 				= '23.8211588',
	// 	$lon 				= '90.348347';

	// $map.gmap().bind('init', function(ev, map) {
	// 	$map.gmap('addMarker', {'position': $lat +','+ $lon  , 'bounds': true}).click(function() {
	// 		$map.gmap('openInfoWindow', {
    //         'content': 'Hello everyone! Please refer to the contact<br />form below and send me a message!',
    //         'autoscroll': true,
    //         'maxWidth': 350,
    //         'maxHeight': 150
    //      }, this);
	// 	});
	// 	$map.gmap('option', 'zoom', 15.33);
	// });

	// // Refresh Map
	// $content.bind('easytabs:after', function(evt,tab,panel) {
	// 	$map.gmap('refresh'); 
  	// });


	// new GMaps({
	// 	div: '#map',
	// 	lat: -12.043333,
	// 	lng: -77.028333
	// });
      
  

});	