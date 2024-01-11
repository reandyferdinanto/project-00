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

  // Set up event listener after fetching data
  $("#nilai-select").on("change", function () {
    const selectedExamId = $(this).val();
    renderCardsBasedOnSelectedExam(selectedExamId, "nilai-card", exams);
  });

  // Render initial cards based on the default selected exam (if any)
  const selectedExamId = $("#nilai-select").val();
  renderCardsBasedOnSelectedExam(selectedExamId, "nilai-card", exams);
  updateResultsCount();
});

// Fetch SUDO
let USER_ID = $("#user_id").text();
let SCHOOL_ID;
let SCHOOL_NAME;
$.get(`/api/v1/admins/${USER_ID}`, function (adminData) {
  SCHOOL_ID = adminData.datas.school_id;
  SCHOOL_NAME = adminData.datas.school_name;
});

// ------------------------------------------------------------------

// Function to render cards based on the selected exam
function renderCardsBasedOnSelectedExam(selectedExamId, containerId, data) {
  // Clear existing cards
  $(`#${containerId}`).empty();

  // Filter student data based on the selected exam
  const selectedExam = exams.find((exam) => exam.unique_id === selectedExamId);

  // Render cards for each student with data based on the selected exam
  data.forEach((student) => {
    renderCard(student, containerId, selectedExam);
  });
}

// NILAI CARDS for mobile version
function renderCard(data, containerId, navigateFunction) {
  const uniqueId = data.unique_id;
  if (data.Exams && data.Exams.length > 0) {
    const card = `
      <div class="border border-gray-400 bg-white-60 rounded-lg px-4 py-2 flex flex-col justify-between leading-normal mb-3 shadow-md clickable-card" 
        data-admin-id="${data.unique_id}" 
        onclick="${navigateFunction}('${uniqueId}')">
        <div class="pb-4 flex justify-between">
          <p class="text-base font-bold py-2" style="color: #3E3E3E;">${data.username}</p>
          <input type="checkbox" id="select-${uniqueId}" class="checkbox-delete" />
        </div>
        <div class="">
          <table class="w-full table-fixed">
            <colgroup>
              <col class="w-1/3">
              <col class="w-1/3">
              <col class="w-1/3">
            </colgroup>
            <thead>
              <tr>
                <td class="text-xs text-left" style="color: #95C0AE;">NIS</td>
                <td class="text-xs text-left" style="color: #95C0AE;">Nama Ujian</td>
                <td class="text-xs text-left" style="color: #95C0AE;">KKM</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-xs" style="color: #358F6C">${data.nis}</td>
                <td class="text-xs" style="color: #358F6C">${data.Exams[0].exam_name}</td>
                <td class="text-xs" style="color: #358F6C">${data.Exams[0].kkm_point}</td>
              </tr>
              <tr class="">
                <td class="text-xs text-left" style="color: #95C0AE;">Nilai 1</td>
                <td class="text-xs text-left" style="color: #95C0AE;">Nilai 2</td>
              </tr>
              <tr>
              <td class="text-xs" style="color: #358F6C">${data.Exams[0].StudentExam.point !== null ? exam.StudentExam.point : '-'}</td>
              <td class="text-xs text-left" style="color: #95C0AE;">-</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>`;

    $(`#${containerId}`).append(card);
  }
}




