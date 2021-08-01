const { Kafka } = require("kafkajs");
const config = require("./config");
const utils = require("./utils");

const run = async function run(stringyfiedMsg, topicName, replicas=1, timeoutAmongReplicas=500){
    try{
        const kafka = new Kafka({
            clientId: "kafkaTestApp",
            logLevel: config.kafka.logLevel,
            brokers: config.kafka.brokers,
            connectionTimeout: config.kafka.connectionTimeout,
            authenticationTimeout: config.kafka.authenticationTimeout,
            retry: {
                retries: config.kafka.retries
            }           
        });

        const producer = kafka.producer();
        console.log(`[Producer] Connecting to brokers ${config.kafka.brokers.join(", ")} ...`);
        await producer.connect();
        console.log("[Producer] Connected!");      

        i=0;
        while(i<replicas){
            if(replicas>1)
                await utils.sleep(timeoutAmongReplicas);

            console.debug("[Producer] Running");
            //stringyfiedMsg
            await producer.send({
                topic: topicName,
                messages: [{
                    value: stringyfiedMsg,
                    timestamp: new Date().getTime() //milliseconds (bigint)
                }]
            });

            i++;
        }

        console.log("[Producer] Disconnecting ...");
        await producer.disconnect()
        console.log("[Producer] Disconnected!");
    }
    catch(ex){
        console.error(`[Producer] Something bad happened ${ex}`);
    }
    finally{
        //process.exit(0);
    }
}

exports.run = run;