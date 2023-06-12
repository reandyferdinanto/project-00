$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  let question_with_img = [];

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
      for (const [index, quest] of datas.Questions.entries()) {
        question_id.push(quest.unique_id);
        let w_ans = quest.wrong_answer.split("|");
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
                <input type="hidden" name="row_id" class="row_id" value="${
                  quest.unique_id
                }">
                <label class="custom-file-upload">
                  <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
                </label>
              </div>
              <div class="delete-quest" title="Hapus Soal" >
                <span><i class="uil uil-trash-alt"></i></span>
              </div>
            </div>`,
        ]);
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

  let queuedImagesArray = [];

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
