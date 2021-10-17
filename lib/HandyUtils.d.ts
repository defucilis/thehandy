import { CsvUploadResponse } from "./types";
export default class HandyUtils {
    /** Takes a CSV file and uploads it to the publicly-provided Handy server, to obtain a URL that can be sent to the Handy */
    static uploadCsv(csv: File, filename?: string): Promise<CsvUploadResponse>;
}
//# sourceMappingURL=HandyUtils.d.ts.map