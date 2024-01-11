getDate()

$("#side-siswa").addClass("sidelist-selected")

let USER_ID = $("#user_id").text()
let ROLE = $("#user_role").text();
let SCHOOL_ID
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  SCHOOL_ID = data.datas.school_id
  console.log(SCHOOL_ID)
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

// Function to render cards (common for both admin and student pages)
function renderCard(data, containerId, navigateFunction) {
  const uniqueId = data.unique_id;
  const card = `
    <div id="edit-button" class="border border-gray-400 bg-white-60 rounded-lg pl-4 px-2 py-2 flex flex-col justify-between leading-normal mb-3 shadow-md clickable-card" 
      data-admin-id="${data.unique_id}" 
      onclick="${navigateFunction}('${uniqueId}')">
      <div class="flex justify-between">
        <p class="text-base font-bold" style="color: #3E3E3E;">${data.username}</p>
        <input type="checkbox" id="select-${uniqueId}" class="checkbox-delete hidden w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"  />
      </div>
        <div class="py-2">
          <table class="w-full table-fixed">
            <colgroup>
              <col class="w-2/6">
              <col class="w-1/6">
              <col class="w-1/6">
              <col class="w-2/6">
            </colgroup>
            <thead>
              <tr>
              <td class="text-xs text-left" style="color: #95C0AE;">NIS</td>
              <td class="text-xs text-left" style="color: #95C0AE;">Kelas</td>
              <td class="text-xs text-left" style="color: #95C0AE;">Jurusan</td>
              <td class="text-xs text-left" style="color: #95C0AE;">Jenis Kelamin</td>
              </tr>
            </thead>
            <tbody>
              <tr>
              <td class="text-xs break-all w-max text-left" style="color: #358F6C">${data.nis}</td>
              <td class="text-xs" style="color: #358F6C">${data.class}</td>
              <td class="text-xs" style="color: #358F6C">${data.major}</td>
              <td class="text-xs" style="color: #358F6C">${data.gender}</td>
            </tbody>
          </table>
        </div>
    </div>`;

  $(`#${containerId}`).append(card);
}

// Function to handle search
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

  // Check if checkboxes are visible, and perform the redirect only if they are not
  if (!checkboxesVisible) {
    window.location.href = `/siswa/edit/${uniqueId}`;
  }
}

// Function to update results count
function updateResultsCount() {
  const numberOfCards = $('.clickable-card:visible').length;
  console.log('Number of Cards:', numberOfCards);
  $('#resultsCount').text(`Showing ${numberOfCards} result${numberOfCards !== 1 ? 's' : ''}`);
}


// Function to toggle checkbox visibility
function toggleCheckboxes(event) {
  event.preventDefault();
  const checkboxes = $(".checkbox-delete");

  checkboxes.each(function () {
    $(this).toggle();
  });

  // Add or remove the class for the button based on checkbox visibility
  const areCheckboxesVisible = checkboxes.is(":visible");
  if (areCheckboxesVisible) {
    $("#select-button").addClass("active");
  } else {
    $("#select-button").removeClass("active");
  }
}

// Add an ID to your button element
$("#select-button").on("click", function (event) {
  toggleCheckboxes(event); // Pass the event parameter to toggleCheckboxes
});

function clearExistingCards() {
  $("#siswa-card").empty();
}

let data;
let filteredData = [];
let currentPageSiswa = 1;
const itemsPerPageSiswa = 5;

// Function to handle dropdown change
function renderedDataSiswa() {
  const selectedClass = $("#class-select").val();
  const selectedMajor = $("#major-select").val();

  // Ensure data is available
  if (!data || !data.datas) {
    return;
  }

  // Update the global filteredData variable
  filteredData = data.datas.filter(student => {
    // Check if selectedClass is not selected or matches the student's class
    const classCondition = !selectedClass || selectedClass === '' || student.class === selectedClass;

    // Check if selectedMajor is not selected or matches the student's major
    const majorCondition = !selectedMajor || selectedMajor === '' || student.major === selectedMajor;

    // Include the student in the filtered data only if both conditions are true
    return classCondition && majorCondition;
  });

  // Render filtered data based on school_id
  renderStudentCardsForMobile(currentPageSiswa);

  // Update results count
  updateResultsCount();
}

