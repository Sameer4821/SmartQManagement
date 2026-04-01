var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.PatientDetails = PatientDetails; var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty")); var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray")); var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _button = require("./ui/button");
var _card = require("./ui/card");
var _lucideReactNative = require("lucide-react-native");
var _sonnerNative = require("sonner-native");
var _useTranslation = require("../hooks/useTranslation"); var _jsxRuntime = require("react/jsx-runtime"); function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }

function PatientDetails() {
    var _useAppContext = require("../context/AppContext").useAppContext(), state = _useAppContext.state, setState = _useAppContext.setState;
    var _useState = (0, _react.useState)({
        phone: ''
    }), _useState2 = (0, _slicedToArray2.default)(_useState, 2), formData = _useState2[0], setFormData = _useState2[1];
    var _useState3 = (0, _react.useState)({}), _useState4 = (0, _slicedToArray2.default)(_useState3, 2), errors = _useState4[0], setErrors = _useState4[1];
    var _useState5 = (0, _react.useState)(false), _useState6 = (0, _slicedToArray2.default)(_useState5, 2), loading = _useState6[0], setLoading = _useState6[1];
    var _useState7 = (0, _react.useState)(false), _useState8 = (0, _slicedToArray2.default)(_useState7, 2), otpStep = _useState8[0], setOtpStep = _useState8[1];
    var _useState9 = (0, _react.useState)(['', '', '', '']), _useState10 = (0, _slicedToArray2.default)(_useState9, 2), otp = _useState10[0], setOtp = _useState10[1];
    var _useState11 = (0, _react.useState)(false), _useState12 = (0, _slicedToArray2.default)(_useState11, 2), otpError = _useState12[0], setOtpError = _useState12[1];
    var inputRefs = (0, _react.useRef)([]);
    var t = (0, _useTranslation.useTranslation)().t;

    var handleBack = function handleBack() {
        setState(function (prev) { return Object.assign({}, prev, { currentView: 'portal' }); });
    };

    var validatePhone = function validatePhone(phone) {
        var phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    var handleInputChange = function handleInputChange(field, value) {
        setFormData(function (prev) { return Object.assign({}, prev, (0, _defineProperty2.default)({}, field, value)); });
        if (errors[field]) {
            setErrors(function (prev) { return Object.assign({}, prev, (0, _defineProperty2.default)({}, field, '')); });
        }
    };

    var validateForm = function validateForm() {
        var newErrors = {};

        if (!formData.phone.trim()) {
            newErrors.phone = t.required;
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = t.invalidPhone || 'Invalid mobile number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    var handleSubmit = function handleSubmit() {
        if (!validateForm()) {
            _sonnerNative.toast.error('Please fix the errors and try again');
            return;
        }

        setLoading(true);

        setTimeout(function () {
            setLoading(false);
            setOtpStep(true);
            _sonnerNative.toast.success('OTP sent to your mobile number');

            setTimeout(() => {
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }, 100);
        }, 800);
    };

    var handleOtpChange = function handleOtpChange(value, index) {
        if (isNaN(Number(value))) return;

        var newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpError(false);

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    var handleOtpKeyPress = function handleOtpKeyPress(e, index) {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
            var newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
        }
    };

    var handleVerifyOtp = function handleVerifyOtp() {
        var otpValue = otp.join('');
        if (otpValue.length !== 4) {
            setOtpError(true);
            _sonnerNative.toast.error('Please enter a valid OTP');
            return;
        }

        setLoading(true);

        setTimeout(function () {
            if (otpValue === '1234') { // Mock validation
                setState(function (prev) {
                    return Object.assign({},
                        prev, {
                        patientInfo: {
                            name: 'Patient', // Required placeholder
                            email: '',
                            phone: formData.phone.trim()
                        },
                        currentView: 'patient-dashboard'
                    });
                });
                _sonnerNative.toast.success('OTP Verified successfully');
            } else {
                setOtpError(true);
                _sonnerNative.toast.error('Invalid OTP. Please try again.');
            }
            setLoading(false);
        }, 800);
    };

    var handleResendOtp = function handleResendOtp() {
        setLoading(true);
        setTimeout(function () {
            setOtp(['', '', '', '']);
            setOtpError(false);
            setLoading(false);
            _sonnerNative.toast.success('New OTP sent successfully');
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }, 800);
    };

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsx)(_reactNative.KeyboardAvoidingView, {
            behavior: _reactNative.Platform.OS === 'ios' ? 'padding' : undefined, style: styles.container, children:/*#__PURE__*/
                (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
                    contentContainerStyle: styles.content, children: [/*#__PURE__*/

                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                            style: styles.header, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                    onPress: handleBack, style: styles.backBtn, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowLeft, { size: 20, color: "#374151" })
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: { flex: 1 }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.title, children: t.title }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.subtitle, children: t.subtitle })]
                                }
                                )]
                        }
                        ),/*#__PURE__*/


                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                            style: styles.progressContainer, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.progressStep, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: [styles.progressCircle, styles.progressCircleActive], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.CheckCircle, { size: 16, color: "#fff" })
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.progressTextActive, children: "User Type" })]
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.progressLine, styles.progressLineActive] }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.progressStep, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: [styles.progressCircle, styles.progressCircleActive], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.progressNumActive, children: "2" })
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.progressTextActive, children: "Personal Info" })]
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: styles.progressLine }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.progressStep, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: styles.progressCircle, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.progressNum, children: "3" })
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.progressText, children: "Services" })]
                                }
                                )]
                        }
                        ),/*#__PURE__*/


                        !otpStep ?
                            (0, _jsxRuntime.jsxs)(_card.Card, {
                                style: styles.card, children: [/*#__PURE__*/
                                    (0, _jsxRuntime.jsx)(_card.CardHeader, {
                                        children:/*#__PURE__*/
                                            (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                style: styles.rowCentered, children: [/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_lucideReactNative.User, { size: 20, color: "#111827", style: { marginRight: 8 } }),/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_card.CardTitle, { children: t.personalInfo || "Patient Registration" })]
                                            }
                                            )
                                    }
                                    ),/*#__PURE__*/
                                    (0, _jsxRuntime.jsxs)(_card.CardContent, {
                                        children: [/*#__PURE__*/

                                            (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                style: styles.inputGroup, children: [/*#__PURE__*/
                                                    (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                        style: styles.labelRow, children: [/*#__PURE__*/
                                                            (0, _jsxRuntime.jsx)(_lucideReactNative.Phone, { size: 16, color: "#374151", style: { marginRight: 4 } }),/*#__PURE__*/
                                                            (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.label, children: "Mobile Number *" })]
                                                    }
                                                    ),/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_reactNative.TextInput, {
                                                        style: [styles.input, errors.phone && styles.inputError],
                                                        placeholder: "Enter 10 digit mobile number",
                                                        value: formData.phone,
                                                        onChangeText: function onChangeText(val) { return handleInputChange('phone', val); },
                                                        keyboardType: "phone-pad",
                                                        editable: !loading,
                                                        maxLength: 10
                                                    }
                                                    ),
                                                    errors.phone ?/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.errorText, children: errors.phone }) : null]
                                            }
                                            ),/*#__PURE__*/


                                            (0, _jsxRuntime.jsx)(_button.Button, {
                                                onPress: handleSubmit, disabled: loading || !formData.phone.trim(), style: { marginTop: 16 }, children:/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: 18, fontWeight: '300' }, children: loading ? 'Please wait...' : 'Continue' })
                                            }
                                            )]
                                    }
                                    )]
                            }
                            )
                            :
                            (0, _jsxRuntime.jsxs)(_card.Card, {
                                style: styles.card, children: [/*#__PURE__*/
                                    (0, _jsxRuntime.jsx)(_card.CardHeader, {
                                        children:/*#__PURE__*/
                                            (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                style: styles.rowCentered, children: [/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_lucideReactNative.ShieldCheck, { size: 24, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_card.CardTitle, { children: "Verify OTP" })]
                                            }
                                            )
                                    }
                                    ),/*#__PURE__*/
                                    (0, _jsxRuntime.jsxs)(_card.CardContent, {
                                        children: [/*#__PURE__*/
                                            (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.otpSubtitle, children: `Enter the OTP sent to +91 ${formData.phone}` }),/*#__PURE__*/

                                            (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                style: styles.otpContainer, children:
                                                    otp.map((digit, idx) => (
                                                        (0, _jsxRuntime.jsx)(_reactNative.TextInput, {
                                                            key: idx,
                                                            ref: el => inputRefs.current[idx] = el,
                                                            style: [styles.otpInput, otpError && styles.inputError],
                                                            maxLength: 1,
                                                            keyboardType: "number-pad",
                                                            value: digit,
                                                            onChangeText: val => handleOtpChange(val, idx),
                                                            onKeyPress: e => handleOtpKeyPress(e, idx),
                                                            editable: !loading
                                                        })
                                                    ))
                                            }
                                            ),

                                            otpError ?/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.errorText, { textAlign: 'center', marginTop: 8 }], children: 'Invalid OTP. Please try again.' }) : null,/*#__PURE__*/

                                            (0, _jsxRuntime.jsx)(_button.Button, {
                                                onPress: handleVerifyOtp, disabled: loading || otp.some(d => !d), style: { marginTop: 24, paddingVertical: 14 }, children:/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: 18, fontWeight: 'bold' }, children: loading ? 'Verifying...' : 'Verify OTP' })
                                            }
                                            ),/*#__PURE__*/

                                            (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                style: styles.resendContainer, children: [/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.resendText, children: "Didn't receive the code? " }),/*#__PURE__*/
                                                    (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                                        onPress: handleResendOtp, disabled: loading, children:/*#__PURE__*/
                                                            (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.resendBtn, children: "Resend OTP" })
                                                    }
                                                    )]
                                            }
                                            )]
                                    }
                                    )]
                            }
                            ),/*#__PURE__*/


                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                            style: styles.securityWrapper, children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.securityBox, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: [styles.rowCentered, { justifyContent: 'center', marginBottom: 8 }], children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.CheckCircle, { size: 16, color: "#16a34a", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.securityHeading, children: "Your data is secure and protected" })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.securityText, children: "Your information will only be used for hospital services and will not be shared with third parties." })]
                                }
                                )
                        }
                        )]
                }
                )
        }
        ));

}

