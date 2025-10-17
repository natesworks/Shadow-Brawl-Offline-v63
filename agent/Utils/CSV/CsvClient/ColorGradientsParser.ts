class ColorGradientsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ColorGradientsParser.Data = csvData;
    }
    static GetName() { return ColorGradientsParser.Data.map(row => row['Name']); }
    static GetColors() { return ColorGradientsParser.Data.map(row => row['Colors']); }
    static GetSpeed() { return ColorGradientsParser.Data.map(row => row['Speed']); }
    static GetScale() { return ColorGradientsParser.Data.map(row => row['Scale']); }
}

export default ColorGradientsParser;
