let config = require('./baseconfig.js');
const webpack = require('webpack');

webpack(config, (err, status)=>{
    if(err || status.hasErrors()){
        // record
        console.log('【build error】', status.toString());
    }
});