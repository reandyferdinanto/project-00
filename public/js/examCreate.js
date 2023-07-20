$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  let first_intro = initializeIntro({
    dontShowAgainCookie: "examCreate_intro",
    dontShowAgain: true,
    dontShowAgainLabel: "Jangan tampilkan lagi",
    tooltipClass: "customTooltip",
    prevLabel: "Kembali",
    nextLabel: "Lanjut",
    doneLabel: "Selesai",
    steps: [
      {
        title: "Ujian Baru",
        intro: "Halaman ini berfungsi untuk membuat ujian baru",
      },
      {
        element: ".main-input",
        intro: "Guru dapat mengisi formulir ini untuk menbuat ujian baru.",
      },
      {
        element: ".main-create-question",
        intro:
          "Bila sudah selesai mengisi, tekan tombol ini untuk membuat soal",
        position: "left",
      },
    ],
  });
  first_intro.start();

  let intro = initializeIntro({
    dontShowAgainCookie: "examCreate_intro",
    dontShowAgain: true,
    dontShowAgainLabel: "Jangan tampilkan lagi",
    tooltipClass: "customTooltip",
    prevLabel: "Kembali",
    nextLabel: "Lanjut",
    doneLabel: "Selesai",
    steps: [
      {
        element: ".soal-text",
        intro:
          "Guru dapat mengetikkan soal pada kotak yang ini. Soal yang dibuat hanya terbatas sebanyak 300 karakter.",
      },
      {
        element: ".correct-answer",
        intro: "Jawaban benar dimasukkan ke dalam kotak yang ini",
      },
      {
        element: ".wrong-answer",
        intro: " Untuk jawaban yang lain, dimasukan ke dalam kotak-kotak ini",
      },
      {
        element: ".custom-file-upload",
        intro:
          "Guru juga dapat memasukkan gambar ke dalam soal dengan menekan tombol ini dan memilih gambar yang diinginkan. Gambar yang dipilih maksimal sebesar 200kb dalam bentuk JPG/ PNG",
      },
      {
        element: ".delete-quest",
        intro: "Guru dapat menghapus soal dengan menekan tombol yang ini.",
      },
      {
        element: "#selesai",
        intro: "Bila sudah selesai membuat semua soal, tekan tombol ini.",
        position: "left",
      },
      // Tambahkan langkah-langkah tutorial lainnya sesuai kebutuhan Anda
    ],
  });

  let queuedImagesArray = [];
  let question_with_img = [];
  let allDataArray = [];
  let quest_length = 1;
  let question_pilgan = `
  <div class="question_pilgan">  
    <div class="display_image"></div>
    <textarea maxlength="300" data-max-words="2" name="question_text" class='soal-text' placeholder="Masukan Soal"></textarea>
    <div class="answers">
      <input maxlength="200" placeholder='jawaban benar' name='correct_answer'  class='answer correct-answer'/>
      <input maxlength="200" placeholder='jawaban lain' name='wrong_answer'  class='answer wrong-answer'/>
      <input maxlength="200" placeholder='jawaban lain' name='wrong_answer'  class='answer'/>
      <input maxlength="200" placeholder='jawaban lain' name='wrong_answer'  class='answer'/>
      <input maxlength="200" placeholder='jawaban lain' name='wrong_answer'  class='answer'/>
      <div class="upload-img">
        <label class="custom-file-upload">
            <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
            <i class="uil uil-file-plus-alt"></i> Masukan Gambar
        </label>
        <p>*PNG/JPG/JPEG max. 200 kb</p>
      </div>
    </div>
  </div>
`;
  let question_card = `
  <div class="question_kartu">  
    <div class="display_image"></div>
    <textarea maxlength="300" data-max-words="2" name="question_text" class='soal-text' placeholder="Masukan Soal"></textarea>
    <div class="upload-img" style="margin-top:1rem">
        <label class="custom-file-upload">
            <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
            <i class="uil uil-file-plus-alt"></i> Masukan Gambar
        </label>
        <p>*PNG/JPG/JPEG max. 200 kb</p>
    </div>
    <div class="answers-card">
      <div class="answer-card">
        <input  type="text" placeholder='Kartu 1'/>
      </div>
      <div class="answer-card">
        <input  type="text" placeholder='Kartu 2'/>
      </div>
      <div class="answer-card-add">
        <img src="/img/plus.png" alt="" width="40" />
      </div>
    </div>
  </div>
`;

  function initializeIntro(stepConfig) {
    const intro = introJs();
    intro.setOptions(stepConfig);
    return intro;
  }
  function initializeSortable() {
    $(".answers-card").sortable({
      // containment: "parent",
      opacity: 0.75,
      distance: 25,
      tolerance: "intersect",
      items: "> .answer-card",
      update: function (event, ui) {
        const sortedElements = $(this).find("> .answer-card");
        const tempArray = [];

        sortedElements.each(function (index) {
          const value = $(this).find("input").val();
          tempArray.push({ index, value });
        });
        // Get the questionId from the data attribute of the current question
        const questionId = $(this).closest(".question").data("question-id");

        // Find the index of the question in the allDataArray (if it exists)
        const questionIndex = allDataArray.findIndex(function (item) {
          return item.questionId === questionId;
        });

        // If the question exists in the allDataArray, update its answers, otherwise add it as a new question
        if (questionIndex !== -1) {
          allDataArray[questionIndex].answers = tempArray;
        } else {
          allDataArray.push({
            answers: tempArray,
          });
        }
      },
    });
  }
  function addQuestionBox() {
    $("#add-question").remove();
    $("#submit-form").append([
      `
        <div class="questions-box">
          <div class="questions"></div>
          <div class="add-more">
            <button id="add-more" type="button">Tambah Soal</button>
          </div>
        </div>
        <div class="submit-input">
          <button type="button" id="selesai">Selesai</button>
        </div>
        `,
    ]);
    addMoreQuestion();
    first_intro.exit();
    setTimeout(() => {
      intro.start();
    }, 500);
  }
  function addMoreQuestion() {
    $(".questions").append([
      `
          <div class="question">
            <div class="question-head">
              <div class="question-head-info">
                <p><b>Soal ${quest_length}</b></p>
              </div>
              <select name="question_type" class="jenis-ujian">
                  <option value="pilihan_ganda">Pilihan Ganda</option>
                  <option value="kartu">Soal Kartu</option>
                  <option value="praktik" disabled>Praktik In Game</option>
                  <option value="esai" disabled>Esai</option>
              </select>
            </div>
            ${question_pilgan}
            <div class="delete-quest" title="Hapus Soal" >
              <span><i class="uil uil-trash-alt"></i></span>
            </div>
          </div>
        `,
    ]);
    const questionId = "card_answer_" + quest_length;
    $(".question:last-child").attr("data-question-id", questionId);
    initializeSortable();
    quest_length += 1;
  }
  function displayQueuedImages() {
    let img = "";
    queuedImagesArray.forEach((image, index) => {
      if (image.length != 0) {
        img = `
        <img src="${URL.createObjectURL(image[0])}" alt="no img" />
        <span title="Hapus Gambar" class="deleteImg"><i class="uil uil-times"></i></span>
        `;
      } else {
        img = "";
      }
      document.querySelectorAll(".display_image")[index].innerHTML = img;
    });
  }

  // ADD QUESTION BOX
  $("#add-question").on("click", addQuestionBox);
  // ADD MORE QUESTION
  $(".main-background").on("click", "#add-more", addMoreQuestion);

  $(".main-background").on("click", ".delete-quest", function () {
    $(this).parent().remove();
  });
  $(".main-background").on("click", "#selesai", () => {
    $(".submit-layer").css("visibility", "visible");
  });
  $(".ubah-button").on("click", () => {
    $(".submit-layer").css("visibility", "hidden");
  });
  $(".file-toolarge button").on("click", (e) => {
    e.preventDefault();
    $(".file-layer").css("visibility", "hidden");
  });
  $(".main-background").on("click", ".answer-card-add", function () {
    $(".answers-card").prepend([
      `<div class="answer-card">
        <input  type="text" placeholder='Kartu'/>
      </div>`,
    ]);
  });
  $(".main-background").on("change", ".jenis-ujian", function () {
    let jenis_ujian = $(this).find(":selected").val();
    switch (jenis_ujian) {
      case "pilihan_ganda":
        $(this).parent().parent().find(".question_kartu").remove();
        $(this).parent().parent().append([question_pilgan]);
        break;
      case "kartu":
        $(this).parent().parent().find(".question_pilgan").remove();
        $(this).parent().parent().append([question_card]);
        initializeSortable();
        break;

      default:
        break;
    }
  });
  $("#complete-upload").on("click", function (e) {
    e.preventDefault();
    window.location = "/ujian";
  });
  // IMAGE INPUT
  $(".main-background").on("change", ".input-file", function () {
    let input_file = document.querySelectorAll(".input-file");
    queuedImagesArray = [];
    question_with_img = [];
    input_file.forEach((inp, index) => {
      if (input_file[index].files[0] == undefined) {
        queuedImagesArray.push(input_file[index].files);
      } else if (input_file[index].files[0]) {
        if (input_file[index].files[0].size < 200000) {
          question_with_img.push(index);
          queuedImagesArray.push(input_file[index].files);
          document.querySelectorAll(".display_image")[index].style.display =
            "flex";
        } else {
          $(".file-layer").css("visibility", "visible");
        }
      }
    });
    displayQueuedImages();
  });

  $(".main-background").on("click", ".deleteImg", function (e) {
    let input_file = document.querySelectorAll(".input-file");
    let index = $(".display_image").index($(this).parent());
    input_file[index].type = "text";
    input_file[index].type = "file";
    $(this)[0].parentElement.innerHTML = "";

    let index_deleted = question_with_img.indexOf(index);
    if (index_deleted !== -1) {
      question_with_img.splice(index_deleted, 1);
    }
    document.querySelectorAll(".display_image")[index].style.display = "none";
  });

  const manualForm = document.getElementById("submit-form");
  manualForm.addEventListener("submit", (e) => {
    let formData = new FormData(manualForm);
    formData.append("index_deleted", question_with_img);
    formData.append("card_answers", JSON.stringify(allDataArray));
    e.preventDefault();
    $.ajax({
      url: "/api/exams",
      type: "POST",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      beforeSend: function () {
        $(".load-layer").removeClass("hide");
        $(".load-layer").css("visibility", "visible");
        $(".submit-layer").css("visibility", "hidden");
      },
      success: (response) => {
        $(".submit-layer").css("visibility", "hidden");
        if (response.payload.status_code == 200) {
          $(".load-layer").addClass("hide");
          $(".complete-layer").removeClass("hide");
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });

  //GET EXAMS TYPE
  $.get("/api/exam_type", async (data, status) => {
    if (status == "success" && data.payload.datas.length !== 0) {
      let datas = data.payload.datas;
      datas.forEach((data) => {
        $(".exam-type").append([
          `
        <option value="${data.exam_type.toLowerCase()}">${
            data.exam_type.charAt(0).toUpperCase() + data.exam_type.slice(1)
          }</option>
        `,
        ]);
      });
    } else {
    }
  });
});
