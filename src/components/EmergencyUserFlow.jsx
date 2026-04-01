var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.EmergencyUserFlow = EmergencyUserFlow; var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")); var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")); var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray")); var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _AppContext = require("../context/AppContext");

var _button = require("./ui/button");
var _card = require("./ui/card");
var _input = require("./ui/input");
var _label = require("./ui/label");
var _textarea = require("./ui/textarea");
var _select = require("./ui/select");
var _radioGroup = require("./ui/radio-group");
var _checkbox = require("./ui/checkbox");
var _lucideReactNative = require("lucide-react-native"); var _jsxRuntime = require("react/jsx-runtime"); function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
// Use mock or native equivalent
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
















function EmergencyUserFlow() {
    var _useAppContext = (0, _AppContext.useAppContext)(), state = _useAppContext.state, setState = _useAppContext.setState, sendEmergencyNotification = _useAppContext.sendEmergencyNotification;
    var _useState = (0, _react.useState)({
        name: state.patientInfo ? state.patientInfo.name : '',
        age: 0,
        gender: '',
        primaryDepartment: '',
        emergencyReason: '',
        severity: 'critical',
        image: undefined,
        assignedDoctor: '',
        hasDisability: false,
        disabilityType: '',
        assistanceNeeded: [],
        otherAssistance: ''
    }), _useState2 = (0, _slicedToArray2.default)(_useState, 2), formData = _useState2[0], setFormData = _useState2[1];

    var handleBack = function handleBack() {
        setState(function (prev) { return Object.assign({}, prev, { currentView: 'patient-dashboard' }); });
    };

    var handleImageUpload = function handleImageUpload() {
        _reactNative.Alert.alert('Upload Image', 'Image picker not implemented in this demo.');
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

    var generateEmergencyToken = function generateEmergencyToken() {
        if (!state.patientInfo) throw new Error('Patient information not available');

        var now = new Date();
        var tokenNumber = String(state.tokens.filter(function (t) { return t.type === 'emergency'; }).length + 1).padStart(3, '0');
        var dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        var timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');

        var tokenId = `EME-${timeStr}-${tokenNumber}`;
        var endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        var patientId = `PAT-${dateStr}-${tokenNumber}`;
        var allDepartmentNames = state.departments.map(function (d) { return d.name; });

        var priorityMap = { critical: 10, urgent: 8, moderate: 6 };
        var allAssistanceNeeded = (0, _toConsumableArray2.default)(formData.assistanceNeeded);
        if (formData.otherAssistance.trim()) {
            allAssistanceNeeded.push(`Other: ${formData.otherAssistance.trim()}`);
        }

        return {
            id: tokenId,
            type: 'emergency',
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
            priority: priorityMap[formData.severity],
            emergencyReason: formData.emergencyReason,
            disabilityType: formData.hasDisability ? formData.disabilityType : undefined,
            assistanceNeeded: formData.hasDisability ? allAssistanceNeeded : undefined,
            qrCode: tokenId,
            validUntil: endOfDay,
            createdAt: now,
            schedulingMethod: 'auto',
            visits: [],
            prescriptions: [],
            labTests: [],
            departmentAccess: allDepartmentNames
        };
    };

    var handleFormSubmit = /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)(function* () {
            if (!state.patientInfo) return;
            if (!formData.age || !formData.gender || !formData.primaryDepartment || !formData.emergencyReason) {
                console.log('Please fill all required fields');
                return;
            }
            if (state.emergencyCount >= state.maxEmergencyPerDay) {
                console.log('Emergency limit reached');
                return;
            }
            
            try {
                var newToken = generateEmergencyToken();
                sendEmergencyNotification(formData.primaryDepartment);
                
                // Insert into Supabase logic
                yield _supabaseClient.supabase.from('queue').insert([{
                    token_id: newToken.id,
                    patient_name: newToken.patient.name,
                    department: newToken.primaryDepartment,
                    doctor_id: formData.assignedDoctor || null,
                    status: 'waiting'
                }]);
                
                setState(function (prev) {
                    return Object.assign({},
                        prev, {
                        tokens: [].concat((0, _toConsumableArray2.default)(prev.tokens), [newToken]),
                        currentToken: newToken,
                        currentView: 'token',
                        emergencyCount: prev.emergencyCount + 1
                    });
                }
                );
            } catch (error) {
                console.log(error);
            }
        }); return function handleFormSubmit() { return _ref.apply(this, arguments); };
    }();

    var remainingEmergency = state.maxEmergencyPerDay - state.emergencyCount;
    var selectedDepartment = state.departments.find(function (d) { return d.name === formData.primaryDepartment; });
    var availableDoctors = (selectedDepartment == null ? void 0 : selectedDepartment.doctors.filter(function (d) { return d.status === 'available'; })) || [];
    var consultationDepartments = state.departments.filter(function (d) { return d.type === 'consultation'; });

    if (remainingEmergency <= 0) {
        return (/*#__PURE__*/
            (0, _jsxRuntime.jsxs)(_reactNative.View, {
                style: styles.centerContainer, children: [/*#__PURE__*/
                    (0, _jsxRuntime.jsx)(_lucideReactNative.AlertTriangle, { size: 48, color: "#dc2626", style: { marginBottom: 16 } }),/*#__PURE__*/
                    (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.errorTitle, children: "Daily Limit Reached" }),/*#__PURE__*/
                    (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.errorSub, children: "Maximum emergency tokens reached." }),/*#__PURE__*/
                    (0, _jsxRuntime.jsx)(_button.Button, {
                        onPress: handleBack, style: { marginTop: 24, paddingHorizontal: 32 }, children:/*#__PURE__*/
                            (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff' }, children: "Return to Dashboard" })
                    }
                    )]
            }
            ));

    }

    if (!state.patientInfo) return null;

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
            contentContainerStyle: styles.container, children: [/*#__PURE__*/
                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: [styles.cardSpacing, { borderColor: '#fca5a5' }], children:/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                            style: styles.rowBetween, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.row, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_button.Button, {
                                            variant: "ghost", size: "sm", onPress: handleBack, style: { marginRight: 8 }, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowLeft, { size: 20, color: "#dc2626" })
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_card.CardTitle, { style: { color: '#dc2626' }, children: "Emergency Registration" }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#7f1d1d', fontSize: 13 }, children: "Immediate attention" })]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: { color: '#dc2626', fontWeight: 'bold' }, children: ["Slots: ", remainingEmergency] })]
                        }
                        )
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: [styles.cardSpacing, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }], children:/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { paddingTop: 16, flexDirection: 'row', alignItems: 'center' }, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_lucideReactNative.UserCheck, { size: 20, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: { fontWeight: '600', color: '#1e40af' }, children: ["Patient: ", state.patientInfo.name] }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 13, color: '#1d4ed8' }, children: state.patientInfo.phone })]
                                }
                                )]
                        }
                        )
                }
                ),/*#__PURE__*/

                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.cardSpacing, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_card.CardTitle, {
                                    style: { flexDirection: 'row', alignItems: 'center' }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.User, { size: 20, style: { marginRight: 8 } }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { children: "Medical Information" })]
                                }
                                )
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { paddingTop: 0, gap: 16 }, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Name *" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_input.Input, {
                                            value: formData.name,
                                            onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { name: val })); },
                                            placeholder: "Enter patient name"
                                        })]
                                }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Age *" }),/*#__PURE__*/
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
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Emergency Department *" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_select.Select, {
                                            value: formData.primaryDepartment, onValueChange: function onValueChange(val) { return setFormData(Object.assign({}, formData, { primaryDepartment: val, assignedDoctor: '' })); }, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_select.SelectTrigger, {
                                                    style: { marginTop: 8 }, children:/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectValue, { placeholder: "Select emergency department" })
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
                                ),

                                selectedDepartment &&/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.doctorBox, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '600', marginBottom: 8 }, children: "Available Doctors" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                            style: [styles.docItem, !formData.assignedDoctor && styles.docSelected],
                                            onPress: function onPress() { return setFormData(Object.assign({}, formData, { assignedDoctor: '' })); }, children:/*#__PURE__*/

                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { children: "Any Available Doctor (Recommended)" })
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/


                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: { marginTop: 16 }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Emergency Severity *" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_radioGroup.RadioGroup, {
                                            value: formData.severity,
                                            onValueChange: function onValueChange(val) { return setFormData(Object.assign({}, formData, { severity: val })); },
                                            style: { marginTop: 8 }, children: [/*#__PURE__*/

                                                (0, _jsxRuntime.jsx)(_radioGroup.RadioGroupItem, { value: "critical", id: "critical", label: "Critical - Life threatening" }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_radioGroup.RadioGroupItem, { value: "urgent", id: "urgent", label: "Urgent - Immediate attention" }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_radioGroup.RadioGroupItem, { value: "moderate", id: "moderate", label: "Moderate - Can wait briefly" })]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: "Emergency Condition Details *" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_textarea.Textarea, {
                                            value: formData.emergencyReason,
                                            onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { emergencyReason: val })); },
                                            placeholder: "Describe the emergency condition",
                                            style: { marginTop: 8 }
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: { marginTop: 16 }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.row, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_checkbox.Checkbox, {
                                                    checked: formData.hasDisability,
                                                    onCheckedChange: function onCheckedChange(val) { return setFormData(Object.assign({}, formData, { hasDisability: !!val })); }
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { marginLeft: 8, fontWeight: '500' }, children: "Needs accessibility assistance" })]
                                        }
                                        ),

                                        formData.hasDisability &&/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.disabilityBox, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '500', marginBottom: 8 }, children: "Support Required" }),
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
                                                )]
                                        }
                                        )]
                                }

                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_button.Button, {
                                    variant: "outline", onPress: handleImageUpload, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Camera, { size: 16, color: "#000", style: { marginRight: 8 } }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { children: "Upload Medical Image (Optional)" })]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_button.Button, {
                                    onPress: handleFormSubmit, variant: "destructive", style: { marginTop: 16 }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.AlertTriangle, { size: 16, color: "#fff", style: { marginRight: 8 } }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontWeight: 'bold' }, children: "Generate Emergency Token" })]
                                }
                                )]
                        }
                        )]
                }
                )]
        }
        ));

}

var styles = _reactNative.StyleSheet.create({
    container: { padding: 24, paddingBottom: 40, backgroundColor: '#f0fdfa', flexGrow: 1 },// mint bg
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f0fdfa' },
    cardSpacing: { marginBottom: 20 },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    errorTitle: { fontSize: 22, fontWeight: '800', color: '#b91c1c', marginBottom: 8 },// softer dark red
    errorSub: { color: '#ef4444', textAlign: 'center', fontSize: 16 },// slightly softer red
    doctorBox: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginTop: 20, borderWidth: 1, borderColor: '#e0f2fe' },// white
    docItem: { padding: 16, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e0f2fe', marginBottom: 12 },// rounder
    docSelected: { borderColor: '#ef4444', backgroundColor: '#fef2f2', borderWidth: 2 },// red warning highlight
    disabilityBox: { marginTop: 16, padding: 16, backgroundColor: '#f0fdfa', borderRadius: 12, borderLeftWidth: 6, borderLeftColor: '#14b8a6' },// teal highlight instead of blue
    radioGroup: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 8 },
    radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#ffffff', borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0' },
    radioText: { fontSize: 16, color: '#334155', fontWeight: '500' }
});
