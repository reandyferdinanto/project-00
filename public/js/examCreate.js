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
                <input placeholder='jawaban benar' name='correct_answer' class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
                <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
                <label class="custom-file-upload">
                    <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/jpg, image/png"/>
                    <i class="uil uil-file-plus-alt"></i> Masukan Gambar
                </label>
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
              <input placeholder='jawaban benar' name='correct_answer' class='answer'/>
              <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
              <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
              <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
              <input placeholder='jawaban lain' name='wrong_answer' class='answer'/>
              
              <label class="custom-file-upload">
                    <input type="file" class="input-file" multiple="multiple" name="question_img" accept="image/jpg, image/png"/>
                    <i class="uil uil-file-plus-alt"></i> Masukan Gambar
              </label>
            </div>
          </div>
        `,
    ]);
  });

  $(".main-background").on("click", "#selesai", () => {
    $(".submit-layer").css("visibility", "visible");
  });
  $(".ubah-button").on("click", () => {
    $(".submit-layer").css("visibility", "hidden");
  });

  // IMAGE INPUT
  $(".main-background").on("change", ".input-file", () => {
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
      img = `
        <img src="${URL.createObjectURL(image[0])}" alt="image" />
        <span onclick="deleteQueuedImage(${index});">&times;</span>
      `;
      document.querySelectorAll(".display_image")[index].innerHTML = img;
    });
  }
  function deleteQueuedImage(index) {
    queuedImagesArray.splice(index, 1);
    displayQueuedImages();
  }
});
