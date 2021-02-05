import { AvatarItem } from './AvatarItem';
import { SNSItem } from './SNSItem';
import { ProfileMainSkillItem } from 'interfaces/ProfileMainSkillItem';
import { ProfileSubSkillItem } from './ProfileSubSkillItem';
// import { ProfileDescriptionItem } from './ProfileDescriptionItem';

export interface ProfileProps {
  avatar: AvatarItem;
  socials: Array<SNSItem>;
  //  descriptions: Array<ProfileDescriptionItem>;
  mainSkills: Array<ProfileMainSkillItem>;
  subSkills: Array<ProfileSubSkillItem>;
  contents: string;
}
