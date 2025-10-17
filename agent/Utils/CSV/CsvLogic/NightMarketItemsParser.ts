class NightMarketItemsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        NightMarketItemsParser.Data = csvData;
    }
    static GetName() { return NightMarketItemsParser.Data.map(row => row['Name']); }
    static GetRarity() { return NightMarketItemsParser.Data.map(row => row['Rarity']); }
    static GetTypename() { return NightMarketItemsParser.Data.map(row => row['TypeName']); }
    static GetAmount() { return NightMarketItemsParser.Data.map(row => row['Amount']); }
    static GetValueincash() { return NightMarketItemsParser.Data.map(row => row['ValueInCash']); }
    static GetBundlequota() { return NightMarketItemsParser.Data.map(row => row['BundleQuota']); }
    static GetTicketsforbundle1() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle1']); }
    static GetTicketsforbundle2() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle2']); }
    static GetTicketsforbundle3() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle3']); }
    static GetTicketsforbundle4() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle4']); }
    static GetTicketsforbundle5() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle5']); }
    static GetTicketsforbundle6() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle6']); }
    static GetTicketsforbundle7() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle7']); }
    static GetTicketsforbundle8() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle8']); }
    static GetTicketsforbundle9() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle9']); }
    static GetTicketsforbundle10() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle10']); }
    static GetTicketsforbundle11() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle11']); }
    static GetTicketsforbundle12() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle12']); }
    static GetTicketsforbundle13() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle13']); }
    static GetTicketsforbundle14() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle14']); }
    static GetTicketsforbundle15() { return NightMarketItemsParser.Data.map(row => row['TicketsForBundle15']); }
}

export default NightMarketItemsParser;
