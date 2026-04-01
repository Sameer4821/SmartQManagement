var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.PatientDashboard = PatientDashboard; var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")); var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray")); var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _useTranslation = require("../hooks/useTranslation");
var _Settings = require("../components/Settings");
var _DepartmentStatistics = require("../components/DepartmentStatistics");
var _PatientHistory = require("../components/PatientHistory");

var _button = require("../components/ui/button");
var _card = require("../components/ui/card");
var _badge = require("../components/ui/badge");

var _lucideReactNative = require("lucide-react-native");
var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage")); var _jsxRuntime = require("react/jsx-runtime"); function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }// import { Progress } from './ui/progress';



function PatientDashboard() {
    var _useWindowDimensions = (0, _reactNative.useWindowDimensions)(), width = _useWindowDimensions.width;
    var isMobile = width < 768;
    var isNarrow = width < 400;
    var _useAppContext = require("../context/AppContext").useAppContext(), state = _useAppContext.state, setState = _useAppContext.setState;
    var t = (0, _useTranslation.useTranslation)().t;
    var _useState = (0, _react.useState)(false), _useState2 = (0, _slicedToArray2.default)(_useState, 2), showSettings = _useState2[0], setShowSettings = _useState2[1];
    var _useState3 = (0, _react.useState)(false), _useState4 = (0, _slicedToArray2.default)(_useState3, 2), showDepartmentStats = _useState4[0], setShowDepartmentStats = _useState4[1];
    var _useState5 = (0, _react.useState)(false), _useState6 = (0, _slicedToArray2.default)(_useState5, 2), showPatientHistory = _useState6[0], setShowPatientHistory = _useState6[1];
    var remainingEmergency = state.maxEmergencyPerDay - state.emergencyCount;

    var handleCategorySelect = function handleCategorySelect(category) {
        setState(function (prev) { return Object.assign({}, prev, { currentView: category }); });
    };

    var handleLogout =/*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)(function* () {
            yield _asyncStorage.default.removeItem('current-patient-info');
            setState(function (prev) {
                return Object.assign({},
                    prev, {
                    currentView: 'portal',
                    patientInfo: null
                });
            }
            );
        }); return function handleLogout() { return _ref.apply(this, arguments); };
    }();

    var handleChangeDetails = function handleChangeDetails() {
        setState(function (prev) { return Object.assign({}, prev, { currentView: 'patient-details' }); });
    };

    if (!state.patientInfo) {
        return (/*#__PURE__*/
            (0, _jsxRuntime.jsxs)(_reactNative.View, {
                style: styles.loadingContainer, children: [/*#__PURE__*/
                    (0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, { size: "large", color: "#2563eb" }),/*#__PURE__*/
                    (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.loadingText, children: "Loading your dashboard..." })]
            }
            ));

    }

    if (showSettings) return/*#__PURE__*/(0, _jsxRuntime.jsx)(_Settings.Settings, { onClose: function onClose() { return setShowSettings(false); } });
    if (showDepartmentStats) return/*#__PURE__*/(0, _jsxRuntime.jsx)(_DepartmentStatistics.DepartmentStatistics, { onBack: function onBack() { return setShowDepartmentStats(false); } });
    if (showPatientHistory) return/*#__PURE__*/(0, _jsxRuntime.jsx)(_PatientHistory.PatientHistory, { onBack: function onBack() { return setShowPatientHistory(false); } });

    var patientTokens = state.tokens.filter(function (tok) { var _state$patientInfo; return tok.patient.email === ((_state$patientInfo = state.patientInfo) == null ? void 0 : _state$patientInfo.email); });
    var totalVisits = patientTokens.flatMap(function (token) { return token.visits || []; }).length;
    var totalRecords = patientTokens.flatMap(function (token) { return token.prescriptions || []; }).length + patientTokens.flatMap(function (token) { return token.labTests || []; }).length;

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
            contentContainerStyle: [styles.container, isMobile && styles.containerMobile], children: [/*#__PURE__*/

                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: [styles.card, isMobile && styles.cardMobile], children:/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: [styles.headerRow, isMobile && styles.headerRowMobile], children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: { flex: 1 }, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.title, isMobile && styles.titleMobile], children: t.pdTitle }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.subtitle, isMobile && styles.subtitleMobile], children: t.pdSubtitle })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: [styles.headerActions, isMobile && styles.headerActionsMobile], children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_button.Button, {
                                                    variant: "outline", size: "sm", onPress: function onPress() { return setShowSettings(true); }, style: { marginBottom: 8 }, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Settings, { size: 16, color: "#374151", style: { marginRight: 4 } }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { children: "Settings" })]
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_button.Button, {
                                                    variant: "outline", size: "sm", onPress: handleChangeDetails, style: { marginBottom: 8 }, children:/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { children: t.pdChangeDetails })
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_button.Button, {
                                                    variant: "ghost", size: "sm", onPress: handleLogout, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.LogOut, { size: 16, color: "#ef4444", style: { marginRight: 4 } }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#ef4444' }, children: t.pdLogout })]
                                                }
                                                )]
                                        }
                                        )]
                                }
                                )
                        }
                        )
                }
                ),/*#__PURE__*/


                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: [styles.card, isMobile && styles.cardMobile, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }], children:/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: styles.welcomeContent, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: [styles.welcomeRow, isMobile && styles.welcomeRowMobile], children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.userIconWrap, isMobile && styles.userIconWrapMobile], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReactNative.User, { size: isMobile ? 20 : 24, color: "#2563eb" }) }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: [{ flex: 1, minWidth: 0 }, isMobile && { marginRight: 0 }], children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: [styles.welcomeTitle, isMobile && styles.welcomeTitleMobile], numberOfLines: 2, children: [t.pdWelcomeBack, ", ", state.patientInfo.name] }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.welcomeSub, isMobile && styles.welcomeSubMobile], numberOfLines: 1, children: state.patientInfo.email }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.welcomeSub, isMobile && styles.welcomeSubMobile], numberOfLines: 1, children: state.patientInfo.phone })]
                                        }
                                        ),/*#__PURE__*/
                                        !isNarrow && (0, _jsxRuntime.jsx)(_badge.Badge, { variant: "secondary", children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { children: t.pdLoggedInAs }) })]
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, { style: { alignItems: 'center', marginTop: 16 } }
                                )]
                        }
                        )
                }
                ),/*#__PURE__*/


                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: [styles.card, isMobile && styles.cardMobile], children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            style: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, children:/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_card.CardTitle, { children: t.pdSelectCategory })
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: styles.grid, children: [/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                    onPress: function onPress() { return handleCategorySelect('common'); }, activeOpacity: 0.8, style: { width: '100%' }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_card.Card, {
                                            style: [styles.cardItem, isMobile && styles.cardItemMobile, { borderLeftWidth: 4, borderLeftColor: '#3b82f6' }], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                                                    style: [styles.itemHeader, isMobile && styles.itemHeaderMobile], children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.iconBox, isMobile && styles.iconBoxMobile, { backgroundColor: '#dbeafe' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReactNative.Users, { size: isMobile ? 24 : 32, color: "#2563eb" }) }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: [{ flex: 1, marginLeft: 16 }, isMobile && styles.textBlockMobile], children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_card.CardTitle, { style: [{ color: '#2563eb' }, isMobile && { flexWrap: 'wrap' }], children: t.pdCommon }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_card.CardDescription, { style: [isMobile && { flexWrap: 'wrap' }], children: t.pdCommonDesc })]
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: [{ alignItems: 'flex-end' }, isMobile && styles.cardActionsMobile], children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_badge.Badge, { variant: "outline", children:/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, { children: ["Queue: ", state.tokens.filter(function (tok) { return tok.type === 'common' && tok.status === 'active'; }).length] }) }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_button.Button, { size: isMobile ? 'sm' : 'default', style: [{ marginTop: 8 }, isMobile && styles.bookBtnMobile], onPress: function onPress() { return handleCategorySelect('common'); }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: isMobile ? 13 : 16 }, children: t.pdSelect }) })]
                                                        }
                                                        )]
                                                }
                                                )
                                        }
                                        )
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                    onPress: function onPress() { return remainingEmergency > 0 && handleCategorySelect('emergency'); }, activeOpacity: remainingEmergency > 0 ? 0.8 : 1, style: { width: '100%' }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_card.Card, {
                                            style: [styles.cardItem, isMobile && styles.cardItemMobile, { borderLeftWidth: 4, borderLeftColor: '#ef4444', opacity: remainingEmergency > 0 ? 1 : 0.6 }], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                                                    style: [styles.itemHeader, isMobile && styles.itemHeaderMobile], children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.iconBox, isMobile && styles.iconBoxMobile, { backgroundColor: '#fee2e2' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReactNative.AlertTriangle, { size: isMobile ? 24 : 32, color: "#dc2626" }) }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: [{ flex: 1, marginLeft: 16 }, isMobile && styles.textBlockMobile], children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_card.CardTitle, { style: [{ color: '#dc2626' }, isMobile && { flexWrap: 'wrap' }], children: t.pdEmergency }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_card.CardDescription, { style: [isMobile && { flexWrap: 'wrap' }], children: t.pdEmergencyDesc })]
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: [{ alignItems: 'flex-end' }, isMobile && styles.cardActionsMobile], children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_badge.Badge, { variant: "destructive", children:/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, { style: { color: '#fff' }, children: ["Queue: ", state.tokens.filter(function (tok) { return tok.type === 'emergency' && tok.status === 'active'; }).length] }) }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_button.Button, {
                                                                    variant: "destructive", disabled: remainingEmergency <= 0, size: isMobile ? 'sm' : 'default', style: [{ marginTop: 8 }, isMobile && styles.bookBtnMobile], children:/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: isMobile ? 13 : 16 }, children: remainingEmergency <= 0 ? t.pdLimitReached : t.pdSelect })
                                                                }
                                                                )]
                                                        }
                                                        )]
                                                }
                                                )
                                        }
                                        )
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                    onPress: function onPress() { return handleCategorySelect('disabled'); }, activeOpacity: 0.8, style: { width: '100%' }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_card.Card, {
                                            style: [styles.cardItem, isMobile && styles.cardItemMobile, { borderLeftWidth: 4, borderLeftColor: '#3b82f6' }], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                                                    style: [styles.itemHeader, isMobile && styles.itemHeaderMobile], children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.View, { style: [styles.iconBox, isMobile && styles.iconBoxMobile, { backgroundColor: '#dbeafe' }], children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReactNative.Accessibility, { size: isMobile ? 24 : 32, color: "#2563eb" }) }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: [{ flex: 1, marginLeft: 16 }, isMobile && styles.textBlockMobile], children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_card.CardTitle, { style: [{ color: '#2563eb' }, isMobile && { flexWrap: 'wrap' }], children: t.pdDisabled }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_card.CardDescription, { style: [isMobile && { flexWrap: 'wrap' }], children: t.pdDisabledDesc })]
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: [{ alignItems: 'flex-end' }, isMobile && styles.cardActionsMobile], children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_badge.Badge, { variant: "secondary", children:/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, { children: ["Queue: ", state.tokens.filter(function (tok) { return tok.type === 'disabled' && tok.status === 'active'; }).length] }) }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_button.Button, { size: isMobile ? 'sm' : 'default', style: [{ marginTop: 8 }, isMobile && styles.bookBtnMobile], onPress: function onPress() { return handleCategorySelect('disabled'); }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: isMobile ? 13 : 16 }, children: t.pdSelect }) })]
                                                        }
                                                        )]
                                                }
                                                )
                                        }
                                        )
                                }
                                )]
                        }

                        )]
                }
                ),/*#__PURE__*/


                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                    onPress: function onPress() { return setShowDepartmentStats(true); }, activeOpacity: 0.8, style: styles.card, children:/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.Card, {
                            children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                                    style: styles.rowBetween, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowCenter, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Activity, { size: 24, color: "#2563eb", style: { marginRight: 12 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_card.CardTitle, { style: { color: '#2563eb' }, children: t.pdDepartmentStats }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_card.CardDescription, { children: "View detailed information" })]
                                                }
                                                )]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowCenter, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_badge.Badge, { variant: "outline", children:/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, { children: [state.departments.length, " Depts"] }) }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowRight, { size: 20, color: "#2563eb", style: { marginLeft: 8 } })]
                                        }
                                        )]
                                }
                                )
                        }
                        )
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                    onPress: function onPress() { return setShowPatientHistory(true); }, activeOpacity: 0.8, style: styles.card, children:/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.Card, {
                            children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                                    style: styles.rowBetween, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowCenter, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.History, { size: 24, color: "#16a34a", style: { marginRight: 12 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_card.CardTitle, { style: { color: '#16a34a' }, children: t.pdPatientHistory }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_card.CardDescription, { children: "Complete medical history" })]
                                                }
                                                )]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowRight, { size: 20, color: "#16a34a" })]
                                }
                                )
                        }
                        )
                }
                )]
        }

        ));

}

