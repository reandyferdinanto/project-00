getDate()
  
$("#side-nilai").addClass('sidelist-selected')

// Membuat select dalam page nilai menampilkan semua ujian yang terdaftar
$.get("/api/v1/exams", async (examData, status) => {
  $("#nilai-select").html("");
  exams = examData.datas;
  if (exams.length !== 0) {
    exams.forEach((exam) => $("#nilai-select").append(`<option value="${exam.unique_id}">${exam.exam_name}</option>`))
  } else {
    $("#nilai-select").append(`<option value="">Belum ada ujian terdaftar</option>`);
  }
});

// Fetch SUDO
let USER_ID = $("#user_id").text();
let SCHOOL_ID;
let SCHOOL_NAME;
$.get(`/api/v1/admins/${USER_ID}`, function (adminData) {
  SCHOOL_ID = adminData.datas.school_id;
  SCHOOL_NAME = adminData.datas.school_name;
});

// Init table pertama buka page nilai
$.get(`/api/v1/students`, async (data, status) => {
  if (status == "success" && data.datas.length !== 0) {
    if (exams.length !== 0) {
      $("#bg-nothing").remove()
      $("#table-nilai").removeClass("hidden")
      $("#table-nilai").DataTable({
        ajax: {
          url: "/api/v1/students",
          dataSrc: function (json) {
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
            // TABLE NUMBER
            data: null,
            width: "2%",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            },
          },
          {
            // TABLE NIS
            data: "nis",
            render: function (data) {
              return data.slice(4);
            },
          },
          { data: "username" },
          {
            // TABLE NAMA UJIAN
            data: "Exams",
            render: function (data) {
              if (data.length !== 0) {
                let correct = data.filter((e) => {
                  return e.unique_id == $("#nilai-select").val();
                });
                if (correct.length !== 0) {
                  return correct[0].exam_name;
                }
                return `<p style="color: #ff4c4c;margin:0;">Belum Mengambil Ujian</p>`;
              } else {
                return `<p style="color: #ff4c4c;margin:0;">Belum Mengambil Ujian</p>`;
              }
            },
          },
          {
            // TABLE KKM
            data: "Exams",
            render: function (data) {
              if (data.length !== 0) {
                let correct = data.filter((e) => {
                  return e.unique_id == $("#nilai-select").val();
                });
                if (correct.length !== 0) {
                  let kkm = correct[0].kkm_point;
                  return kkm;
                }
                return "-";
              } else {
                return "-";
              }
            },
          },
          {
            // TABLE NIALI 1
            data: "Exams",
            render: function (data) {
              if (data.length !== 0) {
                let correct = data.filter((e) => {
                  return e.unique_id == $("#nilai-select").val();
                });
                if (correct.length !== 0) {
                  let kkm = correct[0].kkm_point;
                  let point = JSON.parse(correct[0].StudentExam.point);
                  if (point) {
                    if (point[0]) {
                      if (point[0].point >= kkm) {
                        return `<p style="color: #358f6c;margin:0;">${point[0].point}</p>`;
                      } else {
                        return `<p style="color: #ff4c4c;margin:0;">${point[0].point}</p>`;
                      }
                    }
                  } else {
                    return "-";
                  }
                }
                return "-";
              } else {
                return "-";
              }
            },
          },
          {
            // TABLE NILAI 2
            data: "Exams",
            render: function (data) {
              if (data.length !== 0) {
                let correct = data.filter((e) => {
                  return e.unique_id == $("#nilai-select").val();
                });
                if (correct.length !== 0) {
                  let kkm = correct[0].kkm_point;
                  let point = JSON.parse(correct[0].StudentExam.point);
                  if (point) {
                    if (point[1]) {
                      if (point[1].point >= kkm) {
                        return `<p style="color: #358f6c;margin:0;">${point[1].point}</p>`;
                      } else {
                        return `<p style="color: #ff4c4c;margin:0;">${point[1].point}</p>`;
                      }
                    }
                  } else {
                    return "-";
                  }
                }
                return "-";
              } else {
                return "-";
              }
            },
          },
        ],
        initComplete: function () {
          // Membuat inrto untuk menjelaskan page
          setTimeout(() => {
            introJs()
              .setOptions({
                dontShowAgainCookie: "nilaiPage_intro",
                dontShowAgain: true,
                dontShowAgainLabel: "Jangan tampilkan lagi",
                tooltipClass: "customTooltip",
                prevLabel: "Kembali",
                nextLabel: "Lanjut",
                doneLabel: "Selesai",
                steps: [
                  {
                    title: "Nilai",
                    intro:
                      "Halaman ini berisi mengenai nilai siswa. Guru dapat melihat nilai siswa berdasarkan ujian yang diikuti serta mengunduh data nilai.",
                  },
                  {
                    element: "#nilai-select",
                    intro:
                      "Guru dapat memilih ingin melihat nilai berdasarkan ujian yang ada dengan menekan tombol ini.",
                  },
                  {
                    element: "#siswa-table_length",
                    intro:
                      "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah nilai siswa yang ingin ditampilkan pada tabel",
                  },
                  {
                    element: "#siswa-table_filter",
                    intro:
                      "Guru dapat mencari nilai siswa dengan mengetik nama siswa pada kotak ini",
                  },
                  {
                    element: ".download-csv-button",
                    intro:
                      "Guru dapat mengunduh nilai yang ada dalam bentuk excel dengan menekan tombol ini.",
                    position: "left",
                  },
                  // Tambahkan langkah-langkah tutorial lainnya sesuai kebutuhan Anda
                ],
              })
              .start();
          }, 500);
        },
      });
    }
  }
});

