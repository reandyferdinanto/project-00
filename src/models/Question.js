module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define(
    "Question",
    {
      unique_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      question_text: DataTypes.STRING,
      question_img: DataTypes.STRING,
      answer: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
  return Questions;
};
