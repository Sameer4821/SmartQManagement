var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.DisabledUserFlow = DisabledUserFlow; var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")); var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")); var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray")); var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _AppContext = require("../context/AppContext");

var _button = require("./ui/button");
var _card = require("./ui/card");
var _input = require("./ui/input");
var _label = require("./ui/label");
var _checkbox = require("./ui/checkbox");

var _select = require("./ui/select");

var _textarea = require("./ui/textarea");
var _lucideReactNative = require("lucide-react-native"); var _jsxRuntime = require("react/jsx-runtime"); function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var _supabaseClient = require("../services/supabaseClient");

var disabilityTypes = [
    { value: 'mobility', label: 'Mobility Impairment', icon: _lucideReactNative.User },
    { value: 'visual', label: 'Visual Impairment', icon: _lucideReactNative.Eye },
    { value: 'hearing', label: 'Hearing Impairment', icon: _lucideReactNative.Ear },
    { value: 'cognitive', label: 'Cognitive Disability', icon: _lucideReactNative.Heart },
    { value: 'multiple', label: 'Multiple Disabilities', icon: _lucideReactNative.Users },
    { value: 'other', label: 'Other', icon: _lucideReactNative.Accessibility }];


var assistanceOptions = [
    'Wheelchair assistance',
    'Sign language interpreter',
    'Audio assistance',
    'Personal care attendant',
    'Accessible restroom'];




