var styles = _reactNative.StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    content: { padding: 16, paddingBottom: 32 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    backBtn: { padding: 8, marginRight: 8 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
    subtitle: { fontSize: 14, color: '#6b7280' },

    progressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
    progressStep: { alignItems: 'center', flexDirection: 'row', gap: 8 },
    progressCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
    progressCircleActive: { backgroundColor: '#2563eb' },
    progressNum: { fontSize: 14, color: '#9ca3af', fontWeight: 'bold' },
    progressNumActive: { fontSize: 14, color: '#fff', fontWeight: 'bold' },
    progressText: { fontSize: 12, color: '#6b7280', display: 'none' },// hidden on mobile due to space
    progressTextActive: { fontSize: 12, color: '#2563eb', fontWeight: '500', display: 'none' },
    progressLine: { width: 40, height: 2, backgroundColor: '#e5e7eb', marginHorizontal: 8 },
    progressLineActive: { backgroundColor: '#2563eb' },

    card: { marginBottom: 24 },
    rowCentered: { flexDirection: 'row', alignItems: 'center' },
    inputGroup: { marginBottom: 16 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    label: { fontSize: 14, fontWeight: '500', color: '#374151' },
    input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, backgroundColor: '#fff' },
    inputError: { borderColor: '#ef4444' },
    errorText: { fontSize: 12, color: '#ef4444', marginTop: 4 },

    securityWrapper: { alignItems: 'center' },
    securityBox: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, width: '100%', maxWidth: 600 },
    securityHeading: { fontSize: 14, fontWeight: '600', color: '#374151', textAlign: 'center' },
    securityText: { fontSize: 12, color: '#6b7280', textAlign: 'center', lineHeight: 18 },

    otpSubtitle: { fontSize: 16, color: '#4b5563', marginBottom: 24, textAlign: 'center' },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8 },
    otpInput: { width: 56, height: 64, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, fontSize: 24, fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff', color: '#111827' },
    resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, alignItems: 'center' },
    resendText: { color: '#6b7280', fontSize: 14 },
    resendBtn: { color: '#2563eb', fontWeight: '600', fontSize: 14 }
});