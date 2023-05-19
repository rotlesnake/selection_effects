$(window).load(function() {
  var $container = $('.start-screen');

  $container.masonry({
    itemSelector: '.masonry-item',
    columnWidth: 128
  });
  
  $('.start-menu').hide().css('opacity', 1);
});

$(function() {
  //$('.start-screen-scroll').jScrollPane();
});

function resizeStart() {
    var startWidth = $('.start-screen').outerWidth();
    var startRound = Math.ceil(startWidth / 128.0) * 128;
  
  console.log('original: ' + startWidth);
  console.log('rounded: ' + startRound);
    
    $('.start-screen').css({
      'width' : startRound
    });
}


$(function() {
  var zIndex = 1;

  var fullHeight = $(window).height() - 48,
      fullWidth  = $(window).width();
 
  
  $(window).resize(function() {
    fullHeight = $(window).height() - 48;
    fullWidth = $(window).width();
  });
  
  $(function() {
    $('.window:visible').each(function() {
      var appName = $(this).data('window');
      
      $('.taskbar__item[data-window="' + appName + '"]').addClass('taskbar__item--open');
    });
    
    $('.window:hidden').each(function() {
      $(this).addClass('window--opening');
    });
  });
  
  $(function() {
    var initialActive = $('.window:visible').not('.window--minimized').first();
    var appName = $(initialActive).data('window');
    
   $(initialActive).addClass('window--active').css({'z-index' : zIndex++});
   $('.taskbar__item[data-window="' + appName + '"]').addClass('taskbar__item--active');
  });

  
  $('.window').click(function(e) {
    if ( !$(this).is('.window--active')) {
      $('.window').removeClass('window--active');
    }
    
    $(this).addClass('window--active');
    $(this).css({'z-index' : zIndex++});
    
    var appName = $(this).data('window');
    var targetTaskbar = $('.taskbar__item[data-window="' + appName + '"]');
   
    if ( !$('.window__close, .window__close1').is(e.target) && $('.window__close, .window__close1').has(e.target).length === 0 && !$('.window__minimize').is(e.target) && $('.window__minimize').has(e.target).length === 0 ) {
      $('.taskbar__item').removeClass('taskbar__item--active'); $(targetTaskbar).addClass('taskbar__item--active');
      
    }
  });
  
  $('.window').resizable({
    handles: 'n,ne,e,se,s,sw,w,nw',
    stop: function() {
     var initialHeight = $(this).height(),
     initialWidth = $(this).width(),
     initialTop = $(this).position().top,
     initialLeft = $(this).position().left; }
   });

  $('.window').draggable({    
    handle: '.window__titlebar',
    stop: function() {
    var initialHeight = $(this).height(),
        initialWidth = $(this).width(),
        initialTop = $(this).position().top,
        initialLeft = $(this).position().left; 
    },
    start: function(event, ui) {
      var mouseX = event.pageX + 'px';
      console.log(mouseX);
      
      $('.window').removeClass('window--active');
      
      $(this).addClass('window--active');
      $(this).css({'z-index' : zIndex++});

      if ( $(this).hasClass('window--maximized') ) {
       
        //alert(mouseX);
        $(this).removeClass('window--maximized').css({ 'height' : initialHeight,
                      'width'  : initialWidth,
                      'top'    : 0,
                      'left'   : mouseX }); 
      }  
      
      var appName = $(this).data('window');
    var targetTaskbar = $('.taskbar__item[data-window="' + appName + '"]')
    $('.taskbar__item').removeClass('taskbar__item--active'); $(targetTaskbar).addClass('taskbar__item--active');
    }
  });

  function openApp(e) {
    var appName = $(this).data('window');
    var targetWindow = $('.window[data-window="' + appName + '"]');
    var targetTaskbar = $('.taskbar__item[data-window="' + appName + '"]');
    
    e.preventDefault();
    $('.taskbar__item').removeClass('taskbar__item--active');
    
    if ( targetWindow.is(':visible') ) {
      if ( targetWindow.hasClass('window--active') ) {
        $(targetWindow).toggleClass('window--minimized');

        if ( !targetWindow.hasClass('window--minimized') ) {
          var initialHeight = $(targetWindow).height(),
               initialWidth = $(targetWindow).width(),
               initialTop = $(targetWindow).position().top,
               initialLeft = $(targetWindow).position().left; 
          
          $('.window').removeClass('window--active');

         $(targetWindow).addClass('window--active').css({ 
            'z-index' : zIndex++
          });
          
         $(targetTaskbar).addClass('taskbar__item--active');
        }
      } else {
        $('.window').removeClass('window--active');
        $(targetWindow).addClass('window--active').removeClass('window--minimized').css({'z-index' : zIndex++});
        
        $(targetTaskbar).addClass('taskbar__item--active');
      }
    } else {
      $('.window').removeClass('window--active');
      
      $('.window[data-window="' + appName + '"]').css({ 'z-index' : zIndex++ }).addClass('window--active').show();
      
      setTimeout(function() {
        $('.window[data-window="' + appName + '"]').removeClass('window--opening');
      }, 500);
      
      $(targetTaskbar).addClass('taskbar__item--active').addClass('taskbar__item--open');
    } 
  }
  
  $('.taskbar__item').click(openApp);
  $('.start-menu__recent li a').click(openApp);
  $('.start-screen__tile').click(openApp);

  
  
  
  
  
  $('.window__titlebar').each(function() {
    var parentWindow = $(this).closest('.window'); 
    
    $(this).find('a').click(function(e) {
      e.preventDefault();
    });
    
   /* $(this).find('.window__icon').click(function(e) {
      $(this).siblings('.window__menutoggle').trigger('click');
    });*/$('.window__newtab').hide();
        $('.window--menutoggle').click(function() {
	    $('.window__menu').toggle();
          $('.window__newtab').show();
    });
   /* $(this).find('.window__menutoggle').click(function(e) {
      $(parentWindow).find('.window__menu').fadeToggle(100).toggleClass('window__menu--open');
      $(this).toggleClass('window__menutoggle--open');
    });*/
    
    $(this).find('.window__close, .window__close1').click(function(e) {
      $(parentWindow).addClass('window--closing');
      $('.window__newtab').hide();
      setTimeout(function() {             $(parentWindow).hide().removeClass('window--closing').addClass('window--opening');
      }, 500);
      
      var appName = $(parentWindow).data('window');
      
      $('.taskbar__item[data-window="' + appName + '"]').removeClass('taskbar__item--open').removeClass('taskbar__item--active');
      
      var closest = $('.window').not('.window--minimized, .window--closing, .window--opening').filter(function() {
        return $(this).css('z-index') < zIndex
      }).first();
      
      $(closest).addClass('window--active');
    });
    
    $(this).find('.window__minimize').click(function(e) {
      $(parentWindow).addClass('window--minimized');
      
     var appName = $(parentWindow).data('window');
    var targetTaskbar = $('.taskbar__item[data-window="' + appName + '"]');
      
     //alert(targetTaskbar.attr('class'));
      $(targetTaskbar).removeClass('taskbar__item--active');
      
    });
    
    $(this).find('.window__maximize').click(function(e) {

      $(parentWindow).toggleClass('window--maximized');

      if ( !$(parentWindow).hasClass('window--maximized') ) {
        $(parentWindow).css({ 'height' : initialHeight,
                              'width'  : initialWidth,
                              'top'    : initialTop,
                              'left'   : initialLeft });
      } else {
        initialHeight = $(parentWindow).height();
        initialWidth = $(parentWindow).width();
        initialTop = $(parentWindow).position().top;
        initialLeft = $(parentWindow).position().left;

        $(parentWindow).css({ 'height' : fullHeight,
                              'width'  : fullWidth,
                              'top'    : 0,
                              'left'   : 0 });
      }
    });
  });

  $('.window__titlebar').mouseup(function(e) {
  var parentWindow = $(this).closest('.window');
  var pos = $(parentWindow).offset().top;
    
    if ( pos < -5 ) {
      //alert('at top')
      $(parentWindow).addClass('window--maximized');
      
      initialHeight = $(parentWindow).height();
        initialWidth = $(parentWindow).width();
        initialTop = $(parentWindow).position().top;
        initialLeft = $(parentWindow).position().left;

        $(parentWindow).css({ 'height' : fullHeight,
                              'width'  : fullWidth,
                              'top'    : 0,
                              'left'   : 0 });
    }
  
});
}); 



