var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.CommonUserFlow = CommonUserFlow; var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")); var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray")); var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _AppContext = require("../context/AppContext");
var _useTranslation = require("../hooks/useTranslation");
var _button = require("./ui/button");
var _card = require("./ui/card");
var _input = require("./ui/input");
var _label = require("./ui/label");
var _select = require("./ui/select");

var _badge = require("./ui/badge");
var _lucideReactNative = require("lucide-react-native"); var _jsxRuntime = require("react/jsx-runtime"); function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
// Assuming sonner is being used via some native equivalent or we can just use Alert

var manualTimeSlots = [
    { time: '09:00', label: '9:00 AM', crowdLevel: 'Low', color: '#16a34a' },
    { time: '10:00', label: '10:00 AM', crowdLevel: 'Medium', color: '#ca8a04' },
    { time: '11:00', label: '11:00 AM', crowdLevel: 'High', color: '#dc2626' },
    { time: '14:00', label: '2:00 PM', crowdLevel: 'Low', color: '#16a34a' },
    { time: '15:00', label: '3:00 PM', crowdLevel: 'Medium', color: '#ca8a04' },
    { time: '16:00', label: '4:00 PM', crowdLevel: 'High', color: '#dc2626' }];














function CommonUserFlow() {
    var _useAppContext = (0, _AppContext.useAppContext)(), state = _useAppContext.state, setState = _useAppContext.setState, calculateOptimalTime = _useAppContext.calculateOptimalTime;
    var t = (0, _useTranslation.useTranslation)().t;
    var _useState = (0, _react.useState)('form'), _useState2 = (0, _slicedToArray2.default)(_useState, 2), step = _useState2[0], setStep = _useState2[1];
    var _useState3 = (0, _react.useState)({
        name: state.patientInfo ? state.patientInfo.name : '',
        age: 0,
        gender: '',
        primaryDepartment: '',
        assignedDoctor: '',
        schedulingMethod: 'auto',
        timeSlot: '',
        autoTime: undefined,
        estimatedWait: 0,
        queuePosition: 0
    }), _useState4 = (0, _slicedToArray2.default)(_useState3, 2), formData = _useState4[0], setFormData = _useState4[1];



    (0, _react.useEffect)(function () {
        if (formData.primaryDepartment) {
            var optimal = calculateOptimalTime(formData.primaryDepartment, formData.assignedDoctor);
            setFormData(function (prev) {
                return Object.assign({},
                    prev, {
                    autoTime: optimal.time,
                    estimatedWait: optimal.waitTime,
                    queuePosition: optimal.position
                });
            }
            );
        }
    }, [formData.primaryDepartment, formData.assignedDoctor, calculateOptimalTime]);

    var handleBack = function handleBack() {
        if (step === 'timeSlot') setStep('scheduling'); else
            if (step === 'scheduling') setStep('form'); else
                setState(function (prev) { return Object.assign({}, prev, { currentView: 'patient-dashboard' }); });
    };

    var handleFormSubmit = function handleFormSubmit() {
        if (!formData.age || !formData.gender || !formData.primaryDepartment) {
            console.log('Please fill all required fields');
            return;
        }
        setStep('scheduling');
    };

    var generateToken = function generateToken() {
        if (!state.patientInfo) throw new Error('Patient information not available');
        var now = new Date();
        var scheduledTime;

        if (formData.schedulingMethod === 'auto' && formData.autoTime) {
            scheduledTime = formData.autoTime;
        } else {
            scheduledTime = new Date();
            var _formData$timeSlot$sp = formData.timeSlot.split(':'), _formData$timeSlot$sp2 = (0, _slicedToArray2.default)(_formData$timeSlot$sp, 2), hours = _formData$timeSlot$sp2[0], minutes = _formData$timeSlot$sp2[1];
            scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }

        var typeTokens = state.tokens.filter(function (t) { return t.type === 'common'; });
        var tokenNumber = String(typeTokens.length + 1).padStart(3, '0');
        var dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        var timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
        var tokenId = `GEN-${timeStr}-${tokenNumber}`;
        var endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        var patientId = `PAT-${dateStr}-${tokenNumber}`;
        var allDepartmentNames = state.departments.map(function (d) { return d.name; });

        return {
            id: tokenId,
            type: 'common',
            primaryDepartment: formData.primaryDepartment,
            timestamp: now,
            scheduledTime: scheduledTime,
            patient: {
                name: formData.name || state.patientInfo.name,
                email: state.patientInfo.email,
                phone: state.patientInfo.phone,
                age: formData.age,
                gender: formData.gender,
                patientId: patientId
            },
            status: 'active',
            priority: 1,
            qrCode: tokenId,
            validUntil: endOfDay,
            createdAt: now,
            schedulingMethod: formData.schedulingMethod,
            estimatedWaitTime: formData.estimatedWait,
            positionInQueue: formData.queuePosition,
            visits: [],
            prescriptions: [],
            labTests: [],
            departmentAccess: allDepartmentNames
        };
    };

    var handleTokenGeneration = function handleTokenGeneration() {
        if (formData.schedulingMethod === 'manual' && !formData.timeSlot) {
            return;
        }
        try {
            var newToken = generateToken();
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
    };

    if (!state.patientInfo) return null;

    var selectedDepartment = state.departments.find(function (d) { return d.name === formData.primaryDepartment; });
    var availableDoctors = (selectedDepartment == null ? void 0 : selectedDepartment.doctors.filter(function (d) { return d.status === 'available'; })) || [];
    var consultationDepartments = state.departments.filter(function (d) { return d.type === 'consultation'; });

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
            contentContainerStyle: styles.container, children: [/*#__PURE__*/
                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: styles.cardSpacing, children:/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardHeader, {
                            style: styles.row, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_button.Button, {
                                    variant: "ghost", size: "sm", onPress: handleBack, style: { marginRight: 8 }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowLeft, { size: 20, color: "#000" })
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: { flex: 1 }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_card.CardTitle, { children: t.generalConsultation }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_card.CardDescription, { children: t.multiDeptTokenGen })]
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_badge.Badge, { variant: "outline", children:/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, { children: [t.stepLbl, step === 'form' ? '1' : step === 'scheduling' ? '2' : '3', t.of3Lbl] }) })]
                        }
                        )
                }
                ),/*#__PURE__*/


                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: [styles.cardSpacing, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }], children:/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { paddingTop: 16, flexDirection: 'row', alignItems: 'center' }, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_lucideReactNative.CheckCircle, { size: 20, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: { fontWeight: '600', color: '#1e40af' }, children: [t.patientLbl, state.patientInfo.name] }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: { fontSize: 13, color: '#1d4ed8' }, children: [state.patientInfo.email, " \u2022 ", state.patientInfo.phone] })]
                                }
                                )]
                        }
                        )
                }
                ),

                step === 'form' &&/*#__PURE__*/
                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.cardSpacing, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_card.CardTitle, {
                                    style: { flexDirection: 'row', alignItems: 'center' }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.User, { size: 20, style: { marginRight: 8 } }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { children: t.medicalInfo })]
                                }
                                )
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { gap: 16 }, children: [/*#__PURE__*/
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
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: t.ageLbl }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_input.Input, {
                                            keyboardType: "numeric",
                                            value: formData.age ? String(formData.age) : '',
                                            onChangeText: function onChangeText(val) { return setFormData(Object.assign({}, formData, { age: parseInt(val) || 0 })); },
                                            placeholder: t.enterAge
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: t.genderLbl }),/*#__PURE__*/
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
                                        (0, _jsxRuntime.jsx)(_label.Label, { children: t.primaryDepartment }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_select.Select, {
                                            value: formData.primaryDepartment, onValueChange: function onValueChange(val) { return setFormData(Object.assign({}, formData, { primaryDepartment: val, assignedDoctor: '' })); }, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_select.SelectTrigger, {
                                                    style: { marginTop: 8 }, children:/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_select.SelectValue, { placeholder: t.selectPrimaryDept })
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
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '600', marginBottom: 8 }, children: t.availableDoctors }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.TouchableOpacity, {
                                            style: [styles.docItem, !formData.assignedDoctor && styles.docSelected],
                                            onPress: function onPress() { return setFormData(Object.assign({}, formData, { assignedDoctor: '' })); }, children: [/*#__PURE__*/

                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Users, { size: 16, color: "#4b5563", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { children: t.anyAvailableDoc })]
                                        }
                                        ),
                                        availableDoctors.map(function (doc) {
                                            return (/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {

                                                    style: [styles.docItem, formData.assignedDoctor === doc.id && styles.docSelected],
                                                    onPress: function onPress() { return setFormData(Object.assign({}, formData, { assignedDoctor: doc.id })); }, children:/*#__PURE__*/

                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: styles.rowBetween, children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                                    style: styles.row, children: [/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Activity, { size: 16, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                                            children: [/*#__PURE__*/
                                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '500' }, children: doc.name }),/*#__PURE__*/
                                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 12, color: '#6b7280' }, children: doc.specialization })]
                                                                        }
                                                                        )]
                                                                }
                                                                ),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: { fontSize: 12, color: '#6b7280' }, children: [doc.experience, t.yExp] })]
                                                        }
                                                        )
                                                }, doc.id
                                                ));
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/


                                (0, _jsxRuntime.jsx)(_button.Button, {
                                    onPress: handleFormSubmit, style: { marginTop: 4 }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: 15 }, children: t.continueScheduling })
                                }
                                )]
                        }
                        )]
                }
                ),


                step === 'scheduling' &&/*#__PURE__*/
                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.cardSpacing, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            children:/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_card.CardTitle, { children: t.schedulingMethod })
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { gap: 16 }, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                    onPress: function onPress() { setFormData(Object.assign({}, formData, { schedulingMethod: 'auto' })); setTimeout(handleTokenGeneration, 500); }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_card.Card, {
                                            style: [styles.methodCard, { borderLeftColor: '#16a34a' }], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_card.CardContent, {
                                                    style: styles.row, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Zap, { size: 24, color: "#16a34a", style: { marginRight: 16 } }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: { flex: 1 }, children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: 'bold', color: '#166534' }, children: t.autoScheduling }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 12, color: '#6b7280' }, children: t.autoDesc })]
                                                        }
                                                        )]
                                                }
                                                )
                                        }
                                        )
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                    onPress: function onPress() { setFormData(Object.assign({}, formData, { schedulingMethod: 'manual' })); setStep('timeSlot'); }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_card.Card, {
                                            style: [styles.methodCard, { borderLeftColor: '#2563eb' }], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_card.CardContent, {
                                                    style: styles.row, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Clock, { size: 24, color: "#2563eb", style: { marginRight: 16 } }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: { flex: 1 }, children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: 'bold', color: '#1e40af' }, children: t.manualScheduling }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 12, color: '#6b7280' }, children: t.manualDesc })]
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
                ),


                step === 'timeSlot' &&/*#__PURE__*/
                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.cardSpacing, children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, { children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_card.CardTitle, { children: t.timeSlotSelection }) }),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            style: { gap: 12 }, children: [
                                manualTimeSlots.map(function (slot) {
                                    return (/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {

                                            onPress: function onPress() { return setFormData(Object.assign({}, formData, { timeSlot: slot.time })); },
                                            style: [styles.slotItem, formData.timeSlot === slot.time && styles.slotSelected], children:/*#__PURE__*/

                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.rowBetween, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: styles.row, children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Calendar, { size: 16, color: "#6b7280", style: { marginRight: 8 } }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: '500' }, children: slot.label })]
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_badge.Badge, { style: { backgroundColor: slot.color }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff', fontSize: 10 }, children: slot.crowdLevel }) })]
                                                }
                                                )
                                        }, slot.time
                                        ));
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_button.Button, {
                                    onPress: handleTokenGeneration, disabled: !formData.timeSlot, style: { marginTop: 16 }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { color: '#fff' }, children: t.bookAppointment })
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
    container: { padding: 24, paddingBottom: 40, backgroundColor: '#f0fdfa', flexGrow: 1 },// background and padding
    cardSpacing: { marginBottom: 20 },// more spacing
    row: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    doctorBox: { backgroundColor: '#ffffff', padding: 16, borderRadius: 16, marginTop: 20, borderWidth: 1, borderColor: '#e0f2fe' },// white box, softer border
    docItem: { padding: 16, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e0f2fe', marginBottom: 12, flexDirection: 'row', alignItems: 'center' },// softer borders and larger radii
    docSelected: { borderColor: '#0ea5e9', backgroundColor: '#e0f2fe', borderWidth: 2 },// teal selection
    methodCard: { borderLeftWidth: 6, marginBottom: 20, borderRadius: 16 },// thicker border, rounder
    slotItem: { padding: 20, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e0f2fe' },// larger, rounder
    slotSelected: { borderColor: '#0ea5e9', backgroundColor: '#f0fdfa', borderWidth: 2 },// softer teal selection
    radioGroup: { flexDirection: 'row', gap: 20, marginTop: 12 },// more gap
    radioOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    radioText: { fontSize: 16, color: '#475569', fontWeight: '500' }// softer gray, slightly bolder
});
