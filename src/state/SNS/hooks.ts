import { SNSItem } from 'interfaces/SNSItem';

const snsData = [
  { name: 'Twitter', url: 'https://twitter.com/____ZUMA____' },
  { name: 'GitHub', url: 'https://github.com/kazuma-fujita' },
];

export const useFetchSNSList = (): Array<SNSItem> => {
  return snsData;
};
