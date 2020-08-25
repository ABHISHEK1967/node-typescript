/*
    Import necessary packages and modules here.
*/
import * as express from 'express';
import { Request, Response } from "express";
import { readFileSync } from 'fs';
import * as https from "https";
import * as path from "path";
const config = require('./config.json');
const fs = require('fs');
const yaml = require('js-yaml');
import * as _ from 'lodash';
const defaultConfig = config.development;
const environment = process.env.mode || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
// import { createConnection } from 'typeorm'
// import * as appconfig from './src/common/config';


let data = config[environment]["YAML_DATA"];
let yamlStr = yaml.safeDump(data);
fs.writeFileSync('app.yaml', yamlStr, 'utf8');

/*
    Creating instance of express
*/
const app = express();

/*
    Express configuration
*/
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
process.env.mode == "development" ? app.set('PORT', 3006) : app.set('PORT', finalConfig.PORT);

/*
    Express server configuration and starting code 
*/
if (process.env.mode == "development") {
    const options = {
        key: readFileSync(path.join(__dirname, 'ssl/2018-star_sanmina.com.key')),
        cert: readFileSync(path.join(__dirname, 'ssl/2018-STAR_sanmina_com.crt')),
    };

    https.createServer(options, app).listen(app.get("PORT"), () => {
        console.log(("App is running at https://localhost:%d in %s mode"), app.get("PORT"), environment);
        console.log("Press CTRL-C to stop\n");

    });
}
else if (process.env.mode == "production" || process.env.mode == "uat") {

    app.listen(app.get("PORT"), () => {
        console.log(("App is running in GCP in %s mode"), app.get("PORT"), environment);
        console.log("Press CTRL-C to stop\n");
    });
}

/*
    Express server configuration and starting code 
*/
app.get("/config/details", (req: Request, res: Response) => {
    res.status(200).send(finalConfig);
})

module.exports = app;