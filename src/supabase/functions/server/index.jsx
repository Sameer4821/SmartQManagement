var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _npmHono=require("npm:hono");
var _cors=require("npm:hono/cors");
var _logger=require("npm:hono/logger");
var _supabaseJs=require("jsr:@supabase/supabase-js@2");
var kv=_interopRequireWildcard(require("./kv_store.tsx"));var _Deno$env$get,_Deno$env$get2;function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

var app=new _npmHono.Hono();

// Initialize Supabase client
var supabase=(0,_supabaseJs.createClient)((_Deno$env$get=
Deno.env.get('SUPABASE_URL'))!=null?_Deno$env$get:'',(_Deno$env$get2=
Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))!=null?_Deno$env$get2:''
);

// Enable logger
app.use('*',(0,_logger.logger)(console.log));

// Enable CORS for all routes and methods
app.use(
"/*",
(0,_cors.cors)({
origin:"*",
allowHeaders:["Content-Type","Authorization"],
allowMethods:["GET","POST","PUT","DELETE","OPTIONS"],
exposeHeaders:["Content-Length"],
maxAge:600
})
);

// Health check endpoint
app.get("/make-server-4447fa50/health",function(c){
return c.json({status:"ok"});
});

// ===== AUTHENTICATION ROUTES =====

// User signup
app.post("/make-server-4447fa50/auth/signup",/*#__PURE__*/function(){var _ref=(0,_asyncToGenerator2.default)(function*(c){
try{var _data$user;
console.log('Signup request received');
var _yield$c$req$json=yield c.req.json(),email=_yield$c$req$json.email,password=_yield$c$req$json.password,metadata=_yield$c$req$json.metadata;
console.log('Signup data:',{email:email,metadata:metadata});

// Create user with Supabase Auth
var _yield$supabase$auth$=yield supabase.auth.admin.createUser({
email:email,
password:password,
email_confirm:true,// Auto-confirm since email server not configured
user_metadata:Object.assign({},
metadata,{
createdAt:new Date().toISOString()})

}),data=_yield$supabase$auth$.data,error=_yield$supabase$auth$.error;

if(error){
// Handle specific error cases
if(error.message.includes('already')||error.message.includes('registered')||error.status===422){
console.log('Email already exists:',email);
return c.json({
error:{
message:'This email is already registered. Please sign in instead or use a different email.',
code:'email_exists'
}
},400);
}

console.error('Supabase Auth error:',error);
return c.json({
error:{
message:error.message||'Failed to create account. Please try again.',
code:error.code||'signup_failed'
}
},400);
}

console.log('User created successfully:',(_data$user=data.user)==null?void 0:_data$user.id);

// Store user metadata in KV store
if(data.user){
console.log('Storing user metadata in KV store...');
yield kv.set(`user_metadata:${data.user.id}`,Object.assign({},
metadata,{
userId:data.user.id,
email:data.user.email,
createdAt:new Date().toISOString()})
);
console.log('User metadata stored successfully');
}

return c.json({success:true,user:data.user});
}catch(error){
console.error('Signup exception:',error);
return c.json({
error:{
message:'Internal server error. Please try again.',
code:'server_error'
}
},500);
}
});return function(_x){return _ref.apply(this,arguments);};}());

// Get user metadata
app.get("/make-server-4447fa50/auth/metadata/:userId",/*#__PURE__*/function(){var _ref2=(0,_asyncToGenerator2.default)(function*(c){
try{
var userId=c.req.param('userId');
var metadata=yield kv.get(`user_metadata:${userId}`);

if(!metadata){
return c.json({error:{message:'User metadata not found'}},404);
}

return c.json({metadata:metadata});
}catch(error){
console.error('Error fetching user metadata:',error);
return c.json({error:{message:'Failed to fetch user metadata'}},500);
}
});return function(_x2){return _ref2.apply(this,arguments);};}());

// Update user metadata
app.put("/make-server-4447fa50/auth/metadata/:userId",/*#__PURE__*/function(){var _ref3=(0,_asyncToGenerator2.default)(function*(c){
try{
var userId=c.req.param('userId');
var _yield$c$req$json2=yield c.req.json(),metadata=_yield$c$req$json2.metadata;

// Get existing metadata
var existingMetadata=(yield kv.get(`user_metadata:${userId}`))||{};

// Merge and update
var updatedMetadata=Object.assign({},
existingMetadata,
metadata,{
updatedAt:new Date().toISOString()});


yield kv.set(`user_metadata:${userId}`,updatedMetadata);

return c.json({success:true,metadata:updatedMetadata});
}catch(error){
console.error('Error updating user metadata:',error);
return c.json({error:{message:'Failed to update user metadata'}},500);
}
});return function(_x3){return _ref3.apply(this,arguments);};}());

// Rate limiting check
app.post("/make-server-4447fa50/auth/rate-limit",/*#__PURE__*/function(){var _ref4=(0,_asyncToGenerator2.default)(function*(c){
try{
var _yield$c$req$json3=yield c.req.json(),action=_yield$c$req$json3.action;
var clientIp=c.req.header('x-forwarded-for')||'unknown';
var key=`rate_limit:${action}:${clientIp}`;

var existing=yield kv.get(key);
var now=Date.now();

// Define limits: 5 attempts per 15 minutes for login/signup
var maxAttempts=5;
var windowMs=15*60*1000;// 15 minutes

if(existing){
var count=existing.count,firstAttempt=existing.firstAttempt;

if(now-firstAttempt<windowMs){
if(count>=maxAttempts){
return c.json({allowed:false});
}
yield kv.set(key,{count:count+1,firstAttempt:firstAttempt});
}else{
// Window expired, reset
yield kv.set(key,{count:1,firstAttempt:now});
}
}else{
// First attempt
yield kv.set(key,{count:1,firstAttempt:now});
}

return c.json({allowed:true});
}catch(error){
console.error('Rate limit check error:',error);
// On error, allow the request
return c.json({allowed:true});
}
});return function(_x4){return _ref4.apply(this,arguments);};}());

Deno.serve(app.fetch);