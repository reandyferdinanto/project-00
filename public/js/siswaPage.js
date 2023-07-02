$(document).ready(() => {
  // TIME
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  // DATA SISWA
  let role = $("input[name=role]").val();

  const url = "/api/scores";
  $.get(url, async (data, status) => {
    if (status == "success" && data.payload.datas.length !== 0) {
      $("#siswa-table").DataTable({
        ajax: {
          url: "/api/scores",
          dataSrc: "payload.datas",
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
          { data: "nis" },
          { data: "username" },
          { data: "class" },
          { data: "major" },
          {
            data: "unique_id",
            render: function (data, type) {
              if (role == "admin") {
                return `<a href="/siswa/edit/${data}" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
              } else {
                return null;
              }
            },
          },
          {
            data: "unique_id",
            render: function (data, type) {
              if (role == "admin") {
                return `<input type="checkbox" name="checkedSiswa" class="checkbox-delete" value="${data}" />`;
              } else {
                return null;
              }
            },
          },
        ],
        // drawCallback: function () {
        //   console.log("test");
        // },
        initComplete: function () {
          setTimeout(() => {
            if (role == "admin") {
              introJs()
                .setOptions({
                  dontShowAgainLabel: "Jangan tampilkan lagi",
                  tooltipClass: "customTooltip",
                  prevLabel: "Kembali",
                  nextLabel: "Lanjut",
                  dontShowAgainCookie: "siswaPage_intro",
                  dontShowAgain: true,
                  doneLabel: "Selesai",
                  steps: [
                    {
                      title: "Daftar siswa",
                      intro:
                        "Halaman ini berisi mengenai informasi siswa. Guru dapat melihat siswa yang telah terdaftar, menambahkan siswa baru, maupun menghapus siswa.",
                    },
                    {
                      element: "#siswa-table_length",
                      intro:
                        "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah siswa yang ingin ditampilkan pada tabel",
                    },
                    {
                      element: "#siswa-table_filter input",
                      intro:
                        "Guru dapat mencari siswa dengan mengetik nama siswa pada kotak ini",
                    },
                    {
                      element: ".checkbox-delete",
                      intro:
                        "Guru juga dapat menekan tombol ini untuk memilih satu atau lebih siswa.",
                    },
                    {
                      element: "#selectAll",
                      intro:
                        "Tombol ini berfungsi untuk memilih semua siswa yang ditampilkan pada tabel",
                    },
                    {
                      title: "Hapus Siswa",
                      intro:
                        "Setelah memilih siswa, guru dapat memilih untuk menghapus beberapa siswa secara bersamaan.",
                    },
                    {
                      element: ".hapus-button",
                      intro:
                        "Guru dapat menekan tombol ini untuk menghapus siswa setelah selesai memilih",
                    },
                    {
                      element: ".edit-siswa",
                      intro:
                        "Guru juga dapat mengubah data siswa dengan menekan tombol ini",
                    },
                    {
                      element: ".tambah-button",
                      intro:
                        "Guru dapat menambahkan siswa baru dengan menekan tombol ini.",
                    },
                  ],
                })
                .start();
            } else {
              introJs()
                .setOptions({
                  dontShowAgainLabel: "Jangan tampilkan lagi",
                  tooltipClass: "customTooltip",
                  prevLabel: "Kembali",
                  nextLabel: "Lanjut",
                  dontShowAgainCookie: "siswaPage_intro",
                  dontShowAgain: true,
                  doneLabel: "Selesai",
                  steps: [
                    {
                      title: "Daftar siswa",
                      intro:
                        "Halaman ini berisi mengenai informasi siswa. Guru dapat melihat siswa yang telah terdaftar, menambahkan siswa baru, maupun menghapus siswa.",
                    },
                    {
                      element: "#siswa-table_length",
                      intro:
                        "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah siswa yang ingin ditampilkan pada tabel",
                    },
                    {
                      element: "#siswa-table_filter input",
                      intro:
                        "Guru dapat mencari siswa dengan mengetik nama siswa pada kotak ini",
                    },
                  ],
                })
                .start();
            }
          }, 500);
        },
      });
      $("hr").remove();
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
  });

  // ROLE HANDLE
});
