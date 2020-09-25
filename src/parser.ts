import * as fs from 'fs';
import * as FXP from 'fast-xml-parser';
import { plainToClassFromExist } from 'class-transformer';
import { Author } from './author';
import { Track } from './track';
import { Trackpoint } from './trackpoint';
import { TrainingFile } from '.';
import { Lap } from './lap';
import { Activity } from './activity';

// view-source:https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
// view - source: https://www8.garmin.com/xmlschemas/ActivityExtensionv2.xsd
// https://github.com/typestack/class-transformer

/**
 * Provides the parser for the tcx xml data and loads the parsed data 
 * into the Trainingfile object that was passed to the constructor
 * @export
 * @class Parser
 */
export class Parser {
    private trainingFile: TrainingFile;

    private options = {
        attributeNamePrefix: "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: true,
        arrayMode: false, //"strict"
        // attrValueProcessor: (val, attrName) => he.decode(val, { isAttributeValue: true }),//default is a=>a
        // tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"]
    };

    public constructor(trainingFile: TrainingFile) {
        this.trainingFile = trainingFile;
    }

    /**
     * Checks if the provided path is valid, reads the file
     * and checks if it is xml (starts with <?xml), then passes on to parseXMLString
     * @param {string} xmlString tcx compliant xml string to parse
     * @return {*}  {boolean} {boolean} true if successful
     * @memberof Parser
     */
    public readFromFile(xmlFilePath: string): boolean {
        let xmlString: string = '';
        try {
            if (fs.existsSync(xmlFilePath)) {
                xmlString = fs.readFileSync(xmlFilePath).toString();
            } else {
                console.error(`Error, file not found (path given: ${xmlFilePath})`);
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
        if (!xmlString.startsWith('<?xml')) {
            console.error(`Error, file does not seem to be XML (path given: ${xmlFilePath})`);
            return false;
        }
        // let lineCount = (xmlString.match(/\n/g) || '').length + 1;
        // console.log(`File found and loaded (path given: ${xmlFilePath}, number of lines: ${lineCount})`);
        return this.parseXmlString(xmlString);
    }

    /**
     * Checks if the provided string is xml (starts with <?xml) and passes on to parseXMLString
     *
     * @param {string} xmlString tcx compliant xml string to parse
     * @return {*}  {boolean} {boolean} true if successful
     * @memberof Parser
     */
    public readFromString(xmlString: string): boolean {
        if (!xmlString.startsWith('<?xml')) {
            console.error(`Error, provided string does not seem to be XML (starts with: ${xmlString.substr(0, 10)})`);
            return false;
        }
        // let lineCount = (xmlString.match(/\n/g) || '').length + 1;
        // console.log(`String loaded (number of lines: ${lineCount})`);
        return this.parseXmlString(xmlString);
    }

    /**
     * Parses the xml string into objects
     * 
     * @private
     * @param {string} xmlString tcx compliant xml string to parse
     * @return {*}  {boolean} true if successful
     * @memberof Parser
     */
    private parseXmlString(xmlString: string): boolean {
        if (FXP.validate(xmlString) !== true) { //optional (it'll return an object in case it's not valid)
            // we cannot parse the xml, return an error
            console.error('Error, cannot parse xml:');
            console.error(FXP.validate(xmlString));
            return false;
        }

        let parsedJson = FXP.parse(xmlString, this.options);

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

        this.trainingFile.author = new Author();
        try {
            this.trainingFile.author = plainToClassFromExist(this.trainingFile.author, parsedJson.TrainingCenterDatabase.Author);
        } catch (err) {
            console.error(err);
            return false;
        }

        // Hierarchy: Activities > Activity > Lap > Track > Trackpoint
        let activities: Activity[] = [];

        // we can have one activity as an object or multiple as an array. Make sure we have an array
        let activityArray: Array<any> = [];
        if (Array.isArray(parsedJson.TrainingCenterDatabase.Activities.Activity)) {
            activityArray = parsedJson.TrainingCenterDatabase.Activities.Activity;
        } else {
            activityArray.push(parsedJson.TrainingCenterDatabase.Activities.Activity);
        }

        let activityCount: number = 0;
        for (var activityNode of activityArray) {
            // Activity section
            let activity = new Activity(activityCount);

            if (!activityNode.Lap) {
                console.log('Error, cannot find Lap node in xml');
                return false;
            }

            // we can have one lap as an object or multiple as an array. Make sure we have an array
            // let lapArray: string[] = [];
            let lapArray: Array<any> = [];
            if (Array.isArray(activityNode.Lap)) {
                lapArray = activityNode.Lap;
            } else {
                lapArray.push(activityNode.Lap);
            }

            let lapCount: number = 0;
            for (var lapNode of lapArray) {
                // Lap section
                let lap = new Lap(lapCount);
                lap = plainToClassFromExist(lap, lapNode);
                lap.parseProperties();

                if (!lapNode.Track) {
                    console.log('Error, cannot find Track node in xml');
                    return false;
                }

                // we can have one track as an object or multiple as an array. Make sure we have an array
                let trackArray: Array<any> = [];
                if (Array.isArray(lapNode.Track)) {
                    trackArray = lapNode.Track;
                } else {
                    trackArray.push(lapNode.Track);
                }

                let trackCount: number = 0;
                for (var trackNode of trackArray) {
                    // Track section
                    let track = new Track(trackCount);

                    if (!trackNode.Trackpoint) {
                        console.log('Error, cannot find TrackNode node in xml');
                        return false;
                    }

                    // we can have one trackpoint as an object or multiple as an array. Make sure we have an array
                    let tpArray: Array<any> = [];
                    if (Array.isArray(trackNode.Trackpoint)) {
                        tpArray = trackNode.Trackpoint;
                    } else {
                        tpArray.push(trackNode.Trackpoint);
                    }

                    let tpCount: number = 0;
                    for (var tpNode of tpArray) {
                        // Trackpoint section 
                        let trackpoint = new Trackpoint(tpCount);
                        trackpoint = plainToClassFromExist(trackpoint, tpNode);
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
    }
}


