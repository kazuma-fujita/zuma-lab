export interface ProfileMainSkillItem {
  title: string;
  image: string;
  imageTitle: string;
  skills: Array<MainSkill>;
}

export interface MainSkill {
  skill: string;
  rate: number;
}
