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
        let timeElapsedSinceEpoch: string[] = [];    // enable plot of hh:mm:ss for multiple series with different dates
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


    public summaryObject() {
        let activityCount: number = this.activities.length;
        let lapCount: number = 0;
        let trackCount: number = 0;
        let trackpointCount: number = 0;
        let startTimeISO: string = '';
        let totalTimeSeconds: number = 0;
        let totalDistanceMeters: number = 0;
        let maximumSpeed: number = 0;
        let totalCalories: number = 0;
        let maxHeartRateBpm: number = 0;
        let maxRunCadence: number = 0;
        let sportArray: string[] = [];
        let avgHeartRateBpmSum: number = 0;
        let avgHeartRateBpmCount: number = 0;
        let creatorName: string = '';       // assume only one device will create a single tcx file with activities
        let creatorVersion: string = '';
        let creatorBuild: string = '';
        let authorName: string = this.author.Name;
        let authorVersion: string = `${this.author.Build.Version.VersionMajor}.${this.author.Build.Version.VersionMinor}`;
        let authorBuild: string = `${this.author.Build.Version.BuildMajor}.${this.author.Build.Version.BuildMinor}`;

        for (var activity of this.activities) {
            lapCount += activity.Laps.length;
            if (!sportArray.includes(activity.Sport)) {
                sportArray.push(activity.Sport);
            }
            if (activity.Creator) {
                creatorName = activity.Creator.Name;
                creatorVersion = `${activity.Creator.Version.VersionMajor}.${activity.Creator.Version.VersionMinor}`;
                creatorBuild = `${activity.Creator.Version.BuildMajor}.${activity.Creator.Version.BuildMinor}`;
            }
            for (var lap of activity.Laps) {
                if (startTimeISO === '' && lap.StartTime) {
                    startTimeISO = lap.StartTime;
                }
                totalTimeSeconds += lap.TotalTimeSeconds;
                totalDistanceMeters += lap.DistanceMeters;
                totalCalories += lap.TotalTimeSeconds;
                maximumSpeed = (lap.MaximumSpeed > maximumSpeed) ? lap.MaximumSpeed : maximumSpeed;
                if (lap.MaximumHeartRateBpm && lap.MaximumHeartRateBpm.Value > maxHeartRateBpm) {
                    maxHeartRateBpm = lap.MaximumHeartRateBpm.Value;
                }
                if (lap.MaxRunCadence && lap.MaxRunCadence > maxRunCadence) {
                    maxRunCadence = lap.MaxRunCadence;
                }

                trackCount += lap.Tracks.length;
                for (var track of lap.Tracks) {
                    trackpointCount += track.Trackpoints.length;
                    for (var trackpoint of track.Trackpoints) {
                        if (trackpoint.HeartRateBpm) {
                            avgHeartRateBpmSum += trackpoint.HeartRateBpm.Value;
                            avgHeartRateBpmCount++;
                        }
                    }
                }
            }
        }
        let avgHeartRateBpm: number = avgHeartRateBpmCount > 0 ? avgHeartRateBpmSum / avgHeartRateBpmCount : 0;
        let sport: string = sportArray.join();

        return {
            startTimeISO,
            activityCount,
            lapCount,
            trackCount,
            trackpointCount,
            totalTimeSeconds,
            totalDistanceMeters,
            maximumSpeed,
            totalCalories,
            avgHeartRateBpm,
            maxHeartRateBpm,
            maxRunCadence,
            sport,
            creatorName,
            creatorVersion,
            creatorBuild,
            authorName,
            authorVersion,
            authorBuild
        }
    }

    // for testing purposes
    public summaryText(): string {
        let summary: string = '###### Trainingfile Summary ######\n';

        for (var act of this.activities) {
            summary += act.summaryText();
        }

        summary += this.author.summaryText();
        return summary;
    }

}
