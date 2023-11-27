import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
  Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Question from "./Question";
import Student from "./Student";

class Exam extends Model {
  declare unique_id: CreationOptional<number>;
  declare exam_name: string
  declare exam_type: string
  declare kkm_point: number;
  declare available_try: number;
  declare school_id: string;
  declare school_name: string;

  // Mixin Gallery Has Many
  declare addQuestion: HasManyAddAssociationMixin<Question, number>
  declare addQuestions: HasManyAddAssociationsMixin<Question, number>
  declare hasQuestion: HasManyHasAssociationMixin<Question, number>
  declare removeQuestion: HasManyRemoveAssociationsMixin<Question,number>
  declare getQuestions: HasManyGetAssociationsMixin<Question>
  declare setQuestions: HasManySetAssociationsMixin<Question,number>

  // Mixin Gallery Has Many
  declare addStudents: BelongsToManyAddAssociationsMixin<Student, number>
  declare addStudent: BelongsToManyAddAssociationMixin<Student,number>
  declare hasStudent: BelongsToManyHasAssociationMixin<Student,number>
  declare removeStudent: BelongsToManyRemoveAssociationMixin<Student,number>

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  StudentExam: any;
}

Exam.init(
  {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    exam_name: DataTypes.STRING,
    exam_type: DataTypes.STRING,
    kkm_point: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    available_try: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
    school_id: DataTypes.STRING,
    school_name: DataTypes.STRING,

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "exam", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

Exam.hasMany(Question, {
  sourceKey: 'unique_id',
  foreignKey: "ownerId",
  constraints: false,
});

export default Exam;