const axios = require("axios");
const config = require("config");
const MongoClient = require("mongodb").MongoClient;

const mongoConnectionString = process.env.DATABASE_CONNECTION_STRING;

let cachedDB = null;
function connectToDatabase() {
    return new Promise((resolve, reject)=>{
        console.log("=> connect to database");

        if (cachedDB) {
            console.log("=> using cached database instance");
            return resolve(cachedDB);
        }

        MongoClient.connect(
            mongoConnectionString,
            { useUnifiedTopology: true },
            (err, client)=>{
                if (err) {
                    return reject(err);
                }
                cachedDB = client;
                return resolve(cachedDB);
            });
    });
}

function main() {
    return new Promise((resolve, reject)=>{
        axios.get(config.coinbase.url).then(res=>{
            const date = new Date().toISOString();
            const data = Object.entries(res.data.data.rates)
                .map(([k,v])=>({ timestamp: date, currencyCode: k, value: 1/Number(v) }));
        
            connectToDatabase().then((client)=>{
                const db = client.db(config.db.name);

                db.collection('history').insertMany(data, (err,result)=>{
                    if (err) {
                        reject(err);
                    } else if (result.insertedCount !== data.length) {
                        reject(new Error("Failed to insert everything"));
                    } else {
                        resolve(true);
                    }
                });
            }).catch(reject);
        }).catch(reject);
    });
}


if (require.main == module) {
    main()
        .catch(console.error)
        .finally(()=>{cachedDB.close()});
}

module.exports = main;