var styles = _reactNative.StyleSheet.create({
    container: { padding: 16, gap: 16 },
    containerMobile: { padding: 10, gap: 10 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 16, color: '#4b5563' },
    card: { marginBottom: 16 },
    cardMobile: { marginBottom: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerRowMobile: { flexDirection: 'column', gap: 12 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
    titleMobile: { fontSize: 18 },
    subtitle: { color: '#6b7280' },
    subtitleMobile: { fontSize: 12 },
    headerActions: { alignItems: 'flex-end' },
    headerActionsMobile: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, alignSelf: 'stretch' },
    welcomeContent: { paddingTop: 24 },
    welcomeRow: { flexDirection: 'row', alignItems: 'center' },
    welcomeRowMobile: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    userIconWrap: { width: 48, height: 48, backgroundColor: '#dbeafe', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    userIconWrapMobile: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
    welcomeTitle: { fontWeight: '600', color: '#1e40af', fontSize: 18 },
    welcomeTitleMobile: { fontSize: 14 },
    welcomeSub: { fontSize: 14, color: '#6b7280' },
    welcomeSubMobile: { fontSize: 12 },
    grid: { gap: 16 },
    cardItem: { marginBottom: 12 },
    cardItemMobile: { marginBottom: 8 },
    itemHeader: { flexDirection: 'row', alignItems: 'center' },
    itemHeaderMobile: { flexDirection: 'column', alignItems: 'flex-start' },
    textBlockMobile: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', marginLeft: 0, marginTop: 10, marginBottom: 4, width: '100%' },
    iconBox: { padding: 12, borderRadius: 24 },
    iconBoxMobile: { padding: 8, borderRadius: 20 },
    cardActionsMobile: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
    bookBtnMobile: { paddingVertical: 6, paddingHorizontal: 14 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowCenter: { flexDirection: 'row', alignItems: 'center' }
});