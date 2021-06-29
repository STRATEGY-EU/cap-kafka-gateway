# CAP-to-Kafka gateway

Retrieve [CAP](http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html) (Common Alerting Protocal) messages from an RSS feed and publish them to Kafka.

The project assumes that the STRATEGY-EU/DRIVER+ Apache Kafka-based test-bed is running. If not, see the [test-bed installation instructions](https://github.com/STRATEGY-EU/tti) for installing a local version of the testbed.

In addition, it assumes that a [CAP AVRO schema](https://github.com/DRIVER-EU/avro-schemas/blob/master/standard/cap/standard_cap-value.avsc) has been registered in the testbed too.

## Installation

```bash
npm add -g pnpm
pnpm i
npm run build
```

## Docker

```bash
npm run docker:build
```

This will create a docker local image with the name 'cap-to-kafka'. See the `docker-compose.yml` for an example service configuration to add in your testbed composition.

To publish the local docker image to strategy-eu docker hub:

```bash
docker login --username=<<GIT USERNAME e.g. erik.vullings>>
npm run docker:build
npm run docker:tag
npm run docker:publish
```

## Usage

You can start them in two terminals, or one after the other.

```bash
npm run cap-to-kafka
```

## Develop

```bash
npm start
```
