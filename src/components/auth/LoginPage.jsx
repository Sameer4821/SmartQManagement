var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.LoginPage=void 0;var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _react=_interopRequireWildcard(require("react"));
var _reactNative=require("react-native");
var _AuthContext=require("../../contexts/AuthContext");
var _AppContext=require("../../context/AppContext");
var _button=require("../ui/button");
var _input=require("../ui/input");
var _label=require("../ui/label");
var _card=require("../ui/card");
var _lucideReactNative=require("lucide-react-native");var _jsxRuntime=require("react/jsx-runtime");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

var LoginPage=exports.LoginPage=function LoginPage(_ref){var onSuccess=_ref.onSuccess,onBack=_ref.onBack;
var _useAuth=(0,_AuthContext.useAuth)(),signIn=_useAuth.signIn;
var _useAppContext=(0,_AppContext.useAppContext)(),setState=_useAppContext.setState;
var _useState=(0,_react.useState)(''),_useState2=(0,_slicedToArray2.default)(_useState,2),email=_useState2[0],setEmail=_useState2[1];
var _useState3=(0,_react.useState)(''),_useState4=(0,_slicedToArray2.default)(_useState3,2),password=_useState4[0],setPassword=_useState4[1];
var _useState5=(0,_react.useState)(false),_useState6=(0,_slicedToArray2.default)(_useState5,2),loading=_useState6[0],setLoading=_useState6[1];
var _useState7=(0,_react.useState)(''),_useState8=(0,_slicedToArray2.default)(_useState7,2),error=_useState8[0],setError=_useState8[1];

var handleSubmit=/*#__PURE__*/function(){var _ref2=(0,_asyncToGenerator2.default)(function*(){
setError('');
setLoading(true);
try{
var _yield$signIn=yield signIn(email,password),_error=_yield$signIn.error;
if(_error){
var errorMsg=_error.message||'Invalid email or password';
setError(errorMsg);
_reactNative.Alert.alert('Login Failed',errorMsg);
}else{
_reactNative.Alert.alert('Welcome back!','Redirecting to your dashboard...');
onSuccess();
}
}catch(err){
setError('An unexpected error occurred. Please try again.');
}finally{
setLoading(false);
}
});return function handleSubmit(){return _ref2.apply(this,arguments);};}();

return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.KeyboardAvoidingView,{behavior:_reactNative.Platform.OS==='ios'?'padding':'height',style:styles.container,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.ScrollView,{contentContainerStyle:styles.scroll,children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.Card,{style:styles.card,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.CardHeader,{style:styles.header,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.backRow,children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_button.Button,{variant:"ghost",size:"sm",onPress:function onPress(){return setState(function(prev){return Object.assign({},prev,{currentView:'patient-details'});});},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.ArrowLeft,{size:16}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{marginLeft:4},children:"Back"})]}
)}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardTitle,{children:"Welcome Back"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardDescription,{children:"Sign in to your hospital account"})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.CardContent,{children:[
error?/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.errorBox,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.AlertCircle,{size:16,color:"red"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.errorText,children:error})]}
):
null,/*#__PURE__*/

(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.formSpace,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_label.Label,{children:"Email Address"}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.inputWrap,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Mail,{size:16,color:"#9ca3af",style:styles.inputIcon}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_input.Input,{placeholder:"your.email@example.com",value:email,onChangeText:setEmail,autoCapitalize:"none",keyboardType:"email-address",style:styles.inputField})]}
)]}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_label.Label,{children:"Password"}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.inputWrap,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Lock,{size:16,color:"#9ca3af",style:styles.inputIcon}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_input.Input,{placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",value:password,onChangeText:setPassword,secureTextEntry:true,style:styles.inputField})]}
)]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_button.Button,{onPress:handleSubmit,disabled:loading,style:styles.submitBtn,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.submitText,children:loading?'Signing in...':'Sign In'})}
)]}
)]}
)]}
)}
)}
));

};

var styles=_reactNative.StyleSheet.create({
container:{flex:1,backgroundColor:'#eff6ff'},
scroll:{flexGrow:1,justifyContent:'center',padding:16},
card:{width:'100%',maxWidth:400,alignSelf:'center'},
header:{alignItems:'flex-start'},
backRow:{flexDirection:'row',marginBottom:8},
errorBox:{flexDirection:'row',alignItems:'center',backgroundColor:'#fef2f2',padding:12,borderRadius:8,marginBottom:16},
errorText:{color:'#ef4444',marginLeft:8,fontSize:14},
formSpace:{gap:16},
inputWrap:{flexDirection:'row',alignItems:'center',position:'relative',marginTop:4},
inputIcon:{position:'absolute',left:12,zIndex:1},
inputField:{paddingLeft:36,width:'100%'},
submitBtn:{backgroundColor:'#2563eb',marginTop:16,width:'100%'},
submitText:{color:'#fff',fontWeight:'bold'}
});
