getDate()

$("#side-admin").addClass("sidelist-selected")


$("#button-selesai").click(function() {
  $("#popup").removeClass("hidden")
  $("#popup-simpan").removeClass("hidden")
});
$("#button-katasandi").click(function() {
  $("#popup").removeClass("hidden")
  $("#popup-katasandi").removeClass("hidden")
});
$("#button-batal-simpan").click(function(){
  $("#popup").addClass("hidden")
  $("#popup-simpan").addClass("hidden")
})
$("#button-batal-katasandi").click(function(){
  $("#popup").addClass("hidden")
  $("#popup-katasandi").addClass("hidden")
})
$("#button-simpan-data").click(function(){
  $("#form-admin-edit").submit()
})
$("#button-simpan-katasandi").click(function(){
  $("#form-admin-edit-katasandi").submit()
})
$('form').bind("keypress", function(e) {
  if (e.keyCode == 13) {               
      e.preventDefault();
      return false;
  }
});

// GET Admin unique Id dari URL
const ADMIN_UNIQUE_ID = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
$.get(`/api/v1/admins/${ADMIN_UNIQUE_ID}`, async (admin, status) => {
  if (admin.datas.length !== 0) {
    $("input[name=email]").val(admin.datas.email);
    $("input[name=username]").val(admin.datas.username);
    $("input[name=nuptk]").val(admin.datas.nuptk.slice(4));
    $(`input[name=gender][value='${admin.datas.gender}']`).prop("checked",true);
  }
});

$("#form-admin-edit").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  $.ajax({
    url: `/api/v1/admins/${ADMIN_UNIQUE_ID}`,
    type: "PUT",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status_code == 200) {
        window.location = "/admin"
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

$("#form-admin-edit-katasandi").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  $.ajax({
    url: `/api/v1/admins/${ADMIN_UNIQUE_ID}`,
    type: "PUT",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status_code == 200) {
        window.location = "/admin"
      }
    },
    error: function (data, status, error) {
      const ErrorMessage = `<div id="ErrorMessage" class="bg-red-500/80 fixed top-8 left-1/2 -translate-x-1/2 min-w-[400px] text-center py-1.5 rounded-lg border border-red-900 text-[#000] text-sm z-10">${status}: ${data.responseJSON.error}</div>`
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
function initializeIntro(stepConfig) {
  const intro = introJs();
  intro.setOptions(stepConfig);
  return intro;
}

let first_intro = initializeIntro({
  dontShowAgainCookie: "adminEdit_intro",
  dontShowAgain: true,
  dontShowAgainLabel: "Jangan tampilkan lagi",
  tooltipClass: "customTooltip",
  prevLabel: "Kembali",
  nextLabel: "Lanjut",
  doneLabel: "Selesai",
  steps: [
    {
      title: "Edit Admin",
      intro: "Halaman ini berfungsi untuk mengubah informasi Admin yang telah ada. Tampilan pada halaman ini mirip seperti pada saat membuat Admin baru sehingga Super Admin dapat langsung mengubah informasi yang diinginkan.",
    },
    {
      element: "#button-katasandi",
      intro: "Tombol ini berfungsi untuk mengubah kata sandi dari akun Admin yang dipilih.",
    },
  ],
});
first_intro.start();
