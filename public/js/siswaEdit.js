getDate()
  
let unique_id = window.location.href.substring(
  window.location.href.lastIndexOf("/") + 1
);


$("#side-siswa").addClass('sidelist-selected')

$('form').bind("keypress", function(e) {
    if (e.keyCode == 13) {               
        e.preventDefault();
        return false;
    }
});

$("#button-selesai").click(function(){ 
  $("#popup").removeClass("hidden")
});

$("#button-batal").click(function(){ 
  $("#popup").addClass("hidden")
});

$("#confirm-popup button").click(function(){
  window.location = "/siswa"
})


// GET URL
let user_data;

// SET INPUT
$.get(`/api/v1/students/${unique_id}`, async (data, status) => {
  let datas = data.datas;
  user_data = data.datas;
  if (status == "success" && datas.length !== 0) {
    $("input[name=nis]").val(datas.nis.slice(4));
    $("input[name=username]").val(datas.username);
    $("input[name=class]").val(datas.class);
    $("input[name=major]").val(datas.major);
    $(`input[name=gender][value='${datas.gender}']`).prop("checked",true);

    if (datas.Exams) {
      datas.Exams.forEach((exam) => {
        $("#exams-assign").on("click", `#${exam.exam_name}`, function () {});
      });
    }
  }
});


// SET UJIAN
$.get(`/api/v1/exams`, async (data, status) => {
  let datas = data.datas;
  if (status == "success" && datas.length !== 0) {
    $("#exams-assign").html("");
    datas.forEach((data, index) => {
      $("#exams-assign").append([
        `
        <div class="exam-assign flex items-center justify-between bg-main text-white rounded-lg px-4 py-2.5">
          <span for="${data.exam_name}">${data.exam_name}</span>
          <input type="checkbox" name="${data.unique_id}" id="${data.unique_id}" />
        </div>
        `,
      ]);

      $("#exams-assign").on("change", "#" + data.unique_id, function () {
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

$("#form-siswa-edit").submit(function(e){
  e.preventDefault();
  const formData = new FormData(this);

  $.ajax({
    url: `/api/v1/students/${unique_id}`,
    type: "PUT",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status_code == 200) {
        $(".delete-popup").addClass("hidden")
        $("#confirm-popup").removeClass("hidden")
      }
    },
    error: function (data, status, error) {
      const ErrorMessage = `<div id="ErrorMessage" class="bg-red-500/80 fixed top-8 left-1/2 -translate-x-1/2 min-w-[400px] text-center py-1.5 rounded-lg border border-red-900 text-[#000] text-sm z-10">${status}: ${data.responseJSON.datas.error}</div>`
      $("body").prepend(ErrorMessage)
      $("#ErrorMessage")
        .delay(3000)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    },
  });
})

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
      element: document.querySelector("#exams-assign"),
      intro:
        "Pada halaman ini, akan muncul ujian yang telah dibuat. Guru dapat mengubah informasi ujian mana yang akan diikuti oleh siswa dengan menekan tombol di sebelah nama ujian yang ada.",
    },
  ],
})
.start();

function getDate(){
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);
}