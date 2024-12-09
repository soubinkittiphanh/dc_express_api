module.exports = (db)=>{
    db.image.belongsTo(db.kyc, {
        foreignKey: 'kycId',
        as: 'kyc'
    })
}