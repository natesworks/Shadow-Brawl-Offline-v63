export abstract class LogicMath {
  private static readonly SQRT_TABLE = [
    0x00, 0x10, 0x16, 0x1b, 0x20, 0x23, 0x27, 0x2a, 0x2d,
    0x30, 0x32, 0x35, 0x37, 0x39, 0x3b, 0x3d, 0x40, 0x41,
    0x43, 0x45, 0x47, 0x49, 0x4b, 0x4c, 0x4e, 0x50, 0x51,
    0x53, 0x54, 0x56, 0x57, 0x59, 0x5a, 0x5b, 0x5d, 0x5e,
    0x60, 0x61, 0x62, 0x63, 0x65, 0x66, 0x67, 0x68, 0x6a,
    0x6b, 0x6c, 0x6d, 0x6e, 0x70, 0x71, 0x72, 0x73, 0x74,
    0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x7b, 0x7c, 0x7d,
    0x7e, 0x80, 0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86,
    0x87, 0x88, 0x89, 0x8a, 0x8b, 0x8c, 0x8d, 0x8e, 0x8f,
    0x90, 0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x96,
    0x97, 0x98, 0x99, 0x9a, 0x9b, 0x9b, 0x9c, 0x9d, 0x9e,
    0x9f, 0xa0, 0xa0, 0xa1, 0xa2, 0xa3, 0xa3, 0xa4, 0xa5,
    0xa6, 0xa7, 0xa7, 0xa8, 0xa9, 0xaa, 0xaa, 0xab, 0xac,
    0xad, 0xad, 0xae, 0xaf, 0xb0, 0xb0, 0xb1, 0xb2, 0xb2,
    0xb3, 0xb4, 0xb5, 0xb5, 0xb6, 0xb7, 0xb7, 0xb8, 0xb9,
    0xb9, 0xba, 0xbb, 0xbb, 0xbc, 0xbd, 0xbd, 0xbe, 0xbf,
    0xc0, 0xc0, 0xc1, 0xc1, 0xc2, 0xc3, 0xc3, 0xc4, 0xc5,
    0xc5, 0xc6, 0xc7, 0xc7, 0xc8, 0xc9, 0xc9, 0xca, 0xcb,
    0xcb, 0xcc, 0xcc, 0xcd, 0xce, 0xce, 0xcf, 0xd0, 0xd0,
    0xd1, 0xd1, 0xd2, 0xd3, 0xd3, 0xd4, 0xd4, 0xd5, 0xd6,
    0xd6, 0xd7, 0xd7, 0xd8, 0xd9, 0xd9, 0xda, 0xda, 0xdb,
    0xdb, 0xdc, 0xdd, 0xdd, 0xde, 0xde, 0xdf, 0xe0, 0xe0,
    0xe1, 0xe1, 0xe2, 0xe2, 0xe3, 0xe3, 0xe4, 0xe5, 0xe5,
    0xe6, 0xe6, 0xe7, 0xe7, 0xe8, 0xe8, 0xe9, 0xea, 0xea,
    0xeb, 0xeb, 0xec, 0xec, 0xed, 0xed, 0xee, 0xee, 0xef,
    0xf0, 0xf0, 0xf1, 0xf1, 0xf2, 0xf2, 0xf3, 0xf3, 0xf4,
    0xf4, 0xf5, 0xf5, 0xf6, 0xf6, 0xf7, 0xf7, 0xf8, 0xf8,
    0xf9, 0xf9, 0xfa, 0xfa, 0xfb, 0xfb, 0xfc, 0xfc, 0xfd,
    0xfd, 0xfe, 0xfe, 0xff
  ];
  private static readonly ATAN_TABLE = [
    0x00, 0x00, 0x01, 0x01, 0x02, 0x02, 0x03, 0x03, 0x04,
    0x04, 0x04, 0x05, 0x05, 0x06, 0x06, 0x07, 0x07, 0x08,
    0x08, 0x08, 0x09, 0x09, 0x0a, 0x0a, 0x0b, 0x0b, 0x0b,
    0x0c, 0x0c, 0x0d, 0x0d, 0x0e, 0x0e, 0x0e, 0x0f, 0x0f,
    0x10, 0x10, 0x11, 0x11, 0x11, 0x12, 0x12, 0x13, 0x13,
    0x13, 0x14, 0x14, 0x15, 0x15, 0x15, 0x16, 0x16, 0x16,
    0x17, 0x17, 0x18, 0x18, 0x18, 0x19, 0x19, 0x19, 0x1a,
    0x1a, 0x1b, 0x1b, 0x1b, 0x1c, 0x1c, 0x1c, 0x1d, 0x1d,
    0x1d, 0x1e, 0x1e, 0x1e, 0x1f, 0x1f, 0x1f, 0x20, 0x20,
    0x20, 0x21, 0x21, 0x21, 0x22, 0x22, 0x22, 0x23, 0x23,
    0x23, 0x23, 0x24, 0x24, 0x24, 0x25, 0x25, 0x25, 0x25,
    0x26, 0x26, 0x26, 0x27, 0x27, 0x27, 0x27, 0x28, 0x28,
    0x28, 0x28, 0x29, 0x29, 0x29, 0x29, 0x2a, 0x2a, 0x2a,
    0x2a, 0x2b, 0x2b, 0x2b, 0x2b, 0x2c, 0x2c, 0x2c, 0x2c,
    0x2d, 0x2d, 0x2d
  ];
  private static readonly SIN_TABLE = [
    0x0000, 0x0012, 0x0024, 0x0036, 0x0047, 0x0059, 0x006b, 0x007d,
    0x008f, 0x00a0, 0x00b2, 0x00c3, 0x00d5, 0x00e6, 0x00f8, 0x0109,
    0x011a, 0x012b, 0x013c, 0x014d, 0x015e, 0x016f, 0x0180, 0x0190,
    0x01a0, 0x01b1, 0x01c1, 0x01d1, 0x01e1, 0x01f0, 0x0200, 0x020f,
    0x021f, 0x022e, 0x023d, 0x024b, 0x025a, 0x0268, 0x0276, 0x0284,
    0x0292, 0x02a0, 0x02ad, 0x02ba, 0x02c7, 0x02d4, 0x02e1, 0x02ed,
    0x02f9, 0x0305, 0x0310, 0x031c, 0x0327, 0x0332, 0x033c, 0x0347,
    0x0351, 0x035b, 0x0364, 0x036e, 0x0377, 0x0380, 0x0388, 0x0390,
    0x0398, 0x03a0, 0x03a7, 0x03af, 0x03b5, 0x03bc, 0x03c2, 0x03c8,
    0x03ce, 0x03d3, 0x03d8, 0x03dd, 0x03e2, 0x03e6, 0x03ea, 0x03ed,
    0x03f0, 0x03f3, 0x03f6, 0x03f8, 0x03fa, 0x03fc, 0x03fe, 0x03ff,
    0x03ff, 0x0400, 0x0400
  ];

  public static Abs(value: number): number {
    if (value < 0) {
      return -value;
    }
    return value;
  }

  public static Cos(angle: number): number {
    return LogicMath.Sin(angle + 90);
  }

  public static GetAngle(x: number, y: number): number {
    if (x === 0 && y === 0) {
      return 0;
    }
    if (x > 0 && y >= 0) {
      if (y >= x) {
        return 90 - LogicMath.ATAN_TABLE[(x << 7) / y];
      }
      return LogicMath.ATAN_TABLE[(y << 7) / x];
    }
    const num = LogicMath.Abs(x);
    if (x <= 0 && y > 0) {
      if (num < y) {
        return 90 + LogicMath.ATAN_TABLE[(num << 7) / y];
      }
      return 180 - LogicMath.ATAN_TABLE[(y << 7) / num];
    }
    const num2 = LogicMath.Abs(y);
    if (x < 0 && y <= 0) {
      if (num2 >= num) {
        if (num2 === 0) {
          return 0;
        }
        return 270 - LogicMath.ATAN_TABLE[(num << 7) / num2];
      }
      return 180 + LogicMath.ATAN_TABLE[(num2 << 7) / num];
    }
    if (num < num2) {
      return 270 + LogicMath.ATAN_TABLE[(num << 7) / num2];
    }
    if (num === 0) {
      return 0;
    }
    return LogicMath.NormalizeAngle360(360 - LogicMath.ATAN_TABLE[(num2 << 7) / num]);
  }

  public static Sign(a1: number): number {
    const v1 = a1 >> 31;
    if (a1 > 0) {
      return 1;
    }
    return v1;
  }

  public static GetAngleBetween(a1: number, a2: number): number {
    let result = (a1 - a2) % 360;
    if (result < 0) {
      result += 360;
    }
    if (result > 179) {
      result -= 360;
    }
    return LogicMath.Abs(result);
  }

  public static GetRotatedX(x: number, y: number, angle: number): number {
    let v3 = (angle + 90) % 360;
    if (v3 < 0) {
      v3 += 360;
    }

    let v4: number;
    let v5: number;

    if (v3 > 179) {
      v5 = v3 - 180;
      if (v3 - 180 > 90) {
        v5 = 360 - v3;
      }
      v4 = -LogicMath.SIN_TABLE[v5];
    } else {
      if (v3 > 90) {
        v3 = 180 - v3;
      }
      v4 = LogicMath.SIN_TABLE[v3];
    }

    const v6 = v4 * x;

    let v7 = angle % 360;
    if (v7 < 0) {
      v7 += 360;
    }

    let v8: number;
    let v9: number;

    if (v7 > 179) {
      v9 = v7 - 180;
      if (v7 - 180 > 90) {
        v9 = 360 - v7;
      }
      v8 = -LogicMath.SIN_TABLE[v9];
    } else {
      if (v7 > 90) {
        v7 = 180 - v7;
      }
      v8 = LogicMath.SIN_TABLE[v7];
    }

    return (v6 - v8 * y) / 1024;
  }

  public static GetRotatedY(x: number, y: number, angle: number): number {
    let v3 = angle % 360;
    if (v3 < 0) {
      v3 += 360;
    }

    let v4: number;
    let v5: number;

    if (v3 > 179) {
      v5 = v3 - 180;
      if (v3 - 180 > 90) {
        v5 = 360 - v3;
      }
      v4 = -LogicMath.SIN_TABLE[v5];
    } else {
      if (v3 > 90) {
        v3 = 180 - v3;
      }
      v4 = LogicMath.SIN_TABLE[v3];
    }

    const v6 = v4 * x;

    let v7 = (angle + 90) % 360;
    if (v7 < 0) {
      v7 += 360;
    }

    let v8: number;
    let v9: number;

    if (v7 > 179) {
      v9 = v7 - 180;
      if (v7 - 180 > 90) {
        v9 = 360 - v7;
      }
      v8 = -LogicMath.SIN_TABLE[v9];
    } else {
      if (v7 > 90) {
        v7 = 180 - v7;
      }
      v8 = LogicMath.SIN_TABLE[v7];
    }

    return (v6 + v8 * y) / 1024;
  }

  public static NormalizeAngle180(angle: number): number {
    angle = LogicMath.NormalizeAngle360(angle);
    if (angle >= 180) {
      return angle - 180;
    }
    return angle;
  }

  public static NormalizeAngle360(angle: number): number {
    angle %= 360;
    if (angle < 0) {
      return angle + 360;
    }
    return angle;
  }

  public static Sin(angle: number): number {
    angle = LogicMath.NormalizeAngle360(angle);
    if (angle < 180) {
      if (angle > 90) {
        angle = 180 - angle;
      }
      return LogicMath.SIN_TABLE[angle];
    }
    angle -= 180;
    if (angle > 90) {
      angle = 180 - angle;
    }
    return -LogicMath.SIN_TABLE[angle];
  }

  public static Sqrt(value: number): number {
    if (value >= 0x10000) {
      let num: number;
      if (value >= 0x1000000) {
        if (value >= 0x10000000) {
          if (value >= 0x40000000) {
            if (value === 0x7fffffff) {
              return 0xffff;
            }
            num = LogicMath.SQRT_TABLE[value >> 24] << 8;
          } else {
            num = LogicMath.SQRT_TABLE[value >> 22] << 7;
          }
        } else if (value >= 0x4000000) {
          num = LogicMath.SQRT_TABLE[value >> 20] << 6;
        } else {
          num = LogicMath.SQRT_TABLE[value >> 18] << 5;
        }
        num = (num + 1 + Math.floor(value / num)) >> 1;
        num = (num + 1 + Math.floor(value / num)) >> 1;
        return num * num <= value ? num : num - 1;
      }
      if (value >= 0x100000) {
        if (value >= 0x400000) {
          num = LogicMath.SQRT_TABLE[value >> 16] << 4;
        } else {
          num = LogicMath.SQRT_TABLE[value >> 14] << 3;
        }
      } else if (value >= 0x40000) {
        num = LogicMath.SQRT_TABLE[value >> 12] << 2;
      } else {
        num = LogicMath.SQRT_TABLE[value >> 10] << 1;
      }
      num = (num + 1 + Math.floor(value / num)) >> 1;
      return num * num <= value ? num : num - 1;
    }
    if (value >= 0x100) {
      let num: number;
      if (value >= 0x1000) {
        if (value >= 0x4000) {
          num = LogicMath.SQRT_TABLE[value >> 8] + 1;
        } else {
          num = (LogicMath.SQRT_TABLE[value >> 6] >> 1) + 1;
        }
      } else if (value >= 0x400) {
        num = (LogicMath.SQRT_TABLE[value >> 4] >> 2) + 1;
      } else {
        num = (LogicMath.SQRT_TABLE[value >> 2] >> 3) + 1;
      }
      return num * num <= value ? num : num - 1;
    }
    if (value >= 0) {
      return LogicMath.SQRT_TABLE[value] >> 4;
    }
    return -1;
  }

  public static Clamp(clampValue: number, minValue: number, maxValue: number): number {
    if (clampValue >= maxValue) {
      return maxValue;
    }
    if (clampValue <= minValue) {
      return minValue;
    }
    return clampValue;
  }

  public static Max(valueA: number, valueB: number): number {
    if (valueA >= valueB) {
      return valueA;
    }
    return valueB;
  }

  public static Min(valueA: number, valueB: number): number {
    if (valueA <= valueB) {
      return valueA;
    }
    return valueB;
  }

  public static GetRadius(x: number, y: number): number {
    x = LogicMath.Abs(x);
    y = LogicMath.Abs(y);
    const maxValue = LogicMath.Max(x, y);
    const minValue = LogicMath.Min(x, y);
    return maxValue + ((53 * minValue) >> 7);
  }
}

export default LogicMath