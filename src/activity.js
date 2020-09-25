"use strict";
exports.__esModule = true;
exports.Activity = void 0;
var Activity = /** @class */ (function () {
    function Activity(sequenceNr) {
        if (sequenceNr === void 0) { sequenceNr = 0; }
        this.tcx_filename = "";
        this.activityId = "";
        this.sport = "";
        this.Laps = [];
        this.SequenceNr = sequenceNr;
    }
    Activity.prototype.summary = function () {
        var summary = "=== Activity " + this.SequenceNr + " ===\n";
        for (var _i = 0, _a = this.Laps; _i < _a.length; _i++) {
            var lap = _a[_i];
            for (var _b = 0, _c = lap.Tracks; _b < _c.length; _b++) {
                var track = _c[_b];
                summary += "   Lap " + lap.SequenceNr + " - track " + track.SequenceNr + ": " + track.Trackpoints.length + " trackpoints\n";
            }
        }
        return summary;
    };
    return Activity;
}());
exports.Activity = Activity;
