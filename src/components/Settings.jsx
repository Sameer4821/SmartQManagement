var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.Settings = Settings; var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _useTranslation = require("../hooks/useTranslation");
var _card = require("./ui/card");
var _button = require("./ui/button");
var _switch = require("./ui/switch");
var _label = require("./ui/label");
var _separator = require("./ui/separator");
var _badge = require("./ui/badge");
var _lucideReactNative = require("lucide-react-native"); var _jsxRuntime = require("react/jsx-runtime");













function Settings(_ref) {
    var _languages$find; var onClose = _ref.onClose;
    var _useAppContext = require("../context/AppContext").useAppContext(), state = _useAppContext.state, setState = _useAppContext.setState;
    var t = (0, _useTranslation.useTranslation)().t;

    var handleThemeChange = function handleThemeChange(newTheme) {
        setState(function (prev) { return Object.assign({}, prev, { theme: newTheme }); });
    };

    var handleLanguageChange = function handleLanguageChange(language) {
        setState(function (prev) { return Object.assign({}, prev, { language: language }); });
    };

    var handleAccessibilityChange = function handleAccessibilityChange(mode) {
        setState(function (prev) { return Object.assign({}, prev, { accessibilityMode: mode }); });
    };

    var languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
        { code: 'bn', name: 'বাংলা', flag: '🇮🇳' }];


    return (/*#__PURE__*/
        (0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
            contentContainerStyle: styles.container, children:/*#__PURE__*/
                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.mainCard, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            style: { backgroundColor: '#2563eb', borderTopLeftRadius: 8, borderTopRightRadius: 8 }, children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.headerRow, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.headerTitle, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Settings, { size: 20, color: "#fff", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_card.CardTitle, { style: { color: '#fff' }, children: t.settingsTitle })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                            onPress: onClose, style: styles.closeBtn, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: 24 }, children: "\xD7" })
                                        }
                                        )]
                                }
                                )
                        }
                        ),/*#__PURE__*/

                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: styles.content, children: [/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.section, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.sectionTitleRow, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Palette, { size: 16, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.sectionTitle, children: t.themeSettings })]
                                        }
                                        ),/*#__PURE__*/

                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.themeGrid, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.TouchableOpacity, {
                                                    style: [styles.themeCard, state.theme === 'medical' && styles.themeCardActive],
                                                    onPress: function onPress() { return handleThemeChange('medical'); }, children: [/*#__PURE__*/

                                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                                            style: [styles.iconBox, { backgroundColor: '#3b82f6' }], children:/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Sun, { size: 24, color: "#fff" })
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.themeName, children: t.lightTheme }),
                                                        state.theme === 'medical' &&/*#__PURE__*/(0, _jsxRuntime.jsx)(_badge.Badge, { style: { marginTop: 8 }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: 10 }, children: t.active }) })]
                                                }
                                                ),/*#__PURE__*/

                                                (0, _jsxRuntime.jsxs)(_reactNative.TouchableOpacity, {
                                                    style: [styles.themeCard, state.theme === 'dark' && styles.themeCardActive],
                                                    onPress: function onPress() { return handleThemeChange('dark'); }, children: [/*#__PURE__*/

                                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                                            style: [styles.iconBox, { backgroundColor: '#1f2937' }], children:/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Moon, { size: 24, color: "#fff" })
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.themeName, children: t.darkTheme }),
                                                        state.theme === 'dark' &&/*#__PURE__*/(0, _jsxRuntime.jsx)(_badge.Badge, { style: { marginTop: 8 }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: 10 }, children: t.active }) })]
                                                }
                                                )]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_separator.Separator, { style: { marginVertical: 16 } }),/*#__PURE__*/


                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.section, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.sectionTitleRow, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Globe, { size: 16, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.sectionTitle, children: t.languageSettings })]
                                        }
                                        ),/*#__PURE__*/

                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: styles.langGrid, children:
                                                languages.map(function (lang) {
                                                    return (/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_button.Button, {

                                                            variant: state.language === lang.code ? "default" : "outline",
                                                            onPress: function onPress() { return handleLanguageChange(lang.code); },
                                                            style: styles.langBtn, children:/*#__PURE__*/

                                                                (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: { color: state.language === lang.code ? '#fff' : '#000' }, children: [lang.flag, " ", lang.name] })
                                                        }, lang.code
                                                        ));
                                                }
                                                )
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_separator.Separator, { style: { marginVertical: 16 } }),/*#__PURE__*/


                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.section, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.sectionTitleRow, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Accessibility, { size: 16, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.sectionTitle, children: t.accessibilitySettings })]
                                        }
                                        ),/*#__PURE__*/

                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: { gap: 16 }, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.rowBetween, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_label.Label, { children: t.normalMode }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.subText, children: t.standardDisplay })]
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_switch.Switch, {
                                                            checked: state.accessibilityMode === 'normal',
                                                            onCheckedChange: function onCheckedChange(checked) { return checked && handleAccessibilityChange('normal'); }
                                                        }
                                                        )]
                                                }
                                                ),/*#__PURE__*/

                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.rowBetween, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_label.Label, { children: t.highContrastMode }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.subText, children: t.enhancedContrast })]
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_switch.Switch, {
                                                            checked: state.accessibilityMode === 'high-contrast',
                                                            onCheckedChange: function onCheckedChange(checked) { return checked && handleAccessibilityChange('high-contrast'); }
                                                        }
                                                        )]
                                                }
                                                ),/*#__PURE__*/

                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.rowBetween, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_label.Label, { children: t.voiceAssistant }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.subText, children: t.audioGuidance })]
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_switch.Switch, {
                                                            checked: state.accessibilityMode === 'voice-assist',
                                                            onCheckedChange: function onCheckedChange(checked) { return checked && handleAccessibilityChange('voice-assist'); }
                                                        }
                                                        )]
                                                }
                                                )]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_separator.Separator, { style: { marginVertical: 16 } }),/*#__PURE__*/


                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.section, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.sectionTitleRow, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Monitor, { size: 16, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.sectionTitle, children: t.systemInformation })]
                                        }
                                        ),/*#__PURE__*/

                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.sysGrid, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.sysItem, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_label.Label, { style: { color: '#6b7280' }, children: t.currentTheme }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '500' }, children: state.theme === 'medical' ? t.lightTheme : t.darkTheme })]
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.sysItem, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_label.Label, { style: { color: '#6b7280' }, children: t.languageSettings }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '500' }, children: ((_languages$find = languages.find(function (l) { return l.code === state.language; })) == null ? void 0 : _languages$find.name) || 'English' })]
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.sysItem, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_label.Label, { style: { color: '#6b7280' }, children: t.accessibilitySettings }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '500', textTransform: 'capitalize' }, children: state.accessibilityMode.replace('-', ' ') })]
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.sysItem, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_label.Label, { style: { color: '#6b7280' }, children: t.activeTokens }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '500' }, children: state.tokens.filter(function (t) { return t.status === 'active'; }).length })]
                                                }
                                                )]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                    style: { marginTop: 24 }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_button.Button, {
                                            onPress: onClose, style: { backgroundColor: '#2563eb' }, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontWeight: 'bold' }, children: t.saveAndClose })
                                        }
                                        )
                                }
                                )]
                        }
                        )]
                }
                )
        }
        ));

}

var styles = _reactNative.StyleSheet.create({
    container: { padding: 16 },
    mainCard: { maxWidth: 600, width: '100%', alignSelf: 'center' },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { flexDirection: 'row', alignItems: 'center' },
    closeBtn: { padding: 4 },
    content: { padding: 24 },
    section: { marginVertical: 8 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    themeGrid: { flexDirection: 'row', gap: 16 },
    themeCard: { flex: 1, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 },
    themeCardActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff', borderWidth: 2 },
    iconBox: { width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    themeName: { fontWeight: '600' },
    langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    langBtn: { width: '31%', paddingHorizontal: 4, paddingVertical: 8 },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    subText: { fontSize: 12, color: '#6b7280' },
    sysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    sysItem: { width: '45%' }
});