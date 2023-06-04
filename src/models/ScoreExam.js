module.exports = (sequelize, DataTypes) => {
  const ScoreExams = sequelize.define("ScoreExam", {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remedial_point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    number_of_try: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  return ScoreExams;
};
