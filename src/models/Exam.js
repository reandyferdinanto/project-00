module.exports = (sequelize, DataTypes) => {
  const Exams = sequelize.define("Exam", {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    exam_name: DataTypes.STRING,
    exam_type: DataTypes.STRING,
    kkm_point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    available_try: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
  });
  return Exams;
};
