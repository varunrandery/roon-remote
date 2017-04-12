// initialize Roon APIs
var RoonApi = require("node-roon-api"),
    RoonApiTransport = require("node-roon-api-transport"),
    RoonApiStatus = require("node-roon-api-status"),
    transport,
    zones = [];

// initialize Express.js
var express = require('express'),
    app = express();

// create new instance of RoonApi with parameters
var roon = new RoonApi({
    extension_id:        "com.varunrandery.remote",
    display_name:        "Roon remote",
    display_version:     "1.0.0",
    publisher:           "Varun Randery",
    email:               "varun@randery.com",
    website:             "varunrandery.com",

    // handler: on connection with Roon core
    core_paired: function(core) {
        // connect to transport service
        transport = core.services.RoonApiTransport;
        transport.subscribe_zones(function(cmd, data) {
            // on first connection to core, populate zones list and log zone names and ids
            if (cmd == "Subscribed") {
                zones = data.zones;
                for (item in zones) {
                    console.log(zones[item].display_name + ": " + zones[item].zone_id);
                }
            // on zone change, update the zone list
            } else if (cmd == "Changed") {
                if ("zones_added" in data) {
                    for (var item in data.zones_added) {
                        if (! getZoneId(data.zones_added[item].display_name)) {
                            zones.push(data.zones_added[item]);
                        }
                    }
                } else if ("zones_removed" in data) {
                    for (var item in data.zones_removed) {
                        zones.splice(zones.indexOf(transport.zone_by_zone_id(data.zones_removed[item])), 1);
                    }
                }
            // should not fire
            } else {
                console.log("! Unhandled command...");
            }
        });
    },

    // handler: on disconnection from Roon core
    core_unpaired: function(core) {
        console.log("* Lost core")
    }
});

// new instance of status handler
var svc_status = new RoonApiStatus(roon);

// expose the following services to Roon core:
roon.init_services({
    // provide status of extension
    provided_services: [ svc_status ],
    // require access to transport control
    required_services: [ RoonApiTransport ]
});

// set status on connection with core (can be viewed in Roon: Settings -> Extensions)
svc_status.set_status("Extension running...", false);

// start discovery to find Roon core (SUPPORTS SINGLE CORE SETUPS ONLY)
roon.start_discovery();

// function to find zone id from display name given
function getZoneId(zone) {
    for (item in zones) {
        if (zone == zones[item].display_name) {
            return zones[item];
        }
    }
    // zone not found
    return null;
}

// handles transport control
function control(zone, cmd) {
    // commands which are handled with the same identifier
    var standards = ["play", "pause", "next", "previous", "playpause"];
    if (standards.indexOf(cmd) != -1) {
        transport.control(zone, cmd);
    } else if (cmd == "mute" || cmd == "unmute") {
        // transport.mute requires an output not a zone (takes the first output of the zone by default)
        transport.mute(zone.outputs[0], cmd);
    } else if (cmd == "pause_all") {
        transport.pause_all()
    } else {
        console.log("! Command not supported");
        return false;
    }
    console.log("! Command executed");
    return false;
}

// handle incoming HTTP GET formatted like: http://<host>:<port>/api?command=<cmd>&zone=<zone>
// -> where cmd is the command name, such as playpause
// -> and zone is the zone's display name, such as Living Room
// -> the port is the port opened in the next method, 3000 by default
// (zone name must be URL encoded, so 'Living Room' becomes 'Living%20Room')
app.get("/api", function(req, res) {
    // response can be customized as Express.js allows
    if (req.query.command && req.query.zone) {
        res.end();
        console.log("! Command received: " + req.query.command + ", zone: " + req.query.zone);
        var cmd = req.query.command,
            zone = getZoneId(req.query.zone);
        if (zone) {
            console.log("! Zone found: " + zone.zone_id);
            // if the zone is found (i.e. not null) pass to control function
            control(zone, cmd);
        } else {
            console.log("! Error: zone was not found");
        }
    } else if (req.query.fetch) {
        var content = [];
        for (item in zones) {
            content.push(zones[item].display_name);
        }
        res.send(zones);
    }
});

// opens a port (3000 by default, but do change) to listen on
app.listen(3000, function() {
    console.log("* Listening on port 3000")
});
