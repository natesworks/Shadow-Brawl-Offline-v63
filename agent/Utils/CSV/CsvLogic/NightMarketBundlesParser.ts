class NightMarketBundlesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        NightMarketBundlesParser.Data = csvData;
    }
    static GetName() { return NightMarketBundlesParser.Data.map(row => row['Name']); }
    static GetDisable() { return NightMarketBundlesParser.Data.map(row => row['Disable']); }
    static GetDontshowfirsttime() { return NightMarketBundlesParser.Data.map(row => row['DontShowFirstTime']); }
    static GetMinnumberofitems() { return NightMarketBundlesParser.Data.map(row => row['minNumberOfItems']); }
    static GetMaxnumberofitems() { return NightMarketBundlesParser.Data.map(row => row['maxNumberOfItems']); }
    static GetMaxquota() { return NightMarketBundlesParser.Data.map(row => row['maxQuota']); }
    static GetTicketsforskins() { return NightMarketBundlesParser.Data.map(row => row['TicketsForSkins']); }
    static GetTicketsforcoins() { return NightMarketBundlesParser.Data.map(row => row['TicketsForCoins']); }
    static GetTicketsforpowerpoints() { return NightMarketBundlesParser.Data.map(row => row['TicketsForPowerPoints']); }
    static GetTicketsforbling() { return NightMarketBundlesParser.Data.map(row => row['TicketsForBling']); }
    static GetTicketsforstarrdrops() { return NightMarketBundlesParser.Data.map(row => row['TicketsForStarrdrops']); }
    static GetTicketsforlegendarystarrdrops() { return NightMarketBundlesParser.Data.map(row => row['TicketsForLegendaryStarrdrops']); }
    static GetTicketsforhcstarrdrops() { return NightMarketBundlesParser.Data.map(row => row['TicketsForHCStarrdrops']); }
    static GetTicketsfortoys() { return NightMarketBundlesParser.Data.map(row => row['TicketsForToys']); }
    static GetTicketsforicons() { return NightMarketBundlesParser.Data.map(row => row['TicketsForIcons']); }
    static GetTicketsforsprays() { return NightMarketBundlesParser.Data.map(row => row['TicketsForSprays']); }
    static GetTicketsforrecruittockens() { return NightMarketBundlesParser.Data.map(row => row['TicketsForRecruitTockens']); }
    static GetTicketsforemotes() { return NightMarketBundlesParser.Data.map(row => row['TicketsForEmotes']); }
    static GetTicketsforbrawlpassxp() { return NightMarketBundlesParser.Data.map(row => row['TicketsForBrawlpassXP']); }
    static GetTicketsforbrawler() { return NightMarketBundlesParser.Data.map(row => row['TicketsForBrawler']); }
    static GetTicketsforpresentboxes() { return NightMarketBundlesParser.Data.map(row => row['TicketsForPresentBoxes']); }
    static GetAlwayshasskin() { return NightMarketBundlesParser.Data.map(row => row['AlwaysHasSkin']); }
    static GetAlwayshasitem() { return NightMarketBundlesParser.Data.map(row => row['AlwaysHasItem']); }
    static GetAlwayshaspsiifpossible() { return NightMarketBundlesParser.Data.map(row => row['AlwaysHasPsiIfPossible']); }
    static GetAlwayshasbrawler() { return NightMarketBundlesParser.Data.map(row => row['AlwaysHasBrawler']); }
    static GetUsespecialskins() { return NightMarketBundlesParser.Data.map(row => row['UseSpecialSkins']); }
    static GetUsespecialbrawlers() { return NightMarketBundlesParser.Data.map(row => row['UseSpecialBrawlers']); }
    static GetValuediscountnumber1() { return NightMarketBundlesParser.Data.map(row => row['ValueDiscountNumber1']); }
    static GetTicketsfordiscountnumber1() { return NightMarketBundlesParser.Data.map(row => row['TicketsForDiscountNumber1']); }
    static GetValuediscountnumber2() { return NightMarketBundlesParser.Data.map(row => row['ValueDiscountNumber2']); }
    static GetTicketsfordiscountnumber2() { return NightMarketBundlesParser.Data.map(row => row['TicketsForDiscountNumber2']); }
    static GetValuediscountnumber3() { return NightMarketBundlesParser.Data.map(row => row['ValueDiscountNumber3']); }
    static GetTicketsfordiscountnumber3() { return NightMarketBundlesParser.Data.map(row => row['TicketsForDiscountNumber3']); }
    static GetValuediscountnumber4() { return NightMarketBundlesParser.Data.map(row => row['ValueDiscountNumber4']); }
    static GetTicketsfordiscountnumber4() { return NightMarketBundlesParser.Data.map(row => row['TicketsForDiscountNumber4']); }
    static GetValuediscountnumber5() { return NightMarketBundlesParser.Data.map(row => row['ValueDiscountNumber5']); }
    static GetTicketsfordiscountnumber5() { return NightMarketBundlesParser.Data.map(row => row['TicketsForDiscountNumber5']); }
    static GetValuediscountnumber6() { return NightMarketBundlesParser.Data.map(row => row['ValueDiscountNumber6']); }
    static GetTicketsfordiscountnumber6() { return NightMarketBundlesParser.Data.map(row => row['TicketsForDiscountNumber6']); }
    static GetValuediscountnumber7() { return NightMarketBundlesParser.Data.map(row => row['ValueDiscountNumber7']); }
    static GetTicketsfordiscountnumber7() { return NightMarketBundlesParser.Data.map(row => row['TicketsForDiscountNumber7']); }
}

export default NightMarketBundlesParser;
