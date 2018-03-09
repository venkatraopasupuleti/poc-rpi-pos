module.exports = function(sequelize, DataTypes) {
  const Message = sequelize.define("Message", {
      text: {
          type: DataTypes.TEXT,
          allowNull: false,
          len: [1]
      },
      sender: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              len: [1]
            }
      },
      id:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull:false
      }
    });
  
  
  
  
    // set up associations if you want to use includes
    // when serving up json from your routes
    
    /*Message.associate = function(models) {
      // We're saying that a Post should belong to an Author
      // A Post can't be created without an Author due to the foreign key constraint
      Message.belongsTo(models.Author, {
        foreignKey: {
          allowNull: false
        }
      });
    };*/
  
    return Message;
  };
  