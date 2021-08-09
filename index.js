const topic = require("./topic");
const producer = require("./producer");
const producerGps = require("./producer-gps");
const config = require("./config");
const utils = require("./utils");

async function main()
{
    await topic.run();

    //await producer.run("Hello bro", config.kafka.topics[0].topic, 80, 1000);
    //while(true){
    //    await producer.run("Hello " + utils.randomString(8), config.kafka.topics[0].topic, 1, 1);
    //    await utils.sleep(1000);
    //}

    let longRun = 1000000;
    await Promise.all([
        producerGps.run(config.kafka.topics[0].topic, 'f900f245-a194-4d79-b710-36cf3917019d', -89.99995, 179.99995, 0.001, 1000, longRun*30),
        producerGps.run(config.kafka.topics[0].topic, 'ec3dcbfc-868b-4246-96a1-1f23fe726c3d', 9.44425, 17.00015, 0.002, 3000, longRun*10),
        producerGps.run(config.kafka.topics[0].topic, '8e0eb46d-c0bc-4e88-96fc-279c62b3b09f', 15.00005, -1.44220, 0.005, 500, longRun*60),
        producerGps.run(config.kafka.topics[0].topic, 'd1f5da94-c38e-4cdd-937f-20f9b5e2c5b9', -9.12120, -9.00002, 0.000, 250, longRun*120)
    ]);
}

main();