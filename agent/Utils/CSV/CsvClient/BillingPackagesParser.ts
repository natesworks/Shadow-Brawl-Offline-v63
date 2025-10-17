class BillingPackagesParser {
    static Data: any[] = [];

    static Init(csvData: any[]) {
        BillingPackagesParser.Data = csvData;
    }
    static GetName() { return BillingPackagesParser.Data.map(row => row['Name']); }
    static GetTid() { return BillingPackagesParser.Data.map(row => row['TID']); }
    static GetType() { return BillingPackagesParser.Data.map(row => row['Type']); }
    static GetTypecn() { return BillingPackagesParser.Data.map(row => row['TypeCN']); }
    static GetDisabled() { return BillingPackagesParser.Data.map(row => row['Disabled']); }
    static GetExistsapple() { return BillingPackagesParser.Data.map(row => row['ExistsApple']); }
    static GetExistsandroid() { return BillingPackagesParser.Data.map(row => row['ExistsAndroid']); }
    static GetExistscn() { return BillingPackagesParser.Data.map(row => row['ExistsCN']); }
    static GetDisabledcn() { return BillingPackagesParser.Data.map(row => row['DisabledCN']); }
    static GetExistsapplecn() { return BillingPackagesParser.Data.map(row => row['ExistsAppleCN']); }
    static GetExistsandroidcn() { return BillingPackagesParser.Data.map(row => row['ExistsAndroidCN']); }
    static GetGeoset() { return BillingPackagesParser.Data.map(row => row['GeoSet']); }
    static GetDiamonds() { return BillingPackagesParser.Data.map(row => row['Diamonds']); }
    static GetBonuspercentage() { return BillingPackagesParser.Data.map(row => row['BonusPercentage']); }
    static GetUsd() { return BillingPackagesParser.Data.map(row => row['USD']); }
    static GetOrder() { return BillingPackagesParser.Data.map(row => row['Order']); }
    static GetRmb() { return BillingPackagesParser.Data.map(row => row['RMB']); }
    static GetTencentid() { return BillingPackagesParser.Data.map(row => row['TencentID']); }
    static GetIconexportname() { return BillingPackagesParser.Data.map(row => row['IconExportName']); }
    static GetFramenumber() { return BillingPackagesParser.Data.map(row => row['FrameNumber']); }
    static GetStarterpacknumber() { return BillingPackagesParser.Data.map(row => row['StarterPackNumber']); }
    static GetXplevelreq() { return BillingPackagesParser.Data.map(row => row['XpLevelReq']); }
    static GetValuefactor() { return BillingPackagesParser.Data.map(row => row['ValueFactor']); }
    static GetLabeltid() { return BillingPackagesParser.Data.map(row => row['LabelTID']); }
    static GetLabelvalue() { return BillingPackagesParser.Data.map(row => row['LabelValue']); }
    static GetTaglabeltid() { return BillingPackagesParser.Data.map(row => row['TagLabelTID']); }
    static GetBg() { return BillingPackagesParser.Data.map(row => row['Bg']); }
    static GetDecor() { return BillingPackagesParser.Data.map(row => row['Decor']); }
    static GetIspromotion() { return BillingPackagesParser.Data.map(row => row['IsPromotion']); }
    static GetCoins() { return BillingPackagesParser.Data.map(row => row['Coins']); }
    static GetRefundgemvalue() { return BillingPackagesParser.Data.map(row => row['RefundGemValue']); }
    static GetPricingvalueequalgems() { return BillingPackagesParser.Data.map(row => row['PricingValueEqualGems']); }
    static GetScidstore() { return BillingPackagesParser.Data.map(row => row['SCIDStore']); }
    static GetPremiumpass() { return BillingPackagesParser.Data.map(row => row['PremiumPass']); }
    static GetPremiumpluspass() { return BillingPackagesParser.Data.map(row => row['PremiumPlusPass']); }
    static GetBundledtiercount() { return BillingPackagesParser.Data.map(row => row['BundledTierCount']); }
    static GetDiscountof() { return BillingPackagesParser.Data.map(row => row['DiscountOf']); }
    static GetBundledxp() { return BillingPackagesParser.Data.map(row => row['BundledXP']); }
}

export default BillingPackagesParser;
