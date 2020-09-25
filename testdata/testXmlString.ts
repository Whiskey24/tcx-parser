export const testXmlString: string = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase
  xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd"
  xmlns:ns5="http://www.garmin.com/xmlschemas/ActivityGoals/v1"
  xmlns:ns3="http://www.garmin.com/xmlschemas/ActivityExtension/v2"
  xmlns:ns2="http://www.garmin.com/xmlschemas/UserProfile/v2"
  xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns4="http://www.garmin.com/xmlschemas/ProfileExtension/v1">
  <Activities>
    <Activity Sport="Other">
      <Id>2020-09-13T12:59:00.000Z</Id>
      <Lap StartTime="2020-09-13T12:59:00.000Z">
        <TotalTimeSeconds>757.0</TotalTimeSeconds>
        <DistanceMeters>1000.0</DistanceMeters>
        <MaximumSpeed>1.5399999618530273</MaximumSpeed>
        <Calories>64</Calories>
        <AverageHeartRateBpm>
          <Value>93</Value>
        </AverageHeartRateBpm>
        <MaximumHeartRateBpm>
          <Value>101</Value>
        </MaximumHeartRateBpm>
        <Intensity>Active</Intensity>
        <TriggerMethod>Manual</TriggerMethod>
        <Track>
          <Trackpoint>
            <Time>2020-09-13T12:59:00.000Z</Time>
            <AltitudeMeters>0.20000000298023224</AltitudeMeters>
            <DistanceMeters>2.4800000190734863</DistanceMeters>
            <HeartRateBpm>
              <Value>87</Value>
            </HeartRateBpm>
            <Extensions>
              <ns3:TPX>
                <ns3:Speed>0.0</ns3:Speed>
              </ns3:TPX>
            </Extensions>
          </Trackpoint>
          </Track>
        <Extensions>
          <ns3:LX>
            <ns3:AvgSpeed>1.4138733229712042</ns3:AvgSpeed>
            <ns3:AvgRunCadence>51</ns3:AvgRunCadence>
            <ns3:MaxRunCadence>53</ns3:MaxRunCadence>
          </ns3:LX>
        </Extensions>
      </Lap>
      <Creator xsi:type="Device_t">
        <Name>fenix 5 Plus</Name>
        <UnitId>3321532153</UnitId>
        <ProductID>3110</ProductID>
        <Version>
          <VersionMajor>13</VersionMajor>
          <VersionMinor>0</VersionMinor>
          <BuildMajor>0</BuildMajor>
          <BuildMinor>0</BuildMinor>
        </Version>
      </Creator>
    </Activity>
  </Activities>
  <Author xsi:type="Application_t">
    <Name>Connect Api</Name>
    <Build>
      <Version>
        <VersionMajor>0</VersionMajor>
        <VersionMinor>0</VersionMinor>
        <BuildMajor>0</BuildMajor>
        <BuildMinor>0</BuildMinor>
      </Version>
    </Build>
    <LangID>en</LangID>
    <PartNumber>006-D2449-00</PartNumber>
  </Author>
</TrainingCenterDatabase>`;