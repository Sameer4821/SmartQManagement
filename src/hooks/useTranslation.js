"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTranslation = void 0;
var _AppContext = require("../context/AppContext");
var _translations = require("../translations/translations");

var useTranslation = function () {
    var _useAppContext = (0, _AppContext.useAppContext)(), state = _useAppContext.state;
    var language = state.language || "en";

    var baseT = _translations.translations[language] || _translations.translations.en;
    var enT = _translations.translations.en;

    var t = function (key) {
        return baseT[key] || enT[key] || key;
    };

    // Attach all translation keys to the function object so `t.welcome` works alongside `t('welcome')`
    Object.assign(t, enT, baseT);

    return { t: t, language: language };
};
exports.useTranslation = useTranslation;
