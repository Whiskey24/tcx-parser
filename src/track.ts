import { Trackpoint } from './trackpoint';

export class Track {
    public Trackpoints: Trackpoint[] = [];
    public SequenceNr: number;

    public constructor(sequenceNr: number = 0) {
        this.SequenceNr = sequenceNr;
    }

    // for testing purposes
    public summaryText(): string {
        let summary: string = `=== Track ${this.SequenceNr} ===\n`;
        summary += `   Trackpoint count: ${this.Trackpoints.length}\n`
        return summary;
    }
}