
$(document).ready(function() {
    
    // to open the hamburger button menu
    $("#button-dropdown").click(function() {
      $("#dropdown-content").toggle();
    });

    // to close the hamburger button menu when clicking outside of it
    $(document).on("click", function(event) {
      if (!$(event.target).closest("#button-dropdown, #dropdown-content").length) {
        $("#dropdown-content").hide();
      }
    });
});