// --------------------------------------------------------------------
// Init table pertama buka page nilai
// $.get(`/api/v1/students`, async (data, status) => {
//   if (status == "success" && data.datas.length !== 0) {
//     if (exams.length !== 0) {
//       $("#bg-nothing").remove()
//       $("#table-nilai").removeClass("hidden")
//       $("#table-nilai").DataTable({
//         ajax: {
//           url: "/api/v1/students",
//           dataSrc: function (json) {
//             let filteredData = json.datas.filter(function (data) {
//               return data.school_id === SCHOOL_ID;
//             });
//             return filteredData;
//           },
//         },
//         pageLength: 20,
//         lengthMenu: [
//           [20, 50, 100, 200, -1],
//           [20, 50, 100, 200, "Semua"],
//         ],
//         columns: [
//           {
//             // TABLE NUMBER
//             data: null,
//             width: "2%",
//             render: function (data, type, row, meta) {
//               return meta.row + meta.settings._iDisplayStart + 1;
//             },
//           },
//           {
//             // TABLE NIS
//             data: "nis",
//             render: function (data) {
//               return data.slice(4);
//             },
//           },
//           { data: "username" },
//           {
//             // TABLE NAMA UJIAN
//             data: "Exams",
//             render: function (data) {
//               if (data.length !== 0) {
//                 let correct = data.filter((e) => {
//                   return e.unique_id == $("#nilai-select").val();
//                 });
//                 if (correct.length !== 0) {
//                   return correct[0].exam_name;
//                 }
//                 return `<p style="color: #ff4c4c;margin:0;">Belum Mengambil Ujian</p>`;
//               } else {
//                 return `<p style="color: #ff4c4c;margin:0;">Belum Mengambil Ujian</p>`;
//               }
//             },
//           },
//           {
//             // TABLE KKM
//             data: "Exams",
//             render: function (data) {
//               if (data.length !== 0) {
//                 let correct = data.filter((e) => {
//                   return e.unique_id == $("#nilai-select").val();
//                 });
//                 if (correct.length !== 0) {
//                   let kkm = correct[0].kkm_point;
//                   return kkm;
//                 }
//                 return "-";
//               } else {
//                 return "-";
//               }
//             },
//           },
//           {
//             // TABLE NIALI 1
//             data: "Exams",
//             render: function (data) {
//               if (data.length !== 0) {
//                 let correct = data.filter((e) => {
//                   return e.unique_id == $("#nilai-select").val();
//                 });
//                 if (correct.length !== 0) {
//                   let kkm = correct[0].kkm_point;
//                   let point = JSON.parse(correct[0].StudentExam.point);
//                   if (point) {
//                     if (point[0]) {
//                       if (point[0].point >= kkm) {
//                         return `<p style="color: #358f6c;margin:0;">${point[0].point}</p>`;
//                       } else {
//                         return `<p style="color: #ff4c4c;margin:0;">${point[0].point}</p>`;
//                       }
//                     }
//                   } else {
//                     return "-";
//                   }
//                 }
//                 return "-";
//               } else {
//                 return "-";
//               }
//             },
//           },
//           {
//             // TABLE NILAI 2
//             data: "Exams",
//             render: function (data) {
//               if (data.length !== 0) {
//                 let correct = data.filter((e) => {
//                   return e.unique_id == $("#nilai-select").val();
//                 });
//                 if (correct.length !== 0) {
//                   let kkm = correct[0].kkm_point;
//                   let point = JSON.parse(correct[0].StudentExam.point);
//                   if (point) {
//                     if (point[1]) {
//                       if (point[1].point >= kkm) {
//                         return `<p style="color: #358f6c;margin:0;">${point[1].point}</p>`;
//                       } else {
//                         return `<p style="color: #ff4c4c;margin:0;">${point[1].point}</p>`;
//                       }
//                     }
//                   } else {
//                     return "-";
//                   }
//                 }
//                 return "-";
//               } else {
//                 return "-";
//               }
//             },
//           },
//         ],
//         initComplete: function () {
//           // Membuat inrto untuk menjelaskan page
//           setTimeout(() => {
//             introJs()
//               .setOptions({
//                 dontShowAgainCookie: "nilaiPage_intro",
//                 dontShowAgain: true,
//                 dontShowAgainLabel: "Jangan tampilkan lagi",
//                 tooltipClass: "customTooltip",
//                 prevLabel: "Kembali",
//                 nextLabel: "Lanjut",
//                 doneLabel: "Selesai",
//                 steps: [
//                   {
//                     title: "Nilai",
//                     intro:
//                       "Halaman ini berisi mengenai nilai siswa. Guru dapat melihat nilai siswa berdasarkan ujian yang diikuti serta mengunduh data nilai.",
//                   },
//                   {
//                     element: "#nilai-select",
//                     intro:
//                       "Guru dapat memilih ingin melihat nilai berdasarkan ujian yang ada dengan menekan tombol ini.",
//                   },
//                   {
//                     element: "#siswa-table_length",
//                     intro:
//                       "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah nilai siswa yang ingin ditampilkan pada tabel",
//                   },
//                   {
//                     element: "#siswa-table_filter",
//                     intro:
//                       "Guru dapat mencari nilai siswa dengan mengetik nama siswa pada kotak ini",
//                   },
//                   {
//                     element: ".download-csv-button",
//                     intro:
//                       "Guru dapat mengunduh nilai yang ada dalam bentuk excel dengan menekan tombol ini.",
//                     position: "left",
//                   },
//                   // Tambahkan langkah-langkah tutorial lainnya sesuai kebutuhan Anda
//                 ],
//               })
//               .start();
//           }, 500);
//         },
//       });
//     }
//   }
// });

// ---------------------------------------------------------
// function for manipulate cards (data) in mobile version
function updateResultsCount() {
  const numberOfCards = $('.clickable-card:visible').length;
  console.log('Number of Cards:', numberOfCards);
  $('#resultsCount').text(`Showing ${numberOfCards} result${numberOfCards !== 1 ? 's' : ''}`);
}


function handleSearch() {
  const searchTerm = $('#search').val().toLowerCase();
  $('.clickable-card').each(function () {
    const cardText = $(this).text().toLowerCase();
    const cardMatchesSearch = cardText.includes(searchTerm);
    $(this).toggle(cardMatchesSearch);
  });
  updateResultsCount();
}

// Init table pertama buka page nilai
$.get(`/api/v1/students`, async (data, status) => {
  if (status == "success" && data.datas.length !== 0) {
    
    const isMobile = window.innerWidth <= 768;

    if(isMobile) {
      $("#table-nilai").addClass("hidden");
      $("#bg-nothing").remove();

      data.datas.forEach(nilai => {
        if (nilai.Exams.length !== 0) {
          renderCard(nilai, "nilai-card");
        }
      });
      updateResultsCount();
    } else {

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

// ---------------------------------------------------------
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
  $("#date-mobile").html(text);
}