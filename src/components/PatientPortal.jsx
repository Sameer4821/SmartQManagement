var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.PatientPortal = PatientPortal; var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray")); var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _useTranslation = require("../hooks/useTranslation");
var _button = require("./ui/button");
var _card = require("./ui/card");
var _select = require("./ui/select");
var _toggle = require("./ui/toggle");
var _lucideReactNative = require("lucide-react-native"); var _jsxRuntime = require("react/jsx-runtime");




var languages = {
    en: 'English',
    hi: 'हिंदी',
    mr: 'मराठी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    bn: 'বাংলা'
};

var _Dimensions$get = _reactNative.Dimensions.get('window'), width = _Dimensions$get.width;

function PatientPortal() {
    var _useAppContext = require("../context/AppContext").useAppContext(), state = _useAppContext.state, setState = _useAppContext.setState;
    var t = (0, _useTranslation.useTranslation)().t;

    var handleLanguageChange = function handleLanguageChange(language) {
        setState(function (prev) { return Object.assign({}, prev, { language: language }); });
    };

    var handleAccessibilityToggle = function handleAccessibilityToggle(pressed) {
        setState(function (prev) { return Object.assign({}, prev, { accessibilityMode: pressed ? 'high-contrast' : 'normal' }); });
    };

    var handleContinueAsPatient = function handleContinueAsPatient() {
        setState(function (prev) { return Object.assign({}, prev, { currentView: 'patient-registration' }); });
    };

    var handleContinueAsStaff = function handleContinueAsStaff() {
        setState(function (prev) { return Object.assign({}, prev, { currentView: 'staff-login' }); });
    };

    var isLarge = state.accessibilityMode === 'high-contrast';

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
            contentContainerStyle: styles.container, children: [/*#__PURE__*/

                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                    style: styles.topBar, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                            style: styles.controlGroup, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                    style: styles.iconCircle, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Languages, { size: 20, color: "#0ea5e9" })
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_select.Select, {
                                    value: state.language, onValueChange: handleLanguageChange, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_select.SelectTrigger, {
                                            style: styles.selectTrigger, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_select.SelectValue, { placeholder: "Language" })
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_select.SelectContent, {
                                            children:
                                                Object.entries(languages).map(function (_ref) {
                                                    var _ref2 = (0, _slicedToArray2.default)(_ref, 2), code = _ref2[0], name = _ref2[1]; return (/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectItem, {
                                                            value: code, children:/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { children: name })
                                                        }, code
                                                        ));
                                                }
                                                )
                                        }
                                        )]
                                }
                                )]
                        }
                        ),/*#__PURE__*/

                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                            style: styles.controlGroup, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                    style: styles.iconCircle, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Type, { size: 20, color: "#0ea5e9" })
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_toggle.Toggle, {
                                    pressed: state.accessibilityMode === 'high-contrast',
                                    onPressedChange: handleAccessibilityToggle,
                                    style: styles.toggle, children:/*#__PURE__*/

                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: state.accessibilityMode === 'high-contrast' ? '#0f172a' : '#0f172a' }, children: isLarge ? t.large : t.normal })
                                }
                                )]
                        }
                        )]
                }
                ),/*#__PURE__*/


                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                    style: styles.hero, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                            style: styles.logoContainer, children:/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.Image, {
                                    source: require('../assets/icon.png')// Using expo icon as placeholder
                                    , style: styles.logo,
                                    resizeMode: "contain"
                                }
                                )
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.welcomeText, isLarge && { fontSize: 32 }], children: t.welcome }),/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.taglineText, isLarge && { fontSize: 20 }], children: t.tagline }),/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.getStartedText, isLarge && { fontSize: 24 }], children: t.getStarted })]
                }
                ),/*#__PURE__*/


                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.card, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                            style: { alignItems: 'center', display: 'none' }, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                    style: styles.hospitalIconBox, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Hospital, { size: 32, color: "#0ea5e9" })
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_card.CardTitle, { style: [styles.cardTitle, isLarge && { fontSize: 28 }], children: '' })]
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { gap: 16 }, children: [/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.noteBox, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: styles.noteIconBox, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.CheckCircle, { size: 16, color: "#ffffff" })
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.noteText, isLarge && { fontSize: 18 }], children: t.note }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: { position: 'absolute', top: 10, right: 10, opacity: 0.1 }, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Zap, { size: 32, color: "#14b8a6" })
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/


                                (0, _jsxRuntime.jsx)(_button.Button, {
                                    onPress: handleContinueAsPatient, style: [styles.continueBtn, { backgroundColor: '#1d4ed8' }], children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.btnContent, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.QrCode, { size: 20, color: "#ffffff", style: { marginRight: 12 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.btnText, isLarge && { fontSize: 20 }], children: t.lpContinue || "Continue as Patient" }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowRight, { size: 20, color: "#ffffff", style: { marginLeft: 12 } })]
                                        }
                                        )
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_button.Button, {
                                    onPress: handleContinueAsStaff, style: [styles.continueBtn, { backgroundColor: '#059669', shadowColor: '#059669' }], children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.btnContent, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Stethoscope, { size: 20, color: "#ffffff", style: { marginRight: 12 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.btnText, isLarge && { fontSize: 20 }], children: t.continueStaff || "Continue as Staff / Doctor" }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowRight, { size: 20, color: "#ffffff", style: { marginLeft: 12 } })]
                                        }
                                        )
                                }
                                )]
                        }
                        )]
                }
                ),/*#__PURE__*/


                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                    style: styles.footer, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                            style: styles.footerContent, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_lucideReactNative.Zap, { size: 20, color: "#0ea5e9", style: { marginRight: 8 } }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.footerTitle, isLarge && { fontSize: 16 }], children: "Smart Queue Management System" }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_lucideReactNative.Shield, { size: 20, color: "#14b8a6", style: { marginLeft: 8 } })]
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.footerSub, children: "\uD83D\uDE80 Next-Generation Hospital Queue System" })]
                }
                )]
        }
        ));

}

