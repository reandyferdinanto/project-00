import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Question from "./Question";
import CardAnswer from "./CardAnswer";
  
  class CardAnswerAnswer extends Model {
    declare unique_id: CreationOptional<number>;
    declare index: number;
    declare value: string;
  
    declare ownerId: ForeignKey<CardAnswer['unique_id']>;
  
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
  }
  
  CardAnswerAnswer.init(
    {
      unique_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      index: DataTypes.INTEGER,
      value: DataTypes.TEXT,
  
      // timestamps
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "cardansweranswer", // Nama tabel di database
      sequelize, // Instance Sequelize yang digunakan
    }
  );
  
  export default CardAnswerAnswer;
  