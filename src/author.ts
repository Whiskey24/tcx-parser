interface Build {
    Version: {
        VersionMajor: number,
        VersionMinor: number,
        BuildMajor: number,
        BuildMinor: number
    }
}

export class Author {
    public Name: string = '';
    public LangID: string = '';
    public PartNumber: string = '';
    public Build: Build;
    public attr: string;

    public constructor() {
    }

    public version(): string {
        if (this.Build) {
            return `Version ${this.Build.Version.VersionMajor}.${this.Build.Version.VersionMinor}, build ${this.Build.Version.BuildMajor}.${this.Build.Version.BuildMajor}`;
        } else {
            return `No version specified`
        }

    }

    // for testing purposes
    public summaryText(): string {
        let summary: string = `=== Author ===\n`;
        summary += `   Name: ${this.Name}\n`;
        summary += `   LangID: ${this.LangID}\n`;
        summary += `   PartNumber: ${this.PartNumber}\n`;
        if (this.Build) {
            summary += `   Version/Build: Version ${this.Build.Version.VersionMajor}.${this.Build.Version.VersionMinor}, build ${this.Build.Version.BuildMajor}.${this.Build.Version.BuildMajor}\n`;
        }
        return summary;
    }
}