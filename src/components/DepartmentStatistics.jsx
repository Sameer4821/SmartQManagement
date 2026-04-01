var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.DepartmentStatistics = DepartmentStatistics; var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")); var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _AppContext = require("../context/AppContext");

var _card = require("./ui/card");
var _badge = require("./ui/badge");
var _lucideReactNative = require("lucide-react-native"); var _jsxRuntime = require("react/jsx-runtime");





var _useTranslation = require("../hooks/useTranslation");

function DepartmentStatistics(_ref) {
    var onBack = _ref.onBack;
    var _useAppContext = require("../context/AppContext").useAppContext(), state = _useAppContext.state;
    var t = (0, _useTranslation.useTranslation)().t;

    var getDepartmentColor = function getDepartmentColor(type) {
        switch (type) {
            case 'consultation': return '#2563eb';
            case 'diagnostic': return '#16a34a';
            case 'pharmacy': return '#9333ea';
            case 'administrative': return '#4b5563';
            default: return '#2563eb';
        }
    };

    var getSpecializations = function getSpecializations() {
        var allSpecializations = state.departments.flatMap(function (dept) {
            return (
                dept.doctors.map(function (doc) { return doc.specialization; }));
        }
        );
        return (0, _toConsumableArray2.default)(new Set(allSpecializations));
    };

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
            style: styles.container, contentContainerStyle: styles.content, children: [/*#__PURE__*/

                (0, _jsxRuntime.jsx)(_card.Card, {
                    style: styles.cardSpacing, children:/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.row, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                            onPress: onBack, style: { marginRight: 12, padding: 4 }, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.ArrowLeft, { size: 20, color: "#374151" })
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: { flex: 1 }, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.headerTitle, children: t("dsTitle") }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.headerSubtitle, children: t("dsSubtitle") })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowCentered, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Building, { size: 20, color: "#2563eb", style: { marginRight: 4 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.headerBadgeText, children: "Gov Hospital" })]
                                        }
                                        )]
                                }
                                )
                        }
                        )
                }
                ),/*#__PURE__*/


                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: [styles.cardSpacing, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }], children: [/*#__PURE__*/
                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.rowCentered, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Building, { size: 20, color: "#1d4ed8", style: { marginRight: 8 } }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_card.CardTitle, { style: { color: '#1d4ed8', fontSize: 16 }, children: t("dsHospitalInfo") })]
                                }
                                )
                        }
                        ),/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.CardContent, {
                            children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: { marginBottom: 16 }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowCentered, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.MapPin, { size: 16, color: "#2563eb", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.subHeading, children: t("dsLocation") })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.mutedText, children: t("dsGenName") }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.mutedText, children: t("dsGenAddress") })]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: { marginBottom: 16 }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowCentered, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Phone, { size: 16, color: "#16a34a", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.subHeading, children: t("dsContact") })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: [styles.rowCentered, { marginBottom: 4 }], children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Phone, { size: 14, color: "#6b7280", style: { marginRight: 4 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: styles.mutedText, children: ["General: ", t("dsGenPhone")] })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: [styles.rowCentered, { marginBottom: 4 }], children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Phone, { size: 14, color: "#dc2626", style: { marginRight: 4 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: [styles.mutedText, { color: '#dc2626' }], children: ["Emergency: ", t("dsGenEmergency")] })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowCentered, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Mail, { size: 14, color: "#6b7280", style: { marginRight: 4 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.mutedText, children: t("dsGenEmail") })]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: { marginBottom: 16 }, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowCentered, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Calendar, { size: 16, color: "#ea580c", style: { marginRight: 8 } }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.subHeading, children: t("dsOperatingHours") })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowBetween, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.mutedText, children: "General Services:" }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_badge.Badge, { variant: "outline", children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 10 }, children: t("dsBusinessHours") }) })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: [styles.rowBetween, { marginTop: 4 }], children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.mutedText, children: "Emergency Services:" }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_badge.Badge, { style: { backgroundColor: '#dc2626' }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 10, color: '#fff' }, children: t("dsHours24x7") }) })]
                                        }
                                        )]
                                }
                                ),/*#__PURE__*/


                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.statsGrid, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.statBox, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.statNum, children: state.departments.length }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.statLabel, children: t("dsDepartments") })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.statBox, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.statNum, children: state.departments.reduce(function (sum, dept) { return sum + dept.doctors.length; }, 0) }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.statLabel, children: t("dsTotalStaff") })]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.statBox, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.statNum, children: getSpecializations().length }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.statLabel, children: t("dsSpecializations") })]
                                        }
                                        )]
                                }
                                )]
                        }
                        )]
                }
                ),


                state.departments.map(function (dept) {
                    var color = getDepartmentColor(dept.type);

                    return (/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_card.Card, {
                            style: [styles.cardSpacing, { borderLeftWidth: 4, borderLeftColor: color }], children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_card.CardHeader, {
                                    style: { paddingBottom: 12 }, children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.rowBetween, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: styles.rowCentered, children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Stethoscope, { size: 20, color: color, style: { marginRight: 8 } }),/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.deptTitle, { color: color }], children: dept.name })]
                                                        }
                                                        ),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_badge.Badge, {
                                                            variant: "outline", style: { borderColor: color, alignSelf: 'flex-start', marginTop: 4 }, children:/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, {
                                                                    style: { fontSize: 10, color: color }, children:
                                                                        t("dsDepartmentTypes")[dept.type] || dept.type
                                                                }
                                                                )
                                                        }
                                                        )]
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: [styles.rowCentered, { alignItems: 'flex-start' }], children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Users, { size: 16, color: color, style: { marginRight: 4, marginTop: 2 } }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.Text, {
                                                            style: { fontSize: 12, color: '#6b7280' }, children: [
                                                                dept.doctors.length, " ", dept.doctors.length === 1 ? 'Doctor' : 'Doctors']
                                                        }
                                                        )]
                                                }
                                                )]
                                        }
                                        )
                                }
                                ),/*#__PURE__*/

                                (0, _jsxRuntime.jsxs)(_card.CardContent, {
                                    children: [/*#__PURE__*/

                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: { marginBottom: 16 }, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: styles.subHeading, children: [t("dsServices"), ":"] }),/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                                    style: styles.tagsContainer, children:
                                                        dept.services.map(function (service, index) {
                                                            return (/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                                                    style: styles.tag, children:/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.tagText, children: service })
                                                                }, index
                                                                ));
                                                        }
                                                        )
                                                }
                                                )]
                                        }
                                        ),/*#__PURE__*/


                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.rowCentered, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.UserCheck, { size: 16, color: "#374151", style: { marginRight: 8, marginBottom: 8 } }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.Text, {
                                                            style: [styles.subHeading, { marginBottom: 8 }], children: [
                                                                t("dsAvailableDoctors"), " (", dept.doctors.length, ")"]
                                                        }
                                                        )]
                                                }
                                                ),

                                                dept.doctors.map(function (doctor) {
                                                    return (/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                                            style: styles.doctorCard, children:/*#__PURE__*/
                                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                                    style: styles.rowBetween, children: [/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                                            style: styles.rowCentered, children: [/*#__PURE__*/
                                                                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                                                                    style: [styles.doctorIconBox, { backgroundColor: `${color}20` }], children:/*#__PURE__*/
                                                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.UserCheck, { size: 20, color: color })
                                                                                }
                                                                                ),/*#__PURE__*/
                                                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                                                    style: { marginLeft: 12 }, children: [/*#__PURE__*/
                                                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.doctorName, children: doctor.name }),/*#__PURE__*/
                                                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.doctorSpec, children: doctor.specialization }),/*#__PURE__*/
                                                                                        (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: styles.doctorExp, children: [doctor.experience, " ", t("dsExperience")] })]
                                                                                }
                                                                                )]
                                                                        }
                                                                        ),/*#__PURE__*/

                                                                        (0, _jsxRuntime.jsx)(_badge.Badge, {
                                                                            variant: doctor.status === 'available' ? 'default' : doctor.status === 'busy' ? 'secondary' : 'destructive', children:/*#__PURE__*/

                                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, {
                                                                                    style: { fontSize: 10, color: doctor.status === 'available' ? '#fff' : doctor.status === 'busy' ? '#4b5563' : '#fff' }, children:
                                                                                        t("dsDoctorStatus")[doctor.status] || doctor.status
                                                                                }
                                                                                )
                                                                        }
                                                                        )]
                                                                }
                                                                )
                                                        }, doctor.id
                                                        ));
                                                }
                                                )]
                                        }
                                        )]
                                }
                                )]
                        }, dept.name
                        ));

                })]
        }
        ));

}

var styles = _reactNative.StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    content: { padding: 16, paddingBottom: 32 },
    cardSpacing: { marginBottom: 16 },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowCentered: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
    headerSubtitle: { fontSize: 13, color: '#6b7280' },
    headerBadgeText: { fontSize: 12, fontWeight: '600', color: '#2563eb' },
    subHeading: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
    mutedText: { fontSize: 13, color: '#4b5563' },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#d1d5db', paddingTop: 16, marginTop: 8 },
    statBox: { alignItems: 'center', flex: 1 },
    statNum: { fontSize: 24, fontWeight: 'bold', color: '#1d4ed8' },
    statLabel: { fontSize: 12, color: '#6b7280', textAlign: 'center' },
    deptTitle: { fontSize: 18, fontWeight: 'bold' },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    tagText: { fontSize: 11, color: '#374151' },
    doctorCard: { backgroundColor: '#f9fafb', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
    doctorIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    doctorName: { fontSize: 14, fontWeight: '600', color: '#111827' },
    doctorSpec: { fontSize: 12, color: '#4b5563' },
    doctorExp: { fontSize: 11, color: '#6b7280' }
});
