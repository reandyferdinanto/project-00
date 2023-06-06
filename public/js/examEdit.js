$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  let unique_id = window.location.href.substring(
    window.location.href.lastIndexOf("/") + 1
  );
  let url_input = `/api/exams/${unique_id}`;
  let question_id = [];
  $.get(url_input, async (data, status) => {
    let datas = data.payload.datas;
    if (status == "success" && datas.length !== 0) {
      $("#exam_name").val(datas.exam_name);
      $("#exam_type").val(datas.exam_type).change();
      $("#kkm_point").val(datas.kkm_point);
      $("#available_try").val(datas.available_try);
      //   QUESTION

      datas.Questions.forEach((quest, index) => {
        question_id.push(quest.unique_id);
        let w_ans = quest.wrong_answer.split(",");
        $(".questions").append([
          `
            <div class="question">
              <p>Soal ${index + 1}</p>
              <div class="display_image"></div>
              <textarea name="question_text" class='soal-text' placeholder="Masukan Soal">${
                quest.question_text
              }</textarea>
              <div class="answers">
                <input placeholder='jawaban benar' name='correct_answer' class='answer' required value="${
                  quest.correct_answer
                }"/>
                <input placeholder='jawaban lain' name='wrong_answer' class='answer' required value="${
                  w_ans[0]
                }"/>
                <input placeholder='jawaban lain' name='wrong_answer' class='answer' required value="${
                  w_ans[1]
                }"/>
                <input placeholder='jawaban lain' name='wrong_answer' class='answer' required value="${
                  w_ans[2]
                }"/>
                <input placeholder='jawaban lain' name='wrong_answer' class='answer' required value="${
                  w_ans[3]
                }"/>
                <label class="custom-file-upload">
                  <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/jpg, image/png"/>
                  <i class="uil uil-file-plus-alt"></i> Masukan Gambar
                </label>
              </div>
              <div class="delete-quest" title="Hapus Soal" >
                <span><i class="uil uil-trash-alt"></i></span>
              </div>
            </div>`,
        ]);
        // IMG PROCESS
        let img = "";
        if (quest.question_img !== null) {
          img = `
              <img src="${quest.question_img}" alt="no img" />
              `;
        } else {
          img = "";
        }
        document.querySelectorAll(".display_image")[index].innerHTML = img;
      });
    }
  });

  $(".main-background").on("click", ".delete-quest", function () {
    $(this).parent().remove();
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

  // IMAGE INPUT
  $(".main-background").on("change", ".input-file", function () {
    let input_file = document.querySelectorAll(".input-file");
    queuedImagesArray = [];
    input_file.forEach((inp, index) => {
      queuedImagesArray.push(input_file[index].files);
    });
    displayQueuedImages();
  });

  let queuedImagesArray = [];

  function displayQueuedImages() {
    let img = "";
    queuedImagesArray.forEach((image, index) => {
      if (image.length != 0) {
        img = `
          <img src="${URL.createObjectURL(image[0])}" alt="no img" />
          <span class="deleteImg">&times;</span>
          `;
      } else {
        img = "";
      }
      document.querySelectorAll(".display_image")[index].innerHTML = img;
    });
  }

  $(".main-background").on("click", ".deleteImg", function (e) {
    let input_file = document.querySelectorAll(".input-file");
    let index = $(".deleteImg").index($(this));
    input_file[index].type = "text";
    input_file[index].type = "file";
    $(this)[0].parentElement.innerHTML = "";
  });

  // UPDATE FORM SUBMIT
  const manualForm = document.getElementById("submit-form");
  manualForm.addEventListener("submit", (e) => {
    let formData = new FormData(manualForm);
    formData.append("exam_unique_id", unique_id);
    formData.append("question_unique_id", question_id);
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
        if (response.payload.status_code == 200) {
          window.location = "/ujian";
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
        if (response.payload.status_code == 200) {
          window.location = "/ujian";
        }
      },
    });
  });
});
