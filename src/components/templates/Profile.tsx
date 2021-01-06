import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import { AvatarItem } from 'interfaces/AvatarItem';
import DescriptionTypography from 'components/atoms/DescriptionTypography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // maxWidth: 800,
      margin: 'auto',
      width: '50%',
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
    largeAvatar: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
  })
);

interface Props {
  avatar: AvatarItem;
}

const Profile: React.FC<Props> = ({ avatar }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={<Avatar className={classes.largeAvatar} src={avatar.image} />}
        title='ZUMA a.k.a. Kazuma'
        subheader='Web/Mobile App developer.'
      />
      <CardContent>
        <DescriptionTypography>
          {`このblogは2021年に入り Next/TypeScript の勉強がてら作りました。\n
          普段触っているのは AWS/NodeJS/React/TypeScript/Swift/Kotlin です。\n
          最近はサーバレス構成を秒速で構築出来る Amplify を勉強しています。Lambda 最高です。\n
          モバイル開発は Flutter を勉強中です。Hot reload最高です。\n
          \n
          趣味は音楽と野外フェスが好きで、FUJI ROCK、Summer Sonic、朝霧JAM、GREENROOM FESTIVAL、ARABAKI ROCK FEST.など全国数え切れないくらい行ってます。\n
          FUJI ROCKは10年以上通ってるフジロッカーです。\n
          ロードバイクも好きで、自転車で東京からFUJI ROCK会場のある新潟県の苗場まで往復400km走破しました。\n
          バンドもやっていて、ギター、ベース、バンジョー、マンドリンが弾けます。\n
          休日はバンド練習やライブをしていて、結構大きめの会場でライブをした経験もあります。\n
          \n
          昨今のコロナ渦でライブが出来なくて大変な思いをしているミュージシャンをいっぱい知っています。\n
          2021年の目標は、音楽の表現の場を失ったミュージシャンをオンラインで繋げ、新しい音楽を創出できるようなサービスを作ります！(宣言)\n
          \n`}
        </DescriptionTypography>
      </CardContent>
    </Card>
  );
};

export default Profile;
