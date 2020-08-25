# node-config-typescript

1) This project was generated with [Node.js] version 10.13.0.

2) This is a sample baseline project which is built using typescript, config.json and ts-node.

3) The important highlight of this baseline is to maintain the configurability of db connection and 
ports for various phases of project release such as development production and uat without disturbing 
the env file for each release. 

4) It has the configurability of https and http server for local development and cloud deployment. 

## Development server

Run `npm run-script start:dev` for a dev server. Navigate to `https://localhost:3006/`. 


## UAT server

Run `npm run-script start:uat` for a uat server. Navigate to `https://localhost:8080/`. 


## Production server

This command is part of the package.json `npm start` is pointed towards production and 
hence gcloud app deploy will be enough to deploy it properly 

## Further help

To get more help on the config.json use the [Config.json README](https://www.npmjs.com/package/config.json).


