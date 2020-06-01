const {format} = require('timeago.js');

module.exports = (timestamp)=>{
    return format(timestamp);
}
