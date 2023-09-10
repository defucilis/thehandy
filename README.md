<h1 align="center">
  <a href='https://github.com/defucilis/thehandy'>TheHandy</a> - A TypeScript wrapper around The Handy API
</h1>

<p align="center">
  <a href='https://www.npmjs.com/package/thehandy'>
      <img src="https://img.shields.io/npm/v/thehandy.svg" />
  </a>
  <a href='https://simple.wikipedia.org/wiki/MIT_License'>
      <img src="https://img.shields.io/badge/license-MIT-lightgrey" />
  </a>
  <img src="https://img.shields.io/bundlephobia/minzip/thehandy" />
  <img src="https://img.shields.io/npm/dw/thehandy" />
</p>

# Installation

```sh
npm i thehandy
```

# Getting Started (vanilla JS)

Using the library is a simple matter of initializing an instance of the `Handy` class, setting its connection key, and running commands!

**Important**: The API for this package has been completely rewritten from v1.x onwards to use the new v2 API from SweetTech, and is *not* compatible with previous versions. A version of the Handy class using calls to the old API exists as `HandyLegacy`, but I'm no longer worrying about keeping it up-to-date or bug-free. I strongly recommend that you switch to APIv2.

Using this library assumes an understanding of how the Handy API operates - specifically with regard to the newly differentiated modes - HAMP, HSSP, HDSP and HSTP.

```js
import { Handy } from 'thehandy';

//initialize a new Handy object and set its connection key
const handy = new Handy();
handy.connectionKey = "ABCD1234";

//you can request info about the Handy
const info = await handy.getInfo();
console.log(`Handy conneted with firmware ${info.fwVersion}`);

//you can send requests to the Handy API
await handy.setMode(HandyMode.hamp);
await handy.setHampStart();
await handy.setHampVelocity(50);
```

# Handy State

Something to keep in mind when using this library is that while an effort has been made to make all the commands 'just work', the Handy requires you to set the mode and status to certain operations to run certain commands. For example, `setHampVelocity` will return an error if you try to call it when the Handy is not in HAMP mode.

While the Handy class makes an attempt to keep track of the Handy's internal state and to make the appropriate `setMode` calls (among others) to ensure your commands work, **there are no guarantees that the Handy's state hasn't been changed from another application, or by the user**. 

So you should have appropriate logic in your application to handle these cases. In the example above, simply calling `await handy.setHampVelocity(50)` will generally work, as the library will detect that it needs to both run `setMode(HandyMode.hamp)` and `setHampStart()`, but to be safe, these calls were made explicitly first, to make certain that the Handy would be in the correct mode.

# React

I've created a [React wrapper package](https://github.com/defucilis/thehandy-react) to make it easy to use The Handy in a React application using React Context.

# Reference (`Handy` class)

## Properties

`verbose` (`boolean`)
  * If true, will log all HTTP requests and responses to the console

`connectionKey` (`string`)
  * The current connection key for the Handy - whether valid or not
  * The `Handy` class Will attempt to automatically store/retrieve this value from localStorage under the key `connectionKey`

`connected` (`false`)
  * Whether the Handy is currecntly connected. 
  * Updated whenever a request succeeds (or fails), or when getConnected is called.

`info` (`HandyInfo | undefined`)
  * Hardware and Firmware info of the Handy. 
  * Undefined until you call getInfo

`currentMode` (`HandyMode`)
  * Current mode of the Handy. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`hampState` (`HampState`)
  * Whether HAMP is currently running. Updated when calling setHampStart or setHampStop. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`hampVelocity` (`number`)
  * Current HAMP velocity, from 0 to 100. 
  * Updated when calling setHampVelocity. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`hdspPosition` (`number`)
  * Current target HDSP position of the slider. 
  * Updated when calling any of the setHdsp methods. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`hsspState` (`HsspState`)
  * HSSP playing state. Set when calling setHsspPlay or setHsspStop. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`hsspLoop` (`boolean`)
  * Whether HSSP loop is turned on. Set when calling setHsspLoop. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`hsspPreparedUrl` (`string`)
  * URL of prepared CSV file for HDSP playback. 
  * Set when calling setHsspSetup. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`hstpTime` (`number`)
  * Estimated server time. 
  * Only really valid immediately after calling getHstpSync.

`hstpOffset` (`number`)
  * Server-time offset of the Handy. 
  * Set when calling getServerTimeOffset. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`hstpRtd` (`number`)
  * Round-trip delay from the Handy to the server and back, in milliseconds. 
  * Updated when calling getHstpRtd.

`estimatedServerTimeOffset` (`number`)
  * The estimated offset time between the Handy and the server
  * Updated by calling getServerTimeOffset

