var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.Chatbot=Chatbot;var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _react=_interopRequireWildcard(require("react"));
var _reactNative=require("react-native");
var _AppContext=require("../context/AppContext");
var _button=require("./ui/button");
var _card=require("./ui/card");
var _lucideReactNative=require("lucide-react-native");var _jsxRuntime=require("react/jsx-runtime");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}









var quickSuggestions=[
"Department information",
"Token booking help",
"Operating hours",
"Contact info",
"Admission process"];


var _Dimensions$get=_reactNative.Dimensions.get('window'),height=_Dimensions$get.height;

function Chatbot(){
var _useAppContext=(0,_AppContext.useAppContext)(),state=_useAppContext.state;
var _useState=(0,_react.useState)(false),_useState2=(0,_slicedToArray2.default)(_useState,2),isOpen=_useState2[0],setIsOpen=_useState2[1];
var _useState3=(0,_react.useState)([{
id:'1',
type:'bot',
message:"🏥 Welcome to Government District Hospital!\n\nI'm your AI assistant, here to help you with:\n• Doctor information\n• Hospital admission\n• Department services\n• Token booking\n• Emergency services\n\nHow can I assist you today?",
timestamp:new Date(),
suggestions:quickSuggestions.slice(0,4)
}]),_useState4=(0,_slicedToArray2.default)(_useState3,2),messages=_useState4[0],setMessages=_useState4[1];
var _useState5=(0,_react.useState)(''),_useState6=(0,_slicedToArray2.default)(_useState5,2),inputValue=_useState6[0],setInputValue=_useState6[1];
var _useState7=(0,_react.useState)(false),_useState8=(0,_slicedToArray2.default)(_useState7,2),isTyping=_useState8[0],setIsTyping=_useState8[1];
var scrollViewRef=(0,_react.useRef)(null);

var scrollToBottom=function scrollToBottom(){var _scrollViewRef$curren;
(_scrollViewRef$curren=scrollViewRef.current)==null||_scrollViewRef$curren.scrollToEnd({animated:true});
};

(0,_react.useEffect)(function(){
scrollToBottom();
},[messages,isTyping]);

var generateBotResponse=function generateBotResponse(userMessage){
var lowerMessage=userMessage.toLowerCase();

if(lowerMessage.includes('doctor')||lowerMessage.includes('staff')){
var allDoctors=state.departments.flatMap(function(dept){return(
dept.doctors.map(function(doc){return Object.assign({},doc,{department:dept.name});}));}
);
if(lowerMessage.includes('available')){
var availableDoctors=allDoctors.filter(function(doc){return doc.status==='available';});
return{
id:Date.now().toString(),
type:'bot',
message:`🩺 **Available Doctors Today:**\n\n${availableDoctors.map(function(doc){return(
`**Dr. ${doc.name}**\n${doc.specialization} | ${doc.department}\n✅ Available\n`);}
).join('\n')}`,
timestamp:new Date(),
suggestions:['Book appointment','Emergency services']
};
}
return{
id:Date.now().toString(),
type:'bot',
message:`👨‍⚕️ **Hospital Medical Staff:**\nCheck department sections in the portal for complete doctor details.`,
timestamp:new Date(),
suggestions:['Available doctors','Book appointment']
};
}

if(lowerMessage.includes('emergency')){
return{
id:Date.now().toString(),
type:'bot',
message:`🚨 **Emergency Services - 24×7 Available**\n\n📞 **Ambulance:** 102\n📞 **Hospital Emergency:** +91-22-1234-1100\n\nGo directly to the Ground Floor Emergency Ward. No token required for life-threatening cases.`,
timestamp:new Date(),
suggestions:['Contact info','Operating hours']
};
}

if(lowerMessage.includes('token')||lowerMessage.includes('appointment')){
return{
id:Date.now().toString(),
type:'bot',
message:`🎫 **Smart Token System:**\n\nOne token valid for entire day. Access consultation, lab, and pharmacy without repeating details. Book a token via the portal dashboard.`,
timestamp:new Date(),
suggestions:['Department information']
};
}

if(lowerMessage.includes('hour')||lowerMessage.includes('time')||lowerMessage.includes('contact')){
return{
id:Date.now().toString(),
type:'bot',
message:`🕐 **Operating Hours & Contact:**\n\n🌅 OPD: 8:00 AM - 6:00 PM\n🌙 Emergency: 24×7\n💊 Pharmacy: 24×7\n\n📞 Reception: +91-22-1234-5678\n🚨 Emergency: +91-22-1234-1100`,
timestamp:new Date()
};
}

return{
id:Date.now().toString(),
type:'bot',
message:`🤔 I'd be happy to help you with that!\n\n**I can assist you with:**\n🩺 Medical Staff\n📋 Hospital Services\n🎫 Appointments\n🚨 Emergency\n\nPlease let me know what specific info you need!`,
timestamp:new Date(),
suggestions:['Available doctors','Emergency contacts','Token system']
};
};

var handleSendMessage=function handleSendMessage(messageText){
var messageToSend=messageText||inputValue;
if(!messageToSend.trim())return;

var userMessage={
id:Date.now().toString(),
type:'user',
message:messageToSend,
timestamp:new Date()
};

setMessages(function(prev){return[].concat((0,_toConsumableArray2.default)(prev),[userMessage]);});
setInputValue('');
setIsTyping(true);

setTimeout(function(){
setMessages(function(prev){return[].concat((0,_toConsumableArray2.default)(prev),[generateBotResponse(messageToSend)]);});
setIsTyping(false);
},1000);
};

var clearChat=function clearChat(){
setMessages([{
id:'1',
type:'bot',
message:"🏥 Chat cleared! How can I help you today?",
timestamp:new Date(),
suggestions:quickSuggestions.slice(0,4)
}]);
};

if(!isOpen){
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.fabContainer,children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_button.Button,{onPress:function onPress(){return setIsOpen(true);},style:styles.fabBtn,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.MessageCircle,{size:28,color:"#fff"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.fabDot})]}
)}
));

}

