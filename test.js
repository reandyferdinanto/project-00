else if (question_type[index] == "kartu") {
  await Question.findOne({
    where: {
      unique_id: quest_id,
    },
  })
    .then(() => {
      let newCradAnswers = JSON.stringify(
        card_answers[card_answer_index]
      );
      card_answer_index += 1;
      return (newBody = {
        question_text: question_text[index],
        question_img: img,
        card_answers: newCradAnswers,
        question_type: question_type[index],
      });
    })
    .then((newBody) => {
      bulkNewBody.push(newBody);
    });
}