`slideMin` (`number`)
  * Min slide position of the Handy, used in all modes. Set when calling setSlideSettings. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`slideMax` (`number`)
  * Max slide position of the Handy, used in all modes. Set when calling setSlideSettings. 
  * Not guaranteed to be accurate as this may change from other sources than this API

`slidePositionAbsolute` (`number`)
  * The physical position of the slider in mm from the bottom. 
  * Updated when calling getSlidePositionAbsolute. 
  * Obviously, any movement after this point will make this value useless

## Methods

Note - *all* methods on the Handy class are async!

### Base

`getMode`
  * Gets the mode the Handy is currently in
  * Inputs: `none`
  * Outputs: `Promise<HandyMode>`

`setMode`
  * Sets the Handy to a new mode.
  * Inputs: `(mode: HandyMode)`
  * Outputs: `Promise<SetModeResult>`

`getConnected`
  * Determines whether the Handy is currently connected or not
  * Inputs: `none`
  * Outputs: `Promise<boolean>`

`getInfo`
  * Returns information about the device; hardware version, firmware version, firmware status, firmware branch and device model.
  * Inputs: `none`
  * Outputs: `Promise<HandyInfo>`

`getSettings`
  * Returns min and mix slider position
  * Inputs: `none`
  * Outputs: `Promise<HandySettings>`

`getStatus`
  * A convenient endpoint for fetching the current mode of the device and the state within the current mode. 
  * For modes with a single state, the returned state value will always be 0. 
  * For modes with multiple states, see the schema definition for possible values.
  * Inputs: `none`
  * Outputs: `Promise<HandyStatus>`

### HAMP

`setHampStart`
  * Starts HAMP movement
  * Puts the Handy in HAMP mode first, if it isn't already in HAMP mode.
  * Inputs: `none`
  * Outputs: `Promise<SetHampStateResult>`

`setHampStop`
  * Stops HAMP movement
  * Puts the Handy in HAMP mode first, if it isn't already in HAMP mode.
  * Inputs: `none`
  * Outputs: `Promise<SetHampStateResult>`

`getHampState`
  * Gets the current HAMP state
  * Puts the Handy in HAMP mode first, if it isn't already in HAMP mode
  * Inputs: `none`
  * Outputs: `Promise<{ result: GenericResult; state: HampState }>`

`getHampVelocity`
  * Gets the current HAMP velocity, from 0 - 100
  * Puts the handy in HAMP mode first, if it isn't already in HAMP mode
  * Inputs: `none`
  * Outputs: `Promise<number>`

`setHampVelocity`
  * Sets the current HAMP velocity, from 0 - 100
  * Puts the handy in HAMP mode first, if it isn't already in HAMP mode
  * Inputs: `(velocity: number)`
  * Outputs: `Promise<GenericResult>`

### HDSP

`setHdspXaVa`
  * Sets the next absolute position (xa) of the device, and the absolute velocity (va) the device should use to reach the position. 
  * Puts the Handy in HDSP mode, if it isn't already in HDSP mode
  * Inputs: `(positionAbsolute: number, velocityAbsolute: number, stopOnTarget?: boolean)`
  * Outputs: `Promise<SetHdspResult>`

`setHdspXpVa`
  * Sets the next percent position (xp) of the device, and the absolute velocity (va) the device should use to reach the position. 
  * Puts the Handy in HDSP mode, if it isn't already in HDSP mode
  * Inputs: `(positionPercentage: number, velocityAbsolute: number, stopOnTarget?: boolean)`
  * Outputs: `Promise<SetHdspResult>`

`setHdspXpVp`
  * Sets the next percent position (xp) of the device, and the percent velocity (vp) the device should use to reach the position. 
  * Puts the Handy in HDSP mode, if it isn't already in HDSP mode
  * Inputs: `(positionPercentage: number, velocityPercentage: number, stopOnTarget?: boolean)`
  * Outputs: `Promise<SetHdspResult>`

`setHdspXaT`
  * Sets the next absolute position (xa) of the device, and the time (t) the device should use to reach the position. 
  * Puts the Handy in HDSP mode, if it isn't already in HDSP mode
  * Inputs: `(positionAbsolute: number, durationMilliseconds: number, stopOnTarget?: boolean)`
  * Outputs: `Promise<SetHdspResult>`

`setHdspXpT`
  * Sets the next percent position (xp) of the device, and the time (t) the device should use to reach the position. 
  * Puts the Handy in HDSP mode, if it isn't already in HDSP mode
  * Inputs: `(positionPercentage: number, durationMilliseconds: number, stopOnTarget?: boolean)`
  * Outputs: `Promise<SetHdspResult>`

### HSSP

