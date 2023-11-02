getDate()

let USER_ID = $("#user_id").text()
let ROLE = $("#user_role").text();
let SCHOOL_ID
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
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

$("#bg-table-siswa").on("click", ".checkbox-delete", function () {
  const anyChecked = $(".checkbox-delete:checked").length > 0;
  $("#button-delete").attr("disabled", !anyChecked);
  if(!anyChecked) $("#selectAll").prop('checked', false)
});

$("#button-batal").click(function(){
  $("#popup").addClass("hidden");
});

$("#button-delete").click(function(){
  $("#popup").removeClass("hidden")
})

  // DATA SISWA
  $.get("/api/v1/students", async (data) => {
    if (data.datas.length !== 0) {
      $("#bg-nothing").remove()
      $("#table-siswa").removeClass("hidden")
      $("#table-siswa").DataTable({
        ajax: {
          url: "/api/v1/students",
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
          { data: "nis",
            render: function(data){
              return data.slice(4)
            }},
          { data: "username" },
          { data: "class" },
          { data: "major" },
          {
            data: "unique_id",
            render: function (data, type) {
              if (ROLE == "super_admin") {
                return `<a href="/siswa/edit/${data}" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
              } else {
                return null;
              }
            },
          },
          {
            data: "unique_id",
            render: function (data, type) {
              if (ROLE == "super_admin") {
                return `<input type="checkbox" name="checkedSiswa" class="checkbox-delete" value="${data}" />`;
              } else {
                return null;
              }
            },
          },
        ],
        // initComplete: function () {
        //   setTimeout(() => {
        //     if (ROLE == "admin") {
        //       introJs()
        //         .setOptions({
        //           dontShowAgainLabel: "Jangan tampilkan lagi",
        //           tooltipClass: "customTooltip",
        //           prevLabel: "Kembali",
        //           nextLabel: "Lanjut",
        //           dontShowAgainCookie: "siswaPage_intro",
        //           dontShowAgain: true,
        //           doneLabel: "Selesai",
        //           steps: [
        //             {
        //               title: "Daftar siswa",
        //               intro:
        //                 "Halaman ini berisi mengenai informasi siswa. Guru dapat melihat siswa yang telah terdaftar, menambahkan siswa baru, maupun menghapus siswa.",
        //             },
        //             {
        //               element: "#siswa-table_length",
        //               intro:
        //                 "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah siswa yang ingin ditampilkan pada tabel",
        //             },
        //             {
        //               element: "#siswa-table_filter input",
        //               intro:
        //                 "Guru dapat mencari siswa dengan mengetik nama siswa pada kotak ini",
        //             },
        //             {
        //               element: ".checkbox-delete",
        //               intro:
        //                 "Guru juga dapat menekan tombol ini untuk memilih satu atau lebih siswa.",
        //             },
        //             {
        //               element: "#selectAll",
        //               intro:
        //                 "Tombol ini berfungsi untuk memilih semua siswa yang ditampilkan pada tabel",
        //             },
        //             {
        //               title: "Hapus Siswa",
        //               intro:
        //                 "Setelah memilih siswa, guru dapat memilih untuk menghapus beberapa siswa secara bersamaan.",
        //             },
        //             {
        //               element: ".hapus-button",
        //               intro:
        //                 "Guru dapat menekan tombol ini untuk menghapus siswa setelah selesai memilih",
        //             },
        //             {
        //               element: ".edit-siswa",
        //               intro:
        //                 "Guru juga dapat mengubah data siswa dengan menekan tombol ini",
        //             },
        //             {
        //               element: ".tambah-button",
        //               intro:
        //                 "Guru dapat menambahkan siswa baru dengan menekan tombol ini.",
        //             },
        //           ],
        //         })
        //         .start();
        //     } else {
        //       introJs()
        //         .setOptions({
        //           dontShowAgainLabel: "Jangan tampilkan lagi",
        //           tooltipClass: "customTooltip",
        //           prevLabel: "Kembali",
        //           nextLabel: "Lanjut",
        //           dontShowAgainCookie: "siswaPage_intro",
        //           dontShowAgain: true,
        //           doneLabel: "Selesai",
        //           steps: [
        //             {
        //               title: "Daftar siswa",
        //               intro:
        //                 "Halaman ini berisi mengenai informasi siswa. Guru dapat melihat siswa yang telah terdaftar, menambahkan siswa baru, maupun menghapus siswa.",
        //             },
        //             {
        //               element: "#siswa-table_length",
        //               intro:
        //                 "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah siswa yang ingin ditampilkan pada tabel",
        //             },
        //             {
        //               element: "#siswa-table_filter input",
        //               intro:
        //                 "Guru dapat mencari siswa dengan mengetik nama siswa pada kotak ini",
        //             },
        //           ],
        //         })
        //         .start();
        //     }
        //   }, 500);
        // },
      });
    }
  });

$("#form-siswa-delete").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  $.ajax({
    url: "/api/v1/students",
    type: "DELETE",
    data: formData,
    contentType: false,
    enctype: "multipart/form-data",
    processData: false,
    success: function (response) {
      if (response.status_code == 200) {
        location.reload()
      }
    },
    error: function (data, status, error) {
      $(`<div class="bg-red-500/70 fixed top-8 left-1/2 -translate-x-1/2 min-w-[400px] text-center py-1.5 rounded-lg border border-red-900 text-[#000] text-sm">${status}: ${data.responseJSON.error}</div>`)
        .insertBefore("#admin-page")
        .delay(3000)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    },
  });
});



  function getDate(){
    const d = new Date();
    let text;
    text = d.toLocaleString("id-ID", {
      dateStyle: "medium",
    });
    $("#date").html(text);
  }
