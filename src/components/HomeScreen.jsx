var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.HomeScreen=HomeScreen;var _react=_interopRequireDefault(require("react"));
var _AppContext=require("../context/AppContext");
var _button=require("./ui/button");var _jsxRuntime=require("react/jsx-runtime");

// This component is deprecated and redirects to the new login flow
function HomeScreen(){
var _useAppContext=(0,_AppContext.useAppContext)(),setState=_useAppContext.setState;

_react.default.useEffect(function(){
setState(function(prev){return Object.assign({},
prev,{
previousView:prev.currentView,
currentView:'login'});}
);
},[setState]);

return(/*#__PURE__*/
(0,_jsxRuntime.jsxs)("div",{className:"text-center space-y-4",children:[/*#__PURE__*/
(0,_jsxRuntime.jsx)("h2",{children:"Redirecting to login..."}),/*#__PURE__*/
(0,_jsxRuntime.jsx)(_button.Button,{onClick:function onClick(){return setState(function(prev){return Object.assign({},
prev,{
previousView:prev.currentView,
currentView:'login'});}
);},children:"Go to Login"}

)]}
));

}
