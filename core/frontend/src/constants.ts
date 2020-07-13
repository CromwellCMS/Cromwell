import { TCromwellBlockData, TCromwellBlockType } from '@cromwell/core';

export const cromwellIdToHTML = (id: string): string => `CromwellBlock_${id}`;

export const cromwellIdFromHTML = (htmlId: string): string => htmlId.replace(/^CromwellBlock_/, '');

export const cromwellBlockTypeToClassname = (type: TCromwellBlockType) => `CromwellBlock_Type_${type}`
export const cromwellBlockTypeFromClassname = (classname: string): TCromwellBlockType | null => {
    if (/CromwellBlock_Type_/.test(classname)) {
        return classname.replace(/.*CromwellBlock_Type_/, '').split(' ')[0] as TCromwellBlockType;
    }
    else return null

}