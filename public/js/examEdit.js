$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  let question_with_img = [];
  let users;
  let unique_id = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );
  let url_input = `/api/exams/${unique_id}`;
  let question_id = [];
  let queuedImagesArray = [];
  let allDataArray = [];

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
  function displayQueuedImages() {
    let img = "";
    queuedImagesArray.forEach((image, index) => {
      if (image.length !== 0) {
        const file = document.querySelectorAll(".input-file")[index].files[0];
        if (file && file.type.includes("image/")) {
          img = `
            <img src="" alt="no img" />
            <span title="Hapus Gambar" class="deleteImg"><i class="uil uil-times"></i></span>
          `;
          let displayImageContainer =
            document.querySelectorAll(".display_image")[index];
          displayImageContainer.style.display = "flex";
          displayImageContainer.innerHTML = img;
          let reader = new FileReader();
          reader.onload = function (e) {
            displayImageContainer.querySelector("img").src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    });
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

  // INIT
  $.get(url_input, async (data, status) => {
    let datas = data.payload.datas;
    // EXAM_TYPE
    $.get("/api/exam_type", async (data, status) => {
      if (status == "success" && data.payload.datas.length !== 0) {
        let exam_datas = data.payload.datas;
        exam_datas.forEach((data) => {
          $(".exam-type").append([
            `
        <option value="${data.exam_type.toLowerCase()}">${
              data.exam_type.charAt(0).toUpperCase() + data.exam_type.slice(1)
            }</option>
        `,
          ]);
          $("#exam_type").val(datas.exam_type).change();
        });
      }
    });
    if (status == "success" && datas.length !== 0) {
      $("#exam_name").val(datas.exam_name);
      $("#kkm_point").val(datas.kkm_point);
      $("#available_try").val(datas.available_try);
      //   QUESTION
      for (const [index, quest] of datas.Questions.entries()) {
        question_id.push(quest.unique_id);
        if (quest.question_type == "pilihan_ganda") {
          let pilgan_answers = JSON.parse(quest.pilgan_answers);
          let wrong_answer = pilgan_answers.wrong_answer.split("|");
          let correct_answer = pilgan_answers.correct_answer;
          let question_pilgan = `
            <div class="question_pilgan">  
            <div class="display_image"></div>
            <textarea name="question_text" class='soal-text' placeholder="Masukan Soal">${quest.question_text}</textarea>
            <input type="hidden" name="question_type" value="pilihan_ganda">
            <div class="answers">
              <input placeholder='jawaban benar' name='correct_answer' class='answer' required value="${correct_answer}"/>
              <input placeholder='jawaban lain' name='wrong_answer' class='answer' required value="${wrong_answer[0]}"/>
              <input placeholder='jawaban lain' name='wrong_answer' class='answer' required value="${wrong_answer[1]}"/>
              <input placeholder='jawaban lain' name='wrong_answer' class='answer' required value="${wrong_answer[2]}"/>
              <input placeholder='jawaban lain' name='wrong_answer' class='answer' required value="${wrong_answer[3]}"/>
              <input type="hidden" name="row_id" class="row_id" value="${quest.unique_id}">
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
          $(".questions").append([
            `
            <div class="question">
              <div class="question-head">
                <div class="question-head-info">
                  <p><b>Soal ${index + 1}</b></p>
                </div>
              </div>
              ${question_pilgan}
              <div class="delete-quest" title="Hapus Soal" >
                <span><i class="uil uil-trash-alt"></i></span>
              </div>
            </div>
            `,
          ]);
        } else if (quest.question_type == "kartu") {
          let card_answers = JSON.parse(quest.card_answers).answers;
          let question_card = `
            <div class="question_kartu">  
              <div class="display_image"></div>
              <textarea maxlength="300" data-max-words="2" name="question_text" class='soal-text' placeholder="Masukan Soal">${quest.question_text}</textarea>
              <div class="upload-img" style="margin-top:1rem">
                  <label class="custom-file-upload">
                      <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
                      <i class="uil uil-file-plus-alt"></i> Masukan Gambar
                  </label>
                  <p>*PNG/JPG/JPEG max. 200 kb</p>
              </div>
              <input type="hidden" name="question_type" value="kartu">
              <div class="answers-card">
                <div class="answer-card-add">
                  <img src="/img/plus.png" alt="" width="40" />
                </div>
              </div>
            </div>
          `;
          $(".questions").append([
            `
            <div class="question">
              <div class="question-head">
                <div class="question-head-info">
                  <p><b>Soal ${index + 1}</b></p>
                </div>
              </div>
              ${question_card}
              <div class="delete-quest" title="Hapus Soal" >
                <span><i class="uil uil-trash-alt"></i></span>
              </div>
            </div>
            `,
          ]);
          card_answers.forEach((answer) => {
            $(".answers-card").prepend([
              `
              <div class="answer-card">
                <input  type="text" placeholder='Kartu' value="${answer.value}"/>
              </div>
              `,
            ]);
          });
          initializeSortable();
        }
        (async () => {
          try {
            const imageUrl = quest.question_img;
            getImgBlob(imageUrl).then((imgBlob) => {
              if (quest.question_img) {
                question_with_img.push(index);
                const fileName = "image.jpeg";
                const file = new File([imgBlob], fileName, {
                  type: "image/jpeg",
                  lastModified: new Date().getTime(),
                });
                const container = new DataTransfer();
                container.items.add(file);
                document.querySelectorAll(".input-file")[index].files =
                  container.files;
                queuedImagesArray.push(container.files);
                displayQueuedImages();
              } else {
                const fileName = "non-img.jpeg";
                const file = new File([imgBlob], fileName, {
                  type: "text/html",
                  lastModified: new Date().getTime(),
                });
                const container = new DataTransfer();
                container.items.add(file);
                queuedImagesArray.push(container.files);
                displayQueuedImages();
              }
            });
          } catch (error) {
            console.error("Error getting image blob:", error);
          }
        })();
      }
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
  $(".main-background").on("input", ".soal-text", function () {
    $(this)
      .parent()
      .find(".question-head .word-count")
      .html(`Jumlah kata: ${this.value.length} / 300`);
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
    $(".answers-card").prepend([
      `<div class="answer-card">
        <input  type="text" placeholder='Kartu'/>
      </div>`,
    ]);
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

  // UPDATE FORM SUBMIT
  const manualForm = document.getElementById("submit-form");
  manualForm.addEventListener("submit", (e) => {
    let formData = new FormData(manualForm);
    formData.append("exam_unique_id", unique_id);
    formData.append("question_unique_id", question_id);
    formData.append("index_deleted", question_with_img);
    formData.append("card_answers", JSON.stringify(allDataArray));
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
      beforeSend: function () {
        $(".load-layer-hapus").removeClass("hide");
        $(".submit-hapus").css("visibility", "hidden");
      },
      success: (response) => {
        $(".submit-hapus").css("visibility", "hidden");
        if (response.payload.status_code == 200) {
          $(".load-layer-hapus").addClass("hide");
          $(".complete-layer-hapus").removeClass("hide");
        } else if (response.payload.message == "you're not authenticated") {
          window.location = "/login";
        }
      },
    });
  });

  $(".assign-bg .close").click(function () {
    $(".assign-layer").css("visibility", "hidden");
  });
  $(".edit-button").click(function () {
    $(".assign-layer").css("visibility", "visible");
  });
});
