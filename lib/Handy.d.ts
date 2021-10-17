import { GenericResult, SetModeResult, SetHampStateResult, SetHdspResult, HsspSetupResult, HandyInfo, HandySettings, HandyStatus, SlideInfo, HandyMode, HsspState, HampState } from "./types";
/** Class to connect to, control and track the internal state of a Handy using the HandyFeeling API V2 */
declare class Handy {
    private _connectionKey;
    /** If true, will log all HTTP requests to the console */
    verbose: boolean;
    /** Whether the Handy is currecntly connected. Updated whenever a request succeeds (or fails), or when getConnected is called. */
    connected: boolean;
    /** Hardware and Firmware info of the Handy. Undefined until you call getInfo */
    info: HandyInfo | undefined;
    /** Current mode of the Handy. Not guaranteed to be accurate as this may change from other sources than this API */
    currentMode: HandyMode;
    /** Whether HAMP is currently running. Updated when calling setHampStart or setHampStop. Not guaranteed to be accurate as this may change from other sources than this API */
    hampState: HampState;
    /** Current HAMP velocity, from 0 to 100. Updated when calling setHampVelocity. Not guaranteed to be accurate as this may change from other sources than this API */
    hampVelocity: number;
    /** Current target HDSP position of the slider. Updated when calling any of the setHdsp methods. Not guaranteed to be accurate as this may change from other sources than this API */
    hdspPosition: number;
    /** HSSP playing state. Set when calling setHsspPlay or setHsspStop. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspState: HsspState;
    /** Whether HSSP loop is turned on. Set when calling setHsspLoop. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspLoop: boolean;
    /** URL of prepared CSV file for HDSP playback. Set when calling setHsspSetup. Not guaranteed to be accurate as this may change from other sources than this API */
    hsspPreparedUrl: string;
    /** Estimated server time. Only really valid immediately after calling getHstpSync. */
    hstpTime: number;
    /** Server-time offset of the Handy. Set when calling getServerTimeOffset. Not guaranteed to be accurate as this may change from other sources than this API */
    hstpOffset: number;
    /** Round-trip delay from the Handy to the server and back, in milliseconds. Updated when calling getHstpRtd. */
    hstpRtd: number;
    /** The estimated offset time between the Handy and the server - updated by calling getServerTimeOffset */
    estimatedServerTimeOffset: number;
    /** Min slide position of the Handy, used in all modes. Set when calling setSlideSettings. Not guaranteed to be accurate as this may change from other sources than this API */
    slideMin: number;
    /** Max slide position of the Handy, used in all modes. Set when calling setSlideSettings. Not guaranteed to be accurate as this may change from other sources than this API */
    slideMax: number;
    /** The physical position of the slider in mm from the bottom. Updated when calling getSlidePositionAbsolute. Obviously, any movement after this point will make this value useless */
    slidePositionAbsolute: number;
    constructor(verbose?: boolean);
    /** Current connection key. Backed up to localStorage, when possible */
    get connectionKey(): string;
    set connectionKey(connectionKey: string);
    /** Gets the mode the Handy is currently in */
    getMode(): Promise<HandyMode>;
    /** Sets the Handy to a new mode. */
    setMode(mode: HandyMode): Promise<SetModeResult>;
    /** Determines whether the Handy is currently connected or not */
    getConnected(): Promise<boolean>;
    /** Returns information about the device; hardware version, firmware version, firmware status, firmware branch and device model. */
    getInfo(): Promise<HandyInfo>;
    /** Returns min and mix slider position */
    getSettings(): Promise<HandySettings>;
    /** A convenient endpoint for fetching the current mode of the device and the state within the current mode. For modes with a single state, the returned state value will always be 0. For modes with multiple states, see the schema definition for possible values. */
    getStatus(): Promise<HandyStatus>;
    /** Starts HAMP movement - puts the Handy in HAMP mode first, if it isn't already in HAMP mode. */
    setHampStart(): Promise<SetHampStateResult>;
    /** Stops HAMP movement - puts the Handy in HAMP mode first, if it isn't already in HAMP mode. */
    setHampStop(): Promise<SetHampStateResult>;
    /** Gets the current HAMP state - puts the Handy in HAMP mode first, if it isn't already in HAMP mode */
    getHampState(): Promise<{
        result: GenericResult;
        state: HampState;
    }>;
    /** Gets the current HAMP velocity, from 0 - 100 - puts the handy in HAMP mode first, if it isn't already in HAMP mode */
    getHampVelocity(): Promise<number>;
    /** Sets the current HAMP velocity, from 0 - 100 - puts the handy in HAMP mode first, if it isn't already in HAMP mode */
    setHampVelocity(velocity: number): Promise<GenericResult>;
    /** Sets the next absolute position (xa) of the device, and the absolute velocity (va) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXaVa(positionAbsolute: number, velocityAbsolute: number, stopOnTarget?: boolean): Promise<SetHdspResult>;
    /** Sets the next percent position (xp) of the device, and the absolute velocity (va) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXpVa(positionPercentage: number, velocityAbsolute: number, stopOnTarget?: boolean): Promise<SetHdspResult>;
    /** Sets the next percent position (xp) of the device, and the percent velocity (vp) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXpVp(positionPercentage: number, velocityPercentage: number, stopOnTarget?: boolean): Promise<SetHdspResult>;
    /** Sets the next absolute position (xa) of the device, and the time (t) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXaT(positionAbsolute: number, durationMilliseconds: number, stopOnTarget?: boolean): Promise<SetHdspResult>;
    /** Sets the next percent position (xp) of the device, and the time (t) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXpT(positionPercentage: number, durationMilliseconds: number, stopOnTarget?: boolean): Promise<SetHdspResult>;
    /** Starts HSSP playback, if a script has already been prepared. Can be used to skip to a timecode in ms from the start of the script. Pass in an estimated server time to ensure proper sync. Puts the handy in HSSP mode, if it isn't already in HSSP mode. */
    setHsspPlay(playbackPosition?: number, serverTime?: number): Promise<GenericResult>;
    /** Stops HSSP playback, if a script has already been prepared. Puts the handy in HSSP mode, if it isn't already in HSSP mode. */
    setHsspStop(): Promise<GenericResult>;
    /** Setup script synchronization by providing the device with an URL from where the script can be downloaded. The device need to be able to access the URL for setup to work. If the sha-256 value of the script is provided, the device will only download the script if it can not be found in the device cache. Puts the Handy in HSSP mode, if it isn't already in HSSP mode */
    setHsspSetup(url: string, sha256?: string): Promise<HsspSetupResult>;
    /** Determines whether the Handy has HSSP loop turned on. Puts the Handy in HSSP mode, if it isn't already in HSSP mode. */
    getHsspLoop(): Promise<boolean>;
    /** Enables or disables loop mode in HSSP. Puts the Handy in HSSP mode, if it isn't already in HSSP mode */
    setHsspLoop(loop: boolean): Promise<GenericResult>;
    /** Returns the current HSSP state. Puts the Handy in HSSP mode, if it isn't already in HSSP mode. */
    getHsspState(): Promise<HsspState>;
    /** Get the current time of the device. When the device and the server time is synchronized, this will be the server time estimated by the device. */
    getHstpTime(): Promise<number>;
    /** Gets the current manual offset of the Handy in milliseconds. Negative values mean that the script will be delayed, positive values mean that the script will be advanced. */
    getHstpOffset(): Promise<number>;
    /** Sets the current manual offset of the Handy in milliseconds. Negative values mean that the script will be delayed, positive values mean that the script will be advanced. */
    setHstpOffset(offset: number): Promise<GenericResult>;
    /** Gets the current round-trip delay from the Handy to the server and back, in milliseconds. Used for synchronization. */
    getHstpRtd(): Promise<number>;
    /** Syncronizes the device with the server clock and calculates the round-trip-delay between the device and the server. As far as I can tell, this just doesn't work. I suggest using getServerTimeOffset instead. */
    getHstpSync(syncCount?: number, outliers?: number): Promise<GenericResult & {
        time: number;
        rtd: number;
    }>;
    /** Gets the min and max slide positions from 0 - 100 */
    getSlideSettings(): Promise<SlideInfo>;
    /** Gets the current position of the slider in mm from the bottom position */
    getSlidePositionAbsolute(): Promise<number>;
    /** Sets the min and max slide positions from 0 - 100 */
    setSlideSettings(min: number, max: number): Promise<GenericResult>;
    /** Sets the min slide position, from 0 - 100. If fixed is true, then the device will attempt to maintain the same distance between min and max */
    setSlideMin(min: number, fixed?: boolean): Promise<GenericResult>;
    /** Sets the max slide position, from 0 - 100. If fixed is true, then the device will attempt to maintain the same distance between min and max */
    setSlideMax(max: number, fixed?: boolean): Promise<GenericResult>;
    /** Gets the current time on the HandyFeeling server */
    getServerTime(): Promise<number>;
    /** Gets the offset, in milliseconds, between the Handy and the HandyFeeling servers. Updates estimatedServerTimeOffset */
    getServerTimeOffset(trips?: number, onProgress?: (progress: number) => void): Promise<number>;
    private enforceConnectionKey;
    private getUrl;
    private catchHttpErrors;
    private getJson;
    private putJson;
}
export default Handy;
//# sourceMappingURL=Handy.d.ts.map