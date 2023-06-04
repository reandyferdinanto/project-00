module.exports = (sequelize, DataTypes) => {
  const ScoreExams = sequelize.define("ScoreExam", {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    point: DataTypes.INTEGER,
    remedial_point: DataTypes.INTEGER,
  });
  return ScoreExams;
};
