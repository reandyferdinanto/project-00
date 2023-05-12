module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define(
    "Question",
    {
      unique_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      question_text: DataTypes.STRING,
      question_img: DataTypes.STRING,
      answer: DataTypes.STRING,
      wrong_answer1: DataTypes.STRING,
      wrong_answer2: DataTypes.STRING,
      wrong_answer3: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
  return Questions;
};
