getDate()

$("#side-admin").addClass("sidelist-selected")
let first_intro = initializeIntro({
  dontShowAgainCookie: "adminCreate_intro",
  dontShowAgain: true,
  dontShowAgainLabel: "Jangan tampilkan lagi",
  tooltipClass: "customTooltip",
  prevLabel: "Kembali",
  nextLabel: "Lanjut",
  doneLabel: "Selesai",
  steps: [
      {
      title: "Tambah Admin",
      intro: "Halaman ini berfungsi untuk menambahkan Admin baru ke dalam tabel",
    },
    {
        element: "#bg-table-admin",
        intro: "Super Admin dapat mengisi formulir ini bila ingin menambahkan Admin",
      },
      {
          element: "#button-selesai",
          intro: "Apabila sudah selesai mengisi formulir dapat langsung menekan tombol selesai",
          position: "left"
        },
      ],
    });
    first_intro.start();

      
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

$("#confirm-popup button").click(function(){
  window.location = "/admin"
})
      
      
// Fetch super admin school id and school name
let USER_ID = $("#user_id").text()
let SCHOOL_ID
let SCHOOL_NAME
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
  SCHOOL_NAME = data.datas.school_name
})

$("#form-admin-create").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  formData.append("role", "admin");
  formData.append("school_id", SCHOOL_ID)
  formData.append("school_name", SCHOOL_NAME)

  $.ajax({
    url: "/api/v1/admins/register",
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
  $("#date").html(text);
}
  
