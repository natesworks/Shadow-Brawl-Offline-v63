class SkinAnimSequencesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        SkinAnimSequencesParser.Data = csvData;
    }
    static GetName() { return SkinAnimSequencesParser.Data.map(row => row['Name']); }
    static GetSequencetype() { return SkinAnimSequencesParser.Data.map(row => row['SequenceType']); }
    static GetAnim() { return SkinAnimSequencesParser.Data.map(row => row['Anim']); }
    static GetFace() { return SkinAnimSequencesParser.Data.map(row => row['Face']); }
    static GetEffect() { return SkinAnimSequencesParser.Data.map(row => row['Effect']); }
    static GetLoopanim() { return SkinAnimSequencesParser.Data.map(row => row['LoopAnim']); }
    static GetLoopface() { return SkinAnimSequencesParser.Data.map(row => row['LoopFace']); }
    static GetEnvironmentskin() { return SkinAnimSequencesParser.Data.map(row => row['EnvironmentSkin']); }
    static GetEnvironmentanim() { return SkinAnimSequencesParser.Data.map(row => row['EnvironmentAnim']); }
    static GetNearz() { return SkinAnimSequencesParser.Data.map(row => row['NearZ']); }
    static GetNearzdivisor() { return SkinAnimSequencesParser.Data.map(row => row['NearZDivisor']); }
    static GetFarz() { return SkinAnimSequencesParser.Data.map(row => row['FarZ']); }
    static GetAnimstartsound() { return SkinAnimSequencesParser.Data.map(row => row['AnimStartSound']); }
    static GetFadedoutmusiclevel() { return SkinAnimSequencesParser.Data.map(row => row['FadedOutMusicLevel']); }
}

export default SkinAnimSequencesParser;
