export interface Position {
    LatitudeDegrees: number,
    LongitudeDegrees: number
}

interface HeartRateBpm {
    Value: number
}

export class Trackpoint {
    public SequenceNr: number;
    public Time: string;
    public UnixTimeMs: number;
    public Position: Position;
    public AltitudeMeters: number;
    public DistanceMeters: number;
    public HeartRateBpm: HeartRateBpm;
    public Speed: number | undefined;
    public RunCadence: number | undefined;
    public Watts: number | undefined;
    private Extensions: string;

    public constructor(sequenceNr: number = 0) {
        this.SequenceNr = sequenceNr;
    }

    // parse the properties that cannot be extracted automatically from the xml
    public parseProperties() {
        try {
            this.UnixTimeMs = Date.parse(this.Time);
        } catch (err) {
            console.error(err);
        }

        // iterate through the extensions properties
        if (this.Extensions) {
            Object.entries(this.Extensions).forEach(([rootkey, rootvalue]) => {
                if (rootkey && typeof (rootvalue) === 'object') {
                    Object.entries(rootvalue).forEach(([key, value]) => {
                        if (key.endsWith('Speed')) {
                            this.Speed = <number>value;
                        } else if (key.endsWith('RunCadence')) {
                            this.RunCadence = <number>value;
                        } else if (key.endsWith('Watts')) {
                            this.Watts = <number>value;
                        } else if (key != 'attr') {
                            console.error('Extensions node found for trackpoint, but no known properties detected');
                            console.error(`key: ${key}, value: ${value}`);
                        }
                    });
                }
            });
        }
    }

    // for testing purposes
    public summaryText(): string {
        let summary: string = `=== Trackpoint ${this.SequenceNr} ===\n`;
        summary += `   Time: ${this.Time} (Unixtime in ms: ${this.UnixTimeMs})\n`;
        summary += `   Position: latitude=${this.Position.LatitudeDegrees} longtitude=${this.Position.LongitudeDegrees}\n`;
        summary += `   Altitude in m: ${this.AltitudeMeters}\n`;
        summary += `   Distance in m: ${this.DistanceMeters}\n`;
        if (this.HeartRateBpm) {
            summary += `   Heartrate BPM: ${this.HeartRateBpm.Value}\n`;
        }
        if (this.Speed) {
            summary += `   Speed: ${this.Speed}\n`
        }
        if (this.RunCadence) {
            summary += `   Run Cadence: ${this.RunCadence}\n`
        }
        if (this.Watts) {
            summary += `   Watts: ${this.Watts}\n`
        }
        return summary;
    }

    // for testing purposes
    public oneLineSummaryText(): string {
        if (this.HeartRateBpm) {
            return `${this.SequenceNr} time: ${this.Time} heartrate: ${this.HeartRateBpm.Value}`;
        } else {
            return `${this.SequenceNr} time: ${this.Time}`;
        }

    }

}