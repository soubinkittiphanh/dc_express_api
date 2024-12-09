module.exports = (db)=>{
    db.merchant.belongsTo(db.user, {
        foreignKey: 'userId',
        as: 'user'
    })
}