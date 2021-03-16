import { CsvUploadResponse, HandyMode, ModeResponse, SetSpeedResponse, SetStrokeResponse, SettingsResponse, StatusResponse, SyncOffsetResponse, SyncPlayResponse, SyncPrepareResponse, VersionResponse } from "./types";
declare class Handy {
    _connectionKey: string;
    serverTimeOffset: number;
    constructor(connectionKey?: string);
    get connectionKey(): string;
    set connectionKey(connectionKey: string);
    setMode(mode: HandyMode): Promise<ModeResponse>;
    toggleMode(mode: HandyMode): Promise<ModeResponse>;
    setSpeed(speed: number, absolute?: boolean): Promise<SetSpeedResponse>;
    setStroke(speed: number, absolute?: boolean): Promise<SetStrokeResponse>;
    stepSpeed(directionUp: boolean): Promise<SetSpeedResponse>;
    stepStroke(directionUp: boolean): Promise<SetStrokeResponse>;
    getVersion(): Promise<VersionResponse>;
    getSettings(): Promise<SettingsResponse>;
    getStatus(): Promise<StatusResponse>;
    getServerTimeOffset(trips?: number, onProgress?: (progress: number) => void): Promise<number>;
    syncPrepare(scriptUrl: string, name?: string, size?: number): Promise<SyncPrepareResponse>;
    syncPlay(play?: boolean, time?: number): Promise<SyncPlayResponse>;
    syncOffset(offset: number): Promise<SyncOffsetResponse>;
    uploadCsv(csv: File, filename?: string): Promise<CsvUploadResponse>;
    enforceConnectionKey(): void;
    getUrl(cmd: string): string;
}
export default Handy;
//# sourceMappingURL=Handy.d.ts.map