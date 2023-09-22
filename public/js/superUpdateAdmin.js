$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  // ADD SOAL

  $("#selesai").on("click", () => {
    $(".submit-layer").css("visibility", "visible");
  });

  $(".ubah-button").on("click", () => {
    $(".submit-layer").css("visibility", "hidden");
  });

  // GET URL
  let unique_id = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );
  let url_input = `/api/admin/${unique_id}`;
  // SET INPUT
  $.get(url_input, async (data, status) => {
    let datas = data.payload.datas;
    if (status == "success" && datas.length !== 0) {
      $("#email").val(datas.email);
      $("#username").val(datas.username);
      $("#nuptk").val(datas.nuptk);
      $(`input[name=gender][value='${datas.gender}']`).prop("checked",true);
    }
  });
  // SET UJIAN

  $("#complete-upload").on("click", function (e) {
    e.preventDefault();
    window.location = "/admin";
  });

  // SUBMIT
  const manualForm = document.getElementById("submit-form");
  manualForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(manualForm);
    formData.append("unique_id", unique_id);
    $.ajax({
      url: "/api/admin",
      type: "PUT",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        if (response.payload.status_code == 200) {
          $(".complete-layer").removeClass("hide");
          $(".complete-layer").css("visibility", "visible");
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });
});
