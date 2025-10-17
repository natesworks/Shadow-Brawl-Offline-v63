class MusicParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        MusicParser.Data = csvData;
    }
    static GetName() { return MusicParser.Data.map(row => row['Name']); }
    static GetDisabled() { return MusicParser.Data.map(row => row['Disabled']); }
    static GetFilename() { return MusicParser.Data.map(row => row['FileName']); }
    static GetBackgroundfile() { return MusicParser.Data.map(row => row['BackgroundFile']); }
    static GetFallbackmusic() { return MusicParser.Data.map(row => row['FallBackMusic']); }
    static GetVolume() { return MusicParser.Data.map(row => row['Volume']); }
    static GetLoop() { return MusicParser.Data.map(row => row['Loop']); }
    static GetPlaycount() { return MusicParser.Data.map(row => row['PlayCount']); }
    static GetMovieclipframelabel() { return MusicParser.Data.map(row => row['MovieClipFrameLabel']); }
}

export default MusicParser;
