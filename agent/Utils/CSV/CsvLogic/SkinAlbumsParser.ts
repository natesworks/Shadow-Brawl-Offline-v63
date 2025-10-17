class SkinAlbumsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        SkinAlbumsParser.Data = csvData;
    }
    static GetName() { return SkinAlbumsParser.Data.map(row => row['Name']); }
    static GetAlbumtype() { return SkinAlbumsParser.Data.map(row => row['AlbumType']); }
    static GetSkins() { return SkinAlbumsParser.Data.map(row => row['Skins']); }
    static GetAcquirelocation() { return SkinAlbumsParser.Data.map(row => row['AcquireLocation']); }
    static GetCompletionrewardsprays() { return SkinAlbumsParser.Data.map(row => row['CompletionRewardSprays']); }
    static GetCompletionrewardemotes() { return SkinAlbumsParser.Data.map(row => row['CompletionRewardEmotes']); }
    static GetCollabs() { return SkinAlbumsParser.Data.map(row => row['Collabs']); }
    static GetAvailabilitydesc() { return SkinAlbumsParser.Data.map(row => row['AvailabilityDesc']); }
    static GetExcludefromcompletioncheck() { return SkinAlbumsParser.Data.map(row => row['ExcludeFromCompletionCheck']); }
    static GetExcludefromview() { return SkinAlbumsParser.Data.map(row => row['ExcludeFromView']); }
    static GetAnimstart() { return SkinAlbumsParser.Data.map(row => row['AnimStart']); }
    static GetAnimnext() { return SkinAlbumsParser.Data.map(row => row['AnimNext']); }
}

export default SkinAlbumsParser;
