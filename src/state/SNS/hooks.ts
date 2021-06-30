import { SNSItem } from 'interfaces/SNSItem';

const snsData = [
  { name: 'Twitter', url: 'https://twitter.com/zuma_lab' },
  { name: 'GitHub', url: 'https://github.com/kazuma-fujita' },
];

export const useFetchSNSList = (): Array<SNSItem> => {
  return snsData;
};
