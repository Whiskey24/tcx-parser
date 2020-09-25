import { Trackpoint } from './trackpoint';

export class Track {
    public Trackpoints: Trackpoint[] = [];
    public SequenceNr: number;

    public constructor(sequenceNr: number = 0) {
        this.SequenceNr = sequenceNr;
    }

}