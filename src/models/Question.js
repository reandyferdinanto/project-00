module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define("Question", {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    question_type: DataTypes.STRING,
    question_text: DataTypes.TEXT,
    question_img: DataTypes.STRING,
    pilgan_answers: DataTypes.TEXT,
    card_answers: DataTypes.TEXT,
  });
  return Questions;
};
