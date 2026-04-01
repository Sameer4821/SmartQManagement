var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault"); Object.defineProperty(exports, "__esModule", { value: true }); exports.AgenticChatbot = AgenticChatbot; var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray")); var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")); var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray")); var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _AppContext = require("../context/AppContext");
var _button = require("./ui/button");
var _card = require("./ui/card");
var _badge = require("./ui/badge");
var _progress = require("./ui/progress");
var _lucideReactNative = require("lucide-react-native");




var _sonnerNative = require("sonner-native"); var _jsxRuntime = require("react/jsx-runtime"); function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }










































var quickActions = [
    { label: 'AI Booking', icon: '🤖', query: 'Show departments for booking' },
    { label: 'Find best doctor', icon: '👨‍⚕️', query: 'Find me the best available doctor' },
    { label: 'Shortest wait', icon: '⚡', query: 'Which department has shortest wait time?' },
    { label: 'Optimal time', icon: '⏰', query: 'When is the best time to visit?' }];


var _Dimensions$get = _reactNative.Dimensions.get('window'), height = _Dimensions$get.height;

function AgenticChatbot() {
    var _useAppContext = (0, _AppContext.useAppContext)(), state = _useAppContext.state, setState = _useAppContext.setState, calculateOptimalTime = _useAppContext.calculateOptimalTime, addNotification = _useAppContext.addNotification, setAIRecommendation = _useAppContext.setAIRecommendation;
    var _useState = (0, _react.useState)(false), _useState2 = (0, _slicedToArray2.default)(_useState, 2), isOpen = _useState2[0], setIsOpen = _useState2[1];
    var _useState3 = (0, _react.useState)([{
        id: `msg-init-${Date.now()}`,
        type: 'bot',
        message: "🤖 Agentic AI Assistant Ready\n\nI'm an intelligent agent that can:\n• 🎯 Autonomously find optimal solutions\n• 📊 Analyze real-time hospital data\n• 🧠 Make smart scheduling decisions\n• 💡 Provide recommendations\n• 🔄 Handle complex tasks\n\nWhat can I do for you?",
        timestamp: new Date(),
        suggestions: ['Find best time to visit', 'Compare departments', 'Schedule automatically']
    }]), _useState4 = (0, _slicedToArray2.default)(_useState3, 2), messages = _useState4[0], setMessages = _useState4[1];
    var _useState5 = (0, _react.useState)(''), _useState6 = (0, _slicedToArray2.default)(_useState5, 2), inputValue = _useState6[0], setInputValue = _useState6[1];
    var _useState7 = (0, _react.useState)(false), _useState8 = (0, _slicedToArray2.default)(_useState7, 2), isThinking = _useState8[0], setIsThinking = _useState8[1];
    var _useState9 = (0, _react.useState)(null), _useState0 = (0, _slicedToArray2.default)(_useState9, 2), currentTask = _useState0[0], setCurrentTask = _useState0[1];
    var _useState1 = (0, _react.useState)({ hasAllRequiredInfo: false }), _useState10 = (0, _slicedToArray2.default)(_useState1, 2), bookingData = _useState10[0], setBookingData = _useState10[1];
    var scrollViewRef = (0, _react.useRef)(null);

    var scrollToBottom = function scrollToBottom() {
        var _scrollViewRef$curren;
        (_scrollViewRef$curren = scrollViewRef.current) == null || _scrollViewRef$curren.scrollToEnd({ animated: true });
    };

    (0, _react.useEffect)(function () {
        scrollToBottom();
    }, [messages, isThinking, currentTask]);

    var extractBookingInfo = function extractBookingInfo(message, currentBookingData) {
        var lowerMessage = message.toLowerCase();
        var newBookingData = Object.assign({}, currentBookingData);

        var ageMatch = message.match(/\b(\d{1,3})\s*(years?|yrs?|y\.o\.|year old)?\b/i);
        if (ageMatch && parseInt(ageMatch[1]) >= 1 && parseInt(ageMatch[1]) <= 120) {
            newBookingData.age = parseInt(ageMatch[1]);
        }

        if (lowerMessage.includes('male') && !lowerMessage.includes('female')) newBookingData.gender = 'male'; else
            if (lowerMessage.includes('female')) newBookingData.gender = 'female'; else
                if (lowerMessage.includes('other')) newBookingData.gender = 'other';

        state.departments.forEach(function (dept) {
            if (lowerMessage.includes(dept.name.toLowerCase())) {
                newBookingData.department = dept.name;
                dept.doctors.forEach(function (doctor) {
                    var doctorNameParts = doctor.name.toLowerCase().split(' ');
                    var hasDoctorName = doctorNameParts.some(function (part) { return lowerMessage.includes(part) && part.length > 2; });
                    if (hasDoctorName) {
                        newBookingData.doctorId = doctor.id;
                        newBookingData.doctorName = doctor.name;
                    }
                });
            }
        });

        newBookingData.hasAllRequiredInfo = !!(newBookingData.age && newBookingData.gender && newBookingData.department);
        return newBookingData;
    };

    var createTokenFromBookingData = function createTokenFromBookingData(bookingInfo) {
        if (!state.patientInfo) throw new Error('Patient information not available');
        if (!bookingInfo.age || !bookingInfo.gender || !bookingInfo.department) throw new Error('Missing required booking information');

        var now = new Date();
        var optimal = calculateOptimalTime(bookingInfo.department, bookingInfo.doctorId);
        var scheduledTime = optimal.time;

        var typeTokens = state.tokens.filter(function (t) { return t.type === 'common'; });
        var tokenNumber = String(typeTokens.length + 1).padStart(3, '0');
        var dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        var timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
        var tokenId = `GEN-${timeStr}-${tokenNumber}`;

        var endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return {
            id: tokenId,
            type: 'common',
            primaryDepartment: bookingInfo.department,
            timestamp: now,
            scheduledTime: scheduledTime,
            patient: {
                name: state.patientInfo.name,
                email: state.patientInfo.email,
                phone: state.patientInfo.phone,
                age: bookingInfo.age,
                gender: bookingInfo.gender,
                patientId: `PAT-${dateStr}-${tokenNumber}`
            },
            status: 'active',
            priority: 1,
            qrCode: tokenId,
            validUntil: endOfDay,
            createdAt: now,
            schedulingMethod: 'auto',
            estimatedWaitTime: optimal.waitTime,
            positionInQueue: optimal.position,
            visits: [],
            prescriptions: [],
            labTests: [],
            departmentAccess: state.departments.map(function (d) { return d.name; })
        };
    };

    var executeAgentTask =/*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)(function* (taskDescription, userQuery) {
            var taskId = Date.now().toString();
            var task = { id: taskId, description: taskDescription, status: 'in-progress', progress: 0, steps: [] };
            setCurrentTask(task);

            var steps = ['Analyzing your requirements...', 'Accessing hospital database...', 'Evaluating options...', 'Calculating optimal solutions...', 'Generating recommendations...']; var _loop = function* _loop(i) {
                yield new Promise(function (resolve) { return setTimeout(resolve, 300); });
                setCurrentTask(function (prev) {
                    return prev ? Object.assign({},
                        prev, {
                        progress: (i + 1) / steps.length * 100,
                        steps: [].concat((0, _toConsumableArray2.default)(prev.steps), [steps[i]])
                    }) :
                        null;
                });
            }; for (var i = 0; i < steps.length; i++) { yield* _loop(i); }

            yield new Promise(function (resolve) { return setTimeout(resolve, 200); });
            setCurrentTask(function (prev) { return prev ? Object.assign({}, prev, { status: 'completed' }) : null; });
            setTimeout(function () { return setCurrentTask(null); }, 800);
        }); return function executeAgentTask(_x, _x2) { return _ref.apply(this, arguments); };
    }();

    var generateAgenticResponse =/*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2.default)(function* (userMessage) {
            var lowerMessage = userMessage.toLowerCase();
            var updatedBookingData = extractBookingInfo(userMessage, bookingData);
            setBookingData(updatedBookingData);

            if (updatedBookingData.hasAllRequiredInfo && (lowerMessage.includes('book') || lowerMessage.includes('confirm') || lowerMessage.includes('schedule'))) {
                yield executeAgentTask('Processing your appointment booking', userMessage);
                try {
                    var _state$patientInfo;
                    var newToken = createTokenFromBookingData(updatedBookingData);
                    return {
                        id: `msg-${Date.now()}`,
                        type: 'bot',
                        message: `✅ **Booking Confirmed - AI Autonomous Booking**\n\n🎉 **Your appointment has been successfully scheduled!**\n\n**Booking Details:**\n👤 Patient: ${(_state$patientInfo = state.patientInfo) == null ? void 0 : _state$patientInfo.name}\n📅 Age: ${updatedBookingData.age} years\n⚧ Gender: ${updatedBookingData.gender}\n🏥 Department: ${updatedBookingData.department}\n${updatedBookingData.doctorName ? `👨‍⚕️ Doctor: ${updatedBookingData.doctorName}\n` : ''}🕐 Scheduled Time: ${newToken.scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n⏱️ Wait: ${newToken.estimatedWaitTime} min\n🎫 Token: ${newToken.id}`,
                        timestamp: new Date(),
                        metadata: { department: updatedBookingData.department, doctor: updatedBookingData.doctorName, confidence: 98 },
                        actions: [
                            {
                                id: 'view-token', label: 'View Token', handler: function handler() {
                                    setState(function (prev) { return Object.assign({}, prev, { tokens: [].concat((0, _toConsumableArray2.default)(prev.tokens), [newToken]), currentToken: newToken, currentView: 'token' }); });
                                    setIsOpen(false);
                                    _sonnerNative.toast.success('Token generated successfully!');
                                }
                            }],

                        suggestions: ['Check wait times']
                    };
                } catch (error) {
                    return { id: `msg-${Date.now()}`, type: 'bot', message: `❌ **Booking Failed**\n${error.message}`, timestamp: new Date() };
                }
            }

            if ((lowerMessage.includes('book') || lowerMessage.includes('appointment')) && !updatedBookingData.hasAllRequiredInfo) {
                var missing = [];
                if (!updatedBookingData.age) missing.push('Age');
                if (!updatedBookingData.gender) missing.push('Gender');
                if (!updatedBookingData.department) missing.push('Department');

                return {
                    id: `msg-${Date.now()}`,
                    type: 'bot',
                    message: `📋 **Booking Information Collection**\n\n**Still Need:**\n${missing.join(', ')}\n\nExample: "Age 30, male, Cardiology"`,
                    timestamp: new Date(),
                    suggestions: ['Age 30, male, General Medicine']
                };
            }

            if (lowerMessage.includes('book now') || lowerMessage.includes('schedule now')) {
                return {
                    id: `msg-${Date.now()}`,
                    type: 'bot',
                    message: `🎯 **Quick Booking**\n\nSelect your service type:`,
                    timestamp: new Date(),
                    actions: [
                        { id: 'book-common', label: 'General Consultation', handler: function handler() { setState(function (prev) { return Object.assign({}, prev, { currentView: 'common' }); }); } },
                        { id: 'book-emergency', label: 'Emergency', variant: 'destructive', handler: function handler() { setState(function (prev) { return Object.assign({}, prev, { currentView: 'emergency' }); }); } }]

                };
            }

            if (lowerMessage.includes('find') && (lowerMessage.includes('doctor') || lowerMessage.includes('best'))) {
                yield executeAgentTask('Finding optimal doctor match', userMessage);
                var allDoctors = state.departments.
                    filter(function (d) { return d.type === 'consultation'; }).
                    flatMap(function (dept) { return dept.doctors.map(function (doc) { return Object.assign({}, doc, { department: dept.name }); }); }).
                    filter(function (doc) { return doc.status === 'available'; });

                if (allDoctors.length > 0) {
                    var scoredDoctors = allDoctors.map(function (doc) {
                        var score = doc.experience * 2;
                        score += (1 - doc.currentPatients / doc.maxPatients) * 30;
                        score += 20;
                        var dept = state.departments.find(function (d) { return d.name === doc.department; });
                        if (dept) score += (60 - dept.averageWaitTime) / 2;
                        return Object.assign({}, doc, { score: score });
                    }).sort(function (a, b) { return b.score - a.score; });

                    var topDoctor = scoredDoctors[0];
                    return {
                        id: `msg-${Date.now()}`,
                        type: 'bot',
                        message: `🎯 **AI Recommendation**\n\n**Dr. ${topDoctor.name}**\n${topDoctor.specialization}\n🏥 ${topDoctor.department}\n⭐ Score: ${Math.round(topDoctor.score)}/100`,
                        timestamp: new Date(),
                        metadata: { doctor: topDoctor.name, department: topDoctor.department, confidence: 94 },
                        actions: [
                            {
                                id: 'book-top-doctor', label: `Book Dr. ${topDoctor.name}`, handler: function handler() {
                                    setAIRecommendation({ type: 'doctor', doctorId: topDoctor.id, doctorName: topDoctor.name, department: topDoctor.department });
                                    setState(function (prev) { return Object.assign({}, prev, { currentView: 'common' }); });
                                }
                            }]

                    };
                }
            }

            if (lowerMessage.includes('best time') || lowerMessage.includes('optimal')) {
                yield executeAgentTask('Analyzing optimal visit times', userMessage);
                return {
                    id: `msg-${Date.now()}`,
                    type: 'bot',
                    message: `⏰ Optimal Time Analysis\n\nBest Time: 10:00 AM - 12:00 PM\nExpected Load: 40%\nEstimated Wait: 21 mins`,
                    timestamp: new Date(),
                    metadata: { confidence: 91 },
                    actions: [{ id: 'schedule-optimal', label: 'Schedule for 10:00 AM', handler: function handler() { return setState(function (prev) { return Object.assign({}, prev, { currentView: 'common' }); }); } }]
                };
            }

            return {
                id: `msg-${Date.now()}`,
                type: 'bot',
                message: `🧠 AI Processing Your Request\n\nI can help you with:\n• Finding optimal doctors\n• Calculating best visit times\n• Auto-scheduling appointments`,
                timestamp: new Date(),
                actions: [{ id: 'quick-book', label: 'Quick Book Appointment', handler: function handler() { return setState(function (prev) { return Object.assign({}, prev, { currentView: 'patient-dashboard' }); }); } }]
            };
        }); return function generateAgenticResponse(_x3) { return _ref2.apply(this, arguments); };
    }();

    var handleSendMessage =/*#__PURE__*/function () {
        var _ref3 = (0, _asyncToGenerator2.default)(function* (messageText) {
            var messageToSend = messageText || inputValue;
            if (!messageToSend.trim()) return;

            setMessages(function (prev) { return [].concat((0, _toConsumableArray2.default)(prev), [{ id: `msg-${Date.now()}`, type: 'user', message: messageToSend, timestamp: new Date() }]); });
            setInputValue('');
            setIsThinking(true);

            try {
                var resp = yield generateAgenticResponse(messageToSend);
                setMessages(function (prev) { return [].concat((0, _toConsumableArray2.default)(prev), [resp]); });
            } catch (error) {
                console.log('Error', error);
            } finally {
                setIsThinking(false);
            }
        }); return function handleSendMessage(_x4) { return _ref3.apply(this, arguments); };
    }();

    if (!isOpen) {
        return (/*#__PURE__*/
            (0, _jsxRuntime.jsx)(_reactNative.View, {
                style: styles.fabContainer, children:/*#__PURE__*/
                    (0, _jsxRuntime.jsx)(_button.Button, {
                        onPress: function onPress() { return setIsOpen(true); }, style: styles.fabBtn, children:/*#__PURE__*/
                            (0, _jsxRuntime.jsx)(_lucideReactNative.Brain, { size: 28, color: "#fff" })
                    }
                    )
            }
            ));

    }

    return (/*#__PURE__*/
        (0, _jsxRuntime.jsx)(_reactNative.KeyboardAvoidingView, {
            behavior: _reactNative.Platform.OS === 'ios' ? 'padding' : undefined, style: [styles.chatWindow, { height: height * 0.8 }], pointerEvents: "box-none", children:/*#__PURE__*/
                (0, _jsxRuntime.jsxs)(_card.Card, {
                    style: styles.card, children: [/*#__PURE__*/

                        (0, _jsxRuntime.jsx)(_card.CardHeader, {
                            style: styles.header, children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.rowBetween, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                            style: styles.row, children: [/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.headerIcon, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Brain, { size: 20, color: "#fff" }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Sparkles, { size: 12, color: "#fde047", style: { position: 'absolute', top: -4, right: -4 } })]
                                                }
                                                ),/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: { marginLeft: 12 }, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: styles.headerTitle, children: ["AI Assistant ",/*#__PURE__*/(0, _jsxRuntime.jsx)(_badge.Badge, { style: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 4, paddingVertical: 2 }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 10, color: '#fff' }, children: "v2.0" }) })] }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.headerSub, children: "Autonomous Mode Active" })]
                                                }
                                                )]
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, { onPress: function onPress() { return setIsOpen(false); }, style: { padding: 8 }, children:/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReactNative.X, { size: 20, color: "#fff" }) })]
                                }
                                )
                        }
                        ),/*#__PURE__*/


                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                            style: styles.quickActionsBar, children:/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
                                    horizontal: true, showsHorizontalScrollIndicator: false, children:
                                        quickActions.map(function (action, idx) {
                                            return (/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                                    onPress: function onPress() { return handleSendMessage(action.query); }, style: styles.quickActionBtn, children:/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.Text, { style: styles.quickActionText, children: [action.icon, " ", action.label] })
                                                }, idx
                                                ));
                                        }
                                        )
                                }
                                )
                        }
                        ),


                        currentTask &&/*#__PURE__*/
                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                            style: styles.taskBar, children: [/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.row, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Loader2, { size: 14, color: "#9333ea" }),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.taskTitle, children: currentTask.description })]
                                }
                                ),/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_progress.Progress, { value: currentTask.progress, style: { height: 4, marginTop: 4 } }),
                                currentTask.steps.length > 0 &&/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.taskSub, children: currentTask.steps[currentTask.steps.length - 1] })]
                        }
                        ),/*#__PURE__*/


                        (0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
                            ref: scrollViewRef, style: styles.messagesArea, contentContainerStyle: { padding: 16 }, children: [
                                messages.map(function (msg) {
                                    var _msg$metadata, _msg$metadata2; return (/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: [styles.msgLine, msg.type === 'user' ? styles.msgLineUser : styles.msgLineBot], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: [styles.msgBubble, msg.type === 'user' ? styles.msgBubbleUser : styles.msgBubbleBot], children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: styles.rowBetween, children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                                    style: [styles.row, { marginBottom: 4, opacity: 0.8 }], children: [
                                                                        msg.type === 'user' ?/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReactNative.User, { size: 12, color: "#fff" }) :/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReactNative.Brain, { size: 12, color: "#9333ea" }),/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, {
                                                                            style: [styles.msgTime, msg.type === 'user' ? { color: '#fff' } : { color: '#6b7280' }], children:
                                                                                msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                                        }
                                                                        )]
                                                                }
                                                                ),
                                                                ((_msg$metadata = msg.metadata) == null ? void 0 : _msg$metadata.confidence) &&/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_badge.Badge, { variant: "outline", style: { borderColor: 'rgba(0,0,0,0.1)' }, children:/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, { style: { fontSize: 10 }, children: [msg.metadata.confidence, "%"] }) })]
                                                        }

                                                        ),/*#__PURE__*/

                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: [styles.msgText, msg.type === 'user' ? { color: '#fff' } : { color: '#111827' }], children: msg.message }),

                                                        ((_msg$metadata2 = msg.metadata) == null ? void 0 : _msg$metadata2.reasoning) &&/*#__PURE__*/
                                                        (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                            style: styles.reasoningBox, children: [/*#__PURE__*/
                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontWeight: 'bold', fontSize: 11, marginBottom: 2 }, children: "AI Reasoning:" }),
                                                                msg.metadata.reasoning.map(function (r, i) { return/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 11 }, children: r }, i); })]
                                                        }
                                                        ),


                                                        msg.actions &&/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                                            style: styles.actionsWrap, children:
                                                                msg.actions.map(function (act) {
                                                                    return (/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsx)(_button.Button, {
                                                                            variant: act.variant || 'outline', onPress: act.handler, size: "sm", style: styles.actionBtn, children:/*#__PURE__*/
                                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 12 }, children: act.label })
                                                                        }, act.id
                                                                        ));
                                                                }
                                                                )
                                                        }
                                                        ),


                                                        msg.suggestions && msg.suggestions.length > 0 &&/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                                            style: styles.suggestionsWrap, children:
                                                                msg.suggestions.map(function (s, idx) {
                                                                    return (/*#__PURE__*/
                                                                        (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                                                            onPress: function onPress() { return handleSendMessage(s); }, style: styles.suggestionBtn, children:/*#__PURE__*/
                                                                                (0, _jsxRuntime.jsx)(_reactNative.Text, { style: styles.suggestionText, children: s })
                                                                        }, idx
                                                                        ));
                                                                }
                                                                )
                                                        }
                                                        )]
                                                }

                                                )
                                        }, msg.id
                                        ));
                                }
                                ),
                                isThinking &&/*#__PURE__*/
                                (0, _jsxRuntime.jsx)(_reactNative.View, {
                                    style: [styles.msgLine, styles.msgLineBot], children:/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                                            style: [styles.msgBubble, styles.msgBubbleBot], children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                                    style: styles.row, children: [/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_lucideReactNative.Brain, { size: 12, color: "#9333ea", style: { marginRight: 4 } }),/*#__PURE__*/
                                                        (0, _jsxRuntime.jsx)(_reactNative.Text, { style: { fontSize: 12, color: '#6b7280' }, children: "AI is thinking..." })]
                                                }
                                                )
                                        }
                                        )
                                }
                                )]
                        }

                        ),/*#__PURE__*/

                        (0, _jsxRuntime.jsx)(_reactNative.View, {
                            style: styles.inputArea, children:/*#__PURE__*/
                                (0, _jsxRuntime.jsxs)(_reactNative.View, {
                                    style: styles.inputWrap, children: [/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.TextInput, {
                                            style: styles.input,
                                            placeholder: "Ask AI to help you...",
                                            value: inputValue,
                                            onChangeText: setInputValue,
                                            onSubmitEditing: function onSubmitEditing() { return handleSendMessage(); },
                                            editable: !isThinking
                                        }
                                        ),/*#__PURE__*/
                                        (0, _jsxRuntime.jsx)(_reactNative.TouchableOpacity, {
                                            style: styles.sendBtn, onPress: function onPress() { return handleSendMessage(); }, disabled: !inputValue.trim() || isThinking, children:/*#__PURE__*/
                                                (0, _jsxRuntime.jsx)(_lucideReactNative.Send, { size: 16, color: "#fff" })
                                        }
                                        )]
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
    fabContainer: { position: 'absolute', bottom: 24, right: 24, zIndex: 50 },
    fabBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#9333ea', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    chatWindow: { position: 'absolute', bottom: 0, right: 0, zIndex: 50, width: '100%', maxWidth: 450, padding: 16, justifyContent: 'flex-end' },
    card: { flex: 1, backgroundColor: '#fff', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 12, borderColor: '#e9d5ff', borderWidth: 2, borderRadius: 12 },
    header: { backgroundColor: '#9333ea', padding: 16, borderBottomWidth: 0 },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    headerSub: { color: '#fff', fontSize: 12, opacity: 0.8 },
    quickActionsBar: { backgroundColor: '#faf5ff', padding: 8, borderBottomWidth: 1, borderBottomColor: '#f3e8ff' },
    quickActionBtn: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginRight: 8, borderWidth: 1, borderColor: '#e9d5ff' },
    quickActionText: { fontSize: 12, color: '#4b5563' },
    taskBar: { padding: 12, backgroundColor: '#faf5ff', borderBottomWidth: 1, borderBottomColor: '#e9d5ff' },
    taskTitle: { fontSize: 13, fontWeight: '500', color: '#4c1d95', marginLeft: 8 },
    taskSub: { fontSize: 11, color: '#7e22ce', marginTop: 4 },
    messagesArea: { flex: 1, backgroundColor: '#f9fafb' },
    msgLine: { flexDirection: 'row', marginBottom: 16 },
    msgLineUser: { justifyContent: 'flex-end' },
    msgLineBot: { justifyContent: 'flex-start' },
    msgBubble: { maxWidth: '85%', padding: 12, borderRadius: 12 },
    msgBubbleUser: { backgroundColor: '#9333ea', borderBottomRightRadius: 2 },
    msgBubbleBot: { backgroundColor: '#fff', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#e5e7eb' },
    msgTime: { marginLeft: 4, fontSize: 10 },
    msgText: { fontSize: 14, lineHeight: 20 },
    reasoningBox: { marginTop: 8, padding: 8, backgroundColor: '#f3f4f6', borderRadius: 4 },
    actionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
    actionBtn: { paddingVertical: 4, paddingHorizontal: 8, height: 28 },
    suggestionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
    suggestionBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff' },
    suggestionText: { fontSize: 11, color: '#374151' },
    inputArea: { padding: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#f9fafb' },
    inputWrap: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb' },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#9333ea', alignItems: 'center', justifyContent: 'center' }
});
