var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.useAuth=exports.AuthProvider=void 0;var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _react=_interopRequireWildcard(require("react"));
var _supabaseJs=require("@supabase/supabase-js");
var _asyncStorage=_interopRequireDefault(require("@react-native-async-storage/async-storage"));
var Linking=_interopRequireWildcard(require("expo-linking"));
var _info=require("../utils/supabase/info");var _jsxRuntime=require("react/jsx-runtime");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}










































var AuthContext=/*#__PURE__*/(0,_react.createContext)({
user:null,
session:null,
userMetadata:null,
loading:true,
signUp:function(){var _signUp=(0,_asyncToGenerator2.default)(function*(){return{error:null};});function signUp(){return _signUp.apply(this,arguments);}return signUp;}(),
signIn:function(){var _signIn=(0,_asyncToGenerator2.default)(function*(){return{error:null};});function signIn(){return _signIn.apply(this,arguments);}return signIn;}(),
signInWithGoogle:function(){var _signInWithGoogle=(0,_asyncToGenerator2.default)(function*(){return{error:null};});function signInWithGoogle(){return _signInWithGoogle.apply(this,arguments);}return signInWithGoogle;}(),
signOut:function(){var _signOut=(0,_asyncToGenerator2.default)(function*(){});function signOut(){return _signOut.apply(this,arguments);}return signOut;}(),
updateUserMetadata:function(){var _updateUserMetadata=(0,_asyncToGenerator2.default)(function*(){});function updateUserMetadata(){return _updateUserMetadata.apply(this,arguments);}return updateUserMetadata;}()
});

var useAuth=exports.useAuth=function useAuth(){return(0,_react.useContext)(AuthContext);};

var supabase=(0,_supabaseJs.createClient)(
`https://${_info.projectId}.supabase.co`,
_info.publicAnonKey,
{
auth:{
storage:_asyncStorage.default,
autoRefreshToken:true,
persistSession:true,
detectSessionInUrl:false
}
}
);

var AuthProvider=exports.AuthProvider=function AuthProvider(_ref){var children=_ref.children;
var _useState=(0,_react.useState)(null),_useState2=(0,_slicedToArray2.default)(_useState,2),user=_useState2[0],setUser=_useState2[1];
var _useState3=(0,_react.useState)(null),_useState4=(0,_slicedToArray2.default)(_useState3,2),session=_useState4[0],setSession=_useState4[1];
var _useState5=(0,_react.useState)(null),_useState6=(0,_slicedToArray2.default)(_useState5,2),userMetadata=_useState6[0],setUserMetadata=_useState6[1];
var _useState7=(0,_react.useState)(true),_useState8=(0,_slicedToArray2.default)(_useState7,2),loading=_useState8[0],setLoading=_useState8[1];

// Load session on mount
(0,_react.useEffect)(function(){
supabase.auth.getSession().then(function(_ref2){var _session$user,_session$user2;var session=_ref2.data.session;
setSession(session);
setUser((_session$user=session==null?void 0:session.user)!=null?_session$user:null);
if(session!=null&&(_session$user2=session.user)!=null&&_session$user2.user_metadata){
setUserMetadata(session.user.user_metadata);
}
setLoading(false);
});

var _supabase$auth$onAuth=

supabase.auth.onAuthStateChange(function(_event,session){var _session$user3,_session$user4;
setSession(session);
setUser((_session$user3=session==null?void 0:session.user)!=null?_session$user3:null);
if(session!=null&&(_session$user4=session.user)!=null&&_session$user4.user_metadata){
setUserMetadata(session.user.user_metadata);
}else{
setUserMetadata(null);
}
}),subscription=_supabase$auth$onAuth.data.subscription;

return function(){return subscription.unsubscribe();};
},[]);

// Update user metadata
var updateUserMetadata=/*#__PURE__*/function(){var _ref3=(0,_asyncToGenerator2.default)(function*(metadata){
if(!user)return;

try{var _data$user;
var _yield$supabase$auth$=yield supabase.auth.updateUser({
data:Object.assign({},
user.user_metadata,
metadata)

}),data=_yield$supabase$auth$.data,error=_yield$supabase$auth$.error;

if(error){
console.error('Failed to update user metadata:',error);
return;
}

if((_data$user=data.user)!=null&&_data$user.user_metadata){
setUserMetadata(data.user.user_metadata);
}
}catch(error){
console.error('Failed to update user metadata:',error);
}
});return function updateUserMetadata(_x){return _ref3.apply(this,arguments);};}();

// Sign up with email and password using Supabase's built-in auth
var signUp=/*#__PURE__*/function(){var _ref4=(0,_asyncToGenerator2.default)(function*(email,password,metadata){
try{
console.log('Starting signup process for:',email);

// Use Supabase's built-in signUp method
var _yield$supabase$auth$2=yield supabase.auth.signUp({
email:email,
password:password,
options:{
data:Object.assign({},
metadata,{
createdAt:new Date().toISOString()})

}
}),data=_yield$supabase$auth$2.data,error=_yield$supabase$auth$2.error;

if(error){
console.error('Signup error:',error);

// Handle specific error cases
if(error.message.includes('already')||error.message.includes('registered')){
return{
error:{
message:'This email is already registered. Please sign in instead or use a different email.',
code:'email_exists'
}
};
}

return{
error:{
message:error.message||'Failed to create account. Please try again.',
code:error.name||'signup_failed'
}
};
}

console.log('Signup successful!',data);

// If email confirmation is disabled, user will be auto-signed in
// Otherwise, they need to confirm their email first
return{error:null};
}catch(error){
console.error('Signup exception:',error);
return{error:{message:'Signup failed. Please try again.'}};
}
});return function signUp(_x2,_x3,_x4){return _ref4.apply(this,arguments);};}();

// Sign in with email and password
var signIn=/*#__PURE__*/function(){var _ref5=(0,_asyncToGenerator2.default)(function*(email,password){
var _yield$supabase$auth$3=yield supabase.auth.signInWithPassword({email:email,password:password}),error=_yield$supabase$auth$3.error;

if(error){
return{error:{message:error.message,code:error.name}};
}

return{error:null};
});return function signIn(_x5,_x6){return _ref5.apply(this,arguments);};}();

// Sign in with Google OAuth
var signInWithGoogle=/*#__PURE__*/function(){var _ref6=(0,_asyncToGenerator2.default)(function*(){
try{
var _yield$supabase$auth$4=yield supabase.auth.signInWithOAuth({
provider:'google',
options:{
redirectTo:Linking.createURL('/')
}
}),error=_yield$supabase$auth$4.error;

if(error){
console.error('Google OAuth error:',error);
return{
error:{
message:error.message||'Failed to sign in with Google. Please try again.',
code:error.name||'oauth_failed'
}
};
}

return{error:null};
}catch(error){
console.error('Google OAuth exception:',error);
return{error:{message:'Google sign-in failed. Please try again.'}};
}
});return function signInWithGoogle(){return _ref6.apply(this,arguments);};}();

// Sign out
var signOut=/*#__PURE__*/function(){var _ref7=(0,_asyncToGenerator2.default)(function*(){
yield supabase.auth.signOut();
setUser(null);
setSession(null);
setUserMetadata(null);
});return function signOut(){return _ref7.apply(this,arguments);};}();

var value={
user:user,
session:session,
userMetadata:userMetadata,
loading:loading,
signUp:signUp,
signIn:signIn,
signInWithGoogle:signInWithGoogle,
signOut:signOut,
updateUserMetadata:updateUserMetadata
};

return/*#__PURE__*/(0,_jsxRuntime.jsx)(AuthContext.Provider,{value:value,children:children});
};