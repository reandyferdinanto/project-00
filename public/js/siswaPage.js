$(document).ready(() => {
  // TIME
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  // DATA SISWA

  const url = "/api/scores";
  let datas;
  $.get(url, async (data, status) => {
    if (status == "success" && data.payload.datas.length !== 0) {
      $("#siswa-table").DataTable({
        ajax: {
          url: "/api/scores",
          dataSrc: "payload.datas",
        },
        columns: [
          {
            data: null,
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            },
          },
          { data: "nis" },
          { data: "username" },
          { data: "class" },
          { data: "major" },
          {
            data: "unique_id",
            render: function (data, type) {
              return `<a href="/siswa/edit/${data}" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
            },
          },
          {
            data: "unique_id",
            render: function (data, type) {
              return `<input type="checkbox" name="checkedSiswa" id="" class="checkbox-delete" value="${data}" />`;
            },
          },
        ],
      });
    } else {
      $(".main-table-body").append([
        `
              <img src="/img/nothing.png" alt="" />
              <p>Belum ada siswa</p>
            `,
      ]);
    }

    // GET CHECKED

    const formDelete = document.getElementById("form-delete");
    $(".hapus-button").on("click", (e) => {
      e.preventDefault();
      $(".submit-layer").css("visibility", "visible");
      $(".selesai-button").on("click", (e) => {
        e.preventDefault();
        let formData = new FormData(formDelete);
        $.ajax({
          url: "/api/scores",
          type: "DELETE",
          data: formData,
          async: false,
          cache: false,
          contentType: false,
          encrypt: "multipart/form-data",
          processData: false,
          success: (response) => {
            if (response !== undefined) {
              window.location = "/siswa";
            }
          },
        });
      });
    });
    $(".ubah-button").on("click", () => {
      $(".submit-layer").css("visibility", "hidden");
    });
    $("#selectAll").on("click", function () {
      if ($(this).is(":checked")) {
        $(".checkbox-delete").attr("checked", true);
      } else {
        $(".checkbox-delete").attr("checked", false);
      }
    });
  });
});
