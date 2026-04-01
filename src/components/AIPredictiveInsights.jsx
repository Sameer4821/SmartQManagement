var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.AIPredictiveInsights=AIPredictiveInsights;var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _react=_interopRequireWildcard(require("react"));
var _reactNative=require("react-native");
var _AppContext=require("../context/AppContext");
var _card=require("./ui/card");
var _badge=require("./ui/badge");
var _progress=require("./ui/progress");

var _lucideReactNative=require("lucide-react-native");var _jsxRuntime=require("react/jsx-runtime");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}


































function AIPredictiveInsights(){
var _useAppContext=(0,_AppContext.useAppContext)(),state=_useAppContext.state;
var _useState=(0,_react.useState)([]),_useState2=(0,_slicedToArray2.default)(_useState,2),metrics=_useState2[0],setMetrics=_useState2[1];
var _useState3=(0,_react.useState)([]),_useState4=(0,_slicedToArray2.default)(_useState3,2),recommendations=_useState4[0],setRecommendations=_useState4[1];
var _useState5=(0,_react.useState)('all'),_useState6=(0,_slicedToArray2.default)(_useState5,2),selectedCategory=_useState6[0],setSelectedCategory=_useState6[1];
var _useState7=(0,_react.useState)(false),_useState8=(0,_slicedToArray2.default)(_useState7,2),isAnalyzing=_useState8[0],setIsAnalyzing=_useState8[1];

(0,_react.useEffect)(function(){
analyzeAndPredict();
var interval=setInterval(analyzeAndPredict,60000);// 1 min
return function(){return clearInterval(interval);};
},[state.departments,state.tokens]);

var analyzeAndPredict=function analyzeAndPredict(){
setIsAnalyzing(true);

setTimeout(function(){
var newMetrics=[
{
label:'Average Wait Time',
currentValue:calculateAverageWaitTime(),
predictedValue:predictFutureWaitTime(),
trend:getTrend(calculateAverageWaitTime(),predictFutureWaitTime()),
confidence:87,
unit:'mins',
icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Clock,{size:16,color:"#6b7280"}),
category:'wait-time'
},
{
label:'Hospital Capacity',
currentValue:calculateCapacityUtilization(),
predictedValue:predictCapacityUtilization(),
trend:getTrend(calculateCapacityUtilization(),predictCapacityUtilization()),
confidence:92,
unit:'%',
icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Users,{size:16,color:"#6b7280"}),
category:'capacity'
},
{
label:'Doctor Efficiency',
currentValue:calculateDoctorEfficiency(),
predictedValue:predictDoctorEfficiency(),
trend:getTrend(predictDoctorEfficiency(),calculateDoctorEfficiency()),// Reversed
confidence:84,
unit:'pt',
icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Activity,{size:16,color:"#6b7280"}),
category:'efficiency'
},
{
label:'Service Quality',
currentValue:calculateServiceQuality(),
predictedValue:predictServiceQuality(),
trend:getTrend(predictServiceQuality(),calculateServiceQuality()),// Reversed
confidence:79,
unit:'/100',
icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Target,{size:16,color:"#6b7280"}),
category:'quality'
}];


setMetrics(newMetrics);
setRecommendations(generateRecommendations(newMetrics));
setIsAnalyzing(false);
},1200);
};

var calculateAverageWaitTime=function calculateAverageWaitTime(){
var consultationDepts=state.departments.filter(function(d){return d.type==='consultation';});
if(consultationDepts.length===0)return 0;
var totalWait=consultationDepts.reduce(function(sum,dept){return sum+dept.averageWaitTime;},0);
return Math.round(totalWait/consultationDepts.length);
};

var predictFutureWaitTime=function predictFutureWaitTime(){
var current=calculateAverageWaitTime();
var currentHour=new Date().getHours();
var activeEmergencies=state.tokens.filter(function(t){return t.type==='emergency'&&t.status==='active';}).length;

var multiplier=1;
if(currentHour>=10&&currentHour<=12)multiplier+=0.4;else
if(currentHour>=14&&currentHour<=16)multiplier+=0.3;
if(activeEmergencies>3)multiplier+=0.2;

var isWeekend=new Date().getDay()===0||new Date().getDay()===6;
if(isWeekend)multiplier-=0.15;

return Math.round(current*multiplier);
};

