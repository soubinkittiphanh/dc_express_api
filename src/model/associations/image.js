module.exports = (db)=>{
    db.image.belongsTo(db.kyc, {
        foreignKey: 'kycId',
        as: 'kyc'
    })
    db.image.belongsTo(db.orders, {
        foreignKey: 'orderId',
        as: 'orderTable'
    })
    db.image.belongsTo(db.user, {
        foreignKey: 'userId',
        as: 'user'
    })
}