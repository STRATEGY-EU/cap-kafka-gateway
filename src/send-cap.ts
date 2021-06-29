import { Logger, ProduceRequest, TestBedAdapter } from 'node-test-bed-adapter';
import { ICapAlert } from './schema';

/** Send CAP message to testbed */
export const sendCap = (adapter: TestBedAdapter, log: Logger, messages: ICapAlert) => {
  const payloads: ProduceRequest[] = [
    {
      topic: 'standard_cap',
      messages,
      attributes: 1, // Gzip
    },
  ];
  adapter.send(payloads, (error, data) => {
    if (error) {
      log.error(error);
      console.log(JSON.stringify(messages, null, 2));
    }
    if (data) {
      log.info(data);
    }
  });
};
