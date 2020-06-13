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

import React from 'react';
import { CromwellModule, Link, CromwellBlock } from '@cromwell/core';
import 'tslib';

var ProductShowcase = function (props) {
    console.log('ProductShowcase props', props);
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
var ProductShowcase$1 = CromwellModule(ProductShowcase, 'ProductShowcase');

var SomePage = function (props) {
    console.log('IndexTemplate props', props);
    return (React.createElement("div", null,
        "SomePage",
        React.createElement(Link, { href: '/' },
            React.createElement("a", null, "HOME")),
        "HELLO WOORLD1 SomePage",
        React.createElement(CromwellBlock, { id: "1" },
            React.createElement("div", null,
                React.createElement("p", null, "CromwellBlock 1"))),
        React.createElement("div", null,
            React.createElement("h2", null, "Some subtitle")),
        React.createElement(CromwellBlock, { id: "2" },
            React.createElement("div", null,
                React.createElement("p", null, "CromwellBlock 2"))),
        React.createElement(ProductShowcase$1, null)));
};

export default SomePage;
