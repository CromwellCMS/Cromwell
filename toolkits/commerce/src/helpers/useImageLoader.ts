import { usePagePropsContext } from '@cromwell/core-frontend';

export const useImageLoader = () => {
    const pageContext = usePagePropsContext();

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