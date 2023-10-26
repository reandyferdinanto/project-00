$(document).ready(() => {
  
  $(".siswaSidebar").addClass('selected')
  $('form').bind("keypress", function(e) {
      if (e.keyCode == 13) {               
          e.preventDefault();
          return false;
      }
  });
  
  introJs()
    .setOptions({
      dontShowAgainLabel: "Jangan tampilkan lagi",
      tooltipClass: "customTooltip",
      prevLabel: "Kembali",
      nextLabel: "Lanjut",
      dontShowAgainCookie: "siswaEdit_intro",
      dontShowAgain: true,
      doneLabel: "Selesai",
      steps: [
        {
          title: "Edit Siswa",
          intro:
            "Halaman ini berfungsi untuk mengubah informasi siswa yang telah ada. Tampilan pada halaman ini mirip seperti pada saat membuat siswa baru secara manual sehingga guru dapat langsung mengubah informasi yang diinginkan.",
        },
        {
          element: document.querySelector(".exams-assign"),
          intro:
            "Pada halaman ini, akan muncul ujian yang telah dibuat. Guru dapat mengubah informasi ujian mana yang akan diikuti oleh siswa dengan menekan tombol di sebelah nama ujian yang ada.",
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

  // GET URL
  let unique_id = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );
  let url_input = `/api/v1/students/${unique_id}`;
  let url_ujian = `/api/v1/exams`;
  let user_data;
  // SET INPUT
  $.get(url_input, async (data, status) => {
    let datas = data.datas;
    user_data = data.datas;
    if (status == "success" && datas.length !== 0) {
      $("#nis").val(datas.nis);
      $("#username").val(datas.username);
      $("#class").val(datas.class);
      $("#major").val(datas.major);
      $(`input[name=gender][value='${datas.gender}']`).prop("checked",true);
      if (datas.Exams) {
        datas.Exams.forEach((exam) => {
          $(".exams-assign").on("click", `#${exam.exam_name}`, function () {});
        });
      }
    }
  });
  // SET UJIAN
  $.get(url_ujian, async (data, status) => {
    let datas = data.datas;
    if (status == "success" && datas.length !== 0) {
      $(".exams-assign").html("");
      datas.forEach((data, index) => {
        $(".exams-assign").append([
          `
              <div class="exam-assign">
                <span for="${data.exam_name}">${data.exam_name}</span>
                <input type="checkbox" name="${data.unique_id}" id="${data.unique_id}" />
              </div>`,
        ]);
        $(".exams-assign").on("change", "#" + data.unique_id, function () {
          if (!$("#" + data.unique_id).is(":checked")) {
            $(this).html(
              `<input type="hidden" name="${data.unique_id}" id="${data.unique_id}" value="off" />`
            );
          } else {
            $("#" + data.unique_id).val("on");
          }
        });
        // CHEKED
      });
      user_data.Exams.forEach((user_exam) => {
        if (datas.find((e) => e.exam_name == user_exam.exam_name)) {
          $(`#${user_exam.unique_id}`).prop("checked", true);
        }
      });
    }
  });

  $("#complete-upload").on("click", function (e) {
    e.preventDefault();
    window.location = "/siswa";
  });

  // SUBMIT
  const manualForm = document.getElementById("submit-form");
  manualForm.addEventListener("submit", (e) => {
    let formData = new FormData(manualForm);
    formData.append("unique_id", unique_id);
    e.preventDefault();
    $.ajax({
      url: "/api/v1/students/edit",
      type: "POST",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        $(".submit-layer").css("visibility", "hidden");
        if (response.status_code == 200) {
          $(".complete-layer").removeClass("hide");
          $(".complete-layer").css("visibility", "visible");
        } else if (response.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });
});
