import React from 'react';

const interopDefault = (lib, importName) => {
    if (lib && typeof lib === 'object' && 'default' in lib) {

        if (importName !== 'default') {
            return lib.default;
        }

        if (typeof lib.default === 'object' || typeof lib.default === 'function') {
            if (Object.keys(lib).length === 1) {
                return lib.default;
            } else if ('default' in lib.default && Object.keys(lib).length === Object.keys(lib.default).length) {
                return lib.default;
            } else if (Object.keys(lib).length === Object.keys(lib.default).length + 1) {
                return lib.default;
            }
        }
    }
    return lib;
}

import { getModuleImporter } from '@cromwell/core-frontend';
const importer = getModuleImporter();

import * as admin from '../exports';
importer.modules['@cromwell/admin-panel'] = interopDefault(admin, 'default');
importer.importStatuses['@cromwell/admin-panel'] = 'default';

import * as react from 'react';
importer.modules['react'] = interopDefault(react, 'default');
importer.importStatuses['react'] = 'default';

import * as reactDom from 'react-dom';
importer.modules['react-dom'] = interopDefault(reactDom, 'default');
importer.importStatuses['react-dom'] = 'default';

import * as cromwellCore from '@cromwell/core';
importer.modules['@cromwell/core'] = interopDefault(cromwellCore, 'default');
importer.importStatuses['@cromwell/core'] = 'default';

import * as cromwellCoreFrontend from '@cromwell/core-frontend';
importer.modules['@cromwell/core-frontend'] = interopDefault(cromwellCoreFrontend, 'default');
importer.importStatuses['@cromwell/core-frontend'] = 'default';

import * as reactRouterDom from 'react-router-dom';
importer.modules['react-router-dom'] = interopDefault(reactRouterDom, 'default');
importer.importStatuses['react-router-dom'] = 'default';

import * as reactNumberFormat from 'react-number-format';
importer.modules['react-number-format'] = interopDefault(reactNumberFormat, 'default');
importer.importStatuses['react-number-format'] = 'default';

import * as loadableComponent from '@loadable/component';
importer.modules['@loadable/component'] = interopDefault(loadableComponent, 'default');
importer.importStatuses['@loadable/component'] = 'default';

import * as queryString from 'query-string';
importer.modules['query-string'] = interopDefault(queryString, 'default');
importer.importStatuses['query-string'] = 'default';

import * as date_fns_lxkg from 'date-fns';
importer.modules['date-fns'] = interopDefault(date_fns_lxkg, 'default');
importer.importStatuses['date-fns'] = 'default';

import * as react_resize_detector_a4lv from 'react-resize-detector';
importer.modules['react-resize-detector'] = interopDefault(react_resize_detector_a4lv, 'default');
importer.importStatuses['react-resize-detector'] = 'default';

import * as muiStyles from '@mui/styles';
importer.modules['@mui/styles'] = interopDefault(muiStyles, 'default');
importer.importStatuses['@mui/styles'] = 'default';
importer.modules['@material-ui/styles'] = interopDefault(muiStyles, 'default');
importer.importStatuses['@material-ui/styles'] = 'default';

import * as _material_ui_core_26sp from '@mui/material';
importer.modules['@mui/material'] = interopDefault(_material_ui_core_26sp, 'default');
importer.importStatuses['@mui/material'] = 'default';
importer.modules['@material-ui/core'] = interopDefault(_material_ui_core_26sp, 'default');
importer.importStatuses['@material-ui/core'] = 'default';
importer.modules['@material-ui/lab'] = interopDefault(_material_ui_core_26sp, 'default');
importer.importStatuses['@material-ui/lab'] = 'default';
importer.modules['@material-ui/core'].makeStyles = importer.modules['@mui/styles'].makeStyles;
importer.modules['@material-ui/core'].createStyles = importer.modules['@mui/styles'].createStyles;

import * as _material_ui_lab_n37c from '@mui/lab';
importer.modules['@mui/lab'] = interopDefault(_material_ui_lab_n37c, 'default');
importer.importStatuses['@mui/lab'] = 'default';

import emotionReact from '@emotion/react';
importer.modules['@emotion/react'] = interopDefault(emotionReact, 'default');
importer.importStatuses['@emotion/react'] = 'default';

import * as react_toastify_swhg from 'react-toastify';
importer.modules['react-toastify'] = interopDefault(react_toastify_swhg, 'default');
importer.importStatuses['react-toastify'] = 'default';

import * as prop_types_6xsv from 'prop-types';
importer.modules['prop-types'] = interopDefault(prop_types_6xsv, 'default');
importer.importStatuses['prop-types'] = 'default';

import * as hoist_non_react_statics_xxvj from 'hoist-non-react-statics';
importer.modules['hoist-non-react-statics'] = interopDefault(hoist_non_react_statics_xxvj, 'default');
importer.importStatuses['hoist-non-react-statics'] = 'default';

import * as react_transition_group_jsb5 from 'react-transition-group';
importer.modules['react-transition-group'] = interopDefault(react_transition_group_jsb5, 'default');
importer.importStatuses['react-transition-group'] = 'default';

import * as clsx_vwoh from 'clsx';
importer.modules['clsx'] = interopDefault(clsx_vwoh, 'default');
importer.importStatuses['clsx'] = 'default';

import * as react_is_xltt from 'react-is';
importer.modules['react-is'] = interopDefault(react_is_xltt, 'default');
importer.importStatuses['react-is'] = 'default';

import * as object_assign_r3ie from 'object-assign';
importer.modules['object-assign'] = interopDefault(object_assign_r3ie, 'default');
importer.importStatuses['object-assign'] = 'default';

