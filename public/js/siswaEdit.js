getDate()

$("#side-siswa").addClass("sidelist-selected")

$('form').bind("keypress", function(e) {
    if (e.keyCode == 13) {               
        e.preventDefault();
        return false;
    }
});

$("#button-selesai").on("click", () => {
  $("#popup").removeClass("hidden")
});
$("#button-batal").on("click", () => {
  $("#popup").addClass("hidden")
});

// GET Admin unique Id dari URL
const SISWA_UNIQUE_ID = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
let user_data;

// Assign data yang sudah diisi
$.get(`/api/v1/students/${SISWA_UNIQUE_ID}`, async (students) => {
  user_data = students.datas;
  if (students.datas) {
    $("input[name=nis]").val(students.datas.nis.slice(4));
    $("input[name=username]").val(students.datas.username);
    $("input[name=class]").val(students.datas.class);
    $("input[name=major]").val(students.datas.major);
    $(`input[name=gender][value='${students.datas.gender}']`).prop("checked",true);
  }
});


  // SET UJIAN
$.get(`/api/v1/exams`, async (exams, status) => {
  if (exams.datas.length !== 0) {
    $("#siswa-daftar-ujian").html("");
    exams.datas.forEach((data, index) => {
      $("#siswa-daftar-ujian").append(
        `
          <div class="flex items-center justify-between px-4 border-0 bg-main rounded-lg">
            <label for="${data.unique_id}" class="w-full py-4 ml-2 text-sm font-medium text-white">${data.exam_name}</label>
            <input id="${data.unique_id}" type="checkbox" value="" name="${data.unique_id}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
          </div>
        `,
      );
      $("#siswa-daftar-ujian").on("change", `#${data.unique_id}`, function () {
        if (!$(`#${data.unique_id}`).is(":checked")) {
          $(this).html(
            `<input type="hidden" name="${data.unique_id}" id="${data.unique_id}" value="off" />`
          );
        } else {
          $(`#${data.unique_id}`).val("on");
        }
      });
    });
    user_data.Exams.forEach((user_exam) => {
      if (datas.find((e) => e.exam_name == user_exam.exam_name)) {
        $(`#${user_exam.unique_id}`).prop("checked", true);
      }
    });
  }
});

// SUBMIT
$("#form-siswa-edit").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  formData.append("unique_id", SISWA_UNIQUE_ID);

  $.ajax({
    url: "/api/v1/students/edit",
    type: "POST",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status_code == 200) {
        window.location = "/siswa"
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
});

function getDate(){
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);
}