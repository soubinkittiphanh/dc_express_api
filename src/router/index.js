
const riderRouter = require("../model/rider/router")
const userRouter = require("../model/user/router")
const authRouter = require("../model/user/router-auten")
const orderRouter = require("../model/orders/router")
const orderPriceRouter = require("../model/ordersPricing/router")
const merchantPriceRouter = require("../model/merchant/router")

module.exports={
    riderRouter,
    authRouter,
    userRouter,
    orderRouter,
    orderPriceRouter,
    merchantPriceRouter,
}