var calculateCapacityUtilization=function calculateCapacityUtilization(){
var allDoctors=state.departments.flatMap(function(d){return d.doctors;});
if(allDoctors.length===0)return 0;

var totalCapacity=allDoctors.reduce(function(sum,doc){return sum+doc.maxPatients;},0);
var currentLoad=allDoctors.reduce(function(sum,doc){return sum+doc.currentPatients;},0);
return Math.round(currentLoad/totalCapacity*100);
};

var predictCapacityUtilization=function predictCapacityUtilization(){
var current=calculateCapacityUtilization();
var currentHour=new Date().getHours();

var adjustment=0;
if(currentHour<10)adjustment=15;else
if(currentHour>=18)adjustment=-10;

return Math.max(0,Math.min(100,current+adjustment));
};

var calculateDoctorEfficiency=function calculateDoctorEfficiency(){
var consultationDepts=state.departments.filter(function(d){return d.type==='consultation';});
var availableDoctors=consultationDepts.flatMap(function(d){return d.doctors.filter(function(doc){return doc.status==='available';});});
if(consultationDepts.length===0)return 0;

var availabilityRate=availableDoctors.length/consultationDepts.flatMap(function(d){return d.doctors;}).length;
var avgUtilization=calculateCapacityUtilization()/100;

var efficiency=(availabilityRate*0.4+(1-Math.abs(avgUtilization-0.7))*0.6)*100;
return Math.round(efficiency);
};

var predictDoctorEfficiency=function predictDoctorEfficiency(){
var current=calculateDoctorEfficiency();
var predictedCapacity=predictCapacityUtilization();

var adjustment=0;
if(predictedCapacity>80)adjustment=-5;else
if(predictedCapacity<30)adjustment=-3;else
adjustment=2;

return Math.max(0,Math.min(100,current+adjustment));
};

var calculateServiceQuality=function calculateServiceQuality(){
var efficiency=calculateDoctorEfficiency();
var waitTime=calculateAverageWaitTime();
var capacity=calculateCapacityUtilization();

var waitScore=Math.max(0,100-waitTime*2);
var capacityScore=100-Math.abs(capacity-60);
return Math.round(efficiency*0.4+waitScore*0.4+capacityScore*0.2);
};

var predictServiceQuality=function predictServiceQuality(){
var predictedEfficiency=predictDoctorEfficiency();
var predictedWaitTime=predictFutureWaitTime();
var predictedCapacity=predictCapacityUtilization();

var waitScore=Math.max(0,100-predictedWaitTime*2);
var capacityScore=100-Math.abs(predictedCapacity-60);
return Math.round(predictedEfficiency*0.4+waitScore*0.4+capacityScore*0.2);
};

var getTrend=function getTrend(current,predicted){
var diff=predicted-current;
if(Math.abs(diff)<2)return'stable';
return diff>0?'up':'down';
};

var generateRecommendations=function generateRecommendations(mets){
var recs=[];

var waitTimeMetric=mets.find(function(m){return m.category==='wait-time';});
if(waitTimeMetric&&waitTimeMetric.predictedValue>30){
recs.push({
id:'wait-time-1',
title:'High Wait Times Predicted',
description:`Wait times expected to reach ${waitTimeMetric.predictedValue} minutes. Consider redistributing patients or adding staff.`,
priority:waitTimeMetric.predictedValue>40?'high':'medium',
impact:'Patient satisfaction may decrease',
actionable:true
});
}

var capacityMetric=mets.find(function(m){return m.category==='capacity';});
if(capacityMetric&&capacityMetric.predictedValue>85){
recs.push({
id:'capacity-1',
title:'Near-Capacity Alert',
description:`Hospital approaching ${capacityMetric.predictedValue}% capacity. Prepare for overflow and extended wait times.`,
priority:'critical',
impact:'May need to activate overflow protocols',
actionable:true
});
}else if(capacityMetric&&capacityMetric.predictedValue<40){
recs.push({
id:'capacity-2',
title:'Low Capacity Utilization',
description:`Only ${capacityMetric.predictedValue}% capacity expected. Good time for scheduled appointments.`,
priority:'low',
impact:'Optimal conditions for patient care',
actionable:true
});
}

var efficiencyMetric=mets.find(function(m){return m.category==='efficiency';});
if(efficiencyMetric&&efficiencyMetric.trend==='down'){
recs.push({
id:'efficiency-1',
title:'Declining Doctor Efficiency',
description:`Efficiency predicted to drop to ${efficiencyMetric.predictedValue}%. May indicate staff fatigue.`,
priority:'medium',
impact:'Consider staff rotation',
actionable:true
});
}

var currentHour=new Date().getHours();
if(currentHour>=10&&currentHour<=12){
recs.push({
id:'time-1',
title:'Peak Hour Strategy',
description:'Currently in peak hours. Recommend scheduling non-urgent cases for afternoon slots.',
priority:'medium',
impact:'Can reduce wait times',
actionable:true
});
}

return recs.sort(function(a,b){
var priorityOrder={critical:4,high:3,medium:2,low:1};
return priorityOrder[b.priority]-priorityOrder[a.priority];
});
};

