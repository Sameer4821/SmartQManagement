var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.TabsTrigger=exports.TabsList=exports.TabsContent=exports.Tabs=void 0;var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _react=_interopRequireWildcard(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

var Tabs=exports.Tabs=function Tabs(_ref){var defaultValue=_ref.defaultValue,value=_ref.value,onValueChange=_ref.onValueChange,children=_ref.children,style=_ref.style;
var _useState=(0,_react.useState)(value||defaultValue),_useState2=(0,_slicedToArray2.default)(_useState,2),activeTab=_useState2[0],setActiveTab=_useState2[1];

(0,_react.useEffect)(function(){
if(value!==undefined){
setActiveTab(value);
}
},[value]);

var handleTabChange=function handleTabChange(newVal){
setActiveTab(newVal);
onValueChange==null||onValueChange(newVal);
};

return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:style,children:
_react.default.Children.map(children,function(child){
if(!/*#__PURE__*/_react.default.isValidElement(child))return child;
return/*#__PURE__*/_react.default.cloneElement(child,{activeTab:activeTab,setActiveTab:handleTabChange});
})}
));

};

var TabsList=exports.TabsList=function TabsList(_ref2){var children=_ref2.children,activeTab=_ref2.activeTab,setActiveTab=_ref2.setActiveTab,style=_ref2.style;return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.list,style],children:
_react.default.Children.map(children,function(child){
if(!/*#__PURE__*/_react.default.isValidElement(child))return child;
return/*#__PURE__*/_react.default.cloneElement(child,{activeTab:activeTab,setActiveTab:setActiveTab});
})}
));};


var TabsTrigger=exports.TabsTrigger=function TabsTrigger(_ref3){var value=_ref3.value,children=_ref3.children,activeTab=_ref3.activeTab,setActiveTab=_ref3.setActiveTab,style=_ref3.style;
var isActive=activeTab===value;
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{
style:[styles.trigger,isActive&&styles.triggerActive,style],
onPress:function onPress(){return setActiveTab(value);},children:/*#__PURE__*/

(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.triggerText,isActive&&styles.triggerTextActive],children:children})}
));

};

var TabsContent=exports.TabsContent=function TabsContent(_ref4){var value=_ref4.value,children=_ref4.children,activeTab=_ref4.activeTab,style=_ref4.style;
if(activeTab!==value)return null;
return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.content,style],children:children});
};

var styles=_reactNative.StyleSheet.create({
list:{flexDirection:'row',backgroundColor:'#f3f4f6',borderRadius:6,padding:4},
trigger:{flex:1,paddingVertical:6,paddingHorizontal:12,alignItems:'center',borderRadius:4},
triggerActive:{backgroundColor:'#fff',shadowColor:'#000',shadowOpacity:0.1,shadowRadius:2,elevation:1},
triggerText:{fontSize:14,fontWeight:'500',color:'#6b7280'},
triggerTextActive:{color:'#111827'},
content:{marginTop:12}
});