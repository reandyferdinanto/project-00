getDate()

$("#side-siswa").addClass("sidelist-selected")
  
$("#button-selesai").click(function(){ 
  $("#popup").removeClass("hidden")
});

$("#button-batal").click(function(){ 
  $("#popup").addClass("hidden")
});

$('form').bind("keypress", function(e) {
  if (e.keyCode == 13) {               
    e.preventDefault();
    return false;
  }
});

$("input[type=file]").change(function () {
  if ($(this).val()) {
    $("input:submit").attr("disabled", false);
  }
});

$("#confirm-popup button").click(function(){
  window.location = "/siswa"
})

// Fetch super admin school id and school name
let USER_ID = $("#user_id").text()
let SCHOOL_ID
let SCHOOL_NAME

$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
  SCHOOL_NAME = data.datas.school_name
})

$("#form-siswa-create").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  formData.append("school_id", SCHOOL_ID)
  formData.append("school_name", SCHOOL_NAME)

  $.ajax({
    url: "/api/v1/students",
    type: "POST",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status_code == 201) {
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
});

$("#form-siswa-upload").submit(function(e){
  e.preventDefault();
  const formData = new FormData(this);
  formData.append("school_id", SCHOOL_ID)
  formData.append("school_name", SCHOOL_NAME)

  $.ajax({
    url: "/api/v1/utils/upload",
    type: "POST",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status_code == 201) {
        $("#popup").removeClass("hidden")
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


function getDate(){
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);
}

introJs()
    .setOptions({
      dontShowAgainCookie: "siswaCreate_intro",
      dontShowAgain: true,
      dontShowAgainLabel: "Jangan tampilkan lagi",
      tooltipClass: "customTooltip",
      prevLabel: "Kembali",
      nextLabel: "Lanjut",
      doneLabel: "Selesai",
      steps: [
        {
          title: "Tambah Siswa",
          intro:"Halaman ini berfungsi untuk menambahkan siswa baru ke dalam tabel",
        },
        {
          intro:"Guru dapat menambahkan siswa melalui dua cara, yaitu melalui file ataupun manual. Bila menambahkan melalui file, guru dapat menambahkan banyak siswa sekaligus.",
        },
        {
          element: "#button-file",
          title: "Menambahkan Siswa Menggunakan File",
          intro:
            "Untuk menambahkan siswa melalui file  excel (.csv), guru dapat menekan tombol ini dan memilih file terkait.",
        },
        {
          element: "#button-upload",
          intro:"setelah selesai memilih file, tekan tombol ini untuk mengunggah data.",
          position: "left"
        },
        {
          element: "#bg-table-siswa",
          title: "Menambahkan Siswa Secara Manual",
          intro:"Guru dapat mengisi formulir ini bila ingin menambahkan satu siswa saja.",
          position: "top",
        },
        {
          element: "#button-selesai",
          intro:"Apabila sudah selesai mengisi formulir dapat langsung menekan tombol selesai",
          position: "left",
        },
      ],
    })
    .start();
