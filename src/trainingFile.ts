import { Author } from './author';
import { Parser } from './parser';
import { Track } from './track';
import { Activity } from './activity';

export class TrainingFile {

    public author: Author;
    public track: Track;
    public activities: Activity[];
    public tcx_filename: string = "";
    public loadedFrom: string;
    public parseSuccessful: boolean;
    private parser: Parser;

    public constructor() {
        this.parser = new Parser(this);
    }

    public readFromFile(xmlFilePath: string): boolean {
        return this.parser.readFromFile(xmlFilePath);
    }

    public readFromString(xmlString: string): boolean {
        return this.parser.readFromString(xmlString);
    }

    /**
     * Returns an object with arrays for each property of trackpoint plus time elapsed in ms and since epoch
     *
     * @memberof Activity
     */
    public timeSeriesData() {
        let timeValue: string[] = [];
        let bpmValue: number[] = [];
        let timeElapsedInMS: number[] = [];
        let timeElapsedSinceEpoch: string[] = [];    // so you can plot hh:mm:ss for multiple series on different dates
        let positionLatitude: number[] = [];
        let positionLongitude: number[] = [];
        let altitudeMeters: number[] = [];
        let distanceMeters: number[] = [];
        let speed: number[] = [];
        let runCadence: number[] = [];
        let watts: number[] = [];
        let lapNr: number[] = [];
        let trackNr: number[] = [];

        let startTimeMs = 0;
        for (var activity of this.activities) {
            for (var lap of activity.Laps) {
                if (startTimeMs === 0) {
                    startTimeMs = new Date(Date.parse(lap.StartTime)).getTime();
                }
                for (var track of lap.Tracks) {
                    for (var trackpoint of track.Trackpoints) {
                        timeValue.push(trackpoint.Time);
                        lapNr.push(lap.SequenceNr);
                        trackNr.push(track.SequenceNr);
                        if (trackpoint.HeartRateBpm) {
                            bpmValue.push(trackpoint.HeartRateBpm.Value);
                        }
                        if (trackpoint.UnixTimeMs) {
                            timeElapsedInMS.push(trackpoint.UnixTimeMs - startTimeMs);
                            timeElapsedSinceEpoch.push(new Date(trackpoint.UnixTimeMs - startTimeMs).toISOString());
                        }
                        if (trackpoint.Position) {
                            positionLatitude.push(trackpoint.Position.LatitudeDegrees);
                            positionLongitude.push(trackpoint.Position.LongitudeDegrees);
                        }
                        if (trackpoint.AltitudeMeters) {
                            altitudeMeters.push(trackpoint.AltitudeMeters);
                        }
                        if (trackpoint.DistanceMeters) {
                            distanceMeters.push(trackpoint.DistanceMeters);
                        }
                        if (trackpoint.Speed) {
                            speed.push(trackpoint.Speed);
                        }
                        if (trackpoint.RunCadence) {
                            runCadence.push(trackpoint.RunCadence);
                        }
                        if (trackpoint.Watts) {
                            watts.push(trackpoint.Watts);
                        }
                    }
                }
            }
        }
        return {
            'timeValue': timeValue,
            'bpmValue': bpmValue,
            'timeElapsedInMS': timeElapsedInMS,
            'timeElapsedSinceEpoch': timeElapsedSinceEpoch,
            'positionLatitude': positionLatitude,
            'positionLongitude': positionLongitude,
            'altitudeMeters': altitudeMeters,
            'distanceMeters': distanceMeters,
            'speed': speed,
            'runCadence': runCadence,
            'watts': watts,
            'lapNr': lapNr,
            'trackNr': trackNr
        }
    }

    public summary(): string {
        let summary: string = '###### Trainingfile Summary ######\n';

        for (var act of this.activities) {
            summary += act.summary();
        }

        summary += this.author.summary();
        return summary;
    }

}
