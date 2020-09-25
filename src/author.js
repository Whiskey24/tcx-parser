"use strict";
exports.__esModule = true;
exports.Author = void 0;
var Author = /** @class */ (function () {
    function Author() {
    }
    Author.prototype.version = function () {
        return "Version " + this.Build.Version.VersionMajor + "." + this.Build.Version.VersionMinor + ", build " + this.Build.Version.BuildMajor + "." + this.Build.Version.BuildMajor;
    };
    // for testing purposes
    Author.prototype.summary = function () {
        var summary = "=== Author ===\n";
        summary += "   Name: " + this.Name + "\n";
        summary += "   LangID: " + this.LangID + "\n";
        summary += "   PartNumber: " + this.PartNumber + "\n";
        summary += "   Version/Build: Version " + this.Build.Version.VersionMajor + "." + this.Build.Version.VersionMinor + ", build " + this.Build.Version.BuildMajor + "." + this.Build.Version.BuildMajor + "\n";
        return summary;
    };
    return Author;
}());
exports.Author = Author;
