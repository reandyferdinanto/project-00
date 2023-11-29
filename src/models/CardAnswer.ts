import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Question from "./Question";
import CardAnswerAnswer from "./CardAnswerAnswer";
  
  class CardAnswer extends Model {
    declare unique_id: CreationOptional<number>;
    declare questionId: string;
  
    declare ownerId: ForeignKey<Question['unique_id']>;

    declare addAnswers: HasManyAddAssociationsMixin<CardAnswerAnswer,number>
    declare setAnswers: HasManySetAssociationsMixin<CardAnswerAnswer,number>
    declare getAnswers: HasManyGetAssociationsMixin<CardAnswerAnswer>
  
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
  }
  
  CardAnswer.init(
    {
      unique_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      questionId:DataTypes.STRING,
  
      // timestamps
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "cardanswer", // Nama tabel di database
      sequelize, // Instance Sequelize yang digunakan
    }
  );

  CardAnswer.hasMany(CardAnswerAnswer, {
    as: "answers",
    sourceKey: 'unique_id',
    foreignKey: "ownerId",
    constraints: false,
  })
  
  export default CardAnswer;
  