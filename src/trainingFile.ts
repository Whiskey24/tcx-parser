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
     * Returns an object with two arrays for time and heart rate BPM
     *
     * @memberof Activity
     */
    public heartRateValues() {
        let timeValues: string[] = [];
        let bpmValues: number[] = [];

        for (var activity of this.activities) {
            for (var lap of activity.Laps) {
                for (var track of lap.Tracks) {
                    for (var trackpoint of track.Trackpoints) {
                        timeValues.push(trackpoint.Time);
                        bpmValues.push(trackpoint.HeartRateBpm.Value);
                    }
                }
            }
        }
        return { 'timeValues': timeValues, 'bpmValues': bpmValues }
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
