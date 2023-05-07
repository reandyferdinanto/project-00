module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define(
    "Score",
    {
      unique_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      username: DataTypes.STRING,
      class: DataTypes.STRING,
      point: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
  return Score;
};
