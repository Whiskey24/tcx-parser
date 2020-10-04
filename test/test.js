const TrainingFile = require('../dist/trainingFile');

// import { TrainingFile } from "tcx-parser";

let trainingFile = new TrainingFile.TrainingFile();

// let testfile = '1_activity_1_track_1_lap_1_trackpoint.tcx';
// let testfile= '1_activity_1_track_2_lap_many_trackpoints.tcx';
// let testfile= '2_activities_1_track_2_lap_many_trackpoints.tcx';
// let testfile = '2_activities_2_tracks_many_laps_trackpoints.tcx';
// let testfile= 'bike.tcx';
// let testfile = 'bike2.tcx';
// let testfile = 'm.tcx';
// let testfile = 'error_xml.tcx';
let testfile = 'activity_5494687738.tcx';
// let testfile = '22288263.tcx' 
// let testfile = 'fitbit-1.tcx'
// let testfile = 'fitbit-2.tcx'
// let testfile = 'suunto-1.tcx'



const path = require("path");
const { exit } = require('process');
let filepath = path.resolve(__dirname, "./" + testfile);
if (trainingFile.readFromFile(filepath)) {
    // console.log(trainingFile.Activities[0].Laps[0].Tracks[0].Trackpoints[0]);
    console.log(trainingFile.summaryText());
    let testobject = trainingFile.timeSeriesData();
    console.log(trainingFile.summaryObject());
    // console.log(testobject);
    var i;
    // for (i = 50; i < 55; i++) {
    //     console.log(testobject.timeElapsedInMS[i]);
    //     console.log(testobject.timeElapsedSinceEpoch[i]);
    //     console.log(testobject.timeElapsedInMS[i] + "\n");
    //     for (const key in testobject) {
    //         if (testobject.hasOwnProperty(key) && testobject[key][i]) {
    //             console.log(`${key}: ${testobject[key][i]}`);
    //         }
    //     }
    //     console.log("===\n");
    // }

    // console.log(trainingFile.activities[0].Laps[0].Tracks[0].Trackpoints[9].summary());
    // console.log(trainingFile.activities[0].Laps[0]);
}

// const testXmlString = require('./testXmlString');
// if (trainingFile.readFromString(testXmlString.testXmlString)) {
//     console.log(trainingFile.summaryText());
//     console.log(trainingFile.summaryObject());
//     console.log(trainingFile.activities[0].Laps[0].Tracks[0].summaryText());
// }




