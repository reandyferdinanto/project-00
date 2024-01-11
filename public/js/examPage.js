getDate()

$("#side-ujian").addClass("sidelist-selected")

const USER_ID = $("#user_id").text()
let SCHOOL_ID
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
})

// UJIAN CARDS for mobile version
// --------------------------------------------------------------------------------

// Function to render cards - Daftar Ujian
function renderCard(data, examId, navigateFunction) {
  const uniqueId = data.unique_id;
  const card = `
    <div class="border border-gray-400 bg-white-60 rounded-lg px-4 py-2 flex flex-col justify-between leading-normal mb-3 shadow-md clickable-card" 
      data-admin-id="${data.unique_id}" 
      onclick="${navigateFunction}('${uniqueId}')">
      <div class="pb-4 flex justify-between">
        <p class="text-base font-bold py-2" style="color: #3E3E3E;">${data.exam_name}</p>
      </div>
      <div class="">
        <table class="w-full table-fixed">
          <colgroup>
            <col class="w-1/2">
            <col class="w-1/2">
          </colgroup>
          <thead>
            <tr>
            <td class="text-xs text-left" style="color: #95C0AE;">Nama Ujian</td>
            <td class="text-xs text-left" style="color: #95C0AE;">Topik Ujian</td>
        
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-xs" style="color: #358F6C">${data.exam_type}</td>
              <td class="text-xs" style="color: #358F6C">${data.kkm_point}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;

  $(`#${examId}`).append(card);
}


// $.get("/api/v1/exams", async (data) => {
//   if (data.datas.length !== 0) {
//     $("#bg-nothing").remove()
//     $("#table-ujian").removeClass("hidden")
//     $("#table-ujian").DataTable({
//       ajax: {
//         url: "/api/v1/exams",
//         dataSrc: function(json){
//           let filteredData = json.datas.filter(function (data) {
//             return data.school_id === SCHOOL_ID;
//           });
//           return filteredData;
//         },
//       },
//       pageLength: 20,
//       lengthMenu: [
//         [20, 50, 100, 200, -1],
//         [20, 50, 100, 200, "Semua"],
//       ],
//       columns: [
//         {
//           data: null,
//           render: function (data, type, row, meta) {
//             return meta.row + meta.settings._iDisplayStart + 1;
//           },
//         },
//         { data: "exam_name" },
//         {
//           data: "exam_type",
//           render: function (data, type) {
//             return data.charAt(0).toUpperCase() + data.slice(1);
//           },
//         },
//         { data: "kkm_point" },
//         {
//           data: "unique_id",
//           width:"5%",
//           render: function (data, type) {
//             return `<a href="/ujian/edit/${data}" title="edit data" class="edit-siswa text-main"><i class="uil uil-edit"></i></a>`;
//           },
//         },
//         {
//           data: "unique_id",
//           width:"5%",
//           render: function (data, type) {
//             return `<a class="ujian-link"><i class="uil uil-presentation-play text-main"></i></a>`;
//           },
//         },
//       ],
//       initComplete: function () {
//         setTimeout(() => {
//           introJs()
//             .setOptions({
//               dontShowAgainCookie: "examPage_intro",
//               dontShowAgain: true,
//               dontShowAgainLabel: "Jangan tampilkan lagi",
//               tooltipClass: "customTooltip",
//               prevLabel: "Kembali",
//               nextLabel: "Lanjut",
//               doneLabel: "Selesai",
//               steps: [
//                 {
//                   title: "Ujian",
//                   intro:
//                     "Halaman ini berisi seputar ujian. Guru dapat melihat ujian yang telah dibuat, mengubah ujian, maupun membuat ujian baru.",
//                 },
//                 {
//                   element: "#table-ujian_length",
//                   intro:
//                     "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah ujian yang ingin ditampilkan pada tabel",
//                 },
//                 {
//                   element: "#table-ujian_filter",
//                   intro:
//                     "Guru dapat mencari ujian dengan mengetik nama ujian pada kotak ini",
//                 },
//                 {
//                   element: ".edit-siswa",
//                   intro:
//                     "Guru dapat mengubah ujian yang telah ada dengan menekan tombol ini",
//                 },
//                 {
//                   element: "#button-tambah",
//                   intro:
//                     "Guru dapat menambahkan ujian baru dengan menekan tombol ini.",
//                   position: "left",
//                 },
//               ],
//             })
//             .start();
//         }, 500);
//       },
//     });
//   }
// });

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
  $("#date-mobile").html(text);
}

// -----------------------------------------------------------

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

function navigateToEditPage(uniqueId) {
  const checkboxesVisible = $(".checkbox-delete").is(":visible");
 
  if (!checkboxesVisible) {
    window.location.href = `/ujian/edit/${uniqueId}`;
  }
}


function sortDataAlphabetically(data, sortOrder) {
  const sortedData = [...data];

  if (sortOrder === "ascending") {
    return sortedData.sort((a, b) => a.exam_name.localeCompare(b.exam_name));
  } else if (sortOrder === "descending") {
    return sortedData.sort((a, b) => b.exam_name.localeCompare(a.exam_name));
  } else {
    // Default to ascending order if no valid sortOrder is selected
    return sortedData;
  }
}

$("#sort-dropdown").on("change", function () {
  const selectedSortOrder = $("#sort-dropdown").val();
  const sortedExams = sortDataAlphabetically(dataExams, selectedSortOrder);
  clearExistingCards();
  renderSortedExamCards(sortedExams);
  updateResultsCount();
});

// Function to render sorted admin cards
function renderSortedExamCards(sortedExams) {
  sortedExams.forEach(exam => {
    renderCard(exam, 'exam-card', 'navigateToEditPage');
  });
}


