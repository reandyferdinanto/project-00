$(document).ready(() => {
  const d = new Date();
  $("#date").html(d.toLocaleString("id-ID", {
    dateStyle: "medium",
  }));

  let question_with_img = [];
  let queuedImagesArrayAnswer = [];
  let users;
  let unique_id = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );
  let question_id = [];
  let allDataArray = [];
  let tempArray = [];
  let question_type = []
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
        <div class="answer-container-flex">
          <input placeholder='jawaban benar' name='correct_answer' class='answer correct-answer'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v" style="color:white"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer wrong-answer'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer wrong-answer'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer wrong-answer'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer wrong-answer'/>
          <label class="custom-file-upload-question">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v"></i>
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
      <textarea maxlength="300" data-max-words="2" name="question_text" class='soal-text' placeholder="Masukan Soal"></textarea>
      <div class="upload-img" style="margin-top:1rem">
          <label class="custom-file-upload">
              <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
              <i class="uil uil-file-plus-alt"></i> Masukan Gambar
          </label>
          <p>*PNG/JPG/JPEG max. 200 kb</p>
      </div>
      <div class="answers-card">
        <div class="answer-card-add">
          <img src="/img/plus.png" alt="" width="40" />
        </div>
      </div>
    </div>
  `;

  function initializeSortable() {
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
  function displayQuestionImage() {
    $(".input-file").each(function(idx){
      if($(this)[0].files[0]){
        $(".display_image").eq(idx).css('display', 'flex')
        $(".display_image").eq(idx).html(`
          <img src="${URL.createObjectURL($(this)[0].files[0])}" alt="no img" />
          <span title="Hapus Gambar" class="deleteImg"><i class="uil uil-times"></i></span>
        `)
      };
    })
  }
  function displayAnswerImage() {
    $(".answers").each(function(idx){
      $(this).find(".input-file-answer").each(function(){
        if($(this)[0].files[0]){
          $(this).closest(".answer-container").find(".display_image_answer").css('display', 'flex')
          $(this).closest(".answer-container").find(".display_image_answer").html(`
            <img src="${URL.createObjectURL($(this)[0].files[0])}" alt="no img" />
            <span title="Hapus Gambar" class="deleteImgAnswer"><i class="uil uil-times"></i></span>
          `)
        }
      })
    })
  }
  function getImgBlob(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        method: "GET",
        xhrFields: {
          responseType: "blob",
        },
        success: function (response) {
          resolve(response);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }
  function initializeExamType(exams_data){
    $.get("/api/exam_type", async (exam_types, status) => {
      if (status == "success" && exam_types.payload.datas.length !== 0) {
        exam_types.payload.datas.forEach((exam_type) => {
          $("#exam_type").append([
            `
            <option value="${exam_type.exam_type.toLowerCase()}">${
              exam_type.exam_type.charAt(0).toUpperCase() + exam_type.exam_type.slice(1)
            }</option>
        `,
          ]);
        });
        // ubah exam type menjadi ujian yang dipilih
        $("#exam_type").val(exams_data.exam_type).change();
      }
    });
  }
  function addMoreQuestion(question, index) {
    // if (validateForm() == false) return;
    $(".questions").append([
      `
          <div class="question">
            <div class="question-head">
              <div class="question-head-info">
                <p><b>Soal ${index}</b></p>
              </div>
            </div>
            ${question}
            <div class="delete-quest" title="Hapus Soal" >
              <span><i class="uil uil-trash-alt"></i></span>
            </div>
          </div>
        `,
    ]);
    $(".input-file-answer").each(function(){
      $(this).attr("name",`answer_image_${$(this).closest(".question").index()}${$(this).closest(".question").find(".input-file-answer").index($(this))}`)
    })
  }

  // Initialize Exam
  $.get(`/api/exams/${unique_id}`, async (exams, status) => {
    let exams_data = exams.payload.datas;
    // Initialize ExamType
    initializeExamType(exams_data)

    if (status == "success" && exams_data.length !== 0) {
      $("#exam_name").val(exams_data.exam_name);
      $("#kkm_point").val(exams_data.kkm_point);
      $("#available_try").val(exams_data.available_try);
      // Loop through Questions
      exams_data.Questions.forEach(async (question, index) => {
        question_type.push(question.question_type)
        question_id.push(question.unique_id)
        // Initialize Question Pilihan Ganda
        if (question.question_type == "pilihan_ganda"){
          let pilgan_answers = JSON.parse(question.pilgan_answers)
          addMoreQuestion(question_pilgan, index+1)
          $(".question").eq(index).find(".soal-text").val(question.question_text)
          $(".question").eq(index).find(".correct-answer").val(pilgan_answers[0].answer)
          $(".question").eq(index).find(".wrong-answer").each(function(idx){
            $(this).val(pilgan_answers[idx+1].answer)
          })

          // Image Processing
          pilgan_answers.forEach(async(answer, idx) => {
            if(answer.image){
              await getImgBlob(answer.image).then(blob => {
                let file = new File([blob], "image", {type: blob.type})
                const container = new DataTransfer();
                container.items.add(file);
                $(".answers").eq(index).find(".input-file-answer").eq(idx)[0].files = container.files;
                displayAnswerImage()
              })
            }
          })
        }
        // Initialize Question Tipe Kartu
        if(question.question_type == "kartu"){
          let card_answers = JSON.parse(question.card_answers)
          addMoreQuestion(question_card, index+1)
          $(".question").eq(index).find(".soal-text").val(question.question_text)
          card_answers.answers.reverse().forEach((card,idx) => {
            $(".question").eq(index).find(".answers-card").prepend(`
              <div class="answer-card">
                <div class="answer-card-head">
                  <span>#${card_answers.answers.length - idx}</span>
                  <i class="uil uil-draggabledots"></i>
                  <span style="color:transparent">#1</span>
                </div>
                <div class="answer-card-input">
                  <input name="kartu" required type="text" placeholder='Kartu' value="${card.value}"/>
                  <div class="delete-card">x</div>
                </div>
              </div>
            `)
          })
          initializeSortable()
        }

        // Image processing
        if(question.question_img){
          await getImgBlob(question.question_img).then((blob) => {
            let file = new File([blob], "image", {type: blob.type})
            const container = new DataTransfer();
            container.items.add(file);
            $(".input-file").eq(index)[0].files = container.files;
            displayQuestionImage()
          });
        }
      })
    }
  });









  //ASSIGN
  $.get("/api/scores", async (data, status) => {
    if (status == "success" && data.payload.datas.length !== 0) {
      let index = 0;
      users = data.payload.datas;
      if (status == "success" && data.payload.datas.length !== 0) {
        $("#assign-table").DataTable({
          ajax: {
            url: "/api/scores",
            dataSrc: "payload.datas",
          },
          pageLength: -1,
          lengthMenu: [[-1], ["Semua"]],
          columns: [
            {
              data: null,
              width: "8%",
              render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
              },
            },
            { data: "nis" },
            { data: "username" },
            { data: "class" },
            { data: "major" },
            {
              data: "unique_id",
              // width: "20%",
              render: function (data, type, row, meta) {
                index = meta.row + meta.settings._iDisplayStart;
                let score = users[index];
                let score_id = score.unique_id;
                let score_exam = score.Exams.map((e) => {
                  if (score.Exams.length == 0)
                    return `<input type="checkbox" name="${score_id}" class="checkbox-delete" value="off" />`;
                  return e.unique_id;
                });
                let this_exam = unique_id;
                if (score_exam.includes(this_exam)) {
                  return `<input type="checkbox" name="${score_id}" class="checkbox-delete" value="on" checked />`;
                } else {
                  return `<input type="checkbox" name="${score_id}" class="checkbox-delete" value="off" />`;
                }
              },
            },
          ],
          initComplete: function () {
            $(".assign-bg").on("change", ".checkbox-delete", function () {
              if (!$(this).is(":checked")) {
                let name = $(this).attr("name");
                $(this).html(
                  `<input type="hidden" name="${name}" id="" value="off" />`
                );
              } else {
                $(this).val("on");
              }
            });
            let checkedSiswa = document.querySelectorAll(
              'input[type="checkbox"]:checked'
            ).length;
            $(".checkedSiswaExam").html(checkedSiswa + " Siswa");

            // SelectALL
            $("#selectAll").on("click", function () {
              if (this.checked) {
                // Iterate each checkbox
                $(":checkbox").each(function () {
                  this.checked = true;
                  $(this).val("on");
                });
              } else {
                $(":checkbox").each(function () {
                  this.checked = false;
                  let name = $(this).attr("name");
                  $(this).html(
                    `<input type="hidden" name="${name}" id="" value="off" />`
                  );
                });
              }
            });
          },
        });
      }
    } else {
      $("#assign-table").remove();
      $(".assign-bg-head").remove();
      $(".assign-bg").append([
        `
        <div class="nothing">
          <img src="/img/nothing.png" alt="" />
          <p>Belum ada siswa</p>
        </div>
          `,
      ]);
    }
  });

  $(".main-background").on("click", ".delete-quest", function () {
    $(this).parent().remove();
    let deleted = $(this).parent().find('input[name="row_id"]').val();
    let index = question_id.indexOf(deleted);
    if (index !== -1) {
      question_id.splice(index, 1);
    }
  });
  $(".main-background").on("click", "#selesai", () => {
    $(".submit-layer").css("visibility", "visible");
  });
  $(".ubah-button").on("click", () => {
    $(".submit-layer").css("visibility", "hidden");
  });

  $(".main-background").on("click", "#selesai-hapus", () => {
    $(".submit-hapus").css("visibility", "visible");
  });
  $(".ubah-button").on("click", () => {
    $(".submit-hapus").css("visibility", "hidden");
  });

  $(".file-toolarge button").on("click", (e) => {
    e.preventDefault();
    $(".file-layer").css("visibility", "hidden");
  });
  $("#complete-upload").on("click", function (e) {
    e.preventDefault();
    window.location = "/ujian";
  });
  $("#complete-hapus").on("click", function (e) {
    e.preventDefault();
    window.location = "/ujian";
  });
  $(".main-background").on("click", ".answer-card-add", function () {
    $(this)
      .parent()
      .prepend([
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
        </div>`,
      ]);
    $(this)
      .parent()
      .find(".answer-card")
      .each(function (index) {
        $(this)
          .find("span")
          .html(`#${index + 1}`);
      });
  });
  $(".main-background").on("mouseover", ".answer-card", function () {
    $(this).find(".delete-card").css("visibility", "visible");
  });
  $(".main-background").on("mouseleave", ".answer-card", function () {
    $(this).find(".delete-card").css("visibility", "hidden");
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
  $(".assign-bg .close").click(function () {
    $(".assign-layer").css("visibility", "hidden");
  });
  $(".edit-button").click(function () {
    $(".assign-layer").css("visibility", "visible");
  });

  // IMAGE INPUT
  $(".main-background").on("change", ".input-file", displayQuestionImage);

  $(".main-background").on("change", ".input-file-answer", function () {
    queuedImagesArrayAnswer = [];
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

  // UPDATE FORM SUBMIT
  const manualForm = document.getElementById("submit-form");
  manualForm.addEventListener("submit", (e) => {
    let formData = new FormData(manualForm);
    formData.append("exam_unique_id", unique_id);
    formData.append("question_unique_id", question_id);
    formData.append("index_deleted", question_with_img);
    formData.append("card_answers", JSON.stringify(allDataArray));
    formData.append("question_type", question_type)
    e.preventDefault();
    $.ajax({
      url: "/api/exams",
      type: "PUT",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        $(".submit-layer").css("visibility", "hidden");
        if (response.payload.status_code == 200) {
          $(".complete-layer").removeClass("hide");
          $(".complete-layer").css("visibility", "visible");
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });

  const deleteForm = document.getElementById("hapus-ujian");
  deleteForm.addEventListener("submit", (e) => {
    let formData = new FormData(deleteForm);
    formData.append("exam_unique_id", unique_id);
    e.preventDefault();
    $.ajax({
      url: "/api/exams",
      type: "DELETE",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      encrypt: "multipart/form-data",
      processData: false,
      success: (response) => {
        $(".submit-hapus").css("visibility", "hidden");
        if (response.payload.status_code == 200) {
          $(".complete-layer-hapus").removeClass("hide");
          $(".complete-layer-hapus").css("visibility", "visible");
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });

 
});
