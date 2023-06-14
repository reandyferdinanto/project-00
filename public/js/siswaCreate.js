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

  // FILE UPLOAD
  const fileUpload = document.getElementById("fileUpload");
  fileUpload.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(fileUpload);

    $.ajax({
      url: "/api/utils/upload",
      type: "POST",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        if (response.payload.status_code == 201) {
          window.location = "/siswa";
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });

  // MANUAL UPLOAD
  const manualForm = document.getElementById("submit-form");
  // $("selesai-button").on("click", () => {
  manualForm.addEventListener("submit", (e) => {
    let formData = new FormData(manualForm);
    e.preventDefault();
    $.ajax({
      url: "/api/scores",
      type: "POST",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        if (response.payload.status_code == 201) {
          window.location = "/siswa";
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });
  // });
});
