var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.TableRow=exports.TableHeader=exports.TableHead=exports.TableCell=exports.TableBody=exports.Table=void 0;var _react=_interopRequireDefault(require("react"));
var _reactNative=require("react-native");var _jsxRuntime=require("react/jsx-runtime");

var Table=exports.Table=function Table(_ref){var children=_ref.children,style=_ref.style;return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.ScrollView,{horizontal:true,style:[styles.table,style],children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{children:children})}
));};


var TableHeader=exports.TableHeader=function TableHeader(_ref2){var children=_ref2.children,style=_ref2.style;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.header,style],children:children});};
var TableBody=exports.TableBody=function TableBody(_ref3){var children=_ref3.children,style=_ref3.style;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:style,children:children});};
var TableRow=exports.TableRow=function TableRow(_ref4){var children=_ref4.children,style=_ref4.style;return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.row,style],children:children});};
var TableHead=exports.TableHead=function TableHead(_ref5){var children=_ref5.children,style=_ref5.style,className=_ref5.className;return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.headCell,style],children:
typeof children==='string'?/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.headText,children:children}):children}
));};

var TableCell=exports.TableCell=function TableCell(_ref6){var children=_ref6.children,style=_ref6.style,className=_ref6.className;return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.cell,style],children:
typeof children==='string'||typeof children==='number'?/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.cellText,children:children}):children}
));};


var styles=_reactNative.StyleSheet.create({
table:{width:'100%',marginBottom:16},
header:{borderBottomWidth:1,borderBottomColor:'#e5e7eb'},
row:{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#f3f4f6',alignItems:'center',minHeight:48},
headCell:{flex:1,paddingHorizontal:16,paddingVertical:12,minWidth:100,justifyContent:'center'},
headText:{fontSize:13,fontWeight:'600',color:'#6b7280'},
cell:{flex:1,paddingHorizontal:16,paddingVertical:12,minWidth:100,justifyContent:'center'},
cellText:{fontSize:14,color:'#111827'}
});