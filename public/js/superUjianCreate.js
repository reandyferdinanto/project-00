
$(document).ready(() => {
    let first_intro = initializeIntro({
      dontShowAgainCookie: "topikCreate_intro",
      dontShowAgain: true,
      dontShowAgainLabel: "Jangan tampilkan lagi",
      tooltipClass: "customTooltip",
      prevLabel: "Kembali",
      nextLabel: "Lanjut",
      doneLabel: "Selesai",
      steps: [
        {
          title: "Tambah Topik Ujian",
          intro: "Halaman ini berfungsi untuk menambahkan topik ujian baru ke dalam tabel",
        },
        {
          element: ".main-input",
          intro: "Super Admin dapat mengisi formulir ini bila ingin menambahkan Topik Ujian",
        },
        {
          element: "#selesai",
          intro: "Apabila sudah selesai mengisi formulir dapat langsung menekan tombol selesai",
          position:"left"
        },
      ],
    });
    first_intro.start();
    $(".admin-sidebar").removeClass('selected')
    $(".topik-sidebar").addClass('selected')
    $("#complete-upload").on("click", function (e) {
      e.preventDefault();
      window.location = "/admin/tipe_ujian";
    });
    $("#selesai").on("click", () => {
      $(".submit-layer").css("visibility", "visible");
    });

    $(".ubah-button").on("click", () => {
      $(".submit-layer").css("visibility", "hidden");
    });


    // get school user_id
    let user_id = $("#user_id").text()
    let school_id
    let school_name
    $.get(`/api/v1/admins/${user_id}`, function(data) {
      school_id = data.datas.school_id
      school_name = data.datas.school_name
    })

    // UPLOAD
    const d = new Date();
    let text;
    text = d.toLocaleString("id-ID", {
      dateStyle: "medium",
    });
    const manualForm = document.getElementById("submit-form");
    manualForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = new FormData(manualForm);
      formData.append("tanggal_dibuat", text);
      formData.append("school_id", school_id)
      formData.append("school_name", school_name)
      $.ajax({
        url: "/api/v1/exam_type",
        type: "POST",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        encrypt: "multipart/form-data",
        processData: false,
        success: (response) => {
          $(".submit-layer").css("visibility", "hidden");
          if (response.status_code == 201) {
            $(".complete-layer").removeClass("hide");
            $(".complete-layer").css("visibility", "visible");
          } else if (response.message == "you're not authenticated") {
            window.location = "/login";
          }
        },
      });
    });
  });
  function initializeIntro(stepConfig) {
    const intro = introJs();
    intro.setOptions(stepConfig);
    return intro;
  }
  $('form').bind("keypress", function(e) {
        if (e.keyCode == 13) {               
            e.preventDefault();
            return false;
        }
    });