var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var _toConsumableArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/toConsumableArray"),
);
var _asyncToGenerator2 = _interopRequireDefault(
  require("@babel/runtime/helpers/asyncToGenerator"),
);
var _slicedToArray2 = _interopRequireDefault(
  require("@babel/runtime/helpers/slicedToArray"),
);
var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _AppContext = require("./context/AppContext");

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
var _asyncStorage = _interopRequireDefault(
  require("@react-native-async-storage/async-storage"),
);
var _AuthContext = require("./contexts/AuthContext");
var _AuthRouter = require("./components/auth/AuthRouter");
var _PatientPortal = require("./components/PatientPortal");
var _PatientRegistrationScreen = require("./screens/PatientRegistrationScreen");
var _OTPVerificationScreen = require("./screens/OTPVerificationScreen");
var _StaffLoginScreen = require("./screens/StaffLoginScreen");
var _MedicalServicesDashboard = require("./screens/MedicalServicesDashboard");
var _CommonUserFlow = require("./components/CommonUserFlow");
var _EmergencyUserFlow = require("./components/EmergencyUserFlow");
var _DisabledUserFlow = require("./components/DisabledUserFlow");
var _TokenDisplay = require("./components/TokenDisplay");
var _ConsultationCompleted = require("./components/ConsultationCompleted");
var _AgenticChatbot = require("./components/AgenticChatbot");
var _StaffDashboard = require("./screens/StaffDashboard");
var _supabaseClient = require("./services/supabaseClient");

var _sonnerNative = require("sonner-native");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) {
  if ("function" == typeof WeakMap)
    var r = new WeakMap(),
      n = new WeakMap();
  return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
    if (!t && e && e.__esModule) return e;
    var o,
      i,
      f = { __proto__: null, default: e };
    if (null === e || ("object" != typeof e && "function" != typeof e))
      return f;
    if ((o = t ? n : r)) {
      if (o.has(e)) return o.get(e);
      o.set(e, f);
    }
    for (var _t in e)
      "default" !== _t &&
        {}.hasOwnProperty.call(e, _t) &&
        ((i =
          (o = Object.defineProperty) &&
          Object.getOwnPropertyDescriptor(e, _t)) &&
        (i.get || i.set)
          ? o(f, _t, i)
          : (f[_t] = e[_t]));
    return f;
  })(e, t);
}

// Helper function to get all department names
var getAllDepartmentNames = function getAllDepartmentNames() {
  return _AppContext.initialDepartments.map(function (dept) {
    return dept.name;
  });
};

// Helper function to deserialize tokens and convert string dates back to Date objects
var deserializeTokens = function deserializeTokens(tokensJson) {
  try {
    var tokens = JSON.parse(tokensJson);
    var allDepartments = getAllDepartmentNames();

    return tokens.map(function (token) {
      var _token$visits,
        _token$prescriptions,
        _token$labTests,
        _token$patient,
        _token$patient2,
        _token$patient3,
        _token$patient4,
        _token$patient5,
        _token$patient6;
      return Object.assign({}, token, {
        timestamp: new Date(token.timestamp),
        scheduledTime: token.scheduledTime
          ? new Date(token.scheduledTime)
          : undefined,
        validUntil: new Date(token.validUntil),
        createdAt: token.createdAt
          ? new Date(token.createdAt)
          : new Date(token.timestamp),
        visits:
          ((_token$visits = token.visits) == null
            ? void 0
            : _token$visits.map(function (visit) {
                var _visit$prescriptions, _visit$labTests;
                return Object.assign({}, visit, {
                  timestamp: new Date(visit.timestamp),
                  prescriptions:
                    ((_visit$prescriptions = visit.prescriptions) == null
                      ? void 0
                      : _visit$prescriptions.map(function (p) {
                          return Object.assign({}, p, {
                            prescribedAt: new Date(p.prescribedAt),
                          });
                        })) || [],
                  labTests:
                    ((_visit$labTests = visit.labTests) == null
                      ? void 0
                      : _visit$labTests.map(function (l) {
                          return Object.assign({}, l, {
                            orderedAt: new Date(l.orderedAt),
                            scheduledAt: l.scheduledAt
                              ? new Date(l.scheduledAt)
                              : undefined,
                            completedAt: l.completedAt
                              ? new Date(l.completedAt)
                              : undefined,
                          });
                        })) || [],
                });
              })) || [],
        prescriptions:
          ((_token$prescriptions = token.prescriptions) == null
            ? void 0
            : _token$prescriptions.map(function (p) {
                return Object.assign({}, p, {
                  prescribedAt: new Date(p.prescribedAt),
                });
              })) || [],
        labTests:
          ((_token$labTests = token.labTests) == null
            ? void 0
            : _token$labTests.map(function (l) {
                return Object.assign({}, l, {
                  orderedAt: new Date(l.orderedAt),
                  scheduledAt: l.scheduledAt
                    ? new Date(l.scheduledAt)
                    : undefined,
                  completedAt: l.completedAt
                    ? new Date(l.completedAt)
                    : undefined,
                });
              })) || [],
        // Ensure departmentAccess exists and has all departments if missing
        departmentAccess: token.departmentAccess || allDepartments,
        // Ensure patient has required fields
        patient: {
          name:
            ((_token$patient = token.patient) == null
              ? void 0
              : _token$patient.name) || "Unknown Patient",
          email:
            ((_token$patient2 = token.patient) == null
              ? void 0
              : _token$patient2.email) || "",
          phone:
            ((_token$patient3 = token.patient) == null
              ? void 0
              : _token$patient3.phone) || "",
          age:
            ((_token$patient4 = token.patient) == null
              ? void 0
              : _token$patient4.age) || 0,
          gender:
            ((_token$patient5 = token.patient) == null
              ? void 0
              : _token$patient5.gender) || "not specified",
          patientId:
            ((_token$patient6 = token.patient) == null
              ? void 0
              : _token$patient6.patientId) || `PAT-${Date.now()}`,
        },
      });
    });
  } catch (error) {
    console.error("Error deserializing tokens:", error);
    return [];
  }
};

