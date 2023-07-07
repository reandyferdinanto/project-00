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
          url: "/api/exam_type",
          dataSrc: function (response) {
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
            width: "10%",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            },
          },
          { data: "exam_type" },
          { data: "tanggal_dibuat" },
          {
            data: "unique_id",
            width: "5%",
            render: function (data, type) {
              return `<a href="/tipe_ujian/edit/${data}" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
            },
          },
          {
            data: "unique_id",
            width: "5%",
            render: function (data, type) {
              return `<input type="checkbox" name="checkedExamType" class="checkbox-delete" value="${data}" />`;
            },
          },
        ],
        initComplete: function () {
          // setTimeout(() => {
          //   console.log("complete");
          // }, 500);
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
  $("#selectAll").on("click", function () {
    if ($(this).is(":checked")) {
      $(".hapus-button").attr("disabled", false);
      $(".checkbox-delete").attr("checked", true);
    } else {
      $(".hapus-button").attr("disabled", true);
      $(".checkbox-delete").attr("checked", false);
    }
  });
  $(".main-table-title").on("click", ".checkbox-delete", function () {
    if ($(this).is(":checked")) {
      $(".hapus-button").attr("disabled", false);
    } else {
      $(".hapus-button").attr("disabled", true);
    }
  });
  const formDelete = document.getElementById("form-delete");
  $(".hapus-button").on("click", (e) => {
    e.preventDefault();
    $(".submit-layer").css("visibility", "visible");
    $(".selesai-button").on("click", (e) => {
      e.preventDefault();
      let formData = new FormData(formDelete);
      $.ajax({
        url: "/api/exam_type",
        type: "DELETE",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        encrypt: "multipart/form-data",
        processData: false,
        success: (response) => {
          if (response !== undefined) {
            window.location = "/tipe_ujian";
          }
        },
      });
    });
  });
});