var getPriorityStyle=function getPriorityStyle(priority){
switch(priority){
case'critical':return{bg:'#fee2e2',border:'#fecaca',text:'#991b1b'};
case'high':return{bg:'#ffedd5',border:'#fed7aa',text:'#9a3412'};
case'medium':return{bg:'#fef9c3',border:'#fef08a',text:'#854d0e'};
case'low':return{bg:'#dcfce7',border:'#bbf7d0',text:'#166534'};
}
};

var filteredMetrics=selectedCategory==='all'?
metrics:
metrics.filter(function(m){return m.category===selectedCategory;});

var categories=[
{value:'all',label:'All',icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.BarChart3,{size:12,color:"#4b5563"})},
{value:'wait-time',label:'Wait Time',icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Clock,{size:12,color:"#4b5563"})},
{value:'capacity',label:'Capacity',icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Users,{size:12,color:"#4b5563"})},
{value:'efficiency',label:'Efficiency',icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Activity,{size:12,color:"#4b5563"})},
{value:'quality',label:'Quality',icon:/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Target,{size:12,color:"#4b5563"})}];


return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.ScrollView,{contentContainerStyle:styles.container,children:[/*#__PURE__*/

(0,_jsxRuntime.jsx)(_card.Card,{style:[styles.mainCard,{backgroundColor:'#f3e8ff'}],children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardHeader,{style:{paddingBottom:16},children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.rowBetween,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.headerIconBox,children:/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Brain,{size:24,color:"#fff"})}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{marginLeft:12},children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:18,fontWeight:'bold',color:'#111827'},children:"AI Predictive Insights"}),
isAnalyzing&&/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Activity,{size:16,color:"#9333ea",style:{marginLeft:8}})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:12,color:'#4b5563'},children:"Real-time predictions and recommendations"})]}
)]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_badge.Badge,{variant:"outline",style:{backgroundColor:'#fff'},children:/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:10},children:"Live Analysis"})})]}
)}
)}
),/*#__PURE__*/


(0,_jsxRuntime.jsx)(_reactNative.ScrollView,{horizontal:true,showsHorizontalScrollIndicator:false,contentContainerStyle:styles.filterWrap,children:
categories.map(function(cat){return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.TouchableOpacity,{

onPress:function onPress(){return setSelectedCategory(cat.value);},
style:[styles.filterBtn,selectedCategory===cat.value&&styles.filterBtnActive],children:[

cat.icon,/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.filterBtnText,selectedCategory===cat.value&&styles.filterBtnTextActive],children:cat.label})]},cat.value
));}
)}
),/*#__PURE__*/


(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.grid,children:
filteredMetrics.map(function(metric,idx){return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.Card,{style:styles.metricCard,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardHeader,{style:{paddingBottom:8},children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.rowBetween,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[
metric.icon,/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:14,fontWeight:'600',marginLeft:8},children:metric.label})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_badge.Badge,{variant:"outline",children:/*#__PURE__*/(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:10},children:[metric.confidence,"% conf"]})})]}
)}
),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_card.CardContent,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.rowBetween,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:12,color:'#6b7280'},children:"Current"}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:24,fontWeight:'bold'},children:[metric.currentValue,/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:14},children:metric.unit})]})]}
),/*#__PURE__*/

(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{alignItems:'center'},children:[
metric.trend==='up'&&/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.TrendingUp,{size:24,color:"#ef4444"}),
metric.trend==='down'&&/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.TrendingDown,{size:24,color:"#22c55e"}),
metric.trend==='stable'&&/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.Activity,{size:24,color:"#3b82f6"})]}
),/*#__PURE__*/

