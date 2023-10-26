$(document).ready(() => {
  const formLogin = document.getElementById("formLogin");
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(formLogin);

    $.ajax({
      url: "/api/v1/admins/login",
      type: "POST",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        if (response.status == "success") {
          window.location = response.route;
        }
      },
      error: function(data, status, error){
        if(!$(".error-password").length){
          $(`
            <div class="error-password">Error: ${data.responseJSON.error}!</div>
          `).insertBefore("#formLogin")
          $(".error-password").delay(1500).fadeOut('slow', function(){
            $(this).remove()
          })
        }
      }
    });
  });
});
