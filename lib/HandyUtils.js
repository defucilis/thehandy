"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseUrl = "https://scripts01.handyfeeling.com/api/script/v0/";
class HandyUtils {
    /** Takes a CSV file and uploads it to the publicly-provided Handy server, to obtain a URL that can be sent to the Handy */
    static uploadCsv(csv, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = baseUrl + "temp/upload";
            if (!filename)
                filename = "script_" + new Date().valueOf() + ".csv";
            const formData = new FormData();
            formData.append("file", csv, filename);
            const response = yield fetch(url, {
                method: "post",
                body: formData,
            });
            const newUrl = (yield response.json()).url;
            return newUrl;
        });
    }
}
exports.default = HandyUtils;
//# sourceMappingURL=HandyUtils.js.map