// Helper function to serialize tokens for localStorage
var serializeTokens = function serializeTokens(tokens) {
  try {
    return JSON.stringify(tokens);
  } catch (error) {
    console.error("Error serializing tokens:", error);
    return "[]";
  }
};

function AppContent() {
  var _useAuth = (0, _AuthContext.useAuth)(),
    user = _useAuth.user,
    authLoading = _useAuth.loading;
  var _useState = (0, _react.useState)(_AppContext.initialState),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    authCompleted = _useState4[0],
    setAuthCompleted = _useState4[1];

  // Load data from AsyncStorage on mount
  (0, _react.useEffect)(function () {
    var loadData = /*#__PURE__*/ (function () {
      var _ref = (0, _asyncToGenerator2.default)(function* () {
        var savedTokens =
          yield _asyncStorage.default.getItem("hospital-tokens");
        var savedEmergencyCount = yield _asyncStorage.default.getItem(
          "emergency-count-" + new Date().toDateString(),
        );

        if (savedTokens) {
          try {
            var tokens = deserializeTokens(savedTokens);
            setState(function (prev) {
              return Object.assign({}, prev, { tokens: tokens });
            });
          } catch (error) {
            console.error("Error loading tokens:", error);
            yield _asyncStorage.default.removeItem("hospital-tokens");
          }
        }

        if (savedEmergencyCount) {
          setState(function (prev) {
            return Object.assign({}, prev, {
              emergencyCount: parseInt(savedEmergencyCount),
            });
          });
        }
      });
      return function loadData() {
        return _ref.apply(this, arguments);
      };
    })();
    loadData();
    
    // Initial fetch from Supabase queue table to populate active non-completed queues for everyone
    var initQueue = /*#__PURE__*/ (function () {
      var _refQ = (0, _asyncToGenerator2.default)(function* () {
         var _yield$supabase$from = yield _supabaseClient.supabase.from('queue').select('*').neq('status', 'completed').order('created_at', { ascending: true }), data = _yield$supabase$from.data, error = _yield$supabase$from.error;
         if (!error && data) {
             setState(function(prev) {
                 var updatedTokens = (0, _toConsumableArray2.default)(prev.tokens);
                 data.forEach(function(row) {
                     var exists = updatedTokens.find(function(t) { return t.id === row.token_id; });
                     if (!exists) {
                         // Build a rich local token object mapped from the flat SQL row
                         updatedTokens.push({
                            id: row.token_id,
                            type: 'common',
                            primaryDepartment: row.department,
                            status: 'active', // 'active' corresponds to 'waiting' or 'called' mostly in this app
                            timestamp: new Date(row.created_at),
                            validUntil: new Date(new Date(row.created_at).getTime() + 24 * 3600000),
                            departmentAccess: [row.department],
                            patient: {
                                name: row.patient_name,
                                email: '',
                                phone: '',
                                age: 0,
                                gender: 'not specified',
                                patientId: `PAT-${Date.now()}`
                            },
                            visits: [],
                            prescriptions: [],
                            labTests: []
                         });
                     } else {
                         // Update status if it changed via real-time logic while app was partially unloaded
                         if (row.status === 'completed' || row.status === 'called') {
                             exists.status = row.status === 'completed' ? 'completed' : 'active';
                             if (!exists.visits) exists.visits = [];
                         }
                     }
                 });
                 return Object.assign({}, prev, { tokens: updatedTokens });
             });
         }
      });
      return function initQueue() { return _refQ.apply(this, arguments); };
    })();
    initQueue();
    
    // Subscribe to real-time events on the 'queue' table
    var queueSubscription = _supabaseClient.supabase.channel('public:queue')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'queue' }, function(payload) {
            if (payload.eventType === 'INSERT') {
                setState(function(prev) {
                    var exists = prev.tokens.find(function(t) { return t.id === payload.new.token_id; });
                    if (exists) return prev; // If current device made the token, it's already richly populated locally
                    
                    var newRichToken = {
                        id: payload.new.token_id,
                        type: 'common',
                        primaryDepartment: payload.new.department,
                        status: 'active',
                        timestamp: new Date(payload.new.created_at),
                        validUntil: new Date(new Date().getTime() + 24 * 3600000),
                        departmentAccess: [payload.new.department],
                        patient: {
                            name: payload.new.patient_name,
                            email: '', phone: '', age: 0, gender: 'not specified', patientId: `PAT-${Date.now()}`
                        },
                        visits: [], prescriptions: [], labTests: []
                    };
                    return Object.assign({}, prev, { tokens: [].concat((0, _toConsumableArray2.default)(prev.tokens), [newRichToken]) });
                });
            } else if (payload.eventType === 'UPDATE') {
                setState(function(prev) {
                    return Object.assign({}, prev, { tokens: prev.tokens.map(function(t) {
                        return t.id === payload.new.token_id 
                            ? Object.assign({}, t, { status: payload.new.status === 'completed' ? 'completed' : 'active' })
                            : t;
                    })});
                });
            }
        }).subscribe();
        
    return function() {
        _supabaseClient.supabase.removeChannel(queueSubscription);
    };
  }, []);

  // Sync patient info from authenticated user
  (0, _react.useEffect)(
    function () {
      var syncInfo = /*#__PURE__*/ (function () {
        var _ref2 = (0, _asyncToGenerator2.default)(function* () {
          if (user && !authLoading) {
            var _user$user_metadata, _user$email, _user$user_metadata2;
            var patientInfo = {
              name:
                ((_user$user_metadata = user.user_metadata) == null
                  ? void 0
                  : _user$user_metadata.name) ||
                ((_user$email = user.email) == null
                  ? void 0
                  : _user$email.split("@")[0]) ||
                "Patient",
              email: user.email || "",
              phone:
                ((_user$user_metadata2 = user.user_metadata) == null
                  ? void 0
                  : _user$user_metadata2.phone) || "",
            };

            yield _asyncStorage.default.setItem(
              "current-patient-info",
              JSON.stringify(patientInfo),
            );
            setState(function (prev) {
              return Object.assign({}, prev, {
                patientInfo: patientInfo,
              });
            });
          } else if (!user && !authLoading) {
            yield _asyncStorage.default.removeItem("current-patient-info");
            setState(function (prev) {
              return Object.assign({}, prev, {
                patientInfo: null,
                currentView: "portal",
              });
            });
          }
        });
        return function syncInfo() {
          return _ref2.apply(this, arguments);
        };
      })();
      syncInfo();
    },
    [user, authLoading],
  );

  // Save tokens to AsyncStorage whenever they change
  (0, _react.useEffect)(
    function () {
      var saveTokens = /*#__PURE__*/ (function () {
        var _ref3 = (0, _asyncToGenerator2.default)(function* () {
          if (state.tokens.length > 0) {
            try {
              var serializedTokens = serializeTokens(state.tokens);
              yield _asyncStorage.default.setItem(
                "hospital-tokens",
                serializedTokens,
              );
            } catch (error) {
              console.error("Error saving tokens:", error);
            }
          }
        });
        return function saveTokens() {
          return _ref3.apply(this, arguments);
        };
      })();
      saveTokens();
    },
    [state.tokens],
  );

  // Save emergency count daily
  (0, _react.useEffect)(
    function () {
      _asyncStorage.default
        .setItem(
          "emergency-count-" + new Date().toDateString(),
          state.emergencyCount.toString(),
        )
        .catch(console.error);
    },
    [state.emergencyCount],
  );

  // Save patient info
  (0, _react.useEffect)(
    function () {
      var saveInfo = /*#__PURE__*/ (function () {
        var _ref4 = (0, _asyncToGenerator2.default)(function* () {
          if (state.patientInfo) {
            try {
              yield _asyncStorage.default.setItem(
                "current-patient-info",
                JSON.stringify(state.patientInfo),
              );
            } catch (error) {
              console.error("Error saving patient info:", error);
            }
          }
        });
        return function saveInfo() {
          return _ref4.apply(this, arguments);
        };
      })();
      saveInfo();
    },
    [state.patientInfo],
  );

  // Apply theme changes
  (0, _react.useEffect)(
    function () {
      // In React Native, pass theme preference to components instead
    },
    [state.theme],
  );
  // Auto-clear old notifications
  (0, _react.useEffect)(function () {
    var interval = setInterval(function () {
      setState(function (prev) {
        return Object.assign({}, prev, {
          notifications: prev.notifications.filter(function (notif) {
            return Date.now() - notif.timestamp.getTime() < 30000;
          }),
        });
      });
    }, 5000);

    return function () {
      return clearInterval(interval);
    };
  }, []);

  var sendEmergencyNotification = function sendEmergencyNotification(
    department,
  ) {
    var affectedTokens = state.tokens.filter(function (token) {
      return (
        token.primaryDepartment === department &&
        token.type === "common" &&
        token.status === "active"
      );
    });

    if (affectedTokens.length > 0) {
      var notification = {
        message: `Emergency case registered in ${department}. Expected delay: 15-20 minutes. Thank you for your patience.`,
        type: "emergency",
        department: department,
      };

      addNotification(notification);

      _sonnerNative.toast.error(`🚨 Emergency Alert - ${department}`, {
        description: `Expected delay: 15-20 minutes for ${affectedTokens.length} waiting patients`,
        duration: 8000,
      });
    }
  };

  var addNotification = function addNotification(notification) {
    var newNotification = Object.assign({}, notification, {
      id: Date.now().toString(),
      timestamp: new Date(),
    });

    setState(function (prev) {
      return Object.assign({}, prev, {
        notifications: [].concat(
          (0, _toConsumableArray2.default)(prev.notifications),
          [newNotification],
        ),
      });
    });
  };

  var calculateOptimalTime = function calculateOptimalTime(
    department,
    assignedDoctor,
  ) {
    var dept = state.departments.find(function (d) {
      return d.name === department;
    });
    if (!dept) return { time: new Date(), waitTime: 0, position: 0 };

    var now = new Date();
    var currentHour = now.getHours();

    var departmentTokens = state.tokens.filter(function (t) {
      return t.primaryDepartment === department && t.status === "active";
    });

    var waitTimeMinutes = dept.averageWaitTime;
    var queuePosition = departmentTokens.length + 1;

    if (assignedDoctor) {
      var doctor = dept.doctors.find(function (d) {
        return d.id === assignedDoctor;
      });
      if (doctor && doctor.status === "available") {
        var doctorTokens = departmentTokens.filter(function (t) {
          return t.visits.some(function (v) {
            return v.doctorId === assignedDoctor && v.status !== "completed";
          });
        });
        queuePosition = doctorTokens.length + 1;
        waitTimeMinutes = Math.ceil(
          (doctorTokens.length * dept.averageWaitTime) / dept.doctors.length,
        );
      }
    }

    if (currentHour >= 10 && currentHour <= 12) {
      waitTimeMinutes *= 1.5;
    } else if (currentHour >= 14 && currentHour <= 16) {
      waitTimeMinutes *= 1.3;
    }

    var optimalTime = new Date(now.getTime() + waitTimeMinutes * 60000);
    var minutes = optimalTime.getMinutes();
    var roundedMinutes = Math.ceil(minutes / 15) * 15;
    optimalTime.setMinutes(roundedMinutes, 0, 0);

    return {
      time: optimalTime,
      waitTime: Math.round(waitTimeMinutes),
      position: queuePosition,
    };
  };

  var addVisitToToken = function addVisitToToken(tokenId, visit) {
    var newVisit = Object.assign({}, visit, {
      id: `visit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    setState(function (prev) {
      return Object.assign({}, prev, {
        tokens: prev.tokens.map(function (token) {
          return token.id === tokenId
            ? Object.assign(
                {},

                token,
                {
                  visits: [].concat(
                    (0, _toConsumableArray2.default)(token.visits || []),
                    [newVisit],
                  ),
                },
              )
            : token;
        }),
      });
    });
  };

  var addPrescriptionToToken = function addPrescriptionToToken(
    tokenId,
    prescription,
  ) {
    var newPrescription = Object.assign({}, prescription, {
      id: `prescription-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    setState(function (prev) {
      return Object.assign({}, prev, {
        tokens: prev.tokens.map(function (token) {
          return token.id === tokenId
            ? Object.assign(
                {},

                token,
                {
                  prescriptions: [].concat(
                    (0, _toConsumableArray2.default)(token.prescriptions || []),
                    [newPrescription],
                  ),
                },
              )
            : token;
        }),
      });
    });
  };

  var addLabTestToToken = function addLabTestToToken(tokenId, labTest) {
    var newLabTest = Object.assign({}, labTest, {
      id: `lab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    setState(function (prev) {
      return Object.assign({}, prev, {
        tokens: prev.tokens.map(function (token) {
          return token.id === tokenId
            ? Object.assign(
                {},

                token,
                {
                  labTests: [].concat(
                    (0, _toConsumableArray2.default)(token.labTests || []),
                    [newLabTest],
                  ),
                },
              )
            : token;
        }),
      });
    });
  };

  var completeConsultation = function completeConsultation(consultationData) {
    setState(function (prev) {
      return Object.assign({}, prev, {
        consultationData: consultationData,
        currentView: "consultation-completed",
      });
    });
  };

  var setAIRecommendation = function setAIRecommendation(recommendation) {
    setState(function (prev) {
      return Object.assign({}, prev, {
        aiRecommendation: recommendation,
      });
    });
  };

  var renderCurrentView = function renderCurrentView() {
    switch (state.currentView) {
      case "portal":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _PatientPortal.PatientPortal,
          {},
        );
      case "patient-details":
      case "patient-registration":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _PatientRegistrationScreen.PatientRegistrationScreen,
          {},
        );
      case "otp-verification":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _OTPVerificationScreen.OTPVerificationScreen,
          {},
        );
      case "staff-login":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _StaffLoginScreen.StaffLoginScreen,
          {},
        );
      case "staff-dashboard":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _StaffDashboard.StaffDashboard,
          {},
        );
      case "patient-dashboard":
      case "medical-services-dashboard":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _MedicalServicesDashboard.PatientDashboard,
          {},
        );
      case "common":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _CommonUserFlow.CommonUserFlow,
          {},
        );
      case "emergency":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _EmergencyUserFlow.EmergencyUserFlow,
          {},
        );
      case "disabled":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _DisabledUserFlow.DisabledUserFlow,
          {},
        );
      case "token":
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(_TokenDisplay.TokenDisplay, {
          token: state.currentToken,
        });
      case "consultation-completed":
        return state.consultationData /*#__PURE__*/
          ? (0, _jsxRuntime.jsx)(_ConsultationCompleted.ConsultationCompleted, {
              visitData: state.consultationData,
              onClose: function onClose() {
                return setState(function (prev) {
                  return Object.assign({}, prev, {
                    consultationData: undefined,
                  });
                });
              },
            }) /*#__PURE__*/
          : (0, _jsxRuntime.jsx)(
              _MedicalServicesDashboard.PatientDashboard,
              {},
            );

      default:
        return /*#__PURE__*/ (0, _jsxRuntime.jsx)(
          _PatientPortal.PatientPortal,
          {},
        );
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      /*#__PURE__*/
      (0, _jsxRuntime.jsxs)(_reactNativeSafeAreaContext.SafeAreaView, {
        style: styles.loadingContainer,
        children: [
          /*#__PURE__*/
          (0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
            size: "large",
            color: "#2563eb",
          }) /*#__PURE__*/,
          (0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: styles.loadingText,
            children: "Loading...",
          }),
        ],
      })
    );
  }

  // Show authentication screen only if specifically requested
  if (state.currentView === "auth" || state.currentView === "login") {
    return (
      /*#__PURE__*/
      (0, _jsxRuntime.jsx)(_AuthRouter.AuthRouter, {
        onAuthComplete: function onAuthComplete() {
          setAuthCompleted(true);
          // After successful auth, set patient info from user and go to dashboard
          if (user) {
            var _user$user_metadata3, _user$email2, _user$user_metadata4;
            var patientInfo = {
              name:
                ((_user$user_metadata3 = user.user_metadata) == null
                  ? void 0
                  : _user$user_metadata3.name) ||
                ((_user$email2 = user.email) == null
                  ? void 0
                  : _user$email2.split("@")[0]) ||
                "Patient",
              email: user.email || "",
              phone:
                ((_user$user_metadata4 = user.user_metadata) == null
                  ? void 0
                  : _user$user_metadata4.phone) || "",
            };
            setState(function (prev) {
              return Object.assign({}, prev, {
                patientInfo: patientInfo,
                currentView: "patient-dashboard",
                previousView: undefined,
              });
            });
          } else {
            setState(function (prev) {
              return Object.assign({}, prev, {
                currentView: "patient-dashboard",
                previousView: undefined,
              });
            });
          }
        },
      })
    );
  }

  return (
    /*#__PURE__*/
    (0, _jsxRuntime.jsx)(_AppContext.AppContext.Provider, {
      value: {
        state: state,
        setState: setState,
        sendEmergencyNotification: sendEmergencyNotification,
        addNotification: addNotification,
        calculateOptimalTime: calculateOptimalTime,
        addVisitToToken: addVisitToToken,
        addPrescriptionToToken: addPrescriptionToToken,
        addLabTestToToken: addLabTestToToken,
        completeConsultation: completeConsultation,
        setAIRecommendation: setAIRecommendation,
      },
      /*#__PURE__*/

      children: (0, _jsxRuntime.jsxs)(
        _reactNativeSafeAreaContext.SafeAreaView,
        {
          style: styles.appContainer,
          children: [
            state.notifications.length > 0 /*#__PURE__*/ &&
              (0, _jsxRuntime.jsx)(_reactNative.View, {
                style: styles.notificationPanel,
                children: state.notifications.map(function (notification) {
                  return (
                    /*#__PURE__*/
                    (0, _jsxRuntime.jsxs)(
                      _reactNative.View,
                      {
                        style: [
                          styles.notificationItem,
                          notification.type === "emergency"
                            ? styles.bgRed
                            : notification.type === "warning"
                              ? styles.bgYellow
                              : styles.bgBlue,
                        ],
                        children: [
                          /*#__PURE__*/

                          (0, _jsxRuntime.jsx)(_reactNative.Text, {
                            style: styles.notificationTitle,
                            children:
                              notification.type === "emergency"
                                ? "🚨 Emergency Alert"
                                : notification.type === "warning"
                                  ? "⚠️ Warning"
                                  : "ℹ️ Information",
                          }) /*#__PURE__*/,
                          (0, _jsxRuntime.jsx)(_reactNative.Text, {
                            style: styles.notificationMessage,
                            children: notification.message,
                          }),
                        ],
                      },
                      notification.id,
                    )
                  );
                }),
              }),

            state.currentView === "portal"
              ? renderCurrentView() /*#__PURE__*/
              : (0, _jsxRuntime.jsx)(_reactNative.View, {
                  style: styles.contentContainer,
                  children: renderCurrentView(),
                }),

            state.patientInfo &&
              /*#__PURE__*/ (0, _jsxRuntime.jsx)(
                _AgenticChatbot.AgenticChatbot,
                {},
              ) /*#__PURE__*/,
            (0, _jsxRuntime.jsx)(_sonnerNative.Toaster, {}),
          ],
        },
      ),
    })
  );
}

var styles = _reactNative.StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eff6ff",
  },
  loadingText: {
    marginTop: 16,
    color: "#4b5563",
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  notificationPanel: {
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 50,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationMessage: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  bgRed: { backgroundColor: "#ef4444" },
  bgYellow: { backgroundColor: "#eab308" },
  bgBlue: { backgroundColor: "#3b82f6" },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});

function App() {
  return (
    /*#__PURE__*/
    (0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureHandlerRootView, {
      style: { flex: 1 },
      /*#__PURE__*/
      children: (0, _jsxRuntime.jsx)(
        _reactNativeSafeAreaContext.SafeAreaProvider,
        {
          /*#__PURE__*/
          children: (0, _jsxRuntime.jsx)(_AuthContext.AuthProvider, {
            /*#__PURE__*/ children: (0, _jsxRuntime.jsx)(AppContent, {}),
          }),
        },
      ),
    })
  );
}
