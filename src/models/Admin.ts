import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
  Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda

class Admin extends Model {
  declare unique_id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare role: string;
  declare email: string;
  declare nuptk: string;
  declare gender: string;
  declare school_id: string;
  declare school_name: string;
  declare login_status: boolean;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Admin.init(
  {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    email: DataTypes.STRING,
    nuptk: DataTypes.STRING,
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
    tableName: "admin", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

export default Admin;