// Mengubah Ujian yang ditampilkan dengan select
$("#nilai-select").on("change", function () {
  $("#table-nilai").DataTable().clear();
  $("#table-nilai").DataTable().destroy();
  $("#table-nilai").DataTable({
    ajax: {
      url: "/api/v1/students",
      dataSrc: function (json) {
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
        // TABLE NUMBER
        data: null,
        width: "2%",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      { data: "nis", 
        render: function(data){
          return data.slice(4)
        } 
      },
      { data: "username" },
      {
        // TABLE EXAM NAME
        data: "Exams",
        render: function (data) {
          if (data.length !== 0) {
            let correct = data.filter((e) => {
              return e.unique_id == $("#nilai-select").val();
            });
            if (correct.length !== 0) {
              return correct[0].exam_name;
            }
            return `<p style="color: #ff4c4c;margin:0;">Belum Mengambil Ujian</p>`;
          } else {
            return `<p style="color: #ff4c4c;margin:0;">Belum Mengambil Ujian</p>`;
          }
        },
      },
      {
        // TABLE KKM
        data: "Exams",
        render: function (data) {
          if (data.length !== 0) {
            let correct = data.filter((e) => {
              return e.unique_id == $("#nilai-select").val();
            });
            if (correct.length !== 0) {
              let kkm = correct[0].kkm_point;
              return kkm;
            }
            return "-";
          } else {
            return "-";
          }
        },
      },
      {
        
        // TABLE NILAI 1
        data: "Exams",
        render: function (data) {
          if (data.length !== 0) {
            let correct = data.filter((e) => {
              return e.unique_id == $("#nilai-select").val();
            });
            if (correct.length !== 0) {
              let kkm = correct[0].kkm_point;
              let point = JSON.parse(correct[0].StudentExam.point);
              if (point) {
                if (point[0]) {
                  if (point[0].point >= kkm) {
                    return `<p style="color: #358f6c;margin:0;">${point[0].point}</p>`;
                  } else {
                    return `<p style="color: #ff4c4c;margin:0;">${point[0].point}</p>`;
                  }
                }
              } else {
                return "-";
              }
            }
            return "-";
          } else {
            return "-";
          }
        },
      },
      {
        // TABLE NILAI 2
        data: "Exams",
        render: function (data) {
          if (data.length !== 0) {
            let correct = data.filter((e) => {
              return e.unique_id == $("#nilai-select").val();
            });
            if (correct.length !== 0) {
              let kkm = correct[0].kkm_point;
              let point = JSON.parse(correct[0].StudentExam.point);
              if (point) {
                if (point[1]) {
                  if (point[1].point >= kkm) {
                    return `<p style="color: #358f6c;margin:0;">${point[1].point}</p>`;
                  } else {
                    return `<p style="color: #ff4c4c;margin:0;">${point[1].point}</p>`;
                  }
                }
              } else {
                return "-";
              }
            }
            return "-";
          } else {
            return "-";
          }
        },
      },
    ],
  });
});



























// DOWNLOAD
$("#form-nilai-download").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  formData.append("school_id", SCHOOL_ID)
  formData.append("school_name", SCHOOL_NAME)

  $.ajax({
    url: "/api/v1/utils/export",
    type: "POST",
    data: formData,
    async: false,
    cache: false,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response) {
        window.location.href = response.downloadLink;
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