var styles = _reactNative.StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#f0fdfa', padding: 24, alignItems: 'center' },// softer background (minty), more padding
    topBar: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 40 },// more breathing room
    controlGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, padding: 6, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },// softer shadows, rounder
    iconCircle: { width: 40, height: 40, backgroundColor: '#ffffff', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 8, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
    selectTrigger: { borderWidth: 0, backgroundColor: 'transparent', minWidth: 100 },
    toggle: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    hero: { alignItems: 'center', marginBottom: 48, width: '100%' },// more breathing room
    logoContainer: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, marginBottom: 32, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },// rounder, softer shadow
    logo: { width: 140, height: 140 },// slightly larger logo area
    welcomeText: { fontSize: 32, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },// larger, softer dark slate
    taglineText: { fontSize: 18, color: '#14b8a6', textAlign: 'center', marginBottom: 16, fontWeight: '500' },// soft teal
    getStartedText: { fontSize: 20, color: '#64748b', textAlign: 'center', fontWeight: '400' },// softer gray
    card: { width: '100%', maxWidth: 540, backgroundColor: '#ffffff', shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8, borderRadius: 24, borderWidth: 1, borderColor: '#e0f2fe' },// softer shadow, highly rounded
    hospitalIconBox: { width: 64, height: 64, backgroundColor: '#e0f2fe', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },// larger, rounder, soft blue background
    cardTitle: { fontSize: 28, color: '#0f172a', fontWeight: '700', letterSpacing: -0.5 },// softer dark slate
    noteBox: { flexDirection: 'row', backgroundColor: '#f0fdfa', borderColor: '#ccfbf1', borderWidth: 1, borderRadius: 12, padding: 16, position: 'relative', overflow: 'hidden' },// minty background, rounder
    noteIconBox: { width: 28, height: 28, backgroundColor: '#14b8a6', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16, marginTop: 2 },// teal icon
    noteText: { flex: 1, fontSize: 16, color: '#0f172a', lineHeight: 24 },// softer slate
    continueBtn: { paddingVertical: 18, borderRadius: 8, shadowColor: '#1d4ed8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },// customized button to match mockup
    btnContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
    footer: { marginTop: 'auto', paddingTop: 40, paddingBottom: 24, alignItems: 'center' },
    footerContent: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: '#e0f2fe', marginBottom: 12, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },// rounder, soft border/shadow
    footerTitle: { fontSize: 15, fontWeight: '600', color: '#0369a1' },// deeper teal
    footerSub: { fontSize: 12, color: '#64748b', textAlign: 'center' }// softer gray
});