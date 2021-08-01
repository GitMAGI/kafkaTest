const Kafka = require("kafkajs").Kafka;
const config = require("./config");
const utils = require("./utils");

const run = async function (){
    try{
        const kafka = new Kafka({
            clientId: "kafkaTestApp",
            logLevel: config.kafka.logLevel,
            brokers: config.kafka.brokers,
            connectionTimeout: config.kafka.connectionTimeout,
            authenticationTimeout: config.kafka.authenticationTimeout,
            retry: {
                retries: config.kafka.retries,             
            }           
        });

        const admin = kafka.admin(); //We need this to create topics
        console.log(`[Admin] Connecting to brokers ${config.kafka.brokers.join(", ")} ...`);
        await admin.connect().catch(err=>{
            console.log(`[Admin] Error connectins to the brokers ${config.kafka.brokers.join(", ")}! ${err.toString()}`);
            process.exit(1);
        });
        console.log("[Admin] Connected!");

        console.log(`[Admin] Listing of all topics current available ...`);
        topics = await admin.listTopics();
        console.log(`[Admin] Available topics: ${topics.join(", ")}`);
        
        for (const topic of config.kafka.topics) {
            if(topics.indexOf(topic.topic) == -1)
            {
                console.log(`[Admin] Creating Topic ${topic.topic} ...`)
                await admin.createTopics({ 
                    waitForLeaders: true,
                    topics: [topic]
                }).catch(err=>{
                    console.log(`[Admin] Error during Topic ${topic.topic} creation! ${err.toString()}`);
                    process.exit(1);
                });
                console.log(`[Admin] Topic ${topic.topic} created!`);
                await utils.sleep(2000);
            }
            else{
                console.log(`[Admin] Topic ${topic.topic} already created`)
            }
        }
        
        //console.log(`[Admin] Creating Topics ${config.kafka.topics.map(function(item) { return item['topic']; }).join(", ")} ...`)
        //await admin.createTopics({ 
        //    waitForLeaders: true,
        //    topics: config.kafka.topics 
        //});
        //console.log("[Admin] Topics created!");        

        console.log("[Admin] Disconnecting ...");
        await admin.disconnect()
        console.log("[Admin] Disconnected!");
    }
    catch(ex){
        console.error(`[Admin] Something bad happened ${ex}`);
    }
    finally{
        //process.exit(0);
    }
}

exports.run = run;