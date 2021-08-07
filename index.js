const topic = require("./topic");
const producer = require("./producer");
const config = require("./config");
const utils = require("./utils");

async function main()
{
    await topic.run();

    //await producer.run("Hello bro", config.kafka.topics[0].topic, 80, 1000);
    while(true){
        await producer.run("Hello " + utils.makeRandomString(8), config.kafka.topics[0].topic, 1, 1);
        await utils.sleep(1000);
    }        
}

main();