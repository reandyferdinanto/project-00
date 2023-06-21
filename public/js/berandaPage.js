$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);
  setTimeout(() => {
    introJs()
      .setOptions({
        // buttonClass: "button-intro",
        // disableInteraction: true,
        // overlayOpacity: 1,
        // showStepNumbers: true,
        dontShowAgainLabel: "Jangan tampilkan lagi",
        tooltipClass: "customTooltip",
        prevLabel: "Kembali",
        nextLabel: "Lanjut",
        doneLabel: "Selesai",
        dontShowAgainCookie: "berandaPage_intro",
        dontShowAgain: true,
        steps: [
          {
            title: "Beranda",
            intro:
              "Halaman ini berisi mengenai ujian terbaru yang dibuat dan juga fitur cepat untuk menambahkan ujian.",
          },
          {
            element: ".ujian",
            intro:
              "Guru dapat mengakses ujian yang telah ada dengan menekan bagian ini",
          },
          {
            element: ".tambah-ujian-baru",
            intro:
              "Guru dapat menambahkan ujian baru lebih cepat dengan menekan bagian ini",
          },
          {
            element: ".keluar-button",
            intro:
              "Tombol ini berfungsi bila ingin keluar dari halaman Muslim Maya",
          },
        ],
      })
      .start();
  }, 1000);

  const url = "/api/exams";
  let datas;
  $.get(url, async (data, status) => {
    if (status == "success") {
      $(".main-table-body").html("");
      $(".main-table-body").css({
        "text-align": "left",
        // padding: "0.5rem 2rem",
        margin: ".5rem 2rem",
      });
      datas = data.payload.datas;
      datas.map((data, index) => {
        $(".main-home").prepend([
          `
              <a href="/ujian/edit/${data.unique_id}" class="tambah-ujian">
                <div class="ujian">
                  <p>Ujian</p>
                  <p><b>${data.exam_name}</b></p>
                </div>
              </a>
              `,
        ]);
      });
    }
  });
});
