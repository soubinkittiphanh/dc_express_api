module.exports = (db)=>{
    db.merchant.belongsTo(db.user, {
        foreignKey: 'userId',
        as: 'user'
    })
    db.merchant.hasMany(db.orders, {
        foreignKey: 'merchantId',
        as: 'orders'
    })
    db.merchant.hasMany(db.orderPrice, {
        foreignKey: 'merchantId',
        as: 'orderPirces'
    })
}