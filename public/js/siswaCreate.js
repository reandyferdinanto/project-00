$(document).ready(() => {
  introJs()
    .setOptions({
      dontShowAgainCookie: "siswaCreate_intro",
      dontShowAgain: true,
      steps: [
        {
          title: "Tambah Siswa",
          intro:
            "Halaman ini berfungsi untuk menambahkan siswa baru ke dalam tabel",
        },
        {
          intro:
            "Guru dapat menambahkan siswa melalui dua cara, yaitu melalui file ataupun manual. Bila menambahkan melalui file, guru dapat menambahkan banyak siswa sekaligus.",
        },
        {
          element: document.querySelector(".input-file"),
          title: "MENAMBAHKAN MELALUI FILE",
          intro:
            "Untuk menambahkan siswa melalui file  excel (.csv), guru dapat menekan tombol ini dan memilih file terkait.",
        },
        {
          element: document.querySelector(".button-upload-csv"),
          intro:
            "setelah selesai memilih file, tekan tombol ini untuk mengunggah data.",
        },
        {
          element: document.querySelector(".main-input"),
          title: "MENAMBAHKAN SECARA MANUAL",
          intro:
            "Guru dapat mengisi formulir ini bila ingin menambahkan satu siswa saja.",
          position: "top",
        },
        {
          element: document.querySelector("#selesai"),
          intro:
            "Apabila sudah selesai mengisi formulir dapat langsung menekan tombol selesai",
          position: "left",
        },
      ],
    })
    .start();

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
  // IPNUT FILE DISABLE WHEN FILE NOT SELECTED
  $("input[type=file]").change(function () {
    if ($(this).val()) {
      $("input:submit").attr("disabled", false);
      // or, as has been pointed out elsewhere:
      // $('input:submit').removeAttr('disabled');
    }
  });
});
