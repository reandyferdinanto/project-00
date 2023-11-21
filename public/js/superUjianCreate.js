$("#date").text(getDate())

$("#side-topik").addClass("sidelist-selected")
  
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


    // get school user_id
let USER_ID = $("#user_id").text()
let SCHOOL_ID
let SCHOOL_NAME

$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
  SCHOOL_NAME = data.datas.school_name
})

$("#form-topik-create").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  formData.append("tanggal_dibuat", getDate());
  formData.append("school_id", SCHOOL_ID)
  formData.append("school_name", SCHOOL_NAME)

  $.ajax({
    url: "/api/v1/topic",
    type: "POST",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status_code == 201) {
        window.location = "/topik"
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


function initializeIntro(stepConfig) {
  const intro = introJs();
  intro.setOptions(stepConfig);
  return intro;
}

function getDate(){
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  return text
}
function initializeIntro(stepConfig) {
  const intro = introJs();
  intro.setOptions(stepConfig);
  return intro;
}

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
      element: "#bg-table-topik",
      intro: "Super Admin dapat mengisi formulir ini bila ingin menambahkan Topik Ujian",
    },
    {
      element: "#button-selesai",
      intro: "Apabila sudah selesai mengisi formulir dapat langsung menekan tombol selesai",
      position:"left"
    },
  ],
});
first_intro.start();