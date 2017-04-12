# A RESTful Roon remote
A tiny Node.js webserver to handle and forward RESTful calls for Roon's API. Uses Node.js and Express.js to accept HTTP GET requests and forward them over websocket to your Roon core, using Roon's API (introduced in 1.3).

### Prerequisites
* Roon 1.3 or newer
* Roon core running on a Raspberry Pi (or other Linux system, including macOS) or Windows
* Node.js and the NPM package manager (installation instructions below)
* **Optional but recommended**: the [Workflow app for iOS](https://workflow.is/)

### Installation
#### Install Node.js (skip this step if Node.js and NPM are already installed).
1. Install Node.js from here: https://nodejs.com/

   * On Windows, install from the above link.
   * On macOS, install using Homebrew: `brew install node` (if you don't have Homebrew install from the link)
   * On Linux, you can use your distribution's package manager, but make sure it installs a recent version of Node.js. Otherwise just install from the above link.
   
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

3. Navigate to the folder in PowerShell or Git Bash (Windows), Terminal (macOS) or whatever Linux distro's bash terminal you're using. Type the following: `npm install`. This will install the Express.js module and dependencies (needed for the webserver), as well as all of the Roon API's dependencies (according to your package.json file).

4. ...
