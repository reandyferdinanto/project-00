getDate()

$('#side-ujian').addClass('sidelist-selected')
$('form').bind("keypress", function(e) {
      if (e.keyCode == 13) {               
          e.preventDefault();
          return false;
      }
});

let USER_ID = $("#user_id").text()
let school_id
let school_name
$.get(`/api/v1/admins/${USER_ID}`, function(data) {
  school_id = data.datas.school_id
  school_name = data.datas.school_name
})

let queuedImagesArray = [];
let queuedImagesArrayAnswer = [];
let question_with_img = [];
let answer_with_img = [];
let allDataArray = [];
let quest_length = 1;
let tempArray = [];
let introTampil = false
let question_pilgan = `
<div class="question_pilgan">  
  <div class="display_image"></div>
  <div class="question-text-container">
    <textarea data-max-words="2" name="question_text" class='soal-text' placeholder="Masukan Soal" required></textarea>
    <div class="upload-img">
      <label class="custom-file-upload">
        <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
        <i class="uil uil-file-plus-alt"></i> Masukan Gambar
      </label>
      <p>*PNG/JPG/JPEG max. 200 kb</p>
    </div>
  </div>
  <div class="answers">
    <div class="answer-container" style="background-color:#2cc489;border: 2px solid white;">
      <div class="answer-container-flex divide-x divide-white-60">
        <input placeholder='jawaban benar' name='correct_answer' class='answer correct-answer'/>
        <label class="custom-file-upload-question">
          <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}0" accept="image/*"/>
          <i class="uil uil-image-plus text-xl" style="color:white"></i>
        </label>
      </div>
      <div class="display_image_answer"></div>
    </div>
    <div class="answer-container wrong-container">
      <div class="answer-container-flex divide-x divide-main">
        <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
        <label class="custom-file-upload-question">
          <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}1" accept="image/*"/>
          <i class="uil uil-image-plus text-xl"></i>
        </label>
      </div>
      <div class="display_image_answer"></div>
    </div>
    <div class="answer-container">
      <div class="answer-container-flex divide-x divide-main">
        <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
        <label class="custom-file-upload-question">
          <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}2" accept="image/*"/>
          <i class="uil uil-image-plus text-xl"></i>
        </label>
      </div>
      <div class="display_image_answer"></div>
    </div>
    <div class="answer-container">
      <div class="answer-container-flex divide-x divide-main">
        <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
        <label class="custom-file-upload-question">
          <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}3" accept="image/*"/>
          <i class="uil uil-image-plus text-xl"></i>
        </label>
      </div>
      <div class="display_image_answer"></div>
    </div>
    <div class="answer-container">
      <div class="answer-container-flex divide-x divide-main">
        <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
        <label class="custom-file-upload-question">
          <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}4" accept="image/*"/>
          <i class="uil uil-image-plus text-xl"></i>
        </label>
      </div>
      <div class="display_image_answer"></div>
    </div>
  </div>
</div>
`;
let question_card = `
<div class="question_kartu">  
  <div class="display_image"></div>
  <div class="question-text-container">
    <textarea maxlength="300" data-max-words="2" name="question_text" class='soal-text' placeholder="Masukan Soal"></textarea>
    <div class="upload-img" style="margin-top:1rem">
      <label class="custom-file-upload">
          <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
          <i class="uil uil-file-plus-alt"></i> Masukan Gambar
      </label>
      <p>*PNG/JPG/JPEG max. 200 kb</p>
    </div>
  </div>
  
  <div class="answers-card">
    <div class="answer-card">
      <div class="answer-card-head">
        <span>#1</span>
        <i class="uil uil-draggabledots"></i>
        <span style="color:transparent">#1</span>
      </div>
      <div class="answer-card-input">
        <input name="kartu" required type="text" placeholder='Kartu'/>
        <div class="delete-card">x</div>
      </div>
    </div>
    <div class="answer-card">
      <div class="answer-card-head">
        <span>#2</span>
        <i class="uil uil-draggabledots"></i>
        <span style="color:transparent">#1</span>
      </div>
      <div class="answer-card-input">
        <input name="kartu" required type="text" placeholder='Kartu'/>
        <div class="delete-card">x</div>
      </div>
    </div>
    <div class="answer-card-add">
      <img src="/img/plus.png" alt="" width="40" />
    </div>
  </div>
</div>
`;


// ADD QUESTION BOX
$("#add-question").on("click", addQuestionBox);
// ADD MORE QUESTION
$(".main-background").on("click", "#add-more", addMoreQuestion);

