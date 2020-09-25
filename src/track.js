"use strict";
exports.__esModule = true;
exports.Track = void 0;
var Track = /** @class */ (function () {
    function Track(sequenceNr) {
        if (sequenceNr === void 0) { sequenceNr = 0; }
        this.Trackpoints = [];
        this.SequenceNr = sequenceNr;
    }
    return Track;
}());
exports.Track = Track;