// Function to render student cards with pagination
function renderStudentCardsForMobile(currentPage) {
  const startIndex = (currentPage - 1) * itemsPerPageSiswa;
  const endIndex = startIndex + itemsPerPageSiswa;

  clearExistingCards();

  filteredData.slice(startIndex, endIndex).forEach(student => {
    // Additional filtering condition based on school_id
    if (student.school_id === SCHOOL_ID) {
      renderCard(student, 'siswa-card', 'navigateToEditPage');
    }
  });

  $("#current-page").text(currentPage);
}

// Initial rendering
renderStudentCardsForMobile(currentPageSiswa);

// Event handler for next page button
$("#next-page").on("click", function (event) {
  event.preventDefault();
  if (currentPageSiswa < Math.ceil(filteredData.length / itemsPerPageSiswa)) {
    currentPageSiswa++;
    renderStudentCardsForMobile(currentPageSiswa);
  }
});

// Event handler for previous page button
$("#prev-page").on("click", function (event) {
  event.preventDefault();
  if (currentPageSiswa > 1) {
    currentPageSiswa--;
    renderStudentCardsForMobile(currentPageSiswa);
  }
});

// ------------------------------------------------------------------

// Event listener for sorting dropdown change
$("#sort-direction").on("change", function () {
  const selectedSortOption = $(this).val();

  if (selectedSortOption === "asc") {
    sortFilteredData('nis', 'asc');
  } else if (selectedSortOption === "desc") {
    sortFilteredData('nis', 'desc');
  }
});

// Function to sort filtered data
function sortFilteredData(property, order) {
  if (!filteredData) {
    return;
  }

  const sortedData = filteredData.slice(0);

  sortedData.sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];

    if (order === 'asc') {
      return aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
    } else if (order === 'desc') {
      return bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' });
    }

    return 0;
  });

  console.log('Sorted Data:', sortedData);

   // Render sorted data for the same school_id
  $("#siswa-card").html("");
  sortedData.forEach(student => {
    // Additional filtering condition based on school_id
    if (student.school_id === SCHOOL_ID) {
      renderCard(student, 'siswa-card', 'navigateToEditPage');
    }
  });

  // Update results count
  updateResultsCount();
}

// --------------------------------------------------------

// Assuming you have an initial SVG content
let initialSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 9.5C0.858333 9.5 0.739583 9.45208 0.64375 9.35625C0.547917 9.26042 0.5 9.14167 0.5 9V7.7875C0.5 7.65417 0.525 7.52708 0.575 7.40625C0.625 7.28542 0.695833 7.17917 0.7875 7.0875L7.1 0.7875C7.2 0.695833 7.31042 0.625 7.43125 0.575C7.55208 0.525 7.67917 0.5 7.8125 0.5C7.94583 0.5 8.075 0.525 8.2 0.575C8.325 0.625 8.43333 0.7 8.525 0.8L9.2125 1.5C9.3125 1.59167 9.38542 1.7 9.43125 1.825C9.47708 1.95 9.5 2.075 9.5 2.2C9.5 2.33333 9.47708 2.46042 9.43125 2.58125C9.38542 2.70208 9.3125 2.8125 9.2125 2.9125L2.9125 9.2125C2.82083 9.30417 2.71458 9.375 2.59375 9.425C2.47292 9.475 2.34583 9.5 2.2125 9.5H1ZM7.8 2.9L8.5 2.2L7.8 1.5L7.1 2.2L7.8 2.9Z" fill="white"/>
  </svg>
`;

// SVG content to be displayed when the button is clicked
let newSvg = `
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="10" height="10" rx="3" stroke="white" stroke-width="2"/>
  </svg>
