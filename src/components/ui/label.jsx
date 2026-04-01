var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Label=void 0;var _objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");var _excluded=["children","style"];

var Label=exports.Label=function Label(_ref){var children=_ref.children,style=_ref.style,props=(0,_objectWithoutProperties2.default)(_ref,_excluded);
return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,Object.assign({style:[styles.label,style]},props,{children:children}));
};

var styles=_reactNative.StyleSheet.create({
label:{fontSize:14,fontWeight:'500',color:'#111827',marginBottom:6}
});