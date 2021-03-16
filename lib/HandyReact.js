"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandyProvider = void 0;
const react_1 = __importStar(require("react"));
const Handy_1 = __importDefault(require("./Handy"));
const handyContext = react_1.createContext({ handy: null });
const useProvideHandy = () => {
    const [handy] = react_1.useState(new Handy_1.default());
    return { handy };
};
const HandyProvider = ({ children }) => {
    const context = { handy: null }; //useProvideHandy();
    return react_1.default.createElement(handyContext.Provider, { value: context }, children);
};
exports.HandyProvider = HandyProvider;
const useHandy = () => {
    return react_1.useContext(handyContext);
};
exports.default = useHandy;
//# sourceMappingURL=HandyReact.js.map