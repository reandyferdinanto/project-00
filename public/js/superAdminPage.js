getDate()

const USER_ID = $("#user_id").text()
let SCHOOL_ID
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
})


// DOM manipulation
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
$("#bg-table-admin").on("click", ".checkbox-delete", function () {
  const anyChecked = $(".checkbox-delete:checked").length > 0;
  $("#button-delete").attr("disabled", !anyChecked);
  if(!anyChecked) $("#selectAll").prop('checked', false)
});
  











  


$.get(`/api/v1/admins`, function (admins) {
  // apabila ada data admin dalam API
  const ADMIN_ONLY = admins.datas.filter(admin => admin.role == "admin")
  if (ADMIN_ONLY.length !== 0) {
    // buat datatable
    $("#bg-nothing").remove()
    $("#table-admin").removeClass("hidden")
    $("#table-admin").DataTable({
      ajax: {
        url: "/api/v1/admins",
        dataSrc: function (response) {
          return response.datas.filter((res) => {
            return res.role == "admin" && res.school_id == SCHOOL_ID;
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
          width:"5%",
          render: function (data, type) {
            return `<a href="/admin/edit/${data}" class="edit-siswa"><i class="uil uil-edit text-main"></i></a>`;
          },
        },
        {
          data: "unique_id",
          width:"5%",
          render: function (data, type) {
            return `<input type="checkbox" name="unique_id" class="checkbox-delete" value="${data}" />`;
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
                element: "#button-delete",
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
  }
});


$("#form-admin-delete").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  $.ajax({
    url: "/api/v1/admins",
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