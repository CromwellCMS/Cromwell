import { withRouter } from 'next/router';

import Filter from './components/Filter';

let HocComp = Filter;
if (withRouter) {
    HocComp = withRouter(HocComp);
}

export default HocComp;
export { getStaticProps } from './getStaticProps';
