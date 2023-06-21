$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  let exams;

  // CALL

  $.get("/api/exams", async (response, status) => {
    $("#exams-select").html("");
    exams = response.payload.datas;
    if (exams.length !== 0) {
      exams.forEach((exam, index) => {
        $("#exams-select").append(
          `<option value="${exam.unique_id}">${exam.exam_name}</option>`
        );
      });
    } else {
      $("#exams-select").append(
        `<option value="">tidak ada ujian terdaftar</option>`
      );
    }
  });

  const url = "/api/scores";
  $.get(url, async (data, status) => {
    if (status == "success" && data.payload.datas.length !== 0) {
      if (exams.length !== 0) {
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
            {
              data: "Exams",
              render: function (data) {
                if (data.length !== 0) {
                  let correct = data.filter((e) => {
                    return e.unique_id == $("#exams-select").val();
                  });
                  if (correct.length !== 0) {
                    return correct[0].exam_name;
                  }
                  return "Belum mengambil ujian";
                } else {
                  return "Belum mengambil ujian";
                }
              },
            },
            {
              data: "Exams",
              render: function (data) {
                if (data.length !== 0) {
                  let correct = data.filter((e) => {
                    return e.unique_id == $("#exams-select").val();
                  });
                  if (correct.length !== 0) {
                    return correct[0].ScoreExam.point;
                  }
                  return "0";
                } else {
                  return "0";
                }
              },
            },
          ],
        });
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
                  element: "#exams-select",
                  intro:
                    "Guru dapat memilih ingin melihat nilai berdasarkan ujian yang ada dengan menekan tombol ini.",
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
        }, 1000);
      } else {
        $(".main-table-body").append([
          `
                  <img src="/img/nothing.png" alt="" />
                  <p>Belum ada nilai</p>
                `,
        ]);
      }
    }
  });

  // SELECT
  $("#exams-select").on("change", function () {
    $("#siswa-table").DataTable().clear();
    $("#siswa-table").DataTable().destroy();
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
        {
          data: "Exams",
          render: function (data) {
            if (data.length !== 0) {
              let correct = data.filter((e) => {
                return e.unique_id == $("#exams-select").val();
              });
              if (correct.length !== 0) {
                return correct[0].exam_name;
              }
              return "Belum mengambil ujian";
            } else {
              return "Belum mengambil ujian";
            }
          },
        },
        {
          data: "Exams",
          render: function (data) {
            if (data.length !== 0) {
              let correct = data.filter((e) => {
                return e.unique_id == $("#exams-select").val();
              });
              if (correct.length !== 0) {
                return correct[0].ScoreExam.point;
              }
              return "0";
            } else {
              return "0";
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
      url: "/api/utils/export",
      type: "POST",
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: (response) => {
        if (response.status_code == 200) {
          window.location.href = "files/exports/nilai-siswa.csv";
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });
});
