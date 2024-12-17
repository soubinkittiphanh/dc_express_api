module.exports = (db)=>{

    db.orderPrice.belongsTo(db.orders, {
        foreignKey: 'orderId',
        as: 'order'
    })
    db.orderPrice.belongsTo(db.rider, {
        foreignKey: 'riderId',
        as: 'rider'
    })
    db.orderPrice.belongsTo(db.merchant, {
        foreignKey: 'merchantId',
        as: 'merchant'
    })


}