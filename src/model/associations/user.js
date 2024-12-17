module.exports = (db) => {
    db.user.hasOne(db.rider, {
        foreignKey: 'userId',
        as: 'rider',
    })
    db.user.hasMany(db.image, {
        foreignKey: 'userId',
        as: 'profileImages',
    })
    db.user.hasOne(db.merchant, {
        foreignKey: 'userId',
        as: 'merchant',
    })
    db.user.hasOne(db.kyc, {
        foreignKey: 'userId',
        as: 'kyc',
    })
}