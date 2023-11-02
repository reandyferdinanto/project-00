getDate()

const USER_ID = $("#user_id").text()
let SCHOOL_ID
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
})


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
$("#bg-table-topik").on("click", ".checkbox-delete", function () {
  const anyChecked = $(".checkbox-delete:checked").length > 0;
  $("#button-delete").attr("disabled", !anyChecked);
  if(!anyChecked) $("#selectAll").prop('checked', false)
});

$.get("/api/v1/exam_type", async (data, status) => {
  if (data.datas.length !== 0) {
    $("#bg-nothing").remove()
    $("#table-topik").removeClass("hidden")
    $("#table-topik").DataTable({
      ajax: {
        url: "/api/v1/exam_type",
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
            return `<a href="/admin/tipe_ujian/edit/${data}" class="edit-siswa"><i class="uil uil-edit"></i></a>`;
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
      // initComplete: function(){
      //   setTimeout(() => {
      //     let first_intro = initializeIntro({
      //       dontShowAgainCookie: "topikPage_intro",
      //       dontShowAgain: true,
      //       dontShowAgainLabel: "Jangan tampilkan lagi",
      //       tooltipClass: "customTooltip",
      //       prevLabel: "Kembali",
      //       nextLabel: "Lanjut",
      //       doneLabel: "Selesai",
      //       steps: [
      //         {
      //           title: "Topik Ujian",
      //           intro: "Halaman ini berisi mengenai topik ujian. Super Admin dapat melihat topik ujian yang telah terdaftar, menambahkan topik ujian, maupun menghapus topik ujian.",
      //         },
      //         {
      //           element: ".dataTables_length",
      //           intro: "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah topik ujian yang ingin ditampilkan pada tabel",
      //         },
      //         {
      //           element: ".dataTables_filter",
      //           intro: "Super Admin dapat mencari topik ujian di kotak ini",
      //         },
      //         {
      //           element: ".checkbox-delete",
      //           intro: "Super Admin dapat menekan tombol ini untuk memilih topik ujian.",
      //         },
      //         {
      //           element: "#selectAll",
      //           intro: "Tombol ini berfungsi untuk memilih semua topik ujian yang ditampilkan pada tabel",
      //         },
      //         {
      //           element: ".hapus-button",
      //           position:"left",
      //           intro: "Super Admin dapat menekan tombol ini untuk menghapus topik ujian setelah selesai memilih",
      //         },
      //         {
      //           element: ".edit-siswa",
      //           intro: "Super Admin juga dapat mengubah topik ujian dengan menekan tombol ini",
      //         },
      //         {
      //           element: ".buat-ujian-baru",
      //           intro: "Super Admin dapat menambahkan topik ujian baru dengan menekan tombol ini.",
      //         },
      //       ],
      //     });
      //     first_intro.start();
      //   },500)
      // }
    });
  }
});
  

$("#form-admin-topik").on("submit", function (e) {
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
