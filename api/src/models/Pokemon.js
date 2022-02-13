const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('pokemon', {
    id:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey:true,
      allowNull:false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    //Vida:
    hp:{
      type:DataTypes.INTEGER,
    },
    //Fuerza:
    attack:{
      type:DataTypes.INTEGER,
    },
    //Defensa:
    defense:{
      type:DataTypes.INTEGER,
    },
    //Velosidad:
    speed:{
      type:DataTypes.INTEGER,
    },
    //Altura:
    height:{
      type:DataTypes.INTEGER,
    },
    //Peso:
    weight:{
      type:DataTypes.INTEGER,
    },
  });
};
