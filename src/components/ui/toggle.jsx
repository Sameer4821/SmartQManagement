var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Toggle=void 0;var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");

var Toggle=exports.Toggle=function Toggle(_ref){var pressed=_ref.pressed,onPressedChange=_ref.onPressedChange,children=_ref.children,style=_ref.style,_ref$variant=_ref.variant,variant=_ref$variant===void 0?'default':_ref$variant;
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{
style:[styles.base,pressed&&styles.pressed,style],
onPress:function onPress(){return onPressedChange(!pressed);},children:/*#__PURE__*/

(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.text,pressed&&styles.pressedText],children:children})}
));

};

var styles=_reactNative.StyleSheet.create({
base:{paddingHorizontal:12,paddingVertical:8,borderRadius:6,backgroundColor:'transparent',borderWidth:1,borderColor:'#e5e7eb',justifyContent:'center',alignItems:'center'},
pressed:{backgroundColor:'#f3f4f6'},
text:{fontSize:14,fontWeight:'500',color:'#374151'},
pressedText:{color:'#111827'}
});