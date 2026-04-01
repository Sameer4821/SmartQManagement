var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.AIAgent=AIAgent;var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _react=_interopRequireWildcard(require("react"));
var _reactNative=require("react-native");
var _AppContext=require("../context/AppContext");

var _card=require("./ui/card");
var _button=require("./ui/button");
var _badge=require("./ui/badge");
var _lucideReactNative=require("lucide-react-native");var _jsxRuntime=require("react/jsx-runtime");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

































function AIAgent(_ref){var _ref$compact=_ref.compact,compact=_ref$compact===void 0?false:_ref$compact,_ref$showOnlyHighPrio=_ref.showOnlyHighPriority,showOnlyHighPriority=_ref$showOnlyHighPrio===void 0?false:_ref$showOnlyHighPrio;
var _useAppContext=(0,_AppContext.useAppContext)(),state=_useAppContext.state,calculateOptimalTime=_useAppContext.calculateOptimalTime,addNotification=_useAppContext.addNotification;
var _useState=(0,_react.useState)([]),_useState2=(0,_slicedToArray2.default)(_useState,2),insights=_useState2[0],setInsights=_useState2[1];
var _useState3=(0,_react.useState)(false),_useState4=(0,_slicedToArray2.default)(_useState3,2),isAnalyzing=_useState4[0],setIsAnalyzing=_useState4[1];
var _useState5=(0,_react.useState)(new Set()),_useState6=(0,_slicedToArray2.default)(_useState5,2),dismissedInsights=_useState6[0],setDismissedInsights=_useState6[1];

(0,_react.useEffect)(function(){
analyzeSystem();
var interval=setInterval(analyzeSystem,30000);
return function(){return clearInterval(interval);};
},[state.currentToken,state.departments,state.tokens]);

var analyzeSystem=function analyzeSystem(){
setIsAnalyzing(true);
setTimeout(function(){
var newInsights=[];

if(state.currentToken){
var schedulingInsight=analyzeOptimalScheduling();
if(schedulingInsight)newInsights.push(schedulingInsight);

var departmentInsight=analyzeDepartmentLoad();
if(departmentInsight)newInsights.push(departmentInsight);
}

newInsights.push.apply(newInsights,(0,_toConsumableArray2.default)(predictWaitTimes()));
newInsights.push.apply(newInsights,(0,_toConsumableArray2.default)(optimizeDepartmentAllocation()));
newInsights.push.apply(newInsights,(0,_toConsumableArray2.default)(analyzePatientFlow()));

if(state.patientInfo&&state.currentToken){
newInsights.push.apply(newInsights,(0,_toConsumableArray2.default)(generateProactiveRecommendations()));
}

newInsights.push.apply(newInsights,(0,_toConsumableArray2.default)(analyzeResourceAllocation()));

var filteredInsights=newInsights.
filter(function(insight){return!dismissedInsights.has(insight.id);}).
sort(function(a,b){
var priorityWeight={high:3,medium:2,low:1};
return priorityWeight[b.priority]-priorityWeight[a.priority]||b.confidence-a.confidence;
});

setInsights(filteredInsights);
setIsAnalyzing(false);
},800);
};

var analyzeOptimalScheduling=function analyzeOptimalScheduling(){
if(!state.currentToken)return null;
var currentDept=state.departments.find(function(d){var _state$currentToken;return d.name===((_state$currentToken=state.currentToken)==null?void 0:_state$currentToken.primaryDepartment);});
if(!currentDept)return null;

var currentHour=new Date().getHours();
var isOffPeakHour=currentHour<10||currentHour>=14&&currentHour<=16;

if(isOffPeakHour){
return{
id:'optimal-scheduling-'+Date.now(),
type:'recommendation',
priority:'high',
title:'Optimal Time Detected',
description:`Current time is ideal for ${currentDept.name}. Expected wait time is 30% lower than peak hours.`,
confidence:92,
impact:'Reduced wait time by ~15-20 minutes',
timestamp:new Date(),
action:{label:'View Best Doctors',handler:function handler(){return console.log('Show available doctors');}}
};
}
return null;
};

var analyzeDepartmentLoad=function analyzeDepartmentLoad(){
if(!state.currentToken)return null;
var currentDept=state.departments.find(function(d){var _state$currentToken2;return d.name===((_state$currentToken2=state.currentToken)==null?void 0:_state$currentToken2.primaryDepartment);});
if(!currentDept)return null;

var similarDepts=state.departments.filter(function(d){return(
d.type===currentDept.type&&
d.name!==currentDept.name&&
d.doctors.some(function(doc){return doc.status==='available';}));}
);

var lessLoadedDept=similarDepts.find(function(d){
var currentLoad=currentDept.doctors.reduce(function(sum,doc){return sum+doc.currentPatients;},0);
var altLoad=d.doctors.reduce(function(sum,doc){return sum+doc.currentPatients;},0);
return altLoad<currentLoad*0.7;
});

if(lessLoadedDept){
return{
id:'dept-load-'+Date.now(),
type:'optimization',
priority:'medium',
title:'Alternative Department Available',
description:`${lessLoadedDept.name} has 40% less wait time. Similar services available with faster consultation.`,
confidence:85,
impact:'Save approximately 20-25 minutes',
timestamp:new Date()
};
}
return null;
};

var predictWaitTimes=function predictWaitTimes(){
var r=[];
var currentHour=new Date().getHours();

if(currentHour>=9&&currentHour<=11){
r.push({
id:'rush-prediction-'+Date.now(),
type:'prediction',
priority:'medium',
title:'Peak Hour Alert',
description:'Currently in peak hours (9-11 AM). Average wait times increased by 40-50%. Consider scheduling for 2-4 PM.',
confidence:88,
impact:'Potential wait time: 35-45 minutes',
timestamp:new Date()
});
}

state.departments.forEach(function(dept){
if(dept.type==='consultation'){
var utilization=dept.doctors.reduce(function(sum,doc){return(
sum+doc.currentPatients/doc.maxPatients);},0
)/dept.doctors.length;

if(utilization>0.8){
r.push({
id:`dept-congestion-${dept.name}-${Date.now()}`,
type:'alert',
priority:'high',
title:`${dept.name} High Load`,
description:`Department at ${Math.round(utilization*100)}% capacity. Estimated wait: ${Math.round(dept.averageWaitTime*(1+utilization))} minutes.`,
confidence:94,
impact:'Extended wait times expected',
timestamp:new Date()
});
}
}
});
return r.slice(0,2);
};

var optimizeDepartmentAllocation=function optimizeDepartmentAllocation(){
var r=[];
state.departments.forEach(function(dept){
if(dept.type==='consultation'){
var availableDoctors=dept.doctors.filter(function(d){return d.status==='available';});
var busyDoctors=dept.doctors.filter(function(d){return d.status==='busy';});

if(availableDoctors.length>0&&busyDoctors.length>0){
var maxLoad=Math.max.apply(Math,(0,_toConsumableArray2.default)(busyDoctors.map(function(d){return d.currentPatients/d.maxPatients;})));
var minLoad=Math.min.apply(Math,(0,_toConsumableArray2.default)(availableDoctors.map(function(d){return d.currentPatients/d.maxPatients;})));

if(maxLoad-minLoad>0.4){
r.push({
id:`load-balance-${dept.name}-${Date.now()}`,
type:'optimization',
priority:'medium',
title:`${dept.name} Load Imbalance Detected`,
description:`Some doctors are heavily loaded while others are free. AI suggests redistributing ${Math.round((maxLoad-minLoad)*100)}% of queue.`,
confidence:82,
impact:'Reduce overall wait time by 15-20%',
timestamp:new Date()
});
}
}
}
});
return r.slice(0,1);
};

var analyzePatientFlow=function analyzePatientFlow(){
var r=[];
var activeTokens=state.tokens.filter(function(t){return t.status==='active';});
var emergencyTokens=activeTokens.filter(function(t){return t.type==='emergency';});

if(emergencyTokens.length>5){
r.push({
id:'emergency-surge-'+Date.now(),
type:'alert',
priority:'high',
title:'Emergency Surge Detected',
description:`${emergencyTokens.length} emergency cases active. Regular consultations may experience 20-30 minute delays.`,
confidence:96,
impact:'Extended wait for non-emergency cases',
timestamp:new Date()
});
}

var deptDistribution=new Map();
activeTokens.forEach(function(token){
var count=deptDistribution.get(token.primaryDepartment)||0;
deptDistribution.set(token.primaryDepartment,count+1);
});

var mostCrowdedDept=Array.from(deptDistribution.entries()).
sort(function(a,b){return b[1]-a[1];})[0];

if(mostCrowdedDept&&mostCrowdedDept[1]>8){
r.push({
id:'dept-crowded-'+Date.now(),
type:'alert',
priority:'medium',
title:'Department Congestion',
description:`${mostCrowdedDept[0]} has ${mostCrowdedDept[1]} active appointments. Consider alternative departments or reschedule.`,
confidence:90,
impact:'Wait time: 45-60 minutes',
timestamp:new Date()
});
}
return r.slice(0,1);
};

var generateProactiveRecommendations=function generateProactiveRecommendations(){
var r=[];
if(!state.currentToken)return r;

var hasCompletedVisit=state.currentToken.visits.some(function(v){return v.status==='completed';});

if(hasCompletedVisit){
if(state.currentToken.prescriptions.length>0){
r.push({
id:'pharmacy-reminder-'+Date.now(),
type:'suggestion',
priority:'high',
title:'Pharmacy Visit Recommended',
description:`You have ${state.currentToken.prescriptions.length} prescription(s). Visit pharmacy to collect medicines. Current wait: ~5 minutes.`,
confidence:100,
impact:'Get medicines immediately',
timestamp:new Date(),
action:{label:'Navigate to Pharmacy',handler:function handler(){return addNotification({message:'Pharmacy is on Ground Floor, Near Main Exit',type:'info'});}}
});
}

var pendingTests=state.currentToken.labTests.filter(function(t){return t.status==='ordered'||t.status==='scheduled';});
if(pendingTests.length>0){
r.push({
id:'lab-reminder-'+Date.now(),
type:'suggestion',
priority:'high',
title:'Lab Tests Pending',
description:`${pendingTests.length} lab test(s) ordered. Visit laboratory for sample collection. Best time: Now (shorter queue).`,
confidence:100,
impact:'Complete tests today',
timestamp:new Date(),
action:{label:'View Lab Location',handler:function handler(){return addNotification({message:'Laboratory is on First Floor, Room 101-105',type:'info'});}}
});
}
}

var daysSinceLastVisit=state.currentToken.visits.length>0?
Math.floor((Date.now()-new Date(state.currentToken.visits[0].timestamp).getTime())/(1000*60*60*24)):
0;

if(daysSinceLastVisit>7&&daysSinceLastVisit<14){
r.push({
id:'followup-suggestion-'+Date.now(),
type:'recommendation',
priority:'low',
title:'Follow-up Recommended',
description:`It's been ${daysSinceLastVisit} days since your last visit. Consider scheduling a follow-up consultation.`,
confidence:75,
impact:'Monitor treatment progress',
timestamp:new Date()
});
}
return r;
};

var analyzeResourceAllocation=function analyzeResourceAllocation(){
var r=[];
var totalDoctors=state.departments.reduce(function(sum,dept){return sum+dept.doctors.length;},0);
var availableDoctors=state.departments.reduce(function(sum,dept){return(
sum+dept.doctors.filter(function(d){return d.status==='available';}).length);},0
);

var availabilityRate=availableDoctors/totalDoctors;

if(availabilityRate<0.3){
r.push({
id:'low-availability-'+Date.now(),
type:'alert',
priority:'high',
title:'Limited Doctor Availability',
description:`Only ${Math.round(availabilityRate*100)}% of doctors available. Consider online consultation or reschedule for better time slots.`,
confidence:95,
impact:'Longer wait times expected',
timestamp:new Date()
});
}
return r;
};

var dismissInsight=function dismissInsight(insightId){
setDismissedInsights(function(prev){return new Set(prev).add(insightId);});
};

var getInsightIcon=function getInsightIcon(type){
switch(type){
case'recommendation':return/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Lightbulb,{size:16});
case'prediction':return/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.TrendingUp,{size:16});
case'optimization':return/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Target,{size:16});
case'alert':return/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.AlertCircle,{size:16});
case'suggestion':return/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Sparkles,{size:16});
}
};

