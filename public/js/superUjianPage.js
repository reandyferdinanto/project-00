getDate()

$("#side-topik").addClass("sidelist-selected")

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

// UJIAN CARDS for mobile version
// --------------------------------------------------------------------------------

function renderCard(data, containerId, navigateFunction) {
  const uniqueId = data.unique_id;
  const card = `
    <div class="border border-gray-400 bg-white-60 rounded-lg px-4 pt-2 pb-2 flex flex-col justify-between leading-normal mb-3 shadow-md clickable-card" 
      data-admin-id="${data.unique_id}" 
      onclick="${navigateFunction}('${uniqueId}')">
      <div class=" flex justify-between">
        <p class="text-base font-bold py-0" style="color: #3E3E3E;">${data.exam_type}</p>
        <input type="checkbox" id="select-${uniqueId}" class="checkbox-delete w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
      </div>
      <div class="py-2">
        <table class="w-full table-fixed">
          <thead>
            <tr>
            <td class="text-xs text-left" style="color: #95C0AE;">Tanggal Dibuat</td>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td class="text-xs" style="color: #358F6C">${data.tanggal_dibuat}</td>
          </tbody>
        </table>
      </div>
    </div>`;

  $(`#${containerId}`).append(card);
}


// $.get("/api/v1/topic", async (data, status) => {
//   if (data.datas.length !== 0) {
//     $("#bg-nothing").remove()
//     $("#table-topik").removeClass("hidden")
//     $("#table-topik").DataTable({
//       ajax: {
//         url: "/api/v1/topic",
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
//           width: "10%",
//           render: function (data, type, row, meta) {
//             return meta.row + meta.settings._iDisplayStart + 1;
//           },
//         },
//         { data: "exam_type" },
//         { data: "tanggal_dibuat" },
//         {
//           data: "unique_id",
//           width: "5%",
//           render: function (data, type) {
//             return `<a href="/topik/edit/${data}" class="edit-siswa"><i class="uil uil-edit text-main"></i></a>`;
//           },
//         },
//         {
//           data: "unique_id",
//           width: "5%",
//           render: function (data, type) {
//             return `<input type="checkbox" name="unique_id" class="checkbox-delete" value="${data}" />`;
//           },
//         },
//       ],
//       initComplete: function(){
//         setTimeout(() => {
//           let first_intro = initializeIntro({
//             dontShowAgainCookie: "topikPage_intro",
//             dontShowAgain: true,
//             dontShowAgainLabel: "Jangan tampilkan lagi",
//             tooltipClass: "customTooltip",
//             prevLabel: "Kembali",
//             nextLabel: "Lanjut",
//             doneLabel: "Selesai",
//             steps: [
//               {
//                 title: "Topik Ujian",
//                 intro: "Halaman ini berisi mengenai topik ujian. Super Admin dapat melihat topik ujian yang telah terdaftar, menambahkan topik ujian, maupun menghapus topik ujian.",
//               },
//               {
//                 element: ".dataTables_length",
//                 intro: "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah topik ujian yang ingin ditampilkan pada tabel",
//               },
//               {
//                 element: ".dataTables_filter",
//                 intro: "Super Admin dapat mencari topik ujian di kotak ini",
//               },
//               {
//                 element: ".checkbox-delete",
//                 intro: "Super Admin dapat menekan tombol ini untuk memilih topik ujian.",
//               },
//               {
//                 element: "#selectAll",
//                 intro: "Tombol ini berfungsi untuk memilih semua topik ujian yang ditampilkan pada tabel",
//               },
//               {
//                 element: "#button-delete",
//                 position:"left",
//                 intro: "Super Admin dapat menekan tombol ini untuk menghapus topik ujian setelah selesai memilih",
//               },
//               {
//                 element: ".edit-siswa",
//                 intro: "Super Admin juga dapat mengubah topik ujian dengan menekan tombol ini",
//               },
//               {
//                 element: "#button-tambah",
//                 intro: "Super Admin dapat menambahkan topik ujian baru dengan menekan tombol ini.",
//               },
//             ],
//           });
//           first_intro.start();
//         },500)
//       }
//     });
//   }
// });

