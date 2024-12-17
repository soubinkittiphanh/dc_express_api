module.exports = (db)=>{
    db.kyc.belongsTo(db.user, {
        foreignKey: 'userId',
        as: 'user'
    })
    db.kyc.hasMany(db.image, {
        foreignKey: 'kycId',
        as: 'images'
    })

}