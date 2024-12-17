module.exports = (db)=>{

    db.orders.belongsTo(db.merchant, {
        foreignKey: 'merchantId',
        as: 'merchant'
    })
    db.orders.belongsTo(db.rider, {
        foreignKey: 'riderId',
        as: 'rider'
    })
    db.orders.hasMany(db.orderPrice, {
        foreignKey: 'orderId',
        as: 'orderPrices'
    })

}