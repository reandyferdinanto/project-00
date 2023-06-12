$(document).ready(() => {
  const formLogin = document.getElementById("formLogin");
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(formLogin);

    $.ajax({
      url: "/api/admin/login",
      type: "POST",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        if (response.message == "LOGEDIN") {
          window.location = "/";
        }
        if (response.error) {
          $(".error-password").html(response.error);
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });
});
