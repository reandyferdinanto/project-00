$(document).ready(() => {
  const d = new Date();
  let text;
  text = d.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
  $("#date").html(text);

  const url = "/api/exams";
  let datas;
  $.get(url, async (data, status) => {
    if (status == "success") {
      $(".main-table-body").html("");
      $(".main-table-body").css({
        "text-align": "left",
        // padding: "0.5rem 2rem",
        margin: ".5rem 2rem",
      });
      datas = data.payload.datas;
      datas.map((data, index) => {
        $(".main-home").prepend([
          `
              <a href="/ujian" class="tambah-ujian">
                <div class="ujian">
                  <p>Ujian</p>
                  <p><b>${data.exam_name}</b></p>
                </div>
              </a>
              `,
        ]);
      });
    }
  });
});
