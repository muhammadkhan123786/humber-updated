import { StaticImageData } from 'next/image';
import { INavBarLinkSharedInterface } from '../../../common/INavBarLinkSharedInterface';


export interface NavLinksInterface extends INavBarLinkSharedInterface {
    iconSrc?: string | StaticImageData
}