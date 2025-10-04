import Debugger from "../Debugger";
import LogicLong from "./LogicLong/LogicLong";

class LogicLongCodeGenerator {
	private static readonly HASHTAG = "#";
	private static readonly CONVERSION_CHARS = "0289PYLQGRJCUV";

	static ToCode(LogicLong: LogicLong): string | null {
		const HighValue = LogicLong.GetHigherInt();

		if (HighValue < 256) {
			const combinedValue = (LogicLong.GetLowerInt() << 8) | HighValue;
			return this.HASHTAG + this.Convert(combinedValue);
		}

		return null;
	}

	static ToId(Code: string): LogicLong {
		if (Code.length < 14) {
			const IdCode = Code.substring(1);
			const Id = this.ConvertCode(IdCode);

			if (Id !== -1) {
				return new LogicLong(Id % 256, (Id >> 8) & 0x7FFFFFFF);
			}
		} else {
			Debugger.Warn("Cannot convert the string to code. String is too long.");
		}

		return new LogicLong(-1, -1);
	}

	private static ConvertCode(Code: string): number {
		let Id = 0;
		const ConversionCharsCount = this.CONVERSION_CHARS.length;

		for (let i = 0; i < Code.length; i++) {
			const CharIndex = this.CONVERSION_CHARS.indexOf(Code[i]);
			if (CharIndex === -1) {
				Id = -1;
				break;
			}
			Id = Id * ConversionCharsCount + CharIndex;
		}

		return Id;
	}

	private static Convert(Value: number): string | null {
		if (Value < 0) return null;

		const Code: string[] = new Array(12);
		const ConversionCharsCount = this.CONVERSION_CHARS.length;

		for (let i = 11; i >= 0; i--) {
			Code[i] = this.CONVERSION_CHARS[Value % ConversionCharsCount];
			Value = Math.floor(Value / ConversionCharsCount);

			if (Value === 0) {
				return Code.slice(i).join('');
			}
		}

		return Code.join('');
	}
}

export default LogicLongCodeGenerator