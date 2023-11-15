module.exports = (sequelize, DataTypes) => {
    const Metric = sequelize.define("Metric", {
        student_counter: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        student_login: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        exam_counter: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    });
    return Metric;
};
  