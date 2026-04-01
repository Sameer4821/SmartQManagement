var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.ImageWithFallback=ImageWithFallback;var _objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _react=_interopRequireWildcard(require("react"));var _jsxRuntime=require("react/jsx-runtime");var _excluded=["src","alt","style","className"];function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

var ERROR_IMG_SRC=
'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

function ImageWithFallback(props){
var _useState=(0,_react.useState)(false),_useState2=(0,_slicedToArray2.default)(_useState,2),didError=_useState2[0],setDidError=_useState2[1];

var handleError=function handleError(){
setDidError(true);
};

var src=props.src,alt=props.alt,style=props.style,className=props.className,rest=(0,_objectWithoutProperties2.default)(props,_excluded);

return didError?/*#__PURE__*/
(0,_jsxRuntime.jsx)("div",{
className:`inline-block bg-gray-100 text-center align-middle ${className!=null?className:''}`,
style:style,children:/*#__PURE__*/

(0,_jsxRuntime.jsx)("div",{className:"flex items-center justify-center w-full h-full",children:/*#__PURE__*/
(0,_jsxRuntime.jsx)("img",Object.assign({src:ERROR_IMG_SRC,alt:"Error loading image"},rest,{"data-original-url":src}))}
)}
):/*#__PURE__*/

(0,_jsxRuntime.jsx)("img",Object.assign({src:src,alt:alt,className:className,style:style},rest,{onError:handleError}));

}