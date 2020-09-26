import { TrainingFile } from './trainingFile';
export { TrainingFile };

// ToDo: report back read success/failure (and any messages from parsing?) (try a non-existent file)


let trainingFile = new TrainingFile();

// let testfile: string = '1_activity_1_track_1_lap_1_trackpoint.tcx';
// let testfile: string = '1_activity_1_track_2_lap_many_trackpoints.tcx';
// let testfile: string = '2_activities_1_track_2_lap_many_trackpoints.tcx';
// let testfile: string = '2_activities_2_tracks_many_laps_trackpoints.tcx';
// let testfile: string = 'bike.tcx';
let testfile: string = 'bike2.tcx';
// let testfile: string = 'm.tcx';
// let testfile: string = 'error_xml.tcx';
// let testfile: string = 'activity_5494687738.tcx';

const path = require("path");
let filepath: string = path.resolve(__dirname, "../testdata/" + testfile);
if (trainingFile.readFromFile(filepath)) {
  console.log(trainingFile.summary());
  console.log(trainingFile.activities[0].Laps[0].Tracks[0].Trackpoints[9].summary());
  // console.log(trainingFile.activities[0].Laps[0]);
}

// import { testXmlString } from '../testdata/testXmlString';
// if (trainingFile.readFromString(testXmlString)) {
//   console.log(trainingFile.summary());
// }




