
$("#form-login").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  $.ajax({
    url: "/api/v1/admins/login",
    type: "POST",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status == "success") {
        window.location = response.route;
      }
    },
    error: function (data, status, error) {
      console.log(data);
      $(`<div class="bg-red-500/70 fixed top-8 left-1/2 -translate-x-1/2 min-w-[400px] text-center py-1.5 rounded-lg border border-red-900 text-[#000] text-sm">${status}: ${data.responseJSON.error}</div>`)
        .insertBefore("#login-page")
        .delay(3000)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    },
  });
});
