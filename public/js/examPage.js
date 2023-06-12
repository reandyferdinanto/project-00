$(document).ready(() => {
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
              return `<a class="ujian-link" href="/ujian/edit/${data}" title="edit data" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
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
