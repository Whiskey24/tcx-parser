"use strict";
exports.__esModule = true;
exports.Trackpoint = void 0;
var Trackpoint = /** @class */ (function () {
    function Trackpoint(sequenceNr) {
        if (sequenceNr === void 0) { sequenceNr = 0; }
        this.SequenceNr = sequenceNr;
    }
    // parse the properties that cannot be extracted automatically from the xml
    Trackpoint.prototype.parseProperties = function () {
        var _this = this;
        try {
            this.UnixTimeMs = Date.parse(this.Time);
        }
        catch (err) {
            console.error(err);
        }
        // iterate through the extensions properties
        // only expect this to go one level deep (according to the xsd)
        if (this.Extensions) {
            Object.entries(this.Extensions).forEach(function (_a) {
                var rootkey = _a[0], rootvalue = _a[1];
                if (typeof (rootvalue) === 'object') {
                    Object.entries(rootvalue).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        if (key.endsWith('Speed')) {
                            _this.Speed = value;
                        }
                        else if (key.endsWith('RunCadence')) {
                            _this.RunCadence = value;
                        }
                        else if (key.endsWith('Watts')) {
                            _this.Watts = value;
                        }
                        else {
                            console.error('Extensions node found for trackpoint, but no known properties detected');
                        }
                    });
                }
            });
        }
    };
    // for testing purposes
    Trackpoint.prototype.summary = function () {
        var summary = "=== Trackpoint " + this.SequenceNr + " ===\n";
        summary += "   Time: " + this.Time + " (Unixtime in ms: " + this.UnixTimeMs + ")\n";
        summary += "   Position: latitude=" + this.Position.LatitudeDegrees + " longtitude=" + this.Position.LongitudeDegrees + "\n";
        summary += "   Altitude in m: " + this.AltitudeMeters + "\n";
        summary += "   Distance in m: " + this.DistanceMeters + "\n";
        summary += "   Heartrate BPM: " + this.HeartRateBpm.Value + "\n";
        if (this.Speed) {
            summary += "   Speed: " + this.Speed + "\n";
        }
        if (this.RunCadence) {
            summary += "   Run Cadence: " + this.RunCadence + "\n";
        }
        if (this.Watts) {
            summary += "   Watts: " + this.Watts + "\n";
        }
        return summary;
    };
    // for debugging purposes
    Trackpoint.prototype.oneLineSummary = function () {
        return this.SequenceNr + " time: " + this.Time + " heartrate: " + this.HeartRateBpm.Value;
    };
    return Trackpoint;
}());
exports.Trackpoint = Trackpoint;