`setHsspPlay`
  * Starts HSSP playback, if a script has already been prepared. 
  * Can be used to skip to a timecode in ms from the start of the script. 
  * Pass in an estimated server time to ensure proper sync. 
  * Puts the handy in HSSP mode, if it isn't already in HSSP mode.
  * Inputs: `(playbackPosition?: number, serverTime?: number)`
  * Outputs: `Promise<GenericResult>`

`setHsspStop`
  * Stops HSSP playback, if a script has already been prepared. 
  * Puts the handy in HSSP mode, if it isn't already in HSSP mode.
  * Inputs: `none`
  * Outputs: `Promise<GenericResult>`

`setHsspSetup`
  * Setup script synchronization by providing the device with an URL from where the script can be downloaded. 
  * The device need to be able to access the URL for setup to work. 
  * If the sha-256 value of the script is provided, the device will only download the script if it can not be found in the device cache. 
  * Puts the Handy in HSSP mode, if it isn't already in HSSP mode
  * Inputs: `(url: string, sha256?: string)`
  * Outputs: `Promise<HsspSetupResult>`

`getHsspLoop`
  * Determines whether the Handy has HSSP loop turned on. 
  * Puts the Handy in HSSP mode, if it isn't already in HSSP mode.
  * Inputs: `none`
  * Outputs: `Promise<boolean>`

`setHsspLoop`
  * Enables or disables loop mode in HSSP. 
  * Puts the Handy in HSSP mode, if it isn't already in HSSP mode
  * Inputs: `(loop: boolean)`
  * Outputs: `Promise<GenericResult>`

`getHsspState`
  * Returns the current HSSP state. 
  * Puts the Handy in HSSP mode, if it isn't already in HSSP mode.
  * Inputs: `none`
  * Outputs: `Promise<HsspState>`

### HSTP

`getHstpTime`
  * Get the current time of the device. 
  * When the device and the server time is synchronized, this will be the server time estimated by the device.
  * Inputs: `none`
  * Outputs: `Promise<number>`

`getHstpOffset`
  * Gets the current manual offset of the Handy in milliseconds. 
  * Negative values mean that the script will be delayed, positive values mean that the script will be advanced.
  * Inputs: `none`
  * Outputs: `Promise<number>`

`setHstpoffset`
  * Sets the current manual offset of the Handy in milliseconds. 
  * Negative values mean that the script will be delayed, positive values mean that the script will be advanced.
  * Inputs: `(offset: number)`
  * Outputs: `Promise<GenericResult>`

`getHstpRtd`
  * Gets the current round-trip delay from the Handy to the server and back, in milliseconds. Used for synchronization.
  * Inputs: `none`
  * Outputs: `Promise<number>`

`getHstpSync`
  * Syncronizes the device with the server clock and calculates the round-trip-delay between the device and the server. 
  * As far as I can tell, this just doesn't work. I suggest using `getServerTimeOffset` instead.
  * Inputs: `(syncCount = 30, outliers = 6)`
  * Outputs: `Promise<GenericResult & { time: number; rtd: number }>`

### Slide

`getSlideSettings`
  * Gets the min and max slide positions from 0 - 100
  * Inputs: `none`
  * Outputs: `Promise<SlideInfo>`

`getSlidePositionAbsolute`
  * Gets the current position of the slider in mm from the bottom position
  * Inputs: `none`
  * Outputs: `Promise<number>`

`setSlideSettings`
  * Sets the min and max slide positions from 0 - 100
  * Inputs: `(min: number, max: number)`
  * Outputs: `Promise<GenericResult>`

`setSlideMin`
  * Sets the min slide position, from 0 - 100. 
  * If fixed is true, then the device will attempt to maintain the same distance between min and max
  * Inputs: `(min: number, fixed = false)`
  * Outputs: `Promise<GenericResult>`

`setSlideMax`
  * Sets the max slide position, from 0 - 100. 
  * If fixed is true, then the device will attempt to maintain the same distance between min and max
  * Inputs: `(max: number, fixed = false)`
  * Outputs: `Promise<GenericResult>`

### Time

`getServerTime`
  * Gets the current time on the HandyFeeling server
  * Inputs: `none`
  * Outputs: `Promise<number>`

`getServerTimeOffset`
  * Gets the offset, in milliseconds, between the Handy and the HandyFeeling servers. 
  * Updates estimatedServerTimeOffset
  * Inputs: `(trips = 30, onProgress?: (progress: number) => void)`
  * Outputs: `Promise<number>`


# Reference (`HandyUtils` class)

## Static Methods

`uploadCsv`
  * Takes a CSV file and uploads it to the publicly-provided Handy server, to obtain a URL that can be sent to the Handy using `setHsspSetup`
  * Inputs: `(csv: File, filename?: string)`
  * Outputs: `Promise<string>`