'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('News', 'seccion', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'conductor', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'entrevistado', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'etiqueta1', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'etiqueta2', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'link', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'alcance', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'cotizacion', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'tapa', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'valoracion', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'ejeComunicacional', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'factorPolitico', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'crisis', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'gestion', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'area', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'mencion1', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'mencion2', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'mencion3', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'mencion4', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('News', 'mencion5', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('News', 'seccion');
    await queryInterface.removeColumn('News', 'conductor');
    await queryInterface.removeColumn('News', 'entrevistado');
    await queryInterface.removeColumn('News', 'etiqueta1');
    await queryInterface.removeColumn('News', 'etiqueta2');
    await queryInterface.removeColumn('News', 'link');
    await queryInterface.removeColumn('News', 'alcance');
    await queryInterface.removeColumn('News', 'cotizacion');
    await queryInterface.removeColumn('News', 'tapa');
    await queryInterface.removeColumn('News', 'valoracion');
    await queryInterface.removeColumn('News', 'ejeComunicacional');
    await queryInterface.removeColumn('News', 'factorPolitico');
    await queryInterface.removeColumn('News', 'crisis');
    await queryInterface.removeColumn('News', 'gestion');
    await queryInterface.removeColumn('News', 'area');
    await queryInterface.removeColumn('News', 'mencion1');
    await queryInterface.removeColumn('News', 'mencion2');
    await queryInterface.removeColumn('News', 'mencion3');
    await queryInterface.removeColumn('News', 'mencion4');
    await queryInterface.removeColumn('News', 'mencion5');
  }
}; 