import { ProfileDescriptionItem } from 'interfaces/ProfileDescriptionItem';
import { ProfileMainSkillItem } from 'interfaces/ProfileMainSkillItem';
import { ProfileSubSkillItem } from '../../interfaces/ProfileSubSkillItem';
import path from 'path';
import fs from 'fs';

const data = [
  {
    caption: '自己紹介',
    description:
      '普段 Web や Mobile アプリ開発をしている ZUMA です。\n' +
      'この blog は2021年に入り Next を勉強しようと思い作りました。\n' +
      'Vercel でホスティングしています。\n' +
      'デザインは Material-UI で組んでいます。\n' +
      '当面は個人開発で得た技術的知見を発信する場にしようと思っています。\n' +
      '比較的最新の技術が好きで個人開発では率先して新しいことにチャレンジしています。\n' +
      '最近はサーバレス構成を秒速で構築出来る Amplify を勉強しています。Lambda 最高です。\n' +
      'モバイル開発は Flutter を勉強中です。Hot reload最高です。\n' +
      '思いついた時に Twitter で技術発信をしているので、お気軽にフォローお願いします。\n',
  },
  {
    caption: '趣味',
    description:
      '趣味は音楽と野外フェスが好きで、FUJI ROCK、Summer Sonic、朝霧JAM、GREENROOM FESTIVAL、ARABAKI ROCK FEST. など全国数え切れないくらい行ってます。\n' +
      'FUJI ROCK は10年以上通ってるフジロッカーです。\n' +
      'ロードバイクも好きで、東京からFUJI ROCK会場のある新潟県の苗場まで自転車で往復400km走破しました。\n' +
      'バンドもやっていて、ギター、ベース、バンジョー、マンドリンが弾けます。\n' +
      '休日はバンド練習やライブをしていて、 新木場STUDIO COAST や 渋谷O-WEST/Asia など大きめの会場でライブをした経験もあります。\n',
  },
  {
    caption: '目標',
    description:
      '昨今のコロナ渦でライブが出来なくて大変な思いをしているミュージシャンをいっぱい知っています。\n' +
      '個人開発の目標として、音楽の表現の場を失ったミュージシャンをオンラインで繋げ、新しい音楽を創出できるようなサービスを作ります！(宣言)\n',
  },
];

const mainSkillData = [
  {
    title: 'Web Skills',
    image: '/images/profile/web-skill-image.jpeg',
    imageTitle: 'web skill image',
    skills: [
      { skill: 'React', rate: 70 },
      { skill: 'TypeScript', rate: 70 },
      { skill: 'Next.js', rate: 70 },
    ],
  },
  {
    title: 'Mobile Skills',
    image: '/images/profile/mobile-skill-image.jpeg',
    imageTitle: 'mobile skill image',
    skills: [
      { skill: 'Flutter', rate: 70 },
      { skill: 'Swift', rate: 50 },
      { skill: 'Kotlin', rate: 50 },
    ],
  },
  {
    title: 'Backend Skills',
    image: '/images/profile/backend-skill-image.jpeg',
    imageTitle: 'backend skill image',
    skills: [
      { skill: 'Python', rate: 70 },
      { skill: 'FastAPI', rate: 70 },
      { skill: 'Node.js', rate: 50 },
    ],
  },
];

const subSkillData = [
  {
    title: 'Other skills',
    image: '/images/profile/other-skill-image.jpeg',
    imageTitle: 'other skill image',
    skills: ['Terraform', 'Django', 'MySQL', 'Pinecone', 'Nginx', 'Git', 'Github', 'Docker', 'Cypress', 'Slack'],
  },
  {
    title: 'AWS skills',
    image: '/images/profile/aws-skill-image.jpeg',
    imageTitle: 'aws skill image',
    skills: [
      'Amplify',
      'Cognito',
      'ECS',
      'ECR',
      'EC2',
      'ALB',
      'RDS',
      'DynamoDB',
      'S3',
      'Lambda',
      'CloudFront',
      'Route53',
      'ACM',
      'CloudWatch',
    ],
  },
  {
    title: 'Studying skills',
    image: '/images/profile/studying-skill-image.jpeg',
    imageTitle: 'Studying skill image',
    skills: ['CDK', 'AppSync', 'CloudFormation', 'SMS', 'SES', 'DeviceFarm'],
  },
  {
    title: 'Music play skills',
    image: '/images/profile/music-skill-image.jpeg',
    imageTitle: 'music skill image',
    skills: ['Guitar', 'Banjo', 'Mandolin', 'Bass', 'Fiddle'],
  },
  {
    title: 'Hobby',
    image: '/images/profile/hobby-skill-image.jpeg',
    imageTitle: 'Hobby skill image',
    skills: ['Music', 'Rock festival', 'Camp', 'Road bike'],
  },
];

const metaDescription =
  '普段WebやMobileアプリ開発をしているエンジニアが個人開発を通して学んだ技術を発信をするブログです。React/TypeScript/Next/Flutter/GraphQL/AWS/Amplifyなどの話題を発信します。';

export const useFetchProfileDescriptionList = (): Array<ProfileDescriptionItem> => {
  return data;
};

export const useFetchProfileMainSkillList = (): Array<ProfileMainSkillItem> => {
  return mainSkillData;
};

export const useFetchProfileSubSkillList = (): Array<ProfileSubSkillItem> => {
  return subSkillData;
};

export const useGetProfileMetaDescription = (): string => {
  return metaDescription;
};

export const useGetProfileContents = (): string => {
  // マークダウンファイルのフルパスを文字列として読み取る
  const fullPath = path.join(process.cwd(), 'src/profile/profile.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return fileContents;
};
