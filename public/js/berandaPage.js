$(document).ready(() => {

  getDate()

  $("#side-beranda").addClass("sidelist-selected")

  const BerandaIntro = initializeIntro({
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
        element: "#card-exam",
        intro:
          "Guru dapat mengakses ujian yang telah ada dengan menekan bagian ini",
      },
      {
        element: "#beranda-tambah-ujian",
        intro:
          "Guru dapat menambahkan ujian baru lebih cepat dengan menekan bagian ini",
      },
      {
        element: "#button-logout",
        intro:
          "Tombol ini berfungsi bila ingin keluar dari halaman Muslim Maya",
        position:"left"
      },
    ],
  })

  $.get(`/api/v1/exams`, async (data, status) => {
    if (status == "success") {
      data.datas.forEach((exam) => {
        $(addCard(exam)).insertBefore(`#beranda-tambah-ujian`)
      });
      BerandaIntro.start()
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
  function addCard(exam){
    return `
    <a id="card-exam" href="/ujian/edit/${exam.unique_id}" class="hover:-translate-y-1 duration-200 cursor-pointer shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] rounded-lg border border-main flex justify-center items-center flex-col h-[200px]">
      <p class="text-main text-base">${exam.exam_name}</p>
      <p class="text-main text-sm font-bold">(Edit)</p>
    </a>
    `
  }
  function initializeIntro(stepConfig) {
    const intro = introJs();
    intro.setOptions(stepConfig);
    return intro;
  }
});