import * as jss_6ya3 from 'jss';
importer.modules['jss'] = interopDefault(jss_6ya3, 'default');
importer.importStatuses['jss'] = 'default';

import * as jss_plugin_rule_value_function_4w1a from 'jss-plugin-rule-value-function';
importer.modules['jss-plugin-rule-value-function'] = interopDefault(jss_plugin_rule_value_function_4w1a, 'default');
importer.importStatuses['jss-plugin-rule-value-function'] = 'default';

import * as jss_plugin_global_96rb from 'jss-plugin-global';
importer.modules['jss-plugin-global'] = interopDefault(jss_plugin_global_96rb, 'default');
importer.importStatuses['jss-plugin-global'] = 'default';

import * as jss_plugin_nested_hvkl from 'jss-plugin-nested';
importer.modules['jss-plugin-nested'] = interopDefault(jss_plugin_nested_hvkl, 'default');
importer.importStatuses['jss-plugin-nested'] = 'default';

import * as jss_plugin_camel_case_cn22 from 'jss-plugin-camel-case';
importer.modules['jss-plugin-camel-case'] = interopDefault(jss_plugin_camel_case_cn22, 'default');
importer.importStatuses['jss-plugin-camel-case'] = 'default';

import * as jss_plugin_default_unit_1dnt from 'jss-plugin-default-unit';
importer.modules['jss-plugin-default-unit'] = interopDefault(jss_plugin_default_unit_1dnt, 'default');
importer.importStatuses['jss-plugin-default-unit'] = 'default';

import * as jss_plugin_vendor_prefixer_vqih from 'jss-plugin-vendor-prefixer';
importer.modules['jss-plugin-vendor-prefixer'] = interopDefault(jss_plugin_vendor_prefixer_vqih, 'default');
importer.importStatuses['jss-plugin-vendor-prefixer'] = 'default';

import * as jss_plugin_props_sort_d1d2 from 'jss-plugin-props-sort';
importer.modules['jss-plugin-props-sort'] = interopDefault(jss_plugin_props_sort_d1d2, 'default');
importer.importStatuses['jss-plugin-props-sort'] = 'default';

import * as is_in_browser_qobi from 'is-in-browser';
importer.modules['is-in-browser'] = interopDefault(is_in_browser_qobi, 'default');
importer.importStatuses['is-in-browser'] = 'default';

import * as tiny_warning_spct from 'tiny-warning';
importer.modules['tiny-warning'] = interopDefault(tiny_warning_spct, 'default');
importer.importStatuses['tiny-warning'] = 'default';

import * as hyphenate_style_name_qkpz from 'hyphenate-style-name';
importer.modules['hyphenate-style-name'] = interopDefault(hyphenate_style_name_qkpz, 'default');
importer.importStatuses['hyphenate-style-name'] = 'default';

import * as css_vendor_290g from 'css-vendor';
importer.modules['css-vendor'] = interopDefault(css_vendor_290g, 'default');
importer.importStatuses['css-vendor'] = 'default';

import * as scheduler_ncwi from 'scheduler';
importer.modules['scheduler'] = interopDefault(scheduler_ncwi, 'default');
importer.importStatuses['scheduler'] = 'default';

import * as _wry_equality_lp7l from '@wry/equality';
importer.modules['@wry/equality'] = interopDefault(_wry_equality_lp7l, 'default');
importer.importStatuses['@wry/equality'] = 'default';

import * as tslib_ss3x from 'tslib';
importer.modules['tslib'] = interopDefault(tslib_ss3x, 'default');
importer.importStatuses['tslib'] = 'default';

import * as graphql_tag_gyj5 from 'graphql-tag';
importer.modules['graphql-tag'] = interopDefault(graphql_tag_gyj5, 'default');
importer.importStatuses['graphql-tag'] = 'default';

import * as symbol_observable_29cs from 'symbol-observable';
importer.modules['symbol-observable'] = interopDefault(symbol_observable_29cs, 'default');
importer.importStatuses['symbol-observable'] = 'default';

import * as zen_observable_4pnk from 'zen-observable';
importer.modules['zen-observable'] = interopDefault(zen_observable_4pnk, 'default');
importer.importStatuses['zen-observable'] = 'default';

import * as ts_invariant_b1gy from 'ts-invariant';
importer.modules['ts-invariant'] = interopDefault(ts_invariant_b1gy, 'default');
importer.importStatuses['ts-invariant'] = 'default';

import * as optimism_2tdg from 'optimism';
importer.modules['optimism'] = interopDefault(optimism_2tdg, 'default');
importer.importStatuses['optimism'] = 'default';

import * as throttle_debounce_1e0r from 'throttle-debounce';
importer.modules['throttle-debounce'] = interopDefault(throttle_debounce_1e0r, 'default');
importer.importStatuses['throttle-debounce'] = 'default';

import * as pure_react_carousel_z7fd from 'pure-react-carousel';
importer.modules['pure-react-carousel'] = interopDefault(pure_react_carousel_z7fd, 'default');
importer.importStatuses['pure-react-carousel'] = 'default';

import * as _apollo_client_0s3z from '@apollo/client';
importer.modules['@apollo/client'] = interopDefault(_apollo_client_0s3z, 'default');
importer.importStatuses['@apollo/client'] = 'default';


importer.modules['next/document'] = {};
importer.modules['next/router'] = {};
importer.modules['next/amp'] = {};
importer.modules['next/dynamic'] = loadableComponent;
importer.modules['next/link'] = {};
importer.modules['next/head'] = {};
importer.modules['next/image'] = (props) => <img src={props?.src?.src ?? props?.src} />;