$(document).ready(() => {
  
  $("#side-nilai").addClass('sidelist-selected')
  
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  let exams;

  // Membuat select dalam page nilai menampilkan semua ujian yang terdaftar
  $.get("/api/v1/exams", async (response, status) => {
    $("#exams-filter").html("");
    exams = response.datas;
    if (exams.length !== 0) {
      exams.forEach((exam, index) => {
        $("#exams-filter").append(
          `<option value="${exam.unique_id}">${exam.exam_name}</option>`
        );
      });
    } else {
      $("#exams-filter").append(
        `<option value="">tidak ada ujian terdaftar</option>`
      );
    }
  });

  // Menginisialisasi table dengan API yang ada
  const url = "/api/v1/students";
  // Fetch SUDO
  let user_id = $("#user_id").text();
  let school_id;
  let school_name;
  $.get(`/api/v1/admins/${user_id}`, function (data) {
    school_id = data.datas.school_id;
    school_name = data.datas.school_name;
  });

  $.get(url, async (data, status) => {
    if (status == "success" && data.datas.length !== 0) {
      if (exams.length !== 0) {
        for (let i = 0; i < exams[0].available_try; i++) {
          $("thead tr").append(`<th>Nilai ${i + 1}</th>`);
        }

        $("#siswa-table").DataTable({
          ajax: {
            url: "/api/v1/students",
            dataSrc: function (json) {
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
                    return e.unique_id == $("#exams-filter").val();
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
                    return e.unique_id == $("#exams-filter").val();
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
                    return e.unique_id == $("#exams-filter").val();
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
                    return e.unique_id == $("#exams-filter").val();
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
                      element: "#exams-filter",
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
        $("hr").remove();
      }
    } if (exams.length == 0 || data.datas.length == 0) {
      $(".main-table-body").append([
        `
          <img src="/img/nothing.png" alt="" />
          <p>Belum ada nilai</p>
        `,
      ]);
    }
  });

  // SELECT
  $("#exams-filter").on("change", function () {
    $("#siswa-table").DataTable().clear();
    $("#siswa-table").DataTable().destroy();
    $("#siswa-table").DataTable({
      ajax: {
        url: "/api/v1/students",
        dataSrc: "datas",
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
        { data: "nis" },
        { data: "username" },
        {
          // TABLE EXAM NAME
          data: "Exams",
          render: function (data) {
            if (data.length !== 0) {
              let correct = data.filter((e) => {
                return e.unique_id == $("#exams-filter").val();
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
                return e.unique_id == $("#exams-filter").val();
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
                return e.unique_id == $("#exams-filter").val();
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
                return e.unique_id == $("#exams-filter").val();
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

  let download_form = document.getElementById("download-form");
  download_form.addEventListener("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/api/v1/utils/export",
      type: "POST",
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: (response) => {
        if (response.status_code == 200) {
          window.location.href = "files/exports/nilai-siswa.xlsx";
        } else if (response.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });
});
