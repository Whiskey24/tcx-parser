## tcx-parser

## Description
A javascript library for parsing TCX (Training Center XML) files from Garmin devices into objects for Trainingfile, Activity, Lap, Track and Trackpoint. 

Can take input from a file or string. 

## Installation

```bash
npm i tcx-parser
```


## Usage

### Getting started
Import TrainingFile from tcx-parser and initialize a TrainingFile object
```
import { TrainingFile } from "tcx-parser";
let trainingFile = new TrainingFile();
```

Then read in data from a file with `readFromFile(filepath)` or pass a string with `readFromString(xmlData)`. Each function which will return *true* if successful and *false* if not. If the data could not be parsed successfully an error message will be reported in the console.

Each object has a function `summaryText()` that will return a string with a small summary for testing purposes. TrainingFile also provides a `summaryObject()` function that returns an object with key details.

Read from string example:
````
if (trainingFile.readFromString(data)) {
    console.log(trainingFile.summaryText());
    console.log(trainingFile.summaryObject());
} else {
    // handle unsuccessful parsing of data
}
````
Filepath example:
````
if (trainingFile.readFromFile(filepath)) {
    console.log(trainingFile.summaryText());
    console.log(trainingFile.summaryObject());
} else {
    // handle unsuccessful parsing of data
}
````

### Object data
There are 5 classes in this order/hierarchy:
 
* TrainingFile of type `TrainingFile`
  * Author of type `Author`
  * Activities of type `Activity`
    * Laps of type `Lap`
       * Tracks of type `Track`
          * Trackpoints of type `Trackpoint`
  

So each TrainingFile contains one or more Activities, which contain one or more Laps, which contain one or more Tracks which contain one or (hopefully!) more Trackpoints.

You can access the objects directly, e.g. `trainingFile.Activities[0].Laps[0].Tracks[0].Trackpoints[0]` will give you the first found trackpoint object.

### Time series data
TrainingFile also provides a `timeSeriesData()` function that will return an object of arrays for the measured values per time point (i.e. trackpoint). Values are not rounded and stored as found in the XML data. The object contains these arrays (if corresponding data was found in the parsed XML data):




| key                   | value type | description                                     | example                  |
| --------------------- | ---------- | ----------------------------------------------- | ------------------------ |
| timeValue             | string     | ISO Time value                                  | abc                      |
| bpmValue              | number     | heart beat value                                | 110                      |
| timeElapsedInMS       | number     | time elasped in ms since first trackpoint       | 1000                     |
| timeElapsedSinceEpoch | string     | time elapsed from epoch in ISO time format      | 1970-01-01T00:00:01.000Z |
| positionLatitude      | number     | latitude of position                            | 51.99646954424679        |
| positionLongitude     | number     | longitude of position                           | 4.372353488579392        |
| altitudeMeters        | number     | altitude in meters as recorded                  | 0.20000000298023224      |
| distanceMeters        | number     | distance in meters as recorded                  | 3.259999990463257        |
| speed                 | number     | speed in m/s                                    | 3.302999973297119        |
| runCadence            | number     | cadence in steps per minute (spm)               | 166                      |
| watts                 | number     | power in watts                                  | 138                      |
| lapNr                 | number     | lap number of this trackpoint (starts with 0)   | 0                        |
| trackNr               | number     | track number of this trackpoint (starts with 0) | 0                        |
