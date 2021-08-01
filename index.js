const topic = require("./topic");
const producer = require("./producer");
const config = require("./config");

async function main()
{
    await topic.run();
    await producer.run("Hello bro", config.kafka.topics[0].topic, 80, 1000);
}

main();