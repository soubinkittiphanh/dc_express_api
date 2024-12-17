module.exports = (db)=>{

    db.rider.belongsTo(db.user, {
        foreignKey: 'userId',
        as: 'user'
    })
    db.rider.hasMany(db.orders, {
        foreignKey: 'riderId',
        as: 'orders'
    })
    db.rider.hasMany(db.orderPrice, {
        foreignKey: 'riderId',
        as: 'orderPrices'
    })

}