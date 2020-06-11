import { Component } from 'react';
import './scss/CromwellBlock.scss';
declare type CromwellBlockProps = {
    id: string;
};
export declare class CromwellBlock extends Component<CromwellBlockProps> {
    private data?;
    private blockRef;
    private virtualBlocks;
    private targetElement?;
    private shouldBeMoved;
    private hasPortalBefore;
    private hasPortalAfter;
    private hasPortalInside;
    private id;
    private idBefore;
    private idAfter;
    constructor(props: CromwellBlockProps);
    componentDidMount(): void;
    private getDestinationComponent;
    private getVirtualBlocks;
    render(): JSX.Element | null;
}
export {};
