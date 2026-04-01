var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Progress=void 0;var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");

var Progress=exports.Progress=function Progress(_ref){var _ref$value=_ref.value,value=_ref$value===void 0?0:_ref$value,style=_ref.style,className=_ref.className;
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.track,style],children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.fill,{width:`${Math.min(Math.max(value,0),100)}%`}]})}
));

};

var styles=_reactNative.StyleSheet.create({
track:{height:8,backgroundColor:'#f3f4f6',borderRadius:4,overflow:'hidden',width:'100%'},
fill:{height:'100%',backgroundColor:'#2563eb'}
});