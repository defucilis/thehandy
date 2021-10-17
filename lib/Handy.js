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
const types_1 = require("./types");
const baseUrl = "https://www.handyfeeling.com/api/handy/v2/";
/** Class to connect to, control and track the internal state of a Handy using the HandyFeeling API V2 */
class Handy {
    constructor(verbose = false) {
        /** Whether the Handy is currecntly connected. Updated whenever a request succeeds (or fails), or when getConnected is called. */
        this.connected = false;
        /** Hardware and Firmware info of the Handy. Undefined until you call getInfo */
        this.info = undefined;
        /** Current mode of the Handy. Not guaranteed to be accurate as this may change from other sources than this API */
        this.currentMode = types_1.HandyMode.unknown;
        /** Whether HAMP is currently running. Updated when calling setHampStart or setHampStop. Not guaranteed to be accurate as this may change from other sources than this API */
        this.hampState = types_1.HampState.stopped;
        /** Current HAMP velocity, from 0 to 100. Updated when calling setHampVelocity. Not guaranteed to be accurate as this may change from other sources than this API */
        this.hampVelocity = 0;
        /** Current target HDSP position of the slider. Updated when calling any of the setHdsp methods. Not guaranteed to be accurate as this may change from other sources than this API */
        this.hdspPosition = 0;
        /** HSSP playing state. Set when calling setHsspPlay or setHsspStop. Not guaranteed to be accurate as this may change from other sources than this API */
        this.hsspState = types_1.HsspState.needSetup;
        /** Whether HSSP loop is turned on. Set when calling setHsspLoop. Not guaranteed to be accurate as this may change from other sources than this API */
        this.hsspLoop = false;
        /** URL of prepared CSV file for HDSP playback. Set when calling setHsspSetup. Not guaranteed to be accurate as this may change from other sources than this API */
        this.hsspPreparedUrl = "";
        /** Estimated server time. Only really valid immediately after calling getHstpSync. */
        this.hstpTime = 0;
        /** Server-time offset of the Handy. Set when calling getServerTimeOffset. Not guaranteed to be accurate as this may change from other sources than this API */
        this.hstpOffset = 0;
        /** Round-trip delay from the Handy to the server and back, in milliseconds. Updated when calling getHstpRtd. */
        this.hstpRtd = 0;
        /** The estimated offset time between the Handy and the server - updated by calling getServerTimeOffset */
        this.estimatedServerTimeOffset = 0;
        /** Min slide position of the Handy, used in all modes. Set when calling setSlideSettings. Not guaranteed to be accurate as this may change from other sources than this API */
        this.slideMin = 0;
        /** Max slide position of the Handy, used in all modes. Set when calling setSlideSettings. Not guaranteed to be accurate as this may change from other sources than this API */
        this.slideMax = 0;
        /** The physical position of the slider in mm from the bottom. Updated when calling getSlidePositionAbsolute. Obviously, any movement after this point will make this value useless */
        this.slidePositionAbsolute = 0;
        this._connectionKey = "";
        this.verbose = verbose;
    }
    /** Current connection key. Backed up to localStorage, when possible */
    get connectionKey() {
        if (this._connectionKey === "" && typeof window !== "undefined") {
            this._connectionKey = localStorage.getItem("connectionKey") || "";
        }
        return this._connectionKey;
    }
    set connectionKey(connectionKey) {
        this._connectionKey = connectionKey;
        if (typeof window !== "undefined") {
            localStorage.setItem("connectionKey", connectionKey);
        }
        else
            throw new Error("Can only write connection key to localStorage on client-side!");
    }
    //---------------------------------------------
    //                  BASE
    //---------------------------------------------
    /** Gets the mode the Handy is currently in */
    getMode() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("mode");
            this.currentMode = json.mode;
            this.connected = true;
            return json.mode;
        });
    }
    /** Sets the Handy to a new mode. */
    setMode(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.putJson("mode", { mode });
            this.currentMode = mode;
            this.connected = true;
            return json.result;
        });
    }
    /** Determines whether the Handy is currently connected or not */
    getConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const json = yield this.getJson("connected");
                this.connected = !!json.connected;
                return !!json.connected;
            }
            catch (_a) {
                return false;
            }
        });
    }
    /** Returns information about the device; hardware version, firmware version, firmware status, firmware branch and device model. */
    getInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("info");
            this.connected = true;
            return json;
        });
    }
    /** Returns min and mix slider position */
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("settings");
            this.slideMin = json.slideMin;
            this.slideMax = json.slideMax;
            this.connected = true;
            return json;
        });
    }
    /** A convenient endpoint for fetching the current mode of the device and the state within the current mode. For modes with a single state, the returned state value will always be 0. For modes with multiple states, see the schema definition for possible values. */
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("status");
            this.currentMode = json.mode;
            switch (json.mode) {
                case 0:
                    this.hampState = json.state;
                    break;
                case 1:
                    this.hsspState = json.state;
                    break;
            }
            this.connected = true;
            return json;
        });
    }
    //---------------------------------------------
    //                  HAMP
    //---------------------------------------------
    /** Starts HAMP movement - puts the Handy in HAMP mode first, if it isn't already in HAMP mode. */
    setHampStart() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hamp)
                yield this.setMode(types_1.HandyMode.hamp);
            const json = yield this.putJson("hamp/start", {});
            this.hampState = types_1.HampState.moving;
            this.connected = true;
            return json.result;
        });
    }
    /** Stops HAMP movement - puts the Handy in HAMP mode first, if it isn't already in HAMP mode. */
    setHampStop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hamp)
                yield this.setMode(types_1.HandyMode.hamp);
            const json = yield this.putJson("hamp/stop", {});
            this.hampState = types_1.HampState.stopped;
            this.connected = true;
            return json.result;
        });
    }
    /** Gets the current HAMP state - puts the Handy in HAMP mode first, if it isn't already in HAMP mode */
    getHampState() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hamp)
                yield this.setMode(types_1.HandyMode.hamp);
            const json = yield this.getJson("hamp/state");
            this.hampState = json.state;
            this.connected = true;
            return json;
        });
    }
    /** Gets the current HAMP velocity, from 0 - 100 - puts the handy in HAMP mode first, if it isn't already in HAMP mode */
    getHampVelocity() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hamp)
                yield this.setMode(types_1.HandyMode.hamp);
            const json = yield this.getJson("hamp/velocity");
            this.hampVelocity = json.velocity;
            this.connected = true;
            return json.velocity;
        });
    }
    /** Sets the current HAMP velocity, from 0 - 100 - puts the handy in HAMP mode first, if it isn't already in HAMP mode */
    setHampVelocity(velocity) {
        return __awaiter(this, void 0, void 0, function* () {
            velocity = Math.min(100, Math.max(0, velocity));
            if (this.currentMode !== types_1.HandyMode.hamp || this.hampState == types_1.HampState.stopped)
                yield this.setHampStart();
            const json = yield this.putJson("hamp/velocity", { velocity });
            this.hampVelocity = velocity;
            this.connected = true;
            return json.result;
        });
    }
    //---------------------------------------------
    //                  HDSP
    //---------------------------------------------
    /** Sets the next absolute position (xa) of the device, and the absolute velocity (va) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXaVa(positionAbsolute, velocityAbsolute, stopOnTarget) {
        return __awaiter(this, void 0, void 0, function* () {
            positionAbsolute = Math.min(110, Math.max(0, positionAbsolute));
            velocityAbsolute = Math.min(400, Math.max(-400, velocityAbsolute));
            if (this.currentMode !== types_1.HandyMode.hdsp)
                yield this.setMode(types_1.HandyMode.hdsp);
            const json = yield this.putJson("hdsp/xava", {
                position: positionAbsolute,
                velocity: velocityAbsolute,
                stopOnTarget: !!stopOnTarget,
            });
            this.hdspPosition = positionAbsolute / 110;
            this.connected = true;
            return json.result;
        });
    }
    /** Sets the next percent position (xp) of the device, and the absolute velocity (va) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXpVa(positionPercentage, velocityAbsolute, stopOnTarget) {
        return __awaiter(this, void 0, void 0, function* () {
            positionPercentage = Math.min(100, Math.max(0, positionPercentage));
            velocityAbsolute = Math.min(400, Math.max(-400, velocityAbsolute));
            if (this.currentMode !== types_1.HandyMode.hdsp)
                yield this.setMode(types_1.HandyMode.hdsp);
            const json = yield this.putJson("hdsp/xpva", {
                position: positionPercentage,
                velocity: velocityAbsolute,
                stopOnTarget: !!stopOnTarget,
            });
            this.hdspPosition = positionPercentage;
            this.connected = true;
            return json.result;
        });
    }
    /** Sets the next percent position (xp) of the device, and the percent velocity (vp) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXpVp(positionPercentage, velocityPercentage, stopOnTarget) {
        return __awaiter(this, void 0, void 0, function* () {
            positionPercentage = Math.min(100, Math.max(0, positionPercentage));
            velocityPercentage = Math.min(100, Math.max(-100, velocityPercentage));
            if (this.currentMode !== types_1.HandyMode.hdsp)
                yield this.setMode(types_1.HandyMode.hdsp);
            const json = yield this.putJson("hdsp/xpvp", {
                position: positionPercentage,
                velocity: velocityPercentage,
                stopOnTarget: !!stopOnTarget,
            });
            this.hdspPosition = positionPercentage;
            this.connected = true;
            return json.result;
        });
    }
    /** Sets the next absolute position (xa) of the device, and the time (t) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXaT(positionAbsolute, durationMilliseconds, stopOnTarget) {
        return __awaiter(this, void 0, void 0, function* () {
            positionAbsolute = Math.min(110, Math.max(0, positionAbsolute));
            durationMilliseconds = Math.max(0, durationMilliseconds);
            if (this.currentMode !== types_1.HandyMode.hdsp)
                yield this.setMode(types_1.HandyMode.hdsp);
            const json = yield this.putJson("hdsp/xat", {
                position: positionAbsolute,
                duration: Math.round(durationMilliseconds),
                stopOnTarget: !!stopOnTarget,
            });
            this.hdspPosition = positionAbsolute / 110;
            this.connected = true;
            return json.result;
        });
    }
    /** Sets the next percent position (xp) of the device, and the time (t) the device should use to reach the position. Puts the Handy in HDSP mode, if it isn't already in HDSP mode */
    setHdspXpT(positionPercentage, durationMilliseconds, stopOnTarget) {
        return __awaiter(this, void 0, void 0, function* () {
            positionPercentage = Math.min(100, Math.max(0, positionPercentage));
            durationMilliseconds = Math.max(0, durationMilliseconds);
            if (this.currentMode !== types_1.HandyMode.hdsp)
                yield this.setMode(types_1.HandyMode.hdsp);
            const json = yield this.putJson("hdsp/xpt", {
                position: positionPercentage,
                duration: Math.round(durationMilliseconds),
                stopOnTarget: !!stopOnTarget,
            });
            this.hdspPosition = positionPercentage;
            this.connected = true;
            return json.result;
        });
    }
    //---------------------------------------------
    //                  HSSP
    //---------------------------------------------
    /** Starts HSSP playback, if a script has already been prepared. Can be used to skip to a timecode in ms from the start of the script. Pass in an estimated server time to ensure proper sync. Puts the handy in HSSP mode, if it isn't already in HSSP mode. */
    setHsspPlay(playbackPosition, serverTime) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hssp)
                yield this.setMode(types_1.HandyMode.hssp);
            if (this.hsspState == types_1.HsspState.needSetup)
                throw new Error("Need to setup the Handy with a script before calling HSSP Play!");
            const json = yield this.putJson("hssp/play", {
                estimatedServerTime: Math.round(serverTime || new Date().valueOf() + this.hstpOffset),
                startTime: Math.round(playbackPosition || 0),
            });
            this.hsspState = types_1.HsspState.playing;
            this.connected = true;
            return json.result;
        });
    }
    /** Stops HSSP playback, if a script has already been prepared. Puts the handy in HSSP mode, if it isn't already in HSSP mode. */
    setHsspStop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hssp)
                yield this.setMode(types_1.HandyMode.hssp);
            if (this.hsspState == types_1.HsspState.needSetup)
                throw new Error("Need to setup the Handy with a script before calling HSSP Stop!");
            const json = yield this.putJson("hssp/stop", {});
            this.hsspState = types_1.HsspState.stopped;
            this.connected = true;
            return json.result;
        });
    }
    /** Setup script synchronization by providing the device with an URL from where the script can be downloaded. The device need to be able to access the URL for setup to work. If the sha-256 value of the script is provided, the device will only download the script if it can not be found in the device cache. Puts the Handy in HSSP mode, if it isn't already in HSSP mode */
    setHsspSetup(url, sha256) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hssp)
                yield this.setMode(types_1.HandyMode.hssp);
            const data = {
                url: encodeURI(url),
            };
            if (sha256)
                data.sha256 = sha256;
            const json = yield this.putJson("hssp/setup", data);
            this.hsspPreparedUrl = url;
            this.connected = true;
            return json.result;
        });
    }
    /** Determines whether the Handy has HSSP loop turned on. Puts the Handy in HSSP mode, if it isn't already in HSSP mode. */
    getHsspLoop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hssp)
                yield this.setMode(types_1.HandyMode.hssp);
            const json = yield this.getJson("hssp/loop");
            this.hsspLoop = json.activated;
            this.connected = true;
            return json.activated;
        });
    }
    /** Enables or disables loop mode in HSSP. Puts the Handy in HSSP mode, if it isn't already in HSSP mode */
    setHsspLoop(loop) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hssp)
                yield this.setMode(types_1.HandyMode.hssp);
            const json = yield this.putJson("hssp/loop", {
                activated: loop,
            });
            this.hsspLoop = loop;
            this.connected = true;
            return json.result;
        });
    }
    /** Returns the current HSSP state. Puts the Handy in HSSP mode, if it isn't already in HSSP mode. */
    getHsspState() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentMode !== types_1.HandyMode.hssp)
                yield this.setMode(types_1.HandyMode.hssp);
            const json = yield this.getJson("hssp/state");
            this.hsspState = json.state;
            this.connected = true;
            return json.state;
        });
    }
    //---------------------------------------------
    //                  HSTP
    //---------------------------------------------
    /** Get the current time of the device. When the device and the server time is synchronized, this will be the server time estimated by the device. */
    getHstpTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("hstp/time");
            this.hstpTime = json.time;
            this.connected = true;
            return json.time;
        });
    }
    /** Gets the current manual offset of the Handy in milliseconds. Negative values mean that the script will be delayed, positive values mean that the script will be advanced. */
    getHstpOffset() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("hstp/offset");
            this.hstpOffset = json.offset;
            this.connected = true;
            return json.offset;
        });
    }
    /** Sets the current manual offset of the Handy in milliseconds. Negative values mean that the script will be delayed, positive values mean that the script will be advanced. */
    setHstpOffset(offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.putJson("hstp/offset", {
                offset: Math.round(offset),
            });
            this.hstpOffset = offset;
            this.connected = true;
            return json.result;
        });
    }
    /** Gets the current round-trip delay from the Handy to the server and back, in milliseconds. Used for synchronization. */
    getHstpRtd() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("hstp/rtd");
            this.hstpRtd = json.rtd;
            this.connected = true;
            return json.rtd;
        });
    }
    /** Syncronizes the device with the server clock and calculates the round-trip-delay between the device and the server. As far as I can tell, this just doesn't work. I suggest using getServerTimeOffset instead. */
    getHstpSync(syncCount = 30, outliers = 6) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("hstp/sync", {
                syncCount: Math.round(syncCount).toString(),
                outliers: Math.round(outliers).toString(),
            });
            this.hstpRtd = json.rtd;
            this.connected = true;
            return json;
        });
    }
    //---------------------------------------------
    //                  SLIDE
    //---------------------------------------------
    /** Gets the min and max slide positions from 0 - 100 */
    getSlideSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("slide");
            this.slideMin = json.min;
            this.slideMax = json.max;
            this.connected = true;
            return json;
        });
    }
    /** Gets the current position of the slider in mm from the bottom position */
    getSlidePositionAbsolute() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("slide/position/absolute");
            this.slidePositionAbsolute = json.position;
            this.connected = true;
            return json.position;
        });
    }
    /** Sets the min and max slide positions from 0 - 100 */
    setSlideSettings(min, max) {
        return __awaiter(this, void 0, void 0, function* () {
            //flip if they're reversed
            if (min > max) {
                const temp = max;
                max = min;
                min = temp;
            }
            const json = yield this.putJson("slide", { min, max });
            this.slideMin = min;
            this.slideMax = max;
            this.connected = true;
            return json.result;
        });
    }
    /** Sets the min slide position, from 0 - 100. If fixed is true, then the device will attempt to maintain the same distance between min and max */
    setSlideMin(min, fixed = false) {
        return __awaiter(this, void 0, void 0, function* () {
            min = Math.max(0, Math.min(100, min));
            const json = yield this.putJson("slide", {
                min,
                fixed: fixed || false,
            });
            const offset = min - this.slideMin;
            this.slideMin = min;
            if (fixed) {
                this.slideMax += offset;
                this.slideMax = Math.max(0, Math.min(100, this.slideMax));
            }
            this.connected = true;
            return json.result;
        });
    }
    /** Sets the max slide position, from 0 - 100. If fixed is true, then the device will attempt to maintain the same distance between min and max */
    setSlideMax(max, fixed = false) {
        return __awaiter(this, void 0, void 0, function* () {
            max = Math.max(0, Math.min(100, max));
            const json = yield this.putJson("slide", {
                max,
                fixed: fixed || false,
            });
            const offset = max - this.slideMax;
            this.slideMax = max;
            if (fixed) {
                this.slideMin += offset;
                this.slideMin = Math.max(0, Math.min(100, this.slideMin));
            }
            this.connected = true;
            return json.result;
        });
    }
    //---------------------------------------------
    //                  TIMESYNC
    //---------------------------------------------
    /** Gets the current time on the HandyFeeling server */
    getServerTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.getJson("servertime");
            return json.serverTime;
        });
    }
    /** Gets the offset, in milliseconds, between the Handy and the HandyFeeling servers. Updates estimatedServerTimeOffset */
    getServerTimeOffset(trips = 30, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            //don't count the first one
            yield this.getServerTime();
            let offsets = [];
            for (let i = 0; i < trips; i++) {
                const startTime = new Date().valueOf();
                const serverTime = yield this.getServerTime();
                const endTime = new Date().valueOf();
                const rtd = endTime - startTime;
                const estimatedServerTime = serverTime + rtd / 2;
                const offset = estimatedServerTime - endTime;
                offsets.push(offset);
                if (onProgress)
                    onProgress(i / trips);
            }
            //discard all readings more than one standard deviation from the mean, to reduce error
            const mean = offsets.reduce((acc, offset) => acc + offset, 0) / offsets.length;
            const errors = offsets.map(offset => Math.pow(offset - mean, 2));
            const sd = Math.sqrt(errors.reduce((acc, offset) => acc + offset, 0) / errors.length);
            offsets = offsets.filter(offset => Math.abs(offset - mean) < sd);
            //get average offset
            const offsetAggregate = offsets.reduce((acc, offset) => acc + offset) / offsets.length;
            this.estimatedServerTimeOffset = offsetAggregate;
            return this.estimatedServerTimeOffset;
        });
    }
    //---------------------------------------------
    //                  UTILS
    //---------------------------------------------
    enforceConnectionKey() {
        if (!this.connectionKey) {
            this.connected = false;
            throw new Error("connection key not set");
        }
    }
    getUrl(cmd) {
        return baseUrl + cmd;
    }
    catchHttpErrors(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (response.status === 400)
                throw new Error("Bad request");
            if (response.status === 502) {
                this.connected = false;
                throw new Error("Machine not connected");
            }
            if (response.status === 504) {
                this.connected = false;
                throw new Error("Machine timeout");
            }
            const json = yield response.json();
            if (json.result === -1)
                throw new Error("Unknown response error");
            if (json.error) {
                if (json.error.code == 1000 || json.error.code == 1001 || json.error.code == 1002) {
                    this.connected = false;
                }
                else if (json.error.code) {
                    this.connected = true;
                }
                throw new Error(json.error.message);
            }
            return json;
        });
    }
    getJson(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.enforceConnectionKey();
            let url = this.getUrl(path);
            if (params) {
                url +=
                    "?" +
                        Object.keys(params)
                            .map(key => key + "=" + params[key])
                            .join("&");
            }
            // eslint-disable-next-line no-console
            if (this.verbose)
                console.group("GET " + url);
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "X-Connection-Key": this.connectionKey,
                },
            });
            const json = yield this.catchHttpErrors(response);
            if (this.verbose) {
                console.log("Response for GET " + url + ": ", json);
                // eslint-disable-next-line no-console
                console.groupEnd();
            }
            return json;
        });
    }
    putJson(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.enforceConnectionKey();
            const url = this.getUrl(path);
            // eslint-disable-next-line no-console
            if (this.verbose)
                console.group("PUT " + url, data);
            const response = yield fetch(url, {
                method: "PUT",
                headers: {
                    "X-Connection-Key": this.connectionKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const json = yield this.catchHttpErrors(response);
            if (this.verbose) {
                console.log("Response for PUT " + url + ": ", json);
                // eslint-disable-next-line no-console
                console.groupEnd();
            }
            return json;
        });
    }
}
exports.default = Handy;
//# sourceMappingURL=Handy.js.map