var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.AuthRouter=void 0;var _react=_interopRequireDefault(require("react"));
var _AppContext=require("../../context/AppContext");
var _LoginPage=require("./LoginPage");var _jsxRuntime=require("react/jsx-runtime");





var AuthRouter=exports.AuthRouter=function AuthRouter(_ref){var onAuthComplete=_ref.onAuthComplete;
var _useAppContext=(0,_AppContext.useAppContext)(),state=_useAppContext.state,setState=_useAppContext.setState;

var handleBack=function handleBack(){
// Navigate back to the previous view, or default to portal if not set
var viewToGoBack=state.previousView||'portal';
setState(function(prev){return Object.assign({},
prev,{
currentView:viewToGoBack,
previousView:undefined// Clear the previous view
});});
};

return(/*#__PURE__*/
(0,_jsxRuntime.jsx)(_LoginPage.LoginPage,{
onSuccess:onAuthComplete,
onBack:handleBack}
));

};
