class AnimationsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        AnimationsParser.Data = csvData;
    }
    static GetName() { return AnimationsParser.Data.map(row => row['Name']); }
    static GetFilename() { return AnimationsParser.Data.map(row => row['FileName']); }
    static GetStartframe() { return AnimationsParser.Data.map(row => row['StartFrame']); }
    static GetEndframe() { return AnimationsParser.Data.map(row => row['EndFrame']); }
    static GetFacefreezeframe() { return AnimationsParser.Data.map(row => row['FaceFreezeFrame']); }
    static GetSpeed() { return AnimationsParser.Data.map(row => row['Speed']); }
    static GetTransitioninms() { return AnimationsParser.Data.map(row => row['TransitionInMs']); }
    static GetTransitionoutms() { return AnimationsParser.Data.map(row => row['TransitionOutMs']); }
    static GetAutofadems() { return AnimationsParser.Data.map(row => row['AutoFadeMs']); }
    static GetLooping() { return AnimationsParser.Data.map(row => row['Looping']); }
    static GetHumanoid() { return AnimationsParser.Data.map(row => row['Humanoid']); }
    static GetPriority() { return AnimationsParser.Data.map(row => row['Priority']); }
}

export default AnimationsParser;