$(".main-background").on("click", ".delete-quest", function () {
  $(this).parent().remove();
  $(".question").each(function(idx){
    $(this).find(".question-head-info p b").html(`Soal ${idx+1}`)
  })
});
$(".main-background").on("click", "#selesai", () => {
  $(".delete-popup").removeClass("hidden")
  $("#popup").removeClass("hidden")
});
$(".ubah-button").on("click", () => {
  $(".submit-layer").css("visibility", "hidden");
});
$("#file-large-popup button").on("click", (e) => {
  e.preventDefault();
  $("#file-large-popup").addClass("hidden")
  $("#popup").addClass("hidden")
});
$(".main-background").on("mouseover", ".answer-card", function () {
  $(this).find(".delete-card").css("visibility", "visible");
});
$(".main-background").on("click", ".delete-card", function () {
  let arr = $(this).closest(".answers-card");
  $(this).parent().parent().remove();
  $(".answers-card")
    .find(".answer-card")
    .each(function (index) {
      $(this)
        .find("span")
        .html(`#${index + 1}`);
    });
  tempArray = [];
  arr = arr.find(".answer-card");
  arr.each(function (index) {
    tempArray.push({ index, value: $(this).find("input").val() });
  });

  const questionId = $(arr[0]).closest(".question").data("question-id");
  const questionIndex = allDataArray.findIndex(function (item) {
    return item.questionId === questionId;
  });
  // If the question exists in the allDataArray, update its answers, otherwise add it as a new question
  if (questionIndex !== -1) {
    allDataArray[questionIndex].questionId = questionId;
    allDataArray[questionIndex].answers = tempArray;
  } else {
    allDataArray.push({
      questionId,
      answers: tempArray,
    });
  }
});
$(".main-background").on("mouseleave", ".answer-card", function () {
  $(this).find(".delete-card").css("visibility", "hidden");
});
$(".main-background").on("click", ".answer-card-add", function () {
  $(
    `<div class="answer-card">
      <div class="answer-card-head">
        <span>#1</span>
        <i class="uil uil-draggabledots"></i>
        <span style="color:transparent">#1</span>
      </div>
      <div class="answer-card-input">
        <input required type="text" placeholder='Kartu'/>
        <div class="delete-card">x</div>
      </div>
    </div>`
  ).insertBefore($(this))

  $(this)
    .parent()
    .find(".answer-card")
    .each(function (index) {
      $(this)
        .find("span")
        .html(`#${index + 1}`);
    });
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
      if(!introTampil){
        let card_intro = initializeIntro({
          dontShowAgainCookie: "examCreate_intro",
          dontShowAgain: true,
          dontShowAgainLabel: "Jangan tampilkan lagi",
          tooltipClass: "customTooltip",
          prevLabel: "Kembali",
          nextLabel: "Lanjut",
          doneLabel: "Selesai",
          steps: [
            {
              title: "Soal Kartu",
              element: ".soal-text",
              intro: "Guru dapat mengetikkan soal pada kotak yang ini. Soal tipe kartu ini lebih sesuai untuk jawaban dengan urutan.",
            },
            {
              element: "input[name=kartu]",
              intro: "Guru dapat memasukkan jawaban benar sesuai urutan ke sini ",
            },
            {
              element: ".answer-card-head i",
              intro:
                "urutan kartu dapat dipindahkan dengan mengklik lalu menggeser posisi kartu",
            },
            {
              element: ".delete-card",
              intro:
                "kartu dapat dihapus dengan menekan tombol ini",
            },
            {
              element: ".answer-card-add",
              intro:
                "kartu dapat ditambahkan dengan menekan tombol ini",
            },
          ],
        });
        card_intro.start();
        introTampil = true
      }
      break;

    default:
      break;
  }
});
$("#complete-upload").on("click", function (e) {
  e.preventDefault();
  window.location = "/ujian";
});
$(".main-background").on("change", ".answer-card input", function () {
  tempArray = [];
  let arr = $(this).parent().parent().parent().find("> .answer-card");
  arr.each(function (index) {
    tempArray.push({ index, value: $(this).find("input").val() });
  });

  const questionId = $(this).closest(".question").data("question-id");
  const questionIndex = allDataArray.findIndex(function (item) {
    return item.questionId === questionId;
  });
  // If the question exists in the allDataArray, update its answers, otherwise add it as a new question
  if (questionIndex !== -1) {
    allDataArray[questionIndex].questionId = questionId;
    allDataArray[questionIndex].answers = tempArray;
  } else {
    allDataArray.push({
      questionId,
      answers: tempArray,
    });
  }
});