var getInsightStyle=function getInsightStyle(priority){
switch(priority){
case'high':return{bg:'#fef2f2',border:'#fecaca',text:'#dc2626'};
case'medium':return{bg:'#fefce8',border:'#fef08a',text:'#ca8a04'};
case'low':return{bg:'#eff6ff',border:'#bfdbfe',text:'#2563eb'};
}
};

var displayInsights=showOnlyHighPriority?
insights.filter(function(i){return i.priority==='high';}):
insights;

var renderInsightBox=function renderInsightBox(insight){
var style=getInsightStyle(insight.priority);
return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.insightBox,{backgroundColor:style.bg,borderLeftColor:style.text}],children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.insightRow,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:{marginRight:12,marginTop:2},children:getInsightIcon(insight.type)}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{flex:1},children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.insightHeaderWrap,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.insightTitle,{color:style.text}],children:insight.title}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_badge.Badge,{variant:"outline",style:{borderColor:style.border},children:/*#__PURE__*/(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:10,color:style.text},children:[insight.confidence,"%"]})})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:12,color:'#4b5563',marginVertical:4},children:insight.description}),

!compact&&/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.BarChart3,{size:12,color:"#6b7280",style:{marginRight:4}}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:10,color:'#6b7280'},children:["Impact: ",insight.impact]})]}
),


