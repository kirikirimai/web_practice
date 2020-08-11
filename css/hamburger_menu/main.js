$(function () {

  $(".btn-trigger").on("click", function () {
    $(this).toggleClass("active");
    
    if ($("#gnav-list").hasClass("active")) {

      $("#gnav-list").removeClass("active");
      setTimeout(function () {
        $("#gnav-wrap").removeClass("is-open");
      }, 500);
    
    } else {
      $("#gnav-wrap").addClass("is-open");
      setTimeout(function () {
        $("#gnav-list").addClass("active");
      }, 5);
    }
    return false;
  });
});