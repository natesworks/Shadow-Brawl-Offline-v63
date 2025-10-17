class AvailabilityWindowParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        AvailabilityWindowParser.Data = csvData;
    }
    static GetName() { return AvailabilityWindowParser.Data.map(row => row['Name']); }
    static GetFramelabel() { return AvailabilityWindowParser.Data.map(row => row['FrameLabel']); }
    static GetSkins() { return AvailabilityWindowParser.Data.map(row => row['Skins']); }
    static GetTid() { return AvailabilityWindowParser.Data.map(row => row['TID']); }
}

export default AvailabilityWindowParser;