$("#button-batal").click(function(){ 
  $("#popup").addClass("hidden")
});
$("#confirm-popup button").click(function(){
  window.location = "/ujian"
})

// IMAGE INPUT
$(".main-background").on("change", ".input-file", function () {
  let input_file = document.querySelectorAll(".input-file");
  queuedImagesArray = [];
  question_with_img = [];
  input_file.forEach((inp, index) => {
    if (input_file[index].files[0] == undefined) {
      queuedImagesArray.push(input_file[index].files);
    } else if (input_file[index].files[0]) {
      if (input_file[index].files[0].size < 1000000) {
        question_with_img.push(index);
        queuedImagesArray.push(input_file[index].files);
        document.querySelectorAll(".display_image")[index].style.display =
          "flex";
      } else {
        $("#popup").removeClass("hidden")
        $(".delete-popup").addClass("hidden")
        $("#file-large-popup").removeClass("hidden")
        input_file[index].value = ""
      }
    }
  });
  displayQueuedImages();
});
$(".main-background").on("change", ".input-file-answer", function () {
  queuedImagesArrayAnswer = [];
  answer_with_img.push(
    `${$(this).closest(".question").index()},${$(this)
      .closest(".answer-container")
      .index()}`
  );
  $(this).attr(
    "name",
    `answer_image_${$(this).closest(".question").index()}${$(this).closest(".question").find(".input-file-answer").index($(this))}`
  );
  let input_file_answer = $(this)
    .closest(".question")
    .find(".input-file-answer");
  input_file_answer.each(function () {
    queuedImagesArrayAnswer.push($(this).prop("files")[0]);
  });
  // DISPLAY IMG
  let img = "";
  queuedImagesArrayAnswer.forEach((image, index) => {
    if (image !== undefined) {
      img = `
      <img src="${URL.createObjectURL(
        image
      )}" alt="no img" style="margin:1rem 0" />
      <span title="Hapus Gambar" class="deleteImgAnswer"><i class="uil uil-times"></i></span>
      `;
    } else {
      img = "";
    }
    let display_image_answer = $(this)
      .closest(".question")
      .find(".display_image_answer");
    if (img !== "") {
      display_image_answer[index].innerHTML = img;
    }
  });

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
$(".main-background").on("click", ".deleteImgAnswer", function (e) {
  $(this)
    .closest(".answer-container")
    .find(".input-file-answer")
    .prop("type", "text")
    .prop("type", "file");
  $(this).closest(".display_image_answer").html("");
});


const manualForm = document.getElementById("submit-form");
manualForm.addEventListener("submit", (e) => {
  let formData = new FormData(manualForm);
  formData.append("index_deleted", question_with_img);
  formData.append("answer_with_image", JSON.stringify(answer_with_img));
  formData.append("card_answers", JSON.stringify(allDataArray));
  formData.append("school_id", school_id)
  formData.append("school_name", school_name)
  e.preventDefault();
  $.ajax({
    url: "/api/v1/exams",
    type: "POST",
    data: formData,
    async: false,
    cache: false,
    contentType: false,
    encrypt: "multipart/form-data",
    processData: false,
    success: (response) => {
      $(".submit-layer").css("visibility", "hidden");
      if (response.status_code == 200) {
        $(".delete-popup").addClass("hidden")
        $("#confirm-popup").removeClass("hidden")
      } else if (response.message == "you're not authenticated") {
        window.location = "/login";
      }
    },
  });
});

//GET EXAMS TYPE
$.get("/api/v1/topic", async (data, status) => {
  if (status == "success" && data.datas.length !== 0) {
    let datas = data.datas;
    let filteredType = datas.filter(examt => {
      return examt.school_id == school_id
    })
    filteredType.forEach((data) => {
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



function getDate(){
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);
}

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
      element: ".jenis-ujian",
      intro: "Terdapat berbagai tipe soal untuk ujian. Untuk sekarang tersedia tipe 'Pilihan Ganda' dan 'Soal Kartu'."
    },
    {
      element: ".soal-text",
      intro:
        "Guru dapat mengetikkan soal pada kotak ini.",
    },
    {
      element: ".answer-container",
      intro: "Jawaban benar dimasukkan ke dalam kotak yang ini",
    },
    {
      element: ".wrong-container",
      intro: "Untuk jawaban yang lain, dimasukan ke dalam kotak-kotak ini",
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
      element: "#add-more",
      intro: "Guru dapat menambahkan soal lain dengan menekan tombol ini."
    },
    {
      element: "#selesai",
      intro: "Bila sudah selesai membuat semua soal, tekan tombol ini.",
      position: "left",
    },
    // Tambahkan langkah-langkah tutorial lainnya sesuai kebutuhan Anda
  ],
});


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
    update: function () {
      const sortedElements = $(this).find("> .answer-card");
      tempArray = [];

      sortedElements.each(function (index) {
        const value = $(this).find("input").val();
        tempArray.push({ index, value });
        $(this).find("span").html(`#${index + 1}`);
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
          questionId,
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
        <div class="questions text-main"></div>
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
function addMoreQuestion(event) {
  // if (validateForm() == false) return;
  $(".questions").append([
    `
        <div class="question">
          <div class="question-head">
            <div class="question-head-info text-white">
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
  const questionId = "card_" + quest_length;
  $(".question:last-child").attr("data-question-id", questionId);
  quest_length += 1
  initializeSortable();
  tempArray = [];
  $(".question").each(function(idx){
    $(this).find(".question-head-info p b").html(`Soal ${idx+1}`)
  })
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








$(".main-background").on("change","input, textarea, select",function(){
  saveTempData()
  $("#popup-autosave").removeClass("hidden")
})

$.get("/api/v1/temp-form-data", function(result){
  let temp_data = result.TEMP_DATA.find(data => data.id == USER_ID)
  if(temp_data){
    $("input[name=exam_name]").val(temp_data.exam_name)
    $("select[name=exam_type]").val(temp_data.exam_type)
    $("input[name=kkm_point]").val(temp_data.kkm_point)
    if(temp_data.question_type){
      // Menambah question box apabila ada soal dalam data temp
      $("#add-question").remove();
      $("#submit-form").append([
        `
          <div class="questions-box">
            <div class="questions text-main"></div>
            <div class="add-more">
              <button id="add-more" type="button">Tambah Soal</button>
            </div>
          </div>
          <div class="submit-input">
            <button type="button" id="selesai">Selesai</button>
          </div>
          `,
      ]);

      // melakukan foreach untuk menambah soal
      if(Array.isArray(temp_data.question_type)){
        temp_data.question_type.forEach(function(type, index){
          addQuestionForTemp(temp_data, index, type)
        })
      }else{
        addQuestionForTemp(temp_data, 0, temp_data.question_type)
      }
    }
  }
})


let COUNT_CARD = 0
let COUNT_PILGAN = 0
function addQuestionForTemp(TEMP_DATA, index, type) {
  $(".questions").append([
    `
        <div class="question">
          <div class="question-head">
            <div class="question-head-info text-white">
              <p><b>Soal ${index+1}</b></p>
            </div>
            <select name="question_type" class="jenis-ujian">
                <option value="pilihan_ganda">Pilihan Ganda</option>
                <option value="kartu">Soal Kartu</option>
                <option value="praktik" disabled>Praktik In Game</option>
                <option value="esai" disabled>Esai</option>
            </select>
          </div>
          ${type == "pilihan_ganda" ? pilganTemp(TEMP_DATA, index) : kartuTemp(TEMP_DATA, index)}
          <div class="delete-quest" title="Hapus Soal" >
            <span><i class="uil uil-trash-alt"></i></span>
          </div>
        </div>
      `,
  ]);
  $(".question:last-child select[name=question_type]").val(type)
  const questionId = "card_" + index;
  $(".question:last-child").attr("data-question-id", questionId);
  
  type == "pilihan_ganda" ? COUNT_PILGAN += 1 : COUNT_CARD += 1
  
  tempInitializeSortable();
}
function pilganTemp(TEMP_DATA, index){
  let wrong_answer = TEMP_DATA.wrong_answer.slice(COUNT_PILGAN * 4, (COUNT_PILGAN + 1) * 4)
  return `
  <div class="question_pilgan">  
    <div class="display_image"></div>
    <div class="question-text-container">
      <textarea data-max-words="2" name="question_text" class='soal-text' placeholder="Masukan Soal" required>${Array.isArray(TEMP_DATA.question_text)?TEMP_DATA.question_text[index]:TEMP_DATA.question_text}</textarea>
      <div class="upload-img">
        <label class="custom-file-upload">
          <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
          <i class="uil uil-file-plus-alt"></i> Masukan Gambar
        </label>
        <p>*PNG/JPG/JPEG max. 200 kb</p>
      </div>
    </div>
    <div class="answers">
      <div class="answer-container" style="background-color:#2cc489;border: 2px solid white;">
        <div class="answer-container-flex divide-x divide-white-60">
          <input placeholder='jawaban benar' name='correct_answer' class='answer correct-answer' value='${Array.isArray(TEMP_DATA.correct_answer) ? TEMP_DATA.correct_answer[COUNT_PILGAN] : TEMP_DATA.correct_answer}'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}0" accept="image/*"/>
            <i class="uil uil-image-plus text-xl" style="color:white"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container wrong-container">
        <div class="answer-container-flex divide-x divide-main">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer' value='${wrong_answer[0]}'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}1" accept="image/*"/>
            <i class="uil uil-image-plus text-xl"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex divide-x divide-main">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer' value='${wrong_answer[1]}'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}2" accept="image/*"/>
            <i class="uil uil-image-plus text-xl"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex divide-x divide-main">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer' value='${wrong_answer[2]}'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}3" accept="image/*"/>
            <i class="uil uil-image-plus text-xl"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex divide-x divide-main">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer' value='${wrong_answer[3]}'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="answer_image_${quest_length}4" accept="image/*"/>
            <i class="uil uil-image-plus text-xl"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
    </div>
  </div>
  `
}
function kartuTemp(TEMP_DATA, index){
  const CARD_ANSWER = JSON.parse(TEMP_DATA.card_answers)[COUNT_CARD].answers
  let cards = CARD_ANSWER.map((card, idx) => {
    return cardAnswer(card,idx)
  })
  return `
  <div class="question_kartu">  
    <div class="display_image"></div>
    <div class="question-text-container">
      <textarea maxlength="300" data-max-words="2" name="question_text" class='soal-text' placeholder="Masukan Soal">${TEMP_DATA.question_text[index]}</textarea>
      <div class="upload-img" style="margin-top:1rem">
        <label class="custom-file-upload">
            <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
            <i class="uil uil-file-plus-alt"></i> Masukan Gambar
        </label>
        <p>*PNG/JPG/JPEG max. 200 kb</p>
      </div>
    </div>
    
    <div class="answers-card">
      ${cards.join("")}
      <div class="answer-card-add">
        <img src="/img/plus.png" alt="" width="40" />
      </div>
    </div>
  </div>
  `
}
function cardAnswer(card,idx){
  return `
    <div class="answer-card">
      <div class="answer-card-head">
        <span>#${idx+1}</span>
        <i class="uil uil-draggabledots"></i>
        <span style="color:transparent">#${idx+1}</span>
      </div>
      <div class="answer-card-input">
        <input name="kartu" required type="text" placeholder='Kartu' value='${card.value}'/>
        <div class="delete-card">x</div>
      </div>
    </div>
  `
}
function tempInitializeSortable() {
  $(".answers-card").sortable({
    // containment: "parent",
    opacity: 0.75,
    distance: 25,
    tolerance: "intersect",
    items: "> .answer-card",
    create: function (event, ui) {
      const sortedElements = $(this).find("> .answer-card");
      tempArray = [];

      sortedElements.each(function (index) {
        const value = $(this).find("input").val();
        tempArray.push({ index, value });
      });
      const questionId = $(this).closest(".question").data("question-id");

      // Find the index of the question in the allDataArray (if it exists)
      const questionIndex = allDataArray.findIndex(function (item) {
        return item.questionId === questionId;
      });

      // If the question exists in the allDataArray, update its answers, otherwise add it as a new question
      if (questionIndex !== -1) {
        allDataArray[questionIndex].questionId = questionId;
        allDataArray[questionIndex].answers = tempArray;
      } else {
        allDataArray.push({
          questionId,
          answers: tempArray,
        });
      }
    },
    update: function (event, ui) {
      const sortedElements = $(this).find("> .answer-card");
      tempArray = [];

      sortedElements.each(function (index) {
        const value = $(this).find("input").val();
        tempArray.push({ index, value });
        $(this)
          .find("span")
          .html(`#${index + 1}`);
      });
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
          questionId,
          answers: tempArray,
        });
      }
    },
  });
}
function saveTempData(){
  const form = document.getElementById("submit-form");
  let formData = new FormData(form);
  formData.append("card_answers", JSON.stringify(allDataArray));
  formData.append("id", USER_ID)
  const urlencoded = new URLSearchParams(formData).toString()
  $.ajax({
    url: "/api/v1/temp-form-data",
    type: "POST",
    data: urlencoded,
    contentType: 'application/x-www-form-urlencoded',
    processData: false,
    success: (response) => {
      console.log("SAVED");
    },
  });
}