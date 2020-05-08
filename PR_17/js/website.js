$(function() {
  
  $(window).scroll(function() {
    var scrollTop = $(document).scrollTop();
    if (scrollTop > 50) {
      $(document.body).removeClass("header-large").addClass("header-small");
    } else {
      $(document.body).removeClass("header-small").addClass("header-large");
    }
  });
  
  $("nav li").hover(function() {
    $(this).addClass("nav-hovered");
  }, function() {
    $(this).removeClass("nav-hovered");
  });
  
  /*
   * Scroll To Top
   */
  
  // Check to see if the window is top if not then display button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 400) {
      $('.scrollToTop').fadeIn();
    } else {
      $('.scrollToTop').fadeOut();
    }
  });

  // Click event to scroll to top
  $('.scrollToTop').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 800);
    return false;
  });

  $(".logo").click(function() {
    document.location = "index.html";
  });
});
