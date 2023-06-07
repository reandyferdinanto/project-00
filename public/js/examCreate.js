$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  // ADD SOAL
  $("#add-question").on("click", () => {
    $("#add-question").remove();
    $("#submit-form").append([
      `
        <div class="questions-box">
          <div class="questions">
            <div class="question">
              <p>Soal</p>
              <div class="display_image"></div>
              <textarea name="question_text" class='soal-text' placeholder="Masukan Soal"></textarea>
              <div class="answers">
                <input placeholder='jawaban benar' name='correct_answer' required class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer' required class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer' required class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer' required class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer' required class='answer'/>
                <label class="custom-file-upload">
                    <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
                    <i class="uil uil-file-plus-alt"></i> Masukan Gambar
                </label>
              </div>
              <div class="delete-quest" title="Hapus Soal">
                <span><i class="uil uil-trash-alt"></i></span>
              </div>
            </div>
          </div>
          <div class="add-more">
            <button id="add-more" type="button">Tambah Soal</button>
          </div>
        </div>
        <div class="submit-input">
          <button type="button" id="selesai">Selesai</button>
        </div>
        `,
    ]);
  });

  // ADD MORE

  $(".main-background").on("click", "#add-more", () => {
    $(".questions").append([
      `
          <div class="question">
            <p>Soal</p>
            <div class="display_image"></div>
            <textarea name="question_text" class='soal-text' placeholder="Masukan Soal"></textarea>
            <div class="answers">
                <input placeholder='jawaban benar' name='correct_answer'required class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer'required class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer'required class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer'required class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer'required class='answer'/>
                
                <label class="custom-file-upload">
                      <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/*"/>
                      <i class="uil uil-file-plus-alt"></i> Masukan Gambar
                </label>
            </div>
            <div class="delete-quest" title="Hapus Soal" >
              <span><i class="uil uil-trash-alt"></i></span>
            </div>
          </div>
        `,
    ]);
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
  $(".file-toolarge button").on("click", (e) => {
    e.preventDefault();
    $(".file-layer").css("visibility", "hidden");
  });

  // IMAGE INPUT
  $(".main-background").on("change", ".input-file", function () {
    let input_file = document.querySelectorAll(".input-file");
    queuedImagesArray = [];
    input_file.forEach((inp, index) => {
      if (input_file[index].files[0] == undefined) {
        queuedImagesArray.push(input_file[index].files);
      } else if (input_file[index].files[0]) {
        if (input_file[index].files[0].size < 200000) {
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
    console.log(queuedImagesArray);
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

  $(".main-background").on("click", ".deleteImg", function (e) {
    let input_file = document.querySelectorAll(".input-file");
    let index = $(".display_image").index($(this).parent());
    input_file[index].type = "text";
    input_file[index].type = "file";
    $(this)[0].parentElement.innerHTML = "";
    document.querySelectorAll(".display_image")[index].style.display = "none";
    // console.log($(".display_image"));
    // console.log($(this).parent());
    // console.log($(".display_image").index($(this).parent()));
  });
});