insight.action&&/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:{marginTop:8,alignSelf:'flex-start'},children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_button.Button,{onPress:insight.action.handler,variant:"outline",size:"sm",children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:12},children:insight.action.label})}
)}
)]}

),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.TouchableOpacity,{onPress:function onPress(){return dismissInsight(insight.id);},style:{padding:4},children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.X,{size:16,color:"#9ca3af"})}
)]}
)},insight.id
));

};

if(compact){
return/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.View,{style:{gap:8},children:displayInsights.slice(0,3).map(renderInsightBox)});
}

return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.Card,{style:styles.card,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.headerRow,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.iconBox,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Brain,{size:24,color:"#fff"})}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{marginLeft:12},children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.moduleTitle,children:"AI Agent Insights"}),
isAnalyzing&&/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Activity,{size:16,color:"#2563eb",style:{marginLeft:8}})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:styles.moduleSub,children:"Intelligent recommendations"})]}
)]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_badge.Badge,{variant:"outline",style:{backgroundColor:'#faf5ff'},children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Zap,{size:12,color:"#9333ea",style:{marginRight:4}}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:10,color:'#9333ea'},children:[insights.length," Active"]})]}
)}
)]}
),

insights.length===0?/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.emptyBox,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Brain,{size:48,color:"#9ca3af",style:{opacity:0.5,marginBottom:12}}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{color:'#6b7280'},children:"AI is analyzing system data..."}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:12,color:'#9ca3af',marginTop:4},children:"Insights will appear here"})]}
):/*#__PURE__*/

