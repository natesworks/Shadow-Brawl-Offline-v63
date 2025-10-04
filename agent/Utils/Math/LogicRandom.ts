import ByteStream from "../../DataStream/ByteStream";

class LogicRandom {
	private Seed: number;

	constructor(Seed: number = 0) {
		this.Seed = Seed;
	}

	GetIteratedRandomSeed(): number {
		return this.Seed;
	}

	SetIteratedRandomSeed(Value: number): void {
		this.Seed = Value;
	}

	Rand(Max: number): number {
		if (Max > 0) {
			this.Seed = this.IterateRandomSeed();
			let TmpVal = this.Seed;

			if (TmpVal < 0) {
				TmpVal = -TmpVal;
			}

			return TmpVal % Max;
		}

		return 0;
	}

	IterateRandomSeed(): number {
		let Seed = this.Seed;

		if (Seed === 0) {
			Seed = -1;
		}

		const Tmp = Seed ^ (Seed << 13) ^ ((Seed ^ (Seed << 13)) >> 17);
		const Tmp2 = Tmp ^ (32 * Tmp);

		return Tmp2;
	}

	Decode(Stream: ByteStream): void {
		this.Seed = Stream.ReadVInt();
	}

	Encode(Stream: ByteStream): void {
		Stream.WriteVInt(this.Seed);
	}
}

export default LogicRandom;
