module.exports = (sequelize, DataTypes) => {
  const Exams = sequelize.define(
    "Exam",
    {
      unique_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      exam_name: DataTypes.STRING,
      exam_type: DataTypes.STRING,
      kkm_point: DataTypes.STRING,
      available_try: DataTypes.STRING,
      number_of_try: DataTypes.INTEGER,
    },
    {
      timestamps: false,
    }
  );
  return Exams;
};
