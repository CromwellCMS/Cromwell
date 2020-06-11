'use strict';



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

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib = require('tslib');
var React = _interopDefault(require('react'));
var core = require('@cromwell/core');

var ProductShowcaseDemo = function (props) {
    console.log('ProductShowcaseDemo props', props);
    return (React.createElement("div", { style: { backgroundColor: "#999" } },
        React.createElement("p", null, "Showcase Time!"),
        props.products && props.products.map(function (p) { return (React.createElement("div", { key: p.id },
            React.createElement(core.Link, { href: "/product/[slug]", as: "/product/" + p.slug },
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
var getStaticProps = function (context) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var data, limit, e_1;
    return tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = {};
                limit = 20;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, core.getGraphQLClient().request("\n            query getProducts {\n                " + core.GraphQLPaths.Product.getAll + "(pagedParams: {pageNumber: 1, pageSize: " + limit + "}) {\n                    id\n                    slug\n                    name\n                    pageTitle\n                    price\n                    mainImage\n                }\n            }\n        ")];
            case 2:
                data = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, tslib.__assign({}, data)];
        }
    });
}); };
var index = core.CromwellModule(ProductShowcaseDemo, 'ProductShowcaseDemo');

exports.default = index;
exports.getStaticProps = getStaticProps;
