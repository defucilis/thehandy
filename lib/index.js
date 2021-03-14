"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandyProvider = exports.useHandy = exports.Handy = void 0;
const Handy_1 = __importDefault(require("./Handy"));
exports.Handy = Handy_1.default;
const HandyReact_1 = __importDefault(require("./HandyReact"));
exports.useHandy = HandyReact_1.default;
const HandyReact_2 = require("./HandyReact");
Object.defineProperty(exports, "HandyProvider", { enumerable: true, get: function () { return HandyReact_2.HandyProvider; } });
//# sourceMappingURL=index.js.map