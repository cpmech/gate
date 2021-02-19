import { Iany, hasSameProp } from '@cpmech/js2ts';

export interface IData {
  email: string;
}

export const newZeroData = (): IData => ({ email: '' });

export const refData: IData = { email: '' };

export const chkData = <T extends Iany>(data: T): IData | null => {
  for (const key of Object.keys(refData)) {
    if (!hasSameProp(refData, data, key as keyof IData)) {
      return null;
    }
  }
  return (data as unknown) as IData;
};
