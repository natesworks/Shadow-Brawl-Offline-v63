class RandomRewardsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        RandomRewardsParser.Data = csvData;
    }
    static GetName() { return RandomRewardsParser.Data.map(row => row['Name']); }
    static GetTicketsinrarestar() { return RandomRewardsParser.Data.map(row => row['TicketsInRareStar']); }
    static GetTicketsinsuperrarestar() { return RandomRewardsParser.Data.map(row => row['TicketsInSuperRareStar']); }
    static GetTicketsinepicstar() { return RandomRewardsParser.Data.map(row => row['TicketsInEpicStar']); }
    static GetTicketsinmythicstar() { return RandomRewardsParser.Data.map(row => row['TicketsInMythicStar']); }
    static GetTicketsinlegendarystar() { return RandomRewardsParser.Data.map(row => row['TicketsInLegendaryStar']); }
    static GetTicketsinoverchargestar() { return RandomRewardsParser.Data.map(row => row['TicketsInOverchargeStar']); }
    static GetTicketsinrankedstar() { return RandomRewardsParser.Data.map(row => row['TicketsInRankedStar']); }
    static GetTicketsinrarecollabdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInRareCollabDrop']); }
    static GetTicketsinsuperrarecollabdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInSuperRareCollabDrop']); }
    static GetTicketsinepiccollabdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInEpicCollabDrop']); }
    static GetTicketsinmythiccollabdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInMythicCollabDrop']); }
    static GetTicketsinlegendarycollabdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInLegendaryCollabDrop']); }
    static GetTicketsinmegabox() { return RandomRewardsParser.Data.map(row => row['TicketsInMegaBox']); }
    static GetTicketsinangelicstar() { return RandomRewardsParser.Data.map(row => row['TicketsInAngelicStar']); }
    static GetTicketsindemonicstar() { return RandomRewardsParser.Data.map(row => row['TicketsInDemonicStar']); }
    static GetTicketsinseasonboxlevel1() { return RandomRewardsParser.Data.map(row => row['TicketsInSeasonBoxLevel1']); }
    static GetTicketsinseasonboxlevel2() { return RandomRewardsParser.Data.map(row => row['TicketsInSeasonBoxLevel2']); }
    static GetTicketsinseasonboxlevel3() { return RandomRewardsParser.Data.map(row => row['TicketsInSeasonBoxLevel3']); }
    static GetTicketsinseasonboxlevel4() { return RandomRewardsParser.Data.map(row => row['TicketsInSeasonBoxLevel4']); }
    static GetTicketsinseasonboxlevel5() { return RandomRewardsParser.Data.map(row => row['TicketsInSeasonBoxLevel5']); }
    static GetTicketsinrarepresentdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInRarePresentDrop']); }
    static GetTicketsinsuperrarepresentdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInSuperRarePresentDrop']); }
    static GetTicketsinepicpresentdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInEpicPresentDrop']); }
    static GetTicketsinmythicpresentdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInMythicPresentDrop']); }
    static GetTicketsinlegendarypresentdrop() { return RandomRewardsParser.Data.map(row => row['TicketsInLegendaryPresentDrop']); }
    static GetTicketsinsplitterrare() { return RandomRewardsParser.Data.map(row => row['TicketsInSplitterRare']); }
    static GetTicketsinsplittersuperrare() { return RandomRewardsParser.Data.map(row => row['TicketsInSplitterSuperRare']); }
    static GetTicketsinsplitterepic() { return RandomRewardsParser.Data.map(row => row['TicketsInSplitterEpic']); }
    static GetTicketsinsplittermythic() { return RandomRewardsParser.Data.map(row => row['TicketsInSplitterMythic']); }
    static GetTicketsingraffitibox() { return RandomRewardsParser.Data.map(row => row['TicketsInGraffitiBox']); }
    static GetTicketsinpumpkinbox() { return RandomRewardsParser.Data.map(row => row['TicketsInPumpkinBox']); }
    static GetTicketsindeadbox() { return RandomRewardsParser.Data.map(row => row['TicketsInDeadBox']); }
    static GetTypename() { return RandomRewardsParser.Data.map(row => row['TypeName']); }
    static GetTypevalue() { return RandomRewardsParser.Data.map(row => row['TypeValue']); }
    static GetInpremiumdraw() { return RandomRewardsParser.Data.map(row => row['InPremiumDraw']); }
    static GetTypepricemin() { return RandomRewardsParser.Data.map(row => row['TypePriceMin']); }
    static GetTypepricemax() { return RandomRewardsParser.Data.map(row => row['TypePriceMax']); }
    static GetAmountmin() { return RandomRewardsParser.Data.map(row => row['AmountMin']); }
    static GetAmountmax() { return RandomRewardsParser.Data.map(row => row['AmountMax']); }
    static GetFallbacktypename() { return RandomRewardsParser.Data.map(row => row['FallbackTypeName']); }
    static GetFallbackamount() { return RandomRewardsParser.Data.map(row => row['FallbackAmount']); }
    static GetNoeventfallbacktypename() { return RandomRewardsParser.Data.map(row => row['NoEventFallbackTypeName']); }
    static GetNoeventfallbackamount() { return RandomRewardsParser.Data.map(row => row['NoEventFallbackAmount']); }
    static GetTierforvisualization() { return RandomRewardsParser.Data.map(row => row['TierForVisualization']); }
}

export default RandomRewardsParser;
