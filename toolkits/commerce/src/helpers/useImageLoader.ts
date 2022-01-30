import { useAppPropsContext } from '@cromwell/core-frontend';

/** @internal */
export const useImageLoader = () => {
    const pageContext = useAppPropsContext();

    const imageLoader = ({ src }: {
        src: string;
        width: number;
        quality?: number;
    }) => {
        const origin = pageContext.routeInfo?.origin;
        if (src.startsWith('/') && origin) {
            src = origin + src;
        }
        return src;
    }

    return imageLoader;
}