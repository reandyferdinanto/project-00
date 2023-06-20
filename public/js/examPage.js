$(document).ready(() => {
  setTimeout(() => {
    introJs()
      .setOptions({
        dontShowAgainCookie: "examPage_intro",
        dontShowAgain: true,
        steps: [
          {
            title: "Ujian",
            intro:
              "Halaman ini berisi seputar ujian. Guru dapat melihat ujian yang telah dibuat, mengubah ujian, maupun membuat ujian baru.",
          },
          {
            element: "#siswa-table_length",
            intro:
              "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah ujian yang ingin ditampilkan pada tabel",
          },
          {
            element: "#siswa-table_filter",
            intro:
              "Guru dapat mencari ujian dengan mengetik nama ujian pada kotak ini",
          },
          {
            element: ".edit-siswa",
            intro:
              "Guru dapat mengubah ujian yang telah ada dengan menekan tombol ini",
          },
          {
            element: ".buat-ujian-baru",
            intro:
              "Guru dapat menambahkan ujian baru dengan menekan tombol ini.",
            position: "left",
          },
        ],
      })
      .start();
  }, 1000);

  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  const url = "/api/exams";
  let datas;

  $.get(url, async (data, status) => {
    if (status == "success" && data.payload.datas.length !== 0) {
      $("#siswa-table").DataTable({
        ajax: {
          url: "/api/exams",
          dataSrc: "payload.datas",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            },
          },
          { data: "exam_name" },
          { data: "exam_type" },
          { data: "kkm_point" },
          { data: "available_try" },
          {
            data: "unique_id",
            render: function (data, type) {
              return `<a href="/ujian/edit/${data}" title="edit data" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
            },
          },
          {
            data: "unique_id",
            render: function (data, type) {
              return `<a class="ujian-link" href="#" title="preview"><i class="uil uil-presentation-play"></i></a>`;
            },
          },
        ],
      });
      $("hr").remove();
    } else {
      $(".main-table-body").append([
        `
                <img src="/img/nothing.png" alt="" />
                <p>Belum ada ujian</p>
              `,
      ]);
    }
  });
});
