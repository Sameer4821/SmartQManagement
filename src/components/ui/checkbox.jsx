var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Checkbox=void 0;var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");

var Checkbox=exports.Checkbox=function Checkbox(_ref){var id=_ref.id,checked=_ref.checked,onCheckedChange=_ref.onCheckedChange,style=_ref.style;
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{
style:[styles.checkbox,checked&&styles.checked,style],
onPress:function onPress(){return onCheckedChange(!checked);},
activeOpacity:0.8,children:

checked&&/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.checkmark})}
));

};

var styles=_reactNative.StyleSheet.create({
checkbox:{height:16,width:16,borderRadius:4,borderWidth:1,borderColor:'#d1d5db',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'},
checked:{backgroundColor:'#2563eb',borderColor:'#2563eb'},
checkmark:{width:8,height:8,backgroundColor:'#fff',borderRadius:2}
});