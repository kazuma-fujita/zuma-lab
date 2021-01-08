import { ProfileDescriptionItem } from 'interfaces/ProfileDescriptionItem';

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

export const useFetchProfileDescriptionList = (): Array<ProfileDescriptionItem> => {
  return data;
};