function DisabledUserFlow() {
    var _useAppContext = (0, _AppContext.useAppContext)(), state = _useAppContext.state, setState = _useAppContext.setState;
    var _useState = (0, _react.useState)({
        name: state.patientInfo ? state.patientInfo.name : '',
        email: '',
        phone: '',
        age: 0,
        gender: '',
        primaryDepartment: '',
        disabilityType: '',
        disabilityDetails: '',
        assistanceNeeded: [],
        otherAssistance: '',
        caregiverName: '',
        caregiverPhone: '',
        urgency: 'normal',
        wheelchairNeeded: false,
        interpreterNeeded: false
    }), _useState2 = (0, _slicedToArray2.default)(_useState, 2), formData = _useState2[0], setFormData = _useState2[1];

    var handleBack = function handleBack() {
        setState(function (prev) { return Object.assign({}, prev, { currentView: 'patient-dashboard' }); });
    };

    var handleAssistanceChange = function handleAssistanceChange(assistance, checked) {
        setFormData(function (prev) {
            return Object.assign({},
                prev, {
                assistanceNeeded: checked ? [].concat((0, _toConsumableArray2.default)(
                    prev.assistanceNeeded), [assistance]) :
                    prev.assistanceNeeded.filter(function (a) { return a !== assistance; })
            });
        }
        );
    };

    var generateDisabledToken = function generateDisabledToken() {
        if (!state.patientInfo) throw new Error('Patient information not available');

        var now = new Date();
        var tokenNumber = String(state.tokens.filter(function (t) { return t.type === 'disabled'; }).length + 1).padStart(3, '0');
        var dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        var timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');

        var tokenId = `ACE-${timeStr}-${tokenNumber}`;
        var endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        var patientId = `PAT-${dateStr}-${tokenNumber}`;
        var allDepartmentNames = state.departments.map(function (d) { return d.name; });

        var priority = formData.urgency === 'priority' ? 8 : 6;
        var allAssistanceNeeded = (0, _toConsumableArray2.default)(formData.assistanceNeeded);
        if (formData.otherAssistance.trim()) {
            allAssistanceNeeded.push(`Other: ${formData.otherAssistance.trim()}`);
        }

        return {
            id: tokenId,
            type: 'disabled',
            primaryDepartment: formData.primaryDepartment,
            timestamp: now,
            patient: {
                name: formData.name || state.patientInfo.name,
                email: state.patientInfo.email,
                phone: state.patientInfo.phone,
                age: formData.age,
                gender: formData.gender,
                patientId: patientId
            },
            status: 'active',
            priority: priority,
            disabilityType: formData.disabilityType,
            assistanceNeeded: allAssistanceNeeded,
            qrCode: tokenId,
            validUntil: endOfDay,
            createdAt: now,
            schedulingMethod: 'manual',
            visits: [],
            prescriptions: [],
            labTests: [],
            departmentAccess: allDepartmentNames
        };
    };

    var handleFormSubmit = /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)(function* () {
            if (!formData.age || !formData.gender || !formData.primaryDepartment || !formData.disabilityType) {
                console.log('Please fill all required fields');
                return;
            }
            if (formData.assistanceNeeded.length === 0 && formData.otherAssistance.trim() === '') {
                console.log('Please select assistance needed');
                return;
            }
            
            try {
                var newToken = generateDisabledToken();
                
                // Insert into Supabase logic
                yield _supabaseClient.supabase.from('queue').insert([{
                    token_id: newToken.id,
                    patient_name: newToken.patient.name,
                    department: newToken.primaryDepartment,
                    doctor_id: formData.assignedDoctor || null, // Assuming no assigned doc explicitly defined in disability flow yet
                    status: 'waiting'
                }]);
                
                setState(function (prev) {
                    return Object.assign({},
                        prev, {
                        tokens: [].concat((0, _toConsumableArray2.default)(prev.tokens), [newToken]),
                        currentToken: newToken,
                        currentView: 'token'
                    });
                }
                );
            } catch (error) {
                console.log(error);
            }
        }); return function handleFormSubmit() { return _ref.apply(this, arguments); };
    }();

    if (!state.patientInfo) return null;

    var consultationDepartments = state.departments.filter(function (d) { return d.type === 'consultation'; });

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
            contentContainerStyle: styles.container, children: [/*#__PURE__*/

                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: [styles.cardSpacing, { borderColor: '#0ea5e9', borderWidth: 1 }], children:/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                            style: styles.rowBetween, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.row, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_button.Button, {
                                            variant: "ghost", size: "sm", onPress: handleBack, style: { marginRight: 8 }, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowLeft, { size: 20, color: "#0ea5e9" })
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_card.CardTitle, { style: { color: '#0ea5e9' }, children: "Accessibility Services" }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#0369a1', fontSize: 13, fontWeight: '500' }, children: "Priority care" })]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_lucideReactNative.Accessibility, { size: 28, color: "#0ea5e9" })]
                        }
                        )
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: [styles.cardSpacing, { backgroundColor: '#f0fdfa', borderLeftWidth: 6, borderLeftColor: '#14b8a6' }], children:/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { paddingTop: 0 }, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '700', color: '#0f172a', marginBottom: 4 }, children: "Comprehensive Support" }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 14, color: '#475569', lineHeight: 20 }, children: "We provide priority service and specialized assistance for patients with disabilities." })]
                        }
                        )
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: styles.cardSpacing, children:/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { paddingTop: 16, gap: 16 }, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.sectionTitle, children: "Medical Information" }),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Name" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_input.Input, {
                                            value: formData.name,
                                            onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { name: val })); },
                                            placeholder: "Enter patient name"
                                        })]
                                }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Age" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_input.Input, {
                                            keyboardType: "numeric",
                                            value: formData.age ? String(formData.age) : '',
                                            onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { age: parseInt(val) || 0 })); }
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Gender" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: styles.radioGroup, children:
                                                ['male', 'female', 'other'].map(function (option) {
                                                    var isSelected = formData.gender === option;
                                                    var RadioIcon = isSelected ? _lucideReactNative.CircleDot : _lucideReactNative.Circle;
                                                    return (/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.TouchableOpacity, {
                                                            onPress: function onPress() { return setFormData(Object.assign({}, formData, { gender: option })); }, style: styles.radioOption, children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(RadioIcon, { size: 20, color: isSelected ? '#2563eb' : '#9ca3af' }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.radioText, children: option.charAt(0).toUpperCase() + option.slice(1) })]
                                                        }, option
                                                        ));

                                                })
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Primary Department" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_select.Select, {
                                            value: formData.primaryDepartment, onValueChange: function onValueChange(val) { return setFormData(Object.assign({}, formData, { primaryDepartment: val })); }, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_select.SelectTrigger, {
                                                    style: { marginTop: 8 }, children:/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectValue, { placeholder: "Select primary department" })
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_select.SelectContent, {
                                                    children:
                                                        consultationDepartments.map(function (dept) {
                                                            return (/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_select.SelectItem, {
                                                                    value: dept.name, children:/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { children: dept.name })
                                                                }, dept.name
                                                                ));
                                                        }
                                                        )
                                                }
                                                )]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.sectionTitle, { marginTop: 16 }], children: "Accessibility Information" }),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Type of Accessibility Need" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: styles.grid, children:
                                                disabilityTypes.map(function (type) {
                                                    var Icon = type.icon;
                                                    return (/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.TouchableOpacity, {

                                                            style: [styles.typeBox, formData.disabilityType === type.value && styles.typeSelected],
                                                            onPress: function onPress() { return setFormData(Object.assign({}, formData, { disabilityType: type.value })); }, children: [/*#__PURE__*/

                                                                (0, _jsxRuntime.jsx)(Icon, { size: 16, color: formData.disabilityType === type.value ? '#2563eb' : '#4b5563' }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { marginLeft: 8, fontSize: 13, flexShrink: 1 }, children: type.label })]
                                                        }, type.value
                                                        ));

                                                })
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Additional Details" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_textarea.Textarea, {
                                            value: formData.disabilityDetails,
                                            onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { disabilityDetails: val })); },
                                            placeholder: "Specific requirements...",
                                            style: { marginTop: 8 }
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Priority Level" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: styles.radioGroup, children:
                                                [
                                                    { value: 'normal', label: 'Standard Priority' },
                                                    { value: 'priority', label: 'High Priority' }].
                                                    map(function (option) {
                                                        var isSelected = formData.urgency === option.value;
                                                        var RadioIcon = isSelected ? _lucideReactNative.CircleDot : _lucideReactNative.Circle;
                                                        return (/*#__PURE__*/
                                                            (0, _jsxRuntime.jsxs)(_reactNative.TouchableOpacity, {
                                                                onPress: function onPress() { return setFormData(Object.assign({}, formData, { urgency: option.value })); }, style: styles.radioOption, children: [/*#__PURE__*/
                                                                    (0, _jsxRuntime.jsx)(RadioIcon, { size: 20, color: isSelected ? '#2563eb' : '#9ca3af' }),/*#__PURE__*/
                                                                    (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.radioText, children: option.label })]
                                                            }, option.value
                                                            ));

                                                    })
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.sectionTitle, { marginTop: 16 }], children: "Support Services Required" }),/*#__PURE__*/


                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [
                                        assistanceOptions.map(function (opt) {
                                            return (/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: [styles.row, { marginBottom: 8 }], children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_checkbox.Checkbox, {
                                                            checked: formData.assistanceNeeded.includes(opt),
                                                            onCheckedChange: function onCheckedChange(checked) { return handleAssistanceChange(opt, !!checked); }
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { marginLeft: 8 }, children: opt })]
                                                }, opt
                                                ));
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.row, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_checkbox.Checkbox, {
                                                    checked: formData.otherAssistance.trim() !== '',
                                                    onCheckedChange: function onCheckedChange(checked) {
                                                        if (!checked) setFormData(Object.assign({}, formData, { otherAssistance: '' }));
                                                    }
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { marginLeft: 8 }, children: "Other" })]
                                        }
                                        ),
                                        formData.otherAssistance.trim() !== '' &&/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_input.Input, {
                                            value: formData.otherAssistance,
                                            onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { otherAssistance: val })); },
                                            placeholder: "Specify assistance",
                                            style: { marginTop: 8, marginLeft: 32 }
                                        }
                                        )]
                                }

                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.sectionTitle, { marginTop: 16 }], children: "Caregiver Info (Optional)" }),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_input.Input, {
                                    placeholder: "Name",
                                    value: formData.caregiverName,
                                    onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { caregiverName: val })); }
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_input.Input, {
                                    placeholder: "Phone",
                                    keyboardType: "phone-pad",
                                    value: formData.caregiverPhone,
                                    onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { caregiverPhone: val })); }
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_button.Button, {
                                    onPress: handleFormSubmit, style: { marginTop: 16 }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontWeight: 'bold' }, children: "Generate Priority Token" })
                                }
                                )]
                        }
                        )
                }
                )]
        }
        ));

}

var styles = _reactNative.StyleSheet.create({
    container: { padding: 24, paddingBottom: 40, backgroundColor: '#f0fdfa', flexGrow: 1 },// minty background, more padding
    cardSpacing: { marginBottom: 20 },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sectionTitle: { fontSize: 18, fontWeight: '700', borderBottomWidth: 1, borderBottomColor: '#e0f2fe', paddingBottom: 8, color: '#0f172a' },// softer border, darker text
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
    formGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', color: '#0ea5e9' },// teal label
    typeBox: { padding: 16, borderWidth: 1, borderColor: '#e0f2fe', borderRadius: 16, width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff' },// larger radius, white bg
    typeSelected: { borderColor: '#0ea5e9', backgroundColor: '#f0fdfa', borderWidth: 2 },// minty selection, teal border
    radioGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 12 },
    radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    radioText: { fontSize: 16, color: '#475569', fontWeight: '500' }// softer gray
});
