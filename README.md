# SteelSeries Browser Cinema Extension

Extension for Chromium-based browsers (Chromium, Chrome, Vivaldi, Edge, Yandex.Browser) that allows to setup reactions for your SteelSeries devices on event when browser enters fullscreen mode.

> Currently it works only with [SteelSeries GG](https://steelseries.com/gg) on Windows

## Why?

Having gaming devices with fancy RGB led feels great, but it might become annoying while you are trying to watch movies or youtube video. This extension just allows to setup your device settings when browsers enters fullscreen mode. When browsers leaves fullscreen your device settings will drop to previous state before fullscreen event.

## Setup

1. Make sure you have installed [Steelseries GG](https://steelseries.com/gg) and configured your device inside [Engine tab](https://steelseries.com/engine)
2. Install `StellSeries Browser Cinema` extension
3. After success install inside [Engine -> Apps Tab in SteelSeries GG](https://steelseries.com/engine/apps) should appear new game named `Browser Cinema`
4. Go into `Browser Cinema` game
5. Choose `Event in Game -> FULLSCREEN`
6. Here you can setup your device reaction for browser fullscreen mode (I prefer to set it all to single black color that mean led will be turned off completely)
7. Repeat device set up for every of your devices

## Caveats

- Currently supports only `Windows`
- Only default `SteelSeries GG` installation is supported (inside `C:/ProgramData/SteelSeries/SteelSeries Engine 3/`)
- The extension only works for web pages opened in fullscreen only for browser with enabled extension

## Troubleshooting

### Cannot find game `Browser Cinema`

Try to reinstall extension as game is registered only on extension install

### Device state doesn't reflect browser mode

Make sure `SteelSeries GG` is running and extension is enabled in browser

### No answer on my question

Please create Issue on [GitHub](https://github.com) with detailed report

## How does it work

### Docs

- [How to write Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- [SteelSeries SDK](https://github.com/SteelSeries/gamesense-sdk)

### Internals

1. Extension is trying to load info about running `SteelSeries Plugin Server` from file `C:/ProgramData/SteelSeries/SteelSeries Engine 3/`
2. On installation extension register new game `Browser Cinema` in `SteelSeries Plugin Server`
3. When browser changes its fullscreen mode the extensions send event `Fullscreen` to `SteelSeries Plugin Server`

## Credits

### Icons

Icons made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/)
