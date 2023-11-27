import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
  Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyGetAssociationsMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Exam from "./Exam";
import StudentExam from "./StudentExam";

class Student extends Model {
  declare unique_id: CreationOptional<number>;
  declare nis: string;
  declare username: string;
  declare class: string;
  declare major: string;
  declare password: string;
  declare role: string;
  declare gender: string;
  declare school_id: string;
  declare school_name: string;
  declare login_status: string;

  declare getExams: BelongsToManyGetAssociationsMixin<Exam>

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Student.init(
  {
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

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "student", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

Student.belongsToMany(Exam, {
  foreignKey: "score_id",
  through: StudentExam,
  constraints: false,

})
Exam.belongsToMany(Student, {
  foreignKey: "exam_id",
  through: StudentExam,
  constraints: false
})

export default Student;