"use strict";
exports.__esModule = true;
exports.TrainingFile = void 0;
var parser_1 = require("./parser");
var TrainingFile = /** @class */ (function () {
    function TrainingFile() {
        this.parser = new parser_1.Parser(this);
    }
    TrainingFile.prototype.readFromFile = function (xmlFilePath) {
        return this.parser.readFromFile(xmlFilePath);
    };
    TrainingFile.prototype.readFromString = function (xmlString) {
        return this.parser.readFromString(xmlString);
    };
    TrainingFile.prototype.summary = function () {
        var summary = '###### Trainingfile Summary ######\n';
        for (var _i = 0, _a = this.activities; _i < _a.length; _i++) {
            var act = _a[_i];
            summary += act.summary();
        }
        summary += this.author.summary();
        return summary;
    };
    return TrainingFile;
}());
exports.TrainingFile = TrainingFile;
