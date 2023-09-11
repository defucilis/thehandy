"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetModeResult = exports.SetHdspResult = exports.SetHampStateResult = exports.HsspState = exports.HsspSetupResult = exports.HandyMode = exports.HandyFirmwareStatus = exports.HampState = exports.GenericResult = exports.HandyLegacy = void 0;
const Handy_1 = __importDefault(require("./Handy"));
const HandyLegacy_1 = __importDefault(require("./HandyLegacy"));
exports.HandyLegacy = HandyLegacy_1.default;
const types_1 = require("./types");
Object.defineProperty(exports, "GenericResult", { enumerable: true, get: function () { return types_1.GenericResult; } });
Object.defineProperty(exports, "HampState", { enumerable: true, get: function () { return types_1.HampState; } });
Object.defineProperty(exports, "HandyFirmwareStatus", { enumerable: true, get: function () { return types_1.HandyFirmwareStatus; } });
Object.defineProperty(exports, "HandyMode", { enumerable: true, get: function () { return types_1.HandyMode; } });
Object.defineProperty(exports, "HsspSetupResult", { enumerable: true, get: function () { return types_1.HsspSetupResult; } });
Object.defineProperty(exports, "HsspState", { enumerable: true, get: function () { return types_1.HsspState; } });
Object.defineProperty(exports, "SetHampStateResult", { enumerable: true, get: function () { return types_1.SetHampStateResult; } });
Object.defineProperty(exports, "SetHdspResult", { enumerable: true, get: function () { return types_1.SetHdspResult; } });
Object.defineProperty(exports, "SetModeResult", { enumerable: true, get: function () { return types_1.SetModeResult; } });
exports.default = Handy_1.default;
//# sourceMappingURL=index.js.map