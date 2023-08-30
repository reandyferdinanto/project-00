module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define("Score", {
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
    role: DataTypes.STRING
  });
  return Score;
};
