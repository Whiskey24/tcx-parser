"use strict";
exports.__esModule = true;
exports.Parser = void 0;
var fs = require("fs");
var FXP = require("fast-xml-parser");
var class_transformer_1 = require("class-transformer");
var author_1 = require("./author");
var track_1 = require("./track");
var trackpoint_1 = require("./trackpoint");
var lap_1 = require("./lap");
var activity_1 = require("./activity");
// view-source:https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
// view - source: https://www8.garmin.com/xmlschemas/ActivityExtensionv2.xsd
// https://github.com/typestack/class-transformer
/**
 * Provides the parser for the tcx xml data and loads the parsed data
 * into the Trainingfile object that was passed to the constructor
 * @export
 * @class Parser
 */
var Parser = /** @class */ (function () {
    function Parser(trainingFile) {
        this.options = {
            attributeNamePrefix: "@_",
            attrNodeName: "attr",
            textNodeName: "#text",
            ignoreAttributes: false,
            ignoreNameSpace: false,
            allowBooleanAttributes: false,
            parseNodeValue: true,
            parseAttributeValue: false,
            trimValues: true,
            cdataTagName: "__cdata",
            cdataPositionChar: "\\c",
            parseTrueNumberOnly: true,
            arrayMode: false,
            // attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
            // tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
            stopNodes: ["parse-me-as-string"]
        };
        this.trainingFile = trainingFile;
    }
    /**
     * Checks if the provided path is valid, reads the file
     * and checks if it is xml (starts with <?xml), then passes on to parseXMLString
     * @param {string} xmlString tcx compliant xml string to parse
     * @return {*}  {boolean} {boolean} true if successful
     * @memberof Parser
     */
    Parser.prototype.readFromFile = function (xmlFilePath) {
        var xmlString = '';
        try {
            if (fs.existsSync(xmlFilePath)) {
                xmlString = fs.readFileSync(xmlFilePath).toString();
            }
            else {
                console.error("Error, file not found (path given: " + xmlFilePath + ")");
                return false;
            }
        }
        catch (err) {
            console.error(err);
            return false;
        }
        if (!xmlString.startsWith('<?xml')) {
            console.error("Error, file does not seem to be XML (path given: " + xmlFilePath + ")");
            return false;
        }
        // let lineCount = (xmlString.match(/\n/g) || '').length + 1;
        // console.log(`File found and loaded (path given: ${xmlFilePath}, number of lines: ${lineCount})`);
        return this.parseXmlString(xmlString);
    };
    /**
     * Checks if the provided string is xml (starts with <?xml) and passes on to parseXMLString
     *
     * @param {string} xmlString tcx compliant xml string to parse
     * @return {*}  {boolean} {boolean} true if successful
     * @memberof Parser
     */
    Parser.prototype.readFromString = function (xmlString) {
        if (!xmlString.startsWith('<?xml')) {
            console.error("Error, provided string does not seem to be XML (starts with: " + xmlString.substr(0, 10) + ")");
            return false;
        }
        // let lineCount = (xmlString.match(/\n/g) || '').length + 1;
        // console.log(`String loaded (number of lines: ${lineCount})`);
        return this.parseXmlString(xmlString);
    };
    /**
     * Parses the xml string into objects
     *
     * @private
     * @param {string} xmlString tcx compliant xml string to parse
     * @return {*}  {boolean} true if successful
     * @memberof Parser
     */
    Parser.prototype.parseXmlString = function (xmlString) {
        if (FXP.validate(xmlString) !== true) { //optional (it'll return an object in case it's not valid)
            // we cannot parse the xml, return an error
            console.error('Error, cannot parse xml:');
            console.error(FXP.validate(xmlString));
            return false;
        }
        var parsedJson = FXP.parse(xmlString, this.options);
        if (!parsedJson.TrainingCenterDatabase.Author) {
            console.error('Error, cannot find Author node in xml');
            return false;
        }
        if (!parsedJson.TrainingCenterDatabase.Activities) {
            console.log('Error, cannot find Activities node in xml');
            return false;
        }
        if (!parsedJson.TrainingCenterDatabase.Activities.Activity) {
            console.log('Error, cannot find Activity node in xml');
            return false;
        }
        this.trainingFile.author = new author_1.Author();
        try {
            this.trainingFile.author = class_transformer_1.plainToClassFromExist(this.trainingFile.author, parsedJson.TrainingCenterDatabase.Author);
        }
        catch (err) {
            console.error(err);
            return false;
        }
        // Hierarchy: Activities > Activity > Lap > Track > Trackpoint
        var activities = [];
        // we can have one activity as an object or multiple as an array. Make sure we have an array
        var activityArray = [];
        if (Array.isArray(parsedJson.TrainingCenterDatabase.Activities.Activity)) {
            activityArray = parsedJson.TrainingCenterDatabase.Activities.Activity;
        }
        else {
            activityArray.push(parsedJson.TrainingCenterDatabase.Activities.Activity);
        }
        var activityCount = 0;
        for (var _i = 0, activityArray_1 = activityArray; _i < activityArray_1.length; _i++) {
            var activityNode = activityArray_1[_i];
            // Activity section
            var activity = new activity_1.Activity(activityCount);
            if (!activityNode.Lap) {
                console.log('Error, cannot find Lap node in xml');
                return false;
            }
            // we can have one lap as an object or multiple as an array. Make sure we have an array
            // let lapArray: string[] = [];
            var lapArray = [];
            if (Array.isArray(activityNode.Lap)) {
                lapArray = activityNode.Lap;
            }
            else {
                lapArray.push(activityNode.Lap);
            }
            var lapCount = 0;
            for (var _a = 0, lapArray_1 = lapArray; _a < lapArray_1.length; _a++) {
                var lapNode = lapArray_1[_a];
                // Lap section
                var lap = new lap_1.Lap(lapCount);
                lap = class_transformer_1.plainToClassFromExist(lap, lapNode);
                lap.parseProperties();
                if (!lapNode.Track) {
                    console.log('Error, cannot find Track node in xml');
                    return false;
                }
                // we can have one track as an object or multiple as an array. Make sure we have an array
                var trackArray = [];
                if (Array.isArray(lapNode.Track)) {
                    trackArray = lapNode.Track;
                }
                else {
                    trackArray.push(lapNode.Track);
                }
                var trackCount = 0;
                for (var _b = 0, trackArray_1 = trackArray; _b < trackArray_1.length; _b++) {
                    var trackNode = trackArray_1[_b];
                    // Track section
                    var track = new track_1.Track(trackCount);
                    if (!trackNode.Trackpoint) {
                        console.log('Error, cannot find TrackNode node in xml');
                        return false;
                    }
                    // we can have one trackpoint as an object or multiple as an array. Make sure we have an array
                    var tpArray = [];
                    if (Array.isArray(trackNode.Trackpoint)) {
                        tpArray = trackNode.Trackpoint;
                    }
                    else {
                        tpArray.push(trackNode.Trackpoint);
                    }
                    var tpCount = 0;
                    for (var _c = 0, tpArray_1 = tpArray; _c < tpArray_1.length; _c++) {
                        var tpNode = tpArray_1[_c];
                        // Trackpoint section 
                        var trackpoint = new trackpoint_1.Trackpoint(tpCount);
                        trackpoint = class_transformer_1.plainToClassFromExist(trackpoint, tpNode);
                        trackpoint.parseProperties();
                        track.Trackpoints.push(trackpoint);
                        tpCount++;
                        // console.log(trackpoint.oneLineSummary());
                        // Trackpoint section End
                    }
                    lap.Tracks.push(track);
                    trackCount++;
                    // Track section End    
                }
                console.log(lap.summary());
                activity.Laps.push(lap);
                lapCount++;
                // Lap section End
            }
            activityCount++;
            activities.push(activity);
            // Activity section End
        }
        this.trainingFile.activities = activities;
        return true;
        // End of parseXmlString(xmlString: string)
    };
    return Parser;
}());
exports.Parser = Parser;
