module.exports = (sequelize, DataTypes) => {
  const StudentExams = sequelize.define("StudentExam", {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    point: {
      type: DataTypes.TEXT,
    },
    number_of_try: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  return StudentExams;
};