(0,_jsxRuntime.jsx)(_reactNative.View,{style:{gap:12},children:
displayInsights.map(renderInsightBox)}
),


!isAnalyzing&&insights.length>0&&/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.footerBox,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Sparkles,{size:20,color:"#2563eb",style:{marginRight:12,marginTop:2}}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{flex:1},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontWeight:'600',color:'#1e3a8a',fontSize:13},children:"AI Agent Active"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:11,color:'#1d4ed8',marginTop:4},children:"Continuously monitoring departments and tokens."}

)]}
)]}
)]}

));

}

var styles=_reactNative.StyleSheet.create({
card:{padding:16},
row:{flexDirection:'row',alignItems:'center'},
headerRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:24},
iconBox:{padding:8,backgroundColor:'#2563eb',borderRadius:8},
moduleTitle:{fontSize:16,fontWeight:'bold'},
moduleSub:{fontSize:12,color:'#6b7280'},
emptyBox:{padding:32,alignItems:'center'},
insightBox:{padding:12,borderLeftWidth:4,borderRadius:8,borderWidth:1,borderColor:'transparent'},
insightRow:{flexDirection:'row',alignItems:'flex-start'},
insightHeaderWrap:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:6},
insightTitle:{fontWeight:'600',fontSize:14},
footerBox:{marginTop:24,padding:16,backgroundColor:'#eff6ff',borderRadius:8,borderWidth:1,borderColor:'#bfdbfe',flexDirection:'row',alignItems:'flex-start'}
});
