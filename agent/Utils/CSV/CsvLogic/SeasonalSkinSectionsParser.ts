class SeasonalSkinSectionsParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        SeasonalSkinSectionsParser.Data = csvData;
    }
    static GetName() { return SeasonalSkinSectionsParser.Data.map(row => row['Name']); }
    static GetMode() { return SeasonalSkinSectionsParser.Data.map(row => row['Mode']); }
    static GetIncludedcampaigns() { return SeasonalSkinSectionsParser.Data.map(row => row['IncludedCampaigns']); }
    static GetSectiontitletid() { return SeasonalSkinSectionsParser.Data.map(row => row['SectionTitleTID']); }
    static GetSectionitemtid() { return SeasonalSkinSectionsParser.Data.map(row => row['SectionItemTID']); }
    static GetSectioninfotid() { return SeasonalSkinSectionsParser.Data.map(row => row['SectionInfoTID']); }
    static GetLastchancesectionseparately() { return SeasonalSkinSectionsParser.Data.map(row => row['LastChanceSectionSeparately']); }
    static GetLastchancesectiontid() { return SeasonalSkinSectionsParser.Data.map(row => row['LastChanceSectionTID']); }
    static GetGroupcampaign() { return SeasonalSkinSectionsParser.Data.map(row => row['GroupCampaign']); }
    static GetGroupshopitem() { return SeasonalSkinSectionsParser.Data.map(row => row['GroupShopItem']); }
    static GetShopitemcharacters() { return SeasonalSkinSectionsParser.Data.map(row => row['ShopItemCharacters']); }
    static GetCheckdatafromoffers() { return SeasonalSkinSectionsParser.Data.map(row => row['CheckDataFromOffers']); }
    static GetPurchasepopupbg() { return SeasonalSkinSectionsParser.Data.map(row => row['PurchasePopupBg']); }
    static GetEmotesbundle() { return SeasonalSkinSectionsParser.Data.map(row => row['EmotesBundle']); }
}

export default SeasonalSkinSectionsParser;
