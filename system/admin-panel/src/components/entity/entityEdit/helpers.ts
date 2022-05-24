export const setValueOfTextEditorField = (value?: string | null) => {
    let data: {
        html: string;
        json: any;
    } | null = null;
    try {
        if (value) {
            data = JSON.parse(value);
        }
    } catch (error) {
        console.error(error);
    }
    return {
        description: data?.html || null,
        descriptionDelta: data?.json ? JSON.stringify(data?.json) : (data?.json || null),
    }
}

export const getInitialValueOfTextEditorField = (value: any, entityData: any) => JSON.stringify({
    html: entityData.description,
    json: entityData.descriptionDelta ? JSON.parse(entityData.descriptionDelta) : undefined,
});