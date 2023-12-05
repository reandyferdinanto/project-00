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
$("#confirm-popup button").click(function(){
  window.location = "/admin"
})

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
        $("#popup-katasandi").addClass("hidden")
        $("#confirm-popup").removeClass("hidden")
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

$("#password-confirmation input").on("input", function(){
  const newPassword = $("#password2").val()
  const newPasswordConfirm = $("#password3").val()
  if(newPassword !== newPasswordConfirm){
    $("#katasandi-not-match").removeClass("hidden")
    $("#button-simpan-katasandi").prop("disabled", true)
  }else{
    $("#katasandi-not-match").addClass("hidden")
    $("#button-simpan-katasandi").prop("disabled", false)
  }
})

$(".show-password").click(function () {
  const inputId = $(this).data("input");
  const passwordInput = $(inputId);

  if (passwordInput.attr("type") === "password") {
    passwordInput.attr("type", "text");
    $(this).html(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 38 32" fill="none">
                    <path d="M31.1693 22.5L25.8359 17.1667C26.0582 16.6944 26.2248 16.2153 26.3359 15.7292C26.447 15.2431 26.5026 14.7222 26.5026 14.1667C26.5026 12.0833 25.7734 10.3125 24.3151 8.85417C22.8568 7.39583 21.0859 6.66667 19.0026 6.66667C18.447 6.66667 17.9262 6.72222 17.4401 6.83333C16.954 6.94445 16.4748 7.11111 16.0026 7.33333L11.7526 3.08333C12.8915 2.61111 14.0582 2.25694 15.2526 2.02083C16.447 1.78472 17.697 1.66667 19.0026 1.66667C22.9748 1.66667 26.5443 2.71528 29.7109 4.8125C32.8776 6.90972 35.2526 9.63889 36.8359 13C36.9193 13.1389 36.9748 13.3125 37.0026 13.5208C37.0304 13.7292 37.0443 13.9444 37.0443 14.1667C37.0443 14.3889 37.0234 14.6042 36.9818 14.8125C36.9401 15.0208 36.8915 15.1944 36.8359 15.3333C36.197 16.75 35.3984 18.0694 34.4401 19.2917C33.4818 20.5139 32.3915 21.5833 31.1693 22.5ZM30.8359 31.5L25.0026 25.75C24.0304 26.0556 23.0512 26.2847 22.0651 26.4375C21.079 26.5903 20.0582 26.6667 19.0026 26.6667C15.0304 26.6667 11.4609 25.6181 8.29427 23.5208C5.1276 21.4236 2.7526 18.6944 1.16927 15.3333C1.08594 15.1944 1.03038 15.0208 1.0026 14.8125C0.974826 14.6042 0.960938 14.3889 0.960938 14.1667C0.960938 13.9444 0.974826 13.7361 1.0026 13.5417C1.03038 13.3472 1.08594 13.1806 1.16927 13.0417C1.7526 11.7917 2.44705 10.6389 3.2526 9.58333C4.05816 8.52778 4.94705 7.55556 5.91927 6.66667L2.46094 3.16667C2.15538 2.86111 2.0026 2.47917 2.0026 2.02083C2.0026 1.5625 2.16927 1.16667 2.5026 0.833333C2.80816 0.527778 3.19705 0.375 3.66927 0.375C4.14149 0.375 4.53038 0.527778 4.83594 0.833333L33.1693 29.1667C33.4748 29.4722 33.6345 29.8542 33.6484 30.3125C33.6623 30.7708 33.5026 31.1667 33.1693 31.5C32.8637 31.8056 32.4748 31.9583 32.0026 31.9583C31.5304 31.9583 31.1415 31.8056 30.8359 31.5ZM19.0026 21.6667C19.3082 21.6667 19.5929 21.6528 19.8568 21.625C20.1207 21.5972 20.4054 21.5417 20.7109 21.4583L11.7109 12.4583C11.6276 12.7639 11.572 13.0486 11.5443 13.3125C11.5165 13.5764 11.5026 13.8611 11.5026 14.1667C11.5026 16.25 12.2318 18.0208 13.6901 19.4792C15.1484 20.9375 16.9193 21.6667 19.0026 21.6667ZM23.4193 14.75L18.4193 9.75C20.0026 9.5 21.2943 9.94445 22.2943 11.0833C23.2943 12.2222 23.6693 13.4444 23.4193 14.75Z" fill="#358F6C"/>
                  </svg>`);
  } else {
    passwordInput.attr("type", "password");
    $(this).html(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <path d="M20 26.6665C22.0833 26.6665 23.8542 25.9373 25.3125 24.479C26.7708 23.0207 27.5 21.2498 27.5 19.1665C27.5 17.0832 26.7708 15.3123 25.3125 13.854C23.8542 12.3957 22.0833 11.6665 20 11.6665C17.9167 11.6665 16.1458 12.3957 14.6875 13.854C13.2292 15.3123 12.5 17.0832 12.5 19.1665C12.5 21.2498 13.2292 23.0207 14.6875 24.479C16.1458 25.9373 17.9167 26.6665 20 26.6665ZM20 23.6665C18.75 23.6665 17.6875 23.229 16.8125 22.354C15.9375 21.479 15.5 20.4165 15.5 19.1665C15.5 17.9165 15.9375 16.854 16.8125 15.979C17.6875 15.104 18.75 14.6665 20 14.6665C21.25 14.6665 22.3125 15.104 23.1875 15.979C24.0625 16.854 24.5 17.9165 24.5 19.1665C24.5 20.4165 24.0625 21.479 23.1875 22.354C22.3125 23.229 21.25 23.6665 20 23.6665ZM20 31.6665C16.2778 31.6665 12.8819 30.6665 9.8125 28.6665C6.74306 26.6665 4.31944 24.0276 2.54167 20.7498C2.40278 20.4998 2.29861 20.2429 2.22917 19.979C2.15972 19.7151 2.125 19.4443 2.125 19.1665C2.125 18.8887 2.15972 18.6179 2.22917 18.354C2.29861 18.0901 2.40278 17.8332 2.54167 17.5832C4.31944 14.3054 6.74306 11.6665 9.8125 9.6665C12.8819 7.6665 16.2778 6.6665 20 6.6665C23.7222 6.6665 27.1181 7.6665 30.1875 9.6665C33.2569 11.6665 35.6806 14.3054 37.4583 17.5832C37.5972 17.8332 37.7014 18.0901 37.7708 18.354C37.8403 18.6179 37.875 18.8887 37.875 19.1665C37.875 19.4443 37.8403 19.7151 37.7708 19.979C37.7014 20.2429 37.5972 20.4998 37.4583 20.7498C35.6806 24.0276 33.2569 26.6665 30.1875 28.6665C27.1181 30.6665 23.7222 31.6665 20 31.6665Z" fill="#358F6C"/>
                  </svg>`);
  }
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
