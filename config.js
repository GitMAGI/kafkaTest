const config = {};

config.kafka = {};

config.kafka.brokers = [
    "localhost:29092"
];
config.kafka.connectionTimeout = 1000;
config.kafka.authenticationTimeout = 1000;
config.kafka.retries = 0;
config.kafka.logLevel = 4,

config.kafka.topics = [{
    topic: "test_topic_gps",
    numPartitions: 1,
    replicationFactor: 1 
}]

module.exports = config;