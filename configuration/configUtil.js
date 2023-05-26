const dotenv = require('dotenv');
dotenv.config();


module.exports = {
    devPort: process.env.DEV_PORT ?? "4000",
    devHost: process.env.DEV_HOST ?? "localhost",
    buildStage: process.env.BUILD_STAGE ?? "local",
    apiServer: process.env.API_SERVER ?? "http://localhost:3100",
}