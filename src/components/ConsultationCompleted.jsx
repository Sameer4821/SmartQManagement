Object.defineProperty(exports,"__esModule",{value:true});exports.ConsultationCompleted=ConsultationCompleted;var _react=_interopRequireWildcard(require("react"));
var _reactNative=require("react-native");
var _AppContext=require("../context/AppContext");

var _button=require("./ui/button");
var _card=require("./ui/card");
var _badge=require("./ui/badge");
var _lucideReactNative=require("lucide-react-native");var _jsxRuntime=require("react/jsx-runtime");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}
// mock or native equivalent















function ConsultationCompleted(_ref){var visitData=_ref.visitData,onClose=_ref.onClose;
var _useAppContext=(0,_AppContext.useAppContext)(),state=_useAppContext.state,setState=_useAppContext.setState,addVisitToToken=_useAppContext.addVisitToToken,addPrescriptionToToken=_useAppContext.addPrescriptionToToken,addLabTestToToken=_useAppContext.addLabTestToToken;

(0,_react.useEffect)(function(){
if(state.currentToken){
var now=new Date();
var visit={
department:visitData.department,
timestamp:now,
doctorId:visitData.doctorId,
doctorName:visitData.doctorName,
diagnosis:visitData.diagnosis,
treatment:visitData.treatment,
notes:visitData.notes,
prescriptions:[],
labTests:[],
status:'completed'
};

addVisitToToken(state.currentToken.id,visit);

visitData.prescriptions.forEach(function(prescription){
if(state.currentToken){
addPrescriptionToToken(state.currentToken.id,Object.assign({},
prescription,{
prescribedAt:now})
);
}
});

visitData.labTests.forEach(function(labTest){
if(state.currentToken){
addLabTestToToken(state.currentToken.id,Object.assign({},
labTest,{
orderedAt:now})
);
}
});
}
},[]);

var handleDownloadToken=function handleDownloadToken(){
_reactNative.Alert.alert('Download','Token details downloaded to device.');
};

var handleBackToDashboard=function handleBackToDashboard(){
setState(function(prev){return Object.assign({},prev,{currentView:'patient-dashboard'});});
onClose();
};

if(!state.currentToken)return null;

return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.ScrollView,{contentContainerStyle:styles.container,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.Card,{style:styles.cardSpacing,children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.CardHeader,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_button.Button,{variant:"ghost",size:"sm",onPress:handleBackToDashboard,style:{marginRight:8},children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.ArrowLeft,{size:20,color:"#000"})}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{flex:1,alignItems:'center'},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.CheckCircle,{size:32,color:"#16a34a",style:{marginBottom:8}}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:20,fontWeight:'bold',color:'#111827'},children:"Consultation Completed"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{color:'#6b7280',textAlign:'center'},children:"Your medical consultation has been successfully completed"})]}
)]}
)}
),/*#__PURE__*/

(0,_jsxRuntime.jsxs)(_card.Card,{style:styles.cardSpacing,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardHeader,{children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.CardTitle,{style:{flexDirection:'row',alignItems:'center',color:'#16a34a'},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.CheckCircle,{size:20,color:"#16a34a",style:{marginRight:8}}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{children:"Consultation Summary"})]}
)}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.CardContent,{style:{gap:12},children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.rowBetween,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.label,children:"Department"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.value,children:visitData.department})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.label,children:"Doctor"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.value,children:visitData.doctorName})]}
)]}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.label,children:"Diagnosis"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.value,children:visitData.diagnosis})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.label,children:"Treatment"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.value,children:visitData.treatment})]}
),
visitData.notes&&/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.label,children:"Additional Notes"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.value,children:visitData.notes})]}
)]}

)]}
),

visitData.prescriptions.length>0&&/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.Card,{style:styles.cardSpacing,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardHeader,{children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.CardTitle,{style:{flexDirection:'row',alignItems:'center',color:'#2563eb'},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Pill,{size:20,color:"#2563eb",style:{marginRight:8}}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{children:["Prescriptions (",visitData.prescriptions.length,")"]})]}
)}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardContent,{children:
visitData.prescriptions.map(function(presc,idx){return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.itemBox,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontWeight:'bold',color:'#1e40af'},children:presc.medicationName}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{color:'#2563eb',fontSize:13},children:presc.dosage}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.rowBetween,{marginTop:8}],children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:12,color:'#6b7280'},children:["Freq: ",presc.frequency]}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:12,color:'#6b7280'},children:["Dur: ",presc.duration]}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_badge.Badge,{children:/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{color:'#fff',fontSize:10},children:presc.status})})]}
),
presc.instructions&&/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{marginTop:8,fontSize:12,fontStyle:'italic',color:'#4b5563'},children:presc.instructions})]},idx

));}
)}
)]}
),


visitData.labTests.length>0&&/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.Card,{style:styles.cardSpacing,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardHeader,{children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.CardTitle,{style:{flexDirection:'row',alignItems:'center',color:'#9333ea'},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.FlaskConical,{size:20,color:"#9333ea",style:{marginRight:8}}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{children:["Lab Tests Ordered (",visitData.labTests.length,")"]})]}
)}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardContent,{children:
visitData.labTests.map(function(lab,idx){return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.itemBox,{backgroundColor:'#faf5ff',borderColor:'#e9d5ff'}],children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontWeight:'bold',color:'#6b21a8'},children:lab.testName}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{color:'#9333ea',fontSize:13},children:lab.testType}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.rowBetween,{marginTop:8}],children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:12,color:'#6b7280'},children:["Ordered by: ",lab.orderedBy]}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_badge.Badge,{variant:"secondary",children:/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:10},children:lab.status})})]}
)]},idx
));}
)}
)]}
),/*#__PURE__*/


(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{gap:12,marginTop:16},children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_button.Button,{onPress:handleDownloadToken,style:{backgroundColor:'#2563eb'},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Download,{size:16,color:"#fff",style:{marginRight:8}}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{color:'#fff',fontWeight:'bold'},children:"Download Token Details"})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_button.Button,{variant:"outline",onPress:handleBackToDashboard,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.FileText,{size:16,color:"#000",style:{marginRight:8}}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{children:"Back to Dashboard"})]}
)]}
)]}
));

}

var styles=_reactNative.StyleSheet.create({
container:{padding:16,paddingBottom:32},
cardSpacing:{marginBottom:16},
row:{flexDirection:'row',alignItems:'center'},
rowBetween:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
label:{fontSize:12,color:'#6b7280',marginBottom:2},
value:{fontSize:14,fontWeight:'500',color:'#111827'},
itemBox:{backgroundColor:'#eff6ff',borderColor:'#bfdbfe',borderWidth:1,borderRadius:8,padding:12,marginBottom:8}
});
