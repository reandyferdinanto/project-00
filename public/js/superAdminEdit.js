$(document).ready(() => {
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
  let url_input = `/api/v1/admins/${unique_id}`;
  // SET INPUT
  $.get(url_input, async (data, status) => {
    let datas = data.datas;
    if (status == "success" && datas.length !== 0) {
      $("#email").val(datas.email);
      $("#username").val(datas.username);
      $("#nuptk").val(datas.nuptk);
      $(`input[name=gender][value='${datas.gender}']`).prop("checked",true);
    }
  });
  // SET UJIAN

  $("#complete-upload").on("click", function (e) {
    e.preventDefault();
    window.location = "/admin";
  });

  // SUBMIT
  const manualForm = document.getElementById("submit-form");
  manualForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(manualForm);
    formData.append("unique_id", unique_id);
    $.ajax({
      url: "/api/v1/admins",
      type: "PUT",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        if (response.status_code == 200) {
          $(".complete-layer").removeClass("hide");
          $(".complete-layer").css("visibility", "visible");
        } else if (response.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });





  
  let introTampil = false
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
        element: ".ubah-katasandi",
        intro: "Tombol ini berfungsi untuk mengubah kata sandi dari akun Admin yang dipilih.",
      },
    ],
  });
  first_intro.start();
  $(".adminSidebar").addClass('selected')
  $(".ubah-katasandi").click(function () {
    $(".ubah-katasandi-layer").css("visibility", "visible");
    if(!introTampil){
      first_intro.exit()
      let password_intro = initializeIntro({
      dontShowAgainCookie: "adminEdit_intro",
      dontShowAgain: true,
      dontShowAgainLabel: "Jangan tampilkan lagi",
      tooltipClass: "customTooltip",
      prevLabel: "Kembali",
      nextLabel: "Lanjut",
      doneLabel: "Selesai",
      steps: [
        {
          element: ".ubah-katasandi-bg",
          intro: "Masukkan kata sandi sebelumnya dan kata sandi baru di sini",
        },
        {
          element: ".submit",
          intro: "Tekan tomboh ini untuk menyimpan kata sandi baru",
          position: "right"
        },
      ],
    });
      password_intro.start();
      introTampil = true
    }
  });
  $(".ubah").click(function () {
    $(".ubah-katasandi-layer").css("visibility", "hidden");
  });

  // CONFIRM
  let password = document.getElementById("password"),
    confirm_password = document.getElementById("confirm_password");

  function validatePassword() {
    if (password.value != confirm_password.value) {
      confirm_password.setCustomValidity("Password Tidak Sama");
    } else {
      confirm_password.setCustomValidity("");
    }
  }

  password.onchange = validatePassword;
  confirm_password.onkeyup = validatePassword;

  let password_from = document.getElementById("password-from");
  password_from.addEventListener("submit", function (e) {
    e.preventDefault();
    let formData = new FormData(password_from);
    formData.append("unique_id", unique_id);
    $.ajax({
      url: "/api/admin/password",
      type: "PUT",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        if (response.payload.status_code == 200) {
          $(".complete-layer").removeClass("hide");
          $(".complete-layer").css("visibility", "visible");
        }
      },
      error: (response) => {
        alert(response.responseJSON.payload.message);
      },
    });
  });
  $('form').bind("keypress", function(e) {
        if (e.keyCode == 13) {               
            e.preventDefault();
            return false;
        }
    });

});
