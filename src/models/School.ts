import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, BelongsToManySetAssociationsMixin, BelongsToManyGetAssociationsMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Module from "./Module";
import SchoolModule from "./SchoolModule";

class School extends Model {
  declare unique_id: CreationOptional<number>;
  school_id: string;
  school_name: string;


  declare getModules: BelongsToManyGetAssociationsMixin<Module>;
  declare addModule: BelongsToManyAddAssociationMixin<Module, number>;
  declare addModules: BelongsToManyAddAssociationsMixin<Module, number>;
  declare setModules: BelongsToManySetAssociationsMixin<Module, number>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

School.init(
  {
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    school_id: DataTypes.STRING,
    school_name: DataTypes.STRING,

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "school", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

School.belongsToMany(Module,{
    through: SchoolModule,
    as: "modules",
    sourceKey: 'unique_id',
    foreignKey: "ownerId",
    constraints: false,
})
  
export default School;