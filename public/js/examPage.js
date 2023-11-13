getDate()

$("#side-ujian").addClass("sidelist-selected")

const USER_ID = $("#user_id").text()
let SCHOOL_ID
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
})


$.get("/api/v1/exams", async (data) => {
  if (data.datas.length !== 0) {
    $("#bg-nothing").remove()
    $("#table-ujian").removeClass("hidden")
    $("#table-ujian").DataTable({
      ajax: {
        url: "/api/v1/exams",
        dataSrc: function(json){
          let filteredData = json.datas.filter(function (data) {
            return data.school_id === SCHOOL_ID;
          });
          return filteredData;
        },
      },
      pageLength: 20,
      lengthMenu: [
        [20, 50, 100, 200, -1],
        [20, 50, 100, 200, "Semua"],
      ],
      columns: [
        {
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
        },
        { data: "exam_name" },
        {
          data: "exam_type",
          render: function (data, type) {
            return data.charAt(0).toUpperCase() + data.slice(1);
          },
        },
        { data: "kkm_point" },
        {
          data: "unique_id",
          width:"5%",
          render: function (data, type) {
            return `<a href="/ujian/edit/${data}" title="edit data" class="edit-siswa text-main"><i class="uil uil-edit"></i></a>`;
          },
        },
        {
          data: "unique_id",
          width:"5%",
          render: function (data, type) {
            return `<a class="ujian-link"><i class="uil uil-presentation-play text-main"></i></a>`;
          },
        },
      ],
      initComplete: function () {
        setTimeout(() => {
          introJs()
            .setOptions({
              dontShowAgainCookie: "examPage_intro",
              dontShowAgain: true,
              dontShowAgainLabel: "Jangan tampilkan lagi",
              tooltipClass: "customTooltip",
              prevLabel: "Kembali",
              nextLabel: "Lanjut",
              doneLabel: "Selesai",
              steps: [
                {
                  title: "Ujian",
                  intro:
                    "Halaman ini berisi seputar ujian. Guru dapat melihat ujian yang telah dibuat, mengubah ujian, maupun membuat ujian baru.",
                },
                {
                  element: "#table-ujian_length",
                  intro:
                    "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah ujian yang ingin ditampilkan pada tabel",
                },
                {
                  element: "#table-ujian_filter",
                  intro:
                    "Guru dapat mencari ujian dengan mengetik nama ujian pada kotak ini",
                },
                {
                  element: ".edit-siswa",
                  intro:
                    "Guru dapat mengubah ujian yang telah ada dengan menekan tombol ini",
                },
                {
                  element: "#button-tambah",
                  intro:
                    "Guru dapat menambahkan ujian baru dengan menekan tombol ini.",
                  position: "left",
                },
              ],
            })
            .start();
        }, 500);
      },
    });
  }
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
