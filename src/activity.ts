import { Lap } from './lap';


interface Creator {
    Name: string;
    UnitId: string;
    ProductID: string;
    Version: {
        VersionMajor: number,
        VersionMinor: number,
        BuildMajor: number,
        BuildMinor: number
    }
}

export class Activity {
    public SequenceNr: number;
    public Id: string;
    public Creator: Creator;
    public Sport: string = "";
    public Laps: Lap[] = [];
    private attr: string;

    public constructor(sequenceNr: number = 0) {
        this.SequenceNr = sequenceNr;
    }

    // parse the properties that cannot be extracted automatically from the xml
    public parseProperties() {
        if (this.attr) {
            Object.entries(this.attr).forEach(([rootkey, rootvalue]) => {
                // console.log(`key: ${rootkey}, value:${rootvalue}`);
                if (rootkey.endsWith('Sport')) {
                    this.Sport = <string>rootvalue;
                } else {
                    console.error('Attr node found for trackpoint, but no known properties detected');
                    console.error(`key: ${rootkey}, value: ${rootvalue}`);
                }
            });
        }
    }

    public summaryText(): string {
        let summary: string = `=== Activity ${this.SequenceNr} ===\n`;
        summary += `   Id: ${this.Id}\n`;
        if (this.Sport) {
            summary += `   Sport: ${this.Sport}\n`;
        } else {
            summary += `   Sport: Not found!\n`;
        }
        if (this.Creator) {
            summary += `   Creator: ${this.Creator.Name}, Version ${this.Creator.Version.VersionMajor}.${this.Creator.Version.VersionMinor}, build ${this.Creator.Version.BuildMajor}.${this.Creator.Version.BuildMajor}\n`;
        }
        for (var lap of this.Laps) {
            for (var track of lap.Tracks) {
                summary += `   Lap ${lap.SequenceNr} - track ${track.SequenceNr}: ${track.Trackpoints.length} trackpoints\n`;
            }
        }
        return summary;
    }

    public versionCreator(): string {
        return `Version ${this.Creator.Version.VersionMajor}.${this.Creator.Version.VersionMinor}, build ${this.Creator.Version.BuildMajor}.${this.Creator.Version.BuildMajor}`;
    }

}