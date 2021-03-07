# OSXR

Open Source XR Desktop

An electron application which enables devices like the raspberry pi to see and interact with xr websites.

## Architecture

The application consists of 3 layers.

1. electron app - running fullscreen in any window manager
2. chromium plugin - provides webxr functionality to chromium (build on top of https://github.com/immersive-web/webxr-polyfill)
3. home room - home screen for osxr - a webxr website which is installed locally for offline support

At startup the electron app loades the plugin and display the home room website.

## TBD

* support for sensors / input
  * gyro
  * controllers (buttons, ...)
  * inside-out tracking
  * battery power
  * generic bluetooth device?
* home room
  * force enter xr (no enter xr button)
  * control system
    * volume
    * shutdown
  * basic applications
    * keyboard
    * command line
    * file explorer
    * browser