/**
 * @file
 * Placeholder file for custom sub-theme behaviors.
 *
 */
(function ($) {

  function overlay($title, $body, $image) {

    // prevent background scrolling
    var current = $(window).scrollTop();
    $(window).scroll(function() {
        $(window).scrollTop(current);
    });

    // prevent href trigger
    //firefoxSafePreventEvent();

    // reset overlay content
    $('#overlay > .overlay-content-wrapper').html('');

    // init content
    var $content = $('<div class="overlay-content"></div>');
    var $oTitle = $('<h1 class="overlay-title"></h1>');
    var $oBody = $('<div class="overlay-body"></div>');
    var $oImage = $('<div class="overlay-image"></div>');
    
    // display overlay div
    $('#overlay').addClass('on');
    $('#overlay > .overlay-content-wrapper')
                .append($oTitle.html($title.html()))
                .append($oImage.html($image.html()))
                .append($oBody.html($body.html()));    
  }


  Drupal.behaviors.oncoLocationToggle = {
    attach: function (context, settings) {
      $('.location-term').click(function(){
        var $block = $('<div></div>');
        if ($(this).hasClass('location-term-1')) {
          // case Centre
          $block = $('.address-wrapper.centre');
        }
        if ($(this).hasClass('location-term-2')) {
          // case Belharra
          $block = $('.address-wrapper.belharra');
        }
        var $trigger = $('.location-term');
        var $sidebar = $('.rightbar');
        addressBarToggle($sidebar, $block, true);
      });
    }
  };

  Drupal.behaviors.oncoDoctorCVToggle = {
    attach: function (context, settings) {
      $('.doctor-more, .doctor-image').click(function(){
        var $doctor = $(this).parent().parent();
        var $title = $('> .doctor-header .doctor-name', $doctor);
        var $image = $('> .doctor-header .doctor-image', $doctor);
        var $body = $('> .doctor-body', $doctor);
        overlay($title, $body, $image);
      });
    }
  };

  Drupal.behaviors.oncoOverlayToggle = {
    attach: function (context, settings) {
      $('.paragraph-trigger').click(function(){
        $('#overlay > .overlay-content-wrapper').html('');
        var $title = $('.paragraph[data-uuid="' + $(this).attr('data-uuid') + '"] .paragraph-title');
        var $body = $('.paragraph[data-uuid="' + $(this).attr('data-uuid') + '"] .paragraph-body');
        var $image = $('.paragraph[data-uuid="' + $(this).attr('data-uuid') + '"] .paragraph-image');
        overlay($title, $body, $image);
      });

      $('.overlay-close').click(function(){
        $('#overlay').removeClass('on');
        $(window).off('scroll');
      })
    }
  };

  function initMobileMenu() {
    if($(window).width() < 680) {
      $('.leftbar').addClass('mobilebar');
    }
  } 

  function mScrollTo($target, $offset = 0, $headroom = false) {
    var duration = 1500; // Durée de l'animation (en ms)
    var easing = 'easeOutQuint';
    var offset = $offset;
    if ($headroom) {
      offset = -50;
    }
    $(window).scrollTo(
      $target, 
      duration, 
      {
        axis: 'y',
        interrupt: true,
        limit: true,
        offset: offset,
        easing: easing,
      }
    );
    return false;
  }

  function firefoxSafePreventEvent(e){
    
      if(e.preventDefault){ e.preventDefault()}
      else{e.stop()};
      e.returnValue = false;
      e.stopPropagation();        
  }

  function isMobile() {
    return $(window).width() <= 480;
  }

  Drupal.behaviors.oncoMenuTriggers = {
    attach: function (context, settings) {
      $('.main-menu-item').click(function(e){

        // submenu accordion
        if ($(this).hasClass('item-level--0')) {
          var $submenu = $('> .menu-level--1', this);
          var i = 0;
          var lineheight = parseFloat($('.menu-level--1').css('line-height'));
          console.log(lineheight);
          $('> .main-menu-item', $submenu).each(function(){i++;})
          if ($submenu.hasClass('on')) {
            $submenu.css('height', 0).removeClass('on');
          } else {
            $submenu.css('height', lineheight*i + 'px').addClass('on');  
          } 
        }

        firefoxSafePreventEvent(e);
        console.log('menu item clicked');
        var link = $('> .main-menu-link', this).attr('href');
        console.log('menu item link: ' + link);
        var target = $('article[about="' + link + '"]');


        var paragraphe = $('> .main-menu-link', this).attr('data-paragraph-target');
        console.log('menu item paragraph target: ' + paragraphe);
        if(paragraphe) {
          $paragraph_target = $('.paragraph[data-uuid="' + paragraphe + '"]');
          $('> .paragraph', $paragraph_target.parent()).removeClass('on').addClass('off'); 
          $paragraph_target.toggleClass('off on');
          $menuitem_target = $('.paragraphs-menu-item[data-uuid=' + paragraphe + ']');
          $('> .paragraphs-menu-item', $menuitem_target.parent()).removeClass('active');
          $menuitem_target.addClass('active');          
          target = $paragraph_target;
        }

        var $offset = isMobile() ? -50 : 0;
        mScrollTo(target, $offset);

        if (isMobile() && $(this).isLeaf()) {
          toggleftbar();
        }        

        // active le style du menu item 
        //toggleMenuItem($('> .main-menu-link', $(this)));
        $('> .main-menu-link', $(this)).toggleMenuItemClass();

        

        
        return false;

      });
        

    },
    detach: function (context, settings) {}
  };


  $.fn.isLeaf = function() {
    var href = '';
    if ($(this).hasClass('main-menu-item')) {
      href = $('> .main-menu-link', $(this)).attr('href');
    }
    if ($(this).hasClass('main-menu-link')) {
      href = $(this).attr('href');
    }
    console.log('href : ' + href);
    console.log(href != '');
    
    return href != '';
  }

  $.fn.toggleMenuItemClass = function() {
    // main menu
    // remove all style
    $('.main-menu-link').removeClass('active');


    // paragraphs menu
    // remove all style of same menu
    $('> .paragraphs-menu-item', $(this).parent()).removeClass('active');       

    // get target id if any
    var target_id = '';
    // main menu item
    if ($(this).hasClass('main-menu-link')) {
      target_id = $(this).attr('data-paragraph-target');
    }
    // paragraphs menu
    if ($(this).hasClass('paragraphs-menu-item')) {
      target_id = $(this).attr('data-uuid');
    }
    console.log('target_id = ' + target_id);
    if(typeof(target_id)  === "undefined") {target_id = '';}
    if (target_id != '') {
      
      $('.main-menu-link[data-paragraph-target="' + target_id + '"]').addClass('active');
      $('.paragraphs-menu-item[data-uuid="' + target_id + '"]').addClass('active');      
    }
    else {
      if ($(this).isLeaf()) {
        $(this).addClass('active');  
      }
      
    }


    return false;    
  }

  function toggleftbar() {
    var $btn = $('.leftbar-btn');
    var $sidebar = $('.leftbar');
    $sidebar.toggleClass('open close');
    $btn.toggleClass('open close');

    // si on est pas mobile
    // on decale les images à l'ouverture du menu
    // on change le libellé du bouton
    if (!isMobile()) {
      $('.home-logo, .home-picture, .chapter-image').toggleClass('slide');
      if($sidebar.hasClass('open')) {
        $btn.text($btn.attr('data-label-close'));
      } else {
        $btn.text($btn.attr('data-label-open'));
      }
    }
  }

  Drupal.behaviors.oncoMenuBarToggle = {
    attach: function (context, settings) {
      var $btn = $('.leftbar-btn');
      var $sidebar = $('.leftbar');
      var $logo = $('.home-logo');
      $btn.click(function(){
        toggleftbar();
        setLogoDisplay();      	
      });
    }
  };


  function addressBarToggle($sidebar = $('.rightbar'), $block = $('.address-wrapper.centre'), checkopen = false) {

    $.fn.open = function() {
      $(this).removeClass('close').addClass('open');
      $('.rightbar-btn').removeClass('close').addClass('open');
      $('.rightbar-btn').text($('.rightbar-btn').attr('data-label-close'));
    }

    $.fn.close = function() {
      $(this).removeClass('open').addClass('close');
      $('.rightbar-btn').removeClass('open').addClass('close');
      $('.rightbar-btn').text($('.rightbar-btn').attr('data-label-open'));
    }

    // disable all address display
    // adding 400ms of delay -> transition timing
    //$('.address').addClass('off');  
    setTimeout(function(){$('.address-wrapper').addClass('off');}, 400);  

    // check if open already option is set
    if (checkopen) {
      // if open, first we close it 
      // then we wait for the transition
      // then we open again with new content
      if ($sidebar.hasClass('open')) {
        $sidebar.close();
        setTimeout(function(){$sidebar.open();}, 700);
      } else {
        $sidebar.open();  
      }
    } else {
      if ($sidebar.hasClass('open')) {
        $sidebar.close();         
      } else {
        $sidebar.open();  
      }
    }

    // enable target block display
    setTimeout(function(){$block.removeClass('off');}, 400);
    
  }

  Drupal.behaviors.oncoAddressBarToggle = {
    attach: function (context, settings) {
      var $trigger = $('.rightbar-btn');
      var $sidebar = $('.rightbar');
      var $block = $('.address-wrapper.centre');
      $trigger.click(function(){
        addressBarToggle($sidebar, $block, false);
      });
    }
  };

  Drupal.behaviors.switchParagraphs = {
    attach: function (context, settings) {
      var $trigger = $('.paragraphs-menu > .paragraphs-menu-item');
      $trigger.click(function() {
      	uuid = $(this).attr('data-uuid');
      	console.log(uuid);
      	$('> .paragraphs-wrapper > .paragraphs > .paragraph', $(this).parent().parent()).removeClass('on').addClass('off');      	
      	$('.paragraph[data-uuid="' + uuid + '"]').removeClass('off').addClass('on');

      	//$('> .paragraphs-menu-item', $(this).parent()).removeClass('active');      	
      	//$(this).addClass('active');
        //toggleMenuItem($(this));

        $(this).toggleMenuItemClass();


      });
    }
  };

  function px(input) {
      var remSize = parseFloat($('html').css("font-size"));
      return (input * remSize);
  }

  function hackHTML() {

    $('.paragraphs-menu-item:first-child').addClass('active');

    if (!isMobile()) {
      $('.leftbar-btn').text($('.leftbar-btn').attr('data-label-open'));
    }
  }

  function setLogoDisplay() {
    var scroll = $(window).scrollTop();
    var h = $(window).height();
    var $leftbar = $('.leftbar');
    var $logo = $('.home-logo');
    var is_mobile = $(window).width() <= 768;
    if (scroll >= h) {
      if ($leftbar.hasClass('open') || is_mobile) {
        $logo.addClass('off');
      }
      else {
        $logo.removeClass('off');
      }
    } else {
        $logo.removeClass('off');
    }
  }

  function setFootebarDisplay() {
    var scroll = $(window).scrollTop();
    var h = px(4.5);
    var $bar = $('.main-content');
    if (scroll < h) {
      $bar.addClass('home');
    } else {
      $bar.removeClass('home');
    }
  }

  function ready() {
    hackHTML();
    setLogoDisplay();
    setFootebarDisplay();
    initMobileMenu();
  }
  function loaded() {}
  function scroll() {
    setLogoDisplay();
    setFootebarDisplay();
  }
  function resize() {
    hackHTML();
  }


  $(window).ready(ready);
  $(window).load(loaded);
  $(window).scroll(scroll);
  $(window).resize(resize);

  

})(jQuery);