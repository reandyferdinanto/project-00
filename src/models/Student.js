module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define("Student", {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    nis: DataTypes.STRING,
    username: DataTypes.STRING,
    class: DataTypes.STRING,
    major: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    gender: DataTypes.STRING,
    school_id: DataTypes.STRING,
    school_name: DataTypes.STRING,
    login_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  });
  return Student;
};
