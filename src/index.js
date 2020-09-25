"use strict";
exports.__esModule = true;
exports.TrainingFile = void 0;
var trainingFile_1 = require("./trainingFile");
exports.TrainingFile = trainingFile_1.TrainingFile;
// ToDo: report back read success/failure (and any messages from parsing?) (try a non-existent file)
var trainingFile = new trainingFile_1.TrainingFile();
// let testfile: string = '1_activity_1_track_1_lap_1_trackpoint.tcx';
// let testfile: string = '1_activity_1_track_2_lap_many_trackpoints.tcx';
// let testfile: string = '2_activities_1_track_2_lap_many_trackpoints.tcx';
var testfile = '2_activities_2_tracks_many_laps_trackpoints.tcx';
// let testfile: string = 'error_xml.tcx';
// let testfile: string = 'activity_5494687738.tcx';
var path = require("path");
var filepath = path.resolve(__dirname, "../testdata/" + testfile);
if (trainingFile.readFromFile(filepath)) {
    console.log(trainingFile.summary());
    // console.log(trainingFile.activities[0].Laps[0].Tracks[0].Trackpoints[0].summary());
    // console.log(trainingFile.activities[0].Laps[0]);
}
// import { testXmlString } from '../testdata/testXmlString';
// if (trainingFile.readFromString(testXmlString)) {
//   console.log(trainingFile.summary());
// }
