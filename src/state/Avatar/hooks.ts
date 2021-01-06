import { AvatarItem } from 'interfaces/AvatarItem';

const avatarData = {
  image: 'images/avatar/ZUMA.png',
  description: 'Written by ZUMA a.k.a. Kazuma. Web/Mobile App developer.',
};

export const useFetchAvatarItem = (): AvatarItem => {
  return avatarData;
};
