/*
    Import necessary packages and modules here.
*/
import * as app from 'express'
import { readFileSync } from 'fs';
import * as https from "https";
import * as path from "path";
const config = require('./config.json');
import * as _ from 'lodash';
const defaultConfig = config.development;
const environment = process.env.mode || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
import { createConnection } from 'typeorm'
import * as appconfig from './src/common/config';
const fs = require('fs');
const yaml = require('js-yaml');

let data = config[environment]["yaml_data"];

let yamlStr = yaml.safeDump(data);
fs.writeFileSync('data-out.yaml', yamlStr, 'utf8');

// try {
//     var doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'app.yaml'), 'utf8'));
//     console.log(JSON.stringify(doc));
// } catch (e) {
//     console.log(e);
// }

/*
    Creating instance of express
*/
const app_reference = app();

/*
    Express configuration
*/
app_reference.use(app.json({ limit: '100mb' }))
app_reference.use(app.urlencoded({ limit: '100mb', extended: true }))
process.env.mode == "development" ? app_reference.set('PORT', 3006) : app_reference.set('PORT', finalConfig.PORT);

/*
    Express server configuration and starting code 
*/
if (process.env.mode == "development") {
    const options = {
        key: readFileSync(path.join(__dirname, 'ssl/2018-star_sanmina.com.key')),
        cert: readFileSync(path.join(__dirname, 'ssl/2018-STAR_sanmina_com.crt')),
    };

    https.createServer(options, app_reference).listen(app_reference.get("PORT"), () => {
        console.log(("App is running at https://localhost:%d in %s mode"), app_reference.get("PORT"), environment);
        console.log("Press CTRL-C to stop\n");

    });
}
else if (process.env.mode == "production" || process.env.mode == "uat") {

    app_reference.listen(app_reference.get("PORT"), () => {
        console.log(("App is running in GCP in %s mode"), app_reference.get("PORT"), environment);
        console.log("Press CTRL-C to stop\n");
    });
}

/*
    Express server configuration and starting code 
*/
createConnection(appconfig.dbOptions).then(() => {
    console.log("Connected to DB");
}).catch((error) => console.log("TypeORM connection error: ", error));


app_reference.get("/config/details", (req, res) => {
    res.status(200).send(finalConfig);
})

module.exports = app_reference;