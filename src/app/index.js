

const logger = require("../api/logger.js");
const buildApp = require("./app.js");
const env = require("../config");
const myRouter = require("../router")
const startApp = async () => {

    const app = await buildApp();

    app.listen(env.port || 4000, () => {
        logger.info("DC Epress is up")
        logger.info("app is runing: " + env.port || 4000);
        logger.warn("env: " + env.db.database);
    }).setTimeout(0)
    app.use("/api/rider",myRouter.riderRouter)

}
startApp();
