module.exports = (db)=>{
    db.liveLocation.belongsTo(db.user, {
        foreignKey: 'userId',
        as: 'user'
    })
}