import { Track } from './track';

interface AverageHeartRateBpm {
    Value: number
}

interface MaximumHeartRateBpm {
    Value: number
}

interface attr {
    '@_StartTime': string
}

export class Lap {
    public SequenceNr: number;
    public StartTime: string;
    public UnixStartTimeMs: number;
    public Tracks: Track[] = [];
    public TotalTimeSeconds: number;
    public DistanceMeters: number;
    public MaximumSpeed: number;
    public Calories: number;
    public AverageHeartRateBpm: AverageHeartRateBpm;
    public MaximumHeartRateBpm: MaximumHeartRateBpm;
    public Intensity: string;
    public TriggerMethod: string;
    public AvgSpeed: number;
    public AvgRunCadence: number;
    public MaxRunCadence: number;
    private Extensions: string;
    private attr: attr;

    public constructor(sequenceNr: number = 0) {
        this.SequenceNr = sequenceNr;
    }

    public parseProperties() {
        this.StartTime = this.attr['@_StartTime'];
        try {
            this.UnixStartTimeMs = Date.parse(this.StartTime);
        } catch (err) {
            console.error(err);
        }

        // iterate through the extensions properties
        // only expect this to go one level deep (according to the xsd)
        if (this.Extensions) {
            Object.entries(this.Extensions).forEach(([rootkey, rootvalue]) => {
                if (typeof (rootvalue) === 'object') {
                    Object.entries(rootvalue).forEach(([key, value]) => {
                        if (key.endsWith('AvgSpeed')) {
                            this.AvgSpeed = <number>value;
                        } else if (key.endsWith('AvgRunCadence')) {
                            this.AvgRunCadence = <number>value;
                        } else if (key.endsWith('MaxRunCadence')) {
                            this.MaxRunCadence = <number>value;
                        } else {
                            console.error('Extensions node found for trackpoint, but no known properties detected');
                        }
                    });
                }
            });
        }
    }

    // for testing purposes
    public summary(): string {
        let summary: string = `=== Lap ${this.SequenceNr} ===\n`;
        summary += `   Start Time: ${this.StartTime} (Unixtime in ms: ${this.UnixStartTimeMs})\n`;
        summary += `   Distance in m: ${this.DistanceMeters}\n`;
        summary += `   Maximum Speed: ${this.MaximumSpeed}\n`;
        summary += `   Calories: ${this.Calories}\n`;
        summary += `   Heartrate BPM: average=${this.AverageHeartRateBpm.Value} max=${this.MaximumHeartRateBpm.Value}\n`;
        summary += `   Intensity: ${this.Intensity} \n`;
        summary += `   Trigger Method: ${this.TriggerMethod} \n`;
        summary += `   Track count: ${this.Tracks.length} \n`;
        for (var t of this.Tracks) {
            summary += `   Trackpoints track ${t.SequenceNr}: ${t.Trackpoints.length} \n`;
        }
        if (this.AvgSpeed) {
            summary += `   Average Speed: ${this.AvgSpeed}\n`
        }
        if (this.AvgRunCadence) {
            summary += `   Average Run Cadence: ${this.AvgRunCadence}\n`
        }
        if (this.MaxRunCadence) {
            summary += `   max Run Cadence: ${this.MaxRunCadence}\n`
        }
        return summary;
    }

}