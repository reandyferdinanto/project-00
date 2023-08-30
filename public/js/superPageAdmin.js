$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  const url = "/api/admin";

  $.get(url, async (data, status) => {
    if (status == "success" && data.payload.datas.length !== 0) {
      $("#siswa-table").DataTable({
        ajax: {
          url: "/api/admin",
          dataSrc: function (response) {
            return response.payload.datas.filter((e) => {
              return e.role == "admin";
            });
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
          { data: "username", width: "30%" },
          { data: "email", width: "50%" },
          {
            data: "unique_id",
            render: function (data, type) {
              return `<a href="/admin/edit/${data}" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
            },
          },
          {
            data: "unique_id",
            render: function (data, type) {
              return `<input type="checkbox" name="checkedAdmin" class="checkbox-delete" value="${data}" />`;
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
                  <p>Belum ada admin</p>
                `,
      ]);
    }
  });
  
  $(".ubah-button").on("click", () => {
    $(".submit-layer").css("visibility", "hidden");
  });
  $("#selectAll").on("click", function () {
    if (this.checked) {
      // Iterate each checkbox
      $(".hapus-button").attr("disabled", false);
      $(":checkbox").each(function () {
        this.checked = true;
      });
    } else {
      $(".hapus-button").attr("disabled", true);
      $(":checkbox").each(function () {
        this.checked = false;
      });
    }
  });
  $(".main-table-title").on("click", ".checkbox-delete", function () {
    const anyChecked = $(".checkbox-delete:checked").length > 0;
    $(".hapus-button").attr("disabled", !anyChecked);
    if(!anyChecked) $("#selectAll").prop('checked', false)
  });
  const formDelete = document.getElementById("form-delete");
  $(".hapus-button").on("click", (e) => {
    e.preventDefault();
    $(".submit-layer").css("visibility", "visible");
    $(".selesai-button").on("click", (e) => {
      e.preventDefault();
      let formData = new FormData(formDelete);
      $.ajax({
        url: "/api/admin",
        type: "DELETE",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        encrypt: "multipart/form-data",
        processData: false,
        success: (response) => {
          if (response !== undefined) {
            window.location = "/admin";
          }
        },
      });
    });
  });
});
