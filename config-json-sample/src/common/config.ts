const config = require('../../config.json');
import * as _ from 'lodash';
const defaultConfig = config.development;
const environment = process.env.mode || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);


export let dbOptions: any = {

    type: finalConfig.TYPEORM_CONNECTION,
    port: finalConfig.TYPEORM_PORT,
    username: finalConfig.TYPEORM_USERNAME,
    password: finalConfig.TYPEORM_PASSWORD,
    database: finalConfig.TYPEORM_DATABASE,
    entities: [
        finalConfig.TYPEORM_ENTITIES
    ],
    synchronize: false,
}

if (finalConfig.INSTANCE_CONNECTION_NAME && process.env.mode === "production") {
    dbOptions.host = `/cloudsql/${finalConfig.INSTANCE_CONNECTION_NAME}`;
    dbOptions.user = finalConfig.TYPEORM_USERNAME;
}
else {

    dbOptions.host = finalConfig.TYPEORM_HOST;
    dbOptions.port = finalConfig.TYPEORM_PORT;
}