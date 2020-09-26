import { Lap } from './lap';

export class Activity {
    public SequenceNr: number;
    public tcx_filename: string = "";
    public activityId: string = "";
    public sport: string = "";
    public Laps: Lap[] = [];

    public constructor(sequenceNr: number = 0) {
        this.SequenceNr = sequenceNr;
    }

    public summary(): string {
        let summary: string = `=== Activity ${this.SequenceNr} ===\n`;
        for (var lap of this.Laps) {
            for (var track of lap.Tracks) {
                summary += `   Lap ${lap.SequenceNr} - track ${track.SequenceNr}: ${track.Trackpoints.length} trackpoints\n`;
            }
        }
        return summary;
    }

}