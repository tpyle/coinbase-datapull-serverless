const pull = require("./pull");

module.exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log("event: ", event);
    pull()
        .then(result=>{
            console.log("=> returning result: ", result);
            callback(null, result);
        })
        .catch(err=>{
            console.error("=> an error occurred: ", err);
            callback(err);
        });
}
