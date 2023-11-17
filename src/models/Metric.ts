import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Question from "./Question";
import Student from "./Student";
import MetricSchool from "./MetricSchool";

class Metric extends Model {
  declare unique_id: CreationOptional<number>;
  declare total_student: number;
  declare total_login: number;
  declare total_exam: number;

  declare addMetric_school: HasManyAddAssociationMixin<MetricSchool, number>;
  declare hasMetric_school: HasManyHasAssociationMixin<MetricSchool,number>

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Metric.init(
  {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    total_student: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_exam: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total_login: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "metric", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

Metric.hasMany(MetricSchool,{
  sourceKey:"unique_id",
  foreignKey: "ownerId",
  constraints: false,
  as: "metric_school"
})
  
export default Metric;