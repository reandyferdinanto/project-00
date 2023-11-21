import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
  Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Exam from "./Exam";
import PilganAnswer from "./PilganAnswer";
import CardAnswer from "./CardAnswer";

class Question extends Model {
  declare unique_id: CreationOptional<number>;
  declare question_type: string;
  declare question_text: string;
  declare question_img: string;

  declare ownerId: ForeignKey<Exam['unique_id']>;


  
  declare addPilgan_answer: HasManyAddAssociationMixin<PilganAnswer,number>
  declare addPilgan_answers: HasManyAddAssociationsMixin<PilganAnswer, number>
  declare hasPilgan_answer: HasManyHasAssociationMixin<PilganAnswer, number>
  declare removePilgan_answers: HasManyRemoveAssociationsMixin<PilganAnswer,number>
  declare getPilgan_answers: HasManyGetAssociationsMixin<PilganAnswer>
  declare setPilgan_answers: HasManySetAssociationsMixin<PilganAnswer,number>

  declare createCard_answer: HasOneCreateAssociationMixin<CardAnswer>
  declare getCard_answers: HasOneGetAssociationMixin<CardAnswer>
  declare setCard_answers: HasOneSetAssociationMixin<CardAnswer,number>

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Question.init(
  {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    question_type: DataTypes.STRING,
    question_text: DataTypes.TEXT,
    question_img: DataTypes.STRING,

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "question", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

Question.hasMany(PilganAnswer,{
  as: "pilgan_answers",
  sourceKey: 'unique_id',
  foreignKey: "ownerId",
  constraints: false,
})
Question.hasOne(CardAnswer,{
  as: "card_answers",
  sourceKey: 'unique_id',
  foreignKey: "ownerId",
  constraints: false,
})

export default Question;