// Unfocus windows when desktop is clicked
$('.desktop').click(function(e) {
  if ( $('.desktop').has(e.target).length === 0 ) {
    $('.window').removeClass('window--active');
    $('.taskbar__item').removeClass('taskbar__item--active');
  }
});





$(function() {
  $('.side__list ul').each(function() {
    if ( $(this).find('ul').is(':visible') ) {
      $(this).children('li').addClass('side__list--open');
    }
  });
});



$(function() {
  $('.side__list li').each(function() {
    if ( $(this).children('ul').length ) {
      //$(this).addClass('list__sublist');
      $(this).children('a').append('<span class="list__toggle"></span>');
      
      
    }
    
    if ( $(this).children('ul').is(':visible') ) {
      $(this).addClass('side__list--open');
    }
  });
});

$(document).on('click', '.list__toggle',  function() {

 $(this).closest('li').children('ul').animate({
  'height' : 'toggle',
  'opacity' : 'toggle'
}, 250);

 $(this).closest('li').toggleClass('side__list--open');


});




function toggleStart(e) {
  $('.start-menu-fade').fadeToggle(500);
  $('.start-menu').fadeToggle(250).toggleClass('start-menu--open');
  $('.taskbar__item--start').toggleClass('start--open');
}
$('.taskbar__item--start').click(toggleStart);
$('.start-menu__recent li a').click(toggleStart);
$('.start-screen__tile').click(toggleStart);

