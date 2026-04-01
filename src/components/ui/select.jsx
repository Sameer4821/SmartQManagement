var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.SelectValue=exports.SelectTrigger=exports.SelectItem=exports.SelectContent=exports.Select=void 0;var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _react=_interopRequireWildcard(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

var Select=exports.Select=function Select(_ref){var children=_ref.children,onValueChange=_ref.onValueChange,value=_ref.value,defaultValue=_ref.defaultValue;
var _useState=(0,_react.useState)(false),_useState2=(0,_slicedToArray2.default)(_useState,2),isOpen=_useState2[0],setIsOpen=_useState2[1];
var _useState3=(0,_react.useState)(value||defaultValue),_useState4=(0,_slicedToArray2.default)(_useState3,2),currentValue=_useState4[0],setCurrentValue=_useState4[1];

var handleSelect=function handleSelect(val){
setCurrentValue(val);
onValueChange==null||onValueChange(val);
setIsOpen(false);
};

return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.container,children:
_react.default.Children.map(children,function(child){
if(!/*#__PURE__*/_react.default.isValidElement(child))return child;
return/*#__PURE__*/_react.default.cloneElement(child,{isOpen:isOpen,setIsOpen:setIsOpen,onSelect:handleSelect,selectedValue:currentValue});
})}
));

};

var SelectTrigger=exports.SelectTrigger=function SelectTrigger(_ref2){var children=_ref2.children,isOpen=_ref2.isOpen,setIsOpen=_ref2.setIsOpen,style=_ref2.style;return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{style:[styles.trigger,style],onPress:function onPress(){return setIsOpen(!isOpen);},children:
children}
));};


var SelectValue=exports.SelectValue=function SelectValue(_ref3){var placeholder=_ref3.placeholder,selectedValue=_ref3.selectedValue;return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.valueText,children:selectedValue||placeholder}));};


var SelectContent=exports.SelectContent=function SelectContent(_ref4){var children=_ref4.children,isOpen=_ref4.isOpen,setIsOpen=_ref4.setIsOpen,onSelect=_ref4.onSelect;
if(!isOpen)return null;
var items=_react.default.Children.toArray(children).map(function(child){return{
label:child.props.children||child.props.value,
value:child.props.value
};});

return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Modal,{visible:isOpen,transparent:true,animationType:"fade",children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{style:styles.modalOverlay,onPress:function onPress(){return setIsOpen(false);},activeOpacity:1,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.modalContent,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.FlatList,{
data:items,
keyExtractor:function keyExtractor(item){return String(item.value);},
renderItem:function renderItem(_ref5){var item=_ref5.item;return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{style:styles.item,onPress:function onPress(){return onSelect(item.value);},children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.itemText,children:item.label})}
));}}

)}
)}
)}
));

};

var SelectItem=exports.SelectItem=function SelectItem(_ref6){var children=_ref6.children,value=_ref6.value;return null;};// Handled by SelectContent

var styles=_reactNative.StyleSheet.create({
container:{position:'relative'},
trigger:{height:40,borderColor:'#e5e7eb',borderWidth:1,borderRadius:6,paddingHorizontal:12,justifyContent:'center',backgroundColor:'#fff'},
valueText:{fontSize:14,color:'#111827'},
modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'},
modalContent:{width:'80%',maxHeight:'50%',backgroundColor:'#fff',borderRadius:8,padding:8},
item:{padding:12,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
itemText:{fontSize:16}
});