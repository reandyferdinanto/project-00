getDate()

$("#side-topik").addClass('sidelist-selected')

$("#button-selesai").on("click", () => {
  $("#popup").removeClass("hidden")
});
$("#button-batal").on("click", () => {
  $("#popup").addClass("hidden")
});
$("#confirm-popup button").click(function(){
  window.location = "/topik"
})

// GET Admin unique Id dari URL
let TOPIK_UNIQUE_ID = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);

$.get(`/api/v1/topic/${TOPIK_UNIQUE_ID}`, async (topik) => {
  if (topik.datas) {
    $("input[name=exam_type]").val(topik.datas.exam_type);
  }
});

$("#form-topik-edit").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  $.ajax({
    url: `/api/v1/topic/${TOPIK_UNIQUE_ID}`,
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
