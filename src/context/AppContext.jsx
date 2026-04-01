Object.defineProperty(exports, "__esModule", { value: true }); exports.useAppContext = exports.initialState = exports.initialDepartments = exports.AppContext = void 0; var _react = require("react");
var _translations = require("../translations/translations");

var initialDepartments = exports.initialDepartments = [
    {
        name: "General Medicine",
        type: "consultation",
        currentQueue: 12,
        averageWaitTime: 15,
        services: [
            "General Checkup",
            "Consultation",
            "Health Screening"],

        doctors: [
            {
                id: "gen1",
                name: "Dr. Ravi Sharma",
                specialization: "Internal Medicine",
                experience: 25,
                status: "available",
                currentPatients: 6,
                maxPatients: 15
            },
            {
                id: "gen2",
                name: "Dr. Anjali Nair",
                specialization: "Family Medicine",
                experience: 12,
                status: "available",
                currentPatients: 4,
                maxPatients: 12
            },
            {
                id: "gen3",
                name: "Dr. Suresh Iyer",
                specialization: "Preventive Care",
                experience: 8,
                status: "available",
                currentPatients: 2,
                maxPatients: 10
            }]

    },
    {
        name: "Orthopedics",
        type: "consultation",
        currentQueue: 5,
        averageWaitTime: 25,
        services: [
            "Bone Consultation",
            "Joint Treatment",
            "Sports Medicine"],

        doctors: [
            {
                id: "orth1",
                name: "Dr. Rajesh Kumar",
                specialization: "Joint Surgery",
                experience: 15,
                status: "available",
                currentPatients: 3,
                maxPatients: 8
            },
            {
                id: "orth2",
                name: "Dr. Priya Singh",
                specialization: "Sports Medicine",
                experience: 10,
                status: "busy",
                currentPatients: 6,
                maxPatients: 6
            },
            {
                id: "orth3",
                name: "Dr. Amit Shah",
                specialization: "Spine Surgery",
                experience: 12,
                status: "available",
                currentPatients: 2,
                maxPatients: 5
            }]

    },
    {
        name: "Cardiology",
        type: "consultation",
        currentQueue: 8,
        averageWaitTime: 35,
        services: [
            "Heart Consultation",
            "ECG",
            "Cardiac Treatment"],

        doctors: [
            {
                id: "card1",
                name: "Dr. Sunita Mehta",
                specialization: "Heart Surgery",
                experience: 20,
                status: "available",
                currentPatients: 4,
                maxPatients: 10
            },
            {
                id: "card2",
                name: "Dr. Vikram Patel",
                specialization: "Interventional Cardiology",
                experience: 18,
                status: "available",
                currentPatients: 3,
                maxPatients: 8
            },
            {
                id: "card3",
                name: "Dr. Kavita Reddy",
                specialization: "Pediatric Cardiology",
                experience: 14,
                status: "offline",
                currentPatients: 0,
                maxPatients: 6
            }]

    },
    {
        name: "Neurology",
        type: "consultation",
        currentQueue: 3,
        averageWaitTime: 40,
        services: [
            "Brain Consultation",
            "Neurological Treatment",
            "Stroke Care"],

        doctors: [
            {
                id: "neuro1",
                name: "Dr. Ashok Gupta",
                specialization: "Brain Surgery",
                experience: 22,
                status: "busy",
                currentPatients: 5,
                maxPatients: 5
            },
            {
                id: "neuro2",
                name: "Dr. Meera Joshi",
                specialization: "Stroke Treatment",
                experience: 16,
                status: "available",
                currentPatients: 2,
                maxPatients: 7
            }]

    },
    {
        name: "Pediatrics",
        type: "consultation",
        currentQueue: 7,
        averageWaitTime: 20,
        services: [
            "Child Care",
            "Vaccination",
            "Pediatric Surgery"],

        doctors: [
            {
                id: "ped1",
                name: "Dr. Rekha Varma",
                specialization: "Child Care",
                experience: 16,
                status: "available",
                currentPatients: 5,
                maxPatients: 12
            },
            {
                id: "ped2",
                name: "Dr. Mohit Khanna",
                specialization: "Pediatric Surgery",
                experience: 11,
                status: "available",
                currentPatients: 2,
                maxPatients: 6
            }]

    },
    {
        name: "Laboratory",
        type: "diagnostic",
        currentQueue: 15,
        averageWaitTime: 10,
        services: [
            "Blood Tests",
            "Urine Tests",
            "X-Ray",
            "MRI",
            "CT Scan"],

        doctors: [
            {
                id: "lab1",
                name: "Dr. Kavya Technician",
                specialization: "Lab Technology",
                experience: 8,
                status: "available",
                currentPatients: 10,
                maxPatients: 20
            },
            {
                id: "lab2",
                name: "Dr. Rahul Pathologist",
                specialization: "Pathology",
                experience: 12,
                status: "available",
                currentPatients: 5,
                maxPatients: 15
            }]

    },
    {
        name: "Pharmacy",
        type: "pharmacy",
        currentQueue: 8,
        averageWaitTime: 5,
        services: [
            "Prescription Medicines",
            "OTC Medicines",
            "Medical Supplies"],

        doctors: [
            {
                id: "pharm1",
                name: "Dr. Sita Pharmacist",
                specialization: "Clinical Pharmacy",
                experience: 10,
                status: "available",
                currentPatients: 5,
                maxPatients: 20
            },
            {
                id: "pharm2",
                name: "Dr. Ram Chemist",
                specialization: "Pharmaceutical Sciences",
                experience: 15,
                status: "available",
                currentPatients: 3,
                maxPatients: 15
            }]

    },
    {
        name: "Radiology",
        type: "diagnostic",
        currentQueue: 6,
        averageWaitTime: 20,
        services: ["X-Ray", "CT Scan", "MRI", "Ultrasound"],
        doctors: [
            {
                id: "rad1",
                name: "Dr. Priya Radiologist",
                specialization: "Medical Imaging",
                experience: 14,
                status: "available",
                currentPatients: 4,
                maxPatients: 8
            },
            {
                id: "rad2",
                name: "Dr. Arjun Scanner",
                specialization: "Diagnostic Radiology",
                experience: 11,
                status: "available",
                currentPatients: 2,
                maxPatients: 6
            }]

    },
    {
        name: "Emergency",
        type: "consultation",
        currentQueue: 2,
        averageWaitTime: 5,
        services: [
            "Emergency Care",
            "Trauma Treatment",
            "Critical Care"],

        doctors: [
            {
                id: "emg1",
                name: "Dr. Kiran Emergency",
                specialization: "Emergency Medicine",
                experience: 18,
                status: "available",
                currentPatients: 1,
                maxPatients: 5
            },
            {
                id: "emg2",
                name: "Dr. Deepak Trauma",
                specialization: "Trauma Surgery",
                experience: 20,
                status: "available",
                currentPatients: 1,
                maxPatients: 3
            }]

    },
    {
        name: "Reception",
        type: "administrative",
        currentQueue: 0,
        averageWaitTime: 3,
        services: [
            "Registration",
            "Appointments",
            "Information",
            "Billing"],

        doctors: [
            {
                id: "rec1",
                name: "Reception Staff",
                specialization: "Administrative",
                experience: 5,
                status: "available",
                currentPatients: 0,
                maxPatients: 50
            }]

    }];


var initialState = exports.initialState = {
    currentView: "portal",
    language: "en",
    accessibilityMode: "normal",
    patientInfo: null,
    currentToken: null,
    tokens: [],
    departments: initialDepartments,
    emergencyCount: 0,
    maxEmergencyPerDay: 50,
    notifications: [],
    theme: "medical",
    consultationData: undefined
};

var AppContext = exports.AppContext =/*#__PURE__*/(0, _react.createContext)(




























    {
        state: initialState,
        setState: function setState() { },
        sendEmergencyNotification: function sendEmergencyNotification() { },
        addNotification: function addNotification() { },
        calculateOptimalTime: function calculateOptimalTime() {
            return {
                time: new Date(),
                waitTime: 0,
                position: 0
            };
        },
        addVisitToToken: function addVisitToToken() { },
        addPrescriptionToToken: function addPrescriptionToToken() { },
        addLabTestToToken: function addLabTestToToken() { },
        completeConsultation: function completeConsultation() { },
        setAIRecommendation: function setAIRecommendation() { }
    });

var useAppContext = exports.useAppContext = function useAppContext() {
    var context = (0, _react.useContext)(AppContext);
    return context;
};