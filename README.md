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

## Installation

```sh
npm i thehandy
```

## Getting Started (vanilla JS)

Using the library is a simple matter of initializing an instance of the `Handy` class, setting its connection key, and running commands!

```js
import { Handy } from 'thehandy';

const handy = new Handy();
handy.connectionKey = "ABCD1234";
const versionInfo = await handy.getVersion();
console.log(versionInfo);

//starts automatic stroking at 50% speed
await handy.setMode(1);
await handy.setSpeed(50);
```

## React

I've created a [React wrapper package](https://github.com/defucilis/thehandy-react) to make it easy to use The Handy in a React application using React Context.

## Reference

### Properties

`serverTimeOffset`

  * The time offset (in milliseconds) between the local computer and the Handy servers. 
  * Do not set manually - instead call `getServerTimeOffset()` to update this value.

`connectionKey`

  * The connection key for the conneted Handy, if one exists. 
  * This value is automatically saved to (and loaded from) localStorage, so it should persist between reloads.

### Functions

`setMode(mode: HandyMode)`

  * Sets the Handy's mode. The useful modes are 0 = OFF, 1 = AUTOMATIC and 4 = SYNC. 
  * Note that you can pass the mode in as a number.

`toggleMode(mode: HandyMode)`

  * Toggles the Handy's mode between OFF (mode = 0) and the provided mode. 
  * Note that you can pass the mode in as a number.

`setSpeed(speed: number, absolute?: boolean)`

  * Sets the Handy's speed. 
  * If `absolute` is false (or omitted), `speed` refers to the speed as a percentage from 0 - 100. 
  * If `absolute` is true, `speed` refers to the speed in mm, from 0 - 400.

`setStroke(stroke: number, absolute?: boolean)`

  * Sets the Handy's stroke length. 
  * If `absolute` is false (or omitted), `stroke` refers to the stroke length as a percentage from 0 - 100. 
  * If `absolute` is true, `stroke` refers to the stroke length in mm, from 0 - 114.

`stepSpeed(directionUp: boolean)`

  * Steps the Handy's speed up or down by 10%. 
  * If `directionUp` is true, it will step the speed up. If it's false, it will step the speed down.

`stepStroke(directionUp: boolean)`

  * Steps the Handy's stroke length up or down by 10%. 
  * If `directionUp` is true, it will step the stroke length up. If it's false, it will step the stroke length down.

---

`getVersion()`

  * Gets the current version of the Handy, as well as the most recent available firmware version

`getSettings()`

  * Gets the current mode, position, speed and stroke length of the Handy
 
`getStatus()`

  * Gets the current position and speed of the Handy. I don't really understand why this exists as well as `getSettings`, but it's in the API, so I made it accessible...
 
 ---
 
`getServerTimeOffset(trips = 30)`

  * Calculates and stores the time synchronization delay between your computer and the Handy servers. It's important to run this before performing any synchronization operations to ensure things stay in-sync.
  * Note that this takes some time to do as it performs a number of requests to determine the average delay time. For a sync delay of 100ms, this function will take around 3 seconds to complete.
  * Once this function has been run, the Handy will use it for all future sync operations.
  
---

`syncPrepare(scriptUrl: string, name?: string, size?: number)`

  * Loads a script in CSV format onto the Handy and sets the Handy to SYNC mode
  * The script must be hosted at a static URL
  * Each line in the CSV should be in the format `ts,pos\n`, where `ts` is the time in milliseconds from the beginning of the script, and `pos` is the position of the stroker at that time, from 0 - 100. e.g. `10992,32`
  * Check out my other package, [funscript-utils](https://github.com/defucilis/funscript-utils) for a tools to convert a .funscript file (JSON) into an appropriate CSV 😉
  * The `name` and `size` parameters are optional, and are used to cache scripts on the device. If the name and size are identical to a previously-prepared script, then the machine will use the cached version.
  
`syncPlay(play = true, time = 0)`

  * Starts sync playback
  * This function uses the saved version of `serverTimeOffset`, which defaults to zero
  * If `play` is set to false, then playback will instead be paused
  * `time` refers to the time (in milliseconds) from the start of the script that playback should begin from
  
`syncOffset(offset: number)`

  * Adds a manual offset in milliseconds to all commands
  * Used to fine-tune the action delay by advanced users
  * Note that this value represents the additional wait time that the Handy device itself will wait before acting on incoming `syncPlay` commands

## Workflows

### Managing Connection / Disconnection

Proper guide coming soon - there's no `connect()` funtion - just use `getStatus` or `getVersion` to check whether the device is responding.

### Manual Control

Proper guide coming soon - use `setMode(1)`, `setSpeed` and `setStroke`

## Video Sync

Proper guide coming soon - use `getServerTimeOffset`, then call `syncPrepare` and then `syncPlay`
