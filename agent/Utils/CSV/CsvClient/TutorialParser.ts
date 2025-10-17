class TutorialParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        TutorialParser.Data = csvData;
    }
    static GetName() { return TutorialParser.Data.map(row => row['Name']); }
    static GetDisabled() { return TutorialParser.Data.map(row => row['Disabled']); }
    static GetStartdelayms() { return TutorialParser.Data.map(row => row['StartDelayMS']); }
    static GetEnddelayms() { return TutorialParser.Data.map(row => row['EndDelayMS']); }
    static GetForcespeechbubbleclosems() { return TutorialParser.Data.map(row => row['ForceSpeechBubbleCloseMS']); }
    static GetStartcondition() { return TutorialParser.Data.map(row => row['StartCondition']); }
    static GetStartlocationx() { return TutorialParser.Data.map(row => row['StartLocationX']); }
    static GetStartlocationy() { return TutorialParser.Data.map(row => row['StartLocationY']); }
    static GetStartlocationradius() { return TutorialParser.Data.map(row => row['StartLocationRadius']); }
    static GetAnimationx() { return TutorialParser.Data.map(row => row['AnimationX']); }
    static GetAnimationy() { return TutorialParser.Data.map(row => row['AnimationY']); }
    static GetAnimationx2() { return TutorialParser.Data.map(row => row['AnimationX2']); }
    static GetAnimationy2() { return TutorialParser.Data.map(row => row['AnimationY2']); }
    static GetCompletecondition() { return TutorialParser.Data.map(row => row['CompleteCondition']); }
    static GetShoulduseautoshoot() { return TutorialParser.Data.map(row => row['ShouldUseAutoShoot']); }
    static GetCompletelocationx() { return TutorialParser.Data.map(row => row['CompleteLocationX']); }
    static GetCompletelocationy() { return TutorialParser.Data.map(row => row['CompleteLocationY']); }
    static GetCompletelocationradius() { return TutorialParser.Data.map(row => row['CompleteLocationRadius']); }
    static GetUseultix() { return TutorialParser.Data.map(row => row['UseUltiX']); }
    static GetUseultiy() { return TutorialParser.Data.map(row => row['UseUltiY']); }
    static GetAnimationclipswf() { return TutorialParser.Data.map(row => row['AnimationClipSWF']); }
    static GetAnimationmovieclip() { return TutorialParser.Data.map(row => row['AnimationMovieClip']); }
    static GetAnimationclipswf2() { return TutorialParser.Data.map(row => row['AnimationClipSWF2']); }
    static GetAnimationmovieclip2() { return TutorialParser.Data.map(row => row['AnimationMovieClip2']); }
    static GetSpeechbubblecharacterswf() { return TutorialParser.Data.map(row => row['SpeechBubbleCharacterSWF']); }
    static GetSpeechbubblecharactermovieclip() { return TutorialParser.Data.map(row => row['SpeechBubbleCharacterMovieClip']); }
    static GetSpeechbubbletids() { return TutorialParser.Data.map(row => row['SpeechBubbleTIDs']); }
    static GetStartsound() { return TutorialParser.Data.map(row => row['StartSound']); }
    static GetSpawncharacter() { return TutorialParser.Data.map(row => row['SpawnCharacter']); }
    static GetSpawnlocationx() { return TutorialParser.Data.map(row => row['SpawnLocationX']); }
    static GetSpawnlocationy() { return TutorialParser.Data.map(row => row['SpawnLocationY']); }
    static GetCustomdata() { return TutorialParser.Data.map(row => row['CustomData']); }
    static GetBlockingspeechbubble() { return TutorialParser.Data.map(row => row['BlockingSpeechBubble']); }
    static GetShowulti() { return TutorialParser.Data.map(row => row['ShowUlti']); }
    static GetShowshootstick() { return TutorialParser.Data.map(row => row['ShowShootStick']); }
    static GetLeftspeechbubble() { return TutorialParser.Data.map(row => row['LeftSpeechBubble']); }
}

export default TutorialParser;
