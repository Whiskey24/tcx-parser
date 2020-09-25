"use strict";
exports.__esModule = true;
exports.Lap = void 0;
var Lap = /** @class */ (function () {
    function Lap(sequenceNr) {
        if (sequenceNr === void 0) { sequenceNr = 0; }
        this.Tracks = [];
        this.SequenceNr = sequenceNr;
    }
    Lap.prototype.parseProperties = function () {
        var _this = this;
        this.StartTime = this.attr['@_StartTime'];
        try {
            this.UnixStartTimeMs = Date.parse(this.StartTime);
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
                        if (key.endsWith('AvgSpeed')) {
                            _this.AvgSpeed = value;
                        }
                        else if (key.endsWith('AvgRunCadence')) {
                            _this.AvgRunCadence = value;
                        }
                        else if (key.endsWith('MaxRunCadence')) {
                            _this.MaxRunCadence = value;
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
    Lap.prototype.summary = function () {
        var summary = "=== Lap " + this.SequenceNr + " ===\n";
        summary += "   Start Time: " + this.StartTime + " (Unixtime in ms: " + this.UnixStartTimeMs + ")\n";
        summary += "   Distance in m: " + this.DistanceMeters + "\n";
        summary += "   Maximum Speed: " + this.MaximumSpeed + "\n";
        summary += "   Calories: " + this.Calories + "\n";
        summary += "   Heartrate BPM: average=" + this.AverageHeartRateBpm.Value + " max=" + this.MaximumHeartRateBpm.Value + "\n";
        summary += "   Intensity: " + this.Intensity + " \n";
        summary += "   Trigger Method: " + this.TriggerMethod + " \n";
        summary += "   Track count: " + this.Tracks.length + " \n";
        for (var _i = 0, _a = this.Tracks; _i < _a.length; _i++) {
            var t = _a[_i];
            summary += "   Trackpoints track " + t.SequenceNr + ": " + t.Trackpoints.length + " \n";
        }
        if (this.AvgSpeed) {
            summary += "   Average Speed: " + this.AvgSpeed + "\n";
        }
        if (this.AvgRunCadence) {
            summary += "   Average Run Cadence: " + this.AvgRunCadence + "\n";
        }
        if (this.MaxRunCadence) {
            summary += "   max Run Cadence: " + this.MaxRunCadence + "\n";
        }
        return summary;
    };
    return Lap;
}());
exports.Lap = Lap;