return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.KeyboardAvoidingView,{
behavior:_reactNative.Platform.OS==='ios'?'padding':undefined,
style:[styles.chatWindow,{height:height*0.75}],
pointerEvents:"box-none",children:/*#__PURE__*/

(0,_jsxRuntime.jsxs)(_card.Card,{style:styles.card,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardHeader,{style:styles.header,children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.rowBetween,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.headerIcon,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Stethoscope,{size:20,color:"#fff"})}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{marginLeft:12},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.headerTitle,children:"Hospital AI Assistant"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.headerSub,children:"Online \u2022 Ready to help"})]}
)]}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{onPress:clearChat,style:{padding:8},children:/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{color:'#fff',fontSize:12},children:"Clear"})}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{onPress:function onPress(){return setIsOpen(false);},style:{padding:8},children:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.X,{size:20,color:"#fff"})})]}
)]}
)}
),/*#__PURE__*/

(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.quickSuggBar,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.ScrollView,{horizontal:true,showsHorizontalScrollIndicator:false,children:
quickSuggestions.slice(0,3).map(function(sugg,idx){return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{onPress:function onPress(){return handleSendMessage(sugg);},style:styles.quickSuggBtn,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.quickSuggText,children:sugg})},idx
));}
)}
)}
),/*#__PURE__*/

(0,_jsxRuntime.jsxs)(_reactNative.ScrollView,{ref:scrollViewRef,style:styles.messagesArea,contentContainerStyle:{padding:16},children:[
messages.map(function(msg){return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.msgLine,msg.type==='user'?styles.msgLineUser:styles.msgLineBot],children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.msgBubble,msg.type==='user'?styles.msgBubbleUser:styles.msgBubbleBot],children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.row,{marginBottom:4,opacity:0.8}],children:[
msg.type==='user'?/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.User,{size:12,color:"#fff"}):/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Bot,{size:12,color:"#1d4ed8"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.msgTime,msg.type==='user'?{color:'#fff'}:{color:'#6b7280'}],children:
msg.timestamp.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
)]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.msgText,msg.type==='user'?{color:'#fff'}:{color:'#111827'}],children:msg.message}),
msg.suggestions&&msg.suggestions.length>0&&/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.suggWrap,children:
msg.suggestions.map(function(s,idx){return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{onPress:function onPress(){return handleSendMessage(s);},style:styles.suggBtn,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.suggBtnText,children:s})},idx
));}
)}
)]}

)},msg.id
));}
),
isTyping&&/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.msgLine,styles.msgLineBot],children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.msgBubble,styles.msgBubbleBot],children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Bot,{size:12,color:"#1d4ed8",style:{marginRight:4}}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:12,color:'#6b7280'},children:"Typing..."})]}
)}
)}
)]}

),/*#__PURE__*/

