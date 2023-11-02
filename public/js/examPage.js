getDate()

const USER_ID = $("#user_id").text()
let SCHOOL_ID
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
})


$("#button-delete").click(function(){
  $("#popup").removeClass("hidden")
})
$("#button-batal").click(function(){
  $("#popup").addClass("hidden")
})
$("#selectAll").on("click", function () {
  if (this.checked) {
    // Iterate each checkbox
    $("#button-delete").attr("disabled", false);
    $(":checkbox").each(function () {
      this.checked = true;
    });
  } else {
    $("#button-delete").attr("disabled", true);
    $(":checkbox").each(function () {
      this.checked = false;
    });
  }
});
$("#bg-table-topik").on("click", ".checkbox-delete", function () {
  const anyChecked = $(".checkbox-delete:checked").length > 0;
  $("#button-delete").attr("disabled", !anyChecked);
  if(!anyChecked) $("#selectAll").prop('checked', false)
});


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
          render: function (data, type) {
            return `<a href="/ujian/edit/${data}" title="edit data" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
          },
        },
        {
          data: "unique_id",
          render: function (data, type) {
            return `<a class="ujian-link"><i class="uil uil-presentation-play"></i></a>`;
          },
        },
      ],
      // initComplete: function () {
      //   setTimeout(() => {
      //     introJs()
      //       .setOptions({
      //         dontShowAgainCookie: "examPage_intro",
      //         dontShowAgain: true,
      //         dontShowAgainLabel: "Jangan tampilkan lagi",
      //         tooltipClass: "customTooltip",
      //         prevLabel: "Kembali",
      //         nextLabel: "Lanjut",
      //         doneLabel: "Selesai",
      //         steps: [
      //           {
      //             title: "Ujian",
      //             intro:
      //               "Halaman ini berisi seputar ujian. Guru dapat melihat ujian yang telah dibuat, mengubah ujian, maupun membuat ujian baru.",
      //           },
      //           {
      //             element: "#siswa-table_length",
      //             intro:
      //               "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah ujian yang ingin ditampilkan pada tabel",
      //           },
      //           {
      //             element: "#siswa-table_filter",
      //             intro:
      //               "Guru dapat mencari ujian dengan mengetik nama ujian pada kotak ini",
      //           },
      //           {
      //             element: ".edit-siswa",
      //             intro:
      //               "Guru dapat mengubah ujian yang telah ada dengan menekan tombol ini",
      //           },
      //           {
      //             element: ".buat-ujian-baru",
      //             intro:
      //               "Guru dapat menambahkan ujian baru dengan menekan tombol ini.",
      //             position: "left",
      //           },
      //         ],
      //       })
      //       .start();
      //   }, 500);
      // },
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