(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{alignItems:'flex-end'},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:12,color:'#6b7280'},children:"Predicted"}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:24,fontWeight:'bold',color:'#9333ea'},children:[metric.predictedValue,/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:14},children:metric.unit})]})]}
)]}
),/*#__PURE__*/

(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{marginTop:16},children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.rowBetween,{marginBottom:4}],children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:10,color:'#6b7280'},children:"Prediction Confidence"}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:10,fontWeight:'600'},children:[metric.confidence,"%"]})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_progress.Progress,{value:metric.confidence,style:{height:6}})]}
),/*#__PURE__*/

(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.trendBox,
metric.trend==='up'?{backgroundColor:'#fef2f2'}:
metric.trend==='down'?{backgroundColor:'#f0fdf4'}:
{backgroundColor:'#eff6ff'}],children:/*#__PURE__*/

(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{
fontSize:12,color:
metric.trend==='up'?'#b91c1c':
metric.trend==='down'?'#15803d':'#1d4ed8'
},children:[
metric.trend==='up'&&`↗ Increasing by ${Math.abs(metric.predictedValue-metric.currentValue)}${metric.unit}`,
metric.trend==='down'&&`↘ Decreasing by ${Math.abs(metric.predictedValue-metric.currentValue)}${metric.unit}`,
metric.trend==='stable'&&'→ Stable conditions']}
)}
)]}
)]},idx
));}
)}
),/*#__PURE__*/


(0,_jsxRuntime.jsxs)(_card.Card,{style:[styles.mainCard,{marginTop:16}],children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardHeader,{children:/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Zap,{size:20,color:"#9333ea",style:{marginRight:8}}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardTitle,{children:"AI Recommendations"}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardDescription,{children:"Actionable insights based on predictions"})]}
)]}
)}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_card.CardContent,{style:{gap:12},children:
recommendations.length===0?/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:{padding:24,alignItems:'center'},children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.CheckCircle2,{size:48,color:"#22c55e",style:{marginBottom:12,opacity:0.8}}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontWeight:'600',color:'#374151'},children:"All systems operating optimally"})]}
):

recommendations.map(function(rec){
var style=getPriorityStyle(rec.priority);
return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.recBox,{backgroundColor:style.bg,borderColor:style.border}],children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.rowBetween,children:[/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.row,{flex:1}],children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontWeight:'600',flexShrink:1,marginRight:8,color:'#111827'},children:rec.title}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_badge.Badge,{variant:"outline",style:{backgroundColor:'#fff',borderColor:style.border},children:/*#__PURE__*/(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:10,color:style.text},children:rec.priority})})]}
),
rec.priority==='critical'&&/*#__PURE__*/(0,_jsxRuntime.jsx)(_lucideReactNative.AlertCircle,{size:20,color:"#dc2626"})]}
),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_reactNative.Text,{style:{fontSize:12,color:'#4b5563',marginTop:4},children:rec.description}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.View,{style:styles.row,children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)(_lucideReactNative.Target,{size:12,color:"#6b7280",style:{marginTop:8,marginRight:4}}),/*#__PURE__*/
(0,_jsxRuntime.jsxs)(_reactNative.Text,{style:{fontSize:10,color:'#6b7280',marginTop:8},children:["Impact: ",rec.impact]})]}
)]},rec.id
));

})}

)]}
)]}
));

}

var styles=_reactNative.StyleSheet.create({
container:{padding:16,paddingBottom:32},
mainCard:{marginBottom:16},
row:{flexDirection:'row',alignItems:'center'},
rowBetween:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
headerIconBox:{backgroundColor:'#9333ea',padding:8,borderRadius:8},
filterWrap:{flexDirection:'row',marginBottom:16},
filterBtn:{flexDirection:'row',alignItems:'center',paddingHorizontal:12,paddingVertical:8,borderRadius:20,borderWidth:1,borderColor:'#e5e7eb',marginRight:8,backgroundColor:'#fff'},
filterBtnActive:{backgroundColor:'#111827',borderColor:'#111827'},
filterBtnText:{marginLeft:4,fontSize:12,color:'#4b5563'},
filterBtnTextActive:{color:'#fff'},
grid:{flexDirection:'row',flexWrap:'wrap',gap:16,justifyContent:'space-between'},
metricCard:{width:'100%',marginBottom:16},
trendBox:{marginTop:16,padding:8,borderRadius:8,alignItems:'center'},
recBox:{padding:12,borderRadius:8,borderWidth:1}
});
