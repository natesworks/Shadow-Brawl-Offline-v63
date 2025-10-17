class LocationFeaturesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        LocationFeaturesParser.Data = csvData;
    }
    static GetName() { return LocationFeaturesParser.Data.map(row => row['Name']); }
    static GetMode() { return LocationFeaturesParser.Data.map(row => row['Mode']); }
    static GetLocationtheme() { return LocationFeaturesParser.Data.map(row => row['LocationTheme']); }
    static GetMeshnames() { return LocationFeaturesParser.Data.map(row => row['MeshNames']); }
    static GetCharacter() { return LocationFeaturesParser.Data.map(row => row['Character']); }
    static GetFramedelay() { return LocationFeaturesParser.Data.map(row => row['FrameDelay']); }
}

export default LocationFeaturesParser;
