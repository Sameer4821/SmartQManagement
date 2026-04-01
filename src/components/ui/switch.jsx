var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Switch=void 0;var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");

var Switch=exports.Switch=function Switch(_ref){var checked=_ref.checked,onCheckedChange=_ref.onCheckedChange,disabled=_ref.disabled,style=_ref.style;
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Switch,{
value:checked,
onValueChange:onCheckedChange,
disabled:disabled,
trackColor:{false:"#e5e7eb",true:"#2563eb"},
thumbColor:"#ffffff",
style:style}
));

};