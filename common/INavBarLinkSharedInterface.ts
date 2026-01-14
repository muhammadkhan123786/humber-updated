export interface INavBarLinkSharedInterface {
  _id: number;
  label: string;
  href: string;
  alt?: string;
  roleId?: number[];
  index?: number;
  children?: INavBarLinkSharedInterface[];
}
