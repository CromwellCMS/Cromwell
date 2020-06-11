function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

import { __awaiter, __generator, __assign } from 'tslib';
import React from 'react';
import { CromwellModule, Link, getGraphQLClient, GraphQLPaths } from '@cromwell/core';

var ProductShowcaseDemo = function (props) {
    console.log('ProductShowcaseDemo props', props);
    return (React.createElement("div", { style: { backgroundColor: "#999" } },
        React.createElement("p", null, "Showcase Time!"),
        props.products && props.products.map(function (p) { return (React.createElement("div", { key: p.id },
            React.createElement(Link, { href: "/product/[slug]", as: "/product/" + p.slug },
                React.createElement("a", null,
                    "Name: ",
                    p.name)),
            React.createElement("h1", null,
                "Price: ",
                p.price),
            React.createElement("h1", null,
                "id: ",
                p.id))); })));
};
var getStaticProps = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var data, limit, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                limit = 20;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getGraphQLClient().request("\n            query getProducts {\n                " + GraphQLPaths.Product.getAll + "(pagedParams: {pageNumber: 1, pageSize: " + limit + "}) {\n                    id\n                    slug\n                    name\n                    pageTitle\n                    price\n                    mainImage\n                }\n            }\n        ")];
            case 2:
                data = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, __assign({}, data)];
        }
    });
}); };
var index = CromwellModule(ProductShowcaseDemo, 'ProductShowcaseDemo');

export default index;
export { getStaticProps };
