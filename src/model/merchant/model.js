
module.exports = (sequelize,DataTypes) => {
    const Merchant = sequelize.define('Merchant', {
        shopName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        whatsapp: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
                len: [10, 15], // WhatsApp numbers typically range from 10-15 digits
            },
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.STRING, // For storing coordinates (latitude & longitude)
            allowNull: true, // Set to `false` if location is mandatory
        },
        longitude: {
            type: DataTypes.STRING, // For storing coordinates (latitude & longitude)
            allowNull: true, // Set to `false` if location is mandatory
        },
        serviceStatus: {
            type: DataTypes.ENUM('open', 'close'), // Enum for predefined values
            allowNull: false,
            defaultValue: 'open', // Default value
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

    return Merchant;
};




// 1. STRING: A variable length string.
// 2. CHAR: A fixed length string.
// 3. TEXT: A long string.
// 4. INTEGER: A 32-bit integer.
// 5. BIGINT: A 64-bit integer.
// 6. FLOAT: A floating point number.
// 7. DOUBLE: A double floating point number.
// 8. DECIMAL: A fixed-point decimal number.
// 9. BOOLEAN: A boolean value.
// 10. DATE: A date object.
// 11. DATEONLY: A date object without time.
// 12. TIME: A time object.
// 13. UUID: A universally unique identifier.
// 14. ENUM: A value from a predefined list of values.
// 15. ARRAY: An array of values.
// 16. JSON: A JSON object.
// 17. JSONB: A JSON object stored as a binary format.