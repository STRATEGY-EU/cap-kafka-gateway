import dotenv from 'dotenv';
import { queryRssFeed } from './get-rss';
import { RssFeed } from './models';
import { TestBedAdapter, Logger, LogLevel } from 'node-test-bed-adapter';
import { sendCap } from './send-cap';
import { ICapAlert } from './schema';

dotenv.config();

const log = Logger.instance;
const username = process.env.USER;
const password = process.env.PASSWORD;
const interval = process.env.INTERVAL || 60;
const url = process.env.URL;
const processedMsgIds = new Set<string>();
let adapter: TestBedAdapter;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

if (!url) {
  console.error('No URL provided');
  process.exit(1);
}

const processRssFeed = async () => {
  const result = await queryRssFeed<RssFeed>(url, username, password);
  // const result = await queryRssFeed<RssFeed>(
  //   'https://capitem.vigilfuoco.it/capserver/rss/strategy.c2@strategy-project.eu/strategy.svc@strategy-project.eu'
  // );
  const rssItems = result?.rss.channel.item || [];
  for (const rssItem of rssItems) {
    const { guid, title, link } = rssItem;
    if (!link || processedMsgIds.has(guid)) continue;
    const cap = await queryRssFeed<{ alert: ICapAlert }>(link, username, password);
    if (!cap || !cap.alert) continue;
    console.log(`Found new RSS message with ID ${guid}: ${title}.`);
    processedMsgIds.add(guid);
    sendCap(adapter, log, cap.alert);
  }
};

const connectToTestbed = () => {
  const clientId = process.env.KAFKA_CLIENT_ID || 'cap-kafka-gateway';
  adapter = new TestBedAdapter({
    kafkaHost: process.env.KAFKA_HOST || 'localhost:3501',
    schemaRegistry: process.env.SCHEMA_REGISTRY || 'localhost:3502',
    // kafkaHost: process.env.KAFKA_HOST || 'driver-testbed.eu:3501',
    // schemaRegistry: process.env.SCHEMA_REGISTRY || 'driver-testbed.eu:3502',
    // largeFileService: hasLargeFileService ? 'localhost:9090' : undefined,
    // sslOptions: {
    //   pfx: fs.readFileSync('../certs/other-tool-1-client.p12'),
    //   passphrase: 'changeit',
    //   ca: fs.readFileSync('../certs/test-ca.pem'),
    //   rejectUnauthorized: true,
    // },
    clientId,
    fetchAllSchemas: false,
    fetchAllVersions: false,
    // autoRegisterSchemas: true,
    autoRegisterSchemas: false,
    wrapUnions: 'auto',
    // schemaFolder: process.env.SCHEMA_FOLDER || `${process.cwd()}/src/schemas`,
    produce: ['standard_cap'],
    logging: {
      logToConsole: LogLevel.Info,
      logToKafka: LogLevel.Warn,
    },
  });

  adapter.on('error', (e) => console.error(e));
  adapter.on('ready', () => {
    log.info(`Current simulation time: ${adapter.simulationTime}`);
    log.info(`${clientId} is connected`);
    processRssFeed();
    setInterval(processRssFeed, +interval * 1000);
  });
  adapter.connect();
};

const start = async () => {
  connectToTestbed();
};

start();
