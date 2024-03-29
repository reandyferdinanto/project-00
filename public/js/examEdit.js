$(document).ready(() => {
  $('#side-ujian').addClass('sidelist-selected')
  $('form').bind("keypress", function(e) {
    if (e.keyCode == 13) {               
        e.preventDefault();
        return false;
    }
  });

  const USER_ID = $("#user_id").text()
  let SCHOOL_ID
  $.get(`/api/v1/admins/${USER_ID}`, function(data) {
    SCHOOL_ID = data.datas.school_id
  })

  const d = new Date();
  $("#date").html(d.toLocaleString("id-ID", {
    dateStyle: "medium",
  }));


  let question_with_img = [];
  let queuedImagesArrayAnswer = [];
  let allImage = []
  let users;
  let unique_id = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );
  let question_id = [];
  let all_question_id = [];
  let allDataArray = [];
  let tempArray = [];
  let question_type = []
  let introTampil = false
  let question_pilgan = `
  <div class="question_pilgan text-main">  
    <div class="display_image"></div>
    <div class="question-text-container">
      <textarea data-max-words="2" name="question_text" class='soal-text p-4' placeholder="Masukan Soal" required></textarea>
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
          <label class="custom-file-upload-question divide-x divide-white-60">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v" style="color:white"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer wrong-answer'/>
          <label class="custom-file-upload-question divide-x divide-main">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer wrong-answer'/>
          <label class="custom-file-upload-question divide-x divide-main">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer wrong-answer'/>
          <label class="custom-file-upload-question divide-x divide-main">
            <input type="file" class="input-file-answer" multiple="multiple" name="" accept="image/*"/>
            <i class="uil uil-image-v"></i>
          </label>
        </div>
        <div class="display_image_answer"></div>
      </div>
      <div class="answer-container">
        <div class="answer-container-flex">
          <input placeholder='jawaban lain' name='wrong_answer' class='answer wrong-answer'/>
          <label class="custom-file-upload-question divide-x divide-main">
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
    <div class="question_kartu text-main">  
      <div class="display_image"></div>
      <div class="question-text-container">
        <textarea data-max-words="2" name="question_text" class='soal-text p-4' placeholder="Masukan Soal" required></textarea>
        <div class="upload-img">
          <label class="custom-file-upload">
            <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
            <i class="uil uil-file-plus-alt"></i> Masukan Gambar
          </label>
          <p>*PNG/JPG/JPEG max. 200 kb</p>
        </div>
      </div>
      <div class="answers-card answers">
        <div class="answer-card-add">
          <img src="/img/plus.png" alt="" width="40" />
        </div>
      </div>
    </div>
  `;

  // Initialize Exam
  $.get(`/api/v1/exams/${unique_id}`, async (exams, status) => {
    let exams_data = exams.datas;
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
        all_question_id.push(question.unique_id)
        // add all question image to array
        addImageToList(question.question_img)
        // Initialize Question Pilihan Ganda
        
        if (question.question_type == "pilihan_ganda"){
          let pilgan_answers = question.pilgan_answers
          addMoreQuestion(question_pilgan, index+1)

          $(".question").eq(index).find(".soal-text").val(question.question_text)
          $(".question").eq(index).find(".correct-answer").val(pilgan_answers[0].answer)
          $(".question").eq(index).find(".wrong-answer").each(function(idx){
            $(this).val(pilgan_answers[idx+1].answer)
          })

          // Image Processing
          pilgan_answers.forEach(async(answer, idx, array) => {
            if(answer.image){
              await getImgBlob(answer.image).then(blob => {
                let file = new File([blob], "image", {type: blob.type})
                const container = new DataTransfer();
                container.items.add(file);
                $(".answers").eq(index).find(".input-file-answer").eq(idx)[0].files = container.files;
                displayAnswerImage()
              })
              // add all answer image to array
              addImageToList(answer.image)
            }
          })
        }
        // Initialize Question Tipe Kartu
        if(question.question_type == "kartu"){
          let card_answers = question.card_answers
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
  $.get("/api/v1/students", async (data, status) => {
    if (status == "success" && data.datas.length !== 0) {
      let index = 0;
      users = data.datas;
      if (status == "success" && data.datas.length !== 0) {
        $("#assign-table").DataTable({
          ajax: {
            url: "/api/v1/students",
            dataSrc: function(json){
              let filteredData = json.datas.filter(function (data) {
                return data.school_id === SCHOOL_ID;
              });
              return filteredData;
            },
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
    let index_deleted = $(".delete-quest").index($(this));
    question_id.splice(index_deleted, 1);
    $(this).parent().remove();
    $(".question").each(function(idx){
      $(this).find(".question-head-info p b").html(`Soal ${idx+1}`)
    })
  });
  $(".main-background").on("click", "#selesai", () => {
    $("#popup").removeClass("hidden")
    $("#submit-popup").removeClass("hidden")
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
    let checkedSiswa = document.querySelectorAll(
      '.checkbox-delete:checked'
    ).length;
    $(".checkedSiswaExam").html(checkedSiswa + " Siswa");
  });
  $(".edit-button").click(function () {
    $(".assign-layer").css("visibility", "visible");
    if(!introTampil){
      let assign_intro = initializeIntro({
        dontShowAgainCookie: "examEdit_intro",
        dontShowAgain: true,
        dontShowAgainLabel: "Jangan tampilkan lagi",
        tooltipClass: "customTooltip",
        prevLabel: "Kembali",
        nextLabel: "Lanjut",
        doneLabel: "Selesai",
        steps: [
          {
            element: ".checkbox-delete",
            intro: "Guru dapat menekan tombol ini untuk memilih siswa yang mengikuti ujian ",
          },
          {
            element: "#selectAll",
            intro:"Tombol ini berfungsi untuk memilih semua siswa yang ditampilkan pada tabel sebagai siswa yang mengikuti ujian.",
          },
          {
            element: ".close",
            intro:"bila sudah selesai memilih dapat menekan tombol ini, dan jangan lupa simpan perubahan dengan menekan tombol simpan dibagian bawah",
          },
        ],
      });
      assign_intro.start();
      introTampil = true
    }
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


  $("#button-delete").click(function(){
    $("#popup").removeClass('hidden')
    $("#delete-popup").removeClass('hidden')
  })
  $("#delete-popup .button-hapus").click(function(){
    $("#form-hapus-ujian").submit(function(e){
      e.preventDefault()
      let formData = new FormData(this);
      formData.append("allImage", allImage);
      formData.append("question_unique_id", question_id);
      $.ajax({
        url: `/api/v1/exams/${unique_id}`,
        type: "DELETE",
        data: formData,
        contentType: false,
        enctype: "multipart/form-data",
        processData: false,
        success: function (response) {
          if (response.status_code == 200) {
            $("#delete-popup").addClass("hidden")
            $("#confirm-hapus-popup").removeClass("hidden")
          } else if (response.message == "you're not authenticated") {
            window.location = "/login";
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
    })
    $("#form-hapus-ujian").submit()
  })
  $("#delete-popup .button-batal").click(function(){
    $("#popup").addClass("hidden")
    $("#delete-popup").addClass("hidden")
  })
  $("#confirm-hapus-popup button").click(function(){
    window.location = '/ujian'
  })

  $("#submit-popup .button-batal").click(function(){
    $("#popup").addClass("hidden")
    $("#submit-popup").addClass("hidden")
  })

  $("#confirm-popup button").click(function(){
    window.location = "/ujian"
  })

  // UPDATE FORM SUBMIT
  $("#form-submit-exam").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData(this);
    formData.append("exam_unique_id", unique_id);
    formData.append("question_unique_id", question_id);
    formData.append("all_question_id", all_question_id);
    formData.append("index_deleted", question_with_img);
    formData.append("card_answers", JSON.stringify(allDataArray));
    formData.append("question_type", question_type)
    formData.append("allImage", allImage)
  
    $.ajax({
      url: `/api/v1/exams/${unique_id}`,
      type: "PUT",
      data: formData,
      contentType: false,
      enctype: "multipart/form-data",
      processData: false,
      success: function (response) {
        if (response.status_code == 200) {
          $("#submit-popup").addClass("hidden")
          $("#confirm-popup").removeClass("hidden")
        }
      },
      error: function (data, status, error) {
        const ErrorMessage = `<div id="ErrorMessage" class="bg-red-500/80 fixed top-8 left-1/2 -translate-x-1/2 min-w-[400px] text-center py-1.5 rounded-lg border border-red-900 text-[#000] text-sm z-10">${status}: ${data.responseJSON.datas.error}</div>`
        $("body").prepend(ErrorMessage)
        $("#ErrorMessage")
          .delay(3000)
          .fadeOut("slow", function () {
            $(this).remove();
          });
      },
    });
  });

  $("#file-large-popup button").click(function(){
    $("#file-large-popup").addClass("hidden")
    $("#popup").addClass("hidden")
  })




  
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
    question_with_img = []
    $(".input-file").each(function(idx){
      if($(this)[0].files[0]){
        if($(this)[0].files[0].size < 1000000){
          question_with_img.push(idx)
          $(".display_image").eq(idx).css('display', 'flex')
          $(".display_image").eq(idx).html(`
            <img src="${URL.createObjectURL($(this)[0].files[0])}" alt="no img" />
            <span title="Hapus Gambar" class="deleteImg"><i class="uil uil-times"></i></span>
          `)
        }else{
          $(this).val("")
          $("#popup").removeClass("hidden")
          $("#file-large-popup").removeClass("hidden")
          $(".display_image").eq(idx).css('display', 'flex')
          $(".display_image").eq(idx).html(`
            <img src="" alt="no img" />
            <span title="Hapus Gambar" class="deleteImg"><i class="uil uil-times"></i></span>
          `)
        }
      };
    })
  }
  function displayAnswerImage() {
    $(".answers").each(function(idx){;
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
    $.get("/api/v1/topic", async (exam_types, status) => {
      if (status == "success" && exam_types.datas.length !== 0) {
        exam_types.datas.forEach((exam_type) => {
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
    const questionId = "card_" + index;
    $(".question:last-child").attr("data-question-id", questionId);
  }
  function addImageToList(image){
    if(image){
      const urlParts = image.split('/');
      const fileName = urlParts[urlParts.length - 1];
      allImage.push(fileName)
    }
  }




  let first_intro = initializeIntro({
    dontShowAgainCookie: "examEdit_intro",
    dontShowAgain: true,
    dontShowAgainLabel: "Jangan tampilkan lagi",
    tooltipClass: "customTooltip",
    prevLabel: "Kembali",
    nextLabel: "Lanjut",
    doneLabel: "Selesai",
    steps: [
      {
        title: "Edit Ujian",
        intro: "Halaman ini berfungsi untuk mengubah soal ujian yang telah ada. Tampilan pada halaman ini mirip seperti pada saat membuat ujian baru sehingga guru dapat langsung mengubah soal yang diinginkan.",
      },
      {
        element: "#selesai-hapus",
        intro: "terdapat pula tombol hapus pada halaman ini bila ingin menghapus ujian yang telah dibuat.",
        position: "left"
      },
      {
        element: ".assign-button",
        intro:"Guru dapat mengedit kepada siapa saja ujian diberikan dengan menekan ikon pensil.",
      },
    ],
  });
  first_intro.start();
});



