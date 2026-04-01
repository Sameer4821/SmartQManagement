var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.LoginPortal = LoginPortal; var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _AppContext = require("../context/AppContext");
var _button = require("./ui/button");
var _card = require("./ui/card");
var _select = require("./ui/select");
var _lucideReactNative = require("lucide-react-native"); var _jsxRuntime = require("react/jsx-runtime");

var _useTranslation = require("../hooks/useTranslation");

function LoginPortal() {
    var _useAppContext = require("../context/AppContext").useAppContext(), state = _useAppContext.state, setState = _useAppContext.setState;
    var t = (0, _useTranslation.useTranslation)().t;

    var handleLanguageChange = function handleLanguageChange(language) {
        setState(function (prev) { return Object.assign({}, prev, { language: language }); });
    };

    var handleAccessibilityChange = function handleAccessibilityChange(mode) {
        setState(function (prev) { return Object.assign({}, prev, { accessibilityMode: mode }); });
    };

    var handleContinue = function handleContinue() {
        setState(function (prev) { return Object.assign({}, prev, { currentView: 'patient-details' }); });
    };

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
            contentContainerStyle: styles.container, children: [/*#__PURE__*/
                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                    style: styles.header, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                            style: styles.iconWrap, children:/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_lucideReactNative.Heart, { size: 40, color: "#ffffff" })
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.title, children: t("lpTitle") }),/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.subtitle, children: t("lpSubtitle") }),/*#__PURE__*/

                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                            style: styles.settingsRow, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.settingItem, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Settings, { size: 18, color: "#0ea5e9" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_select.Select, {
                                            value: currentLanguage, onValueChange: handleLanguageChange, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_select.SelectTrigger, { style: { width: 130, marginLeft: 8, borderColor: '#e0f2fe' }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_select.SelectValue, {}) }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_select.SelectContent, {
                                                    children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectItem, { value: "en", children: "English" }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectItem, { value: "hi", children: "\u0939\u093F\u0928\u094D\u0926\u0940" }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectItem, { value: "mr", children: "\u092E\u0930\u093E\u0920\u0940" })]
                                                }
                                                )]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.settingItem, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Accessibility, { size: 18, color: "#0ea5e9" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_select.Select, {
                                            value: state.accessibilityMode, onValueChange: handleAccessibilityChange, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_select.SelectTrigger, { style: { width: 150, marginLeft: 8, borderColor: '#e0f2fe' }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_select.SelectValue, {}) }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_select.SelectContent, {
                                                    children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectItem, { value: "normal", children: "Normal" }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectItem, { value: "high-contrast", children: "High Contrast" })]
                                                }
                                                )]
                                        }
                                        )]
                                }
                                )]
                        }
                        )]
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                    style: styles.welcome, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.welcomeTitle, children: t("lpWelcome") }),/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.welcomeSubtitle, children: t("lpGetStarted") })]
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.card, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                            style: styles.cardHeader, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                    style: styles.usersIcon, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Users, { size: 56, color: "#0ea5e9" })
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_card.CardTitle, { style: styles.cardTitle, children: t("lpPatientPortal") }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_card.CardDescription, { style: styles.cardDesc, children: t("lpPatientDesc") })]
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.featuresHeading, children: t("lpFeatures") }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, { style: styles.featureItem, children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, { style: styles.dot }),/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#0f172a', fontSize: 16 }, children: t("lpFeature1") })] }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, { style: styles.featureItem, children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, { style: styles.dot }),/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#0f172a', fontSize: 16 }, children: t("lpFeature2") })] }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, { style: styles.featureItem, children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, { style: styles.dot }),/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#0f172a', fontSize: 16 }, children: t("lpFeature3") })] }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, { style: styles.featureItem, children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, { style: styles.dot }),/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#0f172a', fontSize: 16 }, children: t("lpFeature4") })] }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_button.Button, { onPress: handleContinue, style: styles.continueBtn, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' }, children: t("lpContinue") }) })]
                        }
                        )]
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.deptCard, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, { children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_card.CardTitle, { style: styles.deptCardTitle, children: "Available Departments" }) }),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: styles.deptGrid, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.deptItem, { backgroundColor: '#f0fdfa' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#134e4a', fontWeight: '600' }, children: "Consultation" }) }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.deptItem, { backgroundColor: '#eff6ff' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#1e3a8a', fontWeight: '600' }, children: "Laboratory" }) }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.deptItem, { backgroundColor: '#f8fafc' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#334155', fontWeight: '600' }, children: "Pharmacy" }) }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.deptItem, { backgroundColor: '#fefce8' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#713f12', fontWeight: '600' }, children: "Radiology" }) }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.deptItem, { backgroundColor: '#fef2f2' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#7f1d1d', fontWeight: '600' }, children: "Emergency" }) }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.deptItem, { backgroundColor: '#fdf4ff' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#701a75', fontWeight: '600' }, children: "Reception" }) })]
                        }
                        )]
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsx)(_reactNative.View, {
                    style: styles.footer, children:/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.footerText, children: "\uD83C\uDFE5 Government Hospital \u2022 24/7 Emergency Services" })
                }
                )]
        }
        ));

}

var styles = _reactNative.StyleSheet.create({
    container: { padding: 24, alignItems: 'center', backgroundColor: '#f0fdfa', flexGrow: 1 },// background color and padding added
    header: { alignItems: 'center', marginBottom: 40 },// increased bottom margin
    iconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },// larger, teal, shadow
    title: { fontSize: 28, fontWeight: '800', color: '#0f172a', textAlign: 'center', letterSpacing: -0.5 },// softer dark slate, larger
    subtitle: { fontSize: 16, color: '#14b8a6', textAlign: 'center', marginTop: 8, fontWeight: '500' },// soft teal
    settingsRow: { flexDirection: 'row', marginTop: 32, flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
    settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', padding: 8, borderRadius: 12 },// added background and border radius
    welcome: { alignItems: 'center', marginBottom: 32 },
    welcomeTitle: { fontSize: 24, fontWeight: '700', color: '#0f172a', letterSpacing: -0.3 },
    welcomeSubtitle: { fontSize: 16, color: '#64748b', marginTop: 4 },// softer gray
    card: { width: '100%', maxWidth: 640, marginBottom: 40, borderRadius: 24, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 6 },// softer shadow, rounder
    cardHeader: { alignItems: 'center', paddingTop: 32 },
    usersIcon: { padding: 24, backgroundColor: '#e0f2fe', borderRadius: 48, marginBottom: 24 },// softer blue, larger radius
    cardTitle: { fontSize: 26, color: '#0f172a', fontWeight: '700' },// darker state instead of blue
    cardDesc: { fontSize: 16, textAlign: 'center', color: '#64748b' },// softer gray
    featuresHeading: { fontWeight: '600', textAlign: 'center', marginBottom: 16, color: '#0f172a', fontSize: 18 },
    featureItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdfa', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccfbf1' },// minty background
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#14b8a6', marginRight: 16 },// teal dot
    continueBtn: { marginTop: 32, paddingVertical: 18, borderRadius: 9999, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },// pill shape, shadow
    deptCard: { width: '100%', maxWidth: 800, marginBottom: 40, borderRadius: 24, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 2 },
    deptCardTitle: { textAlign: 'center', fontSize: 22, color: '#0f172a' },
    deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', padding: 16 },
    deptItem: { padding: 16, borderRadius: 16, width: 150, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },// rounder, wider
    footer: { alignItems: 'center', marginTop: 24, marginBottom: 40 },
    footerText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' }// lighter gray
});
