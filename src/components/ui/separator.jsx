var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Separator=void 0;var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");

var Separator=exports.Separator=function Separator(_ref){var _ref$orientation=_ref.orientation,orientation=_ref$orientation===void 0?'horizontal':_ref$orientation,style=_ref.style,className=_ref.className;
return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:[orientation==='horizontal'?styles.horizontal:styles.vertical,style]});
};

var styles=_reactNative.StyleSheet.create({
horizontal:{height:1,width:'100%',backgroundColor:'#e5e7eb',marginVertical:8},
vertical:{width:1,height:'100%',backgroundColor:'#e5e7eb',marginHorizontal:8}
});