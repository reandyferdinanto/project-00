module.exports = (sequelize, DataTypes) => {
  const ExamType = sequelize.define("ExamType", {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    exam_type: DataTypes.STRING,
    tanggal_dibuat: DataTypes.STRING,
  });
  return ExamType;
};
