interface Reward {
	ItemType: number;
	Amount: number;
	CsvID: [number, number];
	SkinID: number;
}

interface Offer {
	Rewards: Reward[];
	ShopStyle: [number, number];
	Currency: number;
	Cost: number;
	Time: number;
	IsClaim: boolean;
	DailyOffer: boolean;
	OldPrice: number;
	Text: string;
    ShowAtLaunch: boolean;
	Background: string;
	Processed: boolean;
	TypeBenefit: number;
	Benefit: number;
	OneTimeOffer: boolean;
	IsClaimed: boolean;
}

interface ShopOffers {
	Offers: Offer[];
}

const CurrentShopOffers: ShopOffers = {
	Offers: [
        {
			Rewards: [
				{
					ItemType: 76,
					Amount: 1337,
					CsvID: [0, 0],
					SkinID: 0
				}
			],
			ShopStyle: [70, 9],
			Currency: 0,
			Cost: 0,
			Time: 461036,
			IsClaim: false,
			DailyOffer: false,
			OldPrice: 0,
			Text: "C*ndy Brawl!",
            ShowAtLaunch: false,
			Background: "offer_bgr_carretabrawl",
			Processed: false,
			TypeBenefit: 0,
			Benefit: 0,
			OneTimeOffer: false,
			IsClaimed: false
		},
        {
			Rewards: [
				{
					ItemType: 74,
					Amount: 1337,
					CsvID: [0, 0],
					SkinID: 0
				}
			],
			ShopStyle: [70, 9],
			Currency: 0,
			Cost: 69,
			Time: 461036,
			IsClaim: false,
			DailyOffer: false,
			OldPrice: 100,
			Text: "H*lloween Boxes!",
            ShowAtLaunch: false,
			Background: "offer_bgr_carretabrawl",
			Processed: false,
			TypeBenefit: 0,
			Benefit: 0,
			OneTimeOffer: false,
			IsClaimed: false
		}
	]
};

export default CurrentShopOffers;
