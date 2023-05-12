module.exports = (sequelize, DataTypes) => {
  const ScoreExams = sequelize.define(
    "ScoreExam",
    {
      unique_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );
  return ScoreExams;
};
