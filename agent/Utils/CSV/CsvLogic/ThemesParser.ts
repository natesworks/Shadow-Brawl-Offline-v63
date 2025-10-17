class ThemesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        ThemesParser.Data = csvData;
    }
    static GetName() { return ThemesParser.Data.map(row => row['Name']); }
    static GetDisabled() { return ThemesParser.Data.map(row => row['Disabled']); }
    static GetFilename() { return ThemesParser.Data.map(row => row['FileName']); }
    static GetExportname() { return ThemesParser.Data.map(row => row['ExportName']); }
    static GetParticlefilename() { return ThemesParser.Data.map(row => row['ParticleFileName']); }
    static GetParticleexportname() { return ThemesParser.Data.map(row => row['ParticleExportName']); }
    static GetParticlestyle() { return ThemesParser.Data.map(row => row['ParticleStyle']); }
    static GetParticlevariations() { return ThemesParser.Data.map(row => row['ParticleVariations']); }
    static GetThememusic() { return ThemesParser.Data.map(row => row['ThemeMusic']); }
    static GetLoadingjingle() { return ThemesParser.Data.map(row => row['LoadingJingle']); }
    static GetLoadingscreen() { return ThemesParser.Data.map(row => row['LoadingScreen']); }
    static GetCustombuttonname() { return ThemesParser.Data.map(row => row['CustomButtonName']); }
}

export default ThemesParser;