(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.inputArea,children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.inputWrap,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TextInput,{
style:styles.input,
placeholder:"Type your question...",
value:inputValue,
onChangeText:setInputValue,
onSubmitEditing:function onSubmitEditing(){return handleSendMessage();}}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{style:styles.sendBtn,onPress:function onPress(){return handleSendMessage();},disabled:!inputValue.trim()||isTyping,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Send,{size:16,color:"#fff"})}
)]}
)}
)]}
)}
));

}

var styles=_reactNative.StyleSheet.create({
fabContainer:{position:'absolute',bottom:24,right:24,zIndex:50},
fabBtn:{width:64,height:64,borderRadius:32,backgroundColor:'#2563eb',alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.3,shadowRadius:8,elevation:8},
fabDot:{position:'absolute',top:12,right:12,width:12,height:12,backgroundColor:'#22c55e',borderRadius:6},
chatWindow:{position:'absolute',bottom:0,right:0,zIndex:50,width:'100%',maxWidth:400,padding:16,justifyContent:'flex-end'},
card:{flex:1,backgroundColor:'#fff',overflow:'hidden',shadowColor:'#000',shadowOffset:{width:0,height:-4},shadowOpacity:0.2,shadowRadius:16,elevation:12},
header:{backgroundColor:'#2563eb',padding:16,borderBottomWidth:0},
row:{flexDirection:'row',alignItems:'center'},
rowBetween:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
headerIcon:{width:36,height:36,borderRadius:18,backgroundColor:'rgba(255,255,255,0.2)',alignItems:'center',justifyContent:'center'},
headerTitle:{color:'#fff',fontSize:16,fontWeight:'bold'},
headerSub:{color:'#fff',fontSize:12,opacity:0.8},
quickSuggBar:{backgroundColor:'#eff6ff',padding:8,borderBottomWidth:1,borderBottomColor:'#e5e7eb'},
quickSuggBtn:{backgroundColor:'#fff',paddingHorizontal:10,paddingVertical:4,borderRadius:12,marginRight:8,borderWidth:1,borderColor:'#bfdbfe'},
quickSuggText:{fontSize:11,color:'#1d4ed8'},
messagesArea:{flex:1,backgroundColor:'#f9fafb'},
msgLine:{flexDirection:'row',marginBottom:12},
msgLineUser:{justifyContent:'flex-end'},
msgLineBot:{justifyContent:'flex-start'},
msgBubble:{maxWidth:'85%',padding:12,borderRadius:12},
msgBubbleUser:{backgroundColor:'#2563eb',borderBottomRightRadius:2},
msgBubbleBot:{backgroundColor:'#e5e7eb',borderBottomLeftRadius:2},
msgTime:{marginLeft:4,fontSize:10},
msgText:{fontSize:14,lineHeight:20},
suggWrap:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:8},
suggBtn:{paddingHorizontal:8,paddingVertical:4,borderRadius:12,borderWidth:1,borderColor:'#d1d5db',backgroundColor:'#fff'},
suggBtnText:{fontSize:11,color:'#374151'},
inputArea:{padding:12,borderTopWidth:1,borderTopColor:'#e5e7eb',backgroundColor:'#fff'},
inputWrap:{flexDirection:'row',alignItems:'center'},
input:{flex:1,backgroundColor:'#f3f4f6',borderRadius:20,paddingHorizontal:16,paddingVertical:8,fontSize:14,marginRight:8},
sendBtn:{width:40,height:40,borderRadius:20,backgroundColor:'#2563eb',alignItems:'center',justifyContent:'center'}
});
