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

var React = require('react');
var React__default = _interopDefault(React);
var ReactDOM = _interopDefault(require('react-dom'));
var graphqlRequest = require('graphql-request');
var link = _interopDefault(require('next/link'));

var GraphQLPaths = {
    Post: {
        getOneBySlug: "post",
        getOneById: "getPostById",
        getAll: "posts",
        create: "createPost",
        update: "updatePost",
        delete: "deletePost"
    },
    Product: {
        getOneBySlug: "product",
        getOneById: "getProductById",
        getAll: "products",
        create: "createProduct",
        update: "updateProduct",
        delete: "deleteProduct"
    },
    ProductCategory: {
        getOneBySlug: "productCategory",
        getOneById: "getProductCategoryById",
        getAll: "productCategories",
        create: "createProductCategory",
        update: "updateProductCategory",
        delete: "deleteProductCategory"
    }
};
var DBTableNames = {
    Post: 'post',
    Product: 'product',
    ProductCategory: 'product_category'
};
var componentsCachePath = '/tmp/components';
// export const isServer = (): boolean => (typeof window === 'undefined');
var isServer = function () { return true; };

var initialStore = {
    modulesData: {},
    blocksData: [
        {
            componentId: '1',
            destinationComponentId: '2',
            destinationPosition: 'after',
            styles: "background: red;"
        },
        {
            componentId: '111',
            destinationComponentId: '3',
            destinationPosition: 'inside',
            isVirtual: true,
            styles: "background: red;"
        },
        {
            componentId: '112',
            destinationComponentId: '111',
            destinationPosition: 'after',
            isVirtual: true,
            moduleName: 'ProductShowcase'
        }
    ]
};
{
    if (!global.CromwellStore)
        global.CromwellStore = initialStore;
}
var getStoreItem = function (itemName) {
    {
        return global.CromwellStore[itemName];
    }
};
var setStoreItem = function (itemName, item) {
    {
        global.CromwellStore[itemName] = item;
    }
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

___$insertStyle(".CromwellBlockInnerServer {\n  display: none;\n}");

var getCromwellBlockId = function (id) { return "CromwellBlock_" + id; };
var getCromwellBlockIdBefore = function (id) { return getCromwellBlockId(id) + "_before"; };
var getCromwellBlockIdAfter = function (id) { return getCromwellBlockId(id) + "_after"; };
var CromwellBlock = /** @class */ (function (_super) {
    __extends(CromwellBlock, _super);
    function CromwellBlock(props) {
        var _this = _super.call(this, props) || this;
        _this.blockRef = React__default.createRef();
        _this.virtualBlocks = [];
        _this.shouldBeMoved = false;
        _this.hasPortalBefore = false;
        _this.hasPortalAfter = false;
        _this.hasPortalInside = false;
        _this.getDestinationComponent = function (data) {
            var destinationComponent = null;
            if (data.destinationComponentId) {
                if (data.destinationPosition === 'before') {
                    destinationComponent = document.getElementById(getCromwellBlockIdBefore(data.destinationComponentId));
                }
                if (data.destinationPosition === 'after') {
                    destinationComponent = document.getElementById(getCromwellBlockIdAfter(data.destinationComponentId));
                }
                if (data.destinationPosition === 'inside') {
                    destinationComponent = document.getElementById(getCromwellBlockId(data.destinationComponentId));
                }
            }
            return destinationComponent;
        };
        _this.getVirtualBlocks = function (postion) {
            return _this.virtualBlocks.filter(function (b) { return b.destinationPosition === postion; })
                .map(function (b) { return React__default.createElement(CromwellBlock, { id: b.componentId, key: b.componentId }); });
        };
        _this.id = getCromwellBlockId(_this.props.id);
        _this.idBefore = getCromwellBlockIdBefore(_this.props.id);
        _this.idAfter = getCromwellBlockIdAfter(_this.props.id);
        var data = getStoreItem('blocksData');
        if (data && Array.isArray(data)) {
            data.forEach(function (d) {
                if (d.componentId == _this.props.id) {
                    _this.data = d;
                }
                // Check if current component should be moved to another component
                // If should, it will create portal to destinationComponent's wrapper
                if (d.componentId == _this.props.id && d.destinationComponentId && d.destinationPosition) {
                    _this.shouldBeMoved = true;
                }
                // Check if current component has other components moved to it.
                // If has, it will create wrappers for portals of other components
                if (_this.props.id == d.destinationComponentId && d.componentId && d.destinationPosition) {
                    if (d.destinationPosition === 'after')
                        _this.hasPortalAfter = true;
                    if (d.destinationPosition === 'before')
                        _this.hasPortalBefore = true;
                    if (d.destinationPosition === 'inside')
                        _this.hasPortalInside = true;
                    // Save virtual (existing only in config) blocks that targeted at this component.
                    // This component will draw them
                    if (d.isVirtual)
                        _this.virtualBlocks.push(d);
                }
            });
        }
        return _this;
    }
    CromwellBlock.prototype.componentDidMount = function () {
        if (this.data) {
            if (this.data.styles && this.blockRef.current) {
                this.blockRef.current.setAttribute('style', this.data.styles);
            }
        }
        if (this.shouldBeMoved) {
            var element = document.getElementById(getCromwellBlockId(this.props.id));
            if (element) {
                element.classList.remove('CromwellBlockInnerServer');
            }
            if (this.data && this.data.destinationComponentId && !this.targetElement) {
                var destinationComponent = this.getDestinationComponent(this.data);
                if (destinationComponent) {
                    this.targetElement = destinationComponent;
                }
                else {
                    console.error(getCromwellBlockId(this.props.id) + ':: Failed to find destinationComponent: '
                        + getCromwellBlockId(this.data.destinationComponentId));
                    this.shouldBeMoved = false;
                }
                this.forceUpdate();
            }
        }
    };
    CromwellBlock.prototype.render = function () {
        if (getCromwellBlockId(this.props.id) !== this.id) {
            return React__default.createElement("div", { style: { color: 'red' } }, "Error. Block id was changed");
        }
        var elementClassName = 'CromwellBlock'
            + (this.hasPortalInside ? ' CromwellBlockWrapper' : '')
            + (this.shouldBeMoved ? ' CromwellBlockInner' : '')
            + (this.shouldBeMoved && isServer() ? ' CromwellBlockInnerServer' : '');
        var element = (React__default.createElement(React__default.Fragment, null,
            this.hasPortalBefore && (React__default.createElement("div", { id: this.idBefore, key: this.idBefore, className: "CromwellBlockWrapper" }, this.getVirtualBlocks('before'))),
            React__default.createElement("div", { id: this.id, key: this.id, className: elementClassName, ref: this.blockRef },
                this.props.children,
                this.getVirtualBlocks('inside')),
            this.hasPortalAfter && (React__default.createElement("div", { id: this.idAfter, key: this.idAfter, className: "CromwellBlockWrapper" }, this.getVirtualBlocks('after')))));
        if (this.targetElement) {
            return ReactDOM.createPortal(element, this.targetElement);
        }
        return element;
    };
    return CromwellBlock;
}(React.Component));

var getModulesData = function () { return getStoreItem('modulesData'); };
var setModulesData = function (modulesData) { return setStoreItem('modulesData', modulesData); };
function CromwellModule(Component, moduleName) {
    return function () {
        var modulesData = getModulesData();
        var data = modulesData ? modulesData[moduleName] : {};
        // console.log('CromwellModule moduleName', moduleName, 'data', data, 'modulesData', modulesData);
        return (React__default.createElement("div", { className: "BaseComponent" },
            React__default.createElement(Component, __assign({}, data))));
    };
}

var getGraphQLClient = function () {
    var cmsconfig = getStoreItem('cmsconfig');
    if (!cmsconfig || !cmsconfig.apiPort) {
        console.log('cmsconfig', cmsconfig);
        throw new Error('getGraphQLClient !cmsconfig.apiPort');
    }
    return new graphqlRequest.GraphQLClient("http://localhost:" + cmsconfig.apiPort + "/");
};

exports.Link = link;
exports.CromwellBlock = CromwellBlock;
exports.CromwellModule = CromwellModule;
exports.DBTableNames = DBTableNames;
exports.GraphQLPaths = GraphQLPaths;
exports.componentsCachePath = componentsCachePath;
exports.getGraphQLClient = getGraphQLClient;
exports.getModulesData = getModulesData;
exports.getStoreItem = getStoreItem;
exports.isServer = isServer;
exports.setModulesData = setModulesData;
exports.setStoreItem = setStoreItem;
//# sourceMappingURL=index.js.map
