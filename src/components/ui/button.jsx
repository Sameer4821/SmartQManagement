var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Button=void 0;var _objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");var _excluded=["children","onPress","variant","size","style","className","disabled"];

var Button=exports.Button=function Button(_ref){var children=_ref.children,onPress=_ref.onPress,_ref$variant=_ref.variant,variant=_ref$variant===void 0?'default':_ref$variant,_ref$size=_ref.size,size=_ref$size===void 0?'default':_ref$size,style=_ref.style,className=_ref.className,disabled=_ref.disabled,props=(0,_objectWithoutProperties2.default)(_ref,_excluded);
var w=(0,_reactNative.useWindowDimensions)().width;var mob=w<768;
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,Object.assign({
disabled:disabled,
onPress:onPress,
style:[
styles.base,
mob&&styles.baseMobile,
styles[variant],
styles[size],
disabled&&styles.disabled,
style]},

props,{children:/*#__PURE__*/

(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.textBase,mob&&styles.textBaseMobile,styles[`${variant}Text`]],children:children})}))
);

};

var styles=_reactNative.StyleSheet.create({
base:{borderRadius:9999,justifyContent:'center',alignItems:'center',flexDirection:'row',paddingVertical:12,paddingHorizontal:24},
baseMobile:{paddingVertical:10,paddingHorizontal:18},
default:{backgroundColor:'#0ea5e9',shadowColor:'#0ea5e9',shadowOffset:{width:0,height:4},shadowOpacity:0.2,shadowRadius:8,elevation:4},
destructive:{backgroundColor:'#ef4444'},
outline:{backgroundColor:'transparent',borderWidth:2,borderColor:'#e0f2fe'},
secondary:{backgroundColor:'#f0fdfa'},
ghost:{backgroundColor:'transparent'},
link:{backgroundColor:'transparent'},
defaultText:{color:'#ffffff',fontWeight:'600'},
destructiveText:{color:'#ffffff',fontWeight:'600'},
outlineText:{color:'#0284c7',fontWeight:'600'},
secondaryText:{color:'#0369a1',fontWeight:'600'},
ghostText:{color:'#64748b'},
linkText:{color:'#0ea5e9',textDecorationLine:'underline'},
sm:{paddingVertical:8,paddingHorizontal:16},
lg:{paddingVertical:16,paddingHorizontal:32},
icon:{width:48,height:48,justifyContent:'center',alignItems:'center',borderRadius:24,paddingVertical:0,paddingHorizontal:0},
textBase:{fontWeight:'500',fontSize:16,letterSpacing:0.3},
textBaseMobile:{fontSize:14},
disabled:{opacity:0.6}
});