// delete function in mobile screen version
let selectedAdmins = [];

// Function to toggle checkbox selection
function toggleCheckboxSelection(uniqueId) {
  // Check if the uniqueId is already in the selectedAdmins array
  const index = selectedAdmins.indexOf(uniqueId);

  // If the uniqueId is not in the array, add it; otherwise, remove it
  if (index === -1) {
    selectedAdmins.push(uniqueId);
  } else {
    selectedAdmins.splice(index, 1);
  }

  // Enable or disable the delete button based on the selectedAdmins array length
  const deleteButton = $("#button-delete");
  deleteButton.prop("disabled", selectedAdmins.length === 0);

  // Log the updated selectedAdmins array for debugging
  console.log("Selected Admins:", selectedAdmins);
}

// Function to delete selected admins
function deleteSelectedAdmins() {
  // Check if there are selected admins
  if (selectedAdmins.length === 0) {
    // alert("Please select at least one admin to delete.");
    return;
  }

  // You can perform the delete API call here
  $.ajax({
    url: "/api/v1/admins",
    type: "DELETE",
    data: { unique_id: selectedAdmins },
    success: function (response) {
      if (response.status_code == 200) {
        // Reload the page or perform any other necessary actions
        location.reload();
      }
    },
    error: function (data, status, error) {
      console.error("Delete Error:", status, data.responseJSON.error);
      // Handle the error as needed
    }
  });
}

// Add click event listener to the delete button
$("#form-admin-delete").on("submit", function (event) {
  event.preventDefault();
  deleteSelectedAdmins();
});
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
    window.location.href = `/admin/edit/${uniqueId}`;
  }
}


function sortDataAlphabetically(data, sortOrder) {
  const sortedData = [...data];

  if (sortOrder === "ascending") {
    return data.sort((a, b) => a.exam_type.toUpperCase().localeCompare(b.exam_type.toUpperCase()));
  } else if (sortOrder === "descending") {
    return data.sort((a, b) => b.exam_type.toUpperCase().localeCompare(a.exam_type.toUpperCase()));
  } else {
    return sortedData;
  }
}


$("#sort-dropdown").on("change", function () {
  const selectedSortOrder = $("#sort-dropdown").val();
  const sortedTopics = sortDataAlphabetically(dataTopics, selectedSortOrder);
  clearExistingCards();
  renderSortedAdminCards(sortedTopics);
  updateResultsCount();
});

// Function to render sorted admin cards
function renderSortedAdminCards(sortedTopics) {
  sortedTopics.forEach(topic => {
    renderCard(topic, 'topic-card', 'navigateToEditPage');
  });
}

function clearExistingCards() {
  $("#topic-card").empty();
}

function toggleCheckboxes(event) {
  event.preventDefault();
  const checkboxes = $(".checkbox-delete");

  checkboxes.each(function () {
    $(this).toggle();
  });

  const areCheckboxesVisible = checkboxes.is(":visible");
  if (areCheckboxesVisible) {
    $("#select-button").addClass("active");
  } else {
    $("#select-button").removeClass("active");
  }
}

$("#select-button").on("click", function (event) {
  toggleCheckboxes(event);
});


let ADMIN_ONLY;

// --------------------------------------------------------

let initialSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 9.5C0.858333 9.5 0.739583 9.45208 0.64375 9.35625C0.547917 9.26042 0.5 9.14167 0.5 9V7.7875C0.5 7.65417 0.525 7.52708 0.575 7.40625C0.625 7.28542 0.695833 7.17917 0.7875 7.0875L7.1 0.7875C7.2 0.695833 7.31042 0.625 7.43125 0.575C7.55208 0.525 7.67917 0.5 7.8125 0.5C7.94583 0.5 8.075 0.525 8.2 0.575C8.325 0.625 8.43333 0.7 8.525 0.8L9.2125 1.5C9.3125 1.59167 9.38542 1.7 9.43125 1.825C9.47708 1.95 9.5 2.075 9.5 2.2C9.5 2.33333 9.47708 2.46042 9.43125 2.58125C9.38542 2.70208 9.3125 2.8125 9.2125 2.9125L2.9125 9.2125C2.82083 9.30417 2.71458 9.375 2.59375 9.425C2.47292 9.475 2.34583 9.5 2.2125 9.5H1ZM7.8 2.9L8.5 2.2L7.8 1.5L7.1 2.2L7.8 2.9Z" fill="white"/>
  </svg>
`;

let newSvg = `
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="10" height="10" rx="3" stroke="white" stroke-width="2"/>
  </svg>
`;

let isSvgChanged = false;

$("#select-container").on("click", "#select-button", function (event) {
  event.preventDefault();


  if (isSvgChanged) {
    $("#select-icon").html(initialSvg);
  } else {
    $("#select-icon").html(newSvg);
  }

  isSvgChanged = !isSvgChanged;
});

// --------------------------------------------------------

$(document).ready(function () {
    $.get("/api/v1/topic", async (data) => {
      if (data.datas.length !== 0) {
        $("#bg-nothing").remove();

        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          $("#table-topic").addClass("hidden");

          const selectedSortOrder = $("#sort-dropdown").val();
          dataTopics = sortDataAlphabetically(data.datas, selectedSortOrder);

          // Render Cards in mobile version
          // sortedAdmins.forEach(topic => {
          //   renderCard(topic, 'topic-card', 'navigateToEditPage');
          // });
          // Render Cards in mobile version
          renderSortedAdminCards(dataTopics);

          $('#search').on('input', handleSearch);

          updateResultsCount();

          // Pagination in mobile version
          let currentPage = 1;
          const itemsPerPage = 5;

          function renderAdminCardsForMobile(currentPage) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            clearExistingCards();

            dataTopics.slice(startIndex, endIndex).forEach(admin => {
              renderCard(admin, 'topic-card', 'navigateToEditPage');
            });

            updateResultsCount();
            $("#current-page").text(currentPage);
          }

          renderAdminCardsForMobile(currentPage);

          $("#next-page").on("click", function (event) {
            event.preventDefault();
            if (currentPage < Math.ceil(dataTopics.length / itemsPerPage)) {
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
                element: "#button-delete",
                position:"left",
                intro: "Super Admin dapat menekan tombol ini untuk menghapus topik ujian setelah selesai memilih",
              },
              {
                element: ".edit-siswa",
                intro: "Super Admin juga dapat mengubah topik ujian dengan menekan tombol ini",
              },
              {
                element: "#button-tambah",
                intro: "Super Admin dapat menambahkan topik ujian baru dengan menekan tombol ini.",
              },
            ],
            
          });

          // Start Intro.js after a delay
          setTimeout(() => {
            intro.start();
          }, 500);
        } else {
          // Display as DataTable for larger screens
          $("#table-topik").removeClass("hidden").DataTable({
            ajax: {
              url: "/api/v1/topic",
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
                          return `<a href="/topik/edit/${data}" class="edit-siswa"><i class="uil uil-edit text-main"></i></a>`;
                        },
                      },
                      {
                        data: "unique_id",
                        width: "5%",
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
                      position: "left",
                      intro: "Super Admin dapat menekan tombol ini untuk menghapus Admin setelah selesai memilih",
                    },
                    {
                      element: ".edit-siswa",
                      intro: "Super Admin juga dapat mengubah data Admin dengan menekan tombol ini",
                    },
                    {
                      element: "#button-tambah",
                      intro: "Super Admin dapat menambahkan Admin baru dengan menekan tombol ini.",
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
  

$("#form-topik-delete").on("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  $.ajax({
    url: "/api/v1/topic",
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
  $("#date-mobile").html(text);
}
