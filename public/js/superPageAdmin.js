$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  function initializeIntro(stepConfig) {
    const intro = introJs();
    intro.setOptions(stepConfig);
    return intro;
  }

  let user_id = $("#user_id").text()
  let school_id
  $.get(`/api/admin/${user_id}`, function(data) {
    school_id = data.payload.datas.school_id
  })

  $.get("/api/admin", async (data, status) => {
    let esudo = data.payload.datas.filter(adm => {
      return adm.role !== "super_admin"
    })
    if (status == "success" && esudo.length !== 0) {
      $("#siswa-table").DataTable({
        ajax: {
          url: "/api/admin",
          dataSrc: function (response) {
            return response.payload.datas.filter((e) => {
              return e.role == "admin" && e.school_id == school_id;
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
          { data: "nuptk", 
            render: function(data){
              return data.slice(4)
            }},
          { data: "username"},
          { data: "email" },
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
          setTimeout(() => {
            let first_intro = initializeIntro({
              dontShowAgainCookie: "adminPage_intro",
              dontShowAgain: true,
              dontShowAgainLabel: "Jangan tampilkan lagi",
              tooltipClass: "customTooltip",
              prevLabel: "Kembali",
              nextLabel: "Lanjut",
              doneLabel: "Selesai",
              steps: [
                {
                  title: "Daftar Admin",
                  intro: "Halaman ini berisi mengenai informasi admin. Super Admin dapat melihat admin yang telah terdaftar, menambahkan admin baru, maupun menghapus admin.",
                },
                {
                  element: ".dataTables_length",
                  intro: "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah admin yang ingin ditampilkan pada tabel",
                },
                {
                  element: ".dataTables_filter",
                  intro: "Super Admin dapat mencari Admin dengan mengetik nama Admin pada kotak ini",
                },
                {
                  element: ".checkbox-delete",
                  intro: "Super Admin dapat menekan tombol ini untuk memilih Admin.",
                },
                {
                  element: "#selectAll",
                  intro: "Tombol ini berfungsi untuk memilih semua Admin yang ditampilkan pada tabel",
                },
                {
                  intro: "Setelah memilih Admin, Super Admin dapat memilih untuk menghapus beberapa Admin secara bersamaan.",
                },
                {
                  element: ".hapus-button",
                  position:"left",
                  intro: "Super Admin dapat menekan tombol ini untuk menghapus Admin setelah selesai memilih",
                },
                {
                  element: ".edit-siswa",
                  intro: "Super Admin juga dapat mengubah data Admin dengan menekan tombol ini",
                },
                {
                  element: ".buat-ujian-baru",
                  intro: "Super Admin dapat menambahkan Admin baru dengan menekan tombol ini.",
                },
              ],
            });
            first_intro.start();
          }, 500);
        },
      });
      $("hr").remove();
    } else if(esudo.length == 0) {
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
