module.exports = (db)=>{
    db.kyc.belongsTo(db.rider, {
        foreignKey: 'riderId',
        as: 'rider'
    })
}