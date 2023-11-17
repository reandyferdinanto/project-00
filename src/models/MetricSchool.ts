import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Question from "./Question";
import Student from "./Student";

class MetricSchool extends Model {
  declare unique_id: CreationOptional<number>;
  declare student_counter: number;
  declare login_counter: number;
  declare exam_counter: number;
  declare school_id: string;
  declare school_name: string;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

MetricSchool.init(
  {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    student_counter: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    exam_counter: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    login_counter: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    school_id: DataTypes.STRING,
    school_name: DataTypes.STRING,

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "metricschool", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);
  
export default MetricSchool;