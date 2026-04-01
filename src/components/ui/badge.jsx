var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Badge=void 0;var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");

var Badge=exports.Badge=function Badge(_ref){var children=_ref.children,_ref$variant=_ref.variant,variant=_ref$variant===void 0?'default':_ref$variant,style=_ref.style;
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.badge,styles[variant],style],children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.text,styles[`${variant}Text`]],children:children})}
));

};

var styles=_reactNative.StyleSheet.create({
badge:{paddingHorizontal:8,paddingVertical:2,borderRadius:12,alignSelf:'flex-start'},
default:{backgroundColor:'#111827'},
secondary:{backgroundColor:'#f3f4f6'},
destructive:{backgroundColor:'#ef4444'},
outline:{backgroundColor:'transparent',borderWidth:1,borderColor:'#e5e7eb'},
text:{fontSize:12,fontWeight:'600'},
defaultText:{color:'#fff'},
secondaryText:{color:'#1f2937'},
destructiveText:{color:'#fff'},
outlineText:{color:'#111827'}
});