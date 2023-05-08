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
      exam_type: DataTypes.STRING,
      kkm_point: DataTypes.STRING,
      point: DataTypes.INTEGER,
      remedial_point: DataTypes.INTEGER,
      available_try: DataTypes.STRING,
      number_of_try: DataTypes.INTEGER,
    },
    {
      timestamps: false,
    }
  );
  return Score;
};