// Prevent "open" class on start
$(function() {
  $('.taskbar__item--start').click(function() {
    $(this).removeClass('taskbar__item--open taskbar__item--active');
  });
});


$(document).mouseup(function(e) {
    var start = $('.start-menu');
    var startToggle = $('.taskbar__item--start');


    if (start.is(':visible') && !startToggle.is(e.target) && startToggle.has(e.target).length === 0 && !start.is(e.target) && start.has(e.target).length === 0 ) {
      toggleStart();
      //alert('clicked outside start');
    }
});

// Current time 
$(function() {
 // var a_p = "";
  var d = new Date();

  var curr_hour = d.getHours();

  /*if (curr_hour < 12)
     {
     a_p = "AM";
     }
  else
     {
     a_p = "PM";
     }*/
  if (curr_hour == 0)
     {
     curr_hour = 12;
     }
  if (curr_hour > 12)
     {
     curr_hour = curr_hour - 12;
     }

  var curr_min = d.getMinutes();
  
  if ( curr_min < 10 ) {
    curr_min = '0' + curr_min;
  }

  $('.time').html(curr_hour + ':' + curr_min + ' ');
});



/* CHANGER DE NOM */
//clone id input en for label
 $('#user').on("change",function(e) {
      //console.log("change fire");
     var i = $(this).prev('label').clone();
      var file = $('#user')[0].files[0].name;
   //console.log(file);
      $(this).prev('label').text(file);
     e.preventDefault();
    });

  $("#my_button").click(function() {
    //$(".window").fadeOut('slow', function() {
      $("#hello").show();
      var name = $('#user').val();
      var t = "Bienvenue " + name + " ! ";
      $('#hello').html(t);
})

/**********************************************
	CHANGER FOND D'ECRAN 
**********************************************/
//clone id input en for label
 $('#uploader').on("change",function(e) {
      //console.log("change fire");
     var i = $(this).prev('label').clone();
      var file = $('#uploader')[0].files[0].name;
   //console.log(file);
      $(this).prev('label').text(file);
     e.preventDefault();
    });

// Set background Image
$('ul#background li').click(function(e){
  $('ul#background li').each(function(){
      $(this).removeClass('active');
  });  
    $(this).addClass('active');
    var source = $(this).children('img').attr('src');
    $('.desktop').css('background-image', 'url('+source+')');
});
$(function () {
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});
function imageIsLoaded(e) {
           $('.desktop').css('background-image', 'url('+e.target.result+')');
        }
 
/* MODE DARK */
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
  }
}

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}
if (typeof toggleSwitch.addEventListener !== 'null') {
toggleSwitch.addEventListener('change', switchTheme, false);
}