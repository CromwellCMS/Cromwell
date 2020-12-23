import { TFrontendBundle } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class FrontendBundleDto implements TFrontendBundle {
    @ApiProperty()
    source?: string;

    @ApiProperty()
    meta?: TSciprtMetaInfo;

    @ApiProperty()
    cjsPath?: string;
}

export type TSciprtMetaInfo = {
    name: string;
    // { [moduleName]: namedImports }
    externalDependencies: Record<string, string[]>;
    import?: 'chunks' | 'lib';
}
