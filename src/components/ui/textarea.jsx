var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Textarea=void 0;var _objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");var _excluded=["style"];

var Textarea=exports.Textarea=/*#__PURE__*/_react.default.forwardRef(function(_ref,ref){var style=_ref.style,props=(0,_objectWithoutProperties2.default)(_ref,_excluded);
return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.TextInput,Object.assign({ref:ref,multiline:true,style:[styles.input,style],placeholderTextColor:"#9ca3af"},props));
});
Textarea.displayName='Textarea';

var styles=_reactNative.StyleSheet.create({
input:{minHeight:80,textAlignVertical:'top',borderColor:'#e5e7eb',borderWidth:1,borderRadius:6,paddingHorizontal:12,paddingTop:12,paddingBottom:12,backgroundColor:'#fff',fontSize:14,color:'#111827'}
});