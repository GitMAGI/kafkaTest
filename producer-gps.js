const { Kafka } = require("kafkajs");
const config = require("./config");
const utils = require("./utils");
const events = require('events');

const run = async function run(topicName, idDevice, initLat=0, initLong=0, initAlt=0, transmissionRate=500, maxLoopIterations=1000){
    try{
        const kafka = new Kafka({
            clientId: "kafkaTestApp-"+idDevice,
            logLevel: config.kafka.logLevel,
            brokers: config.kafka.brokers,
            connectionTimeout: config.kafka.connectionTimeout,
            authenticationTimeout: config.kafka.authenticationTimeout,
            retry: {
                retries: config.kafka.retries
            }           
        });

        const producer = kafka.producer();
        console.log(`[ProducerGps-${idDevice}] Connecting to brokers ${config.kafka.brokers.join(", ")} ...`);
        await producer.connect();
        console.log(`[ProducerGps-${idDevice}] Connected!`);

        // Latitude => Min: -90 and Max:90
        // Longitude => Min: -180 and Max: 180
        // Precision: 5 digital palces => 1 m | 6 digital places => 11 cm | 7 digital places => 1 cm | 8 digital places => 1 mm
        
        let precision = 5; //meters
        let currLat = initLat;
        let currLong = initLong;
        let currAlt = initAlt;

        let i=0;
        while(maxLoopIterations>i){       
            
            currLat = utils.roundNumber(currLat, precision);
            currLong = utils.roundNumber(currLong, precision);
            currAlt = utils.roundNumber(currAlt, precision);
            
            console.debug(`[ProducerGps-${idDevice}] Sending => lat: ${currLat} | long: ${currLong} | alt: ${currAlt}`);
            await producer.send({
                topic: topicName,
                messages: [{
                    value: JSON.stringify({
                        lat: currLat,
                        long: currLong,
                        alt: currAlt,
                        serialNumber: idDevice,
                        measurementTime: new Date().getTime() + utils.randomInteger(1,10)*1000 //milliseconds (bigint)
                    }),
                    timestamp: new Date().getTime() //milliseconds (bigint)
                }]
            });

            let isLatStepPositive = utils.randomBoolean();
            let latStep = (utils.randomInteger(1, 10) / Math.pow(10, precision));
            let isLongStepPositive = utils.randomBoolean();
            let longStep = (utils.randomInteger(1, 10) / Math.pow(10, precision));

            console.debug(`[ProducerGps-${idDevice}] latStep: ${isLatStepPositive ? "+" : "-"}${latStep} | longStep: ${isLongStepPositive ? "+" : "-"}${longStep}`);

            if(isLatStepPositive)
                currLat = (currLat + latStep) > 90 ? 2*90-(currLat + latStep) : (currLat + latStep);
            else
                currLat = (currLat - latStep) < -90 ? 2*-90+(latStep - currLat) : (currLat - latStep);

            if(isLongStepPositive)
                currLong = (currLong + longStep) > 180 ? 2*180-(currLong + longStep) : (currLong + longStep);
            else
                currLong = (currLong - longStep) < -180 ? 2*-180+(longStep - currLong) : (currLong - longStep);

            await utils.sleep(transmissionRate);
            i=i+1;
        }

        console.log(`[ProducerGps-${idDevice}] Disconnecting ...`);
        await producer.disconnect()
        console.log(`[ProducerGps-${idDevice}] Disconnected!`);
    }
    catch(ex){
        console.error(`[Producer-${idDevice}] Something bad happened ${ex}`);
    }
    finally{
        //process.exit(0);
    }
}

exports.run = run;