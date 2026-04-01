var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Input=void 0;var _objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");var _excluded=["style"];

var Input=exports.Input=/*#__PURE__*/_react.default.forwardRef(function(_ref,ref){var style=_ref.style,props=(0,_objectWithoutProperties2.default)(_ref,_excluded);
return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.TextInput,Object.assign({ref:ref,style:[styles.input,style],placeholderTextColor:"#9ca3af"},props));
});
Input.displayName='Input';

var styles=_reactNative.StyleSheet.create({
input:{height:48,borderColor:'#e0f2fe',borderWidth:1.5,borderRadius:12,paddingHorizontal:16,backgroundColor:'#ffffff',fontSize:16,color:'#0f172a'}// taller, rounder, softer border
});