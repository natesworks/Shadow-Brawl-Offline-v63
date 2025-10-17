class SoundsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        SoundsParser.Data = csvData;
    }
    static GetName() { return SoundsParser.Data.map(row => row['Name']); }
    static GetFilenames() { return SoundsParser.Data.map(row => row['FileNames']); }
    static GetBackgroundfile() { return SoundsParser.Data.map(row => row['BackgroundFile']); }
    static GetMinvolume() { return SoundsParser.Data.map(row => row['MinVolume']); }
    static GetMaxvolume() { return SoundsParser.Data.map(row => row['MaxVolume']); }
    static GetMinpitch() { return SoundsParser.Data.map(row => row['MinPitch']); }
    static GetMaxpitch() { return SoundsParser.Data.map(row => row['MaxPitch']); }
    static GetPriority() { return SoundsParser.Data.map(row => row['Priority']); }
    static GetMaximumbytype() { return SoundsParser.Data.map(row => row['MaximumByType']); }
    static GetMaxrepeatms() { return SoundsParser.Data.map(row => row['MaxRepeatMs']); }
    static GetLoop() { return SoundsParser.Data.map(row => row['Loop']); }
    static GetPlayvariationsinsequence() { return SoundsParser.Data.map(row => row['PlayVariationsInSequence']); }
    static GetPlayvariationsinsequencemanualreset() { return SoundsParser.Data.map(row => row['PlayVariationsInSequenceManualReset']); }
    static GetStartdelayminms() { return SoundsParser.Data.map(row => row['StartDelayMinMs']); }
    static GetStartdelaymaxms() { return SoundsParser.Data.map(row => row['StartDelayMaxMs']); }
    static GetPlayonlywheninview() { return SoundsParser.Data.map(row => row['PlayOnlyWhenInView']); }
    static GetMaxvolumescalelimit() { return SoundsParser.Data.map(row => row['MaxVolumeScaleLimit']); }
    static GetNosoundscalelimit() { return SoundsParser.Data.map(row => row['NoSoundScaleLimit']); }
    static GetPadempytoendms() { return SoundsParser.Data.map(row => row['PadEmpyToEndMs']); }
    static GetMovieclipframelabel() { return SoundsParser.Data.map(row => row['MovieClipFrameLabel']); }
}

export default SoundsParser;
