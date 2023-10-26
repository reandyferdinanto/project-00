
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
          title: "Edit Topik Ujian",
          intro: "Halaman ini berfungsi untuk mengubah Topik Ujian yang telah ada.",
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

    // UPLOAD
    const manualForm = document.getElementById("submit-form");
    manualForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = new FormData(manualForm);
      formData.append("unique_id", unique_id);
      $.ajax({
        url: "/api/exam_type",
        type: "PUT",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        encrypt: "multipart/form-data",
        processData: false,
        success: (response) => {
          $(".submit-layer").css("visibility", "hidden");
          if (response.payload.status_code == 200) {
            $(".complete-layer").removeClass("hide");
            $(".complete-layer").css("visibility", "visible");
          } else if (response.payload.message == "you're not authenticated") {
            window.location = "/login";
          }
        },
      });
    });
    let unique_id = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    
    let url = `/api/exam_type/${unique_id}`;
    $.get(url, async (data, status) => {
      let datas = data.payload.datas;
      if (status == "success" && datas.length !== 0) {
        $("#exam_type").val(datas.exam_type);
      }
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