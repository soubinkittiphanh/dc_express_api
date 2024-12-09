
module.exports = (sequelize, DataTypes) => {
  const LiveLocation = sequelize.define('LiveLocation', {
    latitude: {
      type: DataTypes.STRING, // For storing coordinates (latitude & longitude)
      allowNull: true, // Set to `false` if location is mandatory
    },
    longitude: {
      type: DataTypes.STRING, // For storing coordinates (latitude & longitude)
      allowNull: true, // Set to `false` if location is mandatory
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_trip'),
      allowNull: false,
      defaultValue: 'active',
    },
  }, {
    sequelize,
    // don't forget to enable timestamps!
    timestamps: true,
    // I don't want createdAt
    createdAt: true,
    // I want updatedAt to actually be called updateTimestamp
    updatedAt: 'updateTimestamp',
    // disable the modification of tablenames; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
  });

  return LiveLocation;
};