$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  const url = "/api/exams";

  $.get(url, async (data, status) => {
    if (status == "success" && data.payload.datas.length !== 0) {
      $("#siswa-table").DataTable({
        ajax: {
          url: "/api/exams",
          dataSrc: function (response) {
            console.log(response.payload.datas);
            return response.payload.datas;
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
          { data: "username" },
          {
            data: "unique_id",
            render: function (data, type) {
              return `<a href="/admin/edit/${data}" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
            },
          },
          {
            data: "unique_id",
            render: function (data, type) {
              return `<input type="checkbox" name="checkedSiswa" class="checkbox-delete" value="${data}" />`;
            },
          },
        ],
        initComplete: function () {
          setTimeout(() => {
            console.log("complete");
          }, 500);
        },
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