function clearExistingCards() {
  $("#exam-card").empty();
}

// function toggleCheckboxes(event) {
//   event.preventDefault();
//   const checkboxes = $(".checkbox-delete");

//   checkboxes.each(function () {
//     $(this).toggle();
//   });

//   const areCheckboxesVisible = checkboxes.is(":visible");
//   if (areCheckboxesVisible) {
//     $("#select-button").addClass("active");
//   } else {
//     $("#select-button").removeClass("active");
//   }
// }

// $("#select-button").on("click", function (event) {
//   toggleCheckboxes(event);
// });


// --------------------------------------------------------

$(document).ready(function () {
  $.get("/api/v1/exams", async (data) => {
    if (data.datas.length !== 0) {
      $("#bg-nothing").remove();

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        $("#table-exam").addClass("hidden");

        const selectedSortOrder = $("#sort-dropdown").val();
        dataExams = sortDataAlphabetically(data.datas, selectedSortOrder);

        // Move the card rendering logic here
        renderSortedExamCards(dataExams);

        $('#search').on('input', handleSearch);

        updateResultsCount();

        // Pagination in mobile version
        let currentPage = 1;
        const itemsPerPage = 5;

        function renderAdminCardsForMobile(currentPage) {
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;

          clearExistingCards();

          dataExams.slice(startIndex, endIndex).forEach(exam => {
            renderCard(exam, 'exam-card', 'navigateToEditPage');
          });

          updateResultsCount();
          $("#current-page").text(currentPage);
        }

        renderAdminCardsForMobile(currentPage);

        $("#next-page").on("click", function (event) {
          event.preventDefault();
          if (currentPage < Math.ceil(dataExams.length / itemsPerPage)) {
            currentPage++;
            renderAdminCardsForMobile(currentPage);
          }
        });

        $("#prev-page").on("click", function (event) {
          event.preventDefault();
          if (currentPage > 1) {
            currentPage--;
            renderAdminCardsForMobile(currentPage);
          }
        });

        // Initialize Intro.js
        const intro = introJs();
        intro.setOptions({
          dontShowAgainCookie: "examPage_intro",
              dontShowAgain: true,
              dontShowAgainLabel: "Jangan tampilkan lagi",
              tooltipClass: "customTooltip",
              prevLabel: "Kembali",
              nextLabel: "Lanjut",
              doneLabel: "Selesai",
              steps: [
                {
                  title: "Ujian",
                  intro:
                    "Halaman ini berisi seputar ujian. Guru dapat melihat ujian yang telah dibuat, mengubah ujian, maupun membuat ujian baru.",
                },
                {
                  element: "#table-ujian_length",
                  intro:
                    "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah ujian yang ingin ditampilkan pada tabel",
                },
                {
                  element: "#table-ujian_filter",
                  intro:
                    "Guru dapat mencari ujian dengan mengetik nama ujian pada kotak ini",
                },
                {
                  element: ".edit-siswa",
                  intro:
                    "Guru dapat mengubah ujian yang telah ada dengan menekan tombol ini",
                },
                {
                  element: "#button-tambah",
                  intro:
                    "Guru dapat menambahkan ujian baru dengan menekan tombol ini.",
                  position: "left",
                },
              ],
          
        });

        // Start Intro.js after a delay
        setTimeout(() => {
          intro.start();
        }, 500);
      } else {
        // Display as DataTable for larger screens
        $("#table-ujian").removeClass("hidden").DataTable({
          ajax: {
            url: "/api/v1/exams",
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
                    { data: "exam_name" },
                    {
                      data: "exam_type",
                      render: function (data, type) {
                        return data.charAt(0).toUpperCase() + data.slice(1);
                      },
                    },
                    { data: "kkm_point" },
                    {
                      data: "unique_id",
                      width:"5%",
                      render: function (data, type) {
                        return `<a href="/ujian/edit/${data}" title="edit data" class="edit-siswa text-main"><i class="uil uil-edit"></i></a>`;
                      },
                    },
                    {
                      data: "unique_id",
                      width:"5%",
                      render: function (data, type) {
                        return `<a class="ujian-link"><i class="uil uil-presentation-play text-main"></i></a>`;
                      },
                    },
                  ],

          initComplete: function () {
            setTimeout(() => {
              let first_intro = initializeIntro({
              dontShowAgainCookie: "examPage_intro",
              dontShowAgain: true,
              dontShowAgainLabel: "Jangan tampilkan lagi",
              tooltipClass: "customTooltip",
              prevLabel: "Kembali",
              nextLabel: "Lanjut",
              doneLabel: "Selesai",
              steps: [
                {
                  title: "Ujian",
                  intro:
                    "Halaman ini berisi seputar ujian. Guru dapat melihat ujian yang telah dibuat, mengubah ujian, maupun membuat ujian baru.",
                },
                {
                  element: "#table-ujian_length",
                  intro:
                    "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah ujian yang ingin ditampilkan pada tabel",
                },
                {
                  element: "#table-ujian_filter",
                  intro:
                    "Guru dapat mencari ujian dengan mengetik nama ujian pada kotak ini",
                },
                {
                  element: ".edit-siswa",
                  intro:
                    "Guru dapat mengubah ujian yang telah ada dengan menekan tombol ini",
                },
                {
                  element: "#button-tambah",
                  intro:
                    "Guru dapat menambahkan ujian baru dengan menekan tombol ini.",
                  position: "left",
                },
              ],
              });
              first_intro.start();
            }, 500);
          },
        });
      }
    
  }
});
});
