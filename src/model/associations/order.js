module.exports = (db)=>{
    db.orderPrice.belongsTo(db.orders, {
        foreignKey: 'orderId',
        as: 'orderTable'
    })
    db.orders.belongsTo(db.merchant, {
        foreignKey: 'merchantId',
        as: 'merchant'
    })
    db.orders.belongsTo(db.rider, {
        foreignKey: 'riderId',
        as: 'rider'
    })
    db.orders.hasMany(db.orderPrice, {
        as: 'priceList'
    })

}