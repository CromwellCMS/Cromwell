import { TFrontendBundle } from '@cromwell/core';
import { ApiProperty } from '@nestjs/swagger';

export class FrontendBundleDto implements TFrontendBundle {
    @ApiProperty()
    source?: string;

    @ApiProperty()
    meta?: TScriptMetaInfo;

    @ApiProperty()
    cjsPath?: string;
}

export type TScriptMetaInfo = {
    name: string;
    // { [moduleName]: namedImports }
    externalDependencies: Record<string, string[]>;
    import?: 'chunks' | 'lib';
}
