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
    public Steps: number;
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
        if (this.Extensions) {
            Object.entries(this.Extensions).forEach(([rootkey, rootvalue]) => {
                if (rootkey && typeof (rootvalue) === 'object') {
                    Object.entries(rootvalue).forEach(([key, value]) => {
                        if (key.endsWith('AvgSpeed')) {
                            this.AvgSpeed = <number>value;
                        } else if (key.endsWith('AvgRunCadence')) {
                            this.AvgRunCadence = <number>value;
                        } else if (key.endsWith('MaxRunCadence')) {
                            this.MaxRunCadence = <number>value;
                        } else if (key.endsWith('Steps')) {
                            this.Steps = <number>value;
                        } else if (typeof (value) === 'object') {
                            Object.entries(value as Record<string, string | number>).forEach(([key2, value2]) => {
                                if (key2.endsWith('AvgSpeed')) {
                                    this.AvgSpeed = <number>value2;
                                } else if (key2.endsWith('AvgRunCadence')) {
                                    this.AvgRunCadence = <number>value2;
                                } else if (key2.endsWith('MaxRunCadence')) {
                                    this.MaxRunCadence = <number>value2;
                                } else if (key2.endsWith('Steps')) {
                                    this.Steps = <number>value2;
                                }
                            })
                        } else {
                            console.error('Extensions node found for lap, but no known properties detected');
                            console.error(`key: ${key}, value: ${value}`);
                        }
                    });
                }
            });
        }
    }

    // for testing purposes
    public summaryText(): string {
        let summary: string = `=== Lap ${this.SequenceNr} ===\n`;
        summary += `   Start Time: ${this.StartTime} (Unixtime in ms: ${this.UnixStartTimeMs})\n`;
        summary += `   Distance in m: ${this.DistanceMeters}\n`;
        summary += `   Maximum Speed: ${this.MaximumSpeed}\n`;
        summary += `   Calories: ${this.Calories}\n`;
        if (this.AverageHeartRateBpm && this.MaximumHeartRateBpm) {
            summary += `   Heart Rate BPM: average=${this.AverageHeartRateBpm.Value} max=${this.MaximumHeartRateBpm.Value}\n`;
        }
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
            summary += `   Max Run Cadence: ${this.MaxRunCadence}\n`
        }
        if (this.Steps) {
            summary += `   Steps: ${this.Steps}\n`
        }
        return summary;
    }

}