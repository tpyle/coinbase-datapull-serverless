const pull = require("./pull");

module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log("event: ", event);
    return new Promise((resolve, reject)=>{
        pull()
            .then(result=>{
                console.log("=> returning result: ", result);
                resolve(result);
            })
            .catch(err=>{
                console.error("=> an error occurred: ", err);
                reject(err);
            });
    });
}
