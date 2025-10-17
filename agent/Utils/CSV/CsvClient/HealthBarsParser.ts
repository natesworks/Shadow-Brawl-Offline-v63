class HealthBarsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        HealthBarsParser.Data = csvData;
    }
    static GetName() { return HealthBarsParser.Data.map(row => row['Name']); }
    static GetFilename() { return HealthBarsParser.Data.map(row => row['FileName']); }
    static GetPlayerexportnametop() { return HealthBarsParser.Data.map(row => row['PlayerExportNameTop']); }
    static GetPlayerexportnamebot() { return HealthBarsParser.Data.map(row => row['PlayerExportNameBot']); }
    static GetEnemyexportnametop() { return HealthBarsParser.Data.map(row => row['EnemyExportNameTop']); }
    static GetEnemyexportnamebot() { return HealthBarsParser.Data.map(row => row['EnemyExportNameBot']); }
    static GetYourteamexportnametop() { return HealthBarsParser.Data.map(row => row['YourTeamExportNameTop']); }
    static GetYourteamexportnamebot() { return HealthBarsParser.Data.map(row => row['YourTeamExportNameBot']); }
}

export default HealthBarsParser;
