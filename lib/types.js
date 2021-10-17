"use strict";
//---------------------------------------------
//                  GENERIC
//---------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandyFirmwareStatus = exports.HsspState = exports.HsspSetupResult = exports.SetHdspResult = exports.HampState = exports.SetHampStateResult = exports.SetModeResult = exports.GenericResult = exports.HandyMode = void 0;
var HandyMode;
(function (HandyMode) {
    HandyMode[HandyMode["unknown"] = -1] = "unknown";
    HandyMode[HandyMode["hamp"] = 0] = "hamp";
    HandyMode[HandyMode["hssp"] = 1] = "hssp";
    HandyMode[HandyMode["hdsp"] = 2] = "hdsp";
})(HandyMode = exports.HandyMode || (exports.HandyMode = {}));
var GenericResult;
(function (GenericResult) {
    GenericResult[GenericResult["error"] = -1] = "error";
    GenericResult[GenericResult["success"] = 0] = "success";
})(GenericResult = exports.GenericResult || (exports.GenericResult = {}));
var SetModeResult;
(function (SetModeResult) {
    SetModeResult[SetModeResult["error"] = -1] = "error";
    SetModeResult[SetModeResult["successNewMode"] = 0] = "successNewMode";
    SetModeResult[SetModeResult["successSameMode"] = 1] = "successSameMode";
})(SetModeResult = exports.SetModeResult || (exports.SetModeResult = {}));
//---------------------------------------------
//                  HAMP
//---------------------------------------------
var SetHampStateResult;
(function (SetHampStateResult) {
    SetHampStateResult[SetHampStateResult["error"] = -1] = "error";
    SetHampStateResult[SetHampStateResult["successNewState"] = 0] = "successNewState";
    SetHampStateResult[SetHampStateResult["successSameState"] = 1] = "successSameState";
})(SetHampStateResult = exports.SetHampStateResult || (exports.SetHampStateResult = {}));
var HampState;
(function (HampState) {
    HampState[HampState["stopped"] = 1] = "stopped";
    HampState[HampState["moving"] = 2] = "moving";
})(HampState = exports.HampState || (exports.HampState = {}));
//---------------------------------------------
//                  HDSP
//---------------------------------------------
var SetHdspResult;
(function (SetHdspResult) {
    SetHdspResult[SetHdspResult["error"] = -3] = "error";
    SetHdspResult[SetHdspResult["successPositionReached"] = 0] = "successPositionReached";
    SetHdspResult[SetHdspResult["successPositionNotReached"] = 1] = "successPositionNotReached";
    SetHdspResult[SetHdspResult["successAlreadyAtPosition"] = 2] = "successAlreadyAtPosition";
    SetHdspResult[SetHdspResult["successInterrupted"] = 3] = "successInterrupted";
})(SetHdspResult = exports.SetHdspResult || (exports.SetHdspResult = {}));
//---------------------------------------------
//                  HSSP
//---------------------------------------------
var HsspSetupResult;
(function (HsspSetupResult) {
    HsspSetupResult[HsspSetupResult["usingCached"] = 0] = "usingCached";
    HsspSetupResult[HsspSetupResult["downloaded"] = 1] = "downloaded";
})(HsspSetupResult = exports.HsspSetupResult || (exports.HsspSetupResult = {}));
var HsspState;
(function (HsspState) {
    HsspState[HsspState["needSetup"] = 2] = "needSetup";
    HsspState[HsspState["stopped"] = 3] = "stopped";
    HsspState[HsspState["playing"] = 4] = "playing";
})(HsspState = exports.HsspState || (exports.HsspState = {}));
var HandyFirmwareStatus;
(function (HandyFirmwareStatus) {
    HandyFirmwareStatus[HandyFirmwareStatus["upToDate"] = 0] = "upToDate";
    HandyFirmwareStatus[HandyFirmwareStatus["updateRequired"] = 1] = "updateRequired";
    HandyFirmwareStatus[HandyFirmwareStatus["updateAvailable"] = 2] = "updateAvailable";
})(HandyFirmwareStatus = exports.HandyFirmwareStatus || (exports.HandyFirmwareStatus = {}));
//# sourceMappingURL=types.js.map