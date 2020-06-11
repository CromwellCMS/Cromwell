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

var Product = function (props) {
    console.log('ProductTemplate props', props);
    var product = props.data ? props.data.product : undefined;
    return (React.createElement("div", null,
        "ProductTemp",
        React.createElement(core.Link, { href: '/' },
            React.createElement("a", null, "HOME")),
        product && (React.createElement("div", null,
            product.name,
            React.createElement("p", null),
            React.createElement(core.CromwellBlock, { id: "3" })))));
};
var getStaticProps = function (context) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var slug, data, e_1;
    return tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('context', context);
                slug = (context && context.params) ? context.params.slug : null;
                console.log('pid', slug, 'context.params', context.params);
                data = null;
                if (!slug) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, core.getGraphQLClient().request("\n                query getproduct {\n                    " + core.GraphQLPaths.Product.getOneBySlug + "(slug: \"" + slug + "\") {\n                        id\n                        slug\n                        name\n                        pageTitle\n                        price\n                        mainImage\n                    }\n                }\n            ")];
            case 2:
                data = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                console.error('Product::getStaticProps: !pid');
                _a.label = 6;
            case 6: return [2 /*return*/, {
                    data: data
                }];
        }
    });
}); };

exports.default = Product;
exports.getStaticProps = getStaticProps;
