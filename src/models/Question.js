module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define("Question", {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    question_text: DataTypes.STRING,
    question_img: DataTypes.STRING,
    correct_answer: DataTypes.STRING,
    wrong_answer: DataTypes.STRING,
  });
  return Questions;
};