`;

// Flag to track the state of the button
let isSvgChanged = false;

// Event handler for the button click
$("#select-container").on("click", "#select-button", function (event) {
  event.preventDefault();

  // Toggle between initial and new SVG content
  if (isSvgChanged) {
    $("#select-icon").html(initialSvg);
  } else {
    $("#select-icon").html(newSvg);
  }

  // Toggle the flag
  isSvgChanged = !isSvgChanged;
});

// --------------------------------------------------------

$(document).ready(function () {
  $.get("/api/v1/students", async (response) => {
    if (response.datas.length !== 0) {
      data = response
      $("#bg-nothing").remove();
  
      const isMobile = window.innerWidth < 768;
  
      if (isMobile) {
        $("#table-siswa").addClass("hidden");
  
        // Extract unique class and major values
        const uniqueClasses = [...new Set(data.datas.map(student => student.class))];
        const uniqueMajors = [...new Set(data.datas.map(student => student.major))];
  
        // Append "all" option to the dropdown for classes
        $("#class-select").append(`<option selected class="text-main font-bold" value="">Semua Kelas</option>`);
        uniqueClasses.forEach(className => {
          $("#class-select").append(`<option class="text-main font-bold" value="${className}">${className}</option>`);
        });
  
        // Append "all" option to the dropdown for majors
        $("#major-select").append(`<option class="text-main font-bold" value="">Semua Jurusan</option>`);
        uniqueMajors.forEach(major => {
          $("#major-select").append(`<option class="text-main font-bold" value="${major}">${major}</option>`);
        });
  
        // Add event listener for dropdown change
        $("#class-select, #major-select").on("change", renderedDataSiswa);

        renderedDataSiswa();
      
        // Add the search input event listener
        $('#search').on('input', handleSearch);
  
        // Call the function to update the results count
        updateResultsCount();
  
        toggleCheckboxes();
  
      
          // Initialize Intro.js
          const intro = introJs();
          intro.setOptions({
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
                title: "Tambah Admin",
                element: "#button-tambah",
                intro: "Super Admin dapat menambahkan Admin baru dengan menekan tombol ini.",
              },
              {
                title: "Tombol Hapus",
                element: "#button-delete",
                position: "left",
                intro: "Super Admin dapat menekan tombol ini untuk menghapus Admin setelah selesai memilih",
              },
              {
                title: "Sortir Data",
                element: "#sort-dropdown",
                intro: "Super Admin dapat menyortir data admin dengan menggunakan dropdown menu, A-Z berurutan dari A ke Z dan Z-A berurutan dari Z ke A.",
              },
              {
                title: "Tombol Select",
                element: "#select-container",
                intro: "Super Admin dapat menekan tombol ini untuk memunculkan checkbox pada setiap data admin yang bisa digunakan untuk memilih data yang akan di hapus dengan menekan tombol Hapus.",
              },
              {
                title: "input Search / Cari", 
                element: '#search', 
                intro: 'Super Admin dapat mencari admin dengan mengetik nama admin.' 
              },
              // Add more steps as needed
            ],
            
          });

          // Start Intro.js after a delay
          setTimeout(() => {
            intro.start();
          }, 500);
        } else {
          // Display as DataTable for larger screens
          $("#table-siswa").removeClass("hidden").DataTable({
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
                width:"5%",
                render: function (data, type) {
                  if (ROLE == "super_admin") {
                    return `<a href="/siswa/edit/${data}" class="edit-siswa"><i class="uil uil-edit text-main"></i></a>`;
                  } else {
                    return null;
                  }
                },
              },
              {
                data: "unique_id",
                width:"5%",
                render: function (data, type) {
                  if (ROLE == "super_admin") {
                    return `<input type="checkbox" name="checkedSiswa" class="checkbox-delete" value="${data}" />`;
                  } else {
                    return null;
                  }
                },
              },
            ],

            initComplete: function () {
              setTimeout(() => {
                if (ROLE == "super_admin") {
                  introJs()
                    .setOptions({
                      dontShowAgainLabel: "Jangan tampilkan lagi",
                      tooltipClass: "customTooltip",
                      prevLabel: "Kembali",
                      nextLabel: "Lanjut",
                      dontShowAgainCookie: "siswaPage_intro",
                      dontShowAgain: true,
                      doneLabel: "Selesai",
                      steps: [
                        {
                          title: "Daftar siswa",
                          intro:
                            "Halaman ini berisi mengenai informasi siswa. Guru dapat melihat siswa yang telah terdaftar, menambahkan siswa baru, maupun menghapus siswa.",
                        },
                        {
                          element: "#table-siswa_length",
                          intro:
                            "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah siswa yang ingin ditampilkan pada tabel",
                        },
                        {
                          element: "#table-siswa_filter",
                          intro:
                            "Guru dapat mencari siswa dengan mengetik nama siswa pada kotak ini",
                        },
                        {
                          element: ".checkbox-delete",
                          intro:
                            "Guru juga dapat menekan tombol ini untuk memilih satu atau lebih siswa.",
                        },
                        {
                          element: "#selectAll",
                          intro:
                            "Tombol ini berfungsi untuk memilih semua siswa yang ditampilkan pada tabel",
                        },
                        {
                          title: "Hapus Siswa",
                          intro:
                            "Setelah memilih siswa, guru dapat memilih untuk menghapus beberapa siswa secara bersamaan.",
                        },
                        {
                          element: "#button-delete",
                          intro:
                            "Guru dapat menekan tombol ini untuk menghapus siswa setelah selesai memilih",
                        },
                        {
                          element: ".edit-siswa",
                          intro:
                            "Guru juga dapat mengubah data siswa dengan menekan tombol ini",
                        },
                        {
                          element: "#button-tambah",
                          intro:
                            "Guru dapat menambahkan siswa baru dengan menekan tombol ini.",
                        },
                      ],
                    })
                    .start();
                } else {
                  introJs()
                    .setOptions({
                      dontShowAgainLabel: "Jangan tampilkan lagi",
                      tooltipClass: "customTooltip",
                      prevLabel: "Kembali",
                      nextLabel: "Lanjut",
                      dontShowAgainCookie: "siswaPage_intro",
                      dontShowAgain: true,
                      doneLabel: "Selesai",
                      steps: [
                        {
                          title: "Daftar siswa",
                          intro:
                            "Halaman ini berisi mengenai informasi siswa. Guru dapat melihat siswa yang telah terdaftar, menambahkan siswa baru, maupun menghapus siswa.",
                        },
                        {
                          element: "#table-siswa_length",
                          intro:
                            "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah siswa yang ingin ditampilkan pada tabel",
                        },
                        {
                          element: "#table-siswa_filter",
                          intro:
                            "Guru dapat mencari siswa dengan mengetik nama siswa pada kotak ini",
                        },
                      ],
                    })
                    .start();
                }
              }, 500);
            },
          });
        }
      }
    }
  )});
  


//   // DATA SISWA
// $.get("/api/v1/students", async (data) => {
//   if (data.datas.length !== 0) {
//     $("#bg-nothing").remove()
//     $("#table-siswa").removeClass("hidden")
//     $("#table-siswa").DataTable({
//       ajax: {
//         url: "/api/v1/students",
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
//         { data: "nis",
//           render: function(data){
//             return data.slice(4)
//           }},
//         { data: "username" },
//         { data: "class" },
//         { data: "major" },
//         {
//           data: "unique_id",
//           width:"5%",
//           render: function (data, type) {
//             if (ROLE == "super_admin") {
//               return `<a href="/siswa/edit/${data}" class="edit-siswa"><i class="uil uil-edit text-main"></i></a>`;
//             } else {
//               return null;
//             }
//           },
//         },
//         {
//           data: "unique_id",
//           width:"5%",
//           render: function (data, type) {
//             if (ROLE == "super_admin") {
//               return `<input type="checkbox" name="checkedSiswa" class="checkbox-delete" value="${data}" />`;
//             } else {
//               return null;
//             }
//           },
//         },
//       ],
      // initComplete: function () {
      //   setTimeout(() => {
      //     if (ROLE == "super_admin") {
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
      //               element: "#table-siswa_length",
      //               intro:
      //                 "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah siswa yang ingin ditampilkan pada tabel",
      //             },
      //             {
      //               element: "#table-siswa_filter",
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
      //               element: "#button-delete",
      //               intro:
      //                 "Guru dapat menekan tombol ini untuk menghapus siswa setelah selesai memilih",
      //             },
      //             {
      //               element: ".edit-siswa",
      //               intro:
      //                 "Guru juga dapat mengubah data siswa dengan menekan tombol ini",
      //             },
      //             {
      //               element: "#button-tambah",
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
      //               element: "#table-siswa_length",
      //               intro:
      //                 "Bagian ini berfungsi untuk memunculkan berapa banyaknya jumlah siswa yang ingin ditampilkan pada tabel",
      //             },
      //             {
      //               element: "#table-siswa_filter",
      //               intro:
      //                 "Guru dapat mencari siswa dengan mengetik nama siswa pada kotak ini",
      //             },
      //           ],
      //         })
      //         .start();
      //     }
      //   }, 500);
      // },
//     });
//   }
// });

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
  $("#date-mobile").html(text);
}
