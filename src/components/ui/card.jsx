var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.CardTitle=exports.CardHeader=exports.CardFooter=exports.CardDescription=exports.CardContent=exports.Card=void 0;var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");

var Card=exports.Card=function Card(_ref){var children=_ref.children,style=_ref.style;var w=(0,_reactNative.useWindowDimensions)().width;var mob=w<768;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.card,mob&&styles.cardMobile,style],children:children});};
var CardHeader=exports.CardHeader=function CardHeader(_ref2){var children=_ref2.children,style=_ref2.style;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.header,style],children:children});};
var CardTitle=exports.CardTitle=function CardTitle(_ref3){var children=_ref3.children,style=_ref3.style;var w=(0,_reactNative.useWindowDimensions)().width;var mob=w<768;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.title,mob&&styles.titleMobile,style],children:children});};
var CardDescription=exports.CardDescription=function CardDescription(_ref4){var children=_ref4.children,style=_ref4.style;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.description,style],children:children});};
var CardContent=exports.CardContent=function CardContent(_ref5){var children=_ref5.children,style=_ref5.style;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.content,style],children:children});};
var CardFooter=exports.CardFooter=function CardFooter(_ref6){var children=_ref6.children,style=_ref6.style;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.footer,style],children:children});};

var styles=_reactNative.StyleSheet.create({
card:{backgroundColor:'#ffffff',borderRadius:24,padding:24,marginVertical:12,shadowColor:'#0ea5e9',shadowOffset:{width:0,height:8},shadowOpacity:0.08,shadowRadius:24,elevation:4,borderWidth:1,borderColor:'rgba(224, 242, 254, 0.5)'},
cardMobile:{borderRadius:14,padding:14,marginVertical:8},
header:{marginBottom:12},
title:{fontSize:20,fontWeight:'700',color:'#0f172a',letterSpacing:-0.5},
titleMobile:{fontSize:16},
description:{fontSize:15,color:'#64748b',marginTop:6,lineHeight:22},
content:{marginTop:12},
footer:{marginTop:24}
});