$(document).ready(() => {
  
  $(".admin-sidebar").removeClass('selected')
  $(".topik-sidebar").addClass('selected')
  
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
  $.get(`/api/v1/admins/${user_id}`, function(data) {
    school_id = data.datas.school_id
  })

  $.get("/api/v1/exam_type", async (data, status) => {
    if (status == "success" && data.datas.length !== 0) {
      $("#siswa-table").DataTable({
        ajax: {
          url: "/api/v1/exam_type",
          dataSrc: function(json){
            let filteredData = json.datas.filter(function (data) {
              return data.school_id === school_id;
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
        initComplete: function(){
          setTimeout(() => {
            let first_intro = initializeIntro({
              dontShowAgainCookie: "topikPage_intro",
              dontShowAgain: true,
              dontShowAgainLabel: "Jangan tampilkan lagi",
              tooltipClass: "customTooltip",
              prevLabel: "Kembali",
              nextLabel: "Lanjut",
              doneLabel: "Selesai",
              steps: [
                {
                  title: "Topik Ujian",
                  intro: "Halaman ini berisi mengenai topik ujian. Super Admin dapat melihat topik ujian yang telah terdaftar, menambahkan topik ujian, maupun menghapus topik ujian.",
                },
                {
                  element: ".dataTables_length",
                  intro: "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah topik ujian yang ingin ditampilkan pada tabel",
                },
                {
                  element: ".dataTables_filter",
                  intro: "Super Admin dapat mencari topik ujian di kotak ini",
                },
                {
                  element: ".checkbox-delete",
                  intro: "Super Admin dapat menekan tombol ini untuk memilih topik ujian.",
                },
                {
                  element: "#selectAll",
                  intro: "Tombol ini berfungsi untuk memilih semua topik ujian yang ditampilkan pada tabel",
                },
                {
                  element: ".hapus-button",
                  position:"left",
                  intro: "Super Admin dapat menekan tombol ini untuk menghapus topik ujian setelah selesai memilih",
                },
                {
                  element: ".edit-siswa",
                  intro: "Super Admin juga dapat mengubah topik ujian dengan menekan tombol ini",
                },
                {
                  element: ".buat-ujian-baru",
                  intro: "Super Admin dapat menambahkan topik ujian baru dengan menekan tombol ini.",
                },
              ],
            });
            first_intro.start();
          },500)
        }
      });
      $("hr").remove();
    } else {
      $(".main-table-body").append([
        `
                  <img src="/img/nothing.png" alt="" />
                  <p>Belum ada topik ujian</p>
                `,
      ]);
    }
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
  
  $(".ubah-button").on("click", () => {
    $(".submit-layer").css("visibility", "hidden");
  });
  const formDelete = document.getElementById("form-delete");
  $(".hapus-button").on("click", (e) => {
    e.preventDefault();
    $(".submit-layer").css("visibility", "visible");
    $(".selesai-button").on("click", (e) => {
      e.preventDefault();
      let formData = new FormData(formDelete);
      $.ajax({
        url: "/api/v1/exam_type",
        type: "DELETE",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        encrypt: "multipart/form-data",
        processData: false,
        success: (response) => {
          if (response !== undefined) {
            window.location = "/admin/tipe_ujian";
          }
        },
      });
    });
  });
});
