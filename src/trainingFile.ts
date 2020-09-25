import { Author } from './author';
import { Parser } from './parser';
import { Track } from './track';
import { Activity } from './activity';

export class TrainingFile {
    public author: Author;
    public track: Track;
    public activities: Activity[];
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

    public summary(): string {
        let summary: string = '###### Trainingfile Summary ######\n';

        for (var act of this.activities) {
            summary += act.summary();
        }

        summary += this.author.summary();
        return summary;
    }

}
