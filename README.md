# A RESTful Roon remote
A tiny Node.js webserver to handle and forward RESTful calls for Roon's API. Uses Node.js and Express.js to accept HTTP GET requests and forward them over websocket to your Roon core, using Roon's API (introduced in 1.3).

### Prerequisites
*  Roon 1.3 or newer
*  Roon core running on a Raspberry Pi (or other Linux system, including macOS) or Windows
*  Node.js and the NPM package manager (installation instructions below)
*  **Optional but highly recommended**: the [Workflow app for iOS](https://workflow.is/) <br>[See usage instructions below.](#using-workflow-for-ios-as-a-remote)

### Installation and usage
#### Install Node.js (skip this step if Node.js and NPM are already installed).
1. Install Node.js from here: https://nodejs.com/

   *  On Windows, install from the above link.
   *  On macOS, install using Homebrew: `brew install node` (if you don't have Homebrew install from the link).
   *  On Linux, you can use your distribution's package manager, but make sure it installs a recent version of Node.js. Otherwise just install from the above link.
   
2. Check that you are running node 5.x or higher by typing: `node -v`
#### Set up the server
1. On the machine that you want to run the server from (usually best to do so on your Roon core), `git clone` this repository into a suitable location (you may need to install Git if you haven't already, although installing Node.js requires Git).

2. Look inside the _package.json_ file inside the folder. You should see something like this:
   ```
   {
      "name": "roon-remote",
      "version": "1.0.0",
      "description": "Remote to control my Roon setup.",
      "main": "app.js",
      "dependencies": {
         "express": "^4.15.2",
         "node-roon-api": "github:roonlabs/node-roon-api",
         "node-roon-api-status": "github:roonlabs/node-roon-api-status",
         "node-roon-api-transport": "github:roonlabs/node-roon-api-transport"
      }
   }
   ```
   This file tells Node.js what to install in the next step. You can change the name and description here, but the rest of the file should remain unchanged (unless in future you need to install new dependencies, in which case you should ass to the dependencies list and run `npm install` again. For now, move on the step 3.

3. Navigate to the folder in PowerShell or Git Bash (Windows), Terminal (macOS) or whatever Linux distro's bash terminal you're using. Type the following: 
   ```
   npm install
   ```
   This will install the Express.js module and dependencies (needed for the webserver), as well as all of the Roon API's dependencies (according to your package.json file).

4. Next, test your server by typing: 
   ```
   node .
   ``` 
   If all goes well, you should see some very verbose console output, which eventually begins to 'ping':
   ```
   <- REQUEST 1 com.roonlabs.ping:1/ping 
   -> COMPLETE 1 Success 
   <- REQUEST 1 com.roonlabs.ping:1/ping 
   -> COMPLETE 1 Success 
   <- REQUEST 2 com.roonlabs.ping:1/ping 
   -> COMPLETE 2 Success 
   <- REQUEST 2 com.roonlabs.ping:1/ping 
   -> COMPLETE 2 Success 
   ...
   ```
   If this happens, the API has successfully connected to your Roon core. If you encounter any error messages here, try starting the process again as root, verifying that your Roon core is up and accessible, and that you have at minimum Roon 1.3.

5. Finally, to allow the extension to communicate with your Roon core, go to _Settings_ -> _Extensions_ inside Roon and click _Enable_ next to the extension. It should show a status of: 'Extension running...'.

6. To make a request, format your HTTP GET like this:
   ```
   http://<server>:3000/api?command=<command>&zone=<zone_display_name>
   ```
   Where _\<server\>_ is your host's IP address, _\<command\>_ is the control action to perform, which can be any of the following (from the [Roon Transport API docs](https://roonlabs.github.io/node-roon-api-transport/RoonApiTransport.html)):
   ```
   "play" - If paused or stopped, start playback
   "pause" - If playing or loading, pause playback
   "playpause" - If paused or stopped, start playback. If playing or loading, pause playback.
   "previous" - Go to the start of the current track, or to the previous track
   "next" - Advance to the next track
   ```
   _\<zone\>_ should be the zone's display name, URL encoded. For instance, _Living Room_ becomes _Living%20Room_.
#### Running the server as a service
There are a number of ways to run a Node.js server as a service in Windows, macOS or Linux. I recommend using [node-windows](https://www.npmjs.com/package/node-windows) (which has sister variants for macOS and Linux, [node-mac](https://github.com/coreybutler/node-mac) and [node-linux](https://github.com/coreybutler/node-linux) respectively).

### Using Workflow for iOS as a remote
On an iOS device (how I use the extension), you can use the Workflow app for iOS to send HTTP GET requests. I recommend you set up Workflow like this:
1. Download the [Workflow app](https://workflow.is/) from the App Store.
2. Click this link on the iOS device: https://workflow.is/workflows/7bf76714e84a4030a1af292fe40cf02b
3. During the workflow import, enter your Node.js server's IP address and the port you're using (3000 by default).
If you have the Today Widget in the Notification Center, you can start the workflow from there; it should populate a list of zones by querying the Node.js server.

### Getting in touch + pull requests
*  If you have any questions / comments, submit an issue or send me an email at [varun@randery.com](mailto:varun@randery.com).
*  Feel free to start a pull request if you have any ideas.
