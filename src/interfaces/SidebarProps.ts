import { AvatarItem } from 'interfaces/AvatarItem';
import { SNSItem } from 'interfaces/SNSItem';
import { PostItem } from 'interfaces/PostItem';

export interface SidebarProps {
  avatar: AvatarItem;
  socials: Array<SNSItem>;
  items: Array<PostItem>;
  tags: Array<string>;
  archives: Array<string>;
}
