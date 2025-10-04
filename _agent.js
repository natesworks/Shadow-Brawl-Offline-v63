📦
971769 /agent/index.js
✄
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// frida-shim:node_modules/@frida/base64-js/index.js
var lookup = [];
var revLookup = [];
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (let i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  const len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  let validLen = b64.indexOf("=");
  if (validLen === -1) validLen = len;
  const placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  const lens = getLens(b64);
  const validLen = lens[0];
  const placeHoldersLen = lens[1];
  const arr = new Uint8Array(_byteLength(b64, validLen, placeHoldersLen));
  let curByte = 0;
  const len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  let i;
  for (i = 0; i < len; i += 4) {
    const tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    const tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    const tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  const output = [];
  for (let i = start; i < end; i += 3) {
    const tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  const len = uint8.length;
  const extraBytes = len % 3;
  const parts = [];
  const maxChunkLength = 16383;
  for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    const tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
    );
  } else if (extraBytes === 2) {
    const tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}

// frida-shim:node_modules/@frida/ieee754/index.js
function read(buffer, offset, isLE, mLen, nBytes) {
  let e, m2;
  const eLen = nBytes * 8 - mLen - 1;
  const eMax = (1 << eLen) - 1;
  const eBias = eMax >> 1;
  let nBits = -7;
  let i = isLE ? nBytes - 1 : 0;
  const d = isLE ? -1 : 1;
  let s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  while (nBits > 0) {
    e = e * 256 + buffer[offset + i];
    i += d;
    nBits -= 8;
  }
  m2 = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  while (nBits > 0) {
    m2 = m2 * 256 + buffer[offset + i];
    i += d;
    nBits -= 8;
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m2 ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m2 = m2 + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m2 * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
  let e, m2, c;
  let eLen = nBytes * 8 - mLen - 1;
  const eMax = (1 << eLen) - 1;
  const eBias = eMax >> 1;
  const rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  let i = isLE ? 0 : nBytes - 1;
  const d = isLE ? 1 : -1;
  const s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m2 = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m2 = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m2 = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m2 = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  while (mLen >= 8) {
    buffer[offset + i] = m2 & 255;
    i += d;
    m2 /= 256;
    mLen -= 8;
  }
  e = e << mLen | m2;
  eLen += mLen;
  while (eLen > 0) {
    buffer[offset + i] = e & 255;
    i += d;
    e /= 256;
    eLen -= 8;
  }
  buffer[offset + i - d] |= s * 128;
}

// frida-shim:node_modules/@frida/buffer/index.js
var config = {
  INSPECT_MAX_BYTES: 50
};
var K_MAX_LENGTH = 2147483647;
Buffer2.TYPED_ARRAY_SUPPORT = true;
Object.defineProperty(Buffer2.prototype, "parent", {
  enumerable: true,
  get: function() {
    if (!Buffer2.isBuffer(this)) return void 0;
    return this.buffer;
  }
});
Object.defineProperty(Buffer2.prototype, "offset", {
  enumerable: true,
  get: function() {
    if (!Buffer2.isBuffer(this)) return void 0;
    return this.byteOffset;
  }
});
function createBuffer(length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"');
  }
  const buf = new Uint8Array(length);
  Object.setPrototypeOf(buf, Buffer2.prototype);
  return buf;
}
function Buffer2(arg, encodingOrOffset, length) {
  if (typeof arg === "number") {
    if (typeof encodingOrOffset === "string") {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      );
    }
    return allocUnsafe(arg);
  }
  return from(arg, encodingOrOffset, length);
}
Buffer2.poolSize = 8192;
function from(value, encodingOrOffset, length) {
  if (typeof value === "string") {
    return fromString(value, encodingOrOffset);
  }
  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value);
  }
  if (value == null) {
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
    );
  }
  if (value instanceof ArrayBuffer || value && value.buffer instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }
  if (value instanceof SharedArrayBuffer || value && value.buffer instanceof SharedArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length);
  }
  if (typeof value === "number") {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    );
  }
  const valueOf = value.valueOf && value.valueOf();
  if (valueOf != null && valueOf !== value) {
    return Buffer2.from(valueOf, encodingOrOffset, length);
  }
  const b = fromObject(value);
  if (b) return b;
  if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
    return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
  }
  throw new TypeError(
    "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
  );
}
Buffer2.from = function(value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length);
};
Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer2, Uint8Array);
function assertSize(size) {
  if (typeof size !== "number") {
    throw new TypeError('"size" argument must be of type number');
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"');
  }
}
function alloc(size, fill2, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(size);
  }
  if (fill2 !== void 0) {
    return typeof encoding === "string" ? createBuffer(size).fill(fill2, encoding) : createBuffer(size).fill(fill2);
  }
  return createBuffer(size);
}
Buffer2.alloc = function(size, fill2, encoding) {
  return alloc(size, fill2, encoding);
};
function allocUnsafe(size) {
  assertSize(size);
  return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
Buffer2.allocUnsafe = function(size) {
  return allocUnsafe(size);
};
Buffer2.allocUnsafeSlow = function(size) {
  return allocUnsafe(size);
};
function fromString(string, encoding) {
  if (typeof encoding !== "string" || encoding === "") {
    encoding = "utf8";
  }
  if (!Buffer2.isEncoding(encoding)) {
    throw new TypeError("Unknown encoding: " + encoding);
  }
  const length = byteLength(string, encoding) | 0;
  let buf = createBuffer(length);
  const actual = buf.write(string, encoding);
  if (actual !== length) {
    buf = buf.slice(0, actual);
  }
  return buf;
}
function fromArrayLike(array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0;
  const buf = createBuffer(length);
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255;
  }
  return buf;
}
function fromArrayView(arrayView) {
  if (arrayView instanceof Uint8Array) {
    const copy2 = new Uint8Array(arrayView);
    return fromArrayBuffer(copy2.buffer, copy2.byteOffset, copy2.byteLength);
  }
  return fromArrayLike(arrayView);
}
function fromArrayBuffer(array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds');
  }
  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds');
  }
  let buf;
  if (byteOffset === void 0 && length === void 0) {
    buf = new Uint8Array(array);
  } else if (length === void 0) {
    buf = new Uint8Array(array, byteOffset);
  } else {
    buf = new Uint8Array(array, byteOffset, length);
  }
  Object.setPrototypeOf(buf, Buffer2.prototype);
  return buf;
}
function fromObject(obj) {
  if (Buffer2.isBuffer(obj)) {
    const len = checked(obj.length) | 0;
    const buf = createBuffer(len);
    if (buf.length === 0) {
      return buf;
    }
    obj.copy(buf, 0, 0, len);
    return buf;
  }
  if (obj.length !== void 0) {
    if (typeof obj.length !== "number" || Number.isNaN(obj.length)) {
      return createBuffer(0);
    }
    return fromArrayLike(obj);
  }
  if (obj.type === "Buffer" && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data);
  }
}
function checked(length) {
  if (length >= K_MAX_LENGTH) {
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
  }
  return length | 0;
}
Buffer2.isBuffer = function isBuffer(b) {
  return b != null && b._isBuffer === true && b !== Buffer2.prototype;
};
Buffer2.compare = function compare(a, b) {
  if (a instanceof Uint8Array) a = Buffer2.from(a, a.offset, a.byteLength);
  if (b instanceof Uint8Array) b = Buffer2.from(b, b.offset, b.byteLength);
  if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    );
  }
  if (a === b) return 0;
  let x = a.length;
  let y = b.length;
  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};
Buffer2.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return true;
    default:
      return false;
  }
};
Buffer2.concat = function concat(list2, length) {
  if (!Array.isArray(list2)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }
  if (list2.length === 0) {
    return Buffer2.alloc(0);
  }
  let i;
  if (length === void 0) {
    length = 0;
    for (i = 0; i < list2.length; ++i) {
      length += list2[i].length;
    }
  }
  const buffer = Buffer2.allocUnsafe(length);
  let pos = 0;
  for (i = 0; i < list2.length; ++i) {
    let buf = list2[i];
    if (buf instanceof Uint8Array) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer2.isBuffer(buf)) {
          buf = Buffer2.from(buf.buffer, buf.byteOffset, buf.byteLength);
        }
        buf.copy(buffer, pos);
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        );
      }
    } else if (!Buffer2.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    } else {
      buf.copy(buffer, pos);
    }
    pos += buf.length;
  }
  return buffer;
};
function byteLength(string, encoding) {
  if (Buffer2.isBuffer(string)) {
    return string.length;
  }
  if (ArrayBuffer.isView(string) || string instanceof ArrayBuffer) {
    return string.byteLength;
  }
  if (typeof string !== "string") {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
    );
  }
  const len = string.length;
  const mustMatch = arguments.length > 2 && arguments[2] === true;
  if (!mustMatch && len === 0) return 0;
  let loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length;
        }
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer2.byteLength = byteLength;
function slowToString(encoding, start, end) {
  let loweredCase = false;
  if (start === void 0 || start < 0) {
    start = 0;
  }
  if (start > this.length) {
    return "";
  }
  if (end === void 0 || end > this.length) {
    end = this.length;
  }
  if (end <= 0) {
    return "";
  }
  end >>>= 0;
  start >>>= 0;
  if (end <= start) {
    return "";
  }
  if (!encoding) encoding = "utf8";
  while (true) {
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);
      case "ascii":
        return asciiSlice(this, start, end);
      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);
      case "base64":
        return base64Slice(this, start, end);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer2.prototype._isBuffer = true;
function swap(b, n, m2) {
  const i = b[n];
  b[n] = b[m2];
  b[m2] = i;
}
Buffer2.prototype.swap16 = function swap16() {
  const len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};
Buffer2.prototype.swap32 = function swap32() {
  const len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};
Buffer2.prototype.swap64 = function swap64() {
  const len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};
Buffer2.prototype.toString = function toString() {
  const length = this.length;
  if (length === 0) return "";
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};
Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
Buffer2.prototype.equals = function equals(b) {
  if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
  if (this === b) return true;
  return Buffer2.compare(this, b) === 0;
};
Buffer2.prototype.inspect = function inspect() {
  let str = "";
  const max = config.INSPECT_MAX_BYTES;
  str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
  if (this.length > max) str += " ... ";
  return "<Buffer " + str + ">";
};
Buffer2.prototype[Symbol.for("nodejs.util.inspect.custom")] = Buffer2.prototype.inspect;
Buffer2.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
  if (target instanceof Uint8Array) {
    target = Buffer2.from(target, target.offset, target.byteLength);
  }
  if (!Buffer2.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
    );
  }
  if (start === void 0) {
    start = 0;
  }
  if (end === void 0) {
    end = target ? target.length : 0;
  }
  if (thisStart === void 0) {
    thisStart = 0;
  }
  if (thisEnd === void 0) {
    thisEnd = this.length;
  }
  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError("out of range index");
  }
  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }
  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  let x = thisEnd - thisStart;
  let y = end - start;
  const len = Math.min(x, y);
  const thisCopy = this.slice(thisStart, thisEnd);
  const targetCopy = target.slice(start, end);
  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }
  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0) return -1;
  if (typeof byteOffset === "string") {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 2147483647) {
    byteOffset = 2147483647;
  } else if (byteOffset < -2147483648) {
    byteOffset = -2147483648;
  }
  byteOffset = +byteOffset;
  if (Number.isNaN(byteOffset)) {
    byteOffset = dir ? 0 : buffer.length - 1;
  }
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1;
  }
  if (typeof val === "string") {
    val = Buffer2.from(val, encoding);
  }
  if (Buffer2.isBuffer(val)) {
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === "number") {
    val = val & 255;
    if (typeof Uint8Array.prototype.indexOf === "function") {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }
  throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  let indexSize = 1;
  let arrLength = arr.length;
  let valLength = val.length;
  if (encoding !== void 0) {
    encoding = String(encoding).toLowerCase();
    if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }
  function read2(buf, i2) {
    if (indexSize === 1) {
      return buf[i2];
    } else {
      return buf.readUInt16BE(i2 * indexSize);
    }
  }
  let i;
  if (dir) {
    let foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read2(arr, i) === read2(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      let found = true;
      for (let j = 0; j < valLength; j++) {
        if (read2(arr, i + j) !== read2(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }
  return -1;
}
Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  const remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  const strLen = string.length;
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  let i;
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16);
    if (Number.isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}
function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer2.prototype.write = function write2(string, offset, length, encoding) {
  if (offset === void 0) {
    encoding = "utf8";
    length = this.length;
    offset = 0;
  } else if (length === void 0 && typeof offset === "string") {
    encoding = offset;
    length = this.length;
    offset = 0;
  } else if (isFinite(offset)) {
    offset = offset >>> 0;
    if (isFinite(length)) {
      length = length >>> 0;
      if (encoding === void 0) encoding = "utf8";
    } else {
      encoding = length;
      length = void 0;
    }
  } else {
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  }
  const remaining = this.length - offset;
  if (length === void 0 || length > remaining) length = remaining;
  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError("Attempt to write outside buffer bounds");
  }
  if (!encoding) encoding = "utf8";
  let loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "hex":
        return hexWrite(this, string, offset, length);
      case "utf8":
      case "utf-8":
        return utf8Write(this, string, offset, length);
      case "ascii":
      case "latin1":
      case "binary":
        return asciiWrite(this, string, offset, length);
      case "base64":
        return base64Write(this, string, offset, length);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return ucs2Write(this, string, offset, length);
      default:
        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};
Buffer2.prototype.toJSON = function toJSON() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  const res = [];
  let i = start;
  while (i < end) {
    const firstByte = buf[i];
    let codePoint = null;
    let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    i += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
  const len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  let res = "";
  let i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}
function asciiSlice(buf, start, end) {
  let ret = "";
  end = Math.min(buf.length, end);
  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 127);
  }
  return ret;
}
function latin1Slice(buf, start, end) {
  let ret = "";
  end = Math.min(buf.length, end);
  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}
function hexSlice(buf, start, end) {
  const len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  let out = "";
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]];
  }
  return out;
}
function utf16leSlice(buf, start, end) {
  const bytes = buf.slice(start, end);
  let res = "";
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}
Buffer2.prototype.slice = function slice(start, end) {
  const len = this.length;
  start = ~~start;
  end = end === void 0 ? len : ~~end;
  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }
  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }
  if (end < start) end = start;
  const newBuf = this.subarray(start, end);
  Object.setPrototypeOf(newBuf, Buffer2.prototype);
  return newBuf;
};
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
  if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
}
Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
  offset = offset >>> 0;
  byteLength2 = byteLength2 >>> 0;
  if (!noAssert) checkOffset(offset, byteLength2, this.length);
  let val = this[offset];
  let mul = 1;
  let i = 0;
  while (++i < byteLength2 && (mul *= 256)) {
    val += this[offset + i] * mul;
  }
  return val;
};
Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
  offset = offset >>> 0;
  byteLength2 = byteLength2 >>> 0;
  if (!noAssert) {
    checkOffset(offset, byteLength2, this.length);
  }
  let val = this[offset + --byteLength2];
  let mul = 1;
  while (byteLength2 > 0 && (mul *= 256)) {
    val += this[offset + --byteLength2] * mul;
  }
  return val;
};
Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};
Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};
Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};
Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
};
Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer2.prototype.readBigUInt64LE = function readBigUInt64LE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, "offset");
  const first = this[offset];
  const last = this[offset + 7];
  if (first === void 0 || last === void 0) {
    boundsError(offset, this.length - 8);
  }
  const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
  const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
  return BigInt(lo) + (BigInt(hi) << BigInt(32));
};
Buffer2.prototype.readBigUInt64BE = function readBigUInt64BE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, "offset");
  const first = this[offset];
  const last = this[offset + 7];
  if (first === void 0 || last === void 0) {
    boundsError(offset, this.length - 8);
  }
  const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
  const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
  return (BigInt(hi) << BigInt(32)) + BigInt(lo);
};
Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
  offset = offset >>> 0;
  byteLength2 = byteLength2 >>> 0;
  if (!noAssert) checkOffset(offset, byteLength2, this.length);
  let val = this[offset];
  let mul = 1;
  let i = 0;
  while (++i < byteLength2 && (mul *= 256)) {
    val += this[offset + i] * mul;
  }
  mul *= 128;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
  return val;
};
Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
  offset = offset >>> 0;
  byteLength2 = byteLength2 >>> 0;
  if (!noAssert) checkOffset(offset, byteLength2, this.length);
  let i = byteLength2;
  let mul = 1;
  let val = this[offset + --i];
  while (i > 0 && (mul *= 256)) {
    val += this[offset + --i] * mul;
  }
  mul *= 128;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
  return val;
};
Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 128)) return this[offset];
  return (255 - this[offset] + 1) * -1;
};
Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  const val = this[offset] | this[offset + 1] << 8;
  return val & 32768 ? val | 4294901760 : val;
};
Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 2, this.length);
  const val = this[offset + 1] | this[offset] << 8;
  return val & 32768 ? val | 4294901760 : val;
};
Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer2.prototype.readBigInt64LE = function readBigInt64LE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, "offset");
  const first = this[offset];
  const last = this[offset + 7];
  if (first === void 0 || last === void 0) {
    boundsError(offset, this.length - 8);
  }
  const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
  return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
};
Buffer2.prototype.readBigInt64BE = function readBigInt64BE(offset) {
  offset = offset >>> 0;
  validateNumber(offset, "offset");
  const first = this[offset];
  const last = this[offset + 7];
  if (first === void 0 || last === void 0) {
    boundsError(offset, this.length - 8);
  }
  const val = (first << 24) + // Overflow
  this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
  return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
};
Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4);
};
Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4);
};
Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8);
};
Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError("Index out of range");
}
Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength2 = byteLength2 >>> 0;
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
    checkInt(this, value, offset, byteLength2, maxBytes, 0);
  }
  let mul = 1;
  let i = 0;
  this[offset] = value & 255;
  while (++i < byteLength2 && (mul *= 256)) {
    this[offset + i] = value / mul & 255;
  }
  return offset + byteLength2;
};
Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset >>> 0;
  byteLength2 = byteLength2 >>> 0;
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
    checkInt(this, value, offset, byteLength2, maxBytes, 0);
  }
  let i = byteLength2 - 1;
  let mul = 1;
  this[offset + i] = value & 255;
  while (--i >= 0 && (mul *= 256)) {
    this[offset + i] = value / mul & 255;
  }
  return offset + byteLength2;
};
Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
  this[offset] = value & 255;
  return offset + 1;
};
Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
  this[offset] = value & 255;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};
Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 255;
  return offset + 2;
};
Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
  this[offset + 3] = value >>> 24;
  this[offset + 2] = value >>> 16;
  this[offset + 1] = value >>> 8;
  this[offset] = value & 255;
  return offset + 4;
};
Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 255;
  return offset + 4;
};
function wrtBigUInt64LE(buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);
  let lo = Number(value & BigInt(4294967295));
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  let hi = Number(value >> BigInt(32) & BigInt(4294967295));
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  return offset;
}
function wrtBigUInt64BE(buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7);
  let lo = Number(value & BigInt(4294967295));
  buf[offset + 7] = lo;
  lo = lo >> 8;
  buf[offset + 6] = lo;
  lo = lo >> 8;
  buf[offset + 5] = lo;
  lo = lo >> 8;
  buf[offset + 4] = lo;
  let hi = Number(value >> BigInt(32) & BigInt(4294967295));
  buf[offset + 3] = hi;
  hi = hi >> 8;
  buf[offset + 2] = hi;
  hi = hi >> 8;
  buf[offset + 1] = hi;
  hi = hi >> 8;
  buf[offset] = hi;
  return offset + 8;
}
Buffer2.prototype.writeBigUInt64LE = function writeBigUInt64LE(value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
};
Buffer2.prototype.writeBigUInt64BE = function writeBigUInt64BE(value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
};
Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    const limit = Math.pow(2, 8 * byteLength2 - 1);
    checkInt(this, value, offset, byteLength2, limit - 1, -limit);
  }
  let i = 0;
  let mul = 1;
  let sub = 0;
  this[offset] = value & 255;
  while (++i < byteLength2 && (mul *= 256)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 255;
  }
  return offset + byteLength2;
};
Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    const limit = Math.pow(2, 8 * byteLength2 - 1);
    checkInt(this, value, offset, byteLength2, limit - 1, -limit);
  }
  let i = byteLength2 - 1;
  let mul = 1;
  let sub = 0;
  this[offset + i] = value & 255;
  while (--i >= 0 && (mul *= 256)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 255;
  }
  return offset + byteLength2;
};
Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
  if (value < 0) value = 255 + value + 1;
  this[offset] = value & 255;
  return offset + 1;
};
Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
  this[offset] = value & 255;
  this[offset + 1] = value >>> 8;
  return offset + 2;
};
Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
  this[offset] = value >>> 8;
  this[offset + 1] = value & 255;
  return offset + 2;
};
Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
  this[offset] = value & 255;
  this[offset + 1] = value >>> 8;
  this[offset + 2] = value >>> 16;
  this[offset + 3] = value >>> 24;
  return offset + 4;
};
Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
  if (value < 0) value = 4294967295 + value + 1;
  this[offset] = value >>> 24;
  this[offset + 1] = value >>> 16;
  this[offset + 2] = value >>> 8;
  this[offset + 3] = value & 255;
  return offset + 4;
};
Buffer2.prototype.writeBigInt64LE = function writeBigInt64LE(value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
};
Buffer2.prototype.writeBigInt64BE = function writeBigInt64BE(value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
};
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError("Index out of range");
  if (offset < 0) throw new RangeError("Index out of range");
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}
Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};
Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  value = +value;
  offset = offset >>> 0;
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}
Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};
Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};
Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
  if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;
  if (targetStart < 0) {
    throw new RangeError("targetStart out of bounds");
  }
  if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
  if (end < 0) throw new RangeError("sourceEnd out of bounds");
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }
  const len = end - start;
  if (this === target) {
    this.copyWithin(targetStart, start, end);
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    );
  }
  return len;
};
Buffer2.prototype.fill = function fill(val, start, end, encoding) {
  if (typeof val === "string") {
    if (typeof start === "string") {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === "string") {
      encoding = end;
      end = this.length;
    }
    if (encoding !== void 0 && typeof encoding !== "string") {
      throw new TypeError("encoding must be a string");
    }
    if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    if (val.length === 1) {
      const code4 = val.charCodeAt(0);
      if (encoding === "utf8" && code4 < 128 || encoding === "latin1") {
        val = code4;
      }
    }
  } else if (typeof val === "number") {
    val = val & 255;
  } else if (typeof val === "boolean") {
    val = Number(val);
  }
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError("Out of range index");
  }
  if (end <= start) {
    return this;
  }
  start = start >>> 0;
  end = end === void 0 ? this.length : end >>> 0;
  if (!val) val = 0;
  let i;
  if (typeof val === "number") {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
    const len = bytes.length;
    if (len === 0) {
      throw new TypeError('The value "' + val + '" is invalid for argument "value"');
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }
  return this;
};
var errors = {};
function E(sym, getMessage2, Base) {
  errors[sym] = class NodeError extends Base {
    constructor() {
      super();
      Object.defineProperty(this, "message", {
        value: getMessage2.apply(this, arguments),
        writable: true,
        configurable: true
      });
      this.name = `${this.name} [${sym}]`;
      this.stack;
      delete this.name;
    }
    get code() {
      return sym;
    }
    set code(value) {
      Object.defineProperty(this, "code", {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      });
    }
    toString() {
      return `${this.name} [${sym}]: ${this.message}`;
    }
  };
}
E(
  "ERR_BUFFER_OUT_OF_BOUNDS",
  function(name) {
    if (name) {
      return `${name} is outside of buffer bounds`;
    }
    return "Attempt to access memory outside buffer bounds";
  },
  RangeError
);
E(
  "ERR_INVALID_ARG_TYPE",
  function(name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
  },
  TypeError
);
E(
  "ERR_OUT_OF_RANGE",
  function(str, range, input) {
    let msg = `The value of "${str}" is out of range.`;
    let received = input;
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input));
    } else if (typeof input === "bigint") {
      received = String(input);
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received);
      }
      received += "n";
    }
    msg += ` It must be ${range}. Received ${received}`;
    return msg;
  },
  RangeError
);
function addNumericalSeparator(val) {
  let res = "";
  let i = val.length;
  const start = val[0] === "-" ? 1 : 0;
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`;
  }
  return `${val.slice(0, i)}${res}`;
}
function checkBounds(buf, offset, byteLength2) {
  validateNumber(offset, "offset");
  if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
    boundsError(offset, buf.length - (byteLength2 + 1));
  }
}
function checkIntBI(value, min, max, buf, offset, byteLength2) {
  if (value > max || value < min) {
    const n = typeof min === "bigint" ? "n" : "";
    let range;
    if (byteLength2 > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
      } else {
        range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`;
    }
    throw new errors.ERR_OUT_OF_RANGE("value", range, value);
  }
  checkBounds(buf, offset, byteLength2);
}
function validateNumber(value, name) {
  if (typeof value !== "number") {
    throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
  }
}
function boundsError(value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type);
    throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
  }
  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
  }
  throw new errors.ERR_OUT_OF_RANGE(
    type || "offset",
    `>= ${type ? 1 : 0} and <= ${length}`,
    value
  );
}
var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
  str = str.split("=")[0];
  str = str.trim().replace(INVALID_BASE64_RE, "");
  if (str.length < 2) return "";
  while (str.length % 4 !== 0) {
    str = str + "=";
  }
  return str;
}
function utf8ToBytes(string, units) {
  units = units || Infinity;
  let codePoint;
  const length = string.length;
  let leadSurrogate = null;
  const bytes = [];
  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);
    if (codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
          continue;
        } else if (i + 1 === length) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
          continue;
        }
        leadSurrogate = codePoint;
        continue;
      }
      if (codePoint < 56320) {
        if ((units -= 3) > -1) bytes.push(239, 191, 189);
        leadSurrogate = codePoint;
        continue;
      }
      codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
    } else if (leadSurrogate) {
      if ((units -= 3) > -1) bytes.push(239, 191, 189);
    }
    leadSurrogate = null;
    if (codePoint < 128) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0) break;
      bytes.push(
        codePoint >> 6 | 192,
        codePoint & 63 | 128
      );
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0) break;
      bytes.push(
        codePoint >> 12 | 224,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0) break;
      bytes.push(
        codePoint >> 18 | 240,
        codePoint >> 12 & 63 | 128,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else {
      throw new Error("Invalid code point");
    }
  }
  return bytes;
}
function asciiToBytes(str) {
  const byteArray = [];
  for (let i = 0; i < str.length; ++i) {
    byteArray.push(str.charCodeAt(i) & 255);
  }
  return byteArray;
}
function utf16leToBytes(str, units) {
  let c, hi, lo;
  const byteArray = [];
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }
  return byteArray;
}
function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
  let i;
  for (i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}
var hexSliceLookupTable = function() {
  const alphabet = "0123456789abcdef";
  const table = new Array(256);
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16;
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j];
    }
  }
  return table;
}();

// frida-shim:node_modules/@frida/process/index.js
function nextTick(callback, ...args) {
  Script.nextTick(callback, ...args);
}
var title = "Frida";
var browser = false;
var platform = detectPlatform();
var pid = Process.id;
var env = {
  FRIDA_COMPILE: "1"
};
var argv = [];
var version = Frida.version;
var versions = {};
function noop() {
}
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
var prependListener = noop;
var prependOnceListener = noop;
var listeners = function(name) {
  return [];
};
function binding(name) {
  throw new Error("process.binding is not supported");
}
function cwd() {
  return Process.platform === "windows" ? "C:\\" : "/";
}
function chdir(dir) {
  throw new Error("process.chdir is not supported");
}
function umask() {
  return 0;
}
var process_default = {
  nextTick,
  title,
  browser,
  platform,
  pid,
  env,
  argv,
  version,
  versions,
  on,
  addListener,
  once,
  off,
  removeListener,
  removeAllListeners,
  emit,
  prependListener,
  prependOnceListener,
  listeners,
  binding,
  cwd,
  chdir,
  umask
};
function detectPlatform() {
  const platform3 = Process.platform;
  return platform3 === "windows" ? "win32" : platform3;
}

// node_modules/frida-java-bridge/lib/android.js
var android_exports = {};
__export(android_exports, {
  ArtMethod: () => ArtMethod,
  ArtStackVisitor: () => ArtStackVisitor,
  DVM_JNI_ENV_OFFSET_SELF: () => DVM_JNI_ENV_OFFSET_SELF,
  HandleVector: () => HandleVector,
  VariableSizedHandleScope: () => VariableSizedHandleScope,
  backtrace: () => backtrace,
  deoptimizeBootImage: () => deoptimizeBootImage,
  deoptimizeEverything: () => deoptimizeEverything,
  deoptimizeMethod: () => deoptimizeMethod,
  ensureClassInitialized: () => ensureClassInitialized,
  getAndroidApiLevel: () => getAndroidApiLevel,
  getAndroidVersion: () => getAndroidVersion,
  getApi: () => getApi,
  getArtClassSpec: () => getArtClassSpec,
  getArtFieldSpec: () => getArtFieldSpec,
  getArtMethodSpec: () => getArtMethodSpec,
  getArtThreadFromEnv: () => getArtThreadFromEnv,
  getArtThreadSpec: () => getArtThreadSpec,
  makeArtClassLoaderVisitor: () => makeArtClassLoaderVisitor,
  makeArtClassVisitor: () => makeArtClassVisitor,
  makeMethodMangler: () => makeMethodMangler,
  makeObjectVisitorPredicate: () => makeObjectVisitorPredicate,
  revertGlobalPatches: () => revertGlobalPatches,
  translateMethod: () => translateMethod,
  withAllArtThreadsSuspended: () => withAllArtThreadsSuspended,
  withRunnableArtThread: () => withRunnableArtThread
});

// node_modules/frida-java-bridge/lib/alloc.js
var {
  pageSize,
  pointerSize: pointerSize2
} = Process;
var CodeAllocator = class {
  constructor(sliceSize) {
    this.sliceSize = sliceSize;
    this.slicesPerPage = pageSize / sliceSize;
    this.pages = [];
    this.free = [];
  }
  allocateSlice(spec, alignment) {
    const anyLocation = spec.near === void 0;
    const anyAlignment = alignment === 1;
    if (anyLocation && anyAlignment) {
      const slice2 = this.free.pop();
      if (slice2 !== void 0) {
        return slice2;
      }
    } else if (alignment < pageSize) {
      const { free } = this;
      const n = free.length;
      const alignMask = anyAlignment ? null : ptr(alignment - 1);
      for (let i = 0; i !== n; i++) {
        const slice2 = free[i];
        const satisfiesLocation = anyLocation || this._isSliceNear(slice2, spec);
        const satisfiesAlignment = anyAlignment || slice2.and(alignMask).isNull();
        if (satisfiesLocation && satisfiesAlignment) {
          return free.splice(i, 1)[0];
        }
      }
    }
    return this._allocatePage(spec);
  }
  _allocatePage(spec) {
    const page = Memory.alloc(pageSize, spec);
    const { sliceSize, slicesPerPage } = this;
    for (let i = 1; i !== slicesPerPage; i++) {
      const slice2 = page.add(i * sliceSize);
      this.free.push(slice2);
    }
    this.pages.push(page);
    return page;
  }
  _isSliceNear(slice2, spec) {
    const sliceEnd = slice2.add(this.sliceSize);
    const { near, maxDistance } = spec;
    const startDistance = abs(near.sub(slice2));
    const endDistance = abs(near.sub(sliceEnd));
    return startDistance.compare(maxDistance) <= 0 && endDistance.compare(maxDistance) <= 0;
  }
  freeSlice(slice2) {
    this.free.push(slice2);
  }
};
function abs(nptr) {
  const shmt = pointerSize2 === 4 ? 31 : 63;
  const mask = ptr(1).shl(shmt).not();
  return nptr.and(mask);
}
function makeAllocator(sliceSize) {
  return new CodeAllocator(sliceSize);
}

// node_modules/frida-java-bridge/lib/result.js
var JNI_OK = 0;
function checkJniResult(name, result) {
  if (result !== JNI_OK) {
    throw new Error(name + " failed: " + result);
  }
}

// node_modules/frida-java-bridge/lib/jvmti.js
var jvmtiVersion = {
  v1_0: 805371904,
  v1_2: 805372416
};
var jvmtiCapabilities = {
  canTagObjects: 1
};
var { pointerSize: pointerSize3 } = Process;
var nativeFunctionOptions = {
  exceptions: "propagate"
};
function EnvJvmti(handle2, vm3) {
  this.handle = handle2;
  this.vm = vm3;
  this.vtable = handle2.readPointer();
}
EnvJvmti.prototype.deallocate = proxy(47, "int32", ["pointer", "pointer"], function(impl2, mem) {
  return impl2(this.handle, mem);
});
EnvJvmti.prototype.getLoadedClasses = proxy(78, "int32", ["pointer", "pointer", "pointer"], function(impl2, classCountPtr, classesPtr) {
  const result = impl2(this.handle, classCountPtr, classesPtr);
  checkJniResult("EnvJvmti::getLoadedClasses", result);
});
EnvJvmti.prototype.iterateOverInstancesOfClass = proxy(112, "int32", ["pointer", "pointer", "int", "pointer", "pointer"], function(impl2, klass, objectFilter, heapObjectCallback, userData) {
  const result = impl2(this.handle, klass, objectFilter, heapObjectCallback, userData);
  checkJniResult("EnvJvmti::iterateOverInstancesOfClass", result);
});
EnvJvmti.prototype.getObjectsWithTags = proxy(114, "int32", ["pointer", "int", "pointer", "pointer", "pointer", "pointer"], function(impl2, tagCount, tags, countPtr, objectResultPtr, tagResultPtr) {
  const result = impl2(this.handle, tagCount, tags, countPtr, objectResultPtr, tagResultPtr);
  checkJniResult("EnvJvmti::getObjectsWithTags", result);
});
EnvJvmti.prototype.addCapabilities = proxy(142, "int32", ["pointer", "pointer"], function(impl2, capabilitiesPtr) {
  return impl2(this.handle, capabilitiesPtr);
});
function proxy(offset, retType2, argTypes2, wrapper) {
  let impl2 = null;
  return function() {
    if (impl2 === null) {
      impl2 = new NativeFunction(this.vtable.add((offset - 1) * pointerSize3).readPointer(), retType2, argTypes2, nativeFunctionOptions);
    }
    let args = [impl2];
    args = args.concat.apply(args, arguments);
    return wrapper.apply(this, args);
  };
}

// node_modules/frida-java-bridge/lib/machine-code.js
function parseInstructionsAt(address, tryParse, { limit }) {
  let cursor = address;
  let prevInsn = null;
  for (let i = 0; i !== limit; i++) {
    const insn = Instruction.parse(cursor);
    const value = tryParse(insn, prevInsn);
    if (value !== null) {
      return value;
    }
    cursor = insn.next;
    prevInsn = insn;
  }
  return null;
}

// node_modules/frida-java-bridge/lib/memoize.js
function memoize(compute) {
  let value = null;
  let computed = false;
  return function(...args) {
    if (!computed) {
      value = compute(...args);
      computed = true;
    }
    return value;
  };
}

// node_modules/frida-java-bridge/lib/env.js
function Env(handle2, vm3) {
  this.handle = handle2;
  this.vm = vm3;
}
var pointerSize4 = Process.pointerSize;
var JNI_ABORT = 2;
var CALL_CONSTRUCTOR_METHOD_OFFSET = 28;
var CALL_OBJECT_METHOD_OFFSET = 34;
var CALL_BOOLEAN_METHOD_OFFSET = 37;
var CALL_BYTE_METHOD_OFFSET = 40;
var CALL_CHAR_METHOD_OFFSET = 43;
var CALL_SHORT_METHOD_OFFSET = 46;
var CALL_INT_METHOD_OFFSET = 49;
var CALL_LONG_METHOD_OFFSET = 52;
var CALL_FLOAT_METHOD_OFFSET = 55;
var CALL_DOUBLE_METHOD_OFFSET = 58;
var CALL_VOID_METHOD_OFFSET = 61;
var CALL_NONVIRTUAL_OBJECT_METHOD_OFFSET = 64;
var CALL_NONVIRTUAL_BOOLEAN_METHOD_OFFSET = 67;
var CALL_NONVIRTUAL_BYTE_METHOD_OFFSET = 70;
var CALL_NONVIRTUAL_CHAR_METHOD_OFFSET = 73;
var CALL_NONVIRTUAL_SHORT_METHOD_OFFSET = 76;
var CALL_NONVIRTUAL_INT_METHOD_OFFSET = 79;
var CALL_NONVIRTUAL_LONG_METHOD_OFFSET = 82;
var CALL_NONVIRTUAL_FLOAT_METHOD_OFFSET = 85;
var CALL_NONVIRTUAL_DOUBLE_METHOD_OFFSET = 88;
var CALL_NONVIRTUAL_VOID_METHOD_OFFSET = 91;
var CALL_STATIC_OBJECT_METHOD_OFFSET = 114;
var CALL_STATIC_BOOLEAN_METHOD_OFFSET = 117;
var CALL_STATIC_BYTE_METHOD_OFFSET = 120;
var CALL_STATIC_CHAR_METHOD_OFFSET = 123;
var CALL_STATIC_SHORT_METHOD_OFFSET = 126;
var CALL_STATIC_INT_METHOD_OFFSET = 129;
var CALL_STATIC_LONG_METHOD_OFFSET = 132;
var CALL_STATIC_FLOAT_METHOD_OFFSET = 135;
var CALL_STATIC_DOUBLE_METHOD_OFFSET = 138;
var CALL_STATIC_VOID_METHOD_OFFSET = 141;
var GET_OBJECT_FIELD_OFFSET = 95;
var GET_BOOLEAN_FIELD_OFFSET = 96;
var GET_BYTE_FIELD_OFFSET = 97;
var GET_CHAR_FIELD_OFFSET = 98;
var GET_SHORT_FIELD_OFFSET = 99;
var GET_INT_FIELD_OFFSET = 100;
var GET_LONG_FIELD_OFFSET = 101;
var GET_FLOAT_FIELD_OFFSET = 102;
var GET_DOUBLE_FIELD_OFFSET = 103;
var SET_OBJECT_FIELD_OFFSET = 104;
var SET_BOOLEAN_FIELD_OFFSET = 105;
var SET_BYTE_FIELD_OFFSET = 106;
var SET_CHAR_FIELD_OFFSET = 107;
var SET_SHORT_FIELD_OFFSET = 108;
var SET_INT_FIELD_OFFSET = 109;
var SET_LONG_FIELD_OFFSET = 110;
var SET_FLOAT_FIELD_OFFSET = 111;
var SET_DOUBLE_FIELD_OFFSET = 112;
var GET_STATIC_OBJECT_FIELD_OFFSET = 145;
var GET_STATIC_BOOLEAN_FIELD_OFFSET = 146;
var GET_STATIC_BYTE_FIELD_OFFSET = 147;
var GET_STATIC_CHAR_FIELD_OFFSET = 148;
var GET_STATIC_SHORT_FIELD_OFFSET = 149;
var GET_STATIC_INT_FIELD_OFFSET = 150;
var GET_STATIC_LONG_FIELD_OFFSET = 151;
var GET_STATIC_FLOAT_FIELD_OFFSET = 152;
var GET_STATIC_DOUBLE_FIELD_OFFSET = 153;
var SET_STATIC_OBJECT_FIELD_OFFSET = 154;
var SET_STATIC_BOOLEAN_FIELD_OFFSET = 155;
var SET_STATIC_BYTE_FIELD_OFFSET = 156;
var SET_STATIC_CHAR_FIELD_OFFSET = 157;
var SET_STATIC_SHORT_FIELD_OFFSET = 158;
var SET_STATIC_INT_FIELD_OFFSET = 159;
var SET_STATIC_LONG_FIELD_OFFSET = 160;
var SET_STATIC_FLOAT_FIELD_OFFSET = 161;
var SET_STATIC_DOUBLE_FIELD_OFFSET = 162;
var callMethodOffset = {
  pointer: CALL_OBJECT_METHOD_OFFSET,
  uint8: CALL_BOOLEAN_METHOD_OFFSET,
  int8: CALL_BYTE_METHOD_OFFSET,
  uint16: CALL_CHAR_METHOD_OFFSET,
  int16: CALL_SHORT_METHOD_OFFSET,
  int32: CALL_INT_METHOD_OFFSET,
  int64: CALL_LONG_METHOD_OFFSET,
  float: CALL_FLOAT_METHOD_OFFSET,
  double: CALL_DOUBLE_METHOD_OFFSET,
  void: CALL_VOID_METHOD_OFFSET
};
var callNonvirtualMethodOffset = {
  pointer: CALL_NONVIRTUAL_OBJECT_METHOD_OFFSET,
  uint8: CALL_NONVIRTUAL_BOOLEAN_METHOD_OFFSET,
  int8: CALL_NONVIRTUAL_BYTE_METHOD_OFFSET,
  uint16: CALL_NONVIRTUAL_CHAR_METHOD_OFFSET,
  int16: CALL_NONVIRTUAL_SHORT_METHOD_OFFSET,
  int32: CALL_NONVIRTUAL_INT_METHOD_OFFSET,
  int64: CALL_NONVIRTUAL_LONG_METHOD_OFFSET,
  float: CALL_NONVIRTUAL_FLOAT_METHOD_OFFSET,
  double: CALL_NONVIRTUAL_DOUBLE_METHOD_OFFSET,
  void: CALL_NONVIRTUAL_VOID_METHOD_OFFSET
};
var callStaticMethodOffset = {
  pointer: CALL_STATIC_OBJECT_METHOD_OFFSET,
  uint8: CALL_STATIC_BOOLEAN_METHOD_OFFSET,
  int8: CALL_STATIC_BYTE_METHOD_OFFSET,
  uint16: CALL_STATIC_CHAR_METHOD_OFFSET,
  int16: CALL_STATIC_SHORT_METHOD_OFFSET,
  int32: CALL_STATIC_INT_METHOD_OFFSET,
  int64: CALL_STATIC_LONG_METHOD_OFFSET,
  float: CALL_STATIC_FLOAT_METHOD_OFFSET,
  double: CALL_STATIC_DOUBLE_METHOD_OFFSET,
  void: CALL_STATIC_VOID_METHOD_OFFSET
};
var getFieldOffset = {
  pointer: GET_OBJECT_FIELD_OFFSET,
  uint8: GET_BOOLEAN_FIELD_OFFSET,
  int8: GET_BYTE_FIELD_OFFSET,
  uint16: GET_CHAR_FIELD_OFFSET,
  int16: GET_SHORT_FIELD_OFFSET,
  int32: GET_INT_FIELD_OFFSET,
  int64: GET_LONG_FIELD_OFFSET,
  float: GET_FLOAT_FIELD_OFFSET,
  double: GET_DOUBLE_FIELD_OFFSET
};
var setFieldOffset = {
  pointer: SET_OBJECT_FIELD_OFFSET,
  uint8: SET_BOOLEAN_FIELD_OFFSET,
  int8: SET_BYTE_FIELD_OFFSET,
  uint16: SET_CHAR_FIELD_OFFSET,
  int16: SET_SHORT_FIELD_OFFSET,
  int32: SET_INT_FIELD_OFFSET,
  int64: SET_LONG_FIELD_OFFSET,
  float: SET_FLOAT_FIELD_OFFSET,
  double: SET_DOUBLE_FIELD_OFFSET
};
var getStaticFieldOffset = {
  pointer: GET_STATIC_OBJECT_FIELD_OFFSET,
  uint8: GET_STATIC_BOOLEAN_FIELD_OFFSET,
  int8: GET_STATIC_BYTE_FIELD_OFFSET,
  uint16: GET_STATIC_CHAR_FIELD_OFFSET,
  int16: GET_STATIC_SHORT_FIELD_OFFSET,
  int32: GET_STATIC_INT_FIELD_OFFSET,
  int64: GET_STATIC_LONG_FIELD_OFFSET,
  float: GET_STATIC_FLOAT_FIELD_OFFSET,
  double: GET_STATIC_DOUBLE_FIELD_OFFSET
};
var setStaticFieldOffset = {
  pointer: SET_STATIC_OBJECT_FIELD_OFFSET,
  uint8: SET_STATIC_BOOLEAN_FIELD_OFFSET,
  int8: SET_STATIC_BYTE_FIELD_OFFSET,
  uint16: SET_STATIC_CHAR_FIELD_OFFSET,
  int16: SET_STATIC_SHORT_FIELD_OFFSET,
  int32: SET_STATIC_INT_FIELD_OFFSET,
  int64: SET_STATIC_LONG_FIELD_OFFSET,
  float: SET_STATIC_FLOAT_FIELD_OFFSET,
  double: SET_STATIC_DOUBLE_FIELD_OFFSET
};
var nativeFunctionOptions2 = {
  exceptions: "propagate"
};
var cachedVtable = null;
var globalRefs = [];
Env.dispose = function(env2) {
  globalRefs.forEach(env2.deleteGlobalRef, env2);
  globalRefs = [];
};
function register(globalRef) {
  globalRefs.push(globalRef);
  return globalRef;
}
function vtable(instance) {
  if (cachedVtable === null) {
    cachedVtable = instance.handle.readPointer();
  }
  return cachedVtable;
}
function proxy2(offset, retType2, argTypes2, wrapper) {
  let impl2 = null;
  return function() {
    if (impl2 === null) {
      impl2 = new NativeFunction(vtable(this).add(offset * pointerSize4).readPointer(), retType2, argTypes2, nativeFunctionOptions2);
    }
    let args = [impl2];
    args = args.concat.apply(args, arguments);
    return wrapper.apply(this, args);
  };
}
Env.prototype.getVersion = proxy2(4, "int32", ["pointer"], function(impl2) {
  return impl2(this.handle);
});
Env.prototype.findClass = proxy2(6, "pointer", ["pointer", "pointer"], function(impl2, name) {
  const result = impl2(this.handle, Memory.allocUtf8String(name));
  this.throwIfExceptionPending();
  return result;
});
Env.prototype.throwIfExceptionPending = function() {
  const throwable = this.exceptionOccurred();
  if (throwable.isNull()) {
    return;
  }
  this.exceptionClear();
  const handle2 = this.newGlobalRef(throwable);
  this.deleteLocalRef(throwable);
  const description = this.vaMethod("pointer", [])(this.handle, handle2, this.javaLangObject().toString);
  const descriptionStr = this.stringFromJni(description);
  this.deleteLocalRef(description);
  const error = new Error(descriptionStr);
  error.$h = handle2;
  Script.bindWeak(error, makeErrorHandleDestructor(this.vm, handle2));
  throw error;
};
function makeErrorHandleDestructor(vm3, handle2) {
  return function() {
    vm3.perform((env2) => {
      env2.deleteGlobalRef(handle2);
    });
  };
}
Env.prototype.fromReflectedMethod = proxy2(7, "pointer", ["pointer", "pointer"], function(impl2, method2) {
  return impl2(this.handle, method2);
});
Env.prototype.fromReflectedField = proxy2(8, "pointer", ["pointer", "pointer"], function(impl2, method2) {
  return impl2(this.handle, method2);
});
Env.prototype.toReflectedMethod = proxy2(9, "pointer", ["pointer", "pointer", "pointer", "uint8"], function(impl2, klass, methodId, isStatic) {
  return impl2(this.handle, klass, methodId, isStatic);
});
Env.prototype.getSuperclass = proxy2(10, "pointer", ["pointer", "pointer"], function(impl2, klass) {
  return impl2(this.handle, klass);
});
Env.prototype.isAssignableFrom = proxy2(11, "uint8", ["pointer", "pointer", "pointer"], function(impl2, klass1, klass2) {
  return !!impl2(this.handle, klass1, klass2);
});
Env.prototype.toReflectedField = proxy2(12, "pointer", ["pointer", "pointer", "pointer", "uint8"], function(impl2, klass, fieldId, isStatic) {
  return impl2(this.handle, klass, fieldId, isStatic);
});
Env.prototype.throw = proxy2(13, "int32", ["pointer", "pointer"], function(impl2, obj) {
  return impl2(this.handle, obj);
});
Env.prototype.exceptionOccurred = proxy2(15, "pointer", ["pointer"], function(impl2) {
  return impl2(this.handle);
});
Env.prototype.exceptionDescribe = proxy2(16, "void", ["pointer"], function(impl2) {
  impl2(this.handle);
});
Env.prototype.exceptionClear = proxy2(17, "void", ["pointer"], function(impl2) {
  impl2(this.handle);
});
Env.prototype.pushLocalFrame = proxy2(19, "int32", ["pointer", "int32"], function(impl2, capacity) {
  return impl2(this.handle, capacity);
});
Env.prototype.popLocalFrame = proxy2(20, "pointer", ["pointer", "pointer"], function(impl2, result) {
  return impl2(this.handle, result);
});
Env.prototype.newGlobalRef = proxy2(21, "pointer", ["pointer", "pointer"], function(impl2, obj) {
  return impl2(this.handle, obj);
});
Env.prototype.deleteGlobalRef = proxy2(22, "void", ["pointer", "pointer"], function(impl2, globalRef) {
  impl2(this.handle, globalRef);
});
Env.prototype.deleteLocalRef = proxy2(23, "void", ["pointer", "pointer"], function(impl2, localRef) {
  impl2(this.handle, localRef);
});
Env.prototype.isSameObject = proxy2(24, "uint8", ["pointer", "pointer", "pointer"], function(impl2, ref1, ref2) {
  return !!impl2(this.handle, ref1, ref2);
});
Env.prototype.newLocalRef = proxy2(25, "pointer", ["pointer", "pointer"], function(impl2, obj) {
  return impl2(this.handle, obj);
});
Env.prototype.allocObject = proxy2(27, "pointer", ["pointer", "pointer"], function(impl2, clazz) {
  return impl2(this.handle, clazz);
});
Env.prototype.getObjectClass = proxy2(31, "pointer", ["pointer", "pointer"], function(impl2, obj) {
  return impl2(this.handle, obj);
});
Env.prototype.isInstanceOf = proxy2(32, "uint8", ["pointer", "pointer", "pointer"], function(impl2, obj, klass) {
  return !!impl2(this.handle, obj, klass);
});
Env.prototype.getMethodId = proxy2(33, "pointer", ["pointer", "pointer", "pointer", "pointer"], function(impl2, klass, name, sig) {
  return impl2(this.handle, klass, Memory.allocUtf8String(name), Memory.allocUtf8String(sig));
});
Env.prototype.getFieldId = proxy2(94, "pointer", ["pointer", "pointer", "pointer", "pointer"], function(impl2, klass, name, sig) {
  return impl2(this.handle, klass, Memory.allocUtf8String(name), Memory.allocUtf8String(sig));
});
Env.prototype.getIntField = proxy2(100, "int32", ["pointer", "pointer", "pointer"], function(impl2, obj, fieldId) {
  return impl2(this.handle, obj, fieldId);
});
Env.prototype.getStaticMethodId = proxy2(113, "pointer", ["pointer", "pointer", "pointer", "pointer"], function(impl2, klass, name, sig) {
  return impl2(this.handle, klass, Memory.allocUtf8String(name), Memory.allocUtf8String(sig));
});
Env.prototype.getStaticFieldId = proxy2(144, "pointer", ["pointer", "pointer", "pointer", "pointer"], function(impl2, klass, name, sig) {
  return impl2(this.handle, klass, Memory.allocUtf8String(name), Memory.allocUtf8String(sig));
});
Env.prototype.getStaticIntField = proxy2(150, "int32", ["pointer", "pointer", "pointer"], function(impl2, obj, fieldId) {
  return impl2(this.handle, obj, fieldId);
});
Env.prototype.getStringLength = proxy2(164, "int32", ["pointer", "pointer"], function(impl2, str) {
  return impl2(this.handle, str);
});
Env.prototype.getStringChars = proxy2(165, "pointer", ["pointer", "pointer", "pointer"], function(impl2, str) {
  return impl2(this.handle, str, NULL);
});
Env.prototype.releaseStringChars = proxy2(166, "void", ["pointer", "pointer", "pointer"], function(impl2, str, utf) {
  impl2(this.handle, str, utf);
});
Env.prototype.newStringUtf = proxy2(167, "pointer", ["pointer", "pointer"], function(impl2, str) {
  const utf = Memory.allocUtf8String(str);
  return impl2(this.handle, utf);
});
Env.prototype.getStringUtfChars = proxy2(169, "pointer", ["pointer", "pointer", "pointer"], function(impl2, str) {
  return impl2(this.handle, str, NULL);
});
Env.prototype.releaseStringUtfChars = proxy2(170, "void", ["pointer", "pointer", "pointer"], function(impl2, str, utf) {
  impl2(this.handle, str, utf);
});
Env.prototype.getArrayLength = proxy2(171, "int32", ["pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array);
});
Env.prototype.newObjectArray = proxy2(172, "pointer", ["pointer", "int32", "pointer", "pointer"], function(impl2, length, elementClass, initialElement) {
  return impl2(this.handle, length, elementClass, initialElement);
});
Env.prototype.getObjectArrayElement = proxy2(173, "pointer", ["pointer", "pointer", "int32"], function(impl2, array, index) {
  return impl2(this.handle, array, index);
});
Env.prototype.setObjectArrayElement = proxy2(174, "void", ["pointer", "pointer", "int32", "pointer"], function(impl2, array, index, value) {
  impl2(this.handle, array, index, value);
});
Env.prototype.newBooleanArray = proxy2(175, "pointer", ["pointer", "int32"], function(impl2, length) {
  return impl2(this.handle, length);
});
Env.prototype.newByteArray = proxy2(176, "pointer", ["pointer", "int32"], function(impl2, length) {
  return impl2(this.handle, length);
});
Env.prototype.newCharArray = proxy2(177, "pointer", ["pointer", "int32"], function(impl2, length) {
  return impl2(this.handle, length);
});
Env.prototype.newShortArray = proxy2(178, "pointer", ["pointer", "int32"], function(impl2, length) {
  return impl2(this.handle, length);
});
Env.prototype.newIntArray = proxy2(179, "pointer", ["pointer", "int32"], function(impl2, length) {
  return impl2(this.handle, length);
});
Env.prototype.newLongArray = proxy2(180, "pointer", ["pointer", "int32"], function(impl2, length) {
  return impl2(this.handle, length);
});
Env.prototype.newFloatArray = proxy2(181, "pointer", ["pointer", "int32"], function(impl2, length) {
  return impl2(this.handle, length);
});
Env.prototype.newDoubleArray = proxy2(182, "pointer", ["pointer", "int32"], function(impl2, length) {
  return impl2(this.handle, length);
});
Env.prototype.getBooleanArrayElements = proxy2(183, "pointer", ["pointer", "pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array, NULL);
});
Env.prototype.getByteArrayElements = proxy2(184, "pointer", ["pointer", "pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array, NULL);
});
Env.prototype.getCharArrayElements = proxy2(185, "pointer", ["pointer", "pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array, NULL);
});
Env.prototype.getShortArrayElements = proxy2(186, "pointer", ["pointer", "pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array, NULL);
});
Env.prototype.getIntArrayElements = proxy2(187, "pointer", ["pointer", "pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array, NULL);
});
Env.prototype.getLongArrayElements = proxy2(188, "pointer", ["pointer", "pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array, NULL);
});
Env.prototype.getFloatArrayElements = proxy2(189, "pointer", ["pointer", "pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array, NULL);
});
Env.prototype.getDoubleArrayElements = proxy2(190, "pointer", ["pointer", "pointer", "pointer"], function(impl2, array) {
  return impl2(this.handle, array, NULL);
});
Env.prototype.releaseBooleanArrayElements = proxy2(191, "pointer", ["pointer", "pointer", "pointer", "int32"], function(impl2, array, cArray) {
  impl2(this.handle, array, cArray, JNI_ABORT);
});
Env.prototype.releaseByteArrayElements = proxy2(192, "pointer", ["pointer", "pointer", "pointer", "int32"], function(impl2, array, cArray) {
  impl2(this.handle, array, cArray, JNI_ABORT);
});
Env.prototype.releaseCharArrayElements = proxy2(193, "pointer", ["pointer", "pointer", "pointer", "int32"], function(impl2, array, cArray) {
  impl2(this.handle, array, cArray, JNI_ABORT);
});
Env.prototype.releaseShortArrayElements = proxy2(194, "pointer", ["pointer", "pointer", "pointer", "int32"], function(impl2, array, cArray) {
  impl2(this.handle, array, cArray, JNI_ABORT);
});
Env.prototype.releaseIntArrayElements = proxy2(195, "pointer", ["pointer", "pointer", "pointer", "int32"], function(impl2, array, cArray) {
  impl2(this.handle, array, cArray, JNI_ABORT);
});
Env.prototype.releaseLongArrayElements = proxy2(196, "pointer", ["pointer", "pointer", "pointer", "int32"], function(impl2, array, cArray) {
  impl2(this.handle, array, cArray, JNI_ABORT);
});
Env.prototype.releaseFloatArrayElements = proxy2(197, "pointer", ["pointer", "pointer", "pointer", "int32"], function(impl2, array, cArray) {
  impl2(this.handle, array, cArray, JNI_ABORT);
});
Env.prototype.releaseDoubleArrayElements = proxy2(198, "pointer", ["pointer", "pointer", "pointer", "int32"], function(impl2, array, cArray) {
  impl2(this.handle, array, cArray, JNI_ABORT);
});
Env.prototype.getByteArrayRegion = proxy2(200, "void", ["pointer", "pointer", "int", "int", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.setBooleanArrayRegion = proxy2(207, "void", ["pointer", "pointer", "int32", "int32", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.setByteArrayRegion = proxy2(208, "void", ["pointer", "pointer", "int32", "int32", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.setCharArrayRegion = proxy2(209, "void", ["pointer", "pointer", "int32", "int32", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.setShortArrayRegion = proxy2(210, "void", ["pointer", "pointer", "int32", "int32", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.setIntArrayRegion = proxy2(211, "void", ["pointer", "pointer", "int32", "int32", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.setLongArrayRegion = proxy2(212, "void", ["pointer", "pointer", "int32", "int32", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.setFloatArrayRegion = proxy2(213, "void", ["pointer", "pointer", "int32", "int32", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.setDoubleArrayRegion = proxy2(214, "void", ["pointer", "pointer", "int32", "int32", "pointer"], function(impl2, array, start, length, cArray) {
  impl2(this.handle, array, start, length, cArray);
});
Env.prototype.registerNatives = proxy2(215, "int32", ["pointer", "pointer", "pointer", "int32"], function(impl2, klass, methods, numMethods) {
  return impl2(this.handle, klass, methods, numMethods);
});
Env.prototype.monitorEnter = proxy2(217, "int32", ["pointer", "pointer"], function(impl2, obj) {
  return impl2(this.handle, obj);
});
Env.prototype.monitorExit = proxy2(218, "int32", ["pointer", "pointer"], function(impl2, obj) {
  return impl2(this.handle, obj);
});
Env.prototype.getDirectBufferAddress = proxy2(230, "pointer", ["pointer", "pointer"], function(impl2, obj) {
  return impl2(this.handle, obj);
});
Env.prototype.getObjectRefType = proxy2(232, "int32", ["pointer", "pointer"], function(impl2, ref) {
  return impl2(this.handle, ref);
});
var cachedMethods = /* @__PURE__ */ new Map();
function plainMethod(offset, retType2, argTypes2, options) {
  return getOrMakeMethod(this, "p", makePlainMethod, offset, retType2, argTypes2, options);
}
function vaMethod(offset, retType2, argTypes2, options) {
  return getOrMakeMethod(this, "v", makeVaMethod, offset, retType2, argTypes2, options);
}
function nonvirtualVaMethod(offset, retType2, argTypes2, options) {
  return getOrMakeMethod(this, "n", makeNonvirtualVaMethod, offset, retType2, argTypes2, options);
}
function getOrMakeMethod(env2, flavor, construct2, offset, retType2, argTypes2, options) {
  if (options !== void 0) {
    return construct2(env2, offset, retType2, argTypes2, options);
  }
  const key = [offset, flavor, retType2].concat(argTypes2).join("|");
  let m2 = cachedMethods.get(key);
  if (m2 === void 0) {
    m2 = construct2(env2, offset, retType2, argTypes2, nativeFunctionOptions2);
    cachedMethods.set(key, m2);
  }
  return m2;
}
function makePlainMethod(env2, offset, retType2, argTypes2, options) {
  return new NativeFunction(
    vtable(env2).add(offset * pointerSize4).readPointer(),
    retType2,
    ["pointer", "pointer", "pointer"].concat(argTypes2),
    options
  );
}
function makeVaMethod(env2, offset, retType2, argTypes2, options) {
  return new NativeFunction(
    vtable(env2).add(offset * pointerSize4).readPointer(),
    retType2,
    ["pointer", "pointer", "pointer", "..."].concat(argTypes2),
    options
  );
}
function makeNonvirtualVaMethod(env2, offset, retType2, argTypes2, options) {
  return new NativeFunction(
    vtable(env2).add(offset * pointerSize4).readPointer(),
    retType2,
    ["pointer", "pointer", "pointer", "pointer", "..."].concat(argTypes2),
    options
  );
}
Env.prototype.constructor = function(argTypes2, options) {
  return vaMethod.call(this, CALL_CONSTRUCTOR_METHOD_OFFSET, "pointer", argTypes2, options);
};
Env.prototype.vaMethod = function(retType2, argTypes2, options) {
  const offset = callMethodOffset[retType2];
  if (offset === void 0) {
    throw new Error("Unsupported type: " + retType2);
  }
  return vaMethod.call(this, offset, retType2, argTypes2, options);
};
Env.prototype.nonvirtualVaMethod = function(retType2, argTypes2, options) {
  const offset = callNonvirtualMethodOffset[retType2];
  if (offset === void 0) {
    throw new Error("Unsupported type: " + retType2);
  }
  return nonvirtualVaMethod.call(this, offset, retType2, argTypes2, options);
};
Env.prototype.staticVaMethod = function(retType2, argTypes2, options) {
  const offset = callStaticMethodOffset[retType2];
  if (offset === void 0) {
    throw new Error("Unsupported type: " + retType2);
  }
  return vaMethod.call(this, offset, retType2, argTypes2, options);
};
Env.prototype.getField = function(fieldType) {
  const offset = getFieldOffset[fieldType];
  if (offset === void 0) {
    throw new Error("Unsupported type: " + fieldType);
  }
  return plainMethod.call(this, offset, fieldType, []);
};
Env.prototype.getStaticField = function(fieldType) {
  const offset = getStaticFieldOffset[fieldType];
  if (offset === void 0) {
    throw new Error("Unsupported type: " + fieldType);
  }
  return plainMethod.call(this, offset, fieldType, []);
};
Env.prototype.setField = function(fieldType) {
  const offset = setFieldOffset[fieldType];
  if (offset === void 0) {
    throw new Error("Unsupported type: " + fieldType);
  }
  return plainMethod.call(this, offset, "void", [fieldType]);
};
Env.prototype.setStaticField = function(fieldType) {
  const offset = setStaticFieldOffset[fieldType];
  if (offset === void 0) {
    throw new Error("Unsupported type: " + fieldType);
  }
  return plainMethod.call(this, offset, "void", [fieldType]);
};
var javaLangClass = null;
Env.prototype.javaLangClass = function() {
  if (javaLangClass === null) {
    const handle2 = this.findClass("java/lang/Class");
    try {
      const get2 = this.getMethodId.bind(this, handle2);
      javaLangClass = {
        handle: register(this.newGlobalRef(handle2)),
        getName: get2("getName", "()Ljava/lang/String;"),
        getSimpleName: get2("getSimpleName", "()Ljava/lang/String;"),
        getGenericSuperclass: get2("getGenericSuperclass", "()Ljava/lang/reflect/Type;"),
        getDeclaredConstructors: get2("getDeclaredConstructors", "()[Ljava/lang/reflect/Constructor;"),
        getDeclaredMethods: get2("getDeclaredMethods", "()[Ljava/lang/reflect/Method;"),
        getDeclaredFields: get2("getDeclaredFields", "()[Ljava/lang/reflect/Field;"),
        isArray: get2("isArray", "()Z"),
        isPrimitive: get2("isPrimitive", "()Z"),
        isInterface: get2("isInterface", "()Z"),
        getComponentType: get2("getComponentType", "()Ljava/lang/Class;")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangClass;
};
var javaLangObject = null;
Env.prototype.javaLangObject = function() {
  if (javaLangObject === null) {
    const handle2 = this.findClass("java/lang/Object");
    try {
      const get2 = this.getMethodId.bind(this, handle2);
      javaLangObject = {
        handle: register(this.newGlobalRef(handle2)),
        toString: get2("toString", "()Ljava/lang/String;"),
        getClass: get2("getClass", "()Ljava/lang/Class;")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangObject;
};
var javaLangReflectConstructor = null;
Env.prototype.javaLangReflectConstructor = function() {
  if (javaLangReflectConstructor === null) {
    const handle2 = this.findClass("java/lang/reflect/Constructor");
    try {
      javaLangReflectConstructor = {
        getGenericParameterTypes: this.getMethodId(handle2, "getGenericParameterTypes", "()[Ljava/lang/reflect/Type;")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangReflectConstructor;
};
var javaLangReflectMethod = null;
Env.prototype.javaLangReflectMethod = function() {
  if (javaLangReflectMethod === null) {
    const handle2 = this.findClass("java/lang/reflect/Method");
    try {
      const get2 = this.getMethodId.bind(this, handle2);
      javaLangReflectMethod = {
        getName: get2("getName", "()Ljava/lang/String;"),
        getGenericParameterTypes: get2("getGenericParameterTypes", "()[Ljava/lang/reflect/Type;"),
        getParameterTypes: get2("getParameterTypes", "()[Ljava/lang/Class;"),
        getGenericReturnType: get2("getGenericReturnType", "()Ljava/lang/reflect/Type;"),
        getGenericExceptionTypes: get2("getGenericExceptionTypes", "()[Ljava/lang/reflect/Type;"),
        getModifiers: get2("getModifiers", "()I"),
        isVarArgs: get2("isVarArgs", "()Z")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangReflectMethod;
};
var javaLangReflectField = null;
Env.prototype.javaLangReflectField = function() {
  if (javaLangReflectField === null) {
    const handle2 = this.findClass("java/lang/reflect/Field");
    try {
      const get2 = this.getMethodId.bind(this, handle2);
      javaLangReflectField = {
        getName: get2("getName", "()Ljava/lang/String;"),
        getType: get2("getType", "()Ljava/lang/Class;"),
        getGenericType: get2("getGenericType", "()Ljava/lang/reflect/Type;"),
        getModifiers: get2("getModifiers", "()I"),
        toString: get2("toString", "()Ljava/lang/String;")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangReflectField;
};
var javaLangReflectTypeVariable = null;
Env.prototype.javaLangReflectTypeVariable = function() {
  if (javaLangReflectTypeVariable === null) {
    const handle2 = this.findClass("java/lang/reflect/TypeVariable");
    try {
      const get2 = this.getMethodId.bind(this, handle2);
      javaLangReflectTypeVariable = {
        handle: register(this.newGlobalRef(handle2)),
        getName: get2("getName", "()Ljava/lang/String;"),
        getBounds: get2("getBounds", "()[Ljava/lang/reflect/Type;"),
        getGenericDeclaration: get2("getGenericDeclaration", "()Ljava/lang/reflect/GenericDeclaration;")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangReflectTypeVariable;
};
var javaLangReflectWildcardType = null;
Env.prototype.javaLangReflectWildcardType = function() {
  if (javaLangReflectWildcardType === null) {
    const handle2 = this.findClass("java/lang/reflect/WildcardType");
    try {
      const get2 = this.getMethodId.bind(this, handle2);
      javaLangReflectWildcardType = {
        handle: register(this.newGlobalRef(handle2)),
        getLowerBounds: get2("getLowerBounds", "()[Ljava/lang/reflect/Type;"),
        getUpperBounds: get2("getUpperBounds", "()[Ljava/lang/reflect/Type;")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangReflectWildcardType;
};
var javaLangReflectGenericArrayType = null;
Env.prototype.javaLangReflectGenericArrayType = function() {
  if (javaLangReflectGenericArrayType === null) {
    const handle2 = this.findClass("java/lang/reflect/GenericArrayType");
    try {
      javaLangReflectGenericArrayType = {
        handle: register(this.newGlobalRef(handle2)),
        getGenericComponentType: this.getMethodId(handle2, "getGenericComponentType", "()Ljava/lang/reflect/Type;")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangReflectGenericArrayType;
};
var javaLangReflectParameterizedType = null;
Env.prototype.javaLangReflectParameterizedType = function() {
  if (javaLangReflectParameterizedType === null) {
    const handle2 = this.findClass("java/lang/reflect/ParameterizedType");
    try {
      const get2 = this.getMethodId.bind(this, handle2);
      javaLangReflectParameterizedType = {
        handle: register(this.newGlobalRef(handle2)),
        getActualTypeArguments: get2("getActualTypeArguments", "()[Ljava/lang/reflect/Type;"),
        getRawType: get2("getRawType", "()Ljava/lang/reflect/Type;"),
        getOwnerType: get2("getOwnerType", "()Ljava/lang/reflect/Type;")
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangReflectParameterizedType;
};
var javaLangString = null;
Env.prototype.javaLangString = function() {
  if (javaLangString === null) {
    const handle2 = this.findClass("java/lang/String");
    try {
      javaLangString = {
        handle: register(this.newGlobalRef(handle2))
      };
    } finally {
      this.deleteLocalRef(handle2);
    }
  }
  return javaLangString;
};
Env.prototype.getClassName = function(classHandle) {
  const name = this.vaMethod("pointer", [])(this.handle, classHandle, this.javaLangClass().getName);
  try {
    return this.stringFromJni(name);
  } finally {
    this.deleteLocalRef(name);
  }
};
Env.prototype.getObjectClassName = function(objHandle) {
  const jklass = this.getObjectClass(objHandle);
  try {
    return this.getClassName(jklass);
  } finally {
    this.deleteLocalRef(jklass);
  }
};
Env.prototype.getActualTypeArgument = function(type) {
  const actualTypeArguments = this.vaMethod("pointer", [])(this.handle, type, this.javaLangReflectParameterizedType().getActualTypeArguments);
  this.throwIfExceptionPending();
  if (!actualTypeArguments.isNull()) {
    try {
      return this.getTypeNameFromFirstTypeElement(actualTypeArguments);
    } finally {
      this.deleteLocalRef(actualTypeArguments);
    }
  }
};
Env.prototype.getTypeNameFromFirstTypeElement = function(typeArray) {
  const length = this.getArrayLength(typeArray);
  if (length > 0) {
    const typeArgument0 = this.getObjectArrayElement(typeArray, 0);
    try {
      return this.getTypeName(typeArgument0);
    } finally {
      this.deleteLocalRef(typeArgument0);
    }
  } else {
    return "java.lang.Object";
  }
};
Env.prototype.getTypeName = function(type, getGenericsInformation) {
  const invokeObjectMethodNoArgs = this.vaMethod("pointer", []);
  if (this.isInstanceOf(type, this.javaLangClass().handle)) {
    return this.getClassName(type);
  } else if (this.isInstanceOf(type, this.javaLangReflectGenericArrayType().handle)) {
    return this.getArrayTypeName(type);
  } else if (this.isInstanceOf(type, this.javaLangReflectParameterizedType().handle)) {
    const rawType = invokeObjectMethodNoArgs(this.handle, type, this.javaLangReflectParameterizedType().getRawType);
    this.throwIfExceptionPending();
    let result;
    try {
      result = this.getTypeName(rawType);
    } finally {
      this.deleteLocalRef(rawType);
    }
    if (getGenericsInformation) {
      result += "<" + this.getActualTypeArgument(type) + ">";
    }
    return result;
  } else if (this.isInstanceOf(type, this.javaLangReflectTypeVariable().handle)) {
    return "java.lang.Object";
  } else if (this.isInstanceOf(type, this.javaLangReflectWildcardType().handle)) {
    return "java.lang.Object";
  } else {
    return "java.lang.Object";
  }
};
Env.prototype.getArrayTypeName = function(type) {
  const invokeObjectMethodNoArgs = this.vaMethod("pointer", []);
  if (this.isInstanceOf(type, this.javaLangClass().handle)) {
    return this.getClassName(type);
  } else if (this.isInstanceOf(type, this.javaLangReflectGenericArrayType().handle)) {
    const componentType = invokeObjectMethodNoArgs(this.handle, type, this.javaLangReflectGenericArrayType().getGenericComponentType);
    this.throwIfExceptionPending();
    try {
      return "[L" + this.getTypeName(componentType) + ";";
    } finally {
      this.deleteLocalRef(componentType);
    }
  } else {
    return "[Ljava.lang.Object;";
  }
};
Env.prototype.stringFromJni = function(str) {
  const utf = this.getStringChars(str);
  if (utf.isNull()) {
    throw new Error("Unable to access string");
  }
  try {
    const length = this.getStringLength(str);
    return utf.readUtf16String(length);
  } finally {
    this.releaseStringChars(str, utf);
  }
};

// node_modules/frida-java-bridge/lib/vm.js
var JNI_VERSION_1_6 = 65542;
var pointerSize5 = Process.pointerSize;
var jsThreadID = Process.getCurrentThreadId();
var attachedThreads = /* @__PURE__ */ new Map();
var activeEnvs = /* @__PURE__ */ new Map();
function VM(api3) {
  const handle2 = api3.vm;
  let attachCurrentThread = null;
  let detachCurrentThread = null;
  let getEnv = null;
  function initialize2() {
    const vtable2 = handle2.readPointer();
    const options = {
      exceptions: "propagate"
    };
    attachCurrentThread = new NativeFunction(vtable2.add(4 * pointerSize5).readPointer(), "int32", ["pointer", "pointer", "pointer"], options);
    detachCurrentThread = new NativeFunction(vtable2.add(5 * pointerSize5).readPointer(), "int32", ["pointer"], options);
    getEnv = new NativeFunction(vtable2.add(6 * pointerSize5).readPointer(), "int32", ["pointer", "pointer", "int32"], options);
  }
  this.handle = handle2;
  this.perform = function(fn) {
    const threadId = Process.getCurrentThreadId();
    const cachedEnv = tryGetCachedEnv(threadId);
    if (cachedEnv !== null) {
      return fn(cachedEnv);
    }
    let env2 = this._tryGetEnv();
    const alreadyAttached = env2 !== null;
    if (!alreadyAttached) {
      env2 = this.attachCurrentThread();
      attachedThreads.set(threadId, true);
    }
    this.link(threadId, env2);
    try {
      return fn(env2);
    } finally {
      const isJsThread = threadId === jsThreadID;
      if (!isJsThread) {
        this.unlink(threadId);
      }
      if (!alreadyAttached && !isJsThread) {
        const allowedToDetach = attachedThreads.get(threadId);
        attachedThreads.delete(threadId);
        if (allowedToDetach) {
          this.detachCurrentThread();
        }
      }
    }
  };
  this.attachCurrentThread = function() {
    const envBuf = Memory.alloc(pointerSize5);
    checkJniResult("VM::AttachCurrentThread", attachCurrentThread(handle2, envBuf, NULL));
    return new Env(envBuf.readPointer(), this);
  };
  this.detachCurrentThread = function() {
    checkJniResult("VM::DetachCurrentThread", detachCurrentThread(handle2));
  };
  this.preventDetachDueToClassLoader = function() {
    const threadId = Process.getCurrentThreadId();
    if (attachedThreads.has(threadId)) {
      attachedThreads.set(threadId, false);
    }
  };
  this.getEnv = function() {
    const cachedEnv = tryGetCachedEnv(Process.getCurrentThreadId());
    if (cachedEnv !== null) {
      return cachedEnv;
    }
    const envBuf = Memory.alloc(pointerSize5);
    const result = getEnv(handle2, envBuf, JNI_VERSION_1_6);
    if (result === -2) {
      throw new Error("Current thread is not attached to the Java VM; please move this code inside a Java.perform() callback");
    }
    checkJniResult("VM::GetEnv", result);
    return new Env(envBuf.readPointer(), this);
  };
  this.tryGetEnv = function() {
    const cachedEnv = tryGetCachedEnv(Process.getCurrentThreadId());
    if (cachedEnv !== null) {
      return cachedEnv;
    }
    return this._tryGetEnv();
  };
  this._tryGetEnv = function() {
    const h = this.tryGetEnvHandle(JNI_VERSION_1_6);
    if (h === null) {
      return null;
    }
    return new Env(h, this);
  };
  this.tryGetEnvHandle = function(version2) {
    const envBuf = Memory.alloc(pointerSize5);
    const result = getEnv(handle2, envBuf, version2);
    if (result !== JNI_OK) {
      return null;
    }
    return envBuf.readPointer();
  };
  this.makeHandleDestructor = function(handle3) {
    return () => {
      this.perform((env2) => {
        env2.deleteGlobalRef(handle3);
      });
    };
  };
  this.link = function(tid, env2) {
    const entry = activeEnvs.get(tid);
    if (entry === void 0) {
      activeEnvs.set(tid, [env2, 1]);
    } else {
      entry[1]++;
    }
  };
  this.unlink = function(tid) {
    const entry = activeEnvs.get(tid);
    if (entry[1] === 1) {
      activeEnvs.delete(tid);
    } else {
      entry[1]--;
    }
  };
  function tryGetCachedEnv(threadId) {
    const entry = activeEnvs.get(threadId);
    if (entry === void 0) {
      return null;
    }
    return entry[0];
  }
  initialize2.call(this);
}
VM.dispose = function(vm3) {
  if (attachedThreads.get(jsThreadID) === true) {
    attachedThreads.delete(jsThreadID);
    vm3.detachCurrentThread();
  }
};

// node_modules/frida-java-bridge/lib/android.js
var jsizeSize = 4;
var pointerSize6 = Process.pointerSize;
var {
  readU32,
  readPointer,
  writeU32,
  writePointer
} = NativePointer.prototype;
var kAccPublic = 1;
var kAccStatic = 8;
var kAccFinal = 16;
var kAccNative = 256;
var kAccFastNative = 524288;
var kAccCriticalNative = 2097152;
var kAccFastInterpreterToInterpreterInvoke = 1073741824;
var kAccSkipAccessChecks = 524288;
var kAccSingleImplementation = 134217728;
var kAccNterpEntryPointFastPathFlag = 1048576;
var kAccNterpInvokeFastPathFlag = 2097152;
var kAccPublicApi = 268435456;
var kAccXposedHookedMethod = 268435456;
var kPointer = 0;
var kFullDeoptimization = 3;
var kSelectiveDeoptimization = 5;
var THUMB_BIT_REMOVAL_MASK = ptr(1).not();
var X86_JMP_MAX_DISTANCE = 2147467263;
var ARM64_ADRP_MAX_DISTANCE = 4294963200;
var ENV_VTABLE_OFFSET_EXCEPTION_CLEAR = 17 * pointerSize6;
var ENV_VTABLE_OFFSET_FATAL_ERROR = 18 * pointerSize6;
var DVM_JNI_ENV_OFFSET_SELF = 12;
var DVM_CLASS_OBJECT_OFFSET_VTABLE_COUNT = 112;
var DVM_CLASS_OBJECT_OFFSET_VTABLE = 116;
var DVM_OBJECT_OFFSET_CLAZZ = 0;
var DVM_METHOD_SIZE = 56;
var DVM_METHOD_OFFSET_ACCESS_FLAGS = 4;
var DVM_METHOD_OFFSET_METHOD_INDEX = 8;
var DVM_METHOD_OFFSET_REGISTERS_SIZE = 10;
var DVM_METHOD_OFFSET_OUTS_SIZE = 12;
var DVM_METHOD_OFFSET_INS_SIZE = 14;
var DVM_METHOD_OFFSET_SHORTY = 28;
var DVM_METHOD_OFFSET_JNI_ARG_INFO = 36;
var DALVIK_JNI_RETURN_VOID = 0;
var DALVIK_JNI_RETURN_FLOAT = 1;
var DALVIK_JNI_RETURN_DOUBLE = 2;
var DALVIK_JNI_RETURN_S8 = 3;
var DALVIK_JNI_RETURN_S4 = 4;
var DALVIK_JNI_RETURN_S2 = 5;
var DALVIK_JNI_RETURN_U2 = 6;
var DALVIK_JNI_RETURN_S1 = 7;
var DALVIK_JNI_NO_ARG_INFO = 2147483648;
var DALVIK_JNI_RETURN_SHIFT = 28;
var STD_STRING_SIZE = 3 * pointerSize6;
var STD_VECTOR_SIZE = 3 * pointerSize6;
var AF_UNIX = 1;
var SOCK_STREAM = 1;
var getArtRuntimeSpec = memoize(_getArtRuntimeSpec);
var getArtInstrumentationSpec = memoize(_getArtInstrumentationSpec);
var getArtMethodSpec = memoize(_getArtMethodSpec);
var getArtThreadSpec = memoize(_getArtThreadSpec);
var getArtManagedStackSpec = memoize(_getArtManagedStackSpec);
var getArtThreadStateTransitionImpl = memoize(_getArtThreadStateTransitionImpl);
var getAndroidVersion = memoize(_getAndroidVersion);
var getAndroidCodename = memoize(_getAndroidCodename);
var getAndroidApiLevel = memoize(_getAndroidApiLevel);
var getArtQuickFrameInfoGetterThunk = memoize(_getArtQuickFrameInfoGetterThunk);
var makeCxxMethodWrapperReturningPointerByValue = Process.arch === "ia32" ? makeCxxMethodWrapperReturningPointerByValueInFirstArg : makeCxxMethodWrapperReturningPointerByValueGeneric;
var nativeFunctionOptions3 = {
  exceptions: "propagate"
};
var artThreadStateTransitions = {};
var cachedApi = null;
var cachedArtClassLinkerSpec = null;
var MethodMangler = null;
var artController = null;
var inlineHooks = [];
var patchedClasses = /* @__PURE__ */ new Map();
var artQuickInterceptors = [];
var thunkPage = null;
var thunkOffset = 0;
var taughtArtAboutReplacementMethods = false;
var taughtArtAboutMethodInstrumentation = false;
var backtraceModule = null;
var jdwpSessions = [];
var socketpair = null;
var trampolineAllocator = null;
function getApi() {
  if (cachedApi === null) {
    cachedApi = _getApi();
  }
  return cachedApi;
}
function _getApi() {
  const vmModules = Process.enumerateModules().filter((m2) => /^lib(art|dvm).so$/.test(m2.name)).filter((m2) => !/\/system\/fake-libs/.test(m2.path));
  if (vmModules.length === 0) {
    return null;
  }
  const vmModule = vmModules[0];
  const flavor = vmModule.name.indexOf("art") !== -1 ? "art" : "dalvik";
  const isArt = flavor === "art";
  const temporaryApi = {
    module: vmModule,
    find(name) {
      const { module: module2 } = this;
      let address = module2.findExportByName(name);
      if (address === null) {
        address = module2.findSymbolByName(name);
      }
      return address;
    },
    flavor,
    addLocalReference: null
  };
  temporaryApi.isApiLevel34OrApexEquivalent = isArt && (temporaryApi.find("_ZN3art7AppInfo29GetPrimaryApkReferenceProfileEv") !== null || temporaryApi.find("_ZN3art6Thread15RunFlipFunctionEPS0_") !== null);
  const pending = isArt ? {
    functions: {
      JNI_GetCreatedJavaVMs: ["JNI_GetCreatedJavaVMs", "int", ["pointer", "int", "pointer"]],
      // Android < 7
      artInterpreterToCompiledCodeBridge: function(address) {
        this.artInterpreterToCompiledCodeBridge = address;
      },
      // Android >= 8
      _ZN3art9JavaVMExt12AddGlobalRefEPNS_6ThreadENS_6ObjPtrINS_6mirror6ObjectEEE: ["art::JavaVMExt::AddGlobalRef", "pointer", ["pointer", "pointer", "pointer"]],
      // Android >= 6
      _ZN3art9JavaVMExt12AddGlobalRefEPNS_6ThreadEPNS_6mirror6ObjectE: ["art::JavaVMExt::AddGlobalRef", "pointer", ["pointer", "pointer", "pointer"]],
      // Android < 6: makeAddGlobalRefFallbackForAndroid5() needs these:
      _ZN3art17ReaderWriterMutex13ExclusiveLockEPNS_6ThreadE: ["art::ReaderWriterMutex::ExclusiveLock", "void", ["pointer", "pointer"]],
      _ZN3art17ReaderWriterMutex15ExclusiveUnlockEPNS_6ThreadE: ["art::ReaderWriterMutex::ExclusiveUnlock", "void", ["pointer", "pointer"]],
      // Android <= 7
      _ZN3art22IndirectReferenceTable3AddEjPNS_6mirror6ObjectE: function(address) {
        this["art::IndirectReferenceTable::Add"] = new NativeFunction(address, "pointer", ["pointer", "uint", "pointer"], nativeFunctionOptions3);
      },
      // Android > 7
      _ZN3art22IndirectReferenceTable3AddENS_15IRTSegmentStateENS_6ObjPtrINS_6mirror6ObjectEEE: function(address) {
        this["art::IndirectReferenceTable::Add"] = new NativeFunction(address, "pointer", ["pointer", "uint", "pointer"], nativeFunctionOptions3);
      },
      // Android >= 7
      _ZN3art9JavaVMExt12DecodeGlobalEPv: function(address) {
        let decodeGlobal;
        if (getAndroidApiLevel() >= 26) {
          decodeGlobal = makeCxxMethodWrapperReturningPointerByValue(address, ["pointer", "pointer"]);
        } else {
          decodeGlobal = new NativeFunction(address, "pointer", ["pointer", "pointer"], nativeFunctionOptions3);
        }
        this["art::JavaVMExt::DecodeGlobal"] = function(vm3, thread, ref) {
          return decodeGlobal(vm3, ref);
        };
      },
      // Android >= 6
      _ZN3art9JavaVMExt12DecodeGlobalEPNS_6ThreadEPv: ["art::JavaVMExt::DecodeGlobal", "pointer", ["pointer", "pointer", "pointer"]],
      // makeDecodeGlobalFallback() uses:
      // Android >= 15
      _ZNK3art6Thread19DecodeGlobalJObjectEP8_jobject: ["art::Thread::DecodeJObject", "pointer", ["pointer", "pointer"]],
      // Android < 6
      _ZNK3art6Thread13DecodeJObjectEP8_jobject: ["art::Thread::DecodeJObject", "pointer", ["pointer", "pointer"]],
      // Android >= 6
      _ZN3art10ThreadList10SuspendAllEPKcb: ["art::ThreadList::SuspendAll", "void", ["pointer", "pointer", "bool"]],
      // or fallback:
      _ZN3art10ThreadList10SuspendAllEv: function(address) {
        const suspendAll = new NativeFunction(address, "void", ["pointer"], nativeFunctionOptions3);
        this["art::ThreadList::SuspendAll"] = function(threadList, cause, longSuspend) {
          return suspendAll(threadList);
        };
      },
      _ZN3art10ThreadList9ResumeAllEv: ["art::ThreadList::ResumeAll", "void", ["pointer"]],
      // Android >= 7
      _ZN3art11ClassLinker12VisitClassesEPNS_12ClassVisitorE: ["art::ClassLinker::VisitClasses", "void", ["pointer", "pointer"]],
      // Android < 7
      _ZN3art11ClassLinker12VisitClassesEPFbPNS_6mirror5ClassEPvES4_: function(address) {
        const visitClasses = new NativeFunction(address, "void", ["pointer", "pointer", "pointer"], nativeFunctionOptions3);
        this["art::ClassLinker::VisitClasses"] = function(classLinker, visitor) {
          visitClasses(classLinker, visitor, NULL);
        };
      },
      _ZNK3art11ClassLinker17VisitClassLoadersEPNS_18ClassLoaderVisitorE: ["art::ClassLinker::VisitClassLoaders", "void", ["pointer", "pointer"]],
      _ZN3art2gc4Heap12VisitObjectsEPFvPNS_6mirror6ObjectEPvES5_: ["art::gc::Heap::VisitObjects", "void", ["pointer", "pointer", "pointer"]],
      _ZN3art2gc4Heap12GetInstancesERNS_24VariableSizedHandleScopeENS_6HandleINS_6mirror5ClassEEEiRNSt3__16vectorINS4_INS5_6ObjectEEENS8_9allocatorISB_EEEE: ["art::gc::Heap::GetInstances", "void", ["pointer", "pointer", "pointer", "int", "pointer"]],
      // Android >= 9
      _ZN3art2gc4Heap12GetInstancesERNS_24VariableSizedHandleScopeENS_6HandleINS_6mirror5ClassEEEbiRNSt3__16vectorINS4_INS5_6ObjectEEENS8_9allocatorISB_EEEE: function(address) {
        const getInstances = new NativeFunction(address, "void", ["pointer", "pointer", "pointer", "bool", "int", "pointer"], nativeFunctionOptions3);
        this["art::gc::Heap::GetInstances"] = function(instance, scope, hClass, maxCount, instances) {
          const useIsAssignableFrom = 0;
          getInstances(instance, scope, hClass, useIsAssignableFrom, maxCount, instances);
        };
      },
      _ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEjb: ["art::StackVisitor::StackVisitor", "void", ["pointer", "pointer", "pointer", "uint", "uint", "bool"]],
      _ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEmb: ["art::StackVisitor::StackVisitor", "void", ["pointer", "pointer", "pointer", "uint", "size_t", "bool"]],
      _ZN3art12StackVisitor9WalkStackILNS0_16CountTransitionsE0EEEvb: ["art::StackVisitor::WalkStack", "void", ["pointer", "bool"]],
      _ZNK3art12StackVisitor9GetMethodEv: ["art::StackVisitor::GetMethod", "pointer", ["pointer"]],
      _ZNK3art12StackVisitor16DescribeLocationEv: function(address) {
        this["art::StackVisitor::DescribeLocation"] = makeCxxMethodWrapperReturningStdStringByValue(address, ["pointer"]);
      },
      _ZNK3art12StackVisitor24GetCurrentQuickFrameInfoEv: function(address) {
        this["art::StackVisitor::GetCurrentQuickFrameInfo"] = makeArtQuickFrameInfoGetter(address);
      },
      _ZN3art6Thread18GetLongJumpContextEv: ["art::Thread::GetLongJumpContext", "pointer", ["pointer"]],
      _ZN3art6mirror5Class13GetDescriptorEPNSt3__112basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE: function(address) {
        this["art::mirror::Class::GetDescriptor"] = address;
      },
      _ZN3art6mirror5Class11GetLocationEv: function(address) {
        this["art::mirror::Class::GetLocation"] = makeCxxMethodWrapperReturningStdStringByValue(address, ["pointer"]);
      },
      _ZN3art9ArtMethod12PrettyMethodEb: function(address) {
        this["art::ArtMethod::PrettyMethod"] = makeCxxMethodWrapperReturningStdStringByValue(address, ["pointer", "bool"]);
      },
      _ZN3art12PrettyMethodEPNS_9ArtMethodEb: function(address) {
        this["art::ArtMethod::PrettyMethodNullSafe"] = makeCxxMethodWrapperReturningStdStringByValue(address, ["pointer", "bool"]);
      },
      // Android < 6 for cloneArtMethod()
      _ZN3art6Thread14CurrentFromGdbEv: ["art::Thread::CurrentFromGdb", "pointer", []],
      _ZN3art6mirror6Object5CloneEPNS_6ThreadE: function(address) {
        this["art::mirror::Object::Clone"] = new NativeFunction(address, "pointer", ["pointer", "pointer"], nativeFunctionOptions3);
      },
      _ZN3art6mirror6Object5CloneEPNS_6ThreadEm: function(address) {
        const clone = new NativeFunction(address, "pointer", ["pointer", "pointer", "pointer"], nativeFunctionOptions3);
        this["art::mirror::Object::Clone"] = function(thisPtr, threadPtr) {
          const numTargetBytes = NULL;
          return clone(thisPtr, threadPtr, numTargetBytes);
        };
      },
      _ZN3art6mirror6Object5CloneEPNS_6ThreadEj: function(address) {
        const clone = new NativeFunction(address, "pointer", ["pointer", "pointer", "uint"], nativeFunctionOptions3);
        this["art::mirror::Object::Clone"] = function(thisPtr, threadPtr) {
          const numTargetBytes = 0;
          return clone(thisPtr, threadPtr, numTargetBytes);
        };
      },
      _ZN3art3Dbg14SetJdwpAllowedEb: ["art::Dbg::SetJdwpAllowed", "void", ["bool"]],
      _ZN3art3Dbg13ConfigureJdwpERKNS_4JDWP11JdwpOptionsE: ["art::Dbg::ConfigureJdwp", "void", ["pointer"]],
      _ZN3art31InternalDebuggerControlCallback13StartDebuggerEv: ["art::InternalDebuggerControlCallback::StartDebugger", "void", ["pointer"]],
      _ZN3art3Dbg9StartJdwpEv: ["art::Dbg::StartJdwp", "void", []],
      _ZN3art3Dbg8GoActiveEv: ["art::Dbg::GoActive", "void", []],
      _ZN3art3Dbg21RequestDeoptimizationERKNS_21DeoptimizationRequestE: ["art::Dbg::RequestDeoptimization", "void", ["pointer"]],
      _ZN3art3Dbg20ManageDeoptimizationEv: ["art::Dbg::ManageDeoptimization", "void", []],
      _ZN3art15instrumentation15Instrumentation20EnableDeoptimizationEv: ["art::Instrumentation::EnableDeoptimization", "void", ["pointer"]],
      // Android >= 6
      _ZN3art15instrumentation15Instrumentation20DeoptimizeEverythingEPKc: ["art::Instrumentation::DeoptimizeEverything", "void", ["pointer", "pointer"]],
      // Android < 6
      _ZN3art15instrumentation15Instrumentation20DeoptimizeEverythingEv: function(address) {
        const deoptimize = new NativeFunction(address, "void", ["pointer"], nativeFunctionOptions3);
        this["art::Instrumentation::DeoptimizeEverything"] = function(instrumentation, key) {
          deoptimize(instrumentation);
        };
      },
      _ZN3art7Runtime19DeoptimizeBootImageEv: ["art::Runtime::DeoptimizeBootImage", "void", ["pointer"]],
      _ZN3art15instrumentation15Instrumentation10DeoptimizeEPNS_9ArtMethodE: ["art::Instrumentation::Deoptimize", "void", ["pointer", "pointer"]],
      // Android >= 11
      _ZN3art3jni12JniIdManager14DecodeMethodIdEP10_jmethodID: ["art::jni::JniIdManager::DecodeMethodId", "pointer", ["pointer", "pointer"]],
      _ZN3art11interpreter18GetNterpEntryPointEv: ["art::interpreter::GetNterpEntryPoint", "pointer", []],
      _ZN3art7Monitor17TranslateLocationEPNS_9ArtMethodEjPPKcPi: ["art::Monitor::TranslateLocation", "void", ["pointer", "uint32", "pointer", "pointer"]]
    },
    variables: {
      _ZN3art3Dbg9gRegistryE: function(address) {
        this.isJdwpStarted = () => !address.readPointer().isNull();
      },
      _ZN3art3Dbg15gDebuggerActiveE: function(address) {
        this.isDebuggerActive = () => !!address.readU8();
      }
    },
    optionals: /* @__PURE__ */ new Set([
      "artInterpreterToCompiledCodeBridge",
      "_ZN3art9JavaVMExt12AddGlobalRefEPNS_6ThreadENS_6ObjPtrINS_6mirror6ObjectEEE",
      "_ZN3art9JavaVMExt12AddGlobalRefEPNS_6ThreadEPNS_6mirror6ObjectE",
      "_ZN3art9JavaVMExt12DecodeGlobalEPv",
      "_ZN3art9JavaVMExt12DecodeGlobalEPNS_6ThreadEPv",
      "_ZNK3art6Thread19DecodeGlobalJObjectEP8_jobject",
      "_ZNK3art6Thread13DecodeJObjectEP8_jobject",
      "_ZN3art10ThreadList10SuspendAllEPKcb",
      "_ZN3art10ThreadList10SuspendAllEv",
      "_ZN3art11ClassLinker12VisitClassesEPNS_12ClassVisitorE",
      "_ZN3art11ClassLinker12VisitClassesEPFbPNS_6mirror5ClassEPvES4_",
      "_ZNK3art11ClassLinker17VisitClassLoadersEPNS_18ClassLoaderVisitorE",
      "_ZN3art6mirror6Object5CloneEPNS_6ThreadE",
      "_ZN3art6mirror6Object5CloneEPNS_6ThreadEm",
      "_ZN3art6mirror6Object5CloneEPNS_6ThreadEj",
      "_ZN3art22IndirectReferenceTable3AddEjPNS_6mirror6ObjectE",
      "_ZN3art22IndirectReferenceTable3AddENS_15IRTSegmentStateENS_6ObjPtrINS_6mirror6ObjectEEE",
      "_ZN3art2gc4Heap12VisitObjectsEPFvPNS_6mirror6ObjectEPvES5_",
      "_ZN3art2gc4Heap12GetInstancesERNS_24VariableSizedHandleScopeENS_6HandleINS_6mirror5ClassEEEiRNSt3__16vectorINS4_INS5_6ObjectEEENS8_9allocatorISB_EEEE",
      "_ZN3art2gc4Heap12GetInstancesERNS_24VariableSizedHandleScopeENS_6HandleINS_6mirror5ClassEEEbiRNSt3__16vectorINS4_INS5_6ObjectEEENS8_9allocatorISB_EEEE",
      "_ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEjb",
      "_ZN3art12StackVisitorC2EPNS_6ThreadEPNS_7ContextENS0_13StackWalkKindEmb",
      "_ZN3art12StackVisitor9WalkStackILNS0_16CountTransitionsE0EEEvb",
      "_ZNK3art12StackVisitor9GetMethodEv",
      "_ZNK3art12StackVisitor16DescribeLocationEv",
      "_ZNK3art12StackVisitor24GetCurrentQuickFrameInfoEv",
      "_ZN3art6Thread18GetLongJumpContextEv",
      "_ZN3art6mirror5Class13GetDescriptorEPNSt3__112basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE",
      "_ZN3art6mirror5Class11GetLocationEv",
      "_ZN3art9ArtMethod12PrettyMethodEb",
      "_ZN3art12PrettyMethodEPNS_9ArtMethodEb",
      "_ZN3art3Dbg13ConfigureJdwpERKNS_4JDWP11JdwpOptionsE",
      "_ZN3art31InternalDebuggerControlCallback13StartDebuggerEv",
      "_ZN3art3Dbg15gDebuggerActiveE",
      "_ZN3art15instrumentation15Instrumentation20EnableDeoptimizationEv",
      "_ZN3art15instrumentation15Instrumentation20DeoptimizeEverythingEPKc",
      "_ZN3art15instrumentation15Instrumentation20DeoptimizeEverythingEv",
      "_ZN3art7Runtime19DeoptimizeBootImageEv",
      "_ZN3art15instrumentation15Instrumentation10DeoptimizeEPNS_9ArtMethodE",
      "_ZN3art3Dbg9StartJdwpEv",
      "_ZN3art3Dbg8GoActiveEv",
      "_ZN3art3Dbg21RequestDeoptimizationERKNS_21DeoptimizationRequestE",
      "_ZN3art3Dbg20ManageDeoptimizationEv",
      "_ZN3art3Dbg9gRegistryE",
      "_ZN3art3jni12JniIdManager14DecodeMethodIdEP10_jmethodID",
      "_ZN3art11interpreter18GetNterpEntryPointEv",
      "_ZN3art7Monitor17TranslateLocationEPNS_9ArtMethodEjPPKcPi"
    ])
  } : {
    functions: {
      _Z20dvmDecodeIndirectRefP6ThreadP8_jobject: ["dvmDecodeIndirectRef", "pointer", ["pointer", "pointer"]],
      _Z15dvmUseJNIBridgeP6MethodPv: ["dvmUseJNIBridge", "void", ["pointer", "pointer"]],
      _Z20dvmHeapSourceGetBasev: ["dvmHeapSourceGetBase", "pointer", []],
      _Z21dvmHeapSourceGetLimitv: ["dvmHeapSourceGetLimit", "pointer", []],
      _Z16dvmIsValidObjectPK6Object: ["dvmIsValidObject", "uint8", ["pointer"]],
      JNI_GetCreatedJavaVMs: ["JNI_GetCreatedJavaVMs", "int", ["pointer", "int", "pointer"]]
    },
    variables: {
      gDvmJni: function(address) {
        this.gDvmJni = address;
      },
      gDvm: function(address) {
        this.gDvm = address;
      }
    }
  };
  const {
    functions = {},
    variables = {},
    optionals = /* @__PURE__ */ new Set()
  } = pending;
  const missing = [];
  for (const [name, signature2] of Object.entries(functions)) {
    const address = temporaryApi.find(name);
    if (address !== null) {
      if (typeof signature2 === "function") {
        signature2.call(temporaryApi, address);
      } else {
        temporaryApi[signature2[0]] = new NativeFunction(address, signature2[1], signature2[2], nativeFunctionOptions3);
      }
    } else {
      if (!optionals.has(name)) {
        missing.push(name);
      }
    }
  }
  for (const [name, handler] of Object.entries(variables)) {
    const address = temporaryApi.find(name);
    if (address !== null) {
      handler.call(temporaryApi, address);
    } else {
      if (!optionals.has(name)) {
        missing.push(name);
      }
    }
  }
  if (missing.length > 0) {
    throw new Error("Java API only partially available; please file a bug. Missing: " + missing.join(", "));
  }
  const vms = Memory.alloc(pointerSize6);
  const vmCount = Memory.alloc(jsizeSize);
  checkJniResult("JNI_GetCreatedJavaVMs", temporaryApi.JNI_GetCreatedJavaVMs(vms, 1, vmCount));
  if (vmCount.readInt() === 0) {
    return null;
  }
  temporaryApi.vm = vms.readPointer();
  if (isArt) {
    const apiLevel = getAndroidApiLevel();
    let kAccCompileDontBother;
    if (apiLevel >= 27) {
      kAccCompileDontBother = 33554432;
    } else if (apiLevel >= 24) {
      kAccCompileDontBother = 16777216;
    } else {
      kAccCompileDontBother = 0;
    }
    temporaryApi.kAccCompileDontBother = kAccCompileDontBother;
    const artRuntime = temporaryApi.vm.add(pointerSize6).readPointer();
    temporaryApi.artRuntime = artRuntime;
    const runtimeSpec = getArtRuntimeSpec(temporaryApi);
    const runtimeOffset = runtimeSpec.offset;
    const instrumentationOffset = runtimeOffset.instrumentation;
    temporaryApi.artInstrumentation = instrumentationOffset !== null ? artRuntime.add(instrumentationOffset) : null;
    temporaryApi.artHeap = artRuntime.add(runtimeOffset.heap).readPointer();
    temporaryApi.artThreadList = artRuntime.add(runtimeOffset.threadList).readPointer();
    const classLinker = artRuntime.add(runtimeOffset.classLinker).readPointer();
    const classLinkerOffsets = getArtClassLinkerSpec(artRuntime, runtimeSpec).offset;
    const quickResolutionTrampoline = classLinker.add(classLinkerOffsets.quickResolutionTrampoline).readPointer();
    const quickImtConflictTrampoline = classLinker.add(classLinkerOffsets.quickImtConflictTrampoline).readPointer();
    const quickGenericJniTrampoline = classLinker.add(classLinkerOffsets.quickGenericJniTrampoline).readPointer();
    const quickToInterpreterBridgeTrampoline = classLinker.add(classLinkerOffsets.quickToInterpreterBridgeTrampoline).readPointer();
    temporaryApi.artClassLinker = {
      address: classLinker,
      quickResolutionTrampoline,
      quickImtConflictTrampoline,
      quickGenericJniTrampoline,
      quickToInterpreterBridgeTrampoline
    };
    const vm3 = new VM(temporaryApi);
    temporaryApi.artQuickGenericJniTrampoline = getArtQuickEntrypointFromTrampoline(quickGenericJniTrampoline, vm3);
    temporaryApi.artQuickToInterpreterBridge = getArtQuickEntrypointFromTrampoline(quickToInterpreterBridgeTrampoline, vm3);
    temporaryApi.artQuickResolutionTrampoline = getArtQuickEntrypointFromTrampoline(quickResolutionTrampoline, vm3);
    if (temporaryApi["art::JavaVMExt::AddGlobalRef"] === void 0) {
      temporaryApi["art::JavaVMExt::AddGlobalRef"] = makeAddGlobalRefFallbackForAndroid5(temporaryApi);
    }
    if (temporaryApi["art::JavaVMExt::DecodeGlobal"] === void 0) {
      temporaryApi["art::JavaVMExt::DecodeGlobal"] = makeDecodeGlobalFallback(temporaryApi);
    }
    if (temporaryApi["art::ArtMethod::PrettyMethod"] === void 0) {
      temporaryApi["art::ArtMethod::PrettyMethod"] = temporaryApi["art::ArtMethod::PrettyMethodNullSafe"];
    }
    if (temporaryApi["art::interpreter::GetNterpEntryPoint"] !== void 0) {
      temporaryApi.artNterpEntryPoint = temporaryApi["art::interpreter::GetNterpEntryPoint"]();
    } else {
      temporaryApi.artNterpEntryPoint = temporaryApi.find("ExecuteNterpImpl");
    }
    artController = makeArtController(temporaryApi, vm3);
    fixupArtQuickDeliverExceptionBug(temporaryApi);
    let cachedJvmti = null;
    Object.defineProperty(temporaryApi, "jvmti", {
      get() {
        if (cachedJvmti === null) {
          cachedJvmti = [tryGetEnvJvmti(vm3, this.artRuntime)];
        }
        return cachedJvmti[0];
      }
    });
  }
  const cxxImports = vmModule.enumerateImports().filter((imp) => imp.name.indexOf("_Z") === 0).reduce((result, imp) => {
    result[imp.name] = imp.address;
    return result;
  }, {});
  temporaryApi.$new = new NativeFunction(cxxImports._Znwm || cxxImports._Znwj, "pointer", ["ulong"], nativeFunctionOptions3);
  temporaryApi.$delete = new NativeFunction(cxxImports._ZdlPv, "void", ["pointer"], nativeFunctionOptions3);
  MethodMangler = isArt ? ArtMethodMangler : DalvikMethodMangler;
  return temporaryApi;
}
function tryGetEnvJvmti(vm3, runtime3) {
  let env2 = null;
  vm3.perform(() => {
    const ensurePluginLoadedAddr = getApi().find("_ZN3art7Runtime18EnsurePluginLoadedEPKcPNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEE");
    if (ensurePluginLoadedAddr === null) {
      return;
    }
    const ensurePluginLoaded = new NativeFunction(
      ensurePluginLoadedAddr,
      "bool",
      ["pointer", "pointer", "pointer"]
    );
    const errorPtr = Memory.alloc(pointerSize6);
    const success = ensurePluginLoaded(runtime3, Memory.allocUtf8String("libopenjdkjvmti.so"), errorPtr);
    if (!success) {
      return;
    }
    const kArtTiVersion = jvmtiVersion.v1_2 | 1073741824;
    const handle2 = vm3.tryGetEnvHandle(kArtTiVersion);
    if (handle2 === null) {
      return;
    }
    env2 = new EnvJvmti(handle2, vm3);
    const capaBuf = Memory.alloc(8);
    capaBuf.writeU64(jvmtiCapabilities.canTagObjects);
    const result = env2.addCapabilities(capaBuf);
    if (result !== JNI_OK) {
      env2 = null;
    }
  });
  return env2;
}
function ensureClassInitialized(env2, classRef) {
  const api3 = getApi();
  if (api3.flavor !== "art") {
    return;
  }
  env2.getFieldId(classRef, "x", "Z");
  env2.exceptionClear();
}
function getArtVMSpec(api3) {
  return {
    offset: pointerSize6 === 4 ? {
      globalsLock: 32,
      globals: 72
    } : {
      globalsLock: 64,
      globals: 112
    }
  };
}
function _getArtRuntimeSpec(api3) {
  const vm3 = api3.vm;
  const runtime3 = api3.artRuntime;
  const startOffset = pointerSize6 === 4 ? 200 : 384;
  const endOffset = startOffset + 100 * pointerSize6;
  const apiLevel = getAndroidApiLevel();
  const codename = getAndroidCodename();
  const { isApiLevel34OrApexEquivalent } = api3;
  let spec = null;
  for (let offset = startOffset; offset !== endOffset; offset += pointerSize6) {
    const value = runtime3.add(offset).readPointer();
    if (value.equals(vm3)) {
      let classLinkerOffsets;
      let jniIdManagerOffset = null;
      if (apiLevel >= 33 || codename === "Tiramisu" || isApiLevel34OrApexEquivalent) {
        classLinkerOffsets = [offset - 4 * pointerSize6];
        jniIdManagerOffset = offset - pointerSize6;
      } else if (apiLevel >= 30 || codename === "R") {
        classLinkerOffsets = [offset - 3 * pointerSize6, offset - 4 * pointerSize6];
        jniIdManagerOffset = offset - pointerSize6;
      } else if (apiLevel >= 29) {
        classLinkerOffsets = [offset - 2 * pointerSize6];
      } else if (apiLevel >= 27) {
        classLinkerOffsets = [offset - STD_STRING_SIZE - 3 * pointerSize6];
      } else {
        classLinkerOffsets = [offset - STD_STRING_SIZE - 2 * pointerSize6];
      }
      for (const classLinkerOffset of classLinkerOffsets) {
        const internTableOffset = classLinkerOffset - pointerSize6;
        const threadListOffset = internTableOffset - pointerSize6;
        let heapOffset;
        if (isApiLevel34OrApexEquivalent) {
          heapOffset = threadListOffset - 9 * pointerSize6;
        } else if (apiLevel >= 24) {
          heapOffset = threadListOffset - 8 * pointerSize6;
        } else if (apiLevel >= 23) {
          heapOffset = threadListOffset - 7 * pointerSize6;
        } else {
          heapOffset = threadListOffset - 4 * pointerSize6;
        }
        const candidate = {
          offset: {
            heap: heapOffset,
            threadList: threadListOffset,
            internTable: internTableOffset,
            classLinker: classLinkerOffset,
            jniIdManager: jniIdManagerOffset
          }
        };
        if (tryGetArtClassLinkerSpec(runtime3, candidate) !== null) {
          spec = candidate;
          break;
        }
      }
      break;
    }
  }
  if (spec === null) {
    throw new Error("Unable to determine Runtime field offsets");
  }
  spec.offset.instrumentation = tryDetectInstrumentationOffset(api3);
  spec.offset.jniIdsIndirection = tryDetectJniIdsIndirectionOffset(api3);
  return spec;
}
var instrumentationOffsetParsers = {
  ia32: parsex86InstrumentationOffset,
  x64: parsex86InstrumentationOffset,
  arm: parseArmInstrumentationOffset,
  arm64: parseArm64InstrumentationOffset
};
function tryDetectInstrumentationOffset(api3) {
  const impl2 = api3["art::Runtime::DeoptimizeBootImage"];
  if (impl2 === void 0) {
    return null;
  }
  return parseInstructionsAt(impl2, instrumentationOffsetParsers[Process.arch], { limit: 30 });
}
function parsex86InstrumentationOffset(insn) {
  if (insn.mnemonic !== "lea") {
    return null;
  }
  const offset = insn.operands[1].value.disp;
  if (offset < 256 || offset > 1024) {
    return null;
  }
  return offset;
}
function parseArmInstrumentationOffset(insn) {
  if (insn.mnemonic !== "add.w") {
    return null;
  }
  const ops = insn.operands;
  if (ops.length !== 3) {
    return null;
  }
  const op2 = ops[2];
  if (op2.type !== "imm") {
    return null;
  }
  return op2.value;
}
function parseArm64InstrumentationOffset(insn) {
  if (insn.mnemonic !== "add") {
    return null;
  }
  const ops = insn.operands;
  if (ops.length !== 3) {
    return null;
  }
  if (ops[0].value === "sp" || ops[1].value === "sp") {
    return null;
  }
  const op2 = ops[2];
  if (op2.type !== "imm") {
    return null;
  }
  const offset = op2.value.valueOf();
  if (offset < 256 || offset > 1024) {
    return null;
  }
  return offset;
}
var jniIdsIndirectionOffsetParsers = {
  ia32: parsex86JniIdsIndirectionOffset,
  x64: parsex86JniIdsIndirectionOffset,
  arm: parseArmJniIdsIndirectionOffset,
  arm64: parseArm64JniIdsIndirectionOffset
};
function tryDetectJniIdsIndirectionOffset(api3) {
  const impl2 = api3.find("_ZN3art7Runtime12SetJniIdTypeENS_9JniIdTypeE");
  if (impl2 === null) {
    return null;
  }
  const offset = parseInstructionsAt(impl2, jniIdsIndirectionOffsetParsers[Process.arch], { limit: 20 });
  if (offset === null) {
    throw new Error("Unable to determine Runtime.jni_ids_indirection_ offset");
  }
  return offset;
}
function parsex86JniIdsIndirectionOffset(insn) {
  if (insn.mnemonic === "cmp") {
    return insn.operands[0].value.disp;
  }
  return null;
}
function parseArmJniIdsIndirectionOffset(insn) {
  if (insn.mnemonic === "ldr.w") {
    return insn.operands[1].value.disp;
  }
  return null;
}
function parseArm64JniIdsIndirectionOffset(insn, prevInsn) {
  if (prevInsn === null) {
    return null;
  }
  const { mnemonic } = insn;
  const { mnemonic: prevMnemonic } = prevInsn;
  if (mnemonic === "cmp" && prevMnemonic === "ldr" || mnemonic === "bl" && prevMnemonic === "str") {
    return prevInsn.operands[1].value.disp;
  }
  return null;
}
function _getArtInstrumentationSpec() {
  const deoptimizationEnabledOffsets = {
    "4-21": 136,
    "4-22": 136,
    "4-23": 172,
    "4-24": 196,
    "4-25": 196,
    "4-26": 196,
    "4-27": 196,
    "4-28": 212,
    "4-29": 172,
    "4-30": 180,
    "4-31": 180,
    "8-21": 224,
    "8-22": 224,
    "8-23": 296,
    "8-24": 344,
    "8-25": 344,
    "8-26": 352,
    "8-27": 352,
    "8-28": 392,
    "8-29": 328,
    "8-30": 336,
    "8-31": 336
  };
  const deoptEnabledOffset = deoptimizationEnabledOffsets[`${pointerSize6}-${getAndroidApiLevel()}`];
  if (deoptEnabledOffset === void 0) {
    throw new Error("Unable to determine Instrumentation field offsets");
  }
  return {
    offset: {
      forcedInterpretOnly: 4,
      deoptimizationEnabled: deoptEnabledOffset
    }
  };
}
function getArtClassLinkerSpec(runtime3, runtimeSpec) {
  const spec = tryGetArtClassLinkerSpec(runtime3, runtimeSpec);
  if (spec === null) {
    throw new Error("Unable to determine ClassLinker field offsets");
  }
  return spec;
}
function tryGetArtClassLinkerSpec(runtime3, runtimeSpec) {
  if (cachedArtClassLinkerSpec !== null) {
    return cachedArtClassLinkerSpec;
  }
  const { classLinker: classLinkerOffset, internTable: internTableOffset } = runtimeSpec.offset;
  const classLinker = runtime3.add(classLinkerOffset).readPointer();
  const internTable = runtime3.add(internTableOffset).readPointer();
  const startOffset = pointerSize6 === 4 ? 100 : 200;
  const endOffset = startOffset + 100 * pointerSize6;
  const apiLevel = getAndroidApiLevel();
  let spec = null;
  for (let offset = startOffset; offset !== endOffset; offset += pointerSize6) {
    const value = classLinker.add(offset).readPointer();
    if (value.equals(internTable)) {
      let delta;
      if (apiLevel >= 30 || getAndroidCodename() === "R") {
        delta = 6;
      } else if (apiLevel >= 29) {
        delta = 4;
      } else if (apiLevel >= 23) {
        delta = 3;
      } else {
        delta = 5;
      }
      const quickGenericJniTrampolineOffset = offset + delta * pointerSize6;
      let quickResolutionTrampolineOffset;
      if (apiLevel >= 23) {
        quickResolutionTrampolineOffset = quickGenericJniTrampolineOffset - 2 * pointerSize6;
      } else {
        quickResolutionTrampolineOffset = quickGenericJniTrampolineOffset - 3 * pointerSize6;
      }
      spec = {
        offset: {
          quickResolutionTrampoline: quickResolutionTrampolineOffset,
          quickImtConflictTrampoline: quickGenericJniTrampolineOffset - pointerSize6,
          quickGenericJniTrampoline: quickGenericJniTrampolineOffset,
          quickToInterpreterBridgeTrampoline: quickGenericJniTrampolineOffset + pointerSize6
        }
      };
      break;
    }
  }
  if (spec !== null) {
    cachedArtClassLinkerSpec = spec;
  } else {
    throw new Error("Unable to determine ClassLinker field offsets");
  }
  return spec;
}
function getArtClassSpec(vm3) {
  let apiLevel;
  try {
    apiLevel = getAndroidApiLevel();
  } catch (e) {
    return null;
  }
  if (apiLevel < 24) {
    return null;
  }
  let base, cmo;
  if (apiLevel >= 26) {
    base = 40;
    cmo = 116;
  } else {
    base = 56;
    cmo = 124;
  }
  return {
    offset: {
      ifields: base,
      methods: base + 8,
      sfields: base + 16,
      copiedMethodsOffset: cmo
    }
  };
}
function _getArtMethodSpec(vm3) {
  const api3 = getApi();
  let spec;
  vm3.perform((env2) => {
    const process = env2.findClass("android/os/Process");
    const getElapsedCpuTime = unwrapMethodId(env2.getStaticMethodId(process, "getElapsedCpuTime", "()J"));
    env2.deleteLocalRef(process);
    const runtimeModule = Process.getModuleByName("libandroid_runtime.so");
    const runtimeStart = runtimeModule.base;
    const runtimeEnd = runtimeStart.add(runtimeModule.size);
    const apiLevel = getAndroidApiLevel();
    const entrypointFieldSize = apiLevel <= 21 ? 8 : pointerSize6;
    const expectedAccessFlags = kAccPublic | kAccStatic | kAccFinal | kAccNative;
    const relevantAccessFlagsMask = ~(kAccFastInterpreterToInterpreterInvoke | kAccPublicApi | kAccNterpInvokeFastPathFlag) >>> 0;
    let jniCodeOffset = null;
    let accessFlagsOffset = null;
    let remaining = 2;
    for (let offset = 0; offset !== 64 && remaining !== 0; offset += 4) {
      const field = getElapsedCpuTime.add(offset);
      if (jniCodeOffset === null) {
        const address = field.readPointer();
        if (address.compare(runtimeStart) >= 0 && address.compare(runtimeEnd) < 0) {
          jniCodeOffset = offset;
          remaining--;
        }
      }
      if (accessFlagsOffset === null) {
        const flags = field.readU32();
        if ((flags & relevantAccessFlagsMask) === expectedAccessFlags) {
          accessFlagsOffset = offset;
          remaining--;
        }
      }
    }
    if (remaining !== 0) {
      throw new Error("Unable to determine ArtMethod field offsets");
    }
    const quickCodeOffset = jniCodeOffset + entrypointFieldSize;
    const size = apiLevel <= 21 ? quickCodeOffset + 32 : quickCodeOffset + pointerSize6;
    spec = {
      size,
      offset: {
        jniCode: jniCodeOffset,
        quickCode: quickCodeOffset,
        accessFlags: accessFlagsOffset
      }
    };
    if ("artInterpreterToCompiledCodeBridge" in api3) {
      spec.offset.interpreterCode = jniCodeOffset - entrypointFieldSize;
    }
  });
  return spec;
}
function getArtFieldSpec(vm3) {
  const apiLevel = getAndroidApiLevel();
  if (apiLevel >= 23) {
    return {
      size: 16,
      offset: {
        accessFlags: 4
      }
    };
  }
  if (apiLevel >= 21) {
    return {
      size: 24,
      offset: {
        accessFlags: 12
      }
    };
  }
  return null;
}
function _getArtThreadSpec(vm3) {
  const apiLevel = getAndroidApiLevel();
  let spec;
  vm3.perform((env2) => {
    const threadHandle = getArtThreadFromEnv(env2);
    const envHandle = env2.handle;
    let isExceptionReportedOffset = null;
    let exceptionOffset = null;
    let throwLocationOffset = null;
    let topHandleScopeOffset = null;
    let managedStackOffset = null;
    let selfOffset = null;
    for (let offset = 144; offset !== 256; offset += pointerSize6) {
      const field = threadHandle.add(offset);
      const value = field.readPointer();
      if (value.equals(envHandle)) {
        exceptionOffset = offset - 6 * pointerSize6;
        managedStackOffset = offset - 4 * pointerSize6;
        selfOffset = offset + 2 * pointerSize6;
        if (apiLevel <= 22) {
          exceptionOffset -= pointerSize6;
          isExceptionReportedOffset = exceptionOffset - pointerSize6 - 9 * 8 - 3 * 4;
          throwLocationOffset = offset + 6 * pointerSize6;
          managedStackOffset -= pointerSize6;
          selfOffset -= pointerSize6;
        }
        topHandleScopeOffset = offset + 9 * pointerSize6;
        if (apiLevel <= 22) {
          topHandleScopeOffset += 2 * pointerSize6 + 4;
          if (pointerSize6 === 8) {
            topHandleScopeOffset += 4;
          }
        }
        if (apiLevel >= 23) {
          topHandleScopeOffset += pointerSize6;
        }
        break;
      }
    }
    if (topHandleScopeOffset === null) {
      throw new Error("Unable to determine ArtThread field offsets");
    }
    spec = {
      offset: {
        isExceptionReportedToInstrumentation: isExceptionReportedOffset,
        exception: exceptionOffset,
        throwLocation: throwLocationOffset,
        topHandleScope: topHandleScopeOffset,
        managedStack: managedStackOffset,
        self: selfOffset
      }
    };
  });
  return spec;
}
function _getArtManagedStackSpec() {
  const apiLevel = getAndroidApiLevel();
  if (apiLevel >= 23) {
    return {
      offset: {
        topQuickFrame: 0,
        link: pointerSize6
      }
    };
  } else {
    return {
      offset: {
        topQuickFrame: 2 * pointerSize6,
        link: 0
      }
    };
  }
}
var artQuickTrampolineParsers = {
  ia32: parseArtQuickTrampolineX86,
  x64: parseArtQuickTrampolineX86,
  arm: parseArtQuickTrampolineArm,
  arm64: parseArtQuickTrampolineArm64
};
function getArtQuickEntrypointFromTrampoline(trampoline, vm3) {
  let address;
  vm3.perform((env2) => {
    const thread = getArtThreadFromEnv(env2);
    const tryParse = artQuickTrampolineParsers[Process.arch];
    const insn = Instruction.parse(trampoline);
    const offset = tryParse(insn);
    if (offset !== null) {
      address = thread.add(offset).readPointer();
    } else {
      address = trampoline;
    }
  });
  return address;
}
function parseArtQuickTrampolineX86(insn) {
  if (insn.mnemonic === "jmp") {
    return insn.operands[0].value.disp;
  }
  return null;
}
function parseArtQuickTrampolineArm(insn) {
  if (insn.mnemonic === "ldr.w") {
    return insn.operands[1].value.disp;
  }
  return null;
}
function parseArtQuickTrampolineArm64(insn) {
  if (insn.mnemonic === "ldr") {
    return insn.operands[1].value.disp;
  }
  return null;
}
function getArtThreadFromEnv(env2) {
  return env2.handle.add(pointerSize6).readPointer();
}
function _getAndroidVersion() {
  return getAndroidSystemProperty("ro.build.version.release");
}
function _getAndroidCodename() {
  return getAndroidSystemProperty("ro.build.version.codename");
}
function _getAndroidApiLevel() {
  return parseInt(getAndroidSystemProperty("ro.build.version.sdk"), 10);
}
var systemPropertyGet = null;
var PROP_VALUE_MAX = 92;
function getAndroidSystemProperty(name) {
  if (systemPropertyGet === null) {
    systemPropertyGet = new NativeFunction(
      Process.getModuleByName("libc.so").getExportByName("__system_property_get"),
      "int",
      ["pointer", "pointer"],
      nativeFunctionOptions3
    );
  }
  const buf = Memory.alloc(PROP_VALUE_MAX);
  systemPropertyGet(Memory.allocUtf8String(name), buf);
  return buf.readUtf8String();
}
function withRunnableArtThread(vm3, env2, fn) {
  const perform = getArtThreadStateTransitionImpl(vm3, env2);
  const id = getArtThreadFromEnv(env2).toString();
  artThreadStateTransitions[id] = fn;
  perform(env2.handle);
  if (artThreadStateTransitions[id] !== void 0) {
    delete artThreadStateTransitions[id];
    throw new Error("Unable to perform state transition; please file a bug");
  }
}
function _getArtThreadStateTransitionImpl(vm3, env2) {
  const callback = new NativeCallback(onThreadStateTransitionComplete, "void", ["pointer"]);
  return makeArtThreadStateTransitionImpl(vm3, env2, callback);
}
function onThreadStateTransitionComplete(thread) {
  const id = thread.toString();
  const fn = artThreadStateTransitions[id];
  delete artThreadStateTransitions[id];
  fn(thread);
}
function withAllArtThreadsSuspended(fn) {
  const api3 = getApi();
  const threadList = api3.artThreadList;
  const longSuspend = false;
  api3["art::ThreadList::SuspendAll"](threadList, Memory.allocUtf8String("frida"), longSuspend ? 1 : 0);
  try {
    fn();
  } finally {
    api3["art::ThreadList::ResumeAll"](threadList);
  }
}
var ArtClassVisitor = class {
  constructor(visit) {
    const visitor = Memory.alloc(4 * pointerSize6);
    const vtable2 = visitor.add(pointerSize6);
    visitor.writePointer(vtable2);
    const onVisit = new NativeCallback((self, klass) => {
      return visit(klass) === true ? 1 : 0;
    }, "bool", ["pointer", "pointer"]);
    vtable2.add(2 * pointerSize6).writePointer(onVisit);
    this.handle = visitor;
    this._onVisit = onVisit;
  }
};
function makeArtClassVisitor(visit) {
  const api3 = getApi();
  if (api3["art::ClassLinker::VisitClasses"] instanceof NativeFunction) {
    return new ArtClassVisitor(visit);
  }
  return new NativeCallback((klass) => {
    return visit(klass) === true ? 1 : 0;
  }, "bool", ["pointer", "pointer"]);
}
var ArtClassLoaderVisitor = class {
  constructor(visit) {
    const visitor = Memory.alloc(4 * pointerSize6);
    const vtable2 = visitor.add(pointerSize6);
    visitor.writePointer(vtable2);
    const onVisit = new NativeCallback((self, klass) => {
      visit(klass);
    }, "void", ["pointer", "pointer"]);
    vtable2.add(2 * pointerSize6).writePointer(onVisit);
    this.handle = visitor;
    this._onVisit = onVisit;
  }
};
function makeArtClassLoaderVisitor(visit) {
  return new ArtClassLoaderVisitor(visit);
}
var WalkKind = {
  "include-inlined-frames": 0,
  "skip-inlined-frames": 1
};
var ArtStackVisitor = class {
  constructor(thread, context, walkKind, numFrames = 0, checkSuspended = true) {
    const api3 = getApi();
    const baseSize = 512;
    const vtableSize = 3 * pointerSize6;
    const visitor = Memory.alloc(baseSize + vtableSize);
    api3["art::StackVisitor::StackVisitor"](
      visitor,
      thread,
      context,
      WalkKind[walkKind],
      numFrames,
      checkSuspended ? 1 : 0
    );
    const vtable2 = visitor.add(baseSize);
    visitor.writePointer(vtable2);
    const onVisitFrame = new NativeCallback(this._visitFrame.bind(this), "bool", ["pointer"]);
    vtable2.add(2 * pointerSize6).writePointer(onVisitFrame);
    this.handle = visitor;
    this._onVisitFrame = onVisitFrame;
    const curShadowFrame = visitor.add(pointerSize6 === 4 ? 12 : 24);
    this._curShadowFrame = curShadowFrame;
    this._curQuickFrame = curShadowFrame.add(pointerSize6);
    this._curQuickFramePc = curShadowFrame.add(2 * pointerSize6);
    this._curOatQuickMethodHeader = curShadowFrame.add(3 * pointerSize6);
    this._getMethodImpl = api3["art::StackVisitor::GetMethod"];
    this._descLocImpl = api3["art::StackVisitor::DescribeLocation"];
    this._getCQFIImpl = api3["art::StackVisitor::GetCurrentQuickFrameInfo"];
  }
  walkStack(includeTransitions = false) {
    getApi()["art::StackVisitor::WalkStack"](this.handle, includeTransitions ? 1 : 0);
  }
  _visitFrame() {
    return this.visitFrame() ? 1 : 0;
  }
  visitFrame() {
    throw new Error("Subclass must implement visitFrame");
  }
  getMethod() {
    const methodHandle = this._getMethodImpl(this.handle);
    if (methodHandle.isNull()) {
      return null;
    }
    return new ArtMethod(methodHandle);
  }
  getCurrentQuickFramePc() {
    return this._curQuickFramePc.readPointer();
  }
  getCurrentQuickFrame() {
    return this._curQuickFrame.readPointer();
  }
  getCurrentShadowFrame() {
    return this._curShadowFrame.readPointer();
  }
  describeLocation() {
    const result = new StdString();
    this._descLocImpl(result, this.handle);
    return result.disposeToString();
  }
  getCurrentOatQuickMethodHeader() {
    return this._curOatQuickMethodHeader.readPointer();
  }
  getCurrentQuickFrameInfo() {
    return this._getCQFIImpl(this.handle);
  }
};
var ArtMethod = class {
  constructor(handle2) {
    this.handle = handle2;
  }
  prettyMethod(withSignature = true) {
    const result = new StdString();
    getApi()["art::ArtMethod::PrettyMethod"](result, this.handle, withSignature ? 1 : 0);
    return result.disposeToString();
  }
  toString() {
    return `ArtMethod(handle=${this.handle})`;
  }
};
function makeArtQuickFrameInfoGetter(impl2) {
  return function(self) {
    const result = Memory.alloc(12);
    getArtQuickFrameInfoGetterThunk(impl2)(result, self);
    return {
      frameSizeInBytes: result.readU32(),
      coreSpillMask: result.add(4).readU32(),
      fpSpillMask: result.add(8).readU32()
    };
  };
}
function _getArtQuickFrameInfoGetterThunk(impl2) {
  let thunk = NULL;
  switch (Process.arch) {
    case "ia32":
      thunk = makeThunk(32, (writer) => {
        writer.putMovRegRegOffsetPtr("ecx", "esp", 4);
        writer.putMovRegRegOffsetPtr("edx", "esp", 8);
        writer.putCallAddressWithArguments(impl2, ["ecx", "edx"]);
        writer.putMovRegReg("esp", "ebp");
        writer.putPopReg("ebp");
        writer.putRet();
      });
      break;
    case "x64":
      thunk = makeThunk(32, (writer) => {
        writer.putPushReg("rdi");
        writer.putCallAddressWithArguments(impl2, ["rsi"]);
        writer.putPopReg("rdi");
        writer.putMovRegPtrReg("rdi", "rax");
        writer.putMovRegOffsetPtrReg("rdi", 8, "edx");
        writer.putRet();
      });
      break;
    case "arm":
      thunk = makeThunk(16, (writer) => {
        writer.putCallAddressWithArguments(impl2, ["r0", "r1"]);
        writer.putPopRegs(["r0", "lr"]);
        writer.putMovRegReg("pc", "lr");
      });
      break;
    case "arm64":
      thunk = makeThunk(64, (writer) => {
        writer.putPushRegReg("x0", "lr");
        writer.putCallAddressWithArguments(impl2, ["x1"]);
        writer.putPopRegReg("x2", "lr");
        writer.putStrRegRegOffset("x0", "x2", 0);
        writer.putStrRegRegOffset("w1", "x2", 8);
        writer.putRet();
      });
      break;
  }
  return new NativeFunction(thunk, "void", ["pointer", "pointer"], nativeFunctionOptions3);
}
var thunkRelocators = {
  ia32: globalThis.X86Relocator,
  x64: globalThis.X86Relocator,
  arm: globalThis.ThumbRelocator,
  arm64: globalThis.Arm64Relocator
};
var thunkWriters = {
  ia32: globalThis.X86Writer,
  x64: globalThis.X86Writer,
  arm: globalThis.ThumbWriter,
  arm64: globalThis.Arm64Writer
};
function makeThunk(size, write3) {
  if (thunkPage === null) {
    thunkPage = Memory.alloc(Process.pageSize);
  }
  const thunk = thunkPage.add(thunkOffset);
  const arch = Process.arch;
  const Writer = thunkWriters[arch];
  Memory.patchCode(thunk, size, (code4) => {
    const writer = new Writer(code4, { pc: thunk });
    write3(writer);
    writer.flush();
    if (writer.offset > size) {
      throw new Error(`Wrote ${writer.offset}, exceeding maximum of ${size}`);
    }
  });
  thunkOffset += size;
  return arch === "arm" ? thunk.or(1) : thunk;
}
function notifyArtMethodHooked(method2, vm3) {
  ensureArtKnowsHowToHandleMethodInstrumentation(vm3);
  ensureArtKnowsHowToHandleReplacementMethods(vm3);
}
function makeArtController(api3, vm3) {
  const threadOffsets = getArtThreadSpec(vm3).offset;
  const managedStackOffsets = getArtManagedStackSpec().offset;
  const code4 = `
#include <gum/guminterceptor.h>

extern GMutex lock;
extern GHashTable * methods;
extern GHashTable * replacements;
extern gpointer last_seen_art_method;

extern gpointer get_oat_quick_method_header_impl (gpointer method, gpointer pc);

void
init (void)
{
  g_mutex_init (&lock);
  methods = g_hash_table_new_full (NULL, NULL, NULL, NULL);
  replacements = g_hash_table_new_full (NULL, NULL, NULL, NULL);
}

void
finalize (void)
{
  g_hash_table_unref (replacements);
  g_hash_table_unref (methods);
  g_mutex_clear (&lock);
}

gboolean
is_replacement_method (gpointer method)
{
  gboolean is_replacement;

  g_mutex_lock (&lock);

  is_replacement = g_hash_table_contains (replacements, method);

  g_mutex_unlock (&lock);

  return is_replacement;
}

gpointer
get_replacement_method (gpointer original_method)
{
  gpointer replacement_method;

  g_mutex_lock (&lock);

  replacement_method = g_hash_table_lookup (methods, original_method);

  g_mutex_unlock (&lock);

  return replacement_method;
}

void
set_replacement_method (gpointer original_method,
                        gpointer replacement_method)
{
  g_mutex_lock (&lock);

  g_hash_table_insert (methods, original_method, replacement_method);
  g_hash_table_insert (replacements, replacement_method, original_method);

  g_mutex_unlock (&lock);
}

void
delete_replacement_method (gpointer original_method)
{
  gpointer replacement_method;

  g_mutex_lock (&lock);

  replacement_method = g_hash_table_lookup (methods, original_method);
  if (replacement_method != NULL)
  {
    g_hash_table_remove (methods, original_method);
    g_hash_table_remove (replacements, replacement_method);
  }

  g_mutex_unlock (&lock);
}

gpointer
translate_method (gpointer method)
{
  gpointer translated_method;

  g_mutex_lock (&lock);

  translated_method = g_hash_table_lookup (replacements, method);

  g_mutex_unlock (&lock);

  return (translated_method != NULL) ? translated_method : method;
}

gpointer
find_replacement_method_from_quick_code (gpointer method,
                                         gpointer thread)
{
  gpointer replacement_method;
  gpointer managed_stack;
  gpointer top_quick_frame;
  gpointer link_managed_stack;
  gpointer * link_top_quick_frame;

  replacement_method = get_replacement_method (method);
  if (replacement_method == NULL)
    return NULL;

  /*
   * Stack check.
   *
   * Return NULL to indicate that the original method should be invoked, otherwise
   * return a pointer to the replacement ArtMethod.
   *
   * If the caller is our own JNI replacement stub, then a stack transition must
   * have been pushed onto the current thread's linked list.
   *
   * Therefore, we invoke the original method if the following conditions are met:
   *   1- The current managed stack is empty.
   *   2- The ArtMethod * inside the linked managed stack's top quick frame is the
   *      same as our replacement.
   */
  managed_stack = thread + ${threadOffsets.managedStack};
  top_quick_frame = *((gpointer *) (managed_stack + ${managedStackOffsets.topQuickFrame}));
  if (top_quick_frame != NULL)
    return replacement_method;

  link_managed_stack = *((gpointer *) (managed_stack + ${managedStackOffsets.link}));
  if (link_managed_stack == NULL)
    return replacement_method;

  link_top_quick_frame = GSIZE_TO_POINTER (*((gsize *) (link_managed_stack + ${managedStackOffsets.topQuickFrame})) & ~((gsize) 1));
  if (link_top_quick_frame == NULL || *link_top_quick_frame != replacement_method)
    return replacement_method;

  return NULL;
}

void
on_interpreter_do_call (GumInvocationContext * ic)
{
  gpointer method, replacement_method;

  method = gum_invocation_context_get_nth_argument (ic, 0);

  replacement_method = get_replacement_method (method);
  if (replacement_method != NULL)
    gum_invocation_context_replace_nth_argument (ic, 0, replacement_method);
}

gpointer
on_art_method_get_oat_quick_method_header (gpointer method,
                                           gpointer pc)
{
  if (is_replacement_method (method))
    return NULL;

  return get_oat_quick_method_header_impl (method, pc);
}

void
on_art_method_pretty_method (GumInvocationContext * ic)
{
  const guint this_arg_index = ${Process.arch === "arm64" ? 0 : 1};
  gpointer method;

  method = gum_invocation_context_get_nth_argument (ic, this_arg_index);
  if (method == NULL)
    gum_invocation_context_replace_nth_argument (ic, this_arg_index, last_seen_art_method);
  else
    last_seen_art_method = method;
}

void
on_leave_gc_concurrent_copying_copying_phase (GumInvocationContext * ic)
{
  GHashTableIter iter;
  gpointer hooked_method, replacement_method;

  g_mutex_lock (&lock);

  g_hash_table_iter_init (&iter, methods);
  while (g_hash_table_iter_next (&iter, &hooked_method, &replacement_method))
    *((uint32_t *) replacement_method) = *((uint32_t *) hooked_method);

  g_mutex_unlock (&lock);
}
`;
  const lockSize = 8;
  const methodsSize = pointerSize6;
  const replacementsSize = pointerSize6;
  const lastSeenArtMethodSize = pointerSize6;
  const data = Memory.alloc(lockSize + methodsSize + replacementsSize + lastSeenArtMethodSize);
  const lock = data;
  const methods = lock.add(lockSize);
  const replacements = methods.add(methodsSize);
  const lastSeenArtMethod = replacements.add(replacementsSize);
  const getOatQuickMethodHeaderImpl = api3.find(pointerSize6 === 4 ? "_ZN3art9ArtMethod23GetOatQuickMethodHeaderEj" : "_ZN3art9ArtMethod23GetOatQuickMethodHeaderEm");
  const cm2 = new CModule(code4, {
    lock,
    methods,
    replacements,
    last_seen_art_method: lastSeenArtMethod,
    get_oat_quick_method_header_impl: getOatQuickMethodHeaderImpl ?? ptr("0xdeadbeef")
  });
  const fastOptions = { exceptions: "propagate", scheduling: "exclusive" };
  return {
    handle: cm2,
    replacedMethods: {
      isReplacement: new NativeFunction(cm2.is_replacement_method, "bool", ["pointer"], fastOptions),
      get: new NativeFunction(cm2.get_replacement_method, "pointer", ["pointer"], fastOptions),
      set: new NativeFunction(cm2.set_replacement_method, "void", ["pointer", "pointer"], fastOptions),
      delete: new NativeFunction(cm2.delete_replacement_method, "void", ["pointer"], fastOptions),
      translate: new NativeFunction(cm2.translate_method, "pointer", ["pointer"], fastOptions),
      findReplacementFromQuickCode: cm2.find_replacement_method_from_quick_code
    },
    getOatQuickMethodHeaderImpl,
    hooks: {
      Interpreter: {
        doCall: cm2.on_interpreter_do_call
      },
      ArtMethod: {
        getOatQuickMethodHeader: cm2.on_art_method_get_oat_quick_method_header,
        prettyMethod: cm2.on_art_method_pretty_method
      },
      Gc: {
        copyingPhase: {
          onLeave: cm2.on_leave_gc_concurrent_copying_copying_phase
        },
        runFlip: {
          onEnter: cm2.on_leave_gc_concurrent_copying_copying_phase
        }
      }
    }
  };
}
function ensureArtKnowsHowToHandleMethodInstrumentation(vm3) {
  if (taughtArtAboutMethodInstrumentation) {
    return;
  }
  taughtArtAboutMethodInstrumentation = true;
  instrumentArtQuickEntrypoints(vm3);
  instrumentArtMethodInvocationFromInterpreter();
}
function instrumentArtQuickEntrypoints(vm3) {
  const api3 = getApi();
  const quickEntrypoints = [
    api3.artQuickGenericJniTrampoline,
    api3.artQuickToInterpreterBridge,
    api3.artQuickResolutionTrampoline
  ];
  quickEntrypoints.forEach((entrypoint) => {
    Memory.protect(entrypoint, 32, "rwx");
    const interceptor = new ArtQuickCodeInterceptor(entrypoint);
    interceptor.activate(vm3);
    artQuickInterceptors.push(interceptor);
  });
}
function instrumentArtMethodInvocationFromInterpreter() {
  const api3 = getApi();
  const apiLevel = getAndroidApiLevel();
  const { isApiLevel34OrApexEquivalent } = api3;
  let artInterpreterDoCallExportRegex;
  if (apiLevel <= 22) {
    artInterpreterDoCallExportRegex = /^_ZN3art11interpreter6DoCallILb[0-1]ELb[0-1]EEEbPNS_6mirror9ArtMethodEPNS_6ThreadERNS_11ShadowFrameEPKNS_11InstructionEtPNS_6JValueE$/;
  } else if (apiLevel <= 33 && !isApiLevel34OrApexEquivalent) {
    artInterpreterDoCallExportRegex = /^_ZN3art11interpreter6DoCallILb[0-1]ELb[0-1]EEEbPNS_9ArtMethodEPNS_6ThreadERNS_11ShadowFrameEPKNS_11InstructionEtPNS_6JValueE$/;
  } else if (isApiLevel34OrApexEquivalent) {
    artInterpreterDoCallExportRegex = /^_ZN3art11interpreter6DoCallILb[0-1]EEEbPNS_9ArtMethodEPNS_6ThreadERNS_11ShadowFrameEPKNS_11InstructionEtbPNS_6JValueE$/;
  } else {
    throw new Error("Unable to find method invocation in ART; please file a bug");
  }
  const art = api3.module;
  const entries = [...art.enumerateExports(), ...art.enumerateSymbols()].filter((entry) => artInterpreterDoCallExportRegex.test(entry.name));
  if (entries.length === 0) {
    throw new Error("Unable to find method invocation in ART; please file a bug");
  }
  for (const entry of entries) {
    Interceptor.attach(entry.address, artController.hooks.Interpreter.doCall);
  }
}
function ensureArtKnowsHowToHandleReplacementMethods(vm3) {
  if (taughtArtAboutReplacementMethods) {
    return;
  }
  taughtArtAboutReplacementMethods = true;
  if (!maybeInstrumentGetOatQuickMethodHeaderInlineCopies()) {
    const { getOatQuickMethodHeaderImpl } = artController;
    if (getOatQuickMethodHeaderImpl === null) {
      return;
    }
    try {
      Interceptor.replace(getOatQuickMethodHeaderImpl, artController.hooks.ArtMethod.getOatQuickMethodHeader);
    } catch (e) {
    }
  }
  const apiLevel = getAndroidApiLevel();
  let copyingPhase = null;
  const api3 = getApi();
  if (apiLevel > 28) {
    copyingPhase = api3.find("_ZN3art2gc9collector17ConcurrentCopying12CopyingPhaseEv");
  } else if (apiLevel > 22) {
    copyingPhase = api3.find("_ZN3art2gc9collector17ConcurrentCopying12MarkingPhaseEv");
  }
  if (copyingPhase !== null) {
    Interceptor.attach(copyingPhase, artController.hooks.Gc.copyingPhase);
  }
  let runFlip = null;
  runFlip = api3.find("_ZN3art6Thread15RunFlipFunctionEPS0_");
  if (runFlip === null) {
    runFlip = api3.find("_ZN3art6Thread15RunFlipFunctionEPS0_b");
  }
  if (runFlip !== null) {
    Interceptor.attach(runFlip, artController.hooks.Gc.runFlip);
  }
}
var artGetOatQuickMethodHeaderInlinedCopyHandler = {
  arm: {
    signatures: [
      {
        pattern: [
          "b0 68",
          // ldr r0, [r6, #8]
          "01 30",
          // adds r0, #1
          "0c d0",
          // beq #0x16fcd4
          "1b 98",
          // ldr r0, [sp, #0x6c]
          ":",
          "c0 ff",
          "c0 ff",
          "00 ff",
          "00 2f"
        ],
        validateMatch: validateGetOatQuickMethodHeaderInlinedMatchArm
      },
      {
        pattern: [
          "d8 f8 08 00",
          // ldr r0, [r8, #8]
          "01 30",
          // adds r0, #1
          "0c d0",
          // beq #0x16fcd4
          "1b 98",
          // ldr r0, [sp, #0x6c]
          ":",
          "f0 ff ff 0f",
          "ff ff",
          "00 ff",
          "00 2f"
        ],
        validateMatch: validateGetOatQuickMethodHeaderInlinedMatchArm
      },
      {
        pattern: [
          "b0 68",
          // ldr r0, [r6, #8]
          "01 30",
          // adds r0, #1
          "40 f0 c3 80",
          // bne #0x203bf0
          "00 25",
          // movs r5, #0
          ":",
          "c0 ff",
          "c0 ff",
          "c0 fb 00 d0",
          "ff f8"
        ],
        validateMatch: validateGetOatQuickMethodHeaderInlinedMatchArm
      }
    ],
    instrument: instrumentGetOatQuickMethodHeaderInlinedCopyArm
  },
  arm64: {
    signatures: [
      {
        pattern: [
          /* e8 */
          "0a 40 b9",
          // ldr w8, [x23, #0x8]
          "1f 05 00 31",
          // cmn w8, #0x1
          "40 01 00 54",
          // b.eq 0x2e4204
          "88 39 00 f0",
          // adrp x8, 0xa17000
          ":",
          /* 00 */
          "fc ff ff",
          "1f fc ff ff",
          "1f 00 00 ff",
          "00 00 00 9f"
        ],
        offset: 1,
        validateMatch: validateGetOatQuickMethodHeaderInlinedMatchArm64
      },
      {
        pattern: [
          /* e8 */
          "0a 40 b9",
          // ldr w8, [x23, #0x8]
          "1f 05 00 31",
          // cmn w8, #0x1
          "01 34 00 54",
          // b.ne 0x3d8e50
          "e0 03 1f aa",
          // mov x0, xzr
          ":",
          /* 00 */
          "fc ff ff",
          "1f fc ff ff",
          "1f 00 00 ff",
          "e0 ff ff ff"
        ],
        offset: 1,
        validateMatch: validateGetOatQuickMethodHeaderInlinedMatchArm64
      }
    ],
    instrument: instrumentGetOatQuickMethodHeaderInlinedCopyArm64
  }
};
function validateGetOatQuickMethodHeaderInlinedMatchArm({ address, size }) {
  const ldr = Instruction.parse(address.or(1));
  const [ldrDst, ldrSrc] = ldr.operands;
  const methodReg = ldrSrc.value.base;
  const scratchReg = ldrDst.value;
  const branch = Instruction.parse(ldr.next.add(2));
  const targetWhenTrue = ptr(branch.operands[0].value);
  const targetWhenFalse = branch.address.add(branch.size);
  let targetWhenRegularMethod, targetWhenRuntimeMethod;
  if (branch.mnemonic === "beq") {
    targetWhenRegularMethod = targetWhenFalse;
    targetWhenRuntimeMethod = targetWhenTrue;
  } else {
    targetWhenRegularMethod = targetWhenTrue;
    targetWhenRuntimeMethod = targetWhenFalse;
  }
  return parseInstructionsAt(targetWhenRegularMethod.or(1), tryParse, { limit: 3 });
  function tryParse(insn) {
    const { mnemonic } = insn;
    if (!(mnemonic === "ldr" || mnemonic === "ldr.w")) {
      return null;
    }
    const { base, disp } = insn.operands[1].value;
    if (!(base === methodReg && disp === 20)) {
      return null;
    }
    return {
      methodReg,
      scratchReg,
      target: {
        whenTrue: targetWhenTrue,
        whenRegularMethod: targetWhenRegularMethod,
        whenRuntimeMethod: targetWhenRuntimeMethod
      }
    };
  }
}
function validateGetOatQuickMethodHeaderInlinedMatchArm64({ address, size }) {
  const [ldrDst, ldrSrc] = Instruction.parse(address).operands;
  const methodReg = ldrSrc.value.base;
  const scratchReg = "x" + ldrDst.value.substring(1);
  const branch = Instruction.parse(address.add(8));
  const targetWhenTrue = ptr(branch.operands[0].value);
  const targetWhenFalse = address.add(12);
  let targetWhenRegularMethod, targetWhenRuntimeMethod;
  if (branch.mnemonic === "b.eq") {
    targetWhenRegularMethod = targetWhenFalse;
    targetWhenRuntimeMethod = targetWhenTrue;
  } else {
    targetWhenRegularMethod = targetWhenTrue;
    targetWhenRuntimeMethod = targetWhenFalse;
  }
  return parseInstructionsAt(targetWhenRegularMethod, tryParse, { limit: 3 });
  function tryParse(insn) {
    if (insn.mnemonic !== "ldr") {
      return null;
    }
    const { base, disp } = insn.operands[1].value;
    if (!(base === methodReg && disp === 24)) {
      return null;
    }
    return {
      methodReg,
      scratchReg,
      target: {
        whenTrue: targetWhenTrue,
        whenRegularMethod: targetWhenRegularMethod,
        whenRuntimeMethod: targetWhenRuntimeMethod
      }
    };
  }
}
function maybeInstrumentGetOatQuickMethodHeaderInlineCopies() {
  if (getAndroidApiLevel() < 31) {
    return false;
  }
  const handler = artGetOatQuickMethodHeaderInlinedCopyHandler[Process.arch];
  if (handler === void 0) {
    return false;
  }
  const signatures = handler.signatures.map(({ pattern, offset = 0, validateMatch = returnEmptyObject }) => {
    return {
      pattern: new MatchPattern(pattern.join("")),
      offset,
      validateMatch
    };
  });
  const impls = [];
  for (const { base, size } of getApi().module.enumerateRanges("--x")) {
    for (const { pattern, offset, validateMatch } of signatures) {
      const matches = Memory.scanSync(base, size, pattern).map(({ address, size: size2 }) => {
        return { address: address.sub(offset), size: size2 + offset };
      }).filter((match) => {
        const validationResult = validateMatch(match);
        if (validationResult === null) {
          return false;
        }
        match.validationResult = validationResult;
        return true;
      });
      impls.push(...matches);
    }
  }
  if (impls.length === 0) {
    return false;
  }
  impls.forEach(handler.instrument);
  return true;
}
function returnEmptyObject() {
  return {};
}
var InlineHook = class {
  constructor(address, size, trampoline) {
    this.address = address;
    this.size = size;
    this.originalCode = address.readByteArray(size);
    this.trampoline = trampoline;
  }
  revert() {
    Memory.patchCode(this.address, this.size, (code4) => {
      code4.writeByteArray(this.originalCode);
    });
  }
};
function instrumentGetOatQuickMethodHeaderInlinedCopyArm({ address, size, validationResult }) {
  const { methodReg, target } = validationResult;
  const trampoline = Memory.alloc(Process.pageSize);
  let redirectCapacity = size;
  Memory.patchCode(trampoline, 256, (code4) => {
    const writer = new ThumbWriter(code4, { pc: trampoline });
    const relocator = new ThumbRelocator(address, writer);
    for (let i = 0; i !== 2; i++) {
      relocator.readOne();
    }
    relocator.writeAll();
    relocator.readOne();
    relocator.skipOne();
    writer.putBCondLabel("eq", "runtime_or_replacement_method");
    const vpushFpRegs = [45, 237, 16, 10];
    writer.putBytes(vpushFpRegs);
    const savedRegs = ["r0", "r1", "r2", "r3"];
    writer.putPushRegs(savedRegs);
    writer.putCallAddressWithArguments(artController.replacedMethods.isReplacement, [methodReg]);
    writer.putCmpRegImm("r0", 0);
    writer.putPopRegs(savedRegs);
    const vpopFpRegs = [189, 236, 16, 10];
    writer.putBytes(vpopFpRegs);
    writer.putBCondLabel("ne", "runtime_or_replacement_method");
    writer.putBLabel("regular_method");
    relocator.readOne();
    const tailIsRegular = relocator.input.address.equals(target.whenRegularMethod);
    writer.putLabel(tailIsRegular ? "regular_method" : "runtime_or_replacement_method");
    relocator.writeOne();
    while (redirectCapacity < 10) {
      const offset = relocator.readOne();
      if (offset === 0) {
        redirectCapacity = 10;
        break;
      }
      redirectCapacity = offset;
    }
    relocator.writeAll();
    writer.putBranchAddress(address.add(redirectCapacity + 1));
    writer.putLabel(tailIsRegular ? "runtime_or_replacement_method" : "regular_method");
    writer.putBranchAddress(target.whenTrue);
    writer.flush();
  });
  inlineHooks.push(new InlineHook(address, redirectCapacity, trampoline));
  Memory.patchCode(address, redirectCapacity, (code4) => {
    const writer = new ThumbWriter(code4, { pc: address });
    writer.putLdrRegAddress("pc", trampoline.or(1));
    writer.flush();
  });
}
function instrumentGetOatQuickMethodHeaderInlinedCopyArm64({ address, size, validationResult }) {
  const { methodReg, scratchReg, target } = validationResult;
  const trampoline = Memory.alloc(Process.pageSize);
  Memory.patchCode(trampoline, 256, (code4) => {
    const writer = new Arm64Writer(code4, { pc: trampoline });
    const relocator = new Arm64Relocator(address, writer);
    for (let i = 0; i !== 2; i++) {
      relocator.readOne();
    }
    relocator.writeAll();
    relocator.readOne();
    relocator.skipOne();
    writer.putBCondLabel("eq", "runtime_or_replacement_method");
    const savedRegs = [
      "d0",
      "d1",
      "d2",
      "d3",
      "d4",
      "d5",
      "d6",
      "d7",
      "x0",
      "x1",
      "x2",
      "x3",
      "x4",
      "x5",
      "x6",
      "x7",
      "x8",
      "x9",
      "x10",
      "x11",
      "x12",
      "x13",
      "x14",
      "x15",
      "x16",
      "x17"
    ];
    const numSavedRegs = savedRegs.length;
    for (let i = 0; i !== numSavedRegs; i += 2) {
      writer.putPushRegReg(savedRegs[i], savedRegs[i + 1]);
    }
    writer.putCallAddressWithArguments(artController.replacedMethods.isReplacement, [methodReg]);
    writer.putCmpRegReg("x0", "xzr");
    for (let i = numSavedRegs - 2; i >= 0; i -= 2) {
      writer.putPopRegReg(savedRegs[i], savedRegs[i + 1]);
    }
    writer.putBCondLabel("ne", "runtime_or_replacement_method");
    writer.putBLabel("regular_method");
    relocator.readOne();
    const tailInstruction = relocator.input;
    const tailIsRegular = tailInstruction.address.equals(target.whenRegularMethod);
    writer.putLabel(tailIsRegular ? "regular_method" : "runtime_or_replacement_method");
    relocator.writeOne();
    writer.putBranchAddress(tailInstruction.next);
    writer.putLabel(tailIsRegular ? "runtime_or_replacement_method" : "regular_method");
    writer.putBranchAddress(target.whenTrue);
    writer.flush();
  });
  inlineHooks.push(new InlineHook(address, size, trampoline));
  Memory.patchCode(address, size, (code4) => {
    const writer = new Arm64Writer(code4, { pc: address });
    writer.putLdrRegAddress(scratchReg, trampoline);
    writer.putBrReg(scratchReg);
    writer.flush();
  });
}
function makeMethodMangler(methodId) {
  return new MethodMangler(methodId);
}
function translateMethod(methodId) {
  return artController.replacedMethods.translate(methodId);
}
function backtrace(vm3, options = {}) {
  const { limit = 16 } = options;
  const env2 = vm3.getEnv();
  if (backtraceModule === null) {
    backtraceModule = makeBacktraceModule(vm3, env2);
  }
  return backtraceModule.backtrace(env2, limit);
}
function makeBacktraceModule(vm3, env2) {
  const api3 = getApi();
  const performImpl = Memory.alloc(Process.pointerSize);
  const cm2 = new CModule(`
#include <glib.h>
#include <stdbool.h>
#include <string.h>
#include <gum/gumtls.h>
#include <json-glib/json-glib.h>

typedef struct _ArtBacktrace ArtBacktrace;
typedef struct _ArtStackFrame ArtStackFrame;

typedef struct _ArtStackVisitor ArtStackVisitor;
typedef struct _ArtStackVisitorVTable ArtStackVisitorVTable;

typedef struct _ArtClass ArtClass;
typedef struct _ArtMethod ArtMethod;
typedef struct _ArtThread ArtThread;
typedef struct _ArtContext ArtContext;

typedef struct _JNIEnv JNIEnv;

typedef struct _StdString StdString;
typedef struct _StdTinyString StdTinyString;
typedef struct _StdLargeString StdLargeString;

typedef enum {
  STACK_WALK_INCLUDE_INLINED_FRAMES,
  STACK_WALK_SKIP_INLINED_FRAMES,
} StackWalkKind;

struct _StdTinyString
{
  guint8 unused;
  gchar data[(3 * sizeof (gpointer)) - 1];
};

struct _StdLargeString
{
  gsize capacity;
  gsize size;
  gchar * data;
};

struct _StdString
{
  union
  {
    guint8 flags;
    StdTinyString tiny;
    StdLargeString large;
  };
};

struct _ArtBacktrace
{
  GChecksum * id;
  GArray * frames;
  gchar * frames_json;
};

struct _ArtStackFrame
{
  ArtMethod * method;
  gsize dexpc;
  StdString description;
};

struct _ArtStackVisitorVTable
{
  void (* unused1) (void);
  void (* unused2) (void);
  bool (* visit) (ArtStackVisitor * visitor);
};

struct _ArtStackVisitor
{
  ArtStackVisitorVTable * vtable;

  guint8 padding[512];

  ArtStackVisitorVTable vtable_storage;

  ArtBacktrace * backtrace;
};

struct _ArtMethod
{
  guint32 declaring_class;
  guint32 access_flags;
};

extern GumTlsKey current_backtrace;

extern void (* perform_art_thread_state_transition) (JNIEnv * env);

extern ArtContext * art_thread_get_long_jump_context (ArtThread * thread);

extern void art_stack_visitor_init (ArtStackVisitor * visitor, ArtThread * thread, void * context, StackWalkKind walk_kind,
    size_t num_frames, bool check_suspended);
extern void art_stack_visitor_walk_stack (ArtStackVisitor * visitor, bool include_transitions);
extern ArtMethod * art_stack_visitor_get_method (ArtStackVisitor * visitor);
extern void art_stack_visitor_describe_location (StdString * description, ArtStackVisitor * visitor);
extern ArtMethod * translate_method (ArtMethod * method);
extern void translate_location (ArtMethod * method, guint32 pc, const gchar ** source_file, gint32 * line_number);
extern void get_class_location (StdString * result, ArtClass * klass);
extern void cxx_delete (void * mem);
extern unsigned long strtoul (const char * str, char ** endptr, int base);

static bool visit_frame (ArtStackVisitor * visitor);
static void art_stack_frame_destroy (ArtStackFrame * frame);

static void append_jni_type_name (GString * s, const gchar * name, gsize length);

static void std_string_destroy (StdString * str);
static gchar * std_string_get_data (StdString * str);

void
init (void)
{
  current_backtrace = gum_tls_key_new ();
}

void
finalize (void)
{
  gum_tls_key_free (current_backtrace);
}

ArtBacktrace *
_create (JNIEnv * env,
         guint limit)
{
  ArtBacktrace * bt;

  bt = g_new (ArtBacktrace, 1);
  bt->id = g_checksum_new (G_CHECKSUM_SHA1);
  bt->frames = (limit != 0)
      ? g_array_sized_new (FALSE, FALSE, sizeof (ArtStackFrame), limit)
      : g_array_new (FALSE, FALSE, sizeof (ArtStackFrame));
  g_array_set_clear_func (bt->frames, (GDestroyNotify) art_stack_frame_destroy);
  bt->frames_json = NULL;

  gum_tls_key_set_value (current_backtrace, bt);

  perform_art_thread_state_transition (env);

  gum_tls_key_set_value (current_backtrace, NULL);

  return bt;
}

void
_on_thread_state_transition_complete (ArtThread * thread)
{
  ArtContext * context;
  ArtStackVisitor visitor = {
    .vtable_storage = {
      .visit = visit_frame,
    },
  };

  context = art_thread_get_long_jump_context (thread);

  art_stack_visitor_init (&visitor, thread, context, STACK_WALK_SKIP_INLINED_FRAMES, 0, true);
  visitor.vtable = &visitor.vtable_storage;
  visitor.backtrace = gum_tls_key_get_value (current_backtrace);

  art_stack_visitor_walk_stack (&visitor, false);

  cxx_delete (context);
}

static bool
visit_frame (ArtStackVisitor * visitor)
{
  ArtBacktrace * bt = visitor->backtrace;
  ArtStackFrame frame;
  const gchar * description, * dexpc_part;

  frame.method = art_stack_visitor_get_method (visitor);

  art_stack_visitor_describe_location (&frame.description, visitor);

  description = std_string_get_data (&frame.description);
  if (strstr (description, " '<") != NULL)
    goto skip;

  dexpc_part = strstr (description, " at dex PC 0x");
  if (dexpc_part == NULL)
    goto skip;
  frame.dexpc = strtoul (dexpc_part + 13, NULL, 16);

  g_array_append_val (bt->frames, frame);

  g_checksum_update (bt->id, (guchar *) &frame.method, sizeof (frame.method));
  g_checksum_update (bt->id, (guchar *) &frame.dexpc, sizeof (frame.dexpc));

  return true;

skip:
  std_string_destroy (&frame.description);
  return true;
}

static void
art_stack_frame_destroy (ArtStackFrame * frame)
{
  std_string_destroy (&frame->description);
}

void
_destroy (ArtBacktrace * backtrace)
{
  g_free (backtrace->frames_json);
  g_array_free (backtrace->frames, TRUE);
  g_checksum_free (backtrace->id);
  g_free (backtrace);
}

const gchar *
_get_id (ArtBacktrace * backtrace)
{
  return g_checksum_get_string (backtrace->id);
}

const gchar *
_get_frames (ArtBacktrace * backtrace)
{
  GArray * frames = backtrace->frames;
  JsonBuilder * b;
  guint i;
  JsonNode * root;

  if (backtrace->frames_json != NULL)
    return backtrace->frames_json;

  b = json_builder_new_immutable ();

  json_builder_begin_array (b);

  for (i = 0; i != frames->len; i++)
  {
    ArtStackFrame * frame = &g_array_index (frames, ArtStackFrame, i);
    gchar * description, * ret_type, * paren_open, * paren_close, * arg_types, * token, * method_name, * class_name;
    GString * signature;
    gchar * cursor;
    ArtMethod * translated_method;
    StdString location;
    gsize dexpc;
    const gchar * source_file;
    gint32 line_number;

    description = std_string_get_data (&frame->description);

    ret_type = strchr (description, '\\'') + 1;

    paren_open = strchr (ret_type, '(');
    paren_close = strchr (paren_open, ')');
    *paren_open = '\\0';
    *paren_close = '\\0';

    arg_types = paren_open + 1;

    token = strrchr (ret_type, '.');
    *token = '\\0';

    method_name = token + 1;

    token = strrchr (ret_type, ' ');
    *token = '\\0';

    class_name = token + 1;

    signature = g_string_sized_new (128);

    append_jni_type_name (signature, class_name, method_name - class_name - 1);
    g_string_append_c (signature, ',');
    g_string_append (signature, method_name);
    g_string_append (signature, ",(");

    if (arg_types != paren_close)
    {
      for (cursor = arg_types; cursor != NULL;)
      {
        gsize length;
        gchar * next;

        token = strstr (cursor, ", ");
        if (token != NULL)
        {
          length = token - cursor;
          next = token + 2;
        }
        else
        {
          length = paren_close - cursor;
          next = NULL;
        }

        append_jni_type_name (signature, cursor, length);

        cursor = next;
      }
    }

    g_string_append_c (signature, ')');

    append_jni_type_name (signature, ret_type, class_name - ret_type - 1);

    translated_method = translate_method (frame->method);
    dexpc = (translated_method == frame->method) ? frame->dexpc : 0;

    get_class_location (&location, GSIZE_TO_POINTER (translated_method->declaring_class));

    translate_location (translated_method, dexpc, &source_file, &line_number);

    json_builder_begin_object (b);

    json_builder_set_member_name (b, "signature");
    json_builder_add_string_value (b, signature->str);

    json_builder_set_member_name (b, "origin");
    json_builder_add_string_value (b, std_string_get_data (&location));

    json_builder_set_member_name (b, "className");
    json_builder_add_string_value (b, class_name);

    json_builder_set_member_name (b, "methodName");
    json_builder_add_string_value (b, method_name);

    json_builder_set_member_name (b, "methodFlags");
    json_builder_add_int_value (b, translated_method->access_flags);

    json_builder_set_member_name (b, "fileName");
    json_builder_add_string_value (b, source_file);

    json_builder_set_member_name (b, "lineNumber");
    json_builder_add_int_value (b, line_number);

    json_builder_end_object (b);

    std_string_destroy (&location);
    g_string_free (signature, TRUE);
  }

  json_builder_end_array (b);

  root = json_builder_get_root (b);
  backtrace->frames_json = json_to_string (root, FALSE);
  json_node_unref (root);

  return backtrace->frames_json;
}

static void
append_jni_type_name (GString * s,
                      const gchar * name,
                      gsize length)
{
  gchar shorty = '\\0';
  gsize i;

  switch (name[0])
  {
    case 'b':
      if (strncmp (name, "boolean", length) == 0)
        shorty = 'Z';
      else if (strncmp (name, "byte", length) == 0)
        shorty = 'B';
      break;
    case 'c':
      if (strncmp (name, "char", length) == 0)
        shorty = 'C';
      break;
    case 'd':
      if (strncmp (name, "double", length) == 0)
        shorty = 'D';
      break;
    case 'f':
      if (strncmp (name, "float", length) == 0)
        shorty = 'F';
      break;
    case 'i':
      if (strncmp (name, "int", length) == 0)
        shorty = 'I';
      break;
    case 'l':
      if (strncmp (name, "long", length) == 0)
        shorty = 'J';
      break;
    case 's':
      if (strncmp (name, "short", length) == 0)
        shorty = 'S';
      break;
    case 'v':
      if (strncmp (name, "void", length) == 0)
        shorty = 'V';
      break;
  }

  if (shorty != '\\0')
  {
    g_string_append_c (s, shorty);

    return;
  }

  if (length > 2 && name[length - 2] == '[' && name[length - 1] == ']')
  {
    g_string_append_c (s, '[');
    append_jni_type_name (s, name, length - 2);

    return;
  }

  g_string_append_c (s, 'L');

  for (i = 0; i != length; i++)
  {
    gchar ch = name[i];
    if (ch != '.')
      g_string_append_c (s, ch);
    else
      g_string_append_c (s, '/');
  }

  g_string_append_c (s, ';');
}

static void
std_string_destroy (StdString * str)
{
  bool is_large = (str->flags & 1) != 0;
  if (is_large)
    cxx_delete (str->large.data);
}

static gchar *
std_string_get_data (StdString * str)
{
  bool is_large = (str->flags & 1) != 0;
  return is_large ? str->large.data : str->tiny.data;
}
`, {
    current_backtrace: Memory.alloc(Process.pointerSize),
    perform_art_thread_state_transition: performImpl,
    art_thread_get_long_jump_context: api3["art::Thread::GetLongJumpContext"],
    art_stack_visitor_init: api3["art::StackVisitor::StackVisitor"],
    art_stack_visitor_walk_stack: api3["art::StackVisitor::WalkStack"],
    art_stack_visitor_get_method: api3["art::StackVisitor::GetMethod"],
    art_stack_visitor_describe_location: api3["art::StackVisitor::DescribeLocation"],
    translate_method: artController.replacedMethods.translate,
    translate_location: api3["art::Monitor::TranslateLocation"],
    get_class_location: api3["art::mirror::Class::GetLocation"],
    cxx_delete: api3.$delete,
    strtoul: Process.getModuleByName("libc.so").getExportByName("strtoul")
  });
  const _create = new NativeFunction(cm2._create, "pointer", ["pointer", "uint"], nativeFunctionOptions3);
  const _destroy2 = new NativeFunction(cm2._destroy, "void", ["pointer"], nativeFunctionOptions3);
  const fastOptions = { exceptions: "propagate", scheduling: "exclusive" };
  const _getId = new NativeFunction(cm2._get_id, "pointer", ["pointer"], fastOptions);
  const _getFrames = new NativeFunction(cm2._get_frames, "pointer", ["pointer"], fastOptions);
  const performThreadStateTransition = makeArtThreadStateTransitionImpl(vm3, env2, cm2._on_thread_state_transition_complete);
  cm2._performData = performThreadStateTransition;
  performImpl.writePointer(performThreadStateTransition);
  cm2.backtrace = (env3, limit) => {
    const handle2 = _create(env3, limit);
    const bt = new Backtrace(handle2);
    Script.bindWeak(bt, destroy3.bind(null, handle2));
    return bt;
  };
  function destroy3(handle2) {
    _destroy2(handle2);
  }
  cm2.getId = (handle2) => {
    return _getId(handle2).readUtf8String();
  };
  cm2.getFrames = (handle2) => {
    return JSON.parse(_getFrames(handle2).readUtf8String());
  };
  return cm2;
}
var Backtrace = class {
  constructor(handle2) {
    this.handle = handle2;
  }
  get id() {
    return backtraceModule.getId(this.handle);
  }
  get frames() {
    return backtraceModule.getFrames(this.handle);
  }
};
function revertGlobalPatches() {
  patchedClasses.forEach((entry) => {
    entry.vtablePtr.writePointer(entry.vtable);
    entry.vtableCountPtr.writeS32(entry.vtableCount);
  });
  patchedClasses.clear();
  for (const interceptor of artQuickInterceptors.splice(0)) {
    interceptor.deactivate();
  }
  for (const hook of inlineHooks.splice(0)) {
    hook.revert();
  }
}
function unwrapMethodId(methodId) {
  const api3 = getApi();
  const runtimeOffset = getArtRuntimeSpec(api3).offset;
  const jniIdManagerOffset = runtimeOffset.jniIdManager;
  const jniIdsIndirectionOffset = runtimeOffset.jniIdsIndirection;
  if (jniIdManagerOffset !== null && jniIdsIndirectionOffset !== null) {
    const runtime3 = api3.artRuntime;
    const jniIdsIndirection = runtime3.add(jniIdsIndirectionOffset).readInt();
    if (jniIdsIndirection !== kPointer) {
      const jniIdManager = runtime3.add(jniIdManagerOffset).readPointer();
      return api3["art::jni::JniIdManager::DecodeMethodId"](jniIdManager, methodId);
    }
  }
  return methodId;
}
var artQuickCodeReplacementTrampolineWriters = {
  ia32: writeArtQuickCodeReplacementTrampolineIA32,
  x64: writeArtQuickCodeReplacementTrampolineX64,
  arm: writeArtQuickCodeReplacementTrampolineArm,
  arm64: writeArtQuickCodeReplacementTrampolineArm64
};
function writeArtQuickCodeReplacementTrampolineIA32(trampoline, target, redirectSize, constraints, vm3) {
  const threadOffsets = getArtThreadSpec(vm3).offset;
  const artMethodOffsets = getArtMethodSpec(vm3).offset;
  let offset;
  Memory.patchCode(trampoline, 128, (code4) => {
    const writer = new X86Writer(code4, { pc: trampoline });
    const relocator = new X86Relocator(target, writer);
    const fxsave = [15, 174, 4, 36];
    const fxrstor = [15, 174, 12, 36];
    writer.putPushax();
    writer.putMovRegReg("ebp", "esp");
    writer.putAndRegU32("esp", 4294967280);
    writer.putSubRegImm("esp", 512);
    writer.putBytes(fxsave);
    writer.putMovRegFsU32Ptr("ebx", threadOffsets.self);
    writer.putCallAddressWithAlignedArguments(artController.replacedMethods.findReplacementFromQuickCode, ["eax", "ebx"]);
    writer.putTestRegReg("eax", "eax");
    writer.putJccShortLabel("je", "restore_registers", "no-hint");
    writer.putMovRegOffsetPtrReg("ebp", 7 * 4, "eax");
    writer.putLabel("restore_registers");
    writer.putBytes(fxrstor);
    writer.putMovRegReg("esp", "ebp");
    writer.putPopax();
    writer.putJccShortLabel("jne", "invoke_replacement", "no-hint");
    do {
      offset = relocator.readOne();
    } while (offset < redirectSize && !relocator.eoi);
    relocator.writeAll();
    if (!relocator.eoi) {
      writer.putJmpAddress(target.add(offset));
    }
    writer.putLabel("invoke_replacement");
    writer.putJmpRegOffsetPtr("eax", artMethodOffsets.quickCode);
    writer.flush();
  });
  return offset;
}
function writeArtQuickCodeReplacementTrampolineX64(trampoline, target, redirectSize, constraints, vm3) {
  const threadOffsets = getArtThreadSpec(vm3).offset;
  const artMethodOffsets = getArtMethodSpec(vm3).offset;
  let offset;
  Memory.patchCode(trampoline, 256, (code4) => {
    const writer = new X86Writer(code4, { pc: trampoline });
    const relocator = new X86Relocator(target, writer);
    const fxsave = [15, 174, 4, 36];
    const fxrstor = [15, 174, 12, 36];
    writer.putPushax();
    writer.putMovRegReg("rbp", "rsp");
    writer.putAndRegU32("rsp", 4294967280);
    writer.putSubRegImm("rsp", 512);
    writer.putBytes(fxsave);
    writer.putMovRegGsU32Ptr("rbx", threadOffsets.self);
    writer.putCallAddressWithAlignedArguments(artController.replacedMethods.findReplacementFromQuickCode, ["rdi", "rbx"]);
    writer.putTestRegReg("rax", "rax");
    writer.putJccShortLabel("je", "restore_registers", "no-hint");
    writer.putMovRegOffsetPtrReg("rbp", 8 * 8, "rax");
    writer.putLabel("restore_registers");
    writer.putBytes(fxrstor);
    writer.putMovRegReg("rsp", "rbp");
    writer.putPopax();
    writer.putJccShortLabel("jne", "invoke_replacement", "no-hint");
    do {
      offset = relocator.readOne();
    } while (offset < redirectSize && !relocator.eoi);
    relocator.writeAll();
    if (!relocator.eoi) {
      writer.putJmpAddress(target.add(offset));
    }
    writer.putLabel("invoke_replacement");
    writer.putJmpRegOffsetPtr("rdi", artMethodOffsets.quickCode);
    writer.flush();
  });
  return offset;
}
function writeArtQuickCodeReplacementTrampolineArm(trampoline, target, redirectSize, constraints, vm3) {
  const artMethodOffsets = getArtMethodSpec(vm3).offset;
  const targetAddress = target.and(THUMB_BIT_REMOVAL_MASK);
  let offset;
  Memory.patchCode(trampoline, 128, (code4) => {
    const writer = new ThumbWriter(code4, { pc: trampoline });
    const relocator = new ThumbRelocator(targetAddress, writer);
    const vpushFpRegs = [45, 237, 16, 10];
    const vpopFpRegs = [189, 236, 16, 10];
    writer.putPushRegs([
      "r1",
      "r2",
      "r3",
      "r5",
      "r6",
      "r7",
      "r8",
      "r10",
      "r11",
      "lr"
    ]);
    writer.putBytes(vpushFpRegs);
    writer.putSubRegRegImm("sp", "sp", 8);
    writer.putStrRegRegOffset("r0", "sp", 0);
    writer.putCallAddressWithArguments(artController.replacedMethods.findReplacementFromQuickCode, ["r0", "r9"]);
    writer.putCmpRegImm("r0", 0);
    writer.putBCondLabel("eq", "restore_registers");
    writer.putStrRegRegOffset("r0", "sp", 0);
    writer.putLabel("restore_registers");
    writer.putLdrRegRegOffset("r0", "sp", 0);
    writer.putAddRegRegImm("sp", "sp", 8);
    writer.putBytes(vpopFpRegs);
    writer.putPopRegs([
      "lr",
      "r11",
      "r10",
      "r8",
      "r7",
      "r6",
      "r5",
      "r3",
      "r2",
      "r1"
    ]);
    writer.putBCondLabel("ne", "invoke_replacement");
    do {
      offset = relocator.readOne();
    } while (offset < redirectSize && !relocator.eoi);
    relocator.writeAll();
    if (!relocator.eoi) {
      writer.putLdrRegAddress("pc", target.add(offset));
    }
    writer.putLabel("invoke_replacement");
    writer.putLdrRegRegOffset("pc", "r0", artMethodOffsets.quickCode);
    writer.flush();
  });
  return offset;
}
function writeArtQuickCodeReplacementTrampolineArm64(trampoline, target, redirectSize, { availableScratchRegs }, vm3) {
  const artMethodOffsets = getArtMethodSpec(vm3).offset;
  let offset;
  Memory.patchCode(trampoline, 256, (code4) => {
    const writer = new Arm64Writer(code4, { pc: trampoline });
    const relocator = new Arm64Relocator(target, writer);
    writer.putPushRegReg("d0", "d1");
    writer.putPushRegReg("d2", "d3");
    writer.putPushRegReg("d4", "d5");
    writer.putPushRegReg("d6", "d7");
    writer.putPushRegReg("x1", "x2");
    writer.putPushRegReg("x3", "x4");
    writer.putPushRegReg("x5", "x6");
    writer.putPushRegReg("x7", "x20");
    writer.putPushRegReg("x21", "x22");
    writer.putPushRegReg("x23", "x24");
    writer.putPushRegReg("x25", "x26");
    writer.putPushRegReg("x27", "x28");
    writer.putPushRegReg("x29", "lr");
    writer.putSubRegRegImm("sp", "sp", 16);
    writer.putStrRegRegOffset("x0", "sp", 0);
    writer.putCallAddressWithArguments(artController.replacedMethods.findReplacementFromQuickCode, ["x0", "x19"]);
    writer.putCmpRegReg("x0", "xzr");
    writer.putBCondLabel("eq", "restore_registers");
    writer.putStrRegRegOffset("x0", "sp", 0);
    writer.putLabel("restore_registers");
    writer.putLdrRegRegOffset("x0", "sp", 0);
    writer.putAddRegRegImm("sp", "sp", 16);
    writer.putPopRegReg("x29", "lr");
    writer.putPopRegReg("x27", "x28");
    writer.putPopRegReg("x25", "x26");
    writer.putPopRegReg("x23", "x24");
    writer.putPopRegReg("x21", "x22");
    writer.putPopRegReg("x7", "x20");
    writer.putPopRegReg("x5", "x6");
    writer.putPopRegReg("x3", "x4");
    writer.putPopRegReg("x1", "x2");
    writer.putPopRegReg("d6", "d7");
    writer.putPopRegReg("d4", "d5");
    writer.putPopRegReg("d2", "d3");
    writer.putPopRegReg("d0", "d1");
    writer.putBCondLabel("ne", "invoke_replacement");
    do {
      offset = relocator.readOne();
    } while (offset < redirectSize && !relocator.eoi);
    relocator.writeAll();
    if (!relocator.eoi) {
      const scratchReg = Array.from(availableScratchRegs)[0];
      writer.putLdrRegAddress(scratchReg, target.add(offset));
      writer.putBrReg(scratchReg);
    }
    writer.putLabel("invoke_replacement");
    writer.putLdrRegRegOffset("x16", "x0", artMethodOffsets.quickCode);
    writer.putBrReg("x16");
    writer.flush();
  });
  return offset;
}
var artQuickCodePrologueWriters = {
  ia32: writeArtQuickCodePrologueX86,
  x64: writeArtQuickCodePrologueX86,
  arm: writeArtQuickCodePrologueArm,
  arm64: writeArtQuickCodePrologueArm64
};
function writeArtQuickCodePrologueX86(target, trampoline, redirectSize) {
  Memory.patchCode(target, 16, (code4) => {
    const writer = new X86Writer(code4, { pc: target });
    writer.putJmpAddress(trampoline);
    writer.flush();
  });
}
function writeArtQuickCodePrologueArm(target, trampoline, redirectSize) {
  const targetAddress = target.and(THUMB_BIT_REMOVAL_MASK);
  Memory.patchCode(targetAddress, 16, (code4) => {
    const writer = new ThumbWriter(code4, { pc: targetAddress });
    writer.putLdrRegAddress("pc", trampoline.or(1));
    writer.flush();
  });
}
function writeArtQuickCodePrologueArm64(target, trampoline, redirectSize) {
  Memory.patchCode(target, 16, (code4) => {
    const writer = new Arm64Writer(code4, { pc: target });
    if (redirectSize === 16) {
      writer.putLdrRegAddress("x16", trampoline);
    } else {
      writer.putAdrpRegAddress("x16", trampoline);
    }
    writer.putBrReg("x16");
    writer.flush();
  });
}
var artQuickCodeHookRedirectSize = {
  ia32: 5,
  x64: 16,
  arm: 8,
  arm64: 16
};
var ArtQuickCodeInterceptor = class {
  constructor(quickCode) {
    this.quickCode = quickCode;
    this.quickCodeAddress = Process.arch === "arm" ? quickCode.and(THUMB_BIT_REMOVAL_MASK) : quickCode;
    this.redirectSize = 0;
    this.trampoline = null;
    this.overwrittenPrologue = null;
    this.overwrittenPrologueLength = 0;
  }
  _canRelocateCode(relocationSize, constraints) {
    const Writer = thunkWriters[Process.arch];
    const Relocator = thunkRelocators[Process.arch];
    const { quickCodeAddress } = this;
    const writer = new Writer(quickCodeAddress);
    const relocator = new Relocator(quickCodeAddress, writer);
    let offset;
    if (Process.arch === "arm64") {
      let availableScratchRegs = /* @__PURE__ */ new Set(["x16", "x17"]);
      do {
        const nextOffset = relocator.readOne();
        const nextScratchRegs = new Set(availableScratchRegs);
        const { read: read2, written } = relocator.input.regsAccessed;
        for (const regs of [read2, written]) {
          for (const reg of regs) {
            let name;
            if (reg.startsWith("w")) {
              name = "x" + reg.substring(1);
            } else {
              name = reg;
            }
            nextScratchRegs.delete(name);
          }
        }
        if (nextScratchRegs.size === 0) {
          break;
        }
        offset = nextOffset;
        availableScratchRegs = nextScratchRegs;
      } while (offset < relocationSize && !relocator.eoi);
      constraints.availableScratchRegs = availableScratchRegs;
    } else {
      do {
        offset = relocator.readOne();
      } while (offset < relocationSize && !relocator.eoi);
    }
    return offset >= relocationSize;
  }
  _allocateTrampoline() {
    if (trampolineAllocator === null) {
      const trampolineSize = pointerSize6 === 4 ? 128 : 256;
      trampolineAllocator = makeAllocator(trampolineSize);
    }
    const maxRedirectSize = artQuickCodeHookRedirectSize[Process.arch];
    let redirectSize, spec;
    let alignment = 1;
    const constraints = {};
    if (pointerSize6 === 4 || this._canRelocateCode(maxRedirectSize, constraints)) {
      redirectSize = maxRedirectSize;
      spec = {};
    } else {
      let maxDistance;
      if (Process.arch === "x64") {
        redirectSize = 5;
        maxDistance = X86_JMP_MAX_DISTANCE;
      } else if (Process.arch === "arm64") {
        redirectSize = 8;
        maxDistance = ARM64_ADRP_MAX_DISTANCE;
        alignment = 4096;
      }
      spec = { near: this.quickCodeAddress, maxDistance };
    }
    this.redirectSize = redirectSize;
    this.trampoline = trampolineAllocator.allocateSlice(spec, alignment);
    return constraints;
  }
  _destroyTrampoline() {
    trampolineAllocator.freeSlice(this.trampoline);
  }
  activate(vm3) {
    const constraints = this._allocateTrampoline();
    const { trampoline, quickCode, redirectSize } = this;
    const writeTrampoline = artQuickCodeReplacementTrampolineWriters[Process.arch];
    const prologueLength = writeTrampoline(trampoline, quickCode, redirectSize, constraints, vm3);
    this.overwrittenPrologueLength = prologueLength;
    this.overwrittenPrologue = Memory.dup(this.quickCodeAddress, prologueLength);
    const writePrologue = artQuickCodePrologueWriters[Process.arch];
    writePrologue(quickCode, trampoline, redirectSize);
  }
  deactivate() {
    const { quickCodeAddress, overwrittenPrologueLength: prologueLength } = this;
    const Writer = thunkWriters[Process.arch];
    Memory.patchCode(quickCodeAddress, prologueLength, (code4) => {
      const writer = new Writer(code4, { pc: quickCodeAddress });
      const { overwrittenPrologue } = this;
      writer.putBytes(overwrittenPrologue.readByteArray(prologueLength));
      writer.flush();
    });
    this._destroyTrampoline();
  }
};
function isArtQuickEntrypoint(address) {
  const api3 = getApi();
  const { module: m2, artClassLinker } = api3;
  return address.equals(artClassLinker.quickGenericJniTrampoline) || address.equals(artClassLinker.quickToInterpreterBridgeTrampoline) || address.equals(artClassLinker.quickResolutionTrampoline) || address.equals(artClassLinker.quickImtConflictTrampoline) || address.compare(m2.base) >= 0 && address.compare(m2.base.add(m2.size)) < 0;
}
var ArtMethodMangler = class {
  constructor(opaqueMethodId) {
    const methodId = unwrapMethodId(opaqueMethodId);
    this.methodId = methodId;
    this.originalMethod = null;
    this.hookedMethodId = methodId;
    this.replacementMethodId = null;
    this.interceptor = null;
  }
  replace(impl2, isInstanceMethod, argTypes2, vm3, api3) {
    const { kAccCompileDontBother, artNterpEntryPoint } = api3;
    this.originalMethod = fetchArtMethod(this.methodId, vm3);
    const originalFlags = this.originalMethod.accessFlags;
    if ((originalFlags & kAccXposedHookedMethod) !== 0 && xposedIsSupported()) {
      const hookInfo = this.originalMethod.jniCode;
      this.hookedMethodId = hookInfo.add(2 * pointerSize6).readPointer();
      this.originalMethod = fetchArtMethod(this.hookedMethodId, vm3);
    }
    const { hookedMethodId } = this;
    const replacementMethodId = cloneArtMethod(hookedMethodId, vm3);
    this.replacementMethodId = replacementMethodId;
    patchArtMethod(replacementMethodId, {
      jniCode: impl2,
      accessFlags: (originalFlags & ~(kAccCriticalNative | kAccFastNative | kAccNterpEntryPointFastPathFlag) | kAccNative | kAccCompileDontBother) >>> 0,
      quickCode: api3.artClassLinker.quickGenericJniTrampoline,
      interpreterCode: api3.artInterpreterToCompiledCodeBridge
    }, vm3);
    let hookedMethodRemovedFlags = kAccFastInterpreterToInterpreterInvoke | kAccSingleImplementation | kAccNterpEntryPointFastPathFlag;
    if ((originalFlags & kAccNative) === 0) {
      hookedMethodRemovedFlags |= kAccSkipAccessChecks;
    }
    patchArtMethod(hookedMethodId, {
      accessFlags: (originalFlags & ~hookedMethodRemovedFlags | kAccCompileDontBother) >>> 0
    }, vm3);
    const quickCode = this.originalMethod.quickCode;
    if (artNterpEntryPoint !== null && quickCode.equals(artNterpEntryPoint)) {
      patchArtMethod(hookedMethodId, {
        quickCode: api3.artQuickToInterpreterBridge
      }, vm3);
    }
    if (!isArtQuickEntrypoint(quickCode)) {
      const interceptor = new ArtQuickCodeInterceptor(quickCode);
      interceptor.activate(vm3);
      this.interceptor = interceptor;
    }
    artController.replacedMethods.set(hookedMethodId, replacementMethodId);
    notifyArtMethodHooked(hookedMethodId, vm3);
  }
  revert(vm3) {
    const { hookedMethodId, interceptor } = this;
    patchArtMethod(hookedMethodId, this.originalMethod, vm3);
    artController.replacedMethods.delete(hookedMethodId);
    if (interceptor !== null) {
      interceptor.deactivate();
      this.interceptor = null;
    }
  }
  resolveTarget(wrapper, isInstanceMethod, env2, api3) {
    return this.hookedMethodId;
  }
};
function xposedIsSupported() {
  return getAndroidApiLevel() < 28;
}
function fetchArtMethod(methodId, vm3) {
  const artMethodSpec = getArtMethodSpec(vm3);
  const artMethodOffset = artMethodSpec.offset;
  return ["jniCode", "accessFlags", "quickCode", "interpreterCode"].reduce((original, name) => {
    const offset = artMethodOffset[name];
    if (offset === void 0) {
      return original;
    }
    const address = methodId.add(offset);
    const read2 = name === "accessFlags" ? readU32 : readPointer;
    original[name] = read2.call(address);
    return original;
  }, {});
}
function patchArtMethod(methodId, patches, vm3) {
  const artMethodSpec = getArtMethodSpec(vm3);
  const artMethodOffset = artMethodSpec.offset;
  Object.keys(patches).forEach((name) => {
    const offset = artMethodOffset[name];
    if (offset === void 0) {
      return;
    }
    const address = methodId.add(offset);
    const write3 = name === "accessFlags" ? writeU32 : writePointer;
    write3.call(address, patches[name]);
  });
}
var DalvikMethodMangler = class {
  constructor(methodId) {
    this.methodId = methodId;
    this.originalMethod = null;
  }
  replace(impl2, isInstanceMethod, argTypes2, vm3, api3) {
    const { methodId } = this;
    this.originalMethod = Memory.dup(methodId, DVM_METHOD_SIZE);
    let argsSize = argTypes2.reduce((acc, t) => acc + t.size, 0);
    if (isInstanceMethod) {
      argsSize++;
    }
    const accessFlags = (methodId.add(DVM_METHOD_OFFSET_ACCESS_FLAGS).readU32() | kAccNative) >>> 0;
    const registersSize = argsSize;
    const outsSize = 0;
    const insSize = argsSize;
    methodId.add(DVM_METHOD_OFFSET_ACCESS_FLAGS).writeU32(accessFlags);
    methodId.add(DVM_METHOD_OFFSET_REGISTERS_SIZE).writeU16(registersSize);
    methodId.add(DVM_METHOD_OFFSET_OUTS_SIZE).writeU16(outsSize);
    methodId.add(DVM_METHOD_OFFSET_INS_SIZE).writeU16(insSize);
    methodId.add(DVM_METHOD_OFFSET_JNI_ARG_INFO).writeU32(computeDalvikJniArgInfo(methodId));
    api3.dvmUseJNIBridge(methodId, impl2);
  }
  revert(vm3) {
    Memory.copy(this.methodId, this.originalMethod, DVM_METHOD_SIZE);
  }
  resolveTarget(wrapper, isInstanceMethod, env2, api3) {
    const thread = env2.handle.add(DVM_JNI_ENV_OFFSET_SELF).readPointer();
    let objectPtr;
    if (isInstanceMethod) {
      objectPtr = api3.dvmDecodeIndirectRef(thread, wrapper.$h);
    } else {
      const h = wrapper.$borrowClassHandle(env2);
      objectPtr = api3.dvmDecodeIndirectRef(thread, h.value);
      h.unref(env2);
    }
    let classObject;
    if (isInstanceMethod) {
      classObject = objectPtr.add(DVM_OBJECT_OFFSET_CLAZZ).readPointer();
    } else {
      classObject = objectPtr;
    }
    const classKey = classObject.toString(16);
    let entry = patchedClasses.get(classKey);
    if (entry === void 0) {
      const vtablePtr = classObject.add(DVM_CLASS_OBJECT_OFFSET_VTABLE);
      const vtableCountPtr = classObject.add(DVM_CLASS_OBJECT_OFFSET_VTABLE_COUNT);
      const vtable2 = vtablePtr.readPointer();
      const vtableCount = vtableCountPtr.readS32();
      const vtableSize = vtableCount * pointerSize6;
      const shadowVtable = Memory.alloc(2 * vtableSize);
      Memory.copy(shadowVtable, vtable2, vtableSize);
      vtablePtr.writePointer(shadowVtable);
      entry = {
        classObject,
        vtablePtr,
        vtableCountPtr,
        vtable: vtable2,
        vtableCount,
        shadowVtable,
        shadowVtableCount: vtableCount,
        targetMethods: /* @__PURE__ */ new Map()
      };
      patchedClasses.set(classKey, entry);
    }
    const methodKey = this.methodId.toString(16);
    let targetMethod = entry.targetMethods.get(methodKey);
    if (targetMethod === void 0) {
      targetMethod = Memory.dup(this.originalMethod, DVM_METHOD_SIZE);
      const methodIndex = entry.shadowVtableCount++;
      entry.shadowVtable.add(methodIndex * pointerSize6).writePointer(targetMethod);
      targetMethod.add(DVM_METHOD_OFFSET_METHOD_INDEX).writeU16(methodIndex);
      entry.vtableCountPtr.writeS32(entry.shadowVtableCount);
      entry.targetMethods.set(methodKey, targetMethod);
    }
    return targetMethod;
  }
};
function computeDalvikJniArgInfo(methodId) {
  if (Process.arch !== "ia32") {
    return DALVIK_JNI_NO_ARG_INFO;
  }
  const shorty = methodId.add(DVM_METHOD_OFFSET_SHORTY).readPointer().readCString();
  if (shorty === null || shorty.length === 0 || shorty.length > 65535) {
    return DALVIK_JNI_NO_ARG_INFO;
  }
  let returnType;
  switch (shorty[0]) {
    case "V":
      returnType = DALVIK_JNI_RETURN_VOID;
      break;
    case "F":
      returnType = DALVIK_JNI_RETURN_FLOAT;
      break;
    case "D":
      returnType = DALVIK_JNI_RETURN_DOUBLE;
      break;
    case "J":
      returnType = DALVIK_JNI_RETURN_S8;
      break;
    case "Z":
    case "B":
      returnType = DALVIK_JNI_RETURN_S1;
      break;
    case "C":
      returnType = DALVIK_JNI_RETURN_U2;
      break;
    case "S":
      returnType = DALVIK_JNI_RETURN_S2;
      break;
    default:
      returnType = DALVIK_JNI_RETURN_S4;
      break;
  }
  let hints = 0;
  for (let i = shorty.length - 1; i > 0; i--) {
    const ch = shorty[i];
    hints += ch === "D" || ch === "J" ? 2 : 1;
  }
  return returnType << DALVIK_JNI_RETURN_SHIFT | hints;
}
function cloneArtMethod(method2, vm3) {
  const api3 = getApi();
  if (getAndroidApiLevel() < 23) {
    const thread = api3["art::Thread::CurrentFromGdb"]();
    return api3["art::mirror::Object::Clone"](method2, thread);
  }
  return Memory.dup(method2, getArtMethodSpec(vm3).size);
}
function deoptimizeMethod(vm3, env2, method2) {
  requestDeoptimization(vm3, env2, kSelectiveDeoptimization, method2);
}
function deoptimizeEverything(vm3, env2) {
  requestDeoptimization(vm3, env2, kFullDeoptimization);
}
function deoptimizeBootImage(vm3, env2) {
  const api3 = getApi();
  if (getAndroidApiLevel() < 26) {
    throw new Error("This API is only available on Android >= 8.0");
  }
  withRunnableArtThread(vm3, env2, (thread) => {
    api3["art::Runtime::DeoptimizeBootImage"](api3.artRuntime);
  });
}
function requestDeoptimization(vm3, env2, kind, method2) {
  const api3 = getApi();
  if (getAndroidApiLevel() < 24) {
    throw new Error("This API is only available on Android >= 7.0");
  }
  withRunnableArtThread(vm3, env2, (thread) => {
    if (getAndroidApiLevel() < 30) {
      if (!api3.isJdwpStarted()) {
        const session = startJdwp(api3);
        jdwpSessions.push(session);
      }
      if (!api3.isDebuggerActive()) {
        api3["art::Dbg::GoActive"]();
      }
      const request = Memory.alloc(8 + pointerSize6);
      request.writeU32(kind);
      switch (kind) {
        case kFullDeoptimization:
          break;
        case kSelectiveDeoptimization:
          request.add(8).writePointer(method2);
          break;
        default:
          throw new Error("Unsupported deoptimization kind");
      }
      api3["art::Dbg::RequestDeoptimization"](request);
      api3["art::Dbg::ManageDeoptimization"]();
    } else {
      const instrumentation = api3.artInstrumentation;
      if (instrumentation === null) {
        throw new Error("Unable to find Instrumentation class in ART; please file a bug");
      }
      const enableDeopt = api3["art::Instrumentation::EnableDeoptimization"];
      if (enableDeopt !== void 0) {
        const deoptimizationEnabled = !!instrumentation.add(getArtInstrumentationSpec().offset.deoptimizationEnabled).readU8();
        if (!deoptimizationEnabled) {
          enableDeopt(instrumentation);
        }
      }
      switch (kind) {
        case kFullDeoptimization:
          api3["art::Instrumentation::DeoptimizeEverything"](instrumentation, Memory.allocUtf8String("frida"));
          break;
        case kSelectiveDeoptimization:
          api3["art::Instrumentation::Deoptimize"](instrumentation, method2);
          break;
        default:
          throw new Error("Unsupported deoptimization kind");
      }
    }
  });
}
var JdwpSession = class {
  constructor() {
    const libart = Process.getModuleByName("libart.so");
    const acceptImpl = libart.getExportByName("_ZN3art4JDWP12JdwpAdbState6AcceptEv");
    const receiveClientFdImpl = libart.getExportByName("_ZN3art4JDWP12JdwpAdbState15ReceiveClientFdEv");
    const controlPair = makeSocketPair();
    const clientPair = makeSocketPair();
    this._controlFd = controlPair[0];
    this._clientFd = clientPair[0];
    let acceptListener = null;
    acceptListener = Interceptor.attach(acceptImpl, function(args) {
      const state = args[0];
      const controlSockPtr = Memory.scanSync(state.add(8252), 256, "00 ff ff ff ff 00")[0].address.add(1);
      controlSockPtr.writeS32(controlPair[1]);
      acceptListener.detach();
    });
    Interceptor.replace(receiveClientFdImpl, new NativeCallback(function(state) {
      Interceptor.revert(receiveClientFdImpl);
      return clientPair[1];
    }, "int", ["pointer"]));
    Interceptor.flush();
    this._handshakeRequest = this._performHandshake();
  }
  async _performHandshake() {
    const input = new UnixInputStream(this._clientFd, { autoClose: false });
    const output = new UnixOutputStream(this._clientFd, { autoClose: false });
    const handshakePacket = [74, 68, 87, 80, 45, 72, 97, 110, 100, 115, 104, 97, 107, 101];
    try {
      await output.writeAll(handshakePacket);
      await input.readAll(handshakePacket.length);
    } catch (e) {
    }
  }
};
function startJdwp(api3) {
  const session = new JdwpSession();
  api3["art::Dbg::SetJdwpAllowed"](1);
  const options = makeJdwpOptions();
  api3["art::Dbg::ConfigureJdwp"](options);
  const startDebugger = api3["art::InternalDebuggerControlCallback::StartDebugger"];
  if (startDebugger !== void 0) {
    startDebugger(NULL);
  } else {
    api3["art::Dbg::StartJdwp"]();
  }
  return session;
}
function makeJdwpOptions() {
  const kJdwpTransportAndroidAdb = getAndroidApiLevel() < 28 ? 2 : 3;
  const kJdwpPortFirstAvailable = 0;
  const transport = kJdwpTransportAndroidAdb;
  const server = true;
  const suspend = false;
  const port = kJdwpPortFirstAvailable;
  const size = 8 + STD_STRING_SIZE + 2;
  const result = Memory.alloc(size);
  result.writeU32(transport).add(4).writeU8(server ? 1 : 0).add(1).writeU8(suspend ? 1 : 0).add(1).add(STD_STRING_SIZE).writeU16(port);
  return result;
}
function makeSocketPair() {
  if (socketpair === null) {
    socketpair = new NativeFunction(
      Process.getModuleByName("libc.so").getExportByName("socketpair"),
      "int",
      ["int", "int", "int", "pointer"]
    );
  }
  const buf = Memory.alloc(8);
  if (socketpair(AF_UNIX, SOCK_STREAM, 0, buf) === -1) {
    throw new Error("Unable to create socketpair for JDWP");
  }
  return [
    buf.readS32(),
    buf.add(4).readS32()
  ];
}
function makeAddGlobalRefFallbackForAndroid5(api3) {
  const offset = getArtVMSpec().offset;
  const lock = api3.vm.add(offset.globalsLock);
  const table = api3.vm.add(offset.globals);
  const add = api3["art::IndirectReferenceTable::Add"];
  const acquire = api3["art::ReaderWriterMutex::ExclusiveLock"];
  const release = api3["art::ReaderWriterMutex::ExclusiveUnlock"];
  const IRT_FIRST_SEGMENT = 0;
  return function(vm3, thread, obj) {
    acquire(lock, thread);
    try {
      return add(table, IRT_FIRST_SEGMENT, obj);
    } finally {
      release(lock, thread);
    }
  };
}
function makeDecodeGlobalFallback(api3) {
  const decode = api3["art::Thread::DecodeJObject"];
  if (decode === void 0) {
    throw new Error("art::Thread::DecodeJObject is not available; please file a bug");
  }
  return function(vm3, thread, ref) {
    return decode(thread, ref);
  };
}
var threadStateTransitionRecompilers = {
  ia32: recompileExceptionClearForX86,
  x64: recompileExceptionClearForX86,
  arm: recompileExceptionClearForArm,
  arm64: recompileExceptionClearForArm64
};
function makeArtThreadStateTransitionImpl(vm3, env2, callback) {
  const api3 = getApi();
  const envVtable = env2.handle.readPointer();
  let exceptionClearImpl;
  const innerExceptionClearImpl = api3.find("_ZN3art3JNIILb1EE14ExceptionClearEP7_JNIEnv");
  if (innerExceptionClearImpl !== null) {
    exceptionClearImpl = innerExceptionClearImpl;
  } else {
    exceptionClearImpl = envVtable.add(ENV_VTABLE_OFFSET_EXCEPTION_CLEAR).readPointer();
  }
  let nextFuncImpl;
  const innerNextFuncImpl = api3.find("_ZN3art3JNIILb1EE10FatalErrorEP7_JNIEnvPKc");
  if (innerNextFuncImpl !== null) {
    nextFuncImpl = innerNextFuncImpl;
  } else {
    nextFuncImpl = envVtable.add(ENV_VTABLE_OFFSET_FATAL_ERROR).readPointer();
  }
  const recompile = threadStateTransitionRecompilers[Process.arch];
  if (recompile === void 0) {
    throw new Error("Not yet implemented for " + Process.arch);
  }
  let perform = null;
  const threadOffsets = getArtThreadSpec(vm3).offset;
  const exceptionOffset = threadOffsets.exception;
  const neuteredOffsets = /* @__PURE__ */ new Set();
  const isReportedOffset = threadOffsets.isExceptionReportedToInstrumentation;
  if (isReportedOffset !== null) {
    neuteredOffsets.add(isReportedOffset);
  }
  const throwLocationStartOffset = threadOffsets.throwLocation;
  if (throwLocationStartOffset !== null) {
    neuteredOffsets.add(throwLocationStartOffset);
    neuteredOffsets.add(throwLocationStartOffset + pointerSize6);
    neuteredOffsets.add(throwLocationStartOffset + 2 * pointerSize6);
  }
  const codeSize = 65536;
  const code4 = Memory.alloc(codeSize);
  Memory.patchCode(code4, codeSize, (buffer) => {
    perform = recompile(buffer, code4, exceptionClearImpl, nextFuncImpl, exceptionOffset, neuteredOffsets, callback);
  });
  perform._code = code4;
  perform._callback = callback;
  return perform;
}
function recompileExceptionClearForX86(buffer, pc, exceptionClearImpl, nextFuncImpl, exceptionOffset, neuteredOffsets, callback) {
  const blocks = {};
  const branchTargets = /* @__PURE__ */ new Set();
  const pending = [exceptionClearImpl];
  while (pending.length > 0) {
    let current = pending.shift();
    const alreadyCovered = Object.values(blocks).some(({ begin, end }) => current.compare(begin) >= 0 && current.compare(end) < 0);
    if (alreadyCovered) {
      continue;
    }
    const blockAddressKey = current.toString();
    let block2 = {
      begin: current
    };
    let lastInsn = null;
    let reachedEndOfBlock = false;
    do {
      if (current.equals(nextFuncImpl)) {
        reachedEndOfBlock = true;
        break;
      }
      const insn = Instruction.parse(current);
      lastInsn = insn;
      const existingBlock = blocks[insn.address.toString()];
      if (existingBlock !== void 0) {
        delete blocks[existingBlock.begin.toString()];
        blocks[blockAddressKey] = existingBlock;
        existingBlock.begin = block2.begin;
        block2 = null;
        break;
      }
      let branchTarget = null;
      switch (insn.mnemonic) {
        case "jmp":
          branchTarget = ptr(insn.operands[0].value);
          reachedEndOfBlock = true;
          break;
        case "je":
        case "jg":
        case "jle":
        case "jne":
        case "js":
          branchTarget = ptr(insn.operands[0].value);
          break;
        case "ret":
          reachedEndOfBlock = true;
          break;
      }
      if (branchTarget !== null) {
        branchTargets.add(branchTarget.toString());
        pending.push(branchTarget);
        pending.sort((a, b) => a.compare(b));
      }
      current = insn.next;
    } while (!reachedEndOfBlock);
    if (block2 !== null) {
      block2.end = lastInsn.address.add(lastInsn.size);
      blocks[blockAddressKey] = block2;
    }
  }
  const blocksOrdered = Object.keys(blocks).map((key) => blocks[key]);
  blocksOrdered.sort((a, b) => a.begin.compare(b.begin));
  const entryBlock = blocks[exceptionClearImpl.toString()];
  blocksOrdered.splice(blocksOrdered.indexOf(entryBlock), 1);
  blocksOrdered.unshift(entryBlock);
  const writer = new X86Writer(buffer, { pc });
  let foundCore = false;
  let threadReg = null;
  blocksOrdered.forEach((block2) => {
    const size = block2.end.sub(block2.begin).toInt32();
    const relocator = new X86Relocator(block2.begin, writer);
    let offset;
    while ((offset = relocator.readOne()) !== 0) {
      const insn = relocator.input;
      const { mnemonic } = insn;
      const insnAddressId = insn.address.toString();
      if (branchTargets.has(insnAddressId)) {
        writer.putLabel(insnAddressId);
      }
      let keep = true;
      switch (mnemonic) {
        case "jmp":
          writer.putJmpNearLabel(branchLabelFromOperand(insn.operands[0]));
          keep = false;
          break;
        case "je":
        case "jg":
        case "jle":
        case "jne":
        case "js":
          writer.putJccNearLabel(mnemonic, branchLabelFromOperand(insn.operands[0]), "no-hint");
          keep = false;
          break;
        /*
         * JNI::ExceptionClear(), when checked JNI is off.
         */
        case "mov": {
          const [dst, src] = insn.operands;
          if (dst.type === "mem" && src.type === "imm") {
            const dstValue = dst.value;
            const dstOffset = dstValue.disp;
            if (dstOffset === exceptionOffset && src.value.valueOf() === 0) {
              threadReg = dstValue.base;
              writer.putPushfx();
              writer.putPushax();
              writer.putMovRegReg("xbp", "xsp");
              if (pointerSize6 === 4) {
                writer.putAndRegU32("esp", 4294967280);
              } else {
                const scratchReg = threadReg !== "rdi" ? "rdi" : "rsi";
                writer.putMovRegU64(scratchReg, uint64("0xfffffffffffffff0"));
                writer.putAndRegReg("rsp", scratchReg);
              }
              writer.putCallAddressWithAlignedArguments(callback, [threadReg]);
              writer.putMovRegReg("xsp", "xbp");
              writer.putPopax();
              writer.putPopfx();
              foundCore = true;
              keep = false;
            } else if (neuteredOffsets.has(dstOffset) && dstValue.base === threadReg) {
              keep = false;
            }
          }
          break;
        }
        /*
         * CheckJNI::ExceptionClear, when checked JNI is on. Wrapper that calls JNI::ExceptionClear().
         */
        case "call": {
          const target = insn.operands[0];
          if (target.type === "mem" && target.value.disp === ENV_VTABLE_OFFSET_EXCEPTION_CLEAR) {
            if (pointerSize6 === 4) {
              writer.putPopReg("eax");
              writer.putMovRegRegOffsetPtr("eax", "eax", 4);
              writer.putPushReg("eax");
            } else {
              writer.putMovRegRegOffsetPtr("rdi", "rdi", 8);
            }
            writer.putCallAddressWithArguments(callback, []);
            foundCore = true;
            keep = false;
          }
          break;
        }
      }
      if (keep) {
        relocator.writeAll();
      } else {
        relocator.skipOne();
      }
      if (offset === size) {
        break;
      }
    }
    relocator.dispose();
  });
  writer.dispose();
  if (!foundCore) {
    throwThreadStateTransitionParseError();
  }
  return new NativeFunction(pc, "void", ["pointer"], nativeFunctionOptions3);
}
function recompileExceptionClearForArm(buffer, pc, exceptionClearImpl, nextFuncImpl, exceptionOffset, neuteredOffsets, callback) {
  const blocks = {};
  const branchTargets = /* @__PURE__ */ new Set();
  const thumbBitRemovalMask = ptr(1).not();
  const pending = [exceptionClearImpl];
  while (pending.length > 0) {
    let current = pending.shift();
    const alreadyCovered = Object.values(blocks).some(({ begin: begin2, end }) => current.compare(begin2) >= 0 && current.compare(end) < 0);
    if (alreadyCovered) {
      continue;
    }
    const begin = current.and(thumbBitRemovalMask);
    const blockId = begin.toString();
    const thumbBit = current.and(1);
    let block2 = {
      begin
    };
    let lastInsn = null;
    let reachedEndOfBlock = false;
    let ifThenBlockRemaining = 0;
    do {
      if (current.equals(nextFuncImpl)) {
        reachedEndOfBlock = true;
        break;
      }
      const insn = Instruction.parse(current);
      const { mnemonic } = insn;
      lastInsn = insn;
      const currentAddress = current.and(thumbBitRemovalMask);
      const insnId = currentAddress.toString();
      const existingBlock = blocks[insnId];
      if (existingBlock !== void 0) {
        delete blocks[existingBlock.begin.toString()];
        blocks[blockId] = existingBlock;
        existingBlock.begin = block2.begin;
        block2 = null;
        break;
      }
      const isOutsideIfThenBlock = ifThenBlockRemaining === 0;
      let branchTarget = null;
      switch (mnemonic) {
        case "b":
          branchTarget = ptr(insn.operands[0].value);
          reachedEndOfBlock = isOutsideIfThenBlock;
          break;
        case "beq.w":
        case "beq":
        case "bne":
        case "bne.w":
        case "bgt":
          branchTarget = ptr(insn.operands[0].value);
          break;
        case "cbz":
        case "cbnz":
          branchTarget = ptr(insn.operands[1].value);
          break;
        case "pop.w":
          if (isOutsideIfThenBlock) {
            reachedEndOfBlock = insn.operands.filter((op) => op.value === "pc").length === 1;
          }
          break;
      }
      switch (mnemonic) {
        case "it":
          ifThenBlockRemaining = 1;
          break;
        case "itt":
          ifThenBlockRemaining = 2;
          break;
        case "ittt":
          ifThenBlockRemaining = 3;
          break;
        case "itttt":
          ifThenBlockRemaining = 4;
          break;
        default:
          if (ifThenBlockRemaining > 0) {
            ifThenBlockRemaining--;
          }
          break;
      }
      if (branchTarget !== null) {
        branchTargets.add(branchTarget.toString());
        pending.push(branchTarget.or(thumbBit));
        pending.sort((a, b) => a.compare(b));
      }
      current = insn.next;
    } while (!reachedEndOfBlock);
    if (block2 !== null) {
      block2.end = lastInsn.address.add(lastInsn.size);
      blocks[blockId] = block2;
    }
  }
  const blocksOrdered = Object.keys(blocks).map((key) => blocks[key]);
  blocksOrdered.sort((a, b) => a.begin.compare(b.begin));
  const entryBlock = blocks[exceptionClearImpl.and(thumbBitRemovalMask).toString()];
  blocksOrdered.splice(blocksOrdered.indexOf(entryBlock), 1);
  blocksOrdered.unshift(entryBlock);
  const writer = new ThumbWriter(buffer, { pc });
  let foundCore = false;
  let threadReg = null;
  let realImplReg = null;
  blocksOrdered.forEach((block2) => {
    const relocator = new ThumbRelocator(block2.begin, writer);
    let address = block2.begin;
    const end = block2.end;
    let size = 0;
    do {
      const offset = relocator.readOne();
      if (offset === 0) {
        throw new Error("Unexpected end of block");
      }
      const insn = relocator.input;
      address = insn.address;
      size = insn.size;
      const { mnemonic } = insn;
      const insnAddressId = address.toString();
      if (branchTargets.has(insnAddressId)) {
        writer.putLabel(insnAddressId);
      }
      let keep = true;
      switch (mnemonic) {
        case "b":
          writer.putBLabel(branchLabelFromOperand(insn.operands[0]));
          keep = false;
          break;
        case "beq.w":
          writer.putBCondLabelWide("eq", branchLabelFromOperand(insn.operands[0]));
          keep = false;
          break;
        case "bne.w":
          writer.putBCondLabelWide("ne", branchLabelFromOperand(insn.operands[0]));
          keep = false;
          break;
        case "beq":
        case "bne":
        case "bgt":
          writer.putBCondLabelWide(mnemonic.substr(1), branchLabelFromOperand(insn.operands[0]));
          keep = false;
          break;
        case "cbz": {
          const ops = insn.operands;
          writer.putCbzRegLabel(ops[0].value, branchLabelFromOperand(ops[1]));
          keep = false;
          break;
        }
        case "cbnz": {
          const ops = insn.operands;
          writer.putCbnzRegLabel(ops[0].value, branchLabelFromOperand(ops[1]));
          keep = false;
          break;
        }
        /*
         * JNI::ExceptionClear(), when checked JNI is off.
         */
        case "str":
        case "str.w": {
          const dstValue = insn.operands[1].value;
          const dstOffset = dstValue.disp;
          if (dstOffset === exceptionOffset) {
            threadReg = dstValue.base;
            const nzcvqReg = threadReg !== "r4" ? "r4" : "r5";
            const clobberedRegs = ["r0", "r1", "r2", "r3", nzcvqReg, "r9", "r12", "lr"];
            writer.putPushRegs(clobberedRegs);
            writer.putMrsRegReg(nzcvqReg, "apsr-nzcvq");
            writer.putCallAddressWithArguments(callback, [threadReg]);
            writer.putMsrRegReg("apsr-nzcvq", nzcvqReg);
            writer.putPopRegs(clobberedRegs);
            foundCore = true;
            keep = false;
          } else if (neuteredOffsets.has(dstOffset) && dstValue.base === threadReg) {
            keep = false;
          }
          break;
        }
        /*
         * CheckJNI::ExceptionClear, when checked JNI is on. Wrapper that calls JNI::ExceptionClear().
         */
        case "ldr": {
          const [dstOp, srcOp] = insn.operands;
          if (srcOp.type === "mem") {
            const src = srcOp.value;
            if (src.base[0] === "r" && src.disp === ENV_VTABLE_OFFSET_EXCEPTION_CLEAR) {
              realImplReg = dstOp.value;
            }
          }
          break;
        }
        case "blx":
          if (insn.operands[0].value === realImplReg) {
            writer.putLdrRegRegOffset("r0", "r0", 4);
            writer.putCallAddressWithArguments(callback, ["r0"]);
            foundCore = true;
            realImplReg = null;
            keep = false;
          }
          break;
      }
      if (keep) {
        relocator.writeAll();
      } else {
        relocator.skipOne();
      }
    } while (!address.add(size).equals(end));
    relocator.dispose();
  });
  writer.dispose();
  if (!foundCore) {
    throwThreadStateTransitionParseError();
  }
  return new NativeFunction(pc.or(1), "void", ["pointer"], nativeFunctionOptions3);
}
function recompileExceptionClearForArm64(buffer, pc, exceptionClearImpl, nextFuncImpl, exceptionOffset, neuteredOffsets, callback) {
  const blocks = {};
  const branchTargets = /* @__PURE__ */ new Set();
  const pending = [exceptionClearImpl];
  while (pending.length > 0) {
    let current = pending.shift();
    const alreadyCovered = Object.values(blocks).some(({ begin, end }) => current.compare(begin) >= 0 && current.compare(end) < 0);
    if (alreadyCovered) {
      continue;
    }
    const blockAddressKey = current.toString();
    let block2 = {
      begin: current
    };
    let lastInsn = null;
    let reachedEndOfBlock = false;
    do {
      if (current.equals(nextFuncImpl)) {
        reachedEndOfBlock = true;
        break;
      }
      let insn;
      try {
        insn = Instruction.parse(current);
      } catch (e) {
        if (current.readU32() === 0) {
          reachedEndOfBlock = true;
          break;
        } else {
          throw e;
        }
      }
      lastInsn = insn;
      const existingBlock = blocks[insn.address.toString()];
      if (existingBlock !== void 0) {
        delete blocks[existingBlock.begin.toString()];
        blocks[blockAddressKey] = existingBlock;
        existingBlock.begin = block2.begin;
        block2 = null;
        break;
      }
      let branchTarget = null;
      switch (insn.mnemonic) {
        case "b":
          branchTarget = ptr(insn.operands[0].value);
          reachedEndOfBlock = true;
          break;
        case "b.eq":
        case "b.ne":
        case "b.le":
        case "b.gt":
          branchTarget = ptr(insn.operands[0].value);
          break;
        case "cbz":
        case "cbnz":
          branchTarget = ptr(insn.operands[1].value);
          break;
        case "tbz":
        case "tbnz":
          branchTarget = ptr(insn.operands[2].value);
          break;
        case "ret":
          reachedEndOfBlock = true;
          break;
      }
      if (branchTarget !== null) {
        branchTargets.add(branchTarget.toString());
        pending.push(branchTarget);
        pending.sort((a, b) => a.compare(b));
      }
      current = insn.next;
    } while (!reachedEndOfBlock);
    if (block2 !== null) {
      block2.end = lastInsn.address.add(lastInsn.size);
      blocks[blockAddressKey] = block2;
    }
  }
  const blocksOrdered = Object.keys(blocks).map((key) => blocks[key]);
  blocksOrdered.sort((a, b) => a.begin.compare(b.begin));
  const entryBlock = blocks[exceptionClearImpl.toString()];
  blocksOrdered.splice(blocksOrdered.indexOf(entryBlock), 1);
  blocksOrdered.unshift(entryBlock);
  const writer = new Arm64Writer(buffer, { pc });
  writer.putBLabel("performTransition");
  const invokeCallback = pc.add(writer.offset);
  writer.putPushAllXRegisters();
  writer.putCallAddressWithArguments(callback, ["x0"]);
  writer.putPopAllXRegisters();
  writer.putRet();
  writer.putLabel("performTransition");
  let foundCore = false;
  let threadReg = null;
  let realImplReg = null;
  blocksOrdered.forEach((block2) => {
    const size = block2.end.sub(block2.begin).toInt32();
    const relocator = new Arm64Relocator(block2.begin, writer);
    let offset;
    while ((offset = relocator.readOne()) !== 0) {
      const insn = relocator.input;
      const { mnemonic } = insn;
      const insnAddressId = insn.address.toString();
      if (branchTargets.has(insnAddressId)) {
        writer.putLabel(insnAddressId);
      }
      let keep = true;
      switch (mnemonic) {
        case "b":
          writer.putBLabel(branchLabelFromOperand(insn.operands[0]));
          keep = false;
          break;
        case "b.eq":
        case "b.ne":
        case "b.le":
        case "b.gt":
          writer.putBCondLabel(mnemonic.substr(2), branchLabelFromOperand(insn.operands[0]));
          keep = false;
          break;
        case "cbz": {
          const ops = insn.operands;
          writer.putCbzRegLabel(ops[0].value, branchLabelFromOperand(ops[1]));
          keep = false;
          break;
        }
        case "cbnz": {
          const ops = insn.operands;
          writer.putCbnzRegLabel(ops[0].value, branchLabelFromOperand(ops[1]));
          keep = false;
          break;
        }
        case "tbz": {
          const ops = insn.operands;
          writer.putTbzRegImmLabel(ops[0].value, ops[1].value.valueOf(), branchLabelFromOperand(ops[2]));
          keep = false;
          break;
        }
        case "tbnz": {
          const ops = insn.operands;
          writer.putTbnzRegImmLabel(ops[0].value, ops[1].value.valueOf(), branchLabelFromOperand(ops[2]));
          keep = false;
          break;
        }
        /*
         * JNI::ExceptionClear(), when checked JNI is off.
         */
        case "str": {
          const ops = insn.operands;
          const srcReg = ops[0].value;
          const dstValue = ops[1].value;
          const dstOffset = dstValue.disp;
          if (srcReg === "xzr" && dstOffset === exceptionOffset) {
            threadReg = dstValue.base;
            writer.putPushRegReg("x0", "lr");
            writer.putMovRegReg("x0", threadReg);
            writer.putBlImm(invokeCallback);
            writer.putPopRegReg("x0", "lr");
            foundCore = true;
            keep = false;
          } else if (neuteredOffsets.has(dstOffset) && dstValue.base === threadReg) {
            keep = false;
          }
          break;
        }
        /*
         * CheckJNI::ExceptionClear, when checked JNI is on. Wrapper that calls JNI::ExceptionClear().
         */
        case "ldr": {
          const ops = insn.operands;
          const src = ops[1].value;
          if (src.base[0] === "x" && src.disp === ENV_VTABLE_OFFSET_EXCEPTION_CLEAR) {
            realImplReg = ops[0].value;
          }
          break;
        }
        case "blr":
          if (insn.operands[0].value === realImplReg) {
            writer.putLdrRegRegOffset("x0", "x0", 8);
            writer.putCallAddressWithArguments(callback, ["x0"]);
            foundCore = true;
            realImplReg = null;
            keep = false;
          }
          break;
      }
      if (keep) {
        relocator.writeAll();
      } else {
        relocator.skipOne();
      }
      if (offset === size) {
        break;
      }
    }
    relocator.dispose();
  });
  writer.dispose();
  if (!foundCore) {
    throwThreadStateTransitionParseError();
  }
  return new NativeFunction(pc, "void", ["pointer"], nativeFunctionOptions3);
}
function throwThreadStateTransitionParseError() {
  throw new Error("Unable to parse ART internals; please file a bug");
}
function fixupArtQuickDeliverExceptionBug(api3) {
  const prettyMethod = api3["art::ArtMethod::PrettyMethod"];
  if (prettyMethod === void 0) {
    return;
  }
  Interceptor.attach(prettyMethod.impl, artController.hooks.ArtMethod.prettyMethod);
  Interceptor.flush();
}
function branchLabelFromOperand(op) {
  return ptr(op.value).toString();
}
function makeCxxMethodWrapperReturningPointerByValueGeneric(address, argTypes2) {
  return new NativeFunction(address, "pointer", argTypes2, nativeFunctionOptions3);
}
function makeCxxMethodWrapperReturningPointerByValueInFirstArg(address, argTypes2) {
  const impl2 = new NativeFunction(address, "void", ["pointer"].concat(argTypes2), nativeFunctionOptions3);
  return function() {
    const resultPtr = Memory.alloc(pointerSize6);
    impl2(resultPtr, ...arguments);
    return resultPtr.readPointer();
  };
}
function makeCxxMethodWrapperReturningStdStringByValue(impl2, argTypes2) {
  const { arch } = Process;
  switch (arch) {
    case "ia32":
    case "arm64": {
      let thunk;
      if (arch === "ia32") {
        thunk = makeThunk(64, (writer) => {
          const argCount = 1 + argTypes2.length;
          const argvSize = argCount * 4;
          writer.putSubRegImm("esp", argvSize);
          for (let i = 0; i !== argCount; i++) {
            const offset = i * 4;
            writer.putMovRegRegOffsetPtr("eax", "esp", argvSize + 4 + offset);
            writer.putMovRegOffsetPtrReg("esp", offset, "eax");
          }
          writer.putCallAddress(impl2);
          writer.putAddRegImm("esp", argvSize - 4);
          writer.putRet();
        });
      } else {
        thunk = makeThunk(32, (writer) => {
          writer.putMovRegReg("x8", "x0");
          argTypes2.forEach((t, i) => {
            writer.putMovRegReg("x" + i, "x" + (i + 1));
          });
          writer.putLdrRegAddress("x7", impl2);
          writer.putBrReg("x7");
        });
      }
      const invokeThunk = new NativeFunction(thunk, "void", ["pointer"].concat(argTypes2), nativeFunctionOptions3);
      const wrapper = function(...args) {
        invokeThunk(...args);
      };
      wrapper.handle = thunk;
      wrapper.impl = impl2;
      return wrapper;
    }
    default: {
      const result = new NativeFunction(impl2, "void", ["pointer"].concat(argTypes2), nativeFunctionOptions3);
      result.impl = impl2;
      return result;
    }
  }
}
var StdString = class {
  constructor() {
    this.handle = Memory.alloc(STD_STRING_SIZE);
  }
  dispose() {
    const [data, isTiny] = this._getData();
    if (!isTiny) {
      getApi().$delete(data);
    }
  }
  disposeToString() {
    const result = this.toString();
    this.dispose();
    return result;
  }
  toString() {
    const [data] = this._getData();
    return data.readUtf8String();
  }
  _getData() {
    const str = this.handle;
    const isTiny = (str.readU8() & 1) === 0;
    const data = isTiny ? str.add(1) : str.add(2 * pointerSize6).readPointer();
    return [data, isTiny];
  }
};
var StdVector = class {
  $delete() {
    this.dispose();
    getApi().$delete(this);
  }
  constructor(storage, elementSize) {
    this.handle = storage;
    this._begin = storage;
    this._end = storage.add(pointerSize6);
    this._storage = storage.add(2 * pointerSize6);
    this._elementSize = elementSize;
  }
  init() {
    this.begin = NULL;
    this.end = NULL;
    this.storage = NULL;
  }
  dispose() {
    getApi().$delete(this.begin);
  }
  get begin() {
    return this._begin.readPointer();
  }
  set begin(value) {
    this._begin.writePointer(value);
  }
  get end() {
    return this._end.readPointer();
  }
  set end(value) {
    this._end.writePointer(value);
  }
  get storage() {
    return this._storage.readPointer();
  }
  set storage(value) {
    this._storage.writePointer(value);
  }
  get size() {
    return this.end.sub(this.begin).toInt32() / this._elementSize;
  }
};
var HandleVector = class _HandleVector extends StdVector {
  static $new() {
    const vector = new _HandleVector(getApi().$new(STD_VECTOR_SIZE));
    vector.init();
    return vector;
  }
  constructor(storage) {
    super(storage, pointerSize6);
  }
  get handles() {
    const result = [];
    let cur = this.begin;
    const end = this.end;
    while (!cur.equals(end)) {
      result.push(cur.readPointer());
      cur = cur.add(pointerSize6);
    }
    return result;
  }
};
var BHS_OFFSET_LINK = 0;
var BHS_OFFSET_NUM_REFS = pointerSize6;
var BHS_SIZE = BHS_OFFSET_NUM_REFS + 4;
var kNumReferencesVariableSized = -1;
var BaseHandleScope = class _BaseHandleScope {
  $delete() {
    this.dispose();
    getApi().$delete(this);
  }
  constructor(storage) {
    this.handle = storage;
    this._link = storage.add(BHS_OFFSET_LINK);
    this._numberOfReferences = storage.add(BHS_OFFSET_NUM_REFS);
  }
  init(link, numberOfReferences) {
    this.link = link;
    this.numberOfReferences = numberOfReferences;
  }
  dispose() {
  }
  get link() {
    return new _BaseHandleScope(this._link.readPointer());
  }
  set link(value) {
    this._link.writePointer(value);
  }
  get numberOfReferences() {
    return this._numberOfReferences.readS32();
  }
  set numberOfReferences(value) {
    this._numberOfReferences.writeS32(value);
  }
};
var VSHS_OFFSET_SELF = alignPointerOffset(BHS_SIZE);
var VSHS_OFFSET_CURRENT_SCOPE = VSHS_OFFSET_SELF + pointerSize6;
var VSHS_SIZE = VSHS_OFFSET_CURRENT_SCOPE + pointerSize6;
var VariableSizedHandleScope = class _VariableSizedHandleScope extends BaseHandleScope {
  static $new(thread, vm3) {
    const scope = new _VariableSizedHandleScope(getApi().$new(VSHS_SIZE));
    scope.init(thread, vm3);
    return scope;
  }
  constructor(storage) {
    super(storage);
    this._self = storage.add(VSHS_OFFSET_SELF);
    this._currentScope = storage.add(VSHS_OFFSET_CURRENT_SCOPE);
    const kLocalScopeSize = 64;
    const kSizeOfReferencesPerScope = kLocalScopeSize - pointerSize6 - 4 - 4;
    const kNumReferencesPerScope = kSizeOfReferencesPerScope / 4;
    this._scopeLayout = FixedSizeHandleScope.layoutForCapacity(kNumReferencesPerScope);
    this._topHandleScopePtr = null;
  }
  init(thread, vm3) {
    const topHandleScopePtr = thread.add(getArtThreadSpec(vm3).offset.topHandleScope);
    this._topHandleScopePtr = topHandleScopePtr;
    super.init(topHandleScopePtr.readPointer(), kNumReferencesVariableSized);
    this.self = thread;
    this.currentScope = FixedSizeHandleScope.$new(this._scopeLayout);
    topHandleScopePtr.writePointer(this);
  }
  dispose() {
    this._topHandleScopePtr.writePointer(this.link);
    let scope;
    while ((scope = this.currentScope) !== null) {
      const next = scope.link;
      scope.$delete();
      this.currentScope = next;
    }
  }
  get self() {
    return this._self.readPointer();
  }
  set self(value) {
    this._self.writePointer(value);
  }
  get currentScope() {
    const storage = this._currentScope.readPointer();
    if (storage.isNull()) {
      return null;
    }
    return new FixedSizeHandleScope(storage, this._scopeLayout);
  }
  set currentScope(value) {
    this._currentScope.writePointer(value);
  }
  newHandle(object) {
    return this.currentScope.newHandle(object);
  }
};
var FixedSizeHandleScope = class _FixedSizeHandleScope extends BaseHandleScope {
  static $new(layout) {
    const scope = new _FixedSizeHandleScope(getApi().$new(layout.size), layout);
    scope.init();
    return scope;
  }
  constructor(storage, layout) {
    super(storage);
    const { offset } = layout;
    this._refsStorage = storage.add(offset.refsStorage);
    this._pos = storage.add(offset.pos);
    this._layout = layout;
  }
  init() {
    super.init(NULL, this._layout.numberOfReferences);
    this.pos = 0;
  }
  get pos() {
    return this._pos.readU32();
  }
  set pos(value) {
    this._pos.writeU32(value);
  }
  newHandle(object) {
    const pos = this.pos;
    const handle2 = this._refsStorage.add(pos * 4);
    handle2.writeS32(object.toInt32());
    this.pos = pos + 1;
    return handle2;
  }
  static layoutForCapacity(numRefs) {
    const refsStorage = BHS_SIZE;
    const pos = refsStorage + numRefs * 4;
    return {
      size: pos + 4,
      numberOfReferences: numRefs,
      offset: {
        refsStorage,
        pos
      }
    };
  }
};
var objectVisitorPredicateFactories = {
  arm: function(needle, onMatch) {
    const size = Process.pageSize;
    const predicate = Memory.alloc(size);
    Memory.protect(predicate, size, "rwx");
    const onMatchCallback = new NativeCallback(onMatch, "void", ["pointer"]);
    predicate._onMatchCallback = onMatchCallback;
    const instructions = [
      26625,
      // ldr r1, [r0]
      18947,
      // ldr r2, =needle
      17041,
      // cmp r1, r2
      53505,
      // bne mismatch
      19202,
      // ldr r3, =onMatch
      18200,
      // bx r3
      18288,
      // bx lr
      48896
      // nop
    ];
    const needleOffset = instructions.length * 2;
    const onMatchOffset = needleOffset + 4;
    const codeSize = onMatchOffset + 4;
    Memory.patchCode(predicate, codeSize, function(address) {
      instructions.forEach((instruction, index) => {
        address.add(index * 2).writeU16(instruction);
      });
      address.add(needleOffset).writeS32(needle);
      address.add(onMatchOffset).writePointer(onMatchCallback);
    });
    return predicate.or(1);
  },
  arm64: function(needle, onMatch) {
    const size = Process.pageSize;
    const predicate = Memory.alloc(size);
    Memory.protect(predicate, size, "rwx");
    const onMatchCallback = new NativeCallback(onMatch, "void", ["pointer"]);
    predicate._onMatchCallback = onMatchCallback;
    const instructions = [
      3107979265,
      // ldr w1, [x0]
      402653378,
      // ldr w2, =needle
      1795293247,
      // cmp w1, w2
      1409286241,
      // b.ne mismatch
      1476395139,
      // ldr x3, =onMatch
      3592355936,
      // br x3
      3596551104
      // ret
    ];
    const needleOffset = instructions.length * 4;
    const onMatchOffset = needleOffset + 4;
    const codeSize = onMatchOffset + 8;
    Memory.patchCode(predicate, codeSize, function(address) {
      instructions.forEach((instruction, index) => {
        address.add(index * 4).writeU32(instruction);
      });
      address.add(needleOffset).writeS32(needle);
      address.add(onMatchOffset).writePointer(onMatchCallback);
    });
    return predicate;
  }
};
function makeObjectVisitorPredicate(needle, onMatch) {
  const factory = objectVisitorPredicateFactories[Process.arch] || makeGenericObjectVisitorPredicate;
  return factory(needle, onMatch);
}
function makeGenericObjectVisitorPredicate(needle, onMatch) {
  return new NativeCallback((object) => {
    const klass = object.readS32();
    if (klass === needle) {
      onMatch(object);
    }
  }, "void", ["pointer", "pointer"]);
}
function alignPointerOffset(offset) {
  const remainder = offset % pointerSize6;
  if (remainder !== 0) {
    return offset + pointerSize6 - remainder;
  }
  return offset;
}

// node_modules/frida-java-bridge/lib/jvm.js
var jsizeSize2 = 4;
var { pointerSize: pointerSize7 } = Process;
var JVM_ACC_NATIVE = 256;
var JVM_ACC_IS_OLD = 65536;
var JVM_ACC_IS_OBSOLETE = 131072;
var JVM_ACC_NOT_C2_COMPILABLE = 33554432;
var JVM_ACC_NOT_C1_COMPILABLE = 67108864;
var JVM_ACC_NOT_C2_OSR_COMPILABLE = 134217728;
var nativeFunctionOptions4 = {
  exceptions: "propagate"
};
var getJvmMethodSpec = memoize(_getJvmMethodSpec);
var getJvmInstanceKlassSpec = memoize(_getJvmInstanceKlassSpec);
var getJvmThreadSpec = memoize(_getJvmThreadSpec);
var cachedApi2 = null;
var manglersScheduled = false;
var replaceManglers = /* @__PURE__ */ new Map();
var revertManglers = /* @__PURE__ */ new Map();
function getApi2() {
  if (cachedApi2 === null) {
    cachedApi2 = _getApi2();
  }
  return cachedApi2;
}
function _getApi2() {
  const vmModules = Process.enumerateModules().filter((m2) => /jvm.(dll|dylib|so)$/.test(m2.name));
  if (vmModules.length === 0) {
    return null;
  }
  const vmModule = vmModules[0];
  const temporaryApi = {
    flavor: "jvm"
  };
  const pending = Process.platform === "windows" ? [{
    module: vmModule,
    functions: {
      JNI_GetCreatedJavaVMs: ["JNI_GetCreatedJavaVMs", "int", ["pointer", "int", "pointer"]],
      JVM_Sleep: ["JVM_Sleep", "void", ["pointer", "pointer", "long"]],
      "VMThread::execute": ["VMThread::execute", "void", ["pointer"]],
      "Method::size": ["Method::size", "int", ["int"]],
      "Method::set_native_function": ["Method::set_native_function", "void", ["pointer", "pointer", "int"]],
      "Method::clear_native_function": ["Method::clear_native_function", "void", ["pointer"]],
      "Method::jmethod_id": ["Method::jmethod_id", "pointer", ["pointer"]],
      "ClassLoaderDataGraph::classes_do": ["ClassLoaderDataGraph::classes_do", "void", ["pointer"]],
      "NMethodSweeper::sweep_code_cache": ["NMethodSweeper::sweep_code_cache", "void", []],
      "OopMapCache::flush_obsolete_entries": ["OopMapCache::flush_obsolete_entries", "void", ["pointer"]]
    },
    variables: {
      "VM_RedefineClasses::`vftable'": function(address) {
        this.vtableRedefineClasses = address;
      },
      "VM_RedefineClasses::doit": function(address) {
        this.redefineClassesDoIt = address;
      },
      "VM_RedefineClasses::doit_prologue": function(address) {
        this.redefineClassesDoItPrologue = address;
      },
      "VM_RedefineClasses::doit_epilogue": function(address) {
        this.redefineClassesDoItEpilogue = address;
      },
      "VM_RedefineClasses::allow_nested_vm_operations": function(address) {
        this.redefineClassesAllow = address;
      },
      "NMethodSweeper::_traversals": function(address) {
        this.traversals = address;
      },
      "NMethodSweeper::_should_sweep": function(address) {
        this.shouldSweep = address;
      }
    },
    optionals: []
  }] : [{
    module: vmModule,
    functions: {
      JNI_GetCreatedJavaVMs: ["JNI_GetCreatedJavaVMs", "int", ["pointer", "int", "pointer"]],
      _ZN6Method4sizeEb: ["Method::size", "int", ["int"]],
      _ZN6Method19set_native_functionEPhb: ["Method::set_native_function", "void", ["pointer", "pointer", "int"]],
      _ZN6Method21clear_native_functionEv: ["Method::clear_native_function", "void", ["pointer"]],
      // JDK >= 17
      _ZN6Method24restore_unshareable_infoEP10JavaThread: ["Method::restore_unshareable_info", "void", ["pointer", "pointer"]],
      // JDK < 17
      _ZN6Method24restore_unshareable_infoEP6Thread: ["Method::restore_unshareable_info", "void", ["pointer", "pointer"]],
      _ZN6Method11link_methodERK12methodHandleP10JavaThread: ["Method::link_method", "void", ["pointer", "pointer", "pointer"]],
      _ZN6Method10jmethod_idEv: ["Method::jmethod_id", "pointer", ["pointer"]],
      _ZN6Method10clear_codeEv: function(address) {
        const clearCode = new NativeFunction(address, "void", ["pointer"], nativeFunctionOptions4);
        this["Method::clear_code"] = function(thisPtr) {
          clearCode(thisPtr);
        };
      },
      _ZN6Method10clear_codeEb: function(address) {
        const clearCode = new NativeFunction(address, "void", ["pointer", "int"], nativeFunctionOptions4);
        const lock = 0;
        this["Method::clear_code"] = function(thisPtr) {
          clearCode(thisPtr, lock);
        };
      },
      // JDK >= 13
      _ZN18VM_RedefineClasses19mark_dependent_codeEP13InstanceKlass: ["VM_RedefineClasses::mark_dependent_code", "void", ["pointer", "pointer"]],
      _ZN18VM_RedefineClasses20flush_dependent_codeEv: ["VM_RedefineClasses::flush_dependent_code", "void", []],
      // JDK < 13
      _ZN18VM_RedefineClasses20flush_dependent_codeEP13InstanceKlassP6Thread: ["VM_RedefineClasses::flush_dependent_code", "void", ["pointer", "pointer", "pointer"]],
      // JDK < 10
      _ZN18VM_RedefineClasses20flush_dependent_codeE19instanceKlassHandleP6Thread: ["VM_RedefineClasses::flush_dependent_code", "void", ["pointer", "pointer", "pointer"]],
      _ZN19ResolvedMethodTable21adjust_method_entriesEPb: ["ResolvedMethodTable::adjust_method_entries", "void", ["pointer"]],
      // JDK < 10
      _ZN15MemberNameTable21adjust_method_entriesEP13InstanceKlassPb: ["MemberNameTable::adjust_method_entries", "void", ["pointer", "pointer", "pointer"]],
      _ZN17ConstantPoolCache21adjust_method_entriesEPb: function(address) {
        const adjustMethod = new NativeFunction(address, "void", ["pointer", "pointer"], nativeFunctionOptions4);
        this["ConstantPoolCache::adjust_method_entries"] = function(thisPtr, holderPtr, tracePtr) {
          adjustMethod(thisPtr, tracePtr);
        };
      },
      // JDK < 13
      _ZN17ConstantPoolCache21adjust_method_entriesEP13InstanceKlassPb: function(address) {
        const adjustMethod = new NativeFunction(address, "void", ["pointer", "pointer", "pointer"], nativeFunctionOptions4);
        this["ConstantPoolCache::adjust_method_entries"] = function(thisPtr, holderPtr, tracePtr) {
          adjustMethod(thisPtr, holderPtr, tracePtr);
        };
      },
      _ZN20ClassLoaderDataGraph10classes_doEP12KlassClosure: ["ClassLoaderDataGraph::classes_do", "void", ["pointer"]],
      _ZN20ClassLoaderDataGraph22clean_deallocate_listsEb: ["ClassLoaderDataGraph::clean_deallocate_lists", "void", ["int"]],
      _ZN10JavaThread27thread_from_jni_environmentEP7JNIEnv_: ["JavaThread::thread_from_jni_environment", "pointer", ["pointer"]],
      _ZN8VMThread7executeEP12VM_Operation: ["VMThread::execute", "void", ["pointer"]],
      _ZN11OopMapCache22flush_obsolete_entriesEv: ["OopMapCache::flush_obsolete_entries", "void", ["pointer"]],
      _ZN14NMethodSweeper11force_sweepEv: ["NMethodSweeper::force_sweep", "void", []],
      _ZN14NMethodSweeper16sweep_code_cacheEv: ["NMethodSweeper::sweep_code_cache", "void", []],
      _ZN14NMethodSweeper17sweep_in_progressEv: ["NMethodSweeper::sweep_in_progress", "bool", []],
      JVM_Sleep: ["JVM_Sleep", "void", ["pointer", "pointer", "long"]]
    },
    variables: {
      // JDK <= 9
      _ZN18VM_RedefineClasses14_the_class_oopE: function(address) {
        this.redefineClass = address;
      },
      // 9 < JDK < 13
      _ZN18VM_RedefineClasses10_the_classE: function(address) {
        this.redefineClass = address;
      },
      // JDK < 13
      _ZN18VM_RedefineClasses25AdjustCpoolCacheAndVtable8do_klassEP5Klass: function(address) {
        this.doKlass = address;
      },
      // JDK >= 13
      _ZN18VM_RedefineClasses22AdjustAndCleanMetadata8do_klassEP5Klass: function(address) {
        this.doKlass = address;
      },
      _ZTV18VM_RedefineClasses: function(address) {
        this.vtableRedefineClasses = address;
      },
      _ZN18VM_RedefineClasses4doitEv: function(address) {
        this.redefineClassesDoIt = address;
      },
      _ZN18VM_RedefineClasses13doit_prologueEv: function(address) {
        this.redefineClassesDoItPrologue = address;
      },
      _ZN18VM_RedefineClasses13doit_epilogueEv: function(address) {
        this.redefineClassesDoItEpilogue = address;
      },
      _ZN18VM_RedefineClassesD0Ev: function(address) {
        this.redefineClassesDispose0 = address;
      },
      _ZN18VM_RedefineClassesD1Ev: function(address) {
        this.redefineClassesDispose1 = address;
      },
      _ZNK18VM_RedefineClasses26allow_nested_vm_operationsEv: function(address) {
        this.redefineClassesAllow = address;
      },
      _ZNK18VM_RedefineClasses14print_on_errorEP12outputStream: function(address) {
        this.redefineClassesOnError = address;
      },
      // JDK >= 17
      _ZN13InstanceKlass33create_new_default_vtable_indicesEiP10JavaThread: function(address) {
        this.createNewDefaultVtableIndices = address;
      },
      // JDK < 17
      _ZN13InstanceKlass33create_new_default_vtable_indicesEiP6Thread: function(address) {
        this.createNewDefaultVtableIndices = address;
      },
      _ZN19Abstract_VM_Version19jre_release_versionEv: function(address) {
        const getVersion = new NativeFunction(address, "pointer", [], nativeFunctionOptions4);
        const versionS = getVersion().readCString();
        this.version = versionS.startsWith("1.8") ? 8 : versionS.startsWith("9.") ? 9 : parseInt(versionS.slice(0, 2), 10);
        this.versionS = versionS;
      },
      _ZN14NMethodSweeper11_traversalsE: function(address) {
        this.traversals = address;
      },
      _ZN14NMethodSweeper21_sweep_fractions_leftE: function(address) {
        this.fractions = address;
      },
      _ZN14NMethodSweeper13_should_sweepE: function(address) {
        this.shouldSweep = address;
      }
    },
    optionals: [
      "_ZN6Method24restore_unshareable_infoEP10JavaThread",
      "_ZN6Method24restore_unshareable_infoEP6Thread",
      "_ZN6Method11link_methodERK12methodHandleP10JavaThread",
      "_ZN6Method10clear_codeEv",
      "_ZN6Method10clear_codeEb",
      "_ZN18VM_RedefineClasses19mark_dependent_codeEP13InstanceKlass",
      "_ZN18VM_RedefineClasses20flush_dependent_codeEv",
      "_ZN18VM_RedefineClasses20flush_dependent_codeEP13InstanceKlassP6Thread",
      "_ZN18VM_RedefineClasses20flush_dependent_codeE19instanceKlassHandleP6Thread",
      "_ZN19ResolvedMethodTable21adjust_method_entriesEPb",
      "_ZN15MemberNameTable21adjust_method_entriesEP13InstanceKlassPb",
      "_ZN17ConstantPoolCache21adjust_method_entriesEPb",
      "_ZN17ConstantPoolCache21adjust_method_entriesEP13InstanceKlassPb",
      "_ZN20ClassLoaderDataGraph22clean_deallocate_listsEb",
      "_ZN10JavaThread27thread_from_jni_environmentEP7JNIEnv_",
      "_ZN14NMethodSweeper11force_sweepEv",
      "_ZN14NMethodSweeper17sweep_in_progressEv",
      "_ZN18VM_RedefineClasses14_the_class_oopE",
      "_ZN18VM_RedefineClasses10_the_classE",
      "_ZN18VM_RedefineClasses25AdjustCpoolCacheAndVtable8do_klassEP5Klass",
      "_ZN18VM_RedefineClasses22AdjustAndCleanMetadata8do_klassEP5Klass",
      "_ZN18VM_RedefineClassesD0Ev",
      "_ZN18VM_RedefineClassesD1Ev",
      "_ZNK18VM_RedefineClasses14print_on_errorEP12outputStream",
      "_ZN13InstanceKlass33create_new_default_vtable_indicesEiP10JavaThread",
      "_ZN13InstanceKlass33create_new_default_vtable_indicesEiP6Thread",
      "_ZN14NMethodSweeper21_sweep_fractions_leftE"
    ]
  }];
  const missing = [];
  pending.forEach(function(api3) {
    const module2 = api3.module;
    const functions = api3.functions || {};
    const variables = api3.variables || {};
    const optionals = new Set(api3.optionals || []);
    const tmp = module2.enumerateExports().reduce(function(result, exp) {
      result[exp.name] = exp;
      return result;
    }, {});
    const exportByName = module2.enumerateSymbols().reduce(function(result, exp) {
      result[exp.name] = exp;
      return result;
    }, tmp);
    Object.keys(functions).forEach(function(name) {
      const exp = exportByName[name];
      if (exp !== void 0) {
        const signature2 = functions[name];
        if (typeof signature2 === "function") {
          signature2.call(temporaryApi, exp.address);
        } else {
          temporaryApi[signature2[0]] = new NativeFunction(exp.address, signature2[1], signature2[2], nativeFunctionOptions4);
        }
      } else {
        if (!optionals.has(name)) {
          missing.push(name);
        }
      }
    });
    Object.keys(variables).forEach(function(name) {
      const exp = exportByName[name];
      if (exp !== void 0) {
        const handler = variables[name];
        handler.call(temporaryApi, exp.address);
      } else {
        if (!optionals.has(name)) {
          missing.push(name);
        }
      }
    });
  });
  if (missing.length > 0) {
    throw new Error("Java API only partially available; please file a bug. Missing: " + missing.join(", "));
  }
  const vms = Memory.alloc(pointerSize7);
  const vmCount = Memory.alloc(jsizeSize2);
  checkJniResult("JNI_GetCreatedJavaVMs", temporaryApi.JNI_GetCreatedJavaVMs(vms, 1, vmCount));
  if (vmCount.readInt() === 0) {
    return null;
  }
  temporaryApi.vm = vms.readPointer();
  const allocatorFunctions = Process.platform === "windows" ? {
    $new: ["??2@YAPEAX_K@Z", "pointer", ["ulong"]],
    $delete: ["??3@YAXPEAX@Z", "void", ["pointer"]]
  } : {
    $new: ["_Znwm", "pointer", ["ulong"]],
    $delete: ["_ZdlPv", "void", ["pointer"]]
  };
  for (const [name, [rawName, retType2, argTypes2]] of Object.entries(allocatorFunctions)) {
    let address = Module.findGlobalExportByName(rawName);
    if (address === null) {
      address = DebugSymbol.fromName(rawName).address;
      if (address.isNull()) {
        throw new Error(`unable to find C++ allocator API, missing: '${rawName}'`);
      }
    }
    temporaryApi[name] = new NativeFunction(address, retType2, argTypes2, nativeFunctionOptions4);
  }
  temporaryApi.jvmti = getEnvJvmti(temporaryApi);
  if (temporaryApi["JavaThread::thread_from_jni_environment"] === void 0) {
    temporaryApi["JavaThread::thread_from_jni_environment"] = makeThreadFromJniHelper(temporaryApi);
  }
  return temporaryApi;
}
function getEnvJvmti(api3) {
  const vm3 = new VM(api3);
  let env2;
  vm3.perform(() => {
    const handle2 = vm3.tryGetEnvHandle(jvmtiVersion.v1_0);
    if (handle2 === null) {
      throw new Error("JVMTI not available");
    }
    env2 = new EnvJvmti(handle2, vm3);
    const capaBuf = Memory.alloc(8);
    capaBuf.writeU64(jvmtiCapabilities.canTagObjects);
    const result = env2.addCapabilities(capaBuf);
    checkJniResult("getEnvJvmti::AddCapabilities", result);
  });
  return env2;
}
var threadOffsetParsers = {
  x64: parseX64ThreadOffset
};
function makeThreadFromJniHelper(api3) {
  let offset = null;
  const tryParse = threadOffsetParsers[Process.arch];
  if (tryParse !== void 0) {
    const vm3 = new VM(api3);
    const findClassImpl = vm3.perform((env2) => env2.handle.readPointer().add(6 * pointerSize7).readPointer());
    offset = parseInstructionsAt(findClassImpl, tryParse, { limit: 11 });
  }
  if (offset === null) {
    return () => {
      throw new Error("Unable to make thread_from_jni_environment() helper for the current architecture");
    };
  }
  return (env2) => {
    return env2.add(offset);
  };
}
function parseX64ThreadOffset(insn) {
  if (insn.mnemonic !== "lea") {
    return null;
  }
  const { base, disp } = insn.operands[1].value;
  if (!(base === "rdi" && disp < 0)) {
    return null;
  }
  return disp;
}
function ensureClassInitialized2(env2, classRef) {
}
var JvmMethodMangler = class {
  constructor(methodId) {
    this.methodId = methodId;
    this.method = methodId.readPointer();
    this.originalMethod = null;
    this.newMethod = null;
    this.resolved = null;
    this.impl = null;
    this.key = methodId.toString(16);
  }
  replace(impl2, isInstanceMethod, argTypes2, vm3, api3) {
    const { key } = this;
    const mangler = revertManglers.get(key);
    if (mangler !== void 0) {
      revertManglers.delete(key);
      this.method = mangler.method;
      this.originalMethod = mangler.originalMethod;
      this.newMethod = mangler.newMethod;
      this.resolved = mangler.resolved;
    }
    this.impl = impl2;
    replaceManglers.set(key, this);
    ensureManglersScheduled(vm3);
  }
  revert(vm3) {
    const { key } = this;
    replaceManglers.delete(key);
    revertManglers.set(key, this);
    ensureManglersScheduled(vm3);
  }
  resolveTarget(wrapper, isInstanceMethod, env2, api3) {
    const { resolved, originalMethod, methodId } = this;
    if (resolved !== null) {
      return resolved;
    }
    if (originalMethod === null) {
      return methodId;
    }
    const vip = originalMethod.oldMethod.vtableIndexPtr;
    vip.writeS32(-2);
    const jmethodID = Memory.alloc(pointerSize7);
    jmethodID.writePointer(this.method);
    this.resolved = jmethodID;
    return jmethodID;
  }
};
function ensureManglersScheduled(vm3) {
  if (!manglersScheduled) {
    manglersScheduled = true;
    Script.nextTick(doManglers, vm3);
  }
}
function doManglers(vm3) {
  const localReplaceManglers = new Map(replaceManglers);
  const localRevertManglers = new Map(revertManglers);
  replaceManglers.clear();
  revertManglers.clear();
  manglersScheduled = false;
  vm3.perform((env2) => {
    const api3 = getApi2();
    const thread = api3["JavaThread::thread_from_jni_environment"](env2.handle);
    let force = false;
    withJvmThread(() => {
      localReplaceManglers.forEach((mangler) => {
        const { method: method2, originalMethod, impl: impl2, methodId, newMethod } = mangler;
        if (originalMethod === null) {
          mangler.originalMethod = fetchJvmMethod(method2);
          mangler.newMethod = nativeJvmMethod(method2, impl2, thread);
          installJvmMethod(mangler.newMethod, methodId, thread);
        } else {
          api3["Method::set_native_function"](newMethod.method, impl2, 0);
        }
      });
      localRevertManglers.forEach((mangler) => {
        const { originalMethod, methodId, newMethod } = mangler;
        if (originalMethod !== null) {
          revertJvmMethod(originalMethod);
          const revert = originalMethod.oldMethod;
          revert.oldMethod = newMethod;
          installJvmMethod(revert, methodId, thread);
          force = true;
        }
      });
    });
    if (force) {
      forceSweep(env2.handle);
    }
  });
}
function forceSweep(env2) {
  const {
    fractions,
    shouldSweep,
    traversals,
    "NMethodSweeper::sweep_code_cache": sweep,
    "NMethodSweeper::sweep_in_progress": inProgress,
    "NMethodSweeper::force_sweep": force,
    JVM_Sleep: sleep
  } = getApi2();
  if (force !== void 0) {
    Thread.sleep(0.05);
    force();
    Thread.sleep(0.05);
    force();
  } else {
    let trav = traversals.readS64();
    const endTrav = trav + 2;
    while (endTrav > trav) {
      fractions.writeS32(1);
      sleep(env2, NULL, 50);
      if (!inProgress()) {
        withJvmThread(() => {
          Thread.sleep(0.05);
        });
      }
      const sweepNotAlreadyInProgress = shouldSweep.readU8() === 0;
      if (sweepNotAlreadyInProgress) {
        fractions.writeS32(1);
        sweep();
      }
      trav = traversals.readS64();
    }
  }
}
function withJvmThread(fn, fnPrologue, fnEpilogue) {
  const {
    execute,
    vtable: vtable2,
    vtableSize,
    doItOffset,
    prologueOffset,
    epilogueOffset
  } = getJvmThreadSpec();
  const vtableDup = Memory.dup(vtable2, vtableSize);
  const vmOperation = Memory.alloc(pointerSize7 * 25);
  vmOperation.writePointer(vtableDup);
  const doIt = new NativeCallback(fn, "void", ["pointer"]);
  vtableDup.add(doItOffset).writePointer(doIt);
  let prologue = null;
  if (fnPrologue !== void 0) {
    prologue = new NativeCallback(fnPrologue, "int", ["pointer"]);
    vtableDup.add(prologueOffset).writePointer(prologue);
  }
  let epilogue = null;
  if (fnEpilogue !== void 0) {
    epilogue = new NativeCallback(fnEpilogue, "void", ["pointer"]);
    vtableDup.add(epilogueOffset).writePointer(epilogue);
  }
  execute(vmOperation);
}
function _getJvmThreadSpec() {
  const {
    vtableRedefineClasses,
    redefineClassesDoIt,
    redefineClassesDoItPrologue,
    redefineClassesDoItEpilogue,
    redefineClassesOnError,
    redefineClassesAllow,
    redefineClassesDispose0,
    redefineClassesDispose1,
    "VMThread::execute": execute
  } = getApi2();
  const vtablePtr = vtableRedefineClasses.add(2 * pointerSize7);
  const vtableSize = 15 * pointerSize7;
  const vtable2 = Memory.dup(vtablePtr, vtableSize);
  const emptyCallback = new NativeCallback(() => {
  }, "void", ["pointer"]);
  let doItOffset, prologueOffset, epilogueOffset;
  for (let offset = 0; offset !== vtableSize; offset += pointerSize7) {
    const element = vtable2.add(offset);
    const value = element.readPointer();
    if (redefineClassesOnError !== void 0 && value.equals(redefineClassesOnError) || redefineClassesDispose0 !== void 0 && value.equals(redefineClassesDispose0) || redefineClassesDispose1 !== void 0 && value.equals(redefineClassesDispose1)) {
      element.writePointer(emptyCallback);
    } else if (value.equals(redefineClassesDoIt)) {
      doItOffset = offset;
    } else if (value.equals(redefineClassesDoItPrologue)) {
      prologueOffset = offset;
      element.writePointer(redefineClassesAllow);
    } else if (value.equals(redefineClassesDoItEpilogue)) {
      epilogueOffset = offset;
      element.writePointer(emptyCallback);
    }
  }
  return {
    execute,
    emptyCallback,
    vtable: vtable2,
    vtableSize,
    doItOffset,
    prologueOffset,
    epilogueOffset
  };
}
function makeMethodMangler2(methodId) {
  return new JvmMethodMangler(methodId);
}
function installJvmMethod(method2, methodId, thread) {
  const { method: handle2, oldMethod: old } = method2;
  const api3 = getApi2();
  method2.methodsArray.add(method2.methodIndex * pointerSize7).writePointer(handle2);
  if (method2.vtableIndex >= 0) {
    method2.vtable.add(method2.vtableIndex * pointerSize7).writePointer(handle2);
  }
  methodId.writePointer(handle2);
  old.accessFlagsPtr.writeU32((old.accessFlags | JVM_ACC_IS_OLD | JVM_ACC_IS_OBSOLETE) >>> 0);
  const flushObs = api3["OopMapCache::flush_obsolete_entries"];
  if (flushObs !== void 0) {
    const { oopMapCache } = method2;
    if (!oopMapCache.isNull()) {
      flushObs(oopMapCache);
    }
  }
  const mark = api3["VM_RedefineClasses::mark_dependent_code"];
  const flush = api3["VM_RedefineClasses::flush_dependent_code"];
  if (mark !== void 0) {
    mark(NULL, method2.instanceKlass);
    flush();
  } else {
    flush(NULL, method2.instanceKlass, thread);
  }
  const traceNamePrinted = Memory.alloc(1);
  traceNamePrinted.writeU8(1);
  api3["ConstantPoolCache::adjust_method_entries"](method2.cache, method2.instanceKlass, traceNamePrinted);
  const klassClosure = Memory.alloc(3 * pointerSize7);
  const doKlassPtr = Memory.alloc(pointerSize7);
  doKlassPtr.writePointer(api3.doKlass);
  klassClosure.writePointer(doKlassPtr);
  klassClosure.add(pointerSize7).writePointer(thread);
  klassClosure.add(2 * pointerSize7).writePointer(thread);
  if (api3.redefineClass !== void 0) {
    api3.redefineClass.writePointer(method2.instanceKlass);
  }
  api3["ClassLoaderDataGraph::classes_do"](klassClosure);
  const rmtAdjustMethodEntries = api3["ResolvedMethodTable::adjust_method_entries"];
  if (rmtAdjustMethodEntries !== void 0) {
    rmtAdjustMethodEntries(traceNamePrinted);
  } else {
    const { memberNames } = method2;
    if (!memberNames.isNull()) {
      const mntAdjustMethodEntries = api3["MemberNameTable::adjust_method_entries"];
      if (mntAdjustMethodEntries !== void 0) {
        mntAdjustMethodEntries(memberNames, method2.instanceKlass, traceNamePrinted);
      }
    }
  }
  const clean = api3["ClassLoaderDataGraph::clean_deallocate_lists"];
  if (clean !== void 0) {
    clean(0);
  }
}
function nativeJvmMethod(method2, impl2, thread) {
  const api3 = getApi2();
  const newMethod = fetchJvmMethod(method2);
  newMethod.constPtr.writePointer(newMethod.const);
  const flags = (newMethod.accessFlags | JVM_ACC_NATIVE | JVM_ACC_NOT_C2_COMPILABLE | JVM_ACC_NOT_C1_COMPILABLE | JVM_ACC_NOT_C2_OSR_COMPILABLE) >>> 0;
  newMethod.accessFlagsPtr.writeU32(flags);
  newMethod.signatureHandler.writePointer(NULL);
  newMethod.adapter.writePointer(NULL);
  newMethod.i2iEntry.writePointer(NULL);
  api3["Method::clear_code"](newMethod.method);
  newMethod.dataPtr.writePointer(NULL);
  newMethod.countersPtr.writePointer(NULL);
  newMethod.stackmapPtr.writePointer(NULL);
  api3["Method::clear_native_function"](newMethod.method);
  api3["Method::set_native_function"](newMethod.method, impl2, 0);
  api3["Method::restore_unshareable_info"](newMethod.method, thread);
  if (api3.version >= 17) {
    const methodHandle = Memory.alloc(2 * pointerSize7);
    methodHandle.writePointer(newMethod.method);
    methodHandle.add(pointerSize7).writePointer(thread);
    api3["Method::link_method"](newMethod.method, methodHandle, thread);
  }
  return newMethod;
}
function fetchJvmMethod(method2) {
  const spec = getJvmMethodSpec();
  const constMethod = method2.add(spec.method.constMethodOffset).readPointer();
  const constMethodSize = constMethod.add(spec.constMethod.sizeOffset).readS32() * pointerSize7;
  const newConstMethod = Memory.alloc(constMethodSize + spec.method.size);
  Memory.copy(newConstMethod, constMethod, constMethodSize);
  const newMethod = newConstMethod.add(constMethodSize);
  Memory.copy(newMethod, method2, spec.method.size);
  const result = readJvmMethod(newMethod, newConstMethod, constMethodSize);
  const oldMethod = readJvmMethod(method2, constMethod, constMethodSize);
  result.oldMethod = oldMethod;
  return result;
}
function readJvmMethod(method2, constMethod, constMethodSize) {
  const api3 = getApi2();
  const spec = getJvmMethodSpec();
  const constPtr = method2.add(spec.method.constMethodOffset);
  const dataPtr = method2.add(spec.method.methodDataOffset);
  const countersPtr = method2.add(spec.method.methodCountersOffset);
  const accessFlagsPtr = method2.add(spec.method.accessFlagsOffset);
  const accessFlags = accessFlagsPtr.readU32();
  const adapter = spec.getAdapterPointer(method2, constMethod);
  const i2iEntry = method2.add(spec.method.i2iEntryOffset);
  const signatureHandler = method2.add(spec.method.signatureHandlerOffset);
  const constantPool = constMethod.add(spec.constMethod.constantPoolOffset).readPointer();
  const stackmapPtr = constMethod.add(spec.constMethod.stackmapDataOffset);
  const instanceKlass = constantPool.add(spec.constantPool.instanceKlassOffset).readPointer();
  const cache = constantPool.add(spec.constantPool.cacheOffset).readPointer();
  const instanceKlassSpec = getJvmInstanceKlassSpec();
  const methods = instanceKlass.add(instanceKlassSpec.methodsOffset).readPointer();
  const methodsCount = methods.readS32();
  const methodsArray = methods.add(pointerSize7);
  const methodIndex = constMethod.add(spec.constMethod.methodIdnumOffset).readU16();
  const vtableIndexPtr = method2.add(spec.method.vtableIndexOffset);
  const vtableIndex = vtableIndexPtr.readS32();
  const vtable2 = instanceKlass.add(instanceKlassSpec.vtableOffset);
  const oopMapCache = instanceKlass.add(instanceKlassSpec.oopMapCacheOffset).readPointer();
  const memberNames = api3.version >= 10 ? instanceKlass.add(instanceKlassSpec.memberNamesOffset).readPointer() : NULL;
  return {
    method: method2,
    methodSize: spec.method.size,
    const: constMethod,
    constSize: constMethodSize,
    constPtr,
    dataPtr,
    countersPtr,
    stackmapPtr,
    instanceKlass,
    methodsArray,
    methodsCount,
    methodIndex,
    vtableIndex,
    vtableIndexPtr,
    vtable: vtable2,
    accessFlags,
    accessFlagsPtr,
    adapter,
    i2iEntry,
    signatureHandler,
    memberNames,
    cache,
    oopMapCache
  };
}
function revertJvmMethod(method2) {
  const { oldMethod: old } = method2;
  old.accessFlagsPtr.writeU32(old.accessFlags);
  old.vtableIndexPtr.writeS32(old.vtableIndex);
}
function _getJvmMethodSpec() {
  const api3 = getApi2();
  const { version: version2 } = api3;
  let adapterHandlerLocation;
  if (version2 >= 17) {
    adapterHandlerLocation = "method:early";
  } else if (version2 >= 9 && version2 <= 16) {
    adapterHandlerLocation = "const-method";
  } else {
    adapterHandlerLocation = "method:late";
  }
  const isNative = 1;
  const methodSize = api3["Method::size"](isNative) * pointerSize7;
  const constMethodOffset = pointerSize7;
  const methodDataOffset = 2 * pointerSize7;
  const methodCountersOffset = 3 * pointerSize7;
  const adapterInMethodEarlyOffset = 4 * pointerSize7;
  const adapterInMethodEarlySize = adapterHandlerLocation === "method:early" ? pointerSize7 : 0;
  const accessFlagsOffset = adapterInMethodEarlyOffset + adapterInMethodEarlySize;
  const vtableIndexOffset = accessFlagsOffset + 4;
  const i2iEntryOffset = vtableIndexOffset + 4 + 8;
  const adapterInMethodLateOffset = i2iEntryOffset + pointerSize7;
  const adapterInMethodOffset = adapterInMethodEarlySize !== 0 ? adapterInMethodEarlyOffset : adapterInMethodLateOffset;
  const nativeFunctionOffset = methodSize - 2 * pointerSize7;
  const signatureHandlerOffset = methodSize - pointerSize7;
  const constantPoolOffset = 8;
  const stackmapDataOffset = constantPoolOffset + pointerSize7;
  const adapterInConstMethodOffset = stackmapDataOffset + pointerSize7;
  const adapterInConstMethodSize = adapterHandlerLocation === "const-method" ? pointerSize7 : 0;
  const constMethodSizeOffset = adapterInConstMethodOffset + adapterInConstMethodSize;
  const methodIdnumOffset = constMethodSizeOffset + 14;
  const cacheOffset = 2 * pointerSize7;
  const instanceKlassOffset = 3 * pointerSize7;
  const getAdapterPointer = adapterInConstMethodSize !== 0 ? function(method2, constMethod) {
    return constMethod.add(adapterInConstMethodOffset);
  } : function(method2, constMethod) {
    return method2.add(adapterInMethodOffset);
  };
  return {
    getAdapterPointer,
    method: {
      size: methodSize,
      constMethodOffset,
      methodDataOffset,
      methodCountersOffset,
      accessFlagsOffset,
      vtableIndexOffset,
      i2iEntryOffset,
      nativeFunctionOffset,
      signatureHandlerOffset
    },
    constMethod: {
      constantPoolOffset,
      stackmapDataOffset,
      sizeOffset: constMethodSizeOffset,
      methodIdnumOffset
    },
    constantPool: {
      cacheOffset,
      instanceKlassOffset
    }
  };
}
var vtableOffsetParsers = {
  x64: parseX64VTableOffset
};
function _getJvmInstanceKlassSpec() {
  const { version: jvmVersion, createNewDefaultVtableIndices } = getApi2();
  const tryParse = vtableOffsetParsers[Process.arch];
  if (tryParse === void 0) {
    throw new Error(`Missing vtable offset parser for ${Process.arch}`);
  }
  const vtableOffset = parseInstructionsAt(createNewDefaultVtableIndices, tryParse, { limit: 32 });
  if (vtableOffset === null) {
    throw new Error("Unable to deduce vtable offset");
  }
  const oopMultiplier = jvmVersion >= 10 && jvmVersion <= 11 || jvmVersion >= 15 ? 17 : 18;
  const methodsOffset = vtableOffset - 7 * pointerSize7;
  const memberNamesOffset = vtableOffset - 17 * pointerSize7;
  const oopMapCacheOffset = vtableOffset - oopMultiplier * pointerSize7;
  return {
    vtableOffset,
    methodsOffset,
    memberNamesOffset,
    oopMapCacheOffset
  };
}
function parseX64VTableOffset(insn) {
  if (insn.mnemonic !== "mov") {
    return null;
  }
  const dst = insn.operands[0];
  if (dst.type !== "mem") {
    return null;
  }
  const { value: dstValue } = dst;
  if (dstValue.scale !== 1) {
    return null;
  }
  const { disp } = dstValue;
  if (disp < 256) {
    return null;
  }
  const defaultVtableIndicesOffset = disp;
  return defaultVtableIndicesOffset + 16;
}

// node_modules/frida-java-bridge/lib/api.js
var getApi3 = getApi;
try {
  getAndroidVersion();
} catch (e) {
  getApi3 = getApi2;
}
var api_default = getApi3;

// node_modules/frida-java-bridge/lib/class-model.js
var code2 = `#include <json-glib/json-glib.h>
#include <string.h>

#define kAccStatic 0x0008
#define kAccConstructor 0x00010000

typedef struct _Model Model;
typedef struct _EnumerateMethodsContext EnumerateMethodsContext;

typedef struct _JavaApi JavaApi;
typedef struct _JavaClassApi JavaClassApi;
typedef struct _JavaMethodApi JavaMethodApi;
typedef struct _JavaFieldApi JavaFieldApi;

typedef struct _JNIEnv JNIEnv;
typedef guint8 jboolean;
typedef gint32 jint;
typedef jint jsize;
typedef gpointer jobject;
typedef jobject jclass;
typedef jobject jstring;
typedef jobject jarray;
typedef jarray jobjectArray;
typedef gpointer jfieldID;
typedef gpointer jmethodID;

typedef struct _jvmtiEnv jvmtiEnv;
typedef enum
{
  JVMTI_ERROR_NONE = 0
} jvmtiError;

typedef struct _ArtApi ArtApi;
typedef guint32 ArtHeapReference;
typedef struct _ArtObject ArtObject;
typedef struct _ArtClass ArtClass;
typedef struct _ArtClassLinker ArtClassLinker;
typedef struct _ArtClassVisitor ArtClassVisitor;
typedef struct _ArtClassVisitorVTable ArtClassVisitorVTable;
typedef struct _ArtMethod ArtMethod;
typedef struct _ArtString ArtString;

typedef union _StdString StdString;
typedef struct _StdStringShort StdStringShort;
typedef struct _StdStringLong StdStringLong;

typedef void (* ArtVisitClassesFunc) (ArtClassLinker * linker, ArtClassVisitor * visitor);
typedef const char * (* ArtGetClassDescriptorFunc) (ArtClass * klass, StdString * storage);
typedef void (* ArtPrettyMethodFunc) (StdString * result, ArtMethod * method, jboolean with_signature);

struct _Model
{
  GHashTable * members;
};

struct _EnumerateMethodsContext
{
  GPatternSpec * class_query;
  GPatternSpec * method_query;
  jboolean include_signature;
  jboolean ignore_case;
  jboolean skip_system_classes;
  GHashTable * groups;
};

struct _JavaClassApi
{
  jmethodID get_declared_methods;
  jmethodID get_declared_fields;
};

struct _JavaMethodApi
{
  jmethodID get_name;
  jmethodID get_modifiers;
};

struct _JavaFieldApi
{
  jmethodID get_name;
  jmethodID get_modifiers;
};

struct _JavaApi
{
  JavaClassApi clazz;
  JavaMethodApi method;
  JavaFieldApi field;
};

struct _JNIEnv
{
  gpointer * functions;
};

struct _jvmtiEnv
{
  gpointer * functions;
};

struct _ArtApi
{
  gboolean available;

  guint class_offset_ifields;
  guint class_offset_methods;
  guint class_offset_sfields;
  guint class_offset_copied_methods_offset;

  guint method_size;
  guint method_offset_access_flags;

  guint field_size;
  guint field_offset_access_flags;

  guint alignment_padding;

  ArtClassLinker * linker;
  ArtVisitClassesFunc visit_classes;
  ArtGetClassDescriptorFunc get_class_descriptor;
  ArtPrettyMethodFunc pretty_method;

  void (* free) (gpointer mem);
};

struct _ArtObject
{
  ArtHeapReference klass;
  ArtHeapReference monitor;
};

struct _ArtClass
{
  ArtObject parent;

  ArtHeapReference class_loader;
};

struct _ArtClassVisitor
{
  ArtClassVisitorVTable * vtable;
  gpointer user_data;
};

struct _ArtClassVisitorVTable
{
  void (* reserved1) (ArtClassVisitor * self);
  void (* reserved2) (ArtClassVisitor * self);
  jboolean (* visit) (ArtClassVisitor * self, ArtClass * klass);
};

struct _ArtString
{
  ArtObject parent;

  gint32 count;
  guint32 hash_code;

  union
  {
    guint16 value[0];
    guint8 value_compressed[0];
  };
};

struct _StdStringShort
{
  guint8 size;
  gchar data[(3 * sizeof (gpointer)) - sizeof (guint8)];
};

struct _StdStringLong
{
  gsize capacity;
  gsize size;
  gchar * data;
};

union _StdString
{
  StdStringShort s;
  StdStringLong l;
};

static void model_add_method (Model * self, const gchar * name, jmethodID id, jint modifiers);
static void model_add_field (Model * self, const gchar * name, jfieldID id, jint modifiers);
static void model_free (Model * model);

static jboolean collect_matching_class_methods (ArtClassVisitor * self, ArtClass * klass);
static gchar * finalize_method_groups_to_json (GHashTable * groups);
static GPatternSpec * make_pattern_spec (const gchar * pattern, jboolean ignore_case);
static gchar * class_name_from_signature (const gchar * signature);
static gchar * format_method_signature (const gchar * name, const gchar * signature);
static void append_type (GString * output, const gchar ** type);

static gpointer read_art_array (gpointer object_base, guint field_offset, guint length_size, guint * length);

static void std_string_destroy (StdString * str);
static gchar * std_string_c_str (StdString * self);

extern GMutex lock;
extern GArray * models;
extern JavaApi java_api;
extern ArtApi art_api;

void
init (void)
{
  g_mutex_init (&lock);
  models = g_array_new (FALSE, FALSE, sizeof (Model *));
}

void
finalize (void)
{
  guint n, i;

  n = models->len;
  for (i = 0; i != n; i++)
  {
    Model * model = g_array_index (models, Model *, i);
    model_free (model);
  }

  g_array_unref (models);
  g_mutex_clear (&lock);
}

Model *
model_new (jclass class_handle,
           gpointer class_object,
           JNIEnv * env)
{
  Model * model;
  GHashTable * members;
  gpointer * funcs = env->functions;
  jmethodID (* from_reflected_method) (JNIEnv *, jobject) = funcs[7];
  jfieldID (* from_reflected_field) (JNIEnv *, jobject) = funcs[8];
  jobject (* to_reflected_method) (JNIEnv *, jclass, jmethodID, jboolean) = funcs[9];
  jobject (* to_reflected_field) (JNIEnv *, jclass, jfieldID, jboolean) = funcs[12];
  void (* delete_local_ref) (JNIEnv *, jobject) = funcs[23];
  jobject (* call_object_method) (JNIEnv *, jobject, jmethodID, ...) = funcs[34];
  jint (* call_int_method) (JNIEnv *, jobject, jmethodID, ...) = funcs[49];
  const char * (* get_string_utf_chars) (JNIEnv *, jstring, jboolean *) = funcs[169];
  void (* release_string_utf_chars) (JNIEnv *, jstring, const char *) = funcs[170];
  jsize (* get_array_length) (JNIEnv *, jarray) = funcs[171];
  jobject (* get_object_array_element) (JNIEnv *, jobjectArray, jsize) = funcs[173];
  jsize n, i;

  model = g_new (Model, 1);

  members = g_hash_table_new_full (g_str_hash, g_str_equal, g_free, g_free);
  model->members = members;

  if (art_api.available)
  {
    gpointer elements;
    guint n, i;
    const guint field_arrays[] = {
      art_api.class_offset_ifields,
      art_api.class_offset_sfields
    };
    guint field_array_cursor;

    elements = read_art_array (class_object, art_api.class_offset_methods, sizeof (gsize), NULL);
    n = *(guint16 *) (class_object + art_api.class_offset_copied_methods_offset);
    for (i = 0; i != n; i++)
    {
      jmethodID id;
      guint32 access_flags;
      jboolean is_static;
      jobject method, name;
      const char * name_str;
      jint modifiers;

      id = elements + (i * art_api.method_size);

      access_flags = *(guint32 *) (id + art_api.method_offset_access_flags);
      if ((access_flags & kAccConstructor) != 0)
        continue;
      is_static = (access_flags & kAccStatic) != 0;
      method = to_reflected_method (env, class_handle, id, is_static);
      name = call_object_method (env, method, java_api.method.get_name);
      name_str = get_string_utf_chars (env, name, NULL);
      modifiers = access_flags & 0xffff;

      model_add_method (model, name_str, id, modifiers);

      release_string_utf_chars (env, name, name_str);
      delete_local_ref (env, name);
      delete_local_ref (env, method);
    }

    for (field_array_cursor = 0; field_array_cursor != G_N_ELEMENTS (field_arrays); field_array_cursor++)
    {
      jboolean is_static;

      is_static = field_array_cursor == 1;

      elements = read_art_array (class_object, field_arrays[field_array_cursor], sizeof (guint32), &n);
      for (i = 0; i != n; i++)
      {
        jfieldID id;
        guint32 access_flags;
        jobject field, name;
        const char * name_str;
        jint modifiers;

        id = elements + (i * art_api.field_size);

        access_flags = *(guint32 *) (id + art_api.field_offset_access_flags);
        field = to_reflected_field (env, class_handle, id, is_static);
        name = call_object_method (env, field, java_api.field.get_name);
        name_str = get_string_utf_chars (env, name, NULL);
        modifiers = access_flags & 0xffff;

        model_add_field (model, name_str, id, modifiers);

        release_string_utf_chars (env, name, name_str);
        delete_local_ref (env, name);
        delete_local_ref (env, field);
      }
    }
  }
  else
  {
    jobject elements;

    elements = call_object_method (env, class_handle, java_api.clazz.get_declared_methods);
    n = get_array_length (env, elements);
    for (i = 0; i != n; i++)
    {
      jobject method, name;
      const char * name_str;
      jmethodID id;
      jint modifiers;

      method = get_object_array_element (env, elements, i);
      name = call_object_method (env, method, java_api.method.get_name);
      name_str = get_string_utf_chars (env, name, NULL);
      id = from_reflected_method (env, method);
      modifiers = call_int_method (env, method, java_api.method.get_modifiers);

      model_add_method (model, name_str, id, modifiers);

      release_string_utf_chars (env, name, name_str);
      delete_local_ref (env, name);
      delete_local_ref (env, method);
    }
    delete_local_ref (env, elements);

    elements = call_object_method (env, class_handle, java_api.clazz.get_declared_fields);
    n = get_array_length (env, elements);
    for (i = 0; i != n; i++)
    {
      jobject field, name;
      const char * name_str;
      jfieldID id;
      jint modifiers;

      field = get_object_array_element (env, elements, i);
      name = call_object_method (env, field, java_api.field.get_name);
      name_str = get_string_utf_chars (env, name, NULL);
      id = from_reflected_field (env, field);
      modifiers = call_int_method (env, field, java_api.field.get_modifiers);

      model_add_field (model, name_str, id, modifiers);

      release_string_utf_chars (env, name, name_str);
      delete_local_ref (env, name);
      delete_local_ref (env, field);
    }
    delete_local_ref (env, elements);
  }

  g_mutex_lock (&lock);
  g_array_append_val (models, model);
  g_mutex_unlock (&lock);

  return model;
}

static void
model_add_method (Model * self,
                  const gchar * name,
                  jmethodID id,
                  jint modifiers)
{
  GHashTable * members = self->members;
  gchar * key, type;
  const gchar * value;

  if (name[0] == '$')
    key = g_strdup_printf ("_%s", name);
  else
    key = g_strdup (name);

  type = (modifiers & kAccStatic) != 0 ? 's' : 'i';

  value = g_hash_table_lookup (members, key);
  if (value == NULL)
    g_hash_table_insert (members, key, g_strdup_printf ("m:%c0x%zx", type, id));
  else
    g_hash_table_insert (members, key, g_strdup_printf ("%s:%c0x%zx", value, type, id));
}

static void
model_add_field (Model * self,
                 const gchar * name,
                 jfieldID id,
                 jint modifiers)
{
  GHashTable * members = self->members;
  gchar * key, type;

  if (name[0] == '$')
    key = g_strdup_printf ("_%s", name);
  else
    key = g_strdup (name);
  while (g_hash_table_contains (members, key))
  {
    gchar * new_key = g_strdup_printf ("_%s", key);
    g_free (key);
    key = new_key;
  }

  type = (modifiers & kAccStatic) != 0 ? 's' : 'i';

  g_hash_table_insert (members, key, g_strdup_printf ("f:%c0x%zx", type, id));
}

static void
model_free (Model * model)
{
  g_hash_table_unref (model->members);

  g_free (model);
}

gboolean
model_has (Model * self,
           const gchar * member)
{
  return g_hash_table_contains (self->members, member);
}

const gchar *
model_find (Model * self,
            const gchar * member)
{
  return g_hash_table_lookup (self->members, member);
}

gchar *
model_list (Model * self)
{
  GString * result;
  GHashTableIter iter;
  guint i;
  const gchar * name;

  result = g_string_sized_new (128);

  g_string_append_c (result, '[');

  g_hash_table_iter_init (&iter, self->members);
  for (i = 0; g_hash_table_iter_next (&iter, (gpointer *) &name, NULL); i++)
  {
    if (i > 0)
      g_string_append_c (result, ',');

    g_string_append_c (result, '"');
    g_string_append (result, name);
    g_string_append_c (result, '"');
  }

  g_string_append_c (result, ']');

  return g_string_free (result, FALSE);
}

gchar *
enumerate_methods_art (const gchar * class_query,
                       const gchar * method_query,
                       jboolean include_signature,
                       jboolean ignore_case,
                       jboolean skip_system_classes)
{
  gchar * result;
  EnumerateMethodsContext ctx;
  ArtClassVisitor visitor;
  ArtClassVisitorVTable visitor_vtable = { NULL, };

  ctx.class_query = make_pattern_spec (class_query, ignore_case);
  ctx.method_query = make_pattern_spec (method_query, ignore_case);
  ctx.include_signature = include_signature;
  ctx.ignore_case = ignore_case;
  ctx.skip_system_classes = skip_system_classes;
  ctx.groups = g_hash_table_new_full (NULL, NULL, NULL, NULL);

  visitor.vtable = &visitor_vtable;
  visitor.user_data = &ctx;

  visitor_vtable.visit = collect_matching_class_methods;

  art_api.visit_classes (art_api.linker, &visitor);

  result = finalize_method_groups_to_json (ctx.groups);

  g_hash_table_unref (ctx.groups);
  g_pattern_spec_free (ctx.method_query);
  g_pattern_spec_free (ctx.class_query);

  return result;
}

static jboolean
collect_matching_class_methods (ArtClassVisitor * self,
                                ArtClass * klass)
{
  EnumerateMethodsContext * ctx = self->user_data;
  const char * descriptor;
  StdString descriptor_storage = { 0, };
  gchar * class_name = NULL;
  gchar * class_name_copy = NULL;
  const gchar * normalized_class_name;
  JsonBuilder * group;
  size_t class_name_length;
  GHashTable * seen_method_names;
  gpointer elements;
  guint n, i;

  if (ctx->skip_system_classes && klass->class_loader == 0)
    goto skip_class;

  descriptor = art_api.get_class_descriptor (klass, &descriptor_storage);
  if (descriptor[0] != 'L')
    goto skip_class;

  class_name = class_name_from_signature (descriptor);

  if (ctx->ignore_case)
  {
    class_name_copy = g_utf8_strdown (class_name, -1);
    normalized_class_name = class_name_copy;
  }
  else
  {
    normalized_class_name = class_name;
  }

  if (!g_pattern_match_string (ctx->class_query, normalized_class_name))
    goto skip_class;

  group = NULL;
  class_name_length = strlen (class_name);
  seen_method_names = ctx->include_signature ? NULL : g_hash_table_new_full (g_str_hash, g_str_equal, g_free, NULL);

  elements = read_art_array (klass, art_api.class_offset_methods, sizeof (gsize), NULL);
  n = *(guint16 *) ((gpointer) klass + art_api.class_offset_copied_methods_offset);
  for (i = 0; i != n; i++)
  {
    ArtMethod * method;
    guint32 access_flags;
    jboolean is_constructor;
    StdString method_name = { 0, };
    const gchar * bare_method_name;
    gchar * bare_method_name_copy = NULL;
    const gchar * normalized_method_name;
    gchar * normalized_method_name_copy = NULL;

    method = elements + (i * art_api.method_size);

    access_flags = *(guint32 *) ((gpointer) method + art_api.method_offset_access_flags);
    is_constructor = (access_flags & kAccConstructor) != 0;

    art_api.pretty_method (&method_name, method, ctx->include_signature);
    bare_method_name = std_string_c_str (&method_name);
    if (ctx->include_signature)
    {
      const gchar * return_type_end, * name_begin;
      GString * name;

      return_type_end = strchr (bare_method_name, ' ');
      name_begin = return_type_end + 1 + class_name_length + 1;
      if (is_constructor && g_str_has_prefix (name_begin, "<clinit>"))
        goto skip_method;

      name = g_string_sized_new (64);

      if (is_constructor)
      {
        g_string_append (name, "$init");
        g_string_append (name, strchr (name_begin, '>') + 1);
      }
      else
      {
        g_string_append (name, name_begin);
      }
      g_string_append (name, ": ");
      g_string_append_len (name, bare_method_name, return_type_end - bare_method_name);

      bare_method_name_copy = g_string_free (name, FALSE);
      bare_method_name = bare_method_name_copy;
    }
    else
    {
      const gchar * name_begin;

      name_begin = bare_method_name + class_name_length + 1;
      if (is_constructor && strcmp (name_begin, "<clinit>") == 0)
        goto skip_method;

      if (is_constructor)
        bare_method_name = "$init";
      else
        bare_method_name += class_name_length + 1;
    }

    if (seen_method_names != NULL && g_hash_table_contains (seen_method_names, bare_method_name))
      goto skip_method;

    if (ctx->ignore_case)
    {
      normalized_method_name_copy = g_utf8_strdown (bare_method_name, -1);
      normalized_method_name = normalized_method_name_copy;
    }
    else
    {
      normalized_method_name = bare_method_name;
    }

    if (!g_pattern_match_string (ctx->method_query, normalized_method_name))
      goto skip_method;

    if (group == NULL)
    {
      group = g_hash_table_lookup (ctx->groups, GUINT_TO_POINTER (klass->class_loader));
      if (group == NULL)
      {
        group = json_builder_new_immutable ();
        g_hash_table_insert (ctx->groups, GUINT_TO_POINTER (klass->class_loader), group);

        json_builder_begin_object (group);

        json_builder_set_member_name (group, "loader");
        json_builder_add_int_value (group, klass->class_loader);

        json_builder_set_member_name (group, "classes");
        json_builder_begin_array (group);
      }

      json_builder_begin_object (group);

      json_builder_set_member_name (group, "name");
      json_builder_add_string_value (group, class_name);

      json_builder_set_member_name (group, "methods");
      json_builder_begin_array (group);
    }

    json_builder_add_string_value (group, bare_method_name);

    if (seen_method_names != NULL)
      g_hash_table_add (seen_method_names, g_strdup (bare_method_name));

skip_method:
    g_free (normalized_method_name_copy);
    g_free (bare_method_name_copy);
    std_string_destroy (&method_name);
  }

  if (seen_method_names != NULL)
    g_hash_table_unref (seen_method_names);

  if (group == NULL)
    goto skip_class;

  json_builder_end_array (group);
  json_builder_end_object (group);

skip_class:
  g_free (class_name_copy);
  g_free (class_name);
  std_string_destroy (&descriptor_storage);

  return TRUE;
}

gchar *
enumerate_methods_jvm (const gchar * class_query,
                       const gchar * method_query,
                       jboolean include_signature,
                       jboolean ignore_case,
                       jboolean skip_system_classes,
                       JNIEnv * env,
                       jvmtiEnv * jvmti)
{
  gchar * result;
  GPatternSpec * class_pattern, * method_pattern;
  GHashTable * groups;
  gpointer * ef = env->functions;
  jobject (* new_global_ref) (JNIEnv *, jobject) = ef[21];
  void (* delete_local_ref) (JNIEnv *, jobject) = ef[23];
  jboolean (* is_same_object) (JNIEnv *, jobject, jobject) = ef[24];
  gpointer * jf = jvmti->functions - 1;
  jvmtiError (* deallocate) (jvmtiEnv *, void * mem) = jf[47];
  jvmtiError (* get_class_signature) (jvmtiEnv *, jclass, char **, char **) = jf[48];
  jvmtiError (* get_class_methods) (jvmtiEnv *, jclass, jint *, jmethodID **) = jf[52];
  jvmtiError (* get_class_loader) (jvmtiEnv *, jclass, jobject *) = jf[57];
  jvmtiError (* get_method_name) (jvmtiEnv *, jmethodID, char **, char **, char **) = jf[64];
  jvmtiError (* get_loaded_classes) (jvmtiEnv *, jint *, jclass **) = jf[78];
  jint class_count, class_index;
  jclass * classes;

  class_pattern = make_pattern_spec (class_query, ignore_case);
  method_pattern = make_pattern_spec (method_query, ignore_case);
  groups = g_hash_table_new_full (NULL, NULL, NULL, NULL);

  if (get_loaded_classes (jvmti, &class_count, &classes) != JVMTI_ERROR_NONE)
    goto emit_results;

  for (class_index = 0; class_index != class_count; class_index++)
  {
    jclass klass = classes[class_index];
    jobject loader = NULL;
    gboolean have_loader = FALSE;
    char * signature = NULL;
    gchar * class_name = NULL;
    gchar * class_name_copy = NULL;
    const gchar * normalized_class_name;
    jint method_count, method_index;
    jmethodID * methods = NULL;
    JsonBuilder * group = NULL;
    GHashTable * seen_method_names = NULL;

    if (skip_system_classes)
    {
      if (get_class_loader (jvmti, klass, &loader) != JVMTI_ERROR_NONE)
        goto skip_class;
      have_loader = TRUE;

      if (loader == NULL)
        goto skip_class;
    }

    if (get_class_signature (jvmti, klass, &signature, NULL) != JVMTI_ERROR_NONE)
      goto skip_class;

    class_name = class_name_from_signature (signature);

    if (ignore_case)
    {
      class_name_copy = g_utf8_strdown (class_name, -1);
      normalized_class_name = class_name_copy;
    }
    else
    {
      normalized_class_name = class_name;
    }

    if (!g_pattern_match_string (class_pattern, normalized_class_name))
      goto skip_class;

    if (get_class_methods (jvmti, klass, &method_count, &methods) != JVMTI_ERROR_NONE)
      goto skip_class;

    if (!include_signature)
      seen_method_names = g_hash_table_new_full (g_str_hash, g_str_equal, g_free, NULL);

    for (method_index = 0; method_index != method_count; method_index++)
    {
      jmethodID method = methods[method_index];
      const gchar * method_name;
      char * method_name_value = NULL;
      char * method_signature_value = NULL;
      gchar * method_name_copy = NULL;
      const gchar * normalized_method_name;
      gchar * normalized_method_name_copy = NULL;

      if (get_method_name (jvmti, method, &method_name_value, include_signature ? &method_signature_value : NULL, NULL) != JVMTI_ERROR_NONE)
        goto skip_method;
      method_name = method_name_value;

      if (method_name[0] == '<')
      {
        if (strcmp (method_name, "<init>") == 0)
          method_name = "$init";
        else if (strcmp (method_name, "<clinit>") == 0)
          goto skip_method;
      }

      if (include_signature)
      {
        method_name_copy = format_method_signature (method_name, method_signature_value);
        method_name = method_name_copy;
      }

      if (seen_method_names != NULL && g_hash_table_contains (seen_method_names, method_name))
        goto skip_method;

      if (ignore_case)
      {
        normalized_method_name_copy = g_utf8_strdown (method_name, -1);
        normalized_method_name = normalized_method_name_copy;
      }
      else
      {
        normalized_method_name = method_name;
      }

      if (!g_pattern_match_string (method_pattern, normalized_method_name))
        goto skip_method;

      if (group == NULL)
      {
        if (!have_loader && get_class_loader (jvmti, klass, &loader) != JVMTI_ERROR_NONE)
          goto skip_method;

        if (loader == NULL)
        {
          group = g_hash_table_lookup (groups, NULL);
        }
        else
        {
          GHashTableIter iter;
          jobject cur_loader;
          JsonBuilder * cur_group;

          g_hash_table_iter_init (&iter, groups);
          while (g_hash_table_iter_next (&iter, (gpointer *) &cur_loader, (gpointer *) &cur_group))
          {
            if (cur_loader != NULL && is_same_object (env, cur_loader, loader))
            {
              group = cur_group;
              break;
            }
          }
        }

        if (group == NULL)
        {
          jobject l;
          gchar * str;

          l = (loader != NULL) ? new_global_ref (env, loader) : NULL;

          group = json_builder_new_immutable ();
          g_hash_table_insert (groups, l, group);

          json_builder_begin_object (group);

          json_builder_set_member_name (group, "loader");
          str = g_strdup_printf ("0x%" G_GSIZE_MODIFIER "x", GPOINTER_TO_SIZE (l));
          json_builder_add_string_value (group, str);
          g_free (str);

          json_builder_set_member_name (group, "classes");
          json_builder_begin_array (group);
        }

        json_builder_begin_object (group);

        json_builder_set_member_name (group, "name");
        json_builder_add_string_value (group, class_name);

        json_builder_set_member_name (group, "methods");
        json_builder_begin_array (group);
      }

      json_builder_add_string_value (group, method_name);

      if (seen_method_names != NULL)
        g_hash_table_add (seen_method_names, g_strdup (method_name));

skip_method:
      g_free (normalized_method_name_copy);
      g_free (method_name_copy);
      deallocate (jvmti, method_signature_value);
      deallocate (jvmti, method_name_value);
    }

skip_class:
    if (group != NULL)
    {
      json_builder_end_array (group);
      json_builder_end_object (group);
    }

    if (seen_method_names != NULL)
      g_hash_table_unref (seen_method_names);

    deallocate (jvmti, methods);

    g_free (class_name_copy);
    g_free (class_name);
    deallocate (jvmti, signature);

    if (loader != NULL)
      delete_local_ref (env, loader);

    delete_local_ref (env, klass);
  }

  deallocate (jvmti, classes);

emit_results:
  result = finalize_method_groups_to_json (groups);

  g_hash_table_unref (groups);
  g_pattern_spec_free (method_pattern);
  g_pattern_spec_free (class_pattern);

  return result;
}

static gchar *
finalize_method_groups_to_json (GHashTable * groups)
{
  GString * result;
  GHashTableIter iter;
  guint i;
  JsonBuilder * group;

  result = g_string_sized_new (1024);

  g_string_append_c (result, '[');

  g_hash_table_iter_init (&iter, groups);
  for (i = 0; g_hash_table_iter_next (&iter, NULL, (gpointer *) &group); i++)
  {
    JsonNode * root;
    gchar * json;

    if (i > 0)
      g_string_append_c (result, ',');

    json_builder_end_array (group);
    json_builder_end_object (group);

    root = json_builder_get_root (group);
    json = json_to_string (root, FALSE);
    g_string_append (result, json);
    g_free (json);
    json_node_unref (root);

    g_object_unref (group);
  }

  g_string_append_c (result, ']');

  return g_string_free (result, FALSE);
}

static GPatternSpec *
make_pattern_spec (const gchar * pattern,
                   jboolean ignore_case)
{
  GPatternSpec * spec;

  if (ignore_case)
  {
    gchar * str = g_utf8_strdown (pattern, -1);
    spec = g_pattern_spec_new (str);
    g_free (str);
  }
  else
  {
    spec = g_pattern_spec_new (pattern);
  }

  return spec;
}

static gchar *
class_name_from_signature (const gchar * descriptor)
{
  gchar * result, * c;

  result = g_strdup (descriptor + 1);

  for (c = result; *c != '\\0'; c++)
  {
    if (*c == '/')
      *c = '.';
  }

  c[-1] = '\\0';

  return result;
}

static gchar *
format_method_signature (const gchar * name,
                         const gchar * signature)
{
  GString * sig;
  const gchar * cursor;
  gint arg_index;

  sig = g_string_sized_new (128);

  g_string_append (sig, name);

  cursor = signature;
  arg_index = -1;
  while (TRUE)
  {
    const gchar c = *cursor;

    if (c == '(')
    {
      g_string_append_c (sig, c);
      cursor++;
      arg_index = 0;
    }
    else if (c == ')')
    {
      g_string_append_c (sig, c);
      cursor++;
      break;
    }
    else
    {
      if (arg_index >= 1)
        g_string_append (sig, ", ");

      append_type (sig, &cursor);

      if (arg_index != -1)
        arg_index++;
    }
  }

  g_string_append (sig, ": ");
  append_type (sig, &cursor);

  return g_string_free (sig, FALSE);
}

static void
append_type (GString * output,
             const gchar ** type)
{
  const gchar * cursor = *type;

  switch (*cursor)
  {
    case 'Z':
      g_string_append (output, "boolean");
      cursor++;
      break;
    case 'B':
      g_string_append (output, "byte");
      cursor++;
      break;
    case 'C':
      g_string_append (output, "char");
      cursor++;
      break;
    case 'S':
      g_string_append (output, "short");
      cursor++;
      break;
    case 'I':
      g_string_append (output, "int");
      cursor++;
      break;
    case 'J':
      g_string_append (output, "long");
      cursor++;
      break;
    case 'F':
      g_string_append (output, "float");
      cursor++;
      break;
    case 'D':
      g_string_append (output, "double");
      cursor++;
      break;
    case 'V':
      g_string_append (output, "void");
      cursor++;
      break;
    case 'L':
    {
      gchar ch;

      cursor++;
      for (; (ch = *cursor) != ';'; cursor++)
      {
        g_string_append_c (output, (ch != '/') ? ch : '.');
      }
      cursor++;

      break;
    }
    case '[':
      *type = cursor + 1;
      append_type (output, type);
      g_string_append (output, "[]");
      return;
    default:
      g_string_append (output, "BUG");
      cursor++;
  }

  *type = cursor;
}

void
dealloc (gpointer mem)
{
  g_free (mem);
}

static gpointer
read_art_array (gpointer object_base,
                guint field_offset,
                guint length_size,
                guint * length)
{
  gpointer result, header;
  guint n;

  header = GSIZE_TO_POINTER (*(guint64 *) (object_base + field_offset));
  if (header != NULL)
  {
    result = header + length_size;
    if (length_size == sizeof (guint32))
      n = *(guint32 *) header;
    else
      n = *(guint64 *) header;
  }
  else
  {
    result = NULL;
    n = 0;
  }

  if (length != NULL)
    *length = n;

  return result;
}

static void
std_string_destroy (StdString * str)
{
  if ((str->l.capacity & 1) != 0)
    art_api.free (str->l.data);
}

static gchar *
std_string_c_str (StdString * self)
{
  if ((self->l.capacity & 1) != 0)
    return self->l.data;

  return self->s.data;
}
`;
var methodQueryPattern = /(.+)!([^/]+)\/?([isu]+)?/;
var cm = null;
var unwrap = null;
var Model = class _Model {
  static build(handle2, env2) {
    ensureInitialized(env2);
    return unwrap(handle2, env2, (object) => {
      return new _Model(cm.new(handle2, object, env2));
    });
  }
  static enumerateMethods(query, api3, env2) {
    ensureInitialized(env2);
    const params = query.match(methodQueryPattern);
    if (params === null) {
      throw new Error("Invalid query; format is: class!method -- see documentation of Java.enumerateMethods(query) for details");
    }
    const classQuery = Memory.allocUtf8String(params[1]);
    const methodQuery = Memory.allocUtf8String(params[2]);
    let includeSignature = false;
    let ignoreCase = false;
    let skipSystemClasses = false;
    const modifiers2 = params[3];
    if (modifiers2 !== void 0) {
      includeSignature = modifiers2.indexOf("s") !== -1;
      ignoreCase = modifiers2.indexOf("i") !== -1;
      skipSystemClasses = modifiers2.indexOf("u") !== -1;
    }
    let result;
    if (api3.flavor === "jvm") {
      const json = cm.enumerateMethodsJvm(
        classQuery,
        methodQuery,
        boolToNative(includeSignature),
        boolToNative(ignoreCase),
        boolToNative(skipSystemClasses),
        env2,
        api3.jvmti
      );
      try {
        result = JSON.parse(json.readUtf8String()).map((group) => {
          const loaderRef = ptr(group.loader);
          group.loader = !loaderRef.isNull() ? loaderRef : null;
          return group;
        });
      } finally {
        cm.dealloc(json);
      }
    } else {
      withRunnableArtThread(env2.vm, env2, (thread) => {
        const json = cm.enumerateMethodsArt(
          classQuery,
          methodQuery,
          boolToNative(includeSignature),
          boolToNative(ignoreCase),
          boolToNative(skipSystemClasses)
        );
        try {
          const addGlobalReference = api3["art::JavaVMExt::AddGlobalRef"];
          const { vm: vmHandle } = api3;
          result = JSON.parse(json.readUtf8String()).map((group) => {
            const loaderObj = group.loader;
            group.loader = loaderObj !== 0 ? addGlobalReference(vmHandle, thread, ptr(loaderObj)) : null;
            return group;
          });
        } finally {
          cm.dealloc(json);
        }
      });
    }
    return result;
  }
  constructor(handle2) {
    this.handle = handle2;
  }
  has(member) {
    return cm.has(this.handle, Memory.allocUtf8String(member)) !== 0;
  }
  find(member) {
    return cm.find(this.handle, Memory.allocUtf8String(member)).readUtf8String();
  }
  list() {
    const str = cm.list(this.handle);
    try {
      return JSON.parse(str.readUtf8String());
    } finally {
      cm.dealloc(str);
    }
  }
};
function ensureInitialized(env2) {
  if (cm === null) {
    cm = compileModule(env2);
    unwrap = makeHandleUnwrapper(cm, env2.vm);
  }
}
function compileModule(env2) {
  const { pointerSize: pointerSize12 } = Process;
  const lockSize = 8;
  const modelsSize = pointerSize12;
  const javaApiSize = 6 * pointerSize12;
  const artApiSize = 10 * 4 + 5 * pointerSize12;
  const dataSize = lockSize + modelsSize + javaApiSize + artApiSize;
  const data = Memory.alloc(dataSize);
  const lock = data;
  const models = lock.add(lockSize);
  const javaApi = models.add(modelsSize);
  const { getDeclaredMethods, getDeclaredFields } = env2.javaLangClass();
  const method2 = env2.javaLangReflectMethod();
  const field = env2.javaLangReflectField();
  let j = javaApi;
  [
    getDeclaredMethods,
    getDeclaredFields,
    method2.getName,
    method2.getModifiers,
    field.getName,
    field.getModifiers
  ].forEach((value) => {
    j = j.writePointer(value).add(pointerSize12);
  });
  const artApi = javaApi.add(javaApiSize);
  const { vm: vm3 } = env2;
  const artClass = getArtClassSpec(vm3);
  if (artClass !== null) {
    const c = artClass.offset;
    const m2 = getArtMethodSpec(vm3);
    const f2 = getArtFieldSpec(vm3);
    let s = artApi;
    [
      1,
      c.ifields,
      c.methods,
      c.sfields,
      c.copiedMethodsOffset,
      m2.size,
      m2.offset.accessFlags,
      f2.size,
      f2.offset.accessFlags,
      4294967295
    ].forEach((value) => {
      s = s.writeUInt(value).add(4);
    });
    const api3 = getApi();
    [
      api3.artClassLinker.address,
      api3["art::ClassLinker::VisitClasses"],
      api3["art::mirror::Class::GetDescriptor"],
      api3["art::ArtMethod::PrettyMethod"],
      Process.getModuleByName("libc.so").getExportByName("free")
    ].forEach((value, i) => {
      if (value === void 0) {
        value = NULL;
      }
      s = s.writePointer(value).add(pointerSize12);
    });
  }
  const cm2 = new CModule(code2, {
    lock,
    models,
    java_api: javaApi,
    art_api: artApi
  });
  const reentrantOptions = { exceptions: "propagate" };
  const fastOptions = { exceptions: "propagate", scheduling: "exclusive" };
  return {
    handle: cm2,
    mode: artClass !== null ? "full" : "basic",
    new: new NativeFunction(cm2.model_new, "pointer", ["pointer", "pointer", "pointer"], reentrantOptions),
    has: new NativeFunction(cm2.model_has, "bool", ["pointer", "pointer"], fastOptions),
    find: new NativeFunction(cm2.model_find, "pointer", ["pointer", "pointer"], fastOptions),
    list: new NativeFunction(cm2.model_list, "pointer", ["pointer"], fastOptions),
    enumerateMethodsArt: new NativeFunction(
      cm2.enumerate_methods_art,
      "pointer",
      ["pointer", "pointer", "bool", "bool", "bool"],
      reentrantOptions
    ),
    enumerateMethodsJvm: new NativeFunction(cm2.enumerate_methods_jvm, "pointer", [
      "pointer",
      "pointer",
      "bool",
      "bool",
      "bool",
      "pointer",
      "pointer"
    ], reentrantOptions),
    dealloc: new NativeFunction(cm2.dealloc, "void", ["pointer"], fastOptions)
  };
}
function makeHandleUnwrapper(cm2, vm3) {
  if (cm2.mode === "basic") {
    return nullUnwrap;
  }
  const decodeGlobal = getApi()["art::JavaVMExt::DecodeGlobal"];
  return function(handle2, env2, fn) {
    let result;
    withRunnableArtThread(vm3, env2, (thread) => {
      const object = decodeGlobal(vm3, thread, handle2);
      result = fn(object);
    });
    return result;
  };
}
function nullUnwrap(handle2, env2, fn) {
  return fn(NULL);
}
function boolToNative(val) {
  return val ? 1 : 0;
}

// node_modules/frida-java-bridge/lib/lru.js
var LRU = class {
  constructor(capacity, destroy3) {
    this.items = /* @__PURE__ */ new Map();
    this.capacity = capacity;
    this.destroy = destroy3;
  }
  dispose(env2) {
    const { items, destroy: destroy3 } = this;
    items.forEach((val) => {
      destroy3(val, env2);
    });
    items.clear();
  }
  get(key) {
    const { items } = this;
    const item = items.get(key);
    if (item !== void 0) {
      items.delete(key);
      items.set(key, item);
    }
    return item;
  }
  set(key, val, env2) {
    const { items } = this;
    const existingVal = items.get(key);
    if (existingVal !== void 0) {
      items.delete(key);
      this.destroy(existingVal, env2);
    } else if (items.size === this.capacity) {
      const oldestKey = items.keys().next().value;
      const oldestVal = items.get(oldestKey);
      items.delete(oldestKey);
      this.destroy(oldestVal, env2);
    }
    items.set(key, val);
  }
};

// node_modules/frida-java-bridge/lib/mkdex.js
var kAccPublic2 = 1;
var kAccNative2 = 256;
var kAccConstructor = 65536;
var kEndianTag = 305419896;
var kClassDefSize = 32;
var kProtoIdSize = 12;
var kFieldIdSize = 8;
var kMethodIdSize = 8;
var kTypeIdSize = 4;
var kStringIdSize = 4;
var kMapItemSize = 12;
var TYPE_HEADER_ITEM = 0;
var TYPE_STRING_ID_ITEM = 1;
var TYPE_TYPE_ID_ITEM = 2;
var TYPE_PROTO_ID_ITEM = 3;
var TYPE_FIELD_ID_ITEM = 4;
var TYPE_METHOD_ID_ITEM = 5;
var TYPE_CLASS_DEF_ITEM = 6;
var TYPE_MAP_LIST = 4096;
var TYPE_TYPE_LIST = 4097;
var TYPE_ANNOTATION_SET_ITEM = 4099;
var TYPE_CLASS_DATA_ITEM = 8192;
var TYPE_CODE_ITEM = 8193;
var TYPE_STRING_DATA_ITEM = 8194;
var TYPE_DEBUG_INFO_ITEM = 8195;
var TYPE_ANNOTATION_ITEM = 8196;
var TYPE_ANNOTATIONS_DIRECTORY_ITEM = 8198;
var VALUE_TYPE = 24;
var VALUE_ARRAY = 28;
var VISIBILITY_SYSTEM = 2;
var kDefaultConstructorSize = 24;
var kDefaultConstructorDebugInfo = Buffer2.from([3, 0, 7, 14, 0]);
var kDalvikAnnotationTypeThrows = "Ldalvik/annotation/Throws;";
var kNullTerminator = Buffer2.from([0]);
function mkdex(spec) {
  const builder = new DexBuilder();
  const fullSpec = Object.assign({}, spec);
  builder.addClass(fullSpec);
  return builder.build();
}
var DexBuilder = class {
  constructor() {
    this.classes = [];
  }
  addClass(spec) {
    this.classes.push(spec);
  }
  build() {
    const model = computeModel(this.classes);
    const {
      classes,
      interfaces,
      fields,
      methods,
      protos,
      parameters,
      annotationDirectories,
      annotationSets,
      throwsAnnotations,
      types: types3,
      strings
    } = model;
    let offset = 0;
    const headerOffset = 0;
    const checksumOffset = 8;
    const signatureOffset = 12;
    const signatureSize = 20;
    const headerSize = 112;
    offset += headerSize;
    const stringIdsOffset = offset;
    const stringIdsSize = strings.length * kStringIdSize;
    offset += stringIdsSize;
    const typeIdsOffset = offset;
    const typeIdsSize = types3.length * kTypeIdSize;
    offset += typeIdsSize;
    const protoIdsOffset = offset;
    const protoIdsSize = protos.length * kProtoIdSize;
    offset += protoIdsSize;
    const fieldIdsOffset = offset;
    const fieldIdsSize = fields.length * kFieldIdSize;
    offset += fieldIdsSize;
    const methodIdsOffset = offset;
    const methodIdsSize = methods.length * kMethodIdSize;
    offset += methodIdsSize;
    const classDefsOffset = offset;
    const classDefsSize = classes.length * kClassDefSize;
    offset += classDefsSize;
    const dataOffset = offset;
    const annotationSetOffsets = annotationSets.map((set) => {
      const setOffset = offset;
      set.offset = setOffset;
      offset += 4 + set.items.length * 4;
      return setOffset;
    });
    const javaCodeItems = classes.reduce((result, klass) => {
      const constructorMethods = klass.classData.constructorMethods;
      constructorMethods.forEach((method2) => {
        const [, accessFlags, superConstructor] = method2;
        if ((accessFlags & kAccNative2) === 0 && superConstructor >= 0) {
          method2.push(offset);
          result.push({ offset, superConstructor });
          offset += kDefaultConstructorSize;
        }
      });
      return result;
    }, []);
    annotationDirectories.forEach((dir) => {
      dir.offset = offset;
      offset += 16 + dir.methods.length * 8;
    });
    const interfaceOffsets = interfaces.map((iface) => {
      offset = align2(offset, 4);
      const ifaceOffset = offset;
      iface.offset = ifaceOffset;
      offset += 4 + 2 * iface.types.length;
      return ifaceOffset;
    });
    const parameterOffsets = parameters.map((param) => {
      offset = align2(offset, 4);
      const paramOffset = offset;
      param.offset = paramOffset;
      offset += 4 + 2 * param.types.length;
      return paramOffset;
    });
    const stringChunks = [];
    const stringOffsets = strings.map((str) => {
      const strOffset = offset;
      const header = Buffer2.from(createUleb128(str.length));
      const data = Buffer2.from(str, "utf8");
      const chunk = Buffer2.concat([header, data, kNullTerminator]);
      stringChunks.push(chunk);
      offset += chunk.length;
      return strOffset;
    });
    const debugInfoOffsets = javaCodeItems.map((codeItem) => {
      const debugOffset = offset;
      offset += kDefaultConstructorDebugInfo.length;
      return debugOffset;
    });
    const throwsAnnotationBlobs = throwsAnnotations.map((annotation) => {
      const blob = makeThrowsAnnotation(annotation);
      annotation.offset = offset;
      offset += blob.length;
      return blob;
    });
    const classDataBlobs = classes.map((klass, index) => {
      klass.classData.offset = offset;
      const blob = makeClassData(klass);
      offset += blob.length;
      return blob;
    });
    const linkSize = 0;
    const linkOffset = 0;
    offset = align2(offset, 4);
    const mapOffset = offset;
    const typeListLength = interfaces.length + parameters.length;
    const mapNumItems = 4 + (fields.length > 0 ? 1 : 0) + 2 + annotationSets.length + javaCodeItems.length + annotationDirectories.length + (typeListLength > 0 ? 1 : 0) + 1 + debugInfoOffsets.length + throwsAnnotations.length + classes.length + 1;
    const mapSize = 4 + mapNumItems * kMapItemSize;
    offset += mapSize;
    const dataSize = offset - dataOffset;
    const fileSize = offset;
    const dex = Buffer2.alloc(fileSize);
    dex.write("dex\n035");
    dex.writeUInt32LE(fileSize, 32);
    dex.writeUInt32LE(headerSize, 36);
    dex.writeUInt32LE(kEndianTag, 40);
    dex.writeUInt32LE(linkSize, 44);
    dex.writeUInt32LE(linkOffset, 48);
    dex.writeUInt32LE(mapOffset, 52);
    dex.writeUInt32LE(strings.length, 56);
    dex.writeUInt32LE(stringIdsOffset, 60);
    dex.writeUInt32LE(types3.length, 64);
    dex.writeUInt32LE(typeIdsOffset, 68);
    dex.writeUInt32LE(protos.length, 72);
    dex.writeUInt32LE(protoIdsOffset, 76);
    dex.writeUInt32LE(fields.length, 80);
    dex.writeUInt32LE(fields.length > 0 ? fieldIdsOffset : 0, 84);
    dex.writeUInt32LE(methods.length, 88);
    dex.writeUInt32LE(methodIdsOffset, 92);
    dex.writeUInt32LE(classes.length, 96);
    dex.writeUInt32LE(classDefsOffset, 100);
    dex.writeUInt32LE(dataSize, 104);
    dex.writeUInt32LE(dataOffset, 108);
    stringOffsets.forEach((offset2, index) => {
      dex.writeUInt32LE(offset2, stringIdsOffset + index * kStringIdSize);
    });
    types3.forEach((id, index) => {
      dex.writeUInt32LE(id, typeIdsOffset + index * kTypeIdSize);
    });
    protos.forEach((proto, index) => {
      const [shortyIndex, returnTypeIndex, params] = proto;
      const protoOffset = protoIdsOffset + index * kProtoIdSize;
      dex.writeUInt32LE(shortyIndex, protoOffset);
      dex.writeUInt32LE(returnTypeIndex, protoOffset + 4);
      dex.writeUInt32LE(params !== null ? params.offset : 0, protoOffset + 8);
    });
    fields.forEach((field, index) => {
      const [classIndex, typeIndex, nameIndex] = field;
      const fieldOffset = fieldIdsOffset + index * kFieldIdSize;
      dex.writeUInt16LE(classIndex, fieldOffset);
      dex.writeUInt16LE(typeIndex, fieldOffset + 2);
      dex.writeUInt32LE(nameIndex, fieldOffset + 4);
    });
    methods.forEach((method2, index) => {
      const [classIndex, protoIndex, nameIndex] = method2;
      const methodOffset = methodIdsOffset + index * kMethodIdSize;
      dex.writeUInt16LE(classIndex, methodOffset);
      dex.writeUInt16LE(protoIndex, methodOffset + 2);
      dex.writeUInt32LE(nameIndex, methodOffset + 4);
    });
    classes.forEach((klass, index) => {
      const { interfaces: interfaces2, annotationsDirectory } = klass;
      const interfacesOffset = interfaces2 !== null ? interfaces2.offset : 0;
      const annotationsOffset = annotationsDirectory !== null ? annotationsDirectory.offset : 0;
      const staticValuesOffset = 0;
      const classOffset = classDefsOffset + index * kClassDefSize;
      dex.writeUInt32LE(klass.index, classOffset);
      dex.writeUInt32LE(klass.accessFlags, classOffset + 4);
      dex.writeUInt32LE(klass.superClassIndex, classOffset + 8);
      dex.writeUInt32LE(interfacesOffset, classOffset + 12);
      dex.writeUInt32LE(klass.sourceFileIndex, classOffset + 16);
      dex.writeUInt32LE(annotationsOffset, classOffset + 20);
      dex.writeUInt32LE(klass.classData.offset, classOffset + 24);
      dex.writeUInt32LE(staticValuesOffset, classOffset + 28);
    });
    annotationSets.forEach((set, index) => {
      const { items } = set;
      const setOffset = annotationSetOffsets[index];
      dex.writeUInt32LE(items.length, setOffset);
      items.forEach((item, index2) => {
        dex.writeUInt32LE(item.offset, setOffset + 4 + index2 * 4);
      });
    });
    javaCodeItems.forEach((codeItem, index) => {
      const { offset: offset2, superConstructor } = codeItem;
      const registersSize = 1;
      const insSize = 1;
      const outsSize = 1;
      const triesSize = 0;
      const insnsSize = 4;
      dex.writeUInt16LE(registersSize, offset2);
      dex.writeUInt16LE(insSize, offset2 + 2);
      dex.writeUInt16LE(outsSize, offset2 + 4);
      dex.writeUInt16LE(triesSize, offset2 + 6);
      dex.writeUInt32LE(debugInfoOffsets[index], offset2 + 8);
      dex.writeUInt32LE(insnsSize, offset2 + 12);
      dex.writeUInt16LE(4208, offset2 + 16);
      dex.writeUInt16LE(superConstructor, offset2 + 18);
      dex.writeUInt16LE(0, offset2 + 20);
      dex.writeUInt16LE(14, offset2 + 22);
    });
    annotationDirectories.forEach((dir) => {
      const dirOffset = dir.offset;
      const classAnnotationsOffset = 0;
      const fieldsSize = 0;
      const annotatedMethodsSize = dir.methods.length;
      const annotatedParametersSize = 0;
      dex.writeUInt32LE(classAnnotationsOffset, dirOffset);
      dex.writeUInt32LE(fieldsSize, dirOffset + 4);
      dex.writeUInt32LE(annotatedMethodsSize, dirOffset + 8);
      dex.writeUInt32LE(annotatedParametersSize, dirOffset + 12);
      dir.methods.forEach((method2, index) => {
        const entryOffset = dirOffset + 16 + index * 8;
        const [methodIndex, annotationSet] = method2;
        dex.writeUInt32LE(methodIndex, entryOffset);
        dex.writeUInt32LE(annotationSet.offset, entryOffset + 4);
      });
    });
    interfaces.forEach((iface, index) => {
      const ifaceOffset = interfaceOffsets[index];
      dex.writeUInt32LE(iface.types.length, ifaceOffset);
      iface.types.forEach((type, typeIndex) => {
        dex.writeUInt16LE(type, ifaceOffset + 4 + typeIndex * 2);
      });
    });
    parameters.forEach((param, index) => {
      const paramOffset = parameterOffsets[index];
      dex.writeUInt32LE(param.types.length, paramOffset);
      param.types.forEach((type, typeIndex) => {
        dex.writeUInt16LE(type, paramOffset + 4 + typeIndex * 2);
      });
    });
    stringChunks.forEach((chunk, index) => {
      chunk.copy(dex, stringOffsets[index]);
    });
    debugInfoOffsets.forEach((debugInfoOffset) => {
      kDefaultConstructorDebugInfo.copy(dex, debugInfoOffset);
    });
    throwsAnnotationBlobs.forEach((annotationBlob, index) => {
      annotationBlob.copy(dex, throwsAnnotations[index].offset);
    });
    classDataBlobs.forEach((classDataBlob, index) => {
      classDataBlob.copy(dex, classes[index].classData.offset);
    });
    dex.writeUInt32LE(mapNumItems, mapOffset);
    const mapItems = [
      [TYPE_HEADER_ITEM, 1, headerOffset],
      [TYPE_STRING_ID_ITEM, strings.length, stringIdsOffset],
      [TYPE_TYPE_ID_ITEM, types3.length, typeIdsOffset],
      [TYPE_PROTO_ID_ITEM, protos.length, protoIdsOffset]
    ];
    if (fields.length > 0) {
      mapItems.push([TYPE_FIELD_ID_ITEM, fields.length, fieldIdsOffset]);
    }
    mapItems.push([TYPE_METHOD_ID_ITEM, methods.length, methodIdsOffset]);
    mapItems.push([TYPE_CLASS_DEF_ITEM, classes.length, classDefsOffset]);
    annotationSets.forEach((set, index) => {
      mapItems.push([TYPE_ANNOTATION_SET_ITEM, set.items.length, annotationSetOffsets[index]]);
    });
    javaCodeItems.forEach((codeItem) => {
      mapItems.push([TYPE_CODE_ITEM, 1, codeItem.offset]);
    });
    annotationDirectories.forEach((dir) => {
      mapItems.push([TYPE_ANNOTATIONS_DIRECTORY_ITEM, 1, dir.offset]);
    });
    if (typeListLength > 0) {
      mapItems.push([TYPE_TYPE_LIST, typeListLength, interfaceOffsets.concat(parameterOffsets)[0]]);
    }
    mapItems.push([TYPE_STRING_DATA_ITEM, strings.length, stringOffsets[0]]);
    debugInfoOffsets.forEach((debugInfoOffset) => {
      mapItems.push([TYPE_DEBUG_INFO_ITEM, 1, debugInfoOffset]);
    });
    throwsAnnotations.forEach((annotation) => {
      mapItems.push([TYPE_ANNOTATION_ITEM, 1, annotation.offset]);
    });
    classes.forEach((klass) => {
      mapItems.push([TYPE_CLASS_DATA_ITEM, 1, klass.classData.offset]);
    });
    mapItems.push([TYPE_MAP_LIST, 1, mapOffset]);
    mapItems.forEach((item, index) => {
      const [type, size, offset2] = item;
      const itemOffset = mapOffset + 4 + index * kMapItemSize;
      dex.writeUInt16LE(type, itemOffset);
      dex.writeUInt32LE(size, itemOffset + 4);
      dex.writeUInt32LE(offset2, itemOffset + 8);
    });
    const hash = new Checksum("sha1");
    hash.update(dex.slice(signatureOffset + signatureSize));
    Buffer2.from(hash.getDigest()).copy(dex, signatureOffset);
    dex.writeUInt32LE(adler32(dex, signatureOffset), checksumOffset);
    return dex;
  }
};
function makeClassData(klass) {
  const { instanceFields, constructorMethods, virtualMethods } = klass.classData;
  const staticFieldsSize = 0;
  return Buffer2.from([
    staticFieldsSize
  ].concat(createUleb128(instanceFields.length)).concat(createUleb128(constructorMethods.length)).concat(createUleb128(virtualMethods.length)).concat(instanceFields.reduce((result, [indexDiff, accessFlags]) => {
    return result.concat(createUleb128(indexDiff)).concat(createUleb128(accessFlags));
  }, [])).concat(constructorMethods.reduce((result, [indexDiff, accessFlags, , codeOffset]) => {
    return result.concat(createUleb128(indexDiff)).concat(createUleb128(accessFlags)).concat(createUleb128(codeOffset || 0));
  }, [])).concat(virtualMethods.reduce((result, [indexDiff, accessFlags]) => {
    const codeOffset = 0;
    return result.concat(createUleb128(indexDiff)).concat(createUleb128(accessFlags)).concat([codeOffset]);
  }, [])));
}
function makeThrowsAnnotation(annotation) {
  const { thrownTypes } = annotation;
  return Buffer2.from(
    [
      VISIBILITY_SYSTEM
    ].concat(createUleb128(annotation.type)).concat([1]).concat(createUleb128(annotation.value)).concat([VALUE_ARRAY, thrownTypes.length]).concat(thrownTypes.reduce((result, type) => {
      result.push(VALUE_TYPE, type);
      return result;
    }, []))
  );
}
function computeModel(classes) {
  const strings = /* @__PURE__ */ new Set();
  const types3 = /* @__PURE__ */ new Set();
  const protos = {};
  const fields = [];
  const methods = [];
  const throwsAnnotations = {};
  const javaConstructors = /* @__PURE__ */ new Set();
  const superConstructors = /* @__PURE__ */ new Set();
  classes.forEach((klass) => {
    const { name, superClass, sourceFileName } = klass;
    strings.add("this");
    strings.add(name);
    types3.add(name);
    strings.add(superClass);
    types3.add(superClass);
    strings.add(sourceFileName);
    klass.interfaces.forEach((iface) => {
      strings.add(iface);
      types3.add(iface);
    });
    klass.fields.forEach((field) => {
      const [fieldName, fieldType] = field;
      strings.add(fieldName);
      strings.add(fieldType);
      types3.add(fieldType);
      fields.push([klass.name, fieldType, fieldName]);
    });
    if (!klass.methods.some(([methodName]) => methodName === "<init>")) {
      klass.methods.unshift(["<init>", "V", []]);
      javaConstructors.add(name);
    }
    klass.methods.forEach((method2) => {
      const [methodName, retType2, argTypes2, thrownTypes = [], accessFlags] = method2;
      strings.add(methodName);
      const protoId = addProto(retType2, argTypes2);
      let throwsAnnotationId = null;
      if (thrownTypes.length > 0) {
        const typesNormalized = thrownTypes.slice();
        typesNormalized.sort();
        throwsAnnotationId = typesNormalized.join("|");
        let throwsAnnotation = throwsAnnotations[throwsAnnotationId];
        if (throwsAnnotation === void 0) {
          throwsAnnotation = {
            id: throwsAnnotationId,
            types: typesNormalized
          };
          throwsAnnotations[throwsAnnotationId] = throwsAnnotation;
        }
        strings.add(kDalvikAnnotationTypeThrows);
        types3.add(kDalvikAnnotationTypeThrows);
        thrownTypes.forEach((type) => {
          strings.add(type);
          types3.add(type);
        });
        strings.add("value");
      }
      methods.push([klass.name, protoId, methodName, throwsAnnotationId, accessFlags]);
      if (methodName === "<init>") {
        superConstructors.add(name + "|" + protoId);
        const superConstructorId = superClass + "|" + protoId;
        if (javaConstructors.has(name) && !superConstructors.has(superConstructorId)) {
          methods.push([superClass, protoId, methodName, null, 0]);
          superConstructors.add(superConstructorId);
        }
      }
    });
  });
  function addProto(retType2, argTypes2) {
    const signature2 = [retType2].concat(argTypes2);
    const id = signature2.join("|");
    if (protos[id] !== void 0) {
      return id;
    }
    strings.add(retType2);
    types3.add(retType2);
    argTypes2.forEach((argType) => {
      strings.add(argType);
      types3.add(argType);
    });
    const shorty = signature2.map(typeToShorty).join("");
    strings.add(shorty);
    protos[id] = [id, shorty, retType2, argTypes2];
    return id;
  }
  const stringItems = Array.from(strings);
  stringItems.sort();
  const stringToIndex = stringItems.reduce((result, string, index) => {
    result[string] = index;
    return result;
  }, {});
  const typeItems = Array.from(types3).map((name) => stringToIndex[name]);
  typeItems.sort(compareNumbers);
  const typeToIndex = typeItems.reduce((result, stringIndex, typeIndex) => {
    result[stringItems[stringIndex]] = typeIndex;
    return result;
  }, {});
  const literalProtoItems = Object.keys(protos).map((id) => protos[id]);
  literalProtoItems.sort(compareProtoItems);
  const parameters = {};
  const protoItems = literalProtoItems.map((item) => {
    const [, shorty, retType2, argTypes2] = item;
    let params;
    if (argTypes2.length > 0) {
      const argTypesSig = argTypes2.join("|");
      params = parameters[argTypesSig];
      if (params === void 0) {
        params = {
          types: argTypes2.map((type) => typeToIndex[type]),
          offset: -1
        };
        parameters[argTypesSig] = params;
      }
    } else {
      params = null;
    }
    return [
      stringToIndex[shorty],
      typeToIndex[retType2],
      params
    ];
  });
  const protoToIndex = literalProtoItems.reduce((result, item, index) => {
    const [id] = item;
    result[id] = index;
    return result;
  }, {});
  const parameterItems = Object.keys(parameters).map((id) => parameters[id]);
  const fieldItems = fields.map((field) => {
    const [klass, fieldType, fieldName] = field;
    return [
      typeToIndex[klass],
      typeToIndex[fieldType],
      stringToIndex[fieldName]
    ];
  });
  fieldItems.sort(compareFieldItems);
  const methodItems = methods.map((method2) => {
    const [klass, protoId, name, annotationsId, accessFlags] = method2;
    return [
      typeToIndex[klass],
      protoToIndex[protoId],
      stringToIndex[name],
      annotationsId,
      accessFlags
    ];
  });
  methodItems.sort(compareMethodItems);
  const throwsAnnotationItems = Object.keys(throwsAnnotations).map((id) => throwsAnnotations[id]).map((item) => {
    return {
      id: item.id,
      type: typeToIndex[kDalvikAnnotationTypeThrows],
      value: stringToIndex.value,
      thrownTypes: item.types.map((type) => typeToIndex[type]),
      offset: -1
    };
  });
  const annotationSetItems = throwsAnnotationItems.map((item) => {
    return {
      id: item.id,
      items: [item],
      offset: -1
    };
  });
  const annotationSetIdToIndex = annotationSetItems.reduce((result, item, index) => {
    result[item.id] = index;
    return result;
  }, {});
  const interfaceLists = {};
  const annotationDirectories = [];
  const classItems = classes.map((klass) => {
    const classIndex = typeToIndex[klass.name];
    const accessFlags = kAccPublic2;
    const superClassIndex = typeToIndex[klass.superClass];
    let ifaceList;
    const ifaces = klass.interfaces.map((type) => typeToIndex[type]);
    if (ifaces.length > 0) {
      ifaces.sort(compareNumbers);
      const ifacesId = ifaces.join("|");
      ifaceList = interfaceLists[ifacesId];
      if (ifaceList === void 0) {
        ifaceList = {
          types: ifaces,
          offset: -1
        };
        interfaceLists[ifacesId] = ifaceList;
      }
    } else {
      ifaceList = null;
    }
    const sourceFileIndex = stringToIndex[klass.sourceFileName];
    const classMethods = methodItems.reduce((result, method2, index) => {
      const [holder, protoIndex, name, annotationsId, accessFlags2] = method2;
      if (holder === classIndex) {
        result.push([index, name, annotationsId, protoIndex, accessFlags2]);
      }
      return result;
    }, []);
    let annotationsDirectory = null;
    const methodAnnotations = classMethods.filter(([, , annotationsId]) => {
      return annotationsId !== null;
    }).map(([index, , annotationsId]) => {
      return [index, annotationSetItems[annotationSetIdToIndex[annotationsId]]];
    });
    if (methodAnnotations.length > 0) {
      annotationsDirectory = {
        methods: methodAnnotations,
        offset: -1
      };
      annotationDirectories.push(annotationsDirectory);
    }
    const instanceFields = fieldItems.reduce((result, field, index) => {
      const [holder] = field;
      if (holder === classIndex) {
        result.push([index > 0 ? 1 : 0, kAccPublic2]);
      }
      return result;
    }, []);
    const constructorNameIndex = stringToIndex["<init>"];
    const constructorMethods = classMethods.filter(([, name]) => name === constructorNameIndex).map(([index, , , protoIndex]) => {
      if (javaConstructors.has(klass.name)) {
        let superConstructor = -1;
        const numMethodItems = methodItems.length;
        for (let i = 0; i !== numMethodItems; i++) {
          const [methodClass, methodProto, methodName] = methodItems[i];
          if (methodClass === superClassIndex && methodName === constructorNameIndex && methodProto === protoIndex) {
            superConstructor = i;
            break;
          }
        }
        return [index, kAccPublic2 | kAccConstructor, superConstructor];
      } else {
        return [index, kAccPublic2 | kAccConstructor | kAccNative2, -1];
      }
    });
    const virtualMethods = compressClassMethodIndexes(classMethods.filter(([, name]) => name !== constructorNameIndex).map(([index, , , , accessFlags2]) => {
      return [index, accessFlags2 | kAccPublic2 | kAccNative2];
    }));
    const classData = {
      instanceFields,
      constructorMethods,
      virtualMethods,
      offset: -1
    };
    return {
      index: classIndex,
      accessFlags,
      superClassIndex,
      interfaces: ifaceList,
      sourceFileIndex,
      annotationsDirectory,
      classData
    };
  });
  const interfaceItems = Object.keys(interfaceLists).map((id) => interfaceLists[id]);
  return {
    classes: classItems,
    interfaces: interfaceItems,
    fields: fieldItems,
    methods: methodItems,
    protos: protoItems,
    parameters: parameterItems,
    annotationDirectories,
    annotationSets: annotationSetItems,
    throwsAnnotations: throwsAnnotationItems,
    types: typeItems,
    strings: stringItems
  };
}
function compressClassMethodIndexes(items) {
  let previousIndex = 0;
  return items.map(([index, accessFlags], elementIndex) => {
    let result;
    if (elementIndex === 0) {
      result = [index, accessFlags];
    } else {
      result = [index - previousIndex, accessFlags];
    }
    previousIndex = index;
    return result;
  });
}
function compareNumbers(a, b) {
  return a - b;
}
function compareProtoItems(a, b) {
  const [, , aRetType, aArgTypes] = a;
  const [, , bRetType, bArgTypes] = b;
  if (aRetType < bRetType) {
    return -1;
  }
  if (aRetType > bRetType) {
    return 1;
  }
  const aArgTypesSig = aArgTypes.join("|");
  const bArgTypesSig = bArgTypes.join("|");
  if (aArgTypesSig < bArgTypesSig) {
    return -1;
  }
  if (aArgTypesSig > bArgTypesSig) {
    return 1;
  }
  return 0;
}
function compareFieldItems(a, b) {
  const [aClass, aType, aName] = a;
  const [bClass, bType, bName] = b;
  if (aClass !== bClass) {
    return aClass - bClass;
  }
  if (aName !== bName) {
    return aName - bName;
  }
  return aType - bType;
}
function compareMethodItems(a, b) {
  const [aClass, aProto, aName] = a;
  const [bClass, bProto, bName] = b;
  if (aClass !== bClass) {
    return aClass - bClass;
  }
  if (aName !== bName) {
    return aName - bName;
  }
  return aProto - bProto;
}
function typeToShorty(type) {
  const firstCharacter = type[0];
  return firstCharacter === "L" || firstCharacter === "[" ? "L" : type;
}
function createUleb128(value) {
  if (value <= 127) {
    return [value];
  }
  const result = [];
  let moreSlicesNeeded = false;
  do {
    let slice2 = value & 127;
    value >>= 7;
    moreSlicesNeeded = value !== 0;
    if (moreSlicesNeeded) {
      slice2 |= 128;
    }
    result.push(slice2);
  } while (moreSlicesNeeded);
  return result;
}
function align2(value, alignment) {
  const alignmentDelta = value % alignment;
  if (alignmentDelta === 0) {
    return value;
  }
  return value + alignment - alignmentDelta;
}
function adler32(buffer, offset) {
  let a = 1;
  let b = 0;
  const length = buffer.length;
  for (let i = offset; i < length; i++) {
    a = (a + buffer[i]) % 65521;
    b = (b + a) % 65521;
  }
  return (b << 16 | a) >>> 0;
}
var mkdex_default = mkdex;

// node_modules/frida-java-bridge/lib/types.js
var JNILocalRefType = 1;
var vm = null;
var primitiveArrayHandler = null;
function initialize(_vm) {
  vm = _vm;
}
function getType(typeName, unbox, factory) {
  let type = getPrimitiveType(typeName);
  if (type === null) {
    if (typeName.indexOf("[") === 0) {
      type = getArrayType(typeName, unbox, factory);
    } else {
      if (typeName[0] === "L" && typeName[typeName.length - 1] === ";") {
        typeName = typeName.substring(1, typeName.length - 1);
      }
      type = getObjectType(typeName, unbox, factory);
    }
  }
  return Object.assign({ className: typeName }, type);
}
var primitiveTypes = {
  boolean: {
    name: "Z",
    type: "uint8",
    size: 1,
    byteSize: 1,
    defaultValue: false,
    isCompatible(v) {
      return typeof v === "boolean";
    },
    fromJni(v) {
      return !!v;
    },
    toJni(v) {
      return v ? 1 : 0;
    },
    read(address) {
      return address.readU8();
    },
    write(address, value) {
      address.writeU8(value);
    },
    toString() {
      return this.name;
    }
  },
  byte: {
    name: "B",
    type: "int8",
    size: 1,
    byteSize: 1,
    defaultValue: 0,
    isCompatible(v) {
      return Number.isInteger(v) && v >= -128 && v <= 127;
    },
    fromJni: identity,
    toJni: identity,
    read(address) {
      return address.readS8();
    },
    write(address, value) {
      address.writeS8(value);
    },
    toString() {
      return this.name;
    }
  },
  char: {
    name: "C",
    type: "uint16",
    size: 1,
    byteSize: 2,
    defaultValue: 0,
    isCompatible(v) {
      if (typeof v !== "string" || v.length !== 1) {
        return false;
      }
      const code4 = v.charCodeAt(0);
      return code4 >= 0 && code4 <= 65535;
    },
    fromJni(c) {
      return String.fromCharCode(c);
    },
    toJni(s) {
      return s.charCodeAt(0);
    },
    read(address) {
      return address.readU16();
    },
    write(address, value) {
      address.writeU16(value);
    },
    toString() {
      return this.name;
    }
  },
  short: {
    name: "S",
    type: "int16",
    size: 1,
    byteSize: 2,
    defaultValue: 0,
    isCompatible(v) {
      return Number.isInteger(v) && v >= -32768 && v <= 32767;
    },
    fromJni: identity,
    toJni: identity,
    read(address) {
      return address.readS16();
    },
    write(address, value) {
      address.writeS16(value);
    },
    toString() {
      return this.name;
    }
  },
  int: {
    name: "I",
    type: "int32",
    size: 1,
    byteSize: 4,
    defaultValue: 0,
    isCompatible(v) {
      return Number.isInteger(v) && v >= -2147483648 && v <= 2147483647;
    },
    fromJni: identity,
    toJni: identity,
    read(address) {
      return address.readS32();
    },
    write(address, value) {
      address.writeS32(value);
    },
    toString() {
      return this.name;
    }
  },
  long: {
    name: "J",
    type: "int64",
    size: 2,
    byteSize: 8,
    defaultValue: 0,
    isCompatible(v) {
      return typeof v === "number" || v instanceof Int64;
    },
    fromJni: identity,
    toJni: identity,
    read(address) {
      return address.readS64();
    },
    write(address, value) {
      address.writeS64(value);
    },
    toString() {
      return this.name;
    }
  },
  float: {
    name: "F",
    type: "float",
    size: 1,
    byteSize: 4,
    defaultValue: 0,
    isCompatible(v) {
      return typeof v === "number";
    },
    fromJni: identity,
    toJni: identity,
    read(address) {
      return address.readFloat();
    },
    write(address, value) {
      address.writeFloat(value);
    },
    toString() {
      return this.name;
    }
  },
  double: {
    name: "D",
    type: "double",
    size: 2,
    byteSize: 8,
    defaultValue: 0,
    isCompatible(v) {
      return typeof v === "number";
    },
    fromJni: identity,
    toJni: identity,
    read(address) {
      return address.readDouble();
    },
    write(address, value) {
      address.writeDouble(value);
    },
    toString() {
      return this.name;
    }
  },
  void: {
    name: "V",
    type: "void",
    size: 0,
    byteSize: 0,
    defaultValue: void 0,
    isCompatible(v) {
      return v === void 0;
    },
    fromJni() {
      return void 0;
    },
    toJni() {
      return NULL;
    },
    toString() {
      return this.name;
    }
  }
};
var primitiveTypesNames = new Set(Object.values(primitiveTypes).map((t) => t.name));
function getPrimitiveType(name) {
  const result = primitiveTypes[name];
  return result !== void 0 ? result : null;
}
function getObjectType(typeName, unbox, factory) {
  const cache = factory._types[unbox ? 1 : 0];
  let type = cache[typeName];
  if (type !== void 0) {
    return type;
  }
  if (typeName === "java.lang.Object") {
    type = getJavaLangObjectType(factory);
  } else {
    type = getAnyObjectType(typeName, unbox, factory);
  }
  cache[typeName] = type;
  return type;
}
function getJavaLangObjectType(factory) {
  return {
    name: "Ljava/lang/Object;",
    type: "pointer",
    size: 1,
    defaultValue: NULL,
    isCompatible(v) {
      if (v === null) {
        return true;
      }
      if (v === void 0) {
        return false;
      }
      const isWrapper = v.$h instanceof NativePointer;
      if (isWrapper) {
        return true;
      }
      return typeof v === "string";
    },
    fromJni(h, env2, owned) {
      if (h.isNull()) {
        return null;
      }
      return factory.cast(h, factory.use("java.lang.Object"), owned);
    },
    toJni(o, env2) {
      if (o === null) {
        return NULL;
      }
      if (typeof o === "string") {
        return env2.newStringUtf(o);
      }
      return o.$h;
    }
  };
}
function getAnyObjectType(typeName, unbox, factory) {
  let cachedClass = null;
  let cachedIsInstance = null;
  let cachedIsDefaultString = null;
  function getClass() {
    if (cachedClass === null) {
      cachedClass = factory.use(typeName).class;
    }
    return cachedClass;
  }
  function isInstance(v) {
    const klass = getClass();
    if (cachedIsInstance === null) {
      cachedIsInstance = klass.isInstance.overload("java.lang.Object");
    }
    return cachedIsInstance.call(klass, v);
  }
  function typeIsDefaultString() {
    if (cachedIsDefaultString === null) {
      const x = getClass();
      cachedIsDefaultString = factory.use("java.lang.String").class.isAssignableFrom(x);
    }
    return cachedIsDefaultString;
  }
  return {
    name: makeJniObjectTypeName(typeName),
    type: "pointer",
    size: 1,
    defaultValue: NULL,
    isCompatible(v) {
      if (v === null) {
        return true;
      }
      if (v === void 0) {
        return false;
      }
      const isWrapper = v.$h instanceof NativePointer;
      if (isWrapper) {
        return isInstance(v);
      }
      return typeof v === "string" && typeIsDefaultString();
    },
    fromJni(h, env2, owned) {
      if (h.isNull()) {
        return null;
      }
      if (typeIsDefaultString() && unbox) {
        return env2.stringFromJni(h);
      }
      return factory.cast(h, factory.use(typeName), owned);
    },
    toJni(o, env2) {
      if (o === null) {
        return NULL;
      }
      if (typeof o === "string") {
        return env2.newStringUtf(o);
      }
      return o.$h;
    },
    toString() {
      return this.name;
    }
  };
}
var primitiveArrayTypes = [
  ["Z", "boolean"],
  ["B", "byte"],
  ["C", "char"],
  ["D", "double"],
  ["F", "float"],
  ["I", "int"],
  ["J", "long"],
  ["S", "short"]
].reduce((result, [shorty, name]) => {
  result["[" + shorty] = makePrimitiveArrayType("[" + shorty, name);
  return result;
}, {});
function makePrimitiveArrayType(shorty, name) {
  const envProto = Env.prototype;
  const nameTitled = toTitleCase(name);
  const spec = {
    typeName: name,
    newArray: envProto["new" + nameTitled + "Array"],
    setRegion: envProto["set" + nameTitled + "ArrayRegion"],
    getElements: envProto["get" + nameTitled + "ArrayElements"],
    releaseElements: envProto["release" + nameTitled + "ArrayElements"]
  };
  return {
    name: shorty,
    type: "pointer",
    size: 1,
    defaultValue: NULL,
    isCompatible(v) {
      return isCompatiblePrimitiveArray(v, name);
    },
    fromJni(h, env2, owned) {
      return fromJniPrimitiveArray(h, spec, env2, owned);
    },
    toJni(arr, env2) {
      return toJniPrimitiveArray(arr, spec, env2);
    }
  };
}
function getArrayType(typeName, unbox, factory) {
  const primitiveType = primitiveArrayTypes[typeName];
  if (primitiveType !== void 0) {
    return primitiveType;
  }
  if (typeName.indexOf("[") !== 0) {
    throw new Error("Unsupported type: " + typeName);
  }
  let elementTypeName = typeName.substring(1);
  const elementType = getType(elementTypeName, unbox, factory);
  let numInternalArrays = 0;
  const end = elementTypeName.length;
  while (numInternalArrays !== end && elementTypeName[numInternalArrays] === "[") {
    numInternalArrays++;
  }
  elementTypeName = elementTypeName.substring(numInternalArrays);
  if (elementTypeName[0] === "L" && elementTypeName[elementTypeName.length - 1] === ";") {
    elementTypeName = elementTypeName.substring(1, elementTypeName.length - 1);
  }
  let internalElementTypeName = elementTypeName.replace(/\./g, "/");
  if (primitiveTypesNames.has(internalElementTypeName)) {
    internalElementTypeName = "[".repeat(numInternalArrays) + internalElementTypeName;
  } else {
    internalElementTypeName = "[".repeat(numInternalArrays) + "L" + internalElementTypeName + ";";
  }
  const internalTypeName = "[" + internalElementTypeName;
  elementTypeName = "[".repeat(numInternalArrays) + elementTypeName;
  return {
    name: typeName.replace(/\./g, "/"),
    type: "pointer",
    size: 1,
    defaultValue: NULL,
    isCompatible(v) {
      if (v === null) {
        return true;
      }
      if (typeof v !== "object" || v.length === void 0) {
        return false;
      }
      return v.every(function(element) {
        return elementType.isCompatible(element);
      });
    },
    fromJni(arr, env2, owned) {
      if (arr.isNull()) {
        return null;
      }
      const result = [];
      const n = env2.getArrayLength(arr);
      for (let i = 0; i !== n; i++) {
        const element = env2.getObjectArrayElement(arr, i);
        try {
          result.push(elementType.fromJni(element, env2));
        } finally {
          env2.deleteLocalRef(element);
        }
      }
      try {
        result.$w = factory.cast(arr, factory.use(internalTypeName), owned);
      } catch (e) {
        factory.use("java.lang.reflect.Array").newInstance(factory.use(elementTypeName).class, 0);
        result.$w = factory.cast(arr, factory.use(internalTypeName), owned);
      }
      result.$dispose = disposeObjectArray;
      return result;
    },
    toJni(elements, env2) {
      if (elements === null) {
        return NULL;
      }
      if (!(elements instanceof Array)) {
        throw new Error("Expected an array");
      }
      const wrapper = elements.$w;
      if (wrapper !== void 0) {
        return wrapper.$h;
      }
      const n = elements.length;
      const klassObj = factory.use(elementTypeName);
      const classHandle = klassObj.$borrowClassHandle(env2);
      try {
        const result = env2.newObjectArray(n, classHandle.value, NULL);
        env2.throwIfExceptionPending();
        for (let i = 0; i !== n; i++) {
          const handle2 = elementType.toJni(elements[i], env2);
          try {
            env2.setObjectArrayElement(result, i, handle2);
          } finally {
            if (elementType.type === "pointer" && env2.getObjectRefType(handle2) === JNILocalRefType) {
              env2.deleteLocalRef(handle2);
            }
          }
          env2.throwIfExceptionPending();
        }
        return result;
      } finally {
        classHandle.unref(env2);
      }
    }
  };
}
function disposeObjectArray() {
  const n = this.length;
  for (let i = 0; i !== n; i++) {
    const obj = this[i];
    if (obj === null) {
      continue;
    }
    const dispose2 = obj.$dispose;
    if (dispose2 === void 0) {
      break;
    }
    dispose2.call(obj);
  }
  this.$w.$dispose();
}
function fromJniPrimitiveArray(arr, spec, env2, owned) {
  if (arr.isNull()) {
    return null;
  }
  const type = getPrimitiveType(spec.typeName);
  const length = env2.getArrayLength(arr);
  return new PrimitiveArray(arr, spec, type, length, env2, owned);
}
function toJniPrimitiveArray(arr, spec, env2) {
  if (arr === null) {
    return NULL;
  }
  const handle2 = arr.$h;
  if (handle2 !== void 0) {
    return handle2;
  }
  const length = arr.length;
  const type = getPrimitiveType(spec.typeName);
  const result = spec.newArray.call(env2, length);
  if (result.isNull()) {
    throw new Error("Unable to construct array");
  }
  if (length > 0) {
    const elementSize = type.byteSize;
    const writeElement = type.write;
    const unparseElementValue = type.toJni;
    const elements = Memory.alloc(length * type.byteSize);
    for (let index = 0; index !== length; index++) {
      writeElement(elements.add(index * elementSize), unparseElementValue(arr[index]));
    }
    spec.setRegion.call(env2, result, 0, length, elements);
    env2.throwIfExceptionPending();
  }
  return result;
}
function isCompatiblePrimitiveArray(value, typeName) {
  if (value === null) {
    return true;
  }
  if (value instanceof PrimitiveArray) {
    return value.$s.typeName === typeName;
  }
  const isArrayLike = typeof value === "object" && value.length !== void 0;
  if (!isArrayLike) {
    return false;
  }
  const elementType = getPrimitiveType(typeName);
  return Array.prototype.every.call(value, (element) => elementType.isCompatible(element));
}
function PrimitiveArray(handle2, spec, type, length, env2, owned = true) {
  if (owned) {
    const h = env2.newGlobalRef(handle2);
    this.$h = h;
    this.$r = Script.bindWeak(this, env2.vm.makeHandleDestructor(h));
  } else {
    this.$h = handle2;
    this.$r = null;
  }
  this.$s = spec;
  this.$t = type;
  this.length = length;
  return new Proxy(this, primitiveArrayHandler);
}
primitiveArrayHandler = {
  has(target, property) {
    if (property in target) {
      return true;
    }
    return target.tryParseIndex(property) !== null;
  },
  get(target, property, receiver) {
    const index = target.tryParseIndex(property);
    if (index === null) {
      return target[property];
    }
    return target.readElement(index);
  },
  set(target, property, value, receiver) {
    const index = target.tryParseIndex(property);
    if (index === null) {
      target[property] = value;
      return true;
    }
    target.writeElement(index, value);
    return true;
  },
  ownKeys(target) {
    const keys = [];
    const { length } = target;
    for (let i = 0; i !== length; i++) {
      const key = i.toString();
      keys.push(key);
    }
    keys.push("length");
    return keys;
  },
  getOwnPropertyDescriptor(target, property) {
    const index = target.tryParseIndex(property);
    if (index !== null) {
      return {
        writable: true,
        configurable: true,
        enumerable: true
      };
    }
    return Object.getOwnPropertyDescriptor(target, property);
  }
};
Object.defineProperties(PrimitiveArray.prototype, {
  $dispose: {
    enumerable: true,
    value() {
      const ref = this.$r;
      if (ref !== null) {
        this.$r = null;
        Script.unbindWeak(ref);
      }
    }
  },
  $clone: {
    value(env2) {
      return new PrimitiveArray(this.$h, this.$s, this.$t, this.length, env2);
    }
  },
  tryParseIndex: {
    value(rawIndex) {
      if (typeof rawIndex === "symbol") {
        return null;
      }
      const index = parseInt(rawIndex);
      if (isNaN(index) || index < 0 || index >= this.length) {
        return null;
      }
      return index;
    }
  },
  readElement: {
    value(index) {
      return this.withElements((elements) => {
        const type = this.$t;
        return type.fromJni(type.read(elements.add(index * type.byteSize)));
      });
    }
  },
  writeElement: {
    value(index, value) {
      const { $h: handle2, $s: spec, $t: type } = this;
      const env2 = vm.getEnv();
      const element = Memory.alloc(type.byteSize);
      type.write(element, type.toJni(value));
      spec.setRegion.call(env2, handle2, index, 1, element);
    }
  },
  withElements: {
    value(perform) {
      const { $h: handle2, $s: spec } = this;
      const env2 = vm.getEnv();
      const elements = spec.getElements.call(env2, handle2);
      if (elements.isNull()) {
        throw new Error("Unable to get array elements");
      }
      try {
        return perform(elements);
      } finally {
        spec.releaseElements.call(env2, handle2, elements);
      }
    }
  },
  toJSON: {
    value() {
      const { length, $t: type } = this;
      const { byteSize: elementSize, fromJni, read: read2 } = type;
      return this.withElements((elements) => {
        const values = [];
        for (let i = 0; i !== length; i++) {
          const value = fromJni(read2(elements.add(i * elementSize)));
          values.push(value);
        }
        return values;
      });
    }
  },
  toString: {
    value() {
      return this.toJSON().toString();
    }
  }
});
function makeJniObjectTypeName(typeName) {
  return "L" + typeName.replace(/\./g, "/") + ";";
}
function toTitleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function identity(value) {
  return value;
}

// node_modules/frida-java-bridge/lib/class-factory.js
var jsizeSize3 = 4;
var {
  ensureClassInitialized: ensureClassInitialized3,
  makeMethodMangler: makeMethodMangler3
} = android_exports;
var kAccStatic2 = 8;
var CONSTRUCTOR_METHOD = 1;
var STATIC_METHOD = 2;
var INSTANCE_METHOD = 3;
var STATIC_FIELD = 1;
var INSTANCE_FIELD = 2;
var STRATEGY_VIRTUAL = 1;
var STRATEGY_DIRECT = 2;
var PENDING_USE = Symbol("PENDING_USE");
var DEFAULT_CACHE_DIR = "/data/local/tmp";
var {
  getCurrentThreadId,
  pointerSize: pointerSize8
} = Process;
var factoryCache = {
  state: "empty",
  factories: [],
  loaders: null,
  Integer: null
};
var vm2 = null;
var api2 = null;
var isArtVm = null;
var wrapperHandler = null;
var dispatcherPrototype = null;
var methodPrototype = null;
var valueOfPrototype = null;
var cachedLoaderInvoke = null;
var cachedLoaderMethod = null;
var ignoredThreads = /* @__PURE__ */ new Map();
var ClassFactory = class _ClassFactory {
  static _initialize(_vm, _api) {
    vm2 = _vm;
    api2 = _api;
    isArtVm = _api.flavor === "art";
    if (_api.flavor === "jvm") {
      ensureClassInitialized3 = ensureClassInitialized2;
      makeMethodMangler3 = makeMethodMangler2;
    }
  }
  static _disposeAll(env2) {
    factoryCache.factories.forEach((factory) => {
      factory._dispose(env2);
    });
  }
  static get(classLoader) {
    const cache = getFactoryCache();
    const defaultFactory = cache.factories[0];
    if (classLoader === null) {
      return defaultFactory;
    }
    const indexObj = cache.loaders.get(classLoader);
    if (indexObj !== null) {
      const index = defaultFactory.cast(indexObj, cache.Integer);
      return cache.factories[index.intValue()];
    }
    const factory = new _ClassFactory();
    factory.loader = classLoader;
    factory.cacheDir = defaultFactory.cacheDir;
    addFactoryToCache(factory, classLoader);
    return factory;
  }
  constructor() {
    this.cacheDir = DEFAULT_CACHE_DIR;
    this.codeCacheDir = DEFAULT_CACHE_DIR + "/dalvik-cache";
    this.tempFileNaming = {
      prefix: "frida",
      suffix: ""
    };
    this._classes = {};
    this._classHandles = new LRU(10, releaseClassHandle);
    this._patchedMethods = /* @__PURE__ */ new Set();
    this._loader = null;
    this._types = [{}, {}];
    factoryCache.factories.push(this);
  }
  _dispose(env2) {
    Array.from(this._patchedMethods).forEach((method2) => {
      method2.implementation = null;
    });
    this._patchedMethods.clear();
    revertGlobalPatches();
    this._classHandles.dispose(env2);
    this._classes = {};
  }
  get loader() {
    return this._loader;
  }
  set loader(value) {
    const isInitial = this._loader === null && value !== null;
    this._loader = value;
    if (isInitial && factoryCache.state === "ready" && this === factoryCache.factories[0]) {
      addFactoryToCache(this, value);
    }
  }
  use(className, options = {}) {
    const allowCached = options.cache !== "skip";
    let C = allowCached ? this._getUsedClass(className) : void 0;
    if (C === void 0) {
      try {
        const env2 = vm2.getEnv();
        const { _loader: loader } = this;
        const getClassHandle = loader !== null ? makeLoaderClassHandleGetter(className, loader, env2) : makeBasicClassHandleGetter(className);
        C = this._make(className, getClassHandle, env2);
      } finally {
        if (allowCached) {
          this._setUsedClass(className, C);
        }
      }
    }
    return C;
  }
  _getUsedClass(className) {
    let c;
    while ((c = this._classes[className]) === PENDING_USE) {
      Thread.sleep(0.05);
    }
    if (c === void 0) {
      this._classes[className] = PENDING_USE;
    }
    return c;
  }
  _setUsedClass(className, c) {
    if (c !== void 0) {
      this._classes[className] = c;
    } else {
      delete this._classes[className];
    }
  }
  _make(name, getClassHandle, env2) {
    const C = makeClassWrapperConstructor();
    const proto = Object.create(Wrapper.prototype, {
      [Symbol.for("n")]: {
        value: name
      },
      $n: {
        get() {
          return this[Symbol.for("n")];
        }
      },
      [Symbol.for("C")]: {
        value: C
      },
      $C: {
        get() {
          return this[Symbol.for("C")];
        }
      },
      [Symbol.for("w")]: {
        value: null,
        writable: true
      },
      $w: {
        get() {
          return this[Symbol.for("w")];
        },
        set(val) {
          this[Symbol.for("w")] = val;
        }
      },
      [Symbol.for("_s")]: {
        writable: true
      },
      $_s: {
        get() {
          return this[Symbol.for("_s")];
        },
        set(val) {
          this[Symbol.for("_s")] = val;
        }
      },
      [Symbol.for("c")]: {
        value: [null]
      },
      $c: {
        get() {
          return this[Symbol.for("c")];
        }
      },
      [Symbol.for("m")]: {
        value: /* @__PURE__ */ new Map()
      },
      $m: {
        get() {
          return this[Symbol.for("m")];
        }
      },
      [Symbol.for("l")]: {
        value: null,
        writable: true
      },
      $l: {
        get() {
          return this[Symbol.for("l")];
        },
        set(val) {
          this[Symbol.for("l")] = val;
        }
      },
      [Symbol.for("gch")]: {
        value: getClassHandle
      },
      $gch: {
        get() {
          return this[Symbol.for("gch")];
        }
      },
      [Symbol.for("f")]: {
        value: this
      },
      $f: {
        get() {
          return this[Symbol.for("f")];
        }
      }
    });
    C.prototype = proto;
    const classWrapper = new C(null);
    proto[Symbol.for("w")] = classWrapper;
    proto.$w = classWrapper;
    const h = classWrapper.$borrowClassHandle(env2);
    try {
      const classHandle = h.value;
      ensureClassInitialized3(env2, classHandle);
      proto.$l = Model.build(classHandle, env2);
    } finally {
      h.unref(env2);
    }
    return classWrapper;
  }
  retain(obj) {
    const env2 = vm2.getEnv();
    return obj.$clone(env2);
  }
  cast(obj, klass, owned) {
    const env2 = vm2.getEnv();
    let handle2 = obj.$h;
    if (handle2 === void 0) {
      handle2 = obj;
    }
    const h = klass.$borrowClassHandle(env2);
    try {
      const isValidCast = env2.isInstanceOf(handle2, h.value);
      if (!isValidCast) {
        throw new Error(`Cast from '${env2.getObjectClassName(handle2)}' to '${klass.$n}' isn't possible`);
      }
    } finally {
      h.unref(env2);
    }
    const C = klass.$C;
    return new C(handle2, STRATEGY_VIRTUAL, env2, owned);
  }
  wrap(handle2, klass, env2) {
    const C = klass.$C;
    const wrapper = new C(handle2, STRATEGY_VIRTUAL, env2, false);
    wrapper.$r = Script.bindWeak(wrapper, vm2.makeHandleDestructor(handle2));
    return wrapper;
  }
  array(type, elements) {
    const env2 = vm2.getEnv();
    const primitiveType = getPrimitiveType(type);
    if (primitiveType !== null) {
      type = primitiveType.name;
    }
    const arrayType2 = getArrayType("[" + type, false, this);
    const rawArray = arrayType2.toJni(elements, env2);
    return arrayType2.fromJni(rawArray, env2, true);
  }
  registerClass(spec) {
    const env2 = vm2.getEnv();
    const tempHandles = [];
    try {
      const Class = this.use("java.lang.Class");
      const Method = env2.javaLangReflectMethod();
      const invokeObjectMethodNoArgs = env2.vaMethod("pointer", []);
      const className = spec.name;
      const interfaces = spec.implements || [];
      const superClass = spec.superClass || this.use("java.lang.Object");
      const dexFields = [];
      const dexMethods = [];
      const dexSpec = {
        name: makeJniObjectTypeName(className),
        sourceFileName: makeSourceFileName(className),
        superClass: makeJniObjectTypeName(superClass.$n),
        interfaces: interfaces.map((iface) => makeJniObjectTypeName(iface.$n)),
        fields: dexFields,
        methods: dexMethods
      };
      const allInterfaces = interfaces.slice();
      interfaces.forEach((iface) => {
        Array.prototype.slice.call(iface.class.getInterfaces()).forEach((baseIface) => {
          const baseIfaceName = this.cast(baseIface, Class).getCanonicalName();
          allInterfaces.push(this.use(baseIfaceName));
        });
      });
      const fields = spec.fields || {};
      Object.getOwnPropertyNames(fields).forEach((name) => {
        const fieldType = this._getType(fields[name]);
        dexFields.push([name, fieldType.name]);
      });
      const baseMethods = {};
      const pendingOverloads = {};
      allInterfaces.forEach((iface) => {
        const h = iface.$borrowClassHandle(env2);
        tempHandles.push(h);
        const ifaceHandle = h.value;
        iface.$ownMembers.filter((name) => {
          return iface[name].overloads !== void 0;
        }).forEach((name) => {
          const method2 = iface[name];
          const overloads = method2.overloads;
          const overloadIds = overloads.map((overload) => makeOverloadId(name, overload.returnType, overload.argumentTypes));
          baseMethods[name] = [method2, overloadIds, ifaceHandle];
          overloads.forEach((overload, index) => {
            const id = overloadIds[index];
            pendingOverloads[id] = [overload, ifaceHandle];
          });
        });
      });
      const methods = spec.methods || {};
      const methodNames = Object.keys(methods);
      const methodEntries = methodNames.reduce((result, name) => {
        const entry = methods[name];
        const rawName = name === "$init" ? "<init>" : name;
        if (entry instanceof Array) {
          result.push(...entry.map((e) => [rawName, e]));
        } else {
          result.push([rawName, entry]);
        }
        return result;
      }, []);
      const implMethods = [];
      methodEntries.forEach(([name, methodValue]) => {
        let type = INSTANCE_METHOD;
        let returnType;
        let argumentTypes;
        let thrownTypeNames = [];
        let impl2;
        if (typeof methodValue === "function") {
          const m2 = baseMethods[name];
          if (m2 !== void 0 && Array.isArray(m2)) {
            const [baseMethod, overloadIds, parentTypeHandle] = m2;
            if (overloadIds.length > 1) {
              throw new Error(`More than one overload matching '${name}': signature must be specified`);
            }
            delete pendingOverloads[overloadIds[0]];
            const overload = baseMethod.overloads[0];
            type = overload.type;
            returnType = overload.returnType;
            argumentTypes = overload.argumentTypes;
            impl2 = methodValue;
            const reflectedMethod = env2.toReflectedMethod(parentTypeHandle, overload.handle, 0);
            const thrownTypes = invokeObjectMethodNoArgs(env2.handle, reflectedMethod, Method.getGenericExceptionTypes);
            thrownTypeNames = readTypeNames(env2, thrownTypes).map(makeJniObjectTypeName);
            env2.deleteLocalRef(thrownTypes);
            env2.deleteLocalRef(reflectedMethod);
          } else {
            returnType = this._getType("void");
            argumentTypes = [];
            impl2 = methodValue;
          }
        } else {
          if (methodValue.isStatic) {
            type = STATIC_METHOD;
          }
          returnType = this._getType(methodValue.returnType || "void");
          argumentTypes = (methodValue.argumentTypes || []).map((name2) => this._getType(name2));
          impl2 = methodValue.implementation;
          if (typeof impl2 !== "function") {
            throw new Error("Expected a function implementation for method: " + name);
          }
          const id = makeOverloadId(name, returnType, argumentTypes);
          const pendingOverload = pendingOverloads[id];
          if (pendingOverload !== void 0) {
            const [overload, parentTypeHandle] = pendingOverload;
            delete pendingOverloads[id];
            type = overload.type;
            returnType = overload.returnType;
            argumentTypes = overload.argumentTypes;
            const reflectedMethod = env2.toReflectedMethod(parentTypeHandle, overload.handle, 0);
            const thrownTypes = invokeObjectMethodNoArgs(env2.handle, reflectedMethod, Method.getGenericExceptionTypes);
            thrownTypeNames = readTypeNames(env2, thrownTypes).map(makeJniObjectTypeName);
            env2.deleteLocalRef(thrownTypes);
            env2.deleteLocalRef(reflectedMethod);
          }
        }
        const returnTypeName = returnType.name;
        const argumentTypeNames = argumentTypes.map((t) => t.name);
        const signature2 = "(" + argumentTypeNames.join("") + ")" + returnTypeName;
        dexMethods.push([name, returnTypeName, argumentTypeNames, thrownTypeNames, type === STATIC_METHOD ? kAccStatic2 : 0]);
        implMethods.push([name, signature2, type, returnType, argumentTypes, impl2]);
      });
      const unimplementedMethodIds = Object.keys(pendingOverloads);
      if (unimplementedMethodIds.length > 0) {
        throw new Error("Missing implementation for: " + unimplementedMethodIds.join(", "));
      }
      const dex = DexFile.fromBuffer(mkdex_default(dexSpec), this);
      try {
        dex.load();
      } finally {
        dex.file.delete();
      }
      const classWrapper = this.use(spec.name);
      const numMethods = methodEntries.length;
      if (numMethods > 0) {
        const methodElementSize = 3 * pointerSize8;
        const methodElements = Memory.alloc(numMethods * methodElementSize);
        const nativeMethods = [];
        const temporaryHandles = [];
        implMethods.forEach(([name, signature2, type, returnType, argumentTypes, impl2], index) => {
          const rawName = Memory.allocUtf8String(name);
          const rawSignature = Memory.allocUtf8String(signature2);
          const rawImpl = implement(name, classWrapper, type, returnType, argumentTypes, impl2);
          methodElements.add(index * methodElementSize).writePointer(rawName);
          methodElements.add(index * methodElementSize + pointerSize8).writePointer(rawSignature);
          methodElements.add(index * methodElementSize + 2 * pointerSize8).writePointer(rawImpl);
          temporaryHandles.push(rawName, rawSignature);
          nativeMethods.push(rawImpl);
        });
        const h = classWrapper.$borrowClassHandle(env2);
        tempHandles.push(h);
        const classHandle = h.value;
        env2.registerNatives(classHandle, methodElements, numMethods);
        env2.throwIfExceptionPending();
        classWrapper.$nativeMethods = nativeMethods;
      }
      return classWrapper;
    } finally {
      tempHandles.forEach((h) => {
        h.unref(env2);
      });
    }
  }
  choose(specifier, callbacks) {
    const env2 = vm2.getEnv();
    const { flavor } = api2;
    if (flavor === "jvm") {
      this._chooseObjectsJvm(specifier, env2, callbacks);
    } else if (flavor === "art") {
      const legacyApiMissing = api2["art::gc::Heap::VisitObjects"] === void 0;
      if (legacyApiMissing) {
        const preA12ApiMissing = api2["art::gc::Heap::GetInstances"] === void 0;
        if (preA12ApiMissing) {
          return this._chooseObjectsJvm(specifier, env2, callbacks);
        }
      }
      withRunnableArtThread(vm2, env2, (thread) => {
        if (legacyApiMissing) {
          this._chooseObjectsArtPreA12(specifier, env2, thread, callbacks);
        } else {
          this._chooseObjectsArtLegacy(specifier, env2, thread, callbacks);
        }
      });
    } else {
      this._chooseObjectsDalvik(specifier, env2, callbacks);
    }
  }
  _chooseObjectsJvm(className, env2, callbacks) {
    const classWrapper = this.use(className);
    const { jvmti } = api2;
    const JVMTI_ITERATION_CONTINUE = 1;
    const JVMTI_HEAP_OBJECT_EITHER = 3;
    const h = classWrapper.$borrowClassHandle(env2);
    const tag = int64(h.value.toString());
    try {
      const heapObjectCallback = new NativeCallback((classTag, size, tagPtr2, userData) => {
        tagPtr2.writeS64(tag);
        return JVMTI_ITERATION_CONTINUE;
      }, "int", ["int64", "int64", "pointer", "pointer"]);
      jvmti.iterateOverInstancesOfClass(h.value, JVMTI_HEAP_OBJECT_EITHER, heapObjectCallback, h.value);
      const tagPtr = Memory.alloc(8);
      tagPtr.writeS64(tag);
      const countPtr = Memory.alloc(jsizeSize3);
      const objectsPtr = Memory.alloc(pointerSize8);
      jvmti.getObjectsWithTags(1, tagPtr, countPtr, objectsPtr, NULL);
      const count = countPtr.readS32();
      const objects = objectsPtr.readPointer();
      const handles = [];
      for (let i = 0; i !== count; i++) {
        handles.push(objects.add(i * pointerSize8).readPointer());
      }
      jvmti.deallocate(objects);
      try {
        for (const handle2 of handles) {
          const instance = this.cast(handle2, classWrapper);
          const result = callbacks.onMatch(instance);
          if (result === "stop") {
            break;
          }
        }
        callbacks.onComplete();
      } finally {
        handles.forEach((handle2) => {
          env2.deleteLocalRef(handle2);
        });
      }
    } finally {
      h.unref(env2);
    }
  }
  _chooseObjectsArtPreA12(className, env2, thread, callbacks) {
    const classWrapper = this.use(className);
    const scope = VariableSizedHandleScope.$new(thread, vm2);
    let needle;
    const h = classWrapper.$borrowClassHandle(env2);
    try {
      const object = api2["art::JavaVMExt::DecodeGlobal"](api2.vm, thread, h.value);
      needle = scope.newHandle(object);
    } finally {
      h.unref(env2);
    }
    const maxCount = 0;
    const instances = HandleVector.$new();
    api2["art::gc::Heap::GetInstances"](api2.artHeap, scope, needle, maxCount, instances);
    const instanceHandles = instances.handles.map((handle2) => env2.newGlobalRef(handle2));
    instances.$delete();
    scope.$delete();
    try {
      for (const handle2 of instanceHandles) {
        const instance = this.cast(handle2, classWrapper);
        const result = callbacks.onMatch(instance);
        if (result === "stop") {
          break;
        }
      }
      callbacks.onComplete();
    } finally {
      instanceHandles.forEach((handle2) => {
        env2.deleteGlobalRef(handle2);
      });
    }
  }
  _chooseObjectsArtLegacy(className, env2, thread, callbacks) {
    const classWrapper = this.use(className);
    const instanceHandles = [];
    const addGlobalReference = api2["art::JavaVMExt::AddGlobalRef"];
    const vmHandle = api2.vm;
    let needle;
    const h = classWrapper.$borrowClassHandle(env2);
    try {
      needle = api2["art::JavaVMExt::DecodeGlobal"](vmHandle, thread, h.value).toInt32();
    } finally {
      h.unref(env2);
    }
    const collectMatchingInstanceHandles = makeObjectVisitorPredicate(needle, (object) => {
      instanceHandles.push(addGlobalReference(vmHandle, thread, object));
    });
    api2["art::gc::Heap::VisitObjects"](api2.artHeap, collectMatchingInstanceHandles, NULL);
    try {
      for (const handle2 of instanceHandles) {
        const instance = this.cast(handle2, classWrapper);
        const result = callbacks.onMatch(instance);
        if (result === "stop") {
          break;
        }
      }
    } finally {
      instanceHandles.forEach((handle2) => {
        env2.deleteGlobalRef(handle2);
      });
    }
    callbacks.onComplete();
  }
  _chooseObjectsDalvik(className, callerEnv, callbacks) {
    const classWrapper = this.use(className);
    if (api2.addLocalReference === null) {
      const libdvm = Process.getModuleByName("libdvm.so");
      let pattern;
      switch (Process.arch) {
        case "arm":
          pattern = "2d e9 f0 41 05 46 15 4e 0c 46 7e 44 11 b3 43 68";
          break;
        case "ia32":
          pattern = "8d 64 24 d4 89 5c 24 1c 89 74 24 20 e8 ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? 85 d2";
          break;
      }
      Memory.scan(libdvm.base, libdvm.size, pattern, {
        onMatch: (address, size) => {
          let wrapper;
          if (Process.arch === "arm") {
            address = address.or(1);
            wrapper = new NativeFunction(address, "pointer", ["pointer", "pointer"]);
          } else {
            const thunk = Memory.alloc(Process.pageSize);
            Memory.patchCode(thunk, 16, (code4) => {
              const cw = new X86Writer(code4, { pc: thunk });
              cw.putMovRegRegOffsetPtr("eax", "esp", 4);
              cw.putMovRegRegOffsetPtr("edx", "esp", 8);
              cw.putJmpAddress(address);
              cw.flush();
            });
            wrapper = new NativeFunction(thunk, "pointer", ["pointer", "pointer"]);
            wrapper._thunk = thunk;
          }
          api2.addLocalReference = wrapper;
          vm2.perform((env2) => {
            enumerateInstances(this, env2);
          });
          return "stop";
        },
        onError(reason) {
        },
        onComplete() {
          if (api2.addLocalReference === null) {
            callbacks.onComplete();
          }
        }
      });
    } else {
      enumerateInstances(this, callerEnv);
    }
    function enumerateInstances(factory, env2) {
      const { DVM_JNI_ENV_OFFSET_SELF: DVM_JNI_ENV_OFFSET_SELF2 } = android_exports;
      const thread = env2.handle.add(DVM_JNI_ENV_OFFSET_SELF2).readPointer();
      let ptrClassObject;
      const h = classWrapper.$borrowClassHandle(env2);
      try {
        ptrClassObject = api2.dvmDecodeIndirectRef(thread, h.value);
      } finally {
        h.unref(env2);
      }
      const pattern = ptrClassObject.toMatchPattern();
      const heapSourceBase = api2.dvmHeapSourceGetBase();
      const heapSourceLimit = api2.dvmHeapSourceGetLimit();
      const size = heapSourceLimit.sub(heapSourceBase).toInt32();
      Memory.scan(heapSourceBase, size, pattern, {
        onMatch: (address, size2) => {
          if (api2.dvmIsValidObject(address)) {
            vm2.perform((env3) => {
              const thread2 = env3.handle.add(DVM_JNI_ENV_OFFSET_SELF2).readPointer();
              let instance;
              const localReference = api2.addLocalReference(thread2, address);
              try {
                instance = factory.cast(localReference, classWrapper);
              } finally {
                env3.deleteLocalRef(localReference);
              }
              const result = callbacks.onMatch(instance);
              if (result === "stop") {
                return "stop";
              }
            });
          }
        },
        onError(reason) {
        },
        onComplete() {
          callbacks.onComplete();
        }
      });
    }
  }
  openClassFile(filePath) {
    return new DexFile(filePath, null, this);
  }
  _getType(typeName, unbox = true) {
    return getType(typeName, unbox, this);
  }
};
function makeClassWrapperConstructor() {
  return function(handle2, strategy, env2, owned) {
    return Wrapper.call(this, handle2, strategy, env2, owned);
  };
}
function Wrapper(handle2, strategy, env2, owned = true) {
  if (handle2 !== null) {
    if (owned) {
      const h = env2.newGlobalRef(handle2);
      this.$h = h;
      this.$r = Script.bindWeak(this, vm2.makeHandleDestructor(h));
    } else {
      this.$h = handle2;
      this.$r = null;
    }
  } else {
    this.$h = null;
    this.$r = null;
  }
  this.$t = strategy;
  return new Proxy(this, wrapperHandler);
}
wrapperHandler = {
  has(target, property) {
    if (property in target) {
      return true;
    }
    return target.$has(property);
  },
  get(target, property, receiver) {
    if (typeof property !== "string" || property.startsWith("$") || property === "class") {
      return target[property];
    }
    const unwrap2 = target.$find(property);
    if (unwrap2 !== null) {
      return unwrap2(receiver);
    }
    return target[property];
  },
  set(target, property, value, receiver) {
    target[property] = value;
    return true;
  },
  ownKeys(target) {
    return target.$list();
  },
  getOwnPropertyDescriptor(target, property) {
    if (Object.prototype.hasOwnProperty.call(target, property)) {
      return Object.getOwnPropertyDescriptor(target, property);
    }
    return {
      writable: false,
      configurable: true,
      enumerable: true
    };
  }
};
Object.defineProperties(Wrapper.prototype, {
  [Symbol.for("new")]: {
    enumerable: false,
    get() {
      return this.$getCtor("allocAndInit");
    }
  },
  $new: {
    enumerable: true,
    get() {
      return this[Symbol.for("new")];
    }
  },
  [Symbol.for("alloc")]: {
    enumerable: false,
    value() {
      const env2 = vm2.getEnv();
      const h = this.$borrowClassHandle(env2);
      try {
        const obj = env2.allocObject(h.value);
        const factory = this.$f;
        return factory.cast(obj, this);
      } finally {
        h.unref(env2);
      }
    }
  },
  $alloc: {
    enumerable: true,
    get() {
      return this[Symbol.for("$alloc")];
    }
  },
  [Symbol.for("init")]: {
    enumerable: false,
    get() {
      return this.$getCtor("initOnly");
    }
  },
  $init: {
    enumerable: true,
    get() {
      return this[Symbol.for("init")];
    }
  },
  [Symbol.for("dispose")]: {
    enumerable: false,
    value() {
      const ref = this.$r;
      if (ref !== null) {
        this.$r = null;
        Script.unbindWeak(ref);
      }
      if (this.$h !== null) {
        this.$h = void 0;
      }
    }
  },
  $dispose: {
    enumerable: true,
    get() {
      return this[Symbol.for("dispose")];
    }
  },
  [Symbol.for("clone")]: {
    enumerable: false,
    value(env2) {
      const C = this.$C;
      return new C(this.$h, this.$t, env2);
    }
  },
  $clone: {
    value(env2) {
      return this[Symbol.for("clone")](env2);
    }
  },
  [Symbol.for("class")]: {
    enumerable: false,
    get() {
      const env2 = vm2.getEnv();
      const h = this.$borrowClassHandle(env2);
      try {
        const factory = this.$f;
        return factory.cast(h.value, factory.use("java.lang.Class"));
      } finally {
        h.unref(env2);
      }
    }
  },
  class: {
    enumerable: true,
    get() {
      return this[Symbol.for("class")];
    }
  },
  [Symbol.for("className")]: {
    enumerable: false,
    get() {
      const handle2 = this.$h;
      if (handle2 === null) {
        return this.$n;
      }
      return vm2.getEnv().getObjectClassName(handle2);
    }
  },
  $className: {
    enumerable: true,
    get() {
      return this[Symbol.for("className")];
    }
  },
  [Symbol.for("ownMembers")]: {
    enumerable: false,
    get() {
      const model = this.$l;
      return model.list();
    }
  },
  $ownMembers: {
    enumerable: true,
    get() {
      return this[Symbol.for("ownMembers")];
    }
  },
  [Symbol.for("super")]: {
    enumerable: false,
    get() {
      const env2 = vm2.getEnv();
      const C = this.$s.$C;
      return new C(this.$h, STRATEGY_DIRECT, env2);
    }
  },
  $super: {
    enumerable: true,
    get() {
      return this[Symbol.for("super")];
    }
  },
  [Symbol.for("s")]: {
    enumerable: false,
    get() {
      const proto = Object.getPrototypeOf(this);
      let superWrapper = proto.$_s;
      if (superWrapper === void 0) {
        const env2 = vm2.getEnv();
        const h = this.$borrowClassHandle(env2);
        try {
          const superHandle = env2.getSuperclass(h.value);
          if (!superHandle.isNull()) {
            try {
              const superClassName = env2.getClassName(superHandle);
              const factory = proto.$f;
              superWrapper = factory._getUsedClass(superClassName);
              if (superWrapper === void 0) {
                try {
                  const getSuperClassHandle = makeSuperHandleGetter(this);
                  superWrapper = factory._make(superClassName, getSuperClassHandle, env2);
                } finally {
                  factory._setUsedClass(superClassName, superWrapper);
                }
              }
            } finally {
              env2.deleteLocalRef(superHandle);
            }
          } else {
            superWrapper = null;
          }
        } finally {
          h.unref(env2);
        }
        proto.$_s = superWrapper;
      }
      return superWrapper;
    }
  },
  $s: {
    get() {
      return this[Symbol.for("s")];
    }
  },
  [Symbol.for("isSameObject")]: {
    enumerable: false,
    value(obj) {
      const env2 = vm2.getEnv();
      return env2.isSameObject(obj.$h, this.$h);
    }
  },
  $isSameObject: {
    value(obj) {
      return this[Symbol.for("isSameObject")](obj);
    }
  },
  [Symbol.for("getCtor")]: {
    enumerable: false,
    value(type) {
      const slot = this.$c;
      let ctor = slot[0];
      if (ctor === null) {
        const env2 = vm2.getEnv();
        const h = this.$borrowClassHandle(env2);
        try {
          ctor = makeConstructor(h.value, this.$w, env2);
          slot[0] = ctor;
        } finally {
          h.unref(env2);
        }
      }
      return ctor[type];
    }
  },
  $getCtor: {
    value(type) {
      return this[Symbol.for("getCtor")](type);
    }
  },
  [Symbol.for("borrowClassHandle")]: {
    enumerable: false,
    value(env2) {
      const className = this.$n;
      const classHandles = this.$f._classHandles;
      let handle2 = classHandles.get(className);
      if (handle2 === void 0) {
        handle2 = new ClassHandle(this.$gch(env2), env2);
        classHandles.set(className, handle2, env2);
      }
      return handle2.ref();
    }
  },
  $borrowClassHandle: {
    value(env2) {
      return this[Symbol.for("borrowClassHandle")](env2);
    }
  },
  [Symbol.for("copyClassHandle")]: {
    enumerable: false,
    value(env2) {
      const h = this.$borrowClassHandle(env2);
      try {
        return env2.newLocalRef(h.value);
      } finally {
        h.unref(env2);
      }
    }
  },
  $copyClassHandle: {
    value(env2) {
      return this[Symbol.for("copyClassHandle")](env2);
    }
  },
  [Symbol.for("getHandle")]: {
    enumerable: false,
    value(env2) {
      const handle2 = this.$h;
      const isDisposed = handle2 === void 0;
      if (isDisposed) {
        throw new Error("Wrapper is disposed; perhaps it was borrowed from a hook instead of calling Java.retain() to make a long-lived wrapper?");
      }
      return handle2;
    }
  },
  $getHandle: {
    value(env2) {
      return this[Symbol.for("getHandle")](env2);
    }
  },
  [Symbol.for("list")]: {
    enumerable: false,
    value() {
      const superWrapper = this.$s;
      const superMembers = superWrapper !== null ? superWrapper.$list() : [];
      const model = this.$l;
      return Array.from(new Set(superMembers.concat(model.list())));
    }
  },
  $list: {
    get() {
      return this[Symbol.for("list")];
    }
  },
  [Symbol.for("has")]: {
    enumerable: false,
    value(member) {
      const members = this.$m;
      if (members.has(member)) {
        return true;
      }
      const model = this.$l;
      if (model.has(member)) {
        return true;
      }
      const superWrapper = this.$s;
      if (superWrapper !== null && superWrapper.$has(member)) {
        return true;
      }
      return false;
    }
  },
  $has: {
    value(member) {
      return this[Symbol.for("has")](member);
    }
  },
  [Symbol.for("find")]: {
    enumerable: false,
    value(member) {
      const members = this.$m;
      let value = members.get(member);
      if (value !== void 0) {
        return value;
      }
      const model = this.$l;
      const spec = model.find(member);
      if (spec !== null) {
        const env2 = vm2.getEnv();
        const h = this.$borrowClassHandle(env2);
        try {
          value = makeMember(member, spec, h.value, this.$w, env2);
        } finally {
          h.unref(env2);
        }
        members.set(member, value);
        return value;
      }
      const superWrapper = this.$s;
      if (superWrapper !== null) {
        return superWrapper.$find(member);
      }
      return null;
    }
  },
  $find: {
    value(member) {
      return this[Symbol.for("find")](member);
    }
  },
  [Symbol.for("toJSON")]: {
    enumerable: false,
    value() {
      const wrapperName = this.$n;
      const handle2 = this.$h;
      if (handle2 === null) {
        return `<class: ${wrapperName}>`;
      }
      const actualName = this.$className;
      if (wrapperName === actualName) {
        return `<instance: ${wrapperName}>`;
      }
      return `<instance: ${wrapperName}, $className: ${actualName}>`;
    }
  },
  toJSON: {
    get() {
      return this[Symbol.for("toJSON")];
    }
  }
});
function ClassHandle(value, env2) {
  this.value = env2.newGlobalRef(value);
  env2.deleteLocalRef(value);
  this.refs = 1;
}
ClassHandle.prototype.ref = function() {
  this.refs++;
  return this;
};
ClassHandle.prototype.unref = function(env2) {
  if (--this.refs === 0) {
    env2.deleteGlobalRef(this.value);
  }
};
function releaseClassHandle(handle2, env2) {
  handle2.unref(env2);
}
function makeBasicClassHandleGetter(className) {
  const canonicalClassName = className.replace(/\./g, "/");
  return function(env2) {
    const tid = getCurrentThreadId();
    ignore(tid);
    try {
      return env2.findClass(canonicalClassName);
    } finally {
      unignore(tid);
    }
  };
}
function makeLoaderClassHandleGetter(className, usedLoader, callerEnv) {
  if (cachedLoaderMethod === null) {
    cachedLoaderInvoke = callerEnv.vaMethod("pointer", ["pointer"]);
    cachedLoaderMethod = usedLoader.loadClass.overload("java.lang.String").handle;
  }
  callerEnv = null;
  return function(env2) {
    const classNameValue = env2.newStringUtf(className);
    const tid = getCurrentThreadId();
    ignore(tid);
    try {
      const result = cachedLoaderInvoke(env2.handle, usedLoader.$h, cachedLoaderMethod, classNameValue);
      env2.throwIfExceptionPending();
      return result;
    } finally {
      unignore(tid);
      env2.deleteLocalRef(classNameValue);
    }
  };
}
function makeSuperHandleGetter(classWrapper) {
  return function(env2) {
    const h = classWrapper.$borrowClassHandle(env2);
    try {
      return env2.getSuperclass(h.value);
    } finally {
      h.unref(env2);
    }
  };
}
function makeConstructor(classHandle, classWrapper, env2) {
  const { $n: className, $f: factory } = classWrapper;
  const methodName = basename(className);
  const Class = env2.javaLangClass();
  const Constructor = env2.javaLangReflectConstructor();
  const invokeObjectMethodNoArgs = env2.vaMethod("pointer", []);
  const invokeUInt8MethodNoArgs = env2.vaMethod("uint8", []);
  const jsCtorMethods = [];
  const jsInitMethods = [];
  const jsRetType = factory._getType(className, false);
  const jsVoidType = factory._getType("void", false);
  const constructors = invokeObjectMethodNoArgs(env2.handle, classHandle, Class.getDeclaredConstructors);
  try {
    const n = env2.getArrayLength(constructors);
    if (n !== 0) {
      for (let i = 0; i !== n; i++) {
        let methodId, types3;
        const constructor = env2.getObjectArrayElement(constructors, i);
        try {
          methodId = env2.fromReflectedMethod(constructor);
          types3 = invokeObjectMethodNoArgs(env2.handle, constructor, Constructor.getGenericParameterTypes);
        } finally {
          env2.deleteLocalRef(constructor);
        }
        let jsArgTypes;
        try {
          jsArgTypes = readTypeNames(env2, types3).map((name) => factory._getType(name));
        } finally {
          env2.deleteLocalRef(types3);
        }
        jsCtorMethods.push(makeMethod(methodName, classWrapper, CONSTRUCTOR_METHOD, methodId, jsRetType, jsArgTypes, env2));
        jsInitMethods.push(makeMethod(methodName, classWrapper, INSTANCE_METHOD, methodId, jsVoidType, jsArgTypes, env2));
      }
    } else {
      const isInterface = invokeUInt8MethodNoArgs(env2.handle, classHandle, Class.isInterface);
      if (isInterface) {
        throw new Error("cannot instantiate an interface");
      }
      const defaultClass = env2.javaLangObject();
      const defaultConstructor = env2.getMethodId(defaultClass, "<init>", "()V");
      jsCtorMethods.push(makeMethod(methodName, classWrapper, CONSTRUCTOR_METHOD, defaultConstructor, jsRetType, [], env2));
      jsInitMethods.push(makeMethod(methodName, classWrapper, INSTANCE_METHOD, defaultConstructor, jsVoidType, [], env2));
    }
  } finally {
    env2.deleteLocalRef(constructors);
  }
  if (jsInitMethods.length === 0) {
    throw new Error("no supported overloads");
  }
  return {
    allocAndInit: makeMethodDispatcher(jsCtorMethods),
    initOnly: makeMethodDispatcher(jsInitMethods)
  };
}
function makeMember(name, spec, classHandle, classWrapper, env2) {
  if (spec.startsWith("m")) {
    return makeMethodFromSpec(name, spec, classHandle, classWrapper, env2);
  }
  return makeFieldFromSpec(name, spec, classHandle, classWrapper, env2);
}
function makeMethodFromSpec(name, spec, classHandle, classWrapper, env2) {
  const { $f: factory } = classWrapper;
  const overloads = spec.split(":").slice(1);
  const Method = env2.javaLangReflectMethod();
  const invokeObjectMethodNoArgs = env2.vaMethod("pointer", []);
  const invokeUInt8MethodNoArgs = env2.vaMethod("uint8", []);
  const methods = overloads.map((params) => {
    const type = params[0] === "s" ? STATIC_METHOD : INSTANCE_METHOD;
    const methodId = ptr(params.substr(1));
    let jsRetType;
    const jsArgTypes = [];
    const handle2 = env2.toReflectedMethod(classHandle, methodId, type === STATIC_METHOD ? 1 : 0);
    try {
      const isVarArgs = !!invokeUInt8MethodNoArgs(env2.handle, handle2, Method.isVarArgs);
      const retType2 = invokeObjectMethodNoArgs(env2.handle, handle2, Method.getGenericReturnType);
      env2.throwIfExceptionPending();
      try {
        jsRetType = factory._getType(env2.getTypeName(retType2));
      } finally {
        env2.deleteLocalRef(retType2);
      }
      const argTypes2 = invokeObjectMethodNoArgs(env2.handle, handle2, Method.getParameterTypes);
      try {
        const n = env2.getArrayLength(argTypes2);
        for (let i = 0; i !== n; i++) {
          const t = env2.getObjectArrayElement(argTypes2, i);
          let argClassName;
          try {
            argClassName = isVarArgs && i === n - 1 ? env2.getArrayTypeName(t) : env2.getTypeName(t);
          } finally {
            env2.deleteLocalRef(t);
          }
          const argType = factory._getType(argClassName);
          jsArgTypes.push(argType);
        }
      } finally {
        env2.deleteLocalRef(argTypes2);
      }
    } catch (e) {
      return null;
    } finally {
      env2.deleteLocalRef(handle2);
    }
    return makeMethod(name, classWrapper, type, methodId, jsRetType, jsArgTypes, env2);
  }).filter((m2) => m2 !== null);
  if (methods.length === 0) {
    throw new Error("No supported overloads");
  }
  if (name === "valueOf") {
    ensureDefaultValueOfImplemented(methods);
  }
  const result = makeMethodDispatcher(methods);
  return function(receiver) {
    return result;
  };
}
function makeMethodDispatcher(overloads) {
  const m2 = makeMethodDispatcherCallable();
  Object.setPrototypeOf(m2, dispatcherPrototype);
  m2._o = overloads;
  return m2;
}
function makeMethodDispatcherCallable() {
  const m2 = function() {
    return m2.invoke(this, arguments);
  };
  return m2;
}
dispatcherPrototype = Object.create(Function.prototype, {
  overloads: {
    enumerable: true,
    get() {
      return this._o;
    }
  },
  overload: {
    value(...args) {
      const overloads = this._o;
      const numArgs = args.length;
      const signature2 = args.join(":");
      for (let i = 0; i !== overloads.length; i++) {
        const method2 = overloads[i];
        const { argumentTypes } = method2;
        if (argumentTypes.length !== numArgs) {
          continue;
        }
        const s = argumentTypes.map((t) => t.className).join(":");
        if (s === signature2) {
          return method2;
        }
      }
      throwOverloadError(this.methodName, this.overloads, "specified argument types do not match any of:");
    }
  },
  methodName: {
    enumerable: true,
    get() {
      return this._o[0].methodName;
    }
  },
  holder: {
    enumerable: true,
    get() {
      return this._o[0].holder;
    }
  },
  type: {
    enumerable: true,
    get() {
      return this._o[0].type;
    }
  },
  handle: {
    enumerable: true,
    get() {
      throwIfDispatcherAmbiguous(this);
      return this._o[0].handle;
    }
  },
  implementation: {
    enumerable: true,
    get() {
      throwIfDispatcherAmbiguous(this);
      return this._o[0].implementation;
    },
    set(fn) {
      throwIfDispatcherAmbiguous(this);
      this._o[0].implementation = fn;
    }
  },
  returnType: {
    enumerable: true,
    get() {
      throwIfDispatcherAmbiguous(this);
      return this._o[0].returnType;
    }
  },
  argumentTypes: {
    enumerable: true,
    get() {
      throwIfDispatcherAmbiguous(this);
      return this._o[0].argumentTypes;
    }
  },
  canInvokeWith: {
    enumerable: true,
    get(args) {
      throwIfDispatcherAmbiguous(this);
      return this._o[0].canInvokeWith;
    }
  },
  clone: {
    enumerable: true,
    value(options) {
      throwIfDispatcherAmbiguous(this);
      return this._o[0].clone(options);
    }
  },
  invoke: {
    value(receiver, args) {
      const overloads = this._o;
      const isInstance = receiver.$h !== null;
      for (let i = 0; i !== overloads.length; i++) {
        const method2 = overloads[i];
        if (!method2.canInvokeWith(args)) {
          continue;
        }
        if (method2.type === INSTANCE_METHOD && !isInstance) {
          const name = this.methodName;
          if (name === "toString") {
            return `<class: ${receiver.$n}>`;
          }
          throw new Error(name + ": cannot call instance method without an instance");
        }
        return method2.apply(receiver, args);
      }
      if (this.methodName === "toString") {
        return `<class: ${receiver.$n}>`;
      }
      throwOverloadError(this.methodName, this.overloads, "argument types do not match any of:");
    }
  }
});
function makeOverloadId(name, returnType, argumentTypes) {
  return `${returnType.className} ${name}(${argumentTypes.map((t) => t.className).join(", ")})`;
}
function throwIfDispatcherAmbiguous(dispatcher) {
  const methods = dispatcher._o;
  if (methods.length > 1) {
    throwOverloadError(methods[0].methodName, methods, "has more than one overload, use .overload(<signature>) to choose from:");
  }
}
function throwOverloadError(name, methods, message) {
  const methodsSortedByArity = methods.slice().sort((a, b) => a.argumentTypes.length - b.argumentTypes.length);
  const overloads = methodsSortedByArity.map((m2) => {
    const argTypes2 = m2.argumentTypes;
    if (argTypes2.length > 0) {
      return ".overload('" + m2.argumentTypes.map((t) => t.className).join("', '") + "')";
    } else {
      return ".overload()";
    }
  });
  throw new Error(`${name}(): ${message}
	${overloads.join("\n	")}`);
}
function makeMethod(methodName, classWrapper, type, methodId, retType2, argTypes2, env2, invocationOptions2) {
  const rawRetType = retType2.type;
  const rawArgTypes = argTypes2.map((t) => t.type);
  if (env2 === null) {
    env2 = vm2.getEnv();
  }
  let callVirtually, callDirectly;
  if (type === INSTANCE_METHOD) {
    callVirtually = env2.vaMethod(rawRetType, rawArgTypes, invocationOptions2);
    callDirectly = env2.nonvirtualVaMethod(rawRetType, rawArgTypes, invocationOptions2);
  } else if (type === STATIC_METHOD) {
    callVirtually = env2.staticVaMethod(rawRetType, rawArgTypes, invocationOptions2);
    callDirectly = callVirtually;
  } else {
    callVirtually = env2.constructor(rawArgTypes, invocationOptions2);
    callDirectly = callVirtually;
  }
  return makeMethodInstance([methodName, classWrapper, type, methodId, retType2, argTypes2, callVirtually, callDirectly]);
}
function makeMethodInstance(params) {
  const m2 = makeMethodCallable();
  Object.setPrototypeOf(m2, methodPrototype);
  m2._p = params;
  return m2;
}
function makeMethodCallable() {
  const m2 = function() {
    return m2.invoke(this, arguments);
  };
  return m2;
}
methodPrototype = Object.create(Function.prototype, {
  methodName: {
    enumerable: true,
    get() {
      return this._p[0];
    }
  },
  holder: {
    enumerable: true,
    get() {
      return this._p[1];
    }
  },
  type: {
    enumerable: true,
    get() {
      return this._p[2];
    }
  },
  handle: {
    enumerable: true,
    get() {
      return this._p[3];
    }
  },
  implementation: {
    enumerable: true,
    get() {
      const replacement = this._r;
      return replacement !== void 0 ? replacement : null;
    },
    set(fn) {
      const params = this._p;
      const holder = params[1];
      const type = params[2];
      if (type === CONSTRUCTOR_METHOD) {
        throw new Error("Reimplementing $new is not possible; replace implementation of $init instead");
      }
      const existingReplacement = this._r;
      if (existingReplacement !== void 0) {
        holder.$f._patchedMethods.delete(this);
        const mangler = existingReplacement._m;
        mangler.revert(vm2);
        this._r = void 0;
      }
      if (fn !== null) {
        const [methodName, classWrapper, type2, methodId, retType2, argTypes2] = params;
        const replacement = implement(methodName, classWrapper, type2, retType2, argTypes2, fn, this);
        const mangler = makeMethodMangler3(methodId);
        replacement._m = mangler;
        this._r = replacement;
        mangler.replace(replacement, type2 === INSTANCE_METHOD, argTypes2, vm2, api2);
        holder.$f._patchedMethods.add(this);
      }
    }
  },
  returnType: {
    enumerable: true,
    get() {
      return this._p[4];
    }
  },
  argumentTypes: {
    enumerable: true,
    get() {
      return this._p[5];
    }
  },
  canInvokeWith: {
    enumerable: true,
    value(args) {
      const argTypes2 = this._p[5];
      if (args.length !== argTypes2.length) {
        return false;
      }
      return argTypes2.every((t, i) => {
        return t.isCompatible(args[i]);
      });
    }
  },
  clone: {
    enumerable: true,
    value(options) {
      const params = this._p.slice(0, 6);
      return makeMethod(...params, null, options);
    }
  },
  invoke: {
    value(receiver, args) {
      const env2 = vm2.getEnv();
      const params = this._p;
      const type = params[2];
      const retType2 = params[4];
      const argTypes2 = params[5];
      const replacement = this._r;
      const isInstanceMethod = type === INSTANCE_METHOD;
      const numArgs = args.length;
      const frameCapacity = 2 + numArgs;
      env2.pushLocalFrame(frameCapacity);
      let borrowedHandle = null;
      try {
        let jniThis;
        if (isInstanceMethod) {
          jniThis = receiver.$getHandle();
        } else {
          borrowedHandle = receiver.$borrowClassHandle(env2);
          jniThis = borrowedHandle.value;
        }
        let methodId;
        let strategy = receiver.$t;
        if (replacement === void 0) {
          methodId = params[3];
        } else {
          const mangler = replacement._m;
          methodId = mangler.resolveTarget(receiver, isInstanceMethod, env2, api2);
          if (isArtVm) {
            const pendingCalls = replacement._c;
            if (pendingCalls.has(getCurrentThreadId())) {
              strategy = STRATEGY_DIRECT;
            }
          }
        }
        const jniArgs = [
          env2.handle,
          jniThis,
          methodId
        ];
        for (let i = 0; i !== numArgs; i++) {
          jniArgs.push(argTypes2[i].toJni(args[i], env2));
        }
        let jniCall;
        if (strategy === STRATEGY_VIRTUAL) {
          jniCall = params[6];
        } else {
          jniCall = params[7];
          if (isInstanceMethod) {
            jniArgs.splice(2, 0, receiver.$copyClassHandle(env2));
          }
        }
        const jniRetval = jniCall.apply(null, jniArgs);
        env2.throwIfExceptionPending();
        return retType2.fromJni(jniRetval, env2, true);
      } finally {
        if (borrowedHandle !== null) {
          borrowedHandle.unref(env2);
        }
        env2.popLocalFrame(NULL);
      }
    }
  },
  toString: {
    enumerable: true,
    value() {
      return `function ${this.methodName}(${this.argumentTypes.map((t) => t.className).join(", ")}): ${this.returnType.className}`;
    }
  }
});
function implement(methodName, classWrapper, type, retType2, argTypes2, handler, fallback = null) {
  const pendingCalls = /* @__PURE__ */ new Set();
  const f2 = makeMethodImplementation([methodName, classWrapper, type, retType2, argTypes2, handler, fallback, pendingCalls]);
  const impl2 = new NativeCallback(f2, retType2.type, ["pointer", "pointer"].concat(argTypes2.map((t) => t.type)));
  impl2._c = pendingCalls;
  return impl2;
}
function makeMethodImplementation(params) {
  return function() {
    return handleMethodInvocation(arguments, params);
  };
}
function handleMethodInvocation(jniArgs, params) {
  const env2 = new Env(jniArgs[0], vm2);
  const [methodName, classWrapper, type, retType2, argTypes2, handler, fallback, pendingCalls] = params;
  const ownedObjects = [];
  let self;
  if (type === INSTANCE_METHOD) {
    const C = classWrapper.$C;
    self = new C(jniArgs[1], STRATEGY_VIRTUAL, env2, false);
  } else {
    self = classWrapper;
  }
  const tid = getCurrentThreadId();
  env2.pushLocalFrame(3);
  let haveFrame = true;
  vm2.link(tid, env2);
  try {
    pendingCalls.add(tid);
    let fn;
    if (fallback === null || !ignoredThreads.has(tid)) {
      fn = handler;
    } else {
      fn = fallback;
    }
    const args = [];
    const numArgs = jniArgs.length - 2;
    for (let i = 0; i !== numArgs; i++) {
      const t = argTypes2[i];
      const value = t.fromJni(jniArgs[2 + i], env2, false);
      args.push(value);
      ownedObjects.push(value);
    }
    const retval = fn.apply(self, args);
    if (!retType2.isCompatible(retval)) {
      throw new Error(`Implementation for ${methodName} expected return value compatible with ${retType2.className}`);
    }
    let jniRetval = retType2.toJni(retval, env2);
    if (retType2.type === "pointer") {
      jniRetval = env2.popLocalFrame(jniRetval);
      haveFrame = false;
      ownedObjects.push(retval);
    }
    return jniRetval;
  } catch (e) {
    const jniException = e.$h;
    if (jniException !== void 0) {
      env2.throw(jniException);
    } else {
      Script.nextTick(() => {
        throw e;
      });
    }
    return retType2.defaultValue;
  } finally {
    vm2.unlink(tid);
    if (haveFrame) {
      env2.popLocalFrame(NULL);
    }
    pendingCalls.delete(tid);
    ownedObjects.forEach((obj) => {
      if (obj === null) {
        return;
      }
      const dispose2 = obj.$dispose;
      if (dispose2 !== void 0) {
        dispose2.call(obj);
      }
    });
  }
}
function ensureDefaultValueOfImplemented(methods) {
  const { holder, type } = methods[0];
  const hasDefaultValueOf = methods.some((m2) => m2.type === type && m2.argumentTypes.length === 0);
  if (hasDefaultValueOf) {
    return;
  }
  methods.push(makeValueOfMethod([holder, type]));
}
function makeValueOfMethod(params) {
  const m2 = makeValueOfCallable();
  Object.setPrototypeOf(m2, valueOfPrototype);
  m2._p = params;
  return m2;
}
function makeValueOfCallable() {
  const m2 = function() {
    return this;
  };
  return m2;
}
valueOfPrototype = Object.create(Function.prototype, {
  methodName: {
    enumerable: true,
    get() {
      return "valueOf";
    }
  },
  holder: {
    enumerable: true,
    get() {
      return this._p[0];
    }
  },
  type: {
    enumerable: true,
    get() {
      return this._p[1];
    }
  },
  handle: {
    enumerable: true,
    get() {
      return NULL;
    }
  },
  implementation: {
    enumerable: true,
    get() {
      return null;
    },
    set(fn) {
    }
  },
  returnType: {
    enumerable: true,
    get() {
      const classWrapper = this.holder;
      return classWrapper.$f.use(classWrapper.$n);
    }
  },
  argumentTypes: {
    enumerable: true,
    get() {
      return [];
    }
  },
  canInvokeWith: {
    enumerable: true,
    value(args) {
      return args.length === 0;
    }
  },
  clone: {
    enumerable: true,
    value(options) {
      throw new Error("Invalid operation");
    }
  }
});
function makeFieldFromSpec(name, spec, classHandle, classWrapper, env2) {
  const type = spec[2] === "s" ? STATIC_FIELD : INSTANCE_FIELD;
  const id = ptr(spec.substr(3));
  const { $f: factory } = classWrapper;
  let fieldType;
  const field = env2.toReflectedField(classHandle, id, type === STATIC_FIELD ? 1 : 0);
  try {
    fieldType = env2.vaMethod("pointer", [])(env2.handle, field, env2.javaLangReflectField().getGenericType);
    env2.throwIfExceptionPending();
  } finally {
    env2.deleteLocalRef(field);
  }
  let rtype;
  try {
    rtype = factory._getType(env2.getTypeName(fieldType));
  } finally {
    env2.deleteLocalRef(fieldType);
  }
  let getValue, setValue;
  const rtypeJni = rtype.type;
  if (type === STATIC_FIELD) {
    getValue = env2.getStaticField(rtypeJni);
    setValue = env2.setStaticField(rtypeJni);
  } else {
    getValue = env2.getField(rtypeJni);
    setValue = env2.setField(rtypeJni);
  }
  return makeFieldFromParams([type, rtype, id, getValue, setValue]);
}
function makeFieldFromParams(params) {
  return function(receiver) {
    return new Field([receiver].concat(params));
  };
}
function Field(params) {
  this._p = params;
}
Object.defineProperties(Field.prototype, {
  value: {
    enumerable: true,
    get() {
      const [holder, type, rtype, id, getValue] = this._p;
      const env2 = vm2.getEnv();
      env2.pushLocalFrame(4);
      let borrowedHandle = null;
      try {
        let jniThis;
        if (type === INSTANCE_FIELD) {
          jniThis = holder.$getHandle();
          if (jniThis === null) {
            throw new Error("Cannot access an instance field without an instance");
          }
        } else {
          borrowedHandle = holder.$borrowClassHandle(env2);
          jniThis = borrowedHandle.value;
        }
        const jniRetval = getValue(env2.handle, jniThis, id);
        env2.throwIfExceptionPending();
        return rtype.fromJni(jniRetval, env2, true);
      } finally {
        if (borrowedHandle !== null) {
          borrowedHandle.unref(env2);
        }
        env2.popLocalFrame(NULL);
      }
    },
    set(value) {
      const [holder, type, rtype, id, , setValue] = this._p;
      const env2 = vm2.getEnv();
      env2.pushLocalFrame(4);
      let borrowedHandle = null;
      try {
        let jniThis;
        if (type === INSTANCE_FIELD) {
          jniThis = holder.$getHandle();
          if (jniThis === null) {
            throw new Error("Cannot access an instance field without an instance");
          }
        } else {
          borrowedHandle = holder.$borrowClassHandle(env2);
          jniThis = borrowedHandle.value;
        }
        if (!rtype.isCompatible(value)) {
          throw new Error(`Expected value compatible with ${rtype.className}`);
        }
        const jniValue = rtype.toJni(value, env2);
        setValue(env2.handle, jniThis, id, jniValue);
        env2.throwIfExceptionPending();
      } finally {
        if (borrowedHandle !== null) {
          borrowedHandle.unref(env2);
        }
        env2.popLocalFrame(NULL);
      }
    }
  },
  holder: {
    enumerable: true,
    get() {
      return this._p[0];
    }
  },
  fieldType: {
    enumerable: true,
    get() {
      return this._p[1];
    }
  },
  fieldReturnType: {
    enumerable: true,
    get() {
      return this._p[2];
    }
  },
  toString: {
    enumerable: true,
    value() {
      const inlineString = `Java.Field{holder: ${this.holder}, fieldType: ${this.fieldType}, fieldReturnType: ${this.fieldReturnType}, value: ${this.value}}`;
      if (inlineString.length < 200) {
        return inlineString;
      }
      const multilineString = `Java.Field{
	holder: ${this.holder},
	fieldType: ${this.fieldType},
	fieldReturnType: ${this.fieldReturnType},
	value: ${this.value},
}`;
      return multilineString.split("\n").map((l) => l.length > 200 ? l.slice(0, l.indexOf(" ") + 1) + "...," : l).join("\n");
    }
  }
});
var DexFile = class _DexFile {
  static fromBuffer(buffer, factory) {
    const fileValue = createTemporaryDex(factory);
    const filePath = fileValue.getCanonicalPath().toString();
    const file = new File(filePath, "w");
    file.write(buffer.buffer);
    file.close();
    setReadOnlyDex(filePath, factory);
    return new _DexFile(filePath, fileValue, factory);
  }
  constructor(path, file, factory) {
    this.path = path;
    this.file = file;
    this._factory = factory;
  }
  load() {
    const { _factory: factory } = this;
    const { codeCacheDir } = factory;
    const DexClassLoader = factory.use("dalvik.system.DexClassLoader");
    const JFile = factory.use("java.io.File");
    let file = this.file;
    if (file === null) {
      file = factory.use("java.io.File").$new(this.path);
    }
    if (!file.exists()) {
      throw new Error("File not found");
    }
    JFile.$new(codeCacheDir).mkdirs();
    factory.loader = DexClassLoader.$new(file.getCanonicalPath(), codeCacheDir, null, factory.loader);
    vm2.preventDetachDueToClassLoader();
  }
  getClassNames() {
    const { _factory: factory } = this;
    const DexFile2 = factory.use("dalvik.system.DexFile");
    const optimizedDex = createTemporaryDex(factory);
    const dx = DexFile2.loadDex(this.path, optimizedDex.getCanonicalPath(), 0);
    const classNames = [];
    const enumeratorClassNames = dx.entries();
    while (enumeratorClassNames.hasMoreElements()) {
      classNames.push(enumeratorClassNames.nextElement().toString());
    }
    return classNames;
  }
};
function createTemporaryDex(factory) {
  const { cacheDir, tempFileNaming } = factory;
  const JFile = factory.use("java.io.File");
  const cacheDirValue = JFile.$new(cacheDir);
  cacheDirValue.mkdirs();
  return JFile.createTempFile(tempFileNaming.prefix, tempFileNaming.suffix + ".dex", cacheDirValue);
}
function setReadOnlyDex(filePath, factory) {
  const JFile = factory.use("java.io.File");
  const file = JFile.$new(filePath);
  file.setWritable(false, false);
}
function getFactoryCache() {
  switch (factoryCache.state) {
    case "empty": {
      factoryCache.state = "pending";
      const defaultFactory = factoryCache.factories[0];
      const HashMap = defaultFactory.use("java.util.HashMap");
      const Integer = defaultFactory.use("java.lang.Integer");
      factoryCache.loaders = HashMap.$new();
      factoryCache.Integer = Integer;
      const loader = defaultFactory.loader;
      if (loader !== null) {
        addFactoryToCache(defaultFactory, loader);
      }
      factoryCache.state = "ready";
      return factoryCache;
    }
    case "pending":
      do {
        Thread.sleep(0.05);
      } while (factoryCache.state === "pending");
      return factoryCache;
    case "ready":
      return factoryCache;
  }
}
function addFactoryToCache(factory, loader) {
  const { factories, loaders, Integer } = factoryCache;
  const index = Integer.$new(factories.indexOf(factory));
  loaders.put(loader, index);
  for (let l = loader.getParent(); l !== null; l = l.getParent()) {
    if (loaders.containsKey(l)) {
      break;
    }
    loaders.put(l, index);
  }
}
function ignore(threadId) {
  let count = ignoredThreads.get(threadId);
  if (count === void 0) {
    count = 0;
  }
  count++;
  ignoredThreads.set(threadId, count);
}
function unignore(threadId) {
  let count = ignoredThreads.get(threadId);
  if (count === void 0) {
    throw new Error(`Thread ${threadId} is not ignored`);
  }
  count--;
  if (count === 0) {
    ignoredThreads.delete(threadId);
  } else {
    ignoredThreads.set(threadId, count);
  }
}
function basename(className) {
  return className.slice(className.lastIndexOf(".") + 1);
}
function readTypeNames(env2, types3) {
  const names = [];
  const n = env2.getArrayLength(types3);
  for (let i = 0; i !== n; i++) {
    const t = env2.getObjectArrayElement(types3, i);
    try {
      names.push(env2.getTypeName(t));
    } finally {
      env2.deleteLocalRef(t);
    }
  }
  return names;
}
function makeSourceFileName(className) {
  const tokens = className.split(".");
  return tokens[tokens.length - 1] + ".java";
}

// node_modules/frida-java-bridge/index.js
var jsizeSize4 = 4;
var pointerSize9 = Process.pointerSize;
var Runtime = class {
  ACC_PUBLIC = 1;
  ACC_PRIVATE = 2;
  ACC_PROTECTED = 4;
  ACC_STATIC = 8;
  ACC_FINAL = 16;
  ACC_SYNCHRONIZED = 32;
  ACC_BRIDGE = 64;
  ACC_VARARGS = 128;
  ACC_NATIVE = 256;
  ACC_ABSTRACT = 1024;
  ACC_STRICT = 2048;
  ACC_SYNTHETIC = 4096;
  constructor() {
    this.classFactory = null;
    this.ClassFactory = ClassFactory;
    this.vm = null;
    this.api = null;
    this._initialized = false;
    this._apiError = null;
    this._wakeupHandler = null;
    this._pollListener = null;
    this._pendingMainOps = [];
    this._pendingVmOps = [];
    this._cachedIsAppProcess = null;
    try {
      this._tryInitialize();
    } catch (e) {
    }
  }
  _tryInitialize() {
    if (this._initialized) {
      return true;
    }
    if (this._apiError !== null) {
      throw this._apiError;
    }
    let api3;
    try {
      api3 = api_default();
      this.api = api3;
    } catch (e) {
      this._apiError = e;
      throw e;
    }
    if (api3 === null) {
      return false;
    }
    const vm3 = new VM(api3);
    this.vm = vm3;
    initialize(vm3);
    ClassFactory._initialize(vm3, api3);
    this.classFactory = new ClassFactory();
    this._initialized = true;
    return true;
  }
  _dispose() {
    if (this.api === null) {
      return;
    }
    const { vm: vm3 } = this;
    vm3.perform((env2) => {
      ClassFactory._disposeAll(env2);
      Env.dispose(env2);
    });
    Script.nextTick(() => {
      VM.dispose(vm3);
    });
  }
  get available() {
    return this._tryInitialize();
  }
  get androidVersion() {
    return getAndroidVersion();
  }
  synchronized(obj, fn) {
    const { $h: objHandle = obj } = obj;
    if (!(objHandle instanceof NativePointer)) {
      throw new Error("Java.synchronized: the first argument `obj` must be either a pointer or a Java instance");
    }
    const env2 = this.vm.getEnv();
    checkJniResult("VM::MonitorEnter", env2.monitorEnter(objHandle));
    try {
      fn();
    } finally {
      env2.monitorExit(objHandle);
    }
  }
  enumerateLoadedClasses(callbacks) {
    this._checkAvailable();
    const { flavor } = this.api;
    if (flavor === "jvm") {
      this._enumerateLoadedClassesJvm(callbacks);
    } else if (flavor === "art") {
      this._enumerateLoadedClassesArt(callbacks);
    } else {
      this._enumerateLoadedClassesDalvik(callbacks);
    }
  }
  enumerateLoadedClassesSync() {
    const classes = [];
    this.enumerateLoadedClasses({
      onMatch(c) {
        classes.push(c);
      },
      onComplete() {
      }
    });
    return classes;
  }
  enumerateClassLoaders(callbacks) {
    this._checkAvailable();
    const { flavor } = this.api;
    if (flavor === "jvm") {
      this._enumerateClassLoadersJvm(callbacks);
    } else if (flavor === "art") {
      this._enumerateClassLoadersArt(callbacks);
    } else {
      throw new Error("Enumerating class loaders is not supported on Dalvik");
    }
  }
  enumerateClassLoadersSync() {
    const loaders = [];
    this.enumerateClassLoaders({
      onMatch(c) {
        loaders.push(c);
      },
      onComplete() {
      }
    });
    return loaders;
  }
  _enumerateLoadedClassesJvm(callbacks) {
    const { api: api3, vm: vm3 } = this;
    const { jvmti } = api3;
    const env2 = vm3.getEnv();
    const countPtr = Memory.alloc(jsizeSize4);
    const classesPtr = Memory.alloc(pointerSize9);
    jvmti.getLoadedClasses(countPtr, classesPtr);
    const count = countPtr.readS32();
    const classes = classesPtr.readPointer();
    const handles = [];
    for (let i = 0; i !== count; i++) {
      handles.push(classes.add(i * pointerSize9).readPointer());
    }
    jvmti.deallocate(classes);
    try {
      for (const handle2 of handles) {
        const className = env2.getClassName(handle2);
        callbacks.onMatch(className, handle2);
      }
      callbacks.onComplete();
    } finally {
      handles.forEach((handle2) => {
        env2.deleteLocalRef(handle2);
      });
    }
  }
  _enumerateClassLoadersJvm(callbacks) {
    this.choose("java.lang.ClassLoader", callbacks);
  }
  _enumerateLoadedClassesArt(callbacks) {
    const { vm: vm3, api: api3 } = this;
    const env2 = vm3.getEnv();
    const addGlobalReference = api3["art::JavaVMExt::AddGlobalRef"];
    const { vm: vmHandle } = api3;
    withRunnableArtThread(vm3, env2, (thread) => {
      const collectClassHandles = makeArtClassVisitor((klass) => {
        const handle2 = addGlobalReference(vmHandle, thread, klass);
        try {
          const className = env2.getClassName(handle2);
          callbacks.onMatch(className, handle2);
        } finally {
          env2.deleteGlobalRef(handle2);
        }
        return true;
      });
      api3["art::ClassLinker::VisitClasses"](api3.artClassLinker.address, collectClassHandles);
    });
    callbacks.onComplete();
  }
  _enumerateClassLoadersArt(callbacks) {
    const { classFactory: factory, vm: vm3, api: api3 } = this;
    const env2 = vm3.getEnv();
    const visitClassLoaders = api3["art::ClassLinker::VisitClassLoaders"];
    if (visitClassLoaders === void 0) {
      throw new Error("This API is only available on Android >= 7.0");
    }
    const ClassLoader = factory.use("java.lang.ClassLoader");
    const loaderHandles = [];
    const addGlobalReference = api3["art::JavaVMExt::AddGlobalRef"];
    const { vm: vmHandle } = api3;
    withRunnableArtThread(vm3, env2, (thread) => {
      const collectLoaderHandles = makeArtClassLoaderVisitor((loader) => {
        loaderHandles.push(addGlobalReference(vmHandle, thread, loader));
        return true;
      });
      withAllArtThreadsSuspended(() => {
        visitClassLoaders(api3.artClassLinker.address, collectLoaderHandles);
      });
    });
    try {
      loaderHandles.forEach((handle2) => {
        const loader = factory.cast(handle2, ClassLoader);
        callbacks.onMatch(loader);
      });
    } finally {
      loaderHandles.forEach((handle2) => {
        env2.deleteGlobalRef(handle2);
      });
    }
    callbacks.onComplete();
  }
  _enumerateLoadedClassesDalvik(callbacks) {
    const { api: api3 } = this;
    const HASH_TOMBSTONE = ptr("0xcbcacccd");
    const loadedClassesOffset = 172;
    const hashEntrySize = 8;
    const ptrLoadedClassesHashtable = api3.gDvm.add(loadedClassesOffset);
    const hashTable = ptrLoadedClassesHashtable.readPointer();
    const tableSize = hashTable.readS32();
    const ptrpEntries = hashTable.add(12);
    const pEntries = ptrpEntries.readPointer();
    const end = tableSize * hashEntrySize;
    for (let offset = 0; offset < end; offset += hashEntrySize) {
      const pEntryPtr = pEntries.add(offset);
      const dataPtr = pEntryPtr.add(4).readPointer();
      if (dataPtr.isNull() || dataPtr.equals(HASH_TOMBSTONE)) {
        continue;
      }
      const descriptionPtr = dataPtr.add(24).readPointer();
      const description = descriptionPtr.readUtf8String();
      if (description.startsWith("L")) {
        const name = description.substring(1, description.length - 1).replace(/\//g, ".");
        callbacks.onMatch(name);
      }
    }
    callbacks.onComplete();
  }
  enumerateMethods(query) {
    const { classFactory: factory } = this;
    const env2 = this.vm.getEnv();
    const ClassLoader = factory.use("java.lang.ClassLoader");
    return Model.enumerateMethods(query, this.api, env2).map((group) => {
      const handle2 = group.loader;
      group.loader = handle2 !== null ? factory.wrap(handle2, ClassLoader, env2) : null;
      return group;
    });
  }
  scheduleOnMainThread(fn) {
    this.performNow(() => {
      this._pendingMainOps.push(fn);
      let { _wakeupHandler: wakeupHandler } = this;
      if (wakeupHandler === null) {
        const { classFactory: factory } = this;
        const Handler = factory.use("android.os.Handler");
        const Looper = factory.use("android.os.Looper");
        wakeupHandler = Handler.$new(Looper.getMainLooper());
        this._wakeupHandler = wakeupHandler;
      }
      if (this._pollListener === null) {
        this._pollListener = Interceptor.attach(Process.getModuleByName("libc.so").getExportByName("epoll_wait"), this._makePollHook());
        Interceptor.flush();
      }
      wakeupHandler.sendEmptyMessage(1);
    });
  }
  _makePollHook() {
    const mainThreadId = Process.id;
    const { _pendingMainOps: pending } = this;
    return function() {
      if (this.threadId !== mainThreadId) {
        return;
      }
      let fn;
      while ((fn = pending.shift()) !== void 0) {
        try {
          fn();
        } catch (e) {
          Script.nextTick(() => {
            throw e;
          });
        }
      }
    };
  }
  perform(fn) {
    this._checkAvailable();
    if (!this._isAppProcess() || this.classFactory.loader !== null) {
      try {
        this.vm.perform(fn);
      } catch (e) {
        Script.nextTick(() => {
          throw e;
        });
      }
    } else {
      this._pendingVmOps.push(fn);
      if (this._pendingVmOps.length === 1) {
        this._performPendingVmOpsWhenReady();
      }
    }
  }
  performNow(fn) {
    this._checkAvailable();
    return this.vm.perform(() => {
      const { classFactory: factory } = this;
      if (this._isAppProcess() && factory.loader === null) {
        const ActivityThread = factory.use("android.app.ActivityThread");
        const app = ActivityThread.currentApplication();
        if (app !== null) {
          initFactoryFromApplication(factory, app);
        }
      }
      return fn();
    });
  }
  _performPendingVmOpsWhenReady() {
    this.vm.perform(() => {
      const { classFactory: factory } = this;
      const ActivityThread = factory.use("android.app.ActivityThread");
      const app = ActivityThread.currentApplication();
      if (app !== null) {
        initFactoryFromApplication(factory, app);
        this._performPendingVmOps();
        return;
      }
      const runtime3 = this;
      let initialized = false;
      let hookpoint = "early";
      const handleBindApplication = ActivityThread.handleBindApplication;
      handleBindApplication.implementation = function(data) {
        if (data.instrumentationName.value !== null) {
          hookpoint = "late";
          const LoadedApk = factory.use("android.app.LoadedApk");
          const makeApplication = LoadedApk.makeApplication;
          makeApplication.implementation = function(forceDefaultAppClass, instrumentation) {
            if (!initialized) {
              initialized = true;
              initFactoryFromLoadedApk(factory, this);
              runtime3._performPendingVmOps();
            }
            return makeApplication.apply(this, arguments);
          };
        }
        handleBindApplication.apply(this, arguments);
      };
      const getPackageInfoCandidates = ActivityThread.getPackageInfo.overloads.map((m2) => [m2.argumentTypes.length, m2]).sort(([arityA], [arityB]) => arityB - arityA).map(([_, method2]) => method2);
      const getPackageInfo = getPackageInfoCandidates[0];
      getPackageInfo.implementation = function(...args) {
        const apk = getPackageInfo.call(this, ...args);
        if (!initialized && hookpoint === "early") {
          initialized = true;
          initFactoryFromLoadedApk(factory, apk);
          runtime3._performPendingVmOps();
        }
        return apk;
      };
    });
  }
  _performPendingVmOps() {
    const { vm: vm3, _pendingVmOps: pending } = this;
    let fn;
    while ((fn = pending.shift()) !== void 0) {
      try {
        vm3.perform(fn);
      } catch (e) {
        Script.nextTick(() => {
          throw e;
        });
      }
    }
  }
  use(className, options) {
    return this.classFactory.use(className, options);
  }
  openClassFile(filePath) {
    return this.classFactory.openClassFile(filePath);
  }
  choose(specifier, callbacks) {
    this.classFactory.choose(specifier, callbacks);
  }
  retain(obj) {
    return this.classFactory.retain(obj);
  }
  cast(obj, C) {
    return this.classFactory.cast(obj, C);
  }
  array(type, elements) {
    return this.classFactory.array(type, elements);
  }
  backtrace(options) {
    return backtrace(this.vm, options);
  }
  // Reference: http://stackoverflow.com/questions/2848575/how-to-detect-ui-thread-on-android
  isMainThread() {
    const Looper = this.classFactory.use("android.os.Looper");
    const mainLooper = Looper.getMainLooper();
    const myLooper = Looper.myLooper();
    if (myLooper === null) {
      return false;
    }
    return mainLooper.$isSameObject(myLooper);
  }
  registerClass(spec) {
    return this.classFactory.registerClass(spec);
  }
  deoptimizeEverything() {
    const { vm: vm3 } = this;
    return deoptimizeEverything(vm3, vm3.getEnv());
  }
  deoptimizeBootImage() {
    const { vm: vm3 } = this;
    return deoptimizeBootImage(vm3, vm3.getEnv());
  }
  deoptimizeMethod(method2) {
    const { vm: vm3 } = this;
    return deoptimizeMethod(vm3, vm3.getEnv(), method2);
  }
  _checkAvailable() {
    if (!this.available) {
      throw new Error("Java API not available");
    }
  }
  _isAppProcess() {
    let result = this._cachedIsAppProcess;
    if (result === null) {
      if (this.api.flavor === "jvm") {
        result = false;
        this._cachedIsAppProcess = result;
        return result;
      }
      const readlink2 = new NativeFunction(Module.getGlobalExportByName("readlink"), "pointer", ["pointer", "pointer", "pointer"], {
        exceptions: "propagate"
      });
      const pathname = Memory.allocUtf8String("/proc/self/exe");
      const bufferSize = 1024;
      const buffer = Memory.alloc(bufferSize);
      const size = readlink2(pathname, buffer, ptr(bufferSize)).toInt32();
      if (size !== -1) {
        const exe = buffer.readUtf8String(size);
        result = /^\/system\/bin\/app_process/.test(exe);
      } else {
        result = true;
      }
      this._cachedIsAppProcess = result;
    }
    return result;
  }
};
function initFactoryFromApplication(factory, app) {
  const Process2 = factory.use("android.os.Process");
  factory.loader = app.getClassLoader();
  if (Process2.myUid() === Process2.SYSTEM_UID.value) {
    factory.cacheDir = "/data/system";
    factory.codeCacheDir = "/data/dalvik-cache";
  } else {
    if ("getCodeCacheDir" in app) {
      factory.cacheDir = app.getCacheDir().getCanonicalPath();
      factory.codeCacheDir = app.getCodeCacheDir().getCanonicalPath();
    } else {
      factory.cacheDir = app.getFilesDir().getCanonicalPath();
      factory.codeCacheDir = app.getCacheDir().getCanonicalPath();
    }
  }
}
function initFactoryFromLoadedApk(factory, apk) {
  const JFile = factory.use("java.io.File");
  factory.loader = apk.getClassLoader();
  const dataDir = JFile.$new(apk.getDataDir()).getCanonicalPath();
  factory.cacheDir = dataDir;
  factory.codeCacheDir = dataDir + "/cache";
}
var runtime = new Runtime();
Script.bindWeak(runtime, () => {
  runtime._dispose();
});
var frida_java_bridge_default = runtime;

// node_modules/frida-objc-bridge/lib/api.js
var cachedApi3 = null;
var defaultInvocationOptions = {
  exceptions: "propagate"
};
function getApi4() {
  if (cachedApi3 !== null) {
    return cachedApi3;
  }
  const temporaryApi = {};
  const pending = [
    {
      module: "libsystem_malloc.dylib",
      functions: {
        "free": ["void", ["pointer"]]
      }
    },
    {
      module: "libobjc.A.dylib",
      functions: {
        "objc_msgSend": function(address) {
          this.objc_msgSend = address;
        },
        "objc_msgSend_stret": function(address) {
          this.objc_msgSend_stret = address;
        },
        "objc_msgSend_fpret": function(address) {
          this.objc_msgSend_fpret = address;
        },
        "objc_msgSendSuper": function(address) {
          this.objc_msgSendSuper = address;
        },
        "objc_msgSendSuper_stret": function(address) {
          this.objc_msgSendSuper_stret = address;
        },
        "objc_msgSendSuper_fpret": function(address) {
          this.objc_msgSendSuper_fpret = address;
        },
        "objc_getClassList": ["int", ["pointer", "int"]],
        "objc_lookUpClass": ["pointer", ["pointer"]],
        "objc_allocateClassPair": ["pointer", ["pointer", "pointer", "pointer"]],
        "objc_disposeClassPair": ["void", ["pointer"]],
        "objc_registerClassPair": ["void", ["pointer"]],
        "class_isMetaClass": ["bool", ["pointer"]],
        "class_getName": ["pointer", ["pointer"]],
        "class_getImageName": ["pointer", ["pointer"]],
        "class_copyProtocolList": ["pointer", ["pointer", "pointer"]],
        "class_copyMethodList": ["pointer", ["pointer", "pointer"]],
        "class_getClassMethod": ["pointer", ["pointer", "pointer"]],
        "class_getInstanceMethod": ["pointer", ["pointer", "pointer"]],
        "class_getSuperclass": ["pointer", ["pointer"]],
        "class_addProtocol": ["bool", ["pointer", "pointer"]],
        "class_addMethod": ["bool", ["pointer", "pointer", "pointer", "pointer"]],
        "class_copyIvarList": ["pointer", ["pointer", "pointer"]],
        "objc_getProtocol": ["pointer", ["pointer"]],
        "objc_copyProtocolList": ["pointer", ["pointer"]],
        "objc_allocateProtocol": ["pointer", ["pointer"]],
        "objc_registerProtocol": ["void", ["pointer"]],
        "protocol_getName": ["pointer", ["pointer"]],
        "protocol_copyMethodDescriptionList": ["pointer", ["pointer", "bool", "bool", "pointer"]],
        "protocol_copyPropertyList": ["pointer", ["pointer", "pointer"]],
        "protocol_copyProtocolList": ["pointer", ["pointer", "pointer"]],
        "protocol_addProtocol": ["void", ["pointer", "pointer"]],
        "protocol_addMethodDescription": ["void", ["pointer", "pointer", "pointer", "bool", "bool"]],
        "ivar_getName": ["pointer", ["pointer"]],
        "ivar_getTypeEncoding": ["pointer", ["pointer"]],
        "ivar_getOffset": ["pointer", ["pointer"]],
        "object_isClass": ["bool", ["pointer"]],
        "object_getClass": ["pointer", ["pointer"]],
        "object_getClassName": ["pointer", ["pointer"]],
        "method_getName": ["pointer", ["pointer"]],
        "method_getTypeEncoding": ["pointer", ["pointer"]],
        "method_getImplementation": ["pointer", ["pointer"]],
        "method_setImplementation": ["pointer", ["pointer", "pointer"]],
        "property_getName": ["pointer", ["pointer"]],
        "property_copyAttributeList": ["pointer", ["pointer", "pointer"]],
        "sel_getName": ["pointer", ["pointer"]],
        "sel_registerName": ["pointer", ["pointer"]],
        "class_getInstanceSize": ["pointer", ["pointer"]]
      },
      optionals: {
        "objc_msgSend_stret": "ABI",
        "objc_msgSend_fpret": "ABI",
        "objc_msgSendSuper_stret": "ABI",
        "objc_msgSendSuper_fpret": "ABI",
        "object_isClass": "iOS8"
      }
    },
    {
      module: "libdispatch.dylib",
      functions: {
        "dispatch_async_f": ["void", ["pointer", "pointer", "pointer"]]
      },
      variables: {
        "_dispatch_main_q": function(address) {
          this._dispatch_main_q = address;
        }
      }
    }
  ];
  let remaining = 0;
  pending.forEach(function(api3) {
    const isObjCApi = api3.module === "libobjc.A.dylib";
    const functions = api3.functions || {};
    const variables = api3.variables || {};
    const optionals = api3.optionals || {};
    remaining += Object.keys(functions).length + Object.keys(variables).length;
    const exportByName = (Process.findModuleByName(api3.module)?.enumerateExports() ?? []).reduce(function(result, exp) {
      result[exp.name] = exp;
      return result;
    }, {});
    Object.keys(functions).forEach(function(name) {
      const exp = exportByName[name];
      if (exp !== void 0 && exp.type === "function") {
        const signature2 = functions[name];
        if (typeof signature2 === "function") {
          signature2.call(temporaryApi, exp.address);
          if (isObjCApi)
            signature2.call(temporaryApi, exp.address);
        } else {
          temporaryApi[name] = new NativeFunction(exp.address, signature2[0], signature2[1], defaultInvocationOptions);
          if (isObjCApi)
            temporaryApi[name] = temporaryApi[name];
        }
        remaining--;
      } else {
        const optional = optionals[name];
        if (optional)
          remaining--;
      }
    });
    Object.keys(variables).forEach(function(name) {
      const exp = exportByName[name];
      if (exp !== void 0 && exp.type === "variable") {
        const handler = variables[name];
        handler.call(temporaryApi, exp.address);
        remaining--;
      }
    });
  });
  if (remaining === 0) {
    if (!temporaryApi.objc_msgSend_stret)
      temporaryApi.objc_msgSend_stret = temporaryApi.objc_msgSend;
    if (!temporaryApi.objc_msgSend_fpret)
      temporaryApi.objc_msgSend_fpret = temporaryApi.objc_msgSend;
    if (!temporaryApi.objc_msgSendSuper_stret)
      temporaryApi.objc_msgSendSuper_stret = temporaryApi.objc_msgSendSuper;
    if (!temporaryApi.objc_msgSendSuper_fpret)
      temporaryApi.objc_msgSendSuper_fpret = temporaryApi.objc_msgSendSuper;
    cachedApi3 = temporaryApi;
  }
  return cachedApi3;
}

// node_modules/frida-objc-bridge/lib/fastpaths.js
var code3 = `#include <glib.h>
#include <ptrauth.h>

#define KERN_SUCCESS 0
#define MALLOC_PTR_IN_USE_RANGE_TYPE 1
#if defined (HAVE_I386) && GLIB_SIZEOF_VOID_P == 8
# define OBJC_ISA_MASK 0x7ffffffffff8ULL
#elif defined (HAVE_ARM64)
# define OBJC_ISA_MASK 0xffffffff8ULL
#endif

typedef struct _ChooseContext ChooseContext;

typedef struct _malloc_zone_t malloc_zone_t;
typedef struct _malloc_introspection_t malloc_introspection_t;
typedef struct _vm_range_t vm_range_t;

typedef gpointer Class;
typedef int kern_return_t;
typedef guint mach_port_t;
typedef mach_port_t task_t;
typedef guintptr vm_offset_t;
typedef guintptr vm_size_t;
typedef vm_offset_t vm_address_t;

struct _ChooseContext
{
  GHashTable * classes;
  GArray * matches;
};

struct _malloc_zone_t
{
  void * reserved1;
  void * reserved2;
  size_t (* size) (struct _malloc_zone_t * zone, const void * ptr);
  void * (* malloc) (struct _malloc_zone_t * zone, size_t size);
  void * (* calloc) (struct _malloc_zone_t * zone, size_t num_items, size_t size);
  void * (* valloc) (struct _malloc_zone_t * zone, size_t size);
  void (* free) (struct _malloc_zone_t * zone, void * ptr);
  void * (* realloc) (struct _malloc_zone_t * zone, void * ptr, size_t size);
  void (* destroy) (struct _malloc_zone_t * zone);
  const char * zone_name;

  unsigned (* batch_malloc) (struct _malloc_zone_t * zone, size_t size, void ** results, unsigned num_requested);
  void (* batch_free) (struct _malloc_zone_t * zone, void ** to_be_freed, unsigned num_to_be_freed);

  malloc_introspection_t * introspect;
};

typedef kern_return_t (* memory_reader_t) (task_t remote_task, vm_address_t remote_address, vm_size_t size, void ** local_memory);
typedef void (* vm_range_recorder_t) (task_t task, void * user_data, unsigned type, vm_range_t * ranges, unsigned count);
typedef kern_return_t (* enumerator_func) (task_t task, void * user_data, unsigned type_mask, vm_address_t zone_address, memory_reader_t reader,
      vm_range_recorder_t recorder);

struct _malloc_introspection_t
{
  enumerator_func enumerator;
};

struct _vm_range_t
{
  vm_address_t address;
  vm_size_t size;
};

extern int objc_getClassList (Class * buffer, int buffer_count);
extern Class class_getSuperclass (Class cls);
extern size_t class_getInstanceSize (Class cls);
extern kern_return_t malloc_get_all_zones (task_t task, memory_reader_t reader, vm_address_t ** addresses, unsigned * count);

static void collect_subclasses (Class klass, GHashTable * result);
static void collect_matches_in_ranges (task_t task, void * user_data, unsigned type, vm_range_t * ranges, unsigned count);
static kern_return_t read_local_memory (task_t remote_task, vm_address_t remote_address, vm_size_t size, void ** local_memory);

extern mach_port_t selfTask;

gpointer *
choose (Class * klass,
        gboolean consider_subclasses,
        guint * count)
{
  ChooseContext ctx;
  GHashTable * classes;
  vm_address_t * malloc_zone_addresses;
  unsigned malloc_zone_count, i;

  classes = g_hash_table_new_full (NULL, NULL, NULL, NULL);
  ctx.classes = classes;
  ctx.matches = g_array_new (FALSE, FALSE, sizeof (gpointer));
  if (consider_subclasses)
    collect_subclasses (klass, classes);
  else
    g_hash_table_insert (classes, klass, GSIZE_TO_POINTER (class_getInstanceSize (klass)));

  malloc_zone_count = 0;
  malloc_get_all_zones (selfTask, read_local_memory, &malloc_zone_addresses, &malloc_zone_count);

  for (i = 0; i != malloc_zone_count; i++)
  {
    vm_address_t zone_address = malloc_zone_addresses[i];
    malloc_zone_t * zone = (malloc_zone_t *) zone_address;
    enumerator_func enumerator;

    if (zone != NULL && zone->introspect != NULL &&
        (enumerator = (ptrauth_strip (zone->introspect, ptrauth_key_asda))->enumerator) != NULL)
    {
      enumerator = ptrauth_sign_unauthenticated (
          ptrauth_strip (enumerator, ptrauth_key_asia),
          ptrauth_key_asia, 0);

      enumerator (selfTask, &ctx, MALLOC_PTR_IN_USE_RANGE_TYPE, zone_address, read_local_memory,
          collect_matches_in_ranges);
    }
  }

  g_hash_table_unref (classes);

  *count = ctx.matches->len;

  return (gpointer *) g_array_free (ctx.matches, FALSE);
}

void
destroy (gpointer mem)
{
  g_free (mem);
}

static void
collect_subclasses (Class klass,
                    GHashTable * result)
{
  Class * classes;
  int count, i;

  count = objc_getClassList (NULL, 0);
  classes = g_malloc (count * sizeof (gpointer));
  count = objc_getClassList (classes, count);

  for (i = 0; i != count; i++)
  {
    Class candidate = classes[i];
    Class c;

    c = candidate;
    do
    {
      if (c == klass)
      {
        g_hash_table_insert (result, candidate, GSIZE_TO_POINTER (class_getInstanceSize (candidate)));
        break;
      }

      c = class_getSuperclass (c);
    }
    while (c != NULL);
  }

  g_free (classes);
}

static void
collect_matches_in_ranges (task_t task,
                           void * user_data,
                           unsigned type,
                           vm_range_t * ranges,
                           unsigned count)
{
  ChooseContext * ctx = user_data;
  GHashTable * classes = ctx->classes;
  unsigned i;

  for (i = 0; i != count; i++)
  {
    const vm_range_t * range = &ranges[i];
    gconstpointer candidate = GSIZE_TO_POINTER (range->address);
    gconstpointer isa;
    guint instance_size;

    isa = *(gconstpointer *) candidate;
#ifdef OBJC_ISA_MASK
    isa = GSIZE_TO_POINTER (GPOINTER_TO_SIZE (isa) & OBJC_ISA_MASK);
#endif

    instance_size = GPOINTER_TO_UINT (g_hash_table_lookup (classes, isa));
    if (instance_size != 0 && range->size >= instance_size)
    {
      g_array_append_val (ctx->matches, candidate);
    }
  }
}

static kern_return_t
read_local_memory (task_t remote_task,
                   vm_address_t remote_address,
                   vm_size_t size,
                   void ** local_memory)
{
  *local_memory = (void *) remote_address;

  return KERN_SUCCESS;
}
`;
var { pointerSize: pointerSize10 } = Process;
var cachedModule = null;
function get() {
  if (cachedModule === null)
    cachedModule = compileModule2();
  return cachedModule;
}
function compileModule2() {
  const {
    objc_getClassList,
    class_getSuperclass,
    class_getInstanceSize
  } = getApi4();
  const selfTask = Memory.alloc(4);
  selfTask.writeU32(Module.getGlobalExportByName("mach_task_self_").readU32());
  const cm2 = new CModule(code3, {
    objc_getClassList,
    class_getSuperclass,
    class_getInstanceSize,
    malloc_get_all_zones: Process.getModuleByName("/usr/lib/system/libsystem_malloc.dylib").getExportByName("malloc_get_all_zones"),
    selfTask
  });
  const _choose = new NativeFunction(cm2.choose, "pointer", ["pointer", "bool", "pointer"]);
  const _destroy2 = new NativeFunction(cm2.destroy, "void", ["pointer"]);
  return {
    handle: cm2,
    choose(klass, considerSubclasses) {
      const result = [];
      const countPtr = Memory.alloc(4);
      const matches = _choose(klass, considerSubclasses ? 1 : 0, countPtr);
      try {
        const count = countPtr.readU32();
        for (let i = 0; i !== count; i++)
          result.push(matches.add(i * pointerSize10).readPointer());
      } finally {
        _destroy2(matches);
      }
      return result;
    }
  };
}

// node_modules/frida-objc-bridge/index.js
function Runtime2() {
  const pointerSize = Process.pointerSize;
  let api = null;
  let apiError = null;
  const realizedClasses = /* @__PURE__ */ new Set();
  const classRegistry = new ClassRegistry();
  const protocolRegistry = new ProtocolRegistry();
  const replacedMethods = /* @__PURE__ */ new Map();
  const scheduledWork = /* @__PURE__ */ new Map();
  let nextId = 1;
  let workCallback = null;
  let NSAutoreleasePool = null;
  const bindings = /* @__PURE__ */ new Map();
  let readObjectIsa = null;
  const msgSendBySignatureId = /* @__PURE__ */ new Map();
  const msgSendSuperBySignatureId = /* @__PURE__ */ new Map();
  let cachedNSString = null;
  let cachedNSStringCtor = null;
  let cachedNSNumber = null;
  let cachedNSNumberCtor = null;
  let singularTypeById = null;
  let modifiers = null;
  try {
    tryInitialize();
  } catch (e) {
  }
  function tryInitialize() {
    if (api !== null)
      return true;
    if (apiError !== null)
      throw apiError;
    try {
      api = getApi4();
    } catch (e) {
      apiError = e;
      throw e;
    }
    return api !== null;
  }
  function dispose() {
    for (const [rawMethodHandle, impls] of replacedMethods.entries()) {
      const methodHandle = ptr(rawMethodHandle);
      const [oldImp, newImp] = impls;
      if (api.method_getImplementation(methodHandle).equals(newImp))
        api.method_setImplementation(methodHandle, oldImp);
    }
    replacedMethods.clear();
  }
  Script.bindWeak(this, dispose);
  Object.defineProperty(this, "available", {
    enumerable: true,
    get() {
      return tryInitialize();
    }
  });
  Object.defineProperty(this, "api", {
    enumerable: true,
    get() {
      return getApi4();
    }
  });
  Object.defineProperty(this, "classes", {
    enumerable: true,
    value: classRegistry
  });
  Object.defineProperty(this, "protocols", {
    enumerable: true,
    value: protocolRegistry
  });
  Object.defineProperty(this, "Object", {
    enumerable: true,
    value: ObjCObject
  });
  Object.defineProperty(this, "Protocol", {
    enumerable: true,
    value: ObjCProtocol
  });
  Object.defineProperty(this, "Block", {
    enumerable: true,
    value: Block
  });
  Object.defineProperty(this, "mainQueue", {
    enumerable: true,
    get() {
      return api?._dispatch_main_q ?? null;
    }
  });
  Object.defineProperty(this, "registerProxy", {
    enumerable: true,
    value: registerProxy
  });
  Object.defineProperty(this, "registerClass", {
    enumerable: true,
    value: registerClass
  });
  Object.defineProperty(this, "registerProtocol", {
    enumerable: true,
    value: registerProtocol
  });
  Object.defineProperty(this, "bind", {
    enumerable: true,
    value: bind
  });
  Object.defineProperty(this, "unbind", {
    enumerable: true,
    value: unbind
  });
  Object.defineProperty(this, "getBoundData", {
    enumerable: true,
    value: getBoundData
  });
  Object.defineProperty(this, "enumerateLoadedClasses", {
    enumerable: true,
    value: enumerateLoadedClasses
  });
  Object.defineProperty(this, "enumerateLoadedClassesSync", {
    enumerable: true,
    value: enumerateLoadedClassesSync
  });
  Object.defineProperty(this, "choose", {
    enumerable: true,
    value: choose
  });
  Object.defineProperty(this, "chooseSync", {
    enumerable: true,
    value(specifier) {
      const instances = [];
      choose(specifier, {
        onMatch(i) {
          instances.push(i);
        },
        onComplete() {
        }
      });
      return instances;
    }
  });
  this.schedule = function(queue, work) {
    const id = ptr(nextId++);
    scheduledWork.set(id.toString(), work);
    if (workCallback === null) {
      workCallback = new NativeCallback(performScheduledWorkItem, "void", ["pointer"]);
    }
    Script.pin();
    api.dispatch_async_f(queue, id, workCallback);
  };
  function performScheduledWorkItem(rawId) {
    const id = rawId.toString();
    const work = scheduledWork.get(id);
    scheduledWork.delete(id);
    if (NSAutoreleasePool === null)
      NSAutoreleasePool = classRegistry.NSAutoreleasePool;
    const pool = NSAutoreleasePool.alloc().init();
    let pendingException = null;
    try {
      work();
    } catch (e) {
      pendingException = e;
    }
    pool.release();
    setImmediate(performScheduledWorkCleanup, pendingException);
  }
  function performScheduledWorkCleanup(pendingException) {
    Script.unpin();
    if (pendingException !== null) {
      throw pendingException;
    }
  }
  this.implement = function(method2, fn) {
    return new NativeCallback(fn, method2.returnType, method2.argumentTypes);
  };
  this.selector = selector;
  this.selectorAsString = selectorAsString;
  function selector(name) {
    return api.sel_registerName(Memory.allocUtf8String(name));
  }
  function selectorAsString(sel2) {
    return api.sel_getName(sel2).readUtf8String();
  }
  const registryBuiltins = /* @__PURE__ */ new Set([
    "prototype",
    "constructor",
    "hasOwnProperty",
    "toJSON",
    "toString",
    "valueOf"
  ]);
  function ClassRegistry() {
    const cachedClasses = {};
    let numCachedClasses = 0;
    const registry = new Proxy(this, {
      has(target, property) {
        return hasProperty(property);
      },
      get(target, property, receiver) {
        switch (property) {
          case "prototype":
            return target.prototype;
          case "constructor":
            return target.constructor;
          case "hasOwnProperty":
            return hasProperty;
          case "toJSON":
            return toJSON2;
          case "toString":
            return toString2;
          case "valueOf":
            return valueOf;
          default:
            const klass = findClass(property);
            return klass !== null ? klass : void 0;
        }
      },
      set(target, property, value, receiver) {
        return false;
      },
      ownKeys(target) {
        if (api === null)
          return [];
        let numClasses = api.objc_getClassList(NULL, 0);
        if (numClasses !== numCachedClasses) {
          const classHandles = Memory.alloc(numClasses * pointerSize);
          numClasses = api.objc_getClassList(classHandles, numClasses);
          for (let i = 0; i !== numClasses; i++) {
            const handle2 = classHandles.add(i * pointerSize).readPointer();
            const name = api.class_getName(handle2).readUtf8String();
            cachedClasses[name] = handle2;
          }
          numCachedClasses = numClasses;
        }
        return Object.keys(cachedClasses);
      },
      getOwnPropertyDescriptor(target, property) {
        return {
          writable: false,
          configurable: true,
          enumerable: true
        };
      }
    });
    function hasProperty(name) {
      if (registryBuiltins.has(name))
        return true;
      return findClass(name) !== null;
    }
    function getClass(name) {
      const cls = findClass(name);
      if (cls === null)
        throw new Error("Unable to find class '" + name + "'");
      return cls;
    }
    function findClass(name) {
      let handle2 = cachedClasses[name];
      if (handle2 === void 0) {
        handle2 = api.objc_lookUpClass(Memory.allocUtf8String(name));
        if (handle2.isNull())
          return null;
        cachedClasses[name] = handle2;
        numCachedClasses++;
      }
      return new ObjCObject(handle2, void 0, true);
    }
    function toJSON2() {
      return Object.keys(registry).reduce(function(r, name) {
        r[name] = getClass(name).toJSON();
        return r;
      }, {});
    }
    function toString2() {
      return "ClassRegistry";
    }
    function valueOf() {
      return "ClassRegistry";
    }
    return registry;
  }
  function ProtocolRegistry() {
    let cachedProtocols = {};
    let numCachedProtocols = 0;
    const registry = new Proxy(this, {
      has(target, property) {
        return hasProperty(property);
      },
      get(target, property, receiver) {
        switch (property) {
          case "prototype":
            return target.prototype;
          case "constructor":
            return target.constructor;
          case "hasOwnProperty":
            return hasProperty;
          case "toJSON":
            return toJSON2;
          case "toString":
            return toString2;
          case "valueOf":
            return valueOf;
          default:
            const proto = findProtocol(property);
            return proto !== null ? proto : void 0;
        }
      },
      set(target, property, value, receiver) {
        return false;
      },
      ownKeys(target) {
        if (api === null)
          return [];
        const numProtocolsBuf = Memory.alloc(pointerSize);
        const protocolHandles = api.objc_copyProtocolList(numProtocolsBuf);
        try {
          const numProtocols = numProtocolsBuf.readUInt();
          if (numProtocols !== numCachedProtocols) {
            cachedProtocols = {};
            for (let i = 0; i !== numProtocols; i++) {
              const handle2 = protocolHandles.add(i * pointerSize).readPointer();
              const name = api.protocol_getName(handle2).readUtf8String();
              cachedProtocols[name] = handle2;
            }
            numCachedProtocols = numProtocols;
          }
        } finally {
          api.free(protocolHandles);
        }
        return Object.keys(cachedProtocols);
      },
      getOwnPropertyDescriptor(target, property) {
        return {
          writable: false,
          configurable: true,
          enumerable: true
        };
      }
    });
    function hasProperty(name) {
      if (registryBuiltins.has(name))
        return true;
      return findProtocol(name) !== null;
    }
    function findProtocol(name) {
      let handle2 = cachedProtocols[name];
      if (handle2 === void 0) {
        handle2 = api.objc_getProtocol(Memory.allocUtf8String(name));
        if (handle2.isNull())
          return null;
        cachedProtocols[name] = handle2;
        numCachedProtocols++;
      }
      return new ObjCProtocol(handle2);
    }
    function toJSON2() {
      return Object.keys(registry).reduce(function(r, name) {
        r[name] = { handle: cachedProtocols[name] };
        return r;
      }, {});
    }
    function toString2() {
      return "ProtocolRegistry";
    }
    function valueOf() {
      return "ProtocolRegistry";
    }
    return registry;
  }
  const objCObjectBuiltins = /* @__PURE__ */ new Set([
    "prototype",
    "constructor",
    "handle",
    "hasOwnProperty",
    "toJSON",
    "toString",
    "valueOf",
    "equals",
    "$kind",
    "$super",
    "$superClass",
    "$class",
    "$className",
    "$moduleName",
    "$protocols",
    "$methods",
    "$ownMethods",
    "$ivars"
  ]);
  function ObjCObject(handle2, protocol, cachedIsClass, superSpecifier2) {
    let cachedClassHandle = null;
    let cachedKind = null;
    let cachedSuper = null;
    let cachedSuperClass = null;
    let cachedClass = null;
    let cachedClassName = null;
    let cachedModuleName = null;
    let cachedProtocols = null;
    let cachedMethodNames = null;
    let cachedProtocolMethods = null;
    let respondsToSelector = null;
    const cachedMethods2 = {};
    let cachedNativeMethodNames = null;
    let cachedOwnMethodNames = null;
    let cachedIvars = null;
    handle2 = getHandle(handle2);
    if (cachedIsClass === void 0) {
      const klass = api.object_getClass(handle2);
      const key = klass.toString();
      if (!realizedClasses.has(key)) {
        api.objc_lookUpClass(api.class_getName(klass));
        realizedClasses.add(key);
      }
    }
    const self = new Proxy(this, {
      has(target, property) {
        return hasProperty(property);
      },
      get(target, property, receiver) {
        switch (property) {
          case "handle":
            return handle2;
          case "prototype":
            return target.prototype;
          case "constructor":
            return target.constructor;
          case "hasOwnProperty":
            return hasProperty;
          case "toJSON":
            return toJSON2;
          case "toString":
          case "valueOf":
            const descriptionImpl = receiver.description;
            if (descriptionImpl !== void 0) {
              const description = descriptionImpl.call(receiver);
              if (description !== null)
                return description.UTF8String.bind(description);
            }
            return function() {
              return receiver.$className;
            };
          case "equals":
            return equals2;
          case "$kind":
            if (cachedKind === null) {
              if (isClass())
                cachedKind = api.class_isMetaClass(handle2) ? "meta-class" : "class";
              else
                cachedKind = "instance";
            }
            return cachedKind;
          case "$super":
            if (cachedSuper === null) {
              const superHandle = api.class_getSuperclass(classHandle());
              if (!superHandle.isNull()) {
                const specifier = Memory.alloc(2 * pointerSize);
                specifier.writePointer(handle2);
                specifier.add(pointerSize).writePointer(superHandle);
                cachedSuper = [new ObjCObject(handle2, void 0, cachedIsClass, specifier)];
              } else {
                cachedSuper = [null];
              }
            }
            return cachedSuper[0];
          case "$superClass":
            if (cachedSuperClass === null) {
              const superClassHandle = api.class_getSuperclass(classHandle());
              if (!superClassHandle.isNull()) {
                cachedSuperClass = [new ObjCObject(superClassHandle)];
              } else {
                cachedSuperClass = [null];
              }
            }
            return cachedSuperClass[0];
          case "$class":
            if (cachedClass === null)
              cachedClass = new ObjCObject(api.object_getClass(handle2), void 0, true);
            return cachedClass;
          case "$className":
            if (cachedClassName === null) {
              if (superSpecifier2)
                cachedClassName = api.class_getName(superSpecifier2.add(pointerSize).readPointer()).readUtf8String();
              else if (isClass())
                cachedClassName = api.class_getName(handle2).readUtf8String();
              else
                cachedClassName = api.object_getClassName(handle2).readUtf8String();
            }
            return cachedClassName;
          case "$moduleName":
            if (cachedModuleName === null) {
              cachedModuleName = api.class_getImageName(classHandle()).readUtf8String();
            }
            return cachedModuleName;
          case "$protocols":
            if (cachedProtocols === null) {
              cachedProtocols = {};
              const numProtocolsBuf = Memory.alloc(pointerSize);
              const protocolHandles = api.class_copyProtocolList(classHandle(), numProtocolsBuf);
              if (!protocolHandles.isNull()) {
                try {
                  const numProtocols = numProtocolsBuf.readUInt();
                  for (let i = 0; i !== numProtocols; i++) {
                    const protocolHandle = protocolHandles.add(i * pointerSize).readPointer();
                    const p = new ObjCProtocol(protocolHandle);
                    cachedProtocols[p.name] = p;
                  }
                } finally {
                  api.free(protocolHandles);
                }
              }
            }
            return cachedProtocols;
          case "$methods":
            if (cachedNativeMethodNames === null) {
              const klass = superSpecifier2 ? superSpecifier2.add(pointerSize).readPointer() : classHandle();
              const meta = api.object_getClass(klass);
              const names = /* @__PURE__ */ new Set();
              let cur = meta;
              do {
                for (let methodName of collectMethodNames(cur, "+ "))
                  names.add(methodName);
                cur = api.class_getSuperclass(cur);
              } while (!cur.isNull());
              cur = klass;
              do {
                for (let methodName of collectMethodNames(cur, "- "))
                  names.add(methodName);
                cur = api.class_getSuperclass(cur);
              } while (!cur.isNull());
              cachedNativeMethodNames = Array.from(names);
            }
            return cachedNativeMethodNames;
          case "$ownMethods":
            if (cachedOwnMethodNames === null) {
              const klass = superSpecifier2 ? superSpecifier2.add(pointerSize).readPointer() : classHandle();
              const meta = api.object_getClass(klass);
              const classMethods = collectMethodNames(meta, "+ ");
              const instanceMethods = collectMethodNames(klass, "- ");
              cachedOwnMethodNames = classMethods.concat(instanceMethods);
            }
            return cachedOwnMethodNames;
          case "$ivars":
            if (cachedIvars === null) {
              if (isClass())
                cachedIvars = {};
              else
                cachedIvars = new ObjCIvars(self, classHandle());
            }
            return cachedIvars;
          default:
            if (typeof property === "symbol") {
              return target[property];
            }
            if (protocol) {
              const details = findProtocolMethod(property);
              if (details === null || !details.implemented)
                return void 0;
            }
            const wrapper = findMethodWrapper(property);
            if (wrapper === null)
              return void 0;
            return wrapper;
        }
      },
      set(target, property, value, receiver) {
        return false;
      },
      ownKeys(target) {
        if (cachedMethodNames === null) {
          if (!protocol) {
            const jsNames = {};
            const nativeNames = {};
            let cur = api.object_getClass(handle2);
            do {
              const numMethodsBuf = Memory.alloc(pointerSize);
              const methodHandles = api.class_copyMethodList(cur, numMethodsBuf);
              const fullNamePrefix = isClass() ? "+ " : "- ";
              try {
                const numMethods = numMethodsBuf.readUInt();
                for (let i = 0; i !== numMethods; i++) {
                  const methodHandle = methodHandles.add(i * pointerSize).readPointer();
                  const sel2 = api.method_getName(methodHandle);
                  const nativeName = api.sel_getName(sel2).readUtf8String();
                  if (nativeNames[nativeName] !== void 0)
                    continue;
                  nativeNames[nativeName] = nativeName;
                  const jsName = jsMethodName(nativeName);
                  let serial = 2;
                  let name = jsName;
                  while (jsNames[name] !== void 0) {
                    serial++;
                    name = jsName + serial;
                  }
                  jsNames[name] = true;
                  const fullName = fullNamePrefix + nativeName;
                  if (cachedMethods2[fullName] === void 0) {
                    const details = {
                      sel: sel2,
                      handle: methodHandle,
                      wrapper: null
                    };
                    cachedMethods2[fullName] = details;
                    cachedMethods2[name] = details;
                  }
                }
              } finally {
                api.free(methodHandles);
              }
              cur = api.class_getSuperclass(cur);
            } while (!cur.isNull());
            cachedMethodNames = Object.keys(jsNames);
          } else {
            const methodNames = [];
            const protocolMethods = allProtocolMethods();
            Object.keys(protocolMethods).forEach(function(methodName) {
              if (methodName[0] !== "+" && methodName[0] !== "-") {
                const details = protocolMethods[methodName];
                if (details.implemented) {
                  methodNames.push(methodName);
                }
              }
            });
            cachedMethodNames = methodNames;
          }
        }
        return ["handle"].concat(cachedMethodNames);
      },
      getOwnPropertyDescriptor(target, property) {
        return {
          writable: false,
          configurable: true,
          enumerable: true
        };
      }
    });
    if (protocol) {
      respondsToSelector = !isClass() ? findMethodWrapper("- respondsToSelector:") : null;
    }
    return self;
    function hasProperty(name) {
      if (objCObjectBuiltins.has(name))
        return true;
      if (protocol) {
        const details = findProtocolMethod(name);
        return !!(details !== null && details.implemented);
      }
      return findMethod(name) !== null;
    }
    function classHandle() {
      if (cachedClassHandle === null)
        cachedClassHandle = isClass() ? handle2 : api.object_getClass(handle2);
      return cachedClassHandle;
    }
    function isClass() {
      if (cachedIsClass === void 0) {
        if (api.object_isClass)
          cachedIsClass = !!api.object_isClass(handle2);
        else
          cachedIsClass = !!api.class_isMetaClass(api.object_getClass(handle2));
      }
      return cachedIsClass;
    }
    function findMethod(rawName) {
      let method2 = cachedMethods2[rawName];
      if (method2 !== void 0)
        return method2;
      const tokens = parseMethodName(rawName);
      const fullName = tokens[2];
      method2 = cachedMethods2[fullName];
      if (method2 !== void 0) {
        cachedMethods2[rawName] = method2;
        return method2;
      }
      const kind = tokens[0];
      const name = tokens[1];
      const sel2 = selector(name);
      const defaultKind = isClass() ? "+" : "-";
      if (protocol) {
        const details = findProtocolMethod(fullName);
        if (details !== null) {
          method2 = {
            sel: sel2,
            types: details.types,
            wrapper: null,
            kind
          };
        }
      }
      if (method2 === void 0) {
        const methodHandle = kind === "+" ? api.class_getClassMethod(classHandle(), sel2) : api.class_getInstanceMethod(classHandle(), sel2);
        if (!methodHandle.isNull()) {
          method2 = {
            sel: sel2,
            handle: methodHandle,
            wrapper: null,
            kind
          };
        } else {
          if (isClass() || kind !== "-" || name === "forwardingTargetForSelector:" || name === "methodSignatureForSelector:") {
            return null;
          }
          let target = self;
          if ("- forwardingTargetForSelector:" in self) {
            const forwardingTarget = self.forwardingTargetForSelector_(sel2);
            if (forwardingTarget !== null && forwardingTarget.$kind === "instance") {
              target = forwardingTarget;
            } else {
              return null;
            }
          } else {
            return null;
          }
          const methodHandle2 = api.class_getInstanceMethod(api.object_getClass(target.handle), sel2);
          if (methodHandle2.isNull()) {
            return null;
          }
          let types3 = api.method_getTypeEncoding(methodHandle2).readUtf8String();
          if (types3 === null || types3 === "") {
            types3 = stealTypesFromProtocols(target, fullName);
            if (types3 === null)
              types3 = stealTypesFromProtocols(self, fullName);
            if (types3 === null)
              return null;
          }
          method2 = {
            sel: sel2,
            types: types3,
            wrapper: null,
            kind
          };
        }
      }
      cachedMethods2[fullName] = method2;
      cachedMethods2[rawName] = method2;
      if (kind === defaultKind)
        cachedMethods2[jsMethodName(name)] = method2;
      return method2;
    }
    function stealTypesFromProtocols(klass, fullName) {
      const candidates = Object.keys(klass.$protocols).map((protocolName) => flatProtocolMethods({}, klass.$protocols[protocolName])).reduce((allMethods, methods) => {
        Object.assign(allMethods, methods);
        return allMethods;
      }, {});
      const method2 = candidates[fullName];
      if (method2 === void 0) {
        return null;
      }
      return method2.types;
    }
    function flatProtocolMethods(result, protocol2) {
      if (protocol2.methods !== void 0) {
        Object.assign(result, protocol2.methods);
      }
      if (protocol2.protocol !== void 0) {
        flatProtocolMethods(result, protocol2.protocol);
      }
      return result;
    }
    function findProtocolMethod(rawName) {
      const protocolMethods = allProtocolMethods();
      const details = protocolMethods[rawName];
      return details !== void 0 ? details : null;
    }
    function allProtocolMethods() {
      if (cachedProtocolMethods === null) {
        const methods = {};
        const protocols = collectProtocols(protocol);
        const defaultKind = isClass() ? "+" : "-";
        Object.keys(protocols).forEach(function(name) {
          const p = protocols[name];
          const m2 = p.methods;
          Object.keys(m2).forEach(function(fullMethodName) {
            const method2 = m2[fullMethodName];
            const methodName = fullMethodName.substr(2);
            const kind = fullMethodName[0];
            let didCheckImplemented = false;
            let implemented = false;
            const details = {
              types: method2.types
            };
            Object.defineProperty(details, "implemented", {
              get() {
                if (!didCheckImplemented) {
                  if (method2.required) {
                    implemented = true;
                  } else {
                    implemented = respondsToSelector !== null && respondsToSelector.call(self, selector(methodName));
                  }
                  didCheckImplemented = true;
                }
                return implemented;
              }
            });
            methods[fullMethodName] = details;
            if (kind === defaultKind)
              methods[jsMethodName(methodName)] = details;
          });
        });
        cachedProtocolMethods = methods;
      }
      return cachedProtocolMethods;
    }
    function findMethodWrapper(name) {
      const method2 = findMethod(name);
      if (method2 === null)
        return null;
      let wrapper = method2.wrapper;
      if (wrapper === null) {
        wrapper = makeMethodInvocationWrapper(method2, self, superSpecifier2, defaultInvocationOptions);
        method2.wrapper = wrapper;
      }
      return wrapper;
    }
    function parseMethodName(rawName) {
      const match = /([+\-])\s(\S+)/.exec(rawName);
      let name, kind;
      if (match === null) {
        kind = isClass() ? "+" : "-";
        name = objcMethodName(rawName);
      } else {
        kind = match[1];
        name = match[2];
      }
      const fullName = [kind, name].join(" ");
      return [kind, name, fullName];
    }
    function toJSON2() {
      return {
        handle: handle2.toString()
      };
    }
    function equals2(ptr2) {
      return handle2.equals(getHandle(ptr2));
    }
  }
  function getReplacementMethodImplementation(methodHandle) {
    const existingEntry = replacedMethods.get(methodHandle.toString());
    if (existingEntry === void 0)
      return null;
    const [, newImp] = existingEntry;
    return newImp;
  }
  function replaceMethodImplementation(methodHandle, imp) {
    const key = methodHandle.toString();
    let oldImp;
    const existingEntry = replacedMethods.get(key);
    if (existingEntry !== void 0)
      [oldImp] = existingEntry;
    else
      oldImp = api.method_getImplementation(methodHandle);
    if (!imp.equals(oldImp))
      replacedMethods.set(key, [oldImp, imp]);
    else
      replacedMethods.delete(key);
    api.method_setImplementation(methodHandle, imp);
  }
  function collectMethodNames(klass, prefix) {
    const names = [];
    const numMethodsBuf = Memory.alloc(pointerSize);
    const methodHandles = api.class_copyMethodList(klass, numMethodsBuf);
    try {
      const numMethods = numMethodsBuf.readUInt();
      for (let i = 0; i !== numMethods; i++) {
        const methodHandle = methodHandles.add(i * pointerSize).readPointer();
        const sel2 = api.method_getName(methodHandle);
        const nativeName = api.sel_getName(sel2).readUtf8String();
        names.push(prefix + nativeName);
      }
    } finally {
      api.free(methodHandles);
    }
    return names;
  }
  function ObjCProtocol(handle2) {
    let cachedName = null;
    let cachedProtocols = null;
    let cachedProperties = null;
    let cachedMethods2 = null;
    Object.defineProperty(this, "handle", {
      value: handle2,
      enumerable: true
    });
    Object.defineProperty(this, "name", {
      get() {
        if (cachedName === null)
          cachedName = api.protocol_getName(handle2).readUtf8String();
        return cachedName;
      },
      enumerable: true
    });
    Object.defineProperty(this, "protocols", {
      get() {
        if (cachedProtocols === null) {
          cachedProtocols = {};
          const numProtocolsBuf = Memory.alloc(pointerSize);
          const protocolHandles = api.protocol_copyProtocolList(handle2, numProtocolsBuf);
          if (!protocolHandles.isNull()) {
            try {
              const numProtocols = numProtocolsBuf.readUInt();
              for (let i = 0; i !== numProtocols; i++) {
                const protocolHandle = protocolHandles.add(i * pointerSize).readPointer();
                const protocol = new ObjCProtocol(protocolHandle);
                cachedProtocols[protocol.name] = protocol;
              }
            } finally {
              api.free(protocolHandles);
            }
          }
        }
        return cachedProtocols;
      },
      enumerable: true
    });
    Object.defineProperty(this, "properties", {
      get() {
        if (cachedProperties === null) {
          cachedProperties = {};
          const numBuf = Memory.alloc(pointerSize);
          const propertyHandles = api.protocol_copyPropertyList(handle2, numBuf);
          if (!propertyHandles.isNull()) {
            try {
              const numProperties = numBuf.readUInt();
              for (let i = 0; i !== numProperties; i++) {
                const propertyHandle = propertyHandles.add(i * pointerSize).readPointer();
                const propName = api.property_getName(propertyHandle).readUtf8String();
                const attributes = {};
                const attributeEntries = api.property_copyAttributeList(propertyHandle, numBuf);
                if (!attributeEntries.isNull()) {
                  try {
                    const numAttributeValues = numBuf.readUInt();
                    for (let j = 0; j !== numAttributeValues; j++) {
                      const attributeEntry = attributeEntries.add(j * (2 * pointerSize));
                      const name = attributeEntry.readPointer().readUtf8String();
                      const value = attributeEntry.add(pointerSize).readPointer().readUtf8String();
                      attributes[name] = value;
                    }
                  } finally {
                    api.free(attributeEntries);
                  }
                }
                cachedProperties[propName] = attributes;
              }
            } finally {
              api.free(propertyHandles);
            }
          }
        }
        return cachedProperties;
      },
      enumerable: true
    });
    Object.defineProperty(this, "methods", {
      get() {
        if (cachedMethods2 === null) {
          cachedMethods2 = {};
          const numBuf = Memory.alloc(pointerSize);
          collectMethods(cachedMethods2, numBuf, { required: true, instance: false });
          collectMethods(cachedMethods2, numBuf, { required: false, instance: false });
          collectMethods(cachedMethods2, numBuf, { required: true, instance: true });
          collectMethods(cachedMethods2, numBuf, { required: false, instance: true });
        }
        return cachedMethods2;
      },
      enumerable: true
    });
    function collectMethods(methods, numBuf, spec) {
      const methodDescValues = api.protocol_copyMethodDescriptionList(handle2, spec.required ? 1 : 0, spec.instance ? 1 : 0, numBuf);
      if (methodDescValues.isNull())
        return;
      try {
        const numMethodDescValues = numBuf.readUInt();
        for (let i = 0; i !== numMethodDescValues; i++) {
          const methodDesc = methodDescValues.add(i * (2 * pointerSize));
          const name = (spec.instance ? "- " : "+ ") + selectorAsString(methodDesc.readPointer());
          const types3 = methodDesc.add(pointerSize).readPointer().readUtf8String();
          methods[name] = {
            required: spec.required,
            types: types3
          };
        }
      } finally {
        api.free(methodDescValues);
      }
    }
  }
  const objCIvarsBuiltins = /* @__PURE__ */ new Set([
    "prototype",
    "constructor",
    "hasOwnProperty",
    "toJSON",
    "toString",
    "valueOf"
  ]);
  function ObjCIvars(instance, classHandle) {
    const ivars = {};
    let cachedIvarNames = null;
    let classHandles = [];
    let currentClassHandle = classHandle;
    do {
      classHandles.unshift(currentClassHandle);
      currentClassHandle = api.class_getSuperclass(currentClassHandle);
    } while (!currentClassHandle.isNull());
    const numIvarsBuf = Memory.alloc(pointerSize);
    classHandles.forEach((c) => {
      const ivarHandles = api.class_copyIvarList(c, numIvarsBuf);
      try {
        const numIvars = numIvarsBuf.readUInt();
        for (let i = 0; i !== numIvars; i++) {
          const handle2 = ivarHandles.add(i * pointerSize).readPointer();
          const name = api.ivar_getName(handle2).readUtf8String();
          ivars[name] = [handle2, null];
        }
      } finally {
        api.free(ivarHandles);
      }
    });
    const self = new Proxy(this, {
      has(target, property) {
        return hasProperty(property);
      },
      get(target, property, receiver) {
        switch (property) {
          case "prototype":
            return target.prototype;
          case "constructor":
            return target.constructor;
          case "hasOwnProperty":
            return hasProperty;
          case "toJSON":
            return toJSON2;
          case "toString":
            return toString2;
          case "valueOf":
            return valueOf;
          default:
            const ivar = findIvar(property);
            if (ivar === null)
              return void 0;
            return ivar.get();
        }
      },
      set(target, property, value, receiver) {
        const ivar = findIvar(property);
        if (ivar === null)
          throw new Error("Unknown ivar");
        ivar.set(value);
        return true;
      },
      ownKeys(target) {
        if (cachedIvarNames === null)
          cachedIvarNames = Object.keys(ivars);
        return cachedIvarNames;
      },
      getOwnPropertyDescriptor(target, property) {
        return {
          writable: true,
          configurable: true,
          enumerable: true
        };
      }
    });
    return self;
    function findIvar(name) {
      const entry = ivars[name];
      if (entry === void 0)
        return null;
      let impl2 = entry[1];
      if (impl2 === null) {
        const ivar = entry[0];
        const offset = api.ivar_getOffset(ivar).toInt32();
        const address = instance.handle.add(offset);
        const type = parseType(api.ivar_getTypeEncoding(ivar).readUtf8String());
        const fromNative = type.fromNative || identityTransform;
        const toNative = type.toNative || identityTransform;
        let read2, write3;
        if (name === "isa") {
          read2 = readObjectIsa;
          write3 = function() {
            throw new Error("Unable to set the isa instance variable");
          };
        } else {
          read2 = type.read;
          write3 = type.write;
        }
        impl2 = {
          get() {
            return fromNative.call(instance, read2(address));
          },
          set(value) {
            write3(address, toNative.call(instance, value));
          }
        };
        entry[1] = impl2;
      }
      return impl2;
    }
    function hasProperty(name) {
      if (objCIvarsBuiltins.has(name))
        return true;
      return ivars.hasOwnProperty(name);
    }
    function toJSON2() {
      return Object.keys(self).reduce(function(result, name) {
        result[name] = self[name];
        return result;
      }, {});
    }
    function toString2() {
      return "ObjCIvars";
    }
    function valueOf() {
      return "ObjCIvars";
    }
  }
  let blockDescriptorAllocSize, blockDescriptorDeclaredSize, blockDescriptorOffsets;
  let blockSize, blockOffsets;
  if (pointerSize === 4) {
    blockDescriptorAllocSize = 16;
    blockDescriptorDeclaredSize = 20;
    blockDescriptorOffsets = {
      reserved: 0,
      size: 4,
      rest: 8
    };
    blockSize = 20;
    blockOffsets = {
      isa: 0,
      flags: 4,
      reserved: 8,
      invoke: 12,
      descriptor: 16
    };
  } else {
    blockDescriptorAllocSize = 32;
    blockDescriptorDeclaredSize = 32;
    blockDescriptorOffsets = {
      reserved: 0,
      size: 8,
      rest: 16
    };
    blockSize = 32;
    blockOffsets = {
      isa: 0,
      flags: 8,
      reserved: 12,
      invoke: 16,
      descriptor: 24
    };
  }
  const BLOCK_HAS_COPY_DISPOSE = 1 << 25;
  const BLOCK_HAS_CTOR = 1 << 26;
  const BLOCK_IS_GLOBAL = 1 << 28;
  const BLOCK_HAS_STRET = 1 << 29;
  const BLOCK_HAS_SIGNATURE = 1 << 30;
  function Block(target, options = defaultInvocationOptions) {
    this._options = options;
    if (target instanceof NativePointer) {
      const descriptor = target.add(blockOffsets.descriptor).readPointer();
      this.handle = target;
      const flags = target.add(blockOffsets.flags).readU32();
      if ((flags & BLOCK_HAS_SIGNATURE) !== 0) {
        const signatureOffset = (flags & BLOCK_HAS_COPY_DISPOSE) !== 0 ? 2 : 0;
        this.types = descriptor.add(blockDescriptorOffsets.rest + signatureOffset * pointerSize).readPointer().readCString();
        this._signature = parseSignature(this.types);
      } else {
        this._signature = null;
      }
    } else {
      this.declare(target);
      const descriptor = Memory.alloc(blockDescriptorAllocSize + blockSize);
      const block2 = descriptor.add(blockDescriptorAllocSize);
      const typesStr = Memory.allocUtf8String(this.types);
      descriptor.add(blockDescriptorOffsets.reserved).writeULong(0);
      descriptor.add(blockDescriptorOffsets.size).writeULong(blockDescriptorDeclaredSize);
      descriptor.add(blockDescriptorOffsets.rest).writePointer(typesStr);
      block2.add(blockOffsets.isa).writePointer(classRegistry.__NSGlobalBlock__);
      block2.add(blockOffsets.flags).writeU32(BLOCK_HAS_SIGNATURE | BLOCK_IS_GLOBAL);
      block2.add(blockOffsets.reserved).writeU32(0);
      block2.add(blockOffsets.descriptor).writePointer(descriptor);
      this.handle = block2;
      this._storage = [descriptor, typesStr];
      this.implementation = target.implementation;
    }
  }
  Object.defineProperties(Block.prototype, {
    implementation: {
      enumerable: true,
      get() {
        const address = this.handle.add(blockOffsets.invoke).readPointer().strip();
        const signature2 = this._getSignature();
        return makeBlockInvocationWrapper(this, signature2, new NativeFunction(
          address.sign(),
          signature2.retType.type,
          signature2.argTypes.map(function(arg) {
            return arg.type;
          }),
          this._options
        ));
      },
      set(func) {
        const signature2 = this._getSignature();
        const callback = new NativeCallback(
          makeBlockImplementationWrapper(this, signature2, func),
          signature2.retType.type,
          signature2.argTypes.map(function(arg) {
            return arg.type;
          })
        );
        this._callback = callback;
        const location = this.handle.add(blockOffsets.invoke);
        const prot = Memory.queryProtection(location);
        const writable = prot.includes("w");
        if (!writable)
          Memory.protect(location, Process.pointerSize, "rw-");
        location.writePointer(callback.strip().sign("ia", location));
        if (!writable)
          Memory.protect(location, Process.pointerSize, prot);
      }
    },
    declare: {
      value(signature2) {
        let types3 = signature2.types;
        if (types3 === void 0) {
          types3 = unparseSignature(signature2.retType, ["block"].concat(signature2.argTypes));
        }
        this.types = types3;
        this._signature = parseSignature(types3);
      }
    },
    _getSignature: {
      value() {
        const signature2 = this._signature;
        if (signature2 === null)
          throw new Error("block is missing signature; call declare()");
        return signature2;
      }
    }
  });
  function collectProtocols(p, acc) {
    acc = acc || {};
    acc[p.name] = p;
    const parentProtocols = p.protocols;
    Object.keys(parentProtocols).forEach(function(name) {
      collectProtocols(parentProtocols[name], acc);
    });
    return acc;
  }
  function registerProxy(properties) {
    const protocols = properties.protocols || [];
    const methods = properties.methods || {};
    const events = properties.events || {};
    const supportedSelectors = new Set(
      Object.keys(methods).filter((m2) => /([+\-])\s(\S+)/.exec(m2) !== null).map((m2) => m2.split(" ")[1])
    );
    const proxyMethods = {
      "- dealloc": function() {
        const target = this.data.target;
        if ("- release" in target)
          target.release();
        unbind(this.self);
        this.super.dealloc();
        const callback = this.data.events.dealloc;
        if (callback !== void 0)
          callback.call(this);
      },
      "- respondsToSelector:": function(sel2) {
        const selector2 = selectorAsString(sel2);
        if (supportedSelectors.has(selector2))
          return true;
        return this.data.target.respondsToSelector_(sel2);
      },
      "- forwardingTargetForSelector:": function(sel2) {
        const callback = this.data.events.forward;
        if (callback !== void 0)
          callback.call(this, selectorAsString(sel2));
        return this.data.target;
      },
      "- methodSignatureForSelector:": function(sel2) {
        return this.data.target.methodSignatureForSelector_(sel2);
      },
      "- forwardInvocation:": function(invocation) {
        invocation.invokeWithTarget_(this.data.target);
      }
    };
    for (var key in methods) {
      if (methods.hasOwnProperty(key)) {
        if (proxyMethods.hasOwnProperty(key))
          throw new Error("The '" + key + "' method is reserved");
        proxyMethods[key] = methods[key];
      }
    }
    const ProxyClass = registerClass({
      name: properties.name,
      super: classRegistry.NSProxy,
      protocols,
      methods: proxyMethods
    });
    return function(target, data) {
      target = target instanceof NativePointer ? new ObjCObject(target) : target;
      data = data || {};
      const instance = ProxyClass.alloc().autorelease();
      const boundData = getBoundData(instance);
      boundData.target = "- retain" in target ? target.retain() : target;
      boundData.events = events;
      for (var key2 in data) {
        if (data.hasOwnProperty(key2)) {
          if (boundData.hasOwnProperty(key2))
            throw new Error("The '" + key2 + "' property is reserved");
          boundData[key2] = data[key2];
        }
      }
      this.handle = instance.handle;
    };
  }
  function registerClass(properties) {
    let name = properties.name;
    if (name === void 0)
      name = makeClassName();
    const superClass = properties.super !== void 0 ? properties.super : classRegistry.NSObject;
    const protocols = properties.protocols || [];
    const methods = properties.methods || {};
    const methodCallbacks = [];
    const classHandle = api.objc_allocateClassPair(superClass !== null ? superClass.handle : NULL, Memory.allocUtf8String(name), ptr("0"));
    if (classHandle.isNull())
      throw new Error("Unable to register already registered class '" + name + "'");
    const metaClassHandle = api.object_getClass(classHandle);
    try {
      protocols.forEach(function(protocol) {
        api.class_addProtocol(classHandle, protocol.handle);
      });
      Object.keys(methods).forEach(function(rawMethodName) {
        const match = /([+\-])\s(\S+)/.exec(rawMethodName);
        if (match === null)
          throw new Error("Invalid method name");
        const kind = match[1];
        const name2 = match[2];
        let method2;
        const value = methods[rawMethodName];
        if (typeof value === "function") {
          let types4 = null;
          if (rawMethodName in superClass) {
            types4 = superClass[rawMethodName].types;
          } else {
            for (let protocol of protocols) {
              const method3 = protocol.methods[rawMethodName];
              if (method3 !== void 0) {
                types4 = method3.types;
                break;
              }
            }
          }
          if (types4 === null)
            throw new Error("Unable to find '" + rawMethodName + "' in super-class or any of its protocols");
          method2 = {
            types: types4,
            implementation: value
          };
        } else {
          method2 = value;
        }
        const target = kind === "+" ? metaClassHandle : classHandle;
        let types3 = method2.types;
        if (types3 === void 0) {
          types3 = unparseSignature(method2.retType, [kind === "+" ? "class" : "object", "selector"].concat(method2.argTypes));
        }
        const signature2 = parseSignature(types3);
        const implementation2 = new NativeCallback(
          makeMethodImplementationWrapper(signature2, method2.implementation),
          signature2.retType.type,
          signature2.argTypes.map(function(arg) {
            return arg.type;
          })
        );
        methodCallbacks.push(implementation2);
        api.class_addMethod(target, selector(name2), implementation2, Memory.allocUtf8String(types3));
      });
    } catch (e) {
      api.objc_disposeClassPair(classHandle);
      throw e;
    }
    api.objc_registerClassPair(classHandle);
    classHandle._methodCallbacks = methodCallbacks;
    Script.bindWeak(classHandle, makeClassDestructor(ptr(classHandle)));
    return new ObjCObject(classHandle);
  }
  function makeClassDestructor(classHandle) {
    return function() {
      api.objc_disposeClassPair(classHandle);
    };
  }
  function registerProtocol(properties) {
    let name = properties.name;
    if (name === void 0)
      name = makeProtocolName();
    const protocols = properties.protocols || [];
    const methods = properties.methods || {};
    protocols.forEach(function(protocol) {
      if (!(protocol instanceof ObjCProtocol))
        throw new Error("Expected protocol");
    });
    const methodSpecs = Object.keys(methods).map(function(rawMethodName) {
      const method2 = methods[rawMethodName];
      const match = /([+\-])\s(\S+)/.exec(rawMethodName);
      if (match === null)
        throw new Error("Invalid method name");
      const kind = match[1];
      const name2 = match[2];
      let types3 = method2.types;
      if (types3 === void 0) {
        types3 = unparseSignature(method2.retType, [kind === "+" ? "class" : "object", "selector"].concat(method2.argTypes));
      }
      return {
        kind,
        name: name2,
        types: types3,
        optional: method2.optional
      };
    });
    const handle2 = api.objc_allocateProtocol(Memory.allocUtf8String(name));
    if (handle2.isNull())
      throw new Error("Unable to register already registered protocol '" + name + "'");
    protocols.forEach(function(protocol) {
      api.protocol_addProtocol(handle2, protocol.handle);
    });
    methodSpecs.forEach(function(spec) {
      const isRequiredMethod = spec.optional ? 0 : 1;
      const isInstanceMethod = spec.kind === "-" ? 1 : 0;
      api.protocol_addMethodDescription(handle2, selector(spec.name), Memory.allocUtf8String(spec.types), isRequiredMethod, isInstanceMethod);
    });
    api.objc_registerProtocol(handle2);
    return new ObjCProtocol(handle2);
  }
  function getHandle(obj) {
    if (obj instanceof NativePointer)
      return obj;
    else if (typeof obj === "object" && obj.hasOwnProperty("handle"))
      return obj.handle;
    else
      throw new Error("Expected NativePointer or ObjC.Object instance");
  }
  function bind(obj, data) {
    const handle2 = getHandle(obj);
    const self = obj instanceof ObjCObject ? obj : new ObjCObject(handle2);
    bindings.set(handle2.toString(), {
      self,
      super: self.$super,
      data
    });
  }
  function unbind(obj) {
    const handle2 = getHandle(obj);
    bindings.delete(handle2.toString());
  }
  function getBoundData(obj) {
    return getBinding(obj).data;
  }
  function getBinding(obj) {
    const handle2 = getHandle(obj);
    const key = handle2.toString();
    let binding2 = bindings.get(key);
    if (binding2 === void 0) {
      const self = obj instanceof ObjCObject ? obj : new ObjCObject(handle2);
      binding2 = {
        self,
        super: self.$super,
        data: {}
      };
      bindings.set(key, binding2);
    }
    return binding2;
  }
  function enumerateLoadedClasses(...args) {
    const allModules = new ModuleMap();
    let unfiltered = false;
    let callbacks;
    let modules;
    if (args.length === 1) {
      callbacks = args[0];
    } else {
      callbacks = args[1];
      const options = args[0];
      modules = options.ownedBy;
    }
    if (modules === void 0) {
      modules = allModules;
      unfiltered = true;
    }
    const classGetName = api.class_getName;
    const onMatch = callbacks.onMatch.bind(callbacks);
    const swiftNominalTypeDescriptorOffset = (pointerSize === 8 ? 8 : 11) * pointerSize;
    const numClasses = api.objc_getClassList(NULL, 0);
    const classHandles = Memory.alloc(numClasses * pointerSize);
    api.objc_getClassList(classHandles, numClasses);
    for (let i = 0; i !== numClasses; i++) {
      const classHandle = classHandles.add(i * pointerSize).readPointer();
      const rawName = classGetName(classHandle);
      let name = null;
      let modulePath = modules.findPath(rawName);
      const possiblySwift = modulePath === null && (unfiltered || allModules.findPath(rawName) === null);
      if (possiblySwift) {
        name = rawName.readCString();
        const probablySwift = name.indexOf(".") !== -1;
        if (probablySwift) {
          const nominalTypeDescriptor = classHandle.add(swiftNominalTypeDescriptorOffset).readPointer();
          modulePath = modules.findPath(nominalTypeDescriptor);
        }
      }
      if (modulePath !== null) {
        if (name === null)
          name = rawName.readUtf8String();
        onMatch(name, modulePath);
      }
    }
    callbacks.onComplete();
  }
  function enumerateLoadedClassesSync(options = {}) {
    const result = {};
    enumerateLoadedClasses(options, {
      onMatch(name, owner2) {
        let group = result[owner2];
        if (group === void 0) {
          group = [];
          result[owner2] = group;
        }
        group.push(name);
      },
      onComplete() {
      }
    });
    return result;
  }
  function choose(specifier, callbacks) {
    let cls = specifier;
    let subclasses = true;
    if (!(specifier instanceof ObjCObject) && typeof specifier === "object") {
      cls = specifier.class;
      if (specifier.hasOwnProperty("subclasses"))
        subclasses = specifier.subclasses;
    }
    if (!(cls instanceof ObjCObject && (cls.$kind === "class" || cls.$kind === "meta-class")))
      throw new Error("Expected an ObjC.Object for a class or meta-class");
    const matches = get().choose(cls, subclasses).map((handle2) => new ObjCObject(handle2));
    for (const match of matches) {
      const result = callbacks.onMatch(match);
      if (result === "stop")
        break;
    }
    callbacks.onComplete();
  }
  function makeMethodInvocationWrapper(method, owner, superSpecifier, invocationOptions) {
    const sel = method.sel;
    let handle = method.handle;
    let types;
    if (handle === void 0) {
      handle = null;
      types = method.types;
    } else {
      types = api.method_getTypeEncoding(handle).readUtf8String();
    }
    const signature = parseSignature(types);
    const retType = signature.retType;
    const argTypes = signature.argTypes.slice(2);
    const objc_msgSend = superSpecifier ? getMsgSendSuperImpl(signature, invocationOptions) : getMsgSendImpl(signature, invocationOptions);
    const argVariableNames = argTypes.map(function(t, i) {
      return "a" + (i + 1);
    });
    const callArgs = [
      superSpecifier ? "superSpecifier" : "this",
      "sel"
    ].concat(argTypes.map(function(t, i) {
      if (t.toNative) {
        return "argTypes[" + i + "].toNative.call(this, " + argVariableNames[i] + ")";
      }
      return argVariableNames[i];
    }));
    let returnCaptureLeft;
    let returnCaptureRight;
    if (retType.type === "void") {
      returnCaptureLeft = "";
      returnCaptureRight = "";
    } else if (retType.fromNative) {
      returnCaptureLeft = "return retType.fromNative.call(this, ";
      returnCaptureRight = ")";
    } else {
      returnCaptureLeft = "return ";
      returnCaptureRight = "";
    }
    const m = eval("var m = function (" + argVariableNames.join(", ") + ") { " + returnCaptureLeft + "objc_msgSend(" + callArgs.join(", ") + ")" + returnCaptureRight + "; }; m;");
    Object.defineProperty(m, "handle", {
      enumerable: true,
      get: getMethodHandle
    });
    m.selector = sel;
    Object.defineProperty(m, "implementation", {
      enumerable: true,
      get() {
        const h = getMethodHandle();
        const impl2 = new NativeFunction(api.method_getImplementation(h), m.returnType, m.argumentTypes, invocationOptions);
        const newImp = getReplacementMethodImplementation(h);
        if (newImp !== null)
          impl2._callback = newImp;
        return impl2;
      },
      set(imp) {
        replaceMethodImplementation(getMethodHandle(), imp);
      }
    });
    m.returnType = retType.type;
    m.argumentTypes = signature.argTypes.map((t) => t.type);
    m.types = types;
    Object.defineProperty(m, "symbol", {
      enumerable: true,
      get() {
        return `${method.kind}[${owner.$className} ${selectorAsString(sel)}]`;
      }
    });
    m.clone = function(options) {
      return makeMethodInvocationWrapper(method, owner, superSpecifier, options);
    };
    function getMethodHandle() {
      if (handle === null) {
        if (owner.$kind === "instance") {
          let cur = owner;
          do {
            if ("- forwardingTargetForSelector:" in cur) {
              const target = cur.forwardingTargetForSelector_(sel);
              if (target === null)
                break;
              if (target.$kind !== "instance")
                break;
              const h = api.class_getInstanceMethod(target.$class.handle, sel);
              if (!h.isNull())
                handle = h;
              else
                cur = target;
            } else {
              break;
            }
          } while (handle === null);
        }
        if (handle === null)
          throw new Error("Unable to find method handle of proxied function");
      }
      return handle;
    }
    return m;
  }
  function makeMethodImplementationWrapper(signature, implementation) {
    const retType = signature.retType;
    const argTypes = signature.argTypes;
    const argVariableNames = argTypes.map(function(t, i) {
      if (i === 0)
        return "handle";
      else if (i === 1)
        return "sel";
      else
        return "a" + (i - 1);
    });
    const callArgs = argTypes.slice(2).map(function(t, i) {
      const argVariableName = argVariableNames[2 + i];
      if (t.fromNative) {
        return "argTypes[" + (2 + i) + "].fromNative.call(self, " + argVariableName + ")";
      }
      return argVariableName;
    });
    let returnCaptureLeft;
    let returnCaptureRight;
    if (retType.type === "void") {
      returnCaptureLeft = "";
      returnCaptureRight = "";
    } else if (retType.toNative) {
      returnCaptureLeft = "return retType.toNative.call(self, ";
      returnCaptureRight = ")";
    } else {
      returnCaptureLeft = "return ";
      returnCaptureRight = "";
    }
    const m = eval("var m = function (" + argVariableNames.join(", ") + ") { var binding = getBinding(handle);var self = binding.self;" + returnCaptureLeft + "implementation.call(binding" + (callArgs.length > 0 ? ", " : "") + callArgs.join(", ") + ")" + returnCaptureRight + "; }; m;");
    return m;
  }
  function makeBlockInvocationWrapper(block, signature, implementation) {
    const retType = signature.retType;
    const argTypes = signature.argTypes.slice(1);
    const argVariableNames = argTypes.map(function(t, i) {
      return "a" + (i + 1);
    });
    const callArgs = argTypes.map(function(t, i) {
      if (t.toNative) {
        return "argTypes[" + i + "].toNative.call(this, " + argVariableNames[i] + ")";
      }
      return argVariableNames[i];
    });
    let returnCaptureLeft;
    let returnCaptureRight;
    if (retType.type === "void") {
      returnCaptureLeft = "";
      returnCaptureRight = "";
    } else if (retType.fromNative) {
      returnCaptureLeft = "return retType.fromNative.call(this, ";
      returnCaptureRight = ")";
    } else {
      returnCaptureLeft = "return ";
      returnCaptureRight = "";
    }
    const f = eval("var f = function (" + argVariableNames.join(", ") + ") { " + returnCaptureLeft + "implementation(this" + (callArgs.length > 0 ? ", " : "") + callArgs.join(", ") + ")" + returnCaptureRight + "; }; f;");
    return f.bind(block);
  }
  function makeBlockImplementationWrapper(block, signature, implementation) {
    const retType = signature.retType;
    const argTypes = signature.argTypes;
    const argVariableNames = argTypes.map(function(t, i) {
      if (i === 0)
        return "handle";
      else
        return "a" + i;
    });
    const callArgs = argTypes.slice(1).map(function(t, i) {
      const argVariableName = argVariableNames[1 + i];
      if (t.fromNative) {
        return "argTypes[" + (1 + i) + "].fromNative.call(this, " + argVariableName + ")";
      }
      return argVariableName;
    });
    let returnCaptureLeft;
    let returnCaptureRight;
    if (retType.type === "void") {
      returnCaptureLeft = "";
      returnCaptureRight = "";
    } else if (retType.toNative) {
      returnCaptureLeft = "return retType.toNative.call(this, ";
      returnCaptureRight = ")";
    } else {
      returnCaptureLeft = "return ";
      returnCaptureRight = "";
    }
    const f = eval("var f = function (" + argVariableNames.join(", ") + ") { if (!this.handle.equals(handle))this.handle = handle;" + returnCaptureLeft + "implementation.call(block" + (callArgs.length > 0 ? ", " : "") + callArgs.join(", ") + ")" + returnCaptureRight + "; }; f;");
    return f.bind(block);
  }
  function rawFridaType(t) {
    return t === "object" ? "pointer" : t;
  }
  function makeClassName() {
    for (let i = 1; true; i++) {
      const name = "FridaAnonymousClass" + i;
      if (!(name in classRegistry)) {
        return name;
      }
    }
  }
  function makeProtocolName() {
    for (let i = 1; true; i++) {
      const name = "FridaAnonymousProtocol" + i;
      if (!(name in protocolRegistry)) {
        return name;
      }
    }
  }
  function objcMethodName(name) {
    return name.replace(/_/g, ":");
  }
  function jsMethodName(name) {
    let result = name.replace(/:/g, "_");
    if (objCObjectBuiltins.has(result))
      result += "2";
    return result;
  }
  const isaMasks = {
    x64: "0x7ffffffffff8",
    arm64: "0xffffffff8"
  };
  const rawMask = isaMasks[Process.arch];
  if (rawMask !== void 0) {
    const mask = ptr(rawMask);
    readObjectIsa = function(p) {
      return p.readPointer().and(mask);
    };
  } else {
    readObjectIsa = function(p) {
      return p.readPointer();
    };
  }
  function getMsgSendImpl(signature2, invocationOptions2) {
    return resolveMsgSendImpl(msgSendBySignatureId, signature2, invocationOptions2, false);
  }
  function getMsgSendSuperImpl(signature2, invocationOptions2) {
    return resolveMsgSendImpl(msgSendSuperBySignatureId, signature2, invocationOptions2, true);
  }
  function resolveMsgSendImpl(cache, signature2, invocationOptions2, isSuper) {
    if (invocationOptions2 !== defaultInvocationOptions)
      return makeMsgSendImpl(signature2, invocationOptions2, isSuper);
    const { id } = signature2;
    let impl2 = cache.get(id);
    if (impl2 === void 0) {
      impl2 = makeMsgSendImpl(signature2, invocationOptions2, isSuper);
      cache.set(id, impl2);
    }
    return impl2;
  }
  function makeMsgSendImpl(signature2, invocationOptions2, isSuper) {
    const retType2 = signature2.retType.type;
    const argTypes2 = signature2.argTypes.map(function(t) {
      return t.type;
    });
    const components = ["objc_msgSend"];
    if (isSuper)
      components.push("Super");
    const returnsStruct = retType2 instanceof Array;
    if (returnsStruct && !typeFitsInRegisters(retType2))
      components.push("_stret");
    else if (retType2 === "float" || retType2 === "double")
      components.push("_fpret");
    const name = components.join("");
    return new NativeFunction(api[name], retType2, argTypes2, invocationOptions2);
  }
  function typeFitsInRegisters(type) {
    if (Process.arch !== "x64")
      return false;
    const size = sizeOfTypeOnX64(type);
    return size <= 16;
  }
  function sizeOfTypeOnX64(type) {
    if (type instanceof Array)
      return type.reduce((total, field) => total + sizeOfTypeOnX64(field), 0);
    switch (type) {
      case "bool":
      case "char":
      case "uchar":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int":
      case "int32":
      case "uint":
      case "uint32":
      case "float":
        return 4;
      default:
        return 8;
    }
  }
  function unparseSignature(retType2, argTypes2) {
    const retTypeId = typeIdFromAlias(retType2);
    const argTypeIds = argTypes2.map(typeIdFromAlias);
    const argSizes = argTypeIds.map((id) => singularTypeById[id].size);
    const frameSize = argSizes.reduce((total, size) => total + size, 0);
    let frameOffset = 0;
    return retTypeId + frameSize + argTypeIds.map((id, i) => {
      const result = id + frameOffset;
      frameOffset += argSizes[i];
      return result;
    }).join("");
  }
  function parseSignature(sig) {
    const cursor = [sig, 0];
    parseQualifiers(cursor);
    const retType2 = readType(cursor);
    readNumber(cursor);
    const argTypes2 = [];
    let id = JSON.stringify(retType2.type);
    while (dataAvailable(cursor)) {
      parseQualifiers(cursor);
      const argType = readType(cursor);
      readNumber(cursor);
      argTypes2.push(argType);
      id += JSON.stringify(argType.type);
    }
    return {
      id,
      retType: retType2,
      argTypes: argTypes2
    };
  }
  function parseType(type) {
    const cursor = [type, 0];
    return readType(cursor);
  }
  function readType(cursor) {
    let id = readChar(cursor);
    if (id === "@") {
      let next = peekChar(cursor);
      if (next === "?") {
        id += next;
        skipChar(cursor);
        if (peekChar(cursor) === "<")
          skipExtendedBlock(cursor);
      } else if (next === '"') {
        skipChar(cursor);
        readUntil('"', cursor);
      }
    } else if (id === "^") {
      let next = peekChar(cursor);
      if (next === "@") {
        id += next;
        skipChar(cursor);
      }
    }
    const type = singularTypeById[id];
    if (type !== void 0) {
      return type;
    } else if (id === "[") {
      const length = readNumber(cursor);
      const elementType = readType(cursor);
      skipChar(cursor);
      return arrayType(length, elementType);
    } else if (id === "{") {
      if (!tokenExistsAhead("=", "}", cursor)) {
        readUntil("}", cursor);
        return structType([]);
      }
      readUntil("=", cursor);
      const structFields = [];
      let ch;
      while ((ch = peekChar(cursor)) !== "}") {
        if (ch === '"') {
          skipChar(cursor);
          readUntil('"', cursor);
        }
        structFields.push(readType(cursor));
      }
      skipChar(cursor);
      return structType(structFields);
    } else if (id === "(") {
      readUntil("=", cursor);
      const unionFields = [];
      while (peekChar(cursor) !== ")")
        unionFields.push(readType(cursor));
      skipChar(cursor);
      return unionType(unionFields);
    } else if (id === "b") {
      readNumber(cursor);
      return singularTypeById.i;
    } else if (id === "^") {
      readType(cursor);
      return singularTypeById["?"];
    } else if (modifiers.has(id)) {
      return readType(cursor);
    } else {
      throw new Error("Unable to handle type " + id);
    }
  }
  function skipExtendedBlock(cursor) {
    let ch;
    skipChar(cursor);
    while ((ch = peekChar(cursor)) !== ">") {
      if (peekChar(cursor) === "<") {
        skipExtendedBlock(cursor);
      } else {
        skipChar(cursor);
        if (ch === '"')
          readUntil('"', cursor);
      }
    }
    skipChar(cursor);
  }
  function readNumber(cursor) {
    let result = "";
    while (dataAvailable(cursor)) {
      const c = peekChar(cursor);
      const v = c.charCodeAt(0);
      const isDigit = v >= 48 && v <= 57;
      if (isDigit) {
        result += c;
        skipChar(cursor);
      } else {
        break;
      }
    }
    return parseInt(result);
  }
  function readUntil(token, cursor) {
    const buffer = cursor[0];
    const offset = cursor[1];
    const index = buffer.indexOf(token, offset);
    if (index === -1)
      throw new Error("Expected token '" + token + "' not found");
    const result = buffer.substring(offset, index);
    cursor[1] = index + 1;
    return result;
  }
  function readChar(cursor) {
    return cursor[0][cursor[1]++];
  }
  function peekChar(cursor) {
    return cursor[0][cursor[1]];
  }
  function tokenExistsAhead(token, terminator, cursor) {
    const [buffer, offset] = cursor;
    const tokenIndex = buffer.indexOf(token, offset);
    if (tokenIndex === -1)
      return false;
    const terminatorIndex = buffer.indexOf(terminator, offset);
    if (terminatorIndex === -1)
      throw new Error("Expected to find terminator: " + terminator);
    return tokenIndex < terminatorIndex;
  }
  function skipChar(cursor) {
    cursor[1]++;
  }
  function dataAvailable(cursor) {
    return cursor[1] !== cursor[0].length;
  }
  const qualifierById = {
    "r": "const",
    "n": "in",
    "N": "inout",
    "o": "out",
    "O": "bycopy",
    "R": "byref",
    "V": "oneway"
  };
  function parseQualifiers(cursor) {
    const qualifiers = [];
    while (true) {
      const q = qualifierById[peekChar(cursor)];
      if (q === void 0)
        break;
      qualifiers.push(q);
      skipChar(cursor);
    }
    return qualifiers;
  }
  const idByAlias = {
    "char": "c",
    "int": "i",
    "int16": "s",
    "int32": "i",
    "int64": "q",
    "uchar": "C",
    "uint": "I",
    "uint16": "S",
    "uint32": "I",
    "uint64": "Q",
    "float": "f",
    "double": "d",
    "bool": "B",
    "void": "v",
    "string": "*",
    "object": "@",
    "block": "@?",
    "class": "#",
    "selector": ":",
    "pointer": "^v"
  };
  function typeIdFromAlias(alias) {
    if (typeof alias === "object" && alias !== null)
      return `@"${alias.type}"`;
    const id = idByAlias[alias];
    if (id === void 0)
      throw new Error("No known encoding for type " + alias);
    return id;
  }
  const fromNativeId = function(h) {
    if (h.isNull()) {
      return null;
    } else if (h.toString(16) === this.handle.toString(16)) {
      return this;
    } else {
      return new ObjCObject(h);
    }
  };
  const toNativeId = function(v) {
    if (v === null)
      return NULL;
    const type = typeof v;
    if (type === "string") {
      if (cachedNSStringCtor === null) {
        cachedNSString = classRegistry.NSString;
        cachedNSStringCtor = cachedNSString.stringWithUTF8String_;
      }
      return cachedNSStringCtor.call(cachedNSString, Memory.allocUtf8String(v));
    } else if (type === "number") {
      if (cachedNSNumberCtor === null) {
        cachedNSNumber = classRegistry.NSNumber;
        cachedNSNumberCtor = cachedNSNumber.numberWithDouble_;
      }
      return cachedNSNumberCtor.call(cachedNSNumber, v);
    }
    return v;
  };
  const fromNativeBlock = function(h) {
    if (h.isNull()) {
      return null;
    } else if (h.toString(16) === this.handle.toString(16)) {
      return this;
    } else {
      return new Block(h);
    }
  };
  const toNativeBlock = function(v) {
    return v !== null ? v : NULL;
  };
  const toNativeObjectArray = function(v) {
    if (v instanceof Array) {
      const length = v.length;
      const array = Memory.alloc(length * pointerSize);
      for (let i = 0; i !== length; i++)
        array.add(i * pointerSize).writePointer(toNativeId(v[i]));
      return array;
    }
    return v;
  };
  function arrayType(length, elementType) {
    return {
      type: "pointer",
      read(address) {
        const result = [];
        const elementSize = elementType.size;
        for (let index = 0; index !== length; index++) {
          result.push(elementType.read(address.add(index * elementSize)));
        }
        return result;
      },
      write(address, values) {
        const elementSize = elementType.size;
        values.forEach((value, index) => {
          elementType.write(address.add(index * elementSize), value);
        });
      }
    };
  }
  function structType(fieldTypes) {
    let fromNative, toNative;
    if (fieldTypes.some(function(t) {
      return !!t.fromNative;
    })) {
      const fromTransforms = fieldTypes.map(function(t) {
        if (t.fromNative)
          return t.fromNative;
        else
          return identityTransform;
      });
      fromNative = function(v) {
        return v.map(function(e, i) {
          return fromTransforms[i].call(this, e);
        });
      };
    } else {
      fromNative = identityTransform;
    }
    if (fieldTypes.some(function(t) {
      return !!t.toNative;
    })) {
      const toTransforms = fieldTypes.map(function(t) {
        if (t.toNative)
          return t.toNative;
        else
          return identityTransform;
      });
      toNative = function(v) {
        return v.map(function(e, i) {
          return toTransforms[i].call(this, e);
        });
      };
    } else {
      toNative = identityTransform;
    }
    const [totalSize, fieldOffsets] = fieldTypes.reduce(function(result, t) {
      const [previousOffset, offsets] = result;
      const { size } = t;
      const offset = align(previousOffset, size);
      offsets.push(offset);
      return [offset + size, offsets];
    }, [0, []]);
    return {
      type: fieldTypes.map((t) => t.type),
      size: totalSize,
      read(address) {
        return fieldTypes.map((type, index) => type.read(address.add(fieldOffsets[index])));
      },
      write(address, values) {
        values.forEach((value, index) => {
          fieldTypes[index].write(address.add(fieldOffsets[index]), value);
        });
      },
      fromNative,
      toNative
    };
  }
  function unionType(fieldTypes) {
    const largestType = fieldTypes.reduce(function(largest, t) {
      if (t.size > largest.size)
        return t;
      else
        return largest;
    }, fieldTypes[0]);
    let fromNative, toNative;
    if (largestType.fromNative) {
      const fromTransform = largestType.fromNative;
      fromNative = function(v) {
        return fromTransform.call(this, v[0]);
      };
    } else {
      fromNative = function(v) {
        return v[0];
      };
    }
    if (largestType.toNative) {
      const toTransform = largestType.toNative;
      toNative = function(v) {
        return [toTransform.call(this, v)];
      };
    } else {
      toNative = function(v) {
        return [v];
      };
    }
    return {
      type: [largestType.type],
      size: largestType.size,
      read: largestType.read,
      write: largestType.write,
      fromNative,
      toNative
    };
  }
  const longBits = pointerSize == 8 && Process.platform !== "windows" ? 64 : 32;
  modifiers = /* @__PURE__ */ new Set([
    "j",
    // complex
    "A",
    // atomic
    "r",
    // const
    "n",
    // in
    "N",
    // inout
    "o",
    // out
    "O",
    // by copy
    "R",
    // by ref
    "V",
    // one way
    "+"
    // GNU register
  ]);
  singularTypeById = {
    "c": {
      type: "char",
      size: 1,
      read: (address) => address.readS8(),
      write: (address, value) => {
        address.writeS8(value);
      },
      toNative(v) {
        if (typeof v === "boolean") {
          return v ? 1 : 0;
        }
        return v;
      }
    },
    "i": {
      type: "int",
      size: 4,
      read: (address) => address.readInt(),
      write: (address, value) => {
        address.writeInt(value);
      }
    },
    "s": {
      type: "int16",
      size: 2,
      read: (address) => address.readS16(),
      write: (address, value) => {
        address.writeS16(value);
      }
    },
    "l": {
      type: "int32",
      size: 4,
      read: (address) => address.readS32(),
      write: (address, value) => {
        address.writeS32(value);
      }
    },
    "q": {
      type: "int64",
      size: 8,
      read: (address) => address.readS64(),
      write: (address, value) => {
        address.writeS64(value);
      }
    },
    "C": {
      type: "uchar",
      size: 1,
      read: (address) => address.readU8(),
      write: (address, value) => {
        address.writeU8(value);
      }
    },
    "I": {
      type: "uint",
      size: 4,
      read: (address) => address.readUInt(),
      write: (address, value) => {
        address.writeUInt(value);
      }
    },
    "S": {
      type: "uint16",
      size: 2,
      read: (address) => address.readU16(),
      write: (address, value) => {
        address.writeU16(value);
      }
    },
    "L": {
      type: "uint" + longBits,
      size: longBits / 8,
      read: (address) => address.readULong(),
      write: (address, value) => {
        address.writeULong(value);
      }
    },
    "Q": {
      type: "uint64",
      size: 8,
      read: (address) => address.readU64(),
      write: (address, value) => {
        address.writeU64(value);
      }
    },
    "f": {
      type: "float",
      size: 4,
      read: (address) => address.readFloat(),
      write: (address, value) => {
        address.writeFloat(value);
      }
    },
    "d": {
      type: "double",
      size: 8,
      read: (address) => address.readDouble(),
      write: (address, value) => {
        address.writeDouble(value);
      }
    },
    "B": {
      type: "bool",
      size: 1,
      read: (address) => address.readU8(),
      write: (address, value) => {
        address.writeU8(value);
      },
      fromNative(v) {
        return v ? true : false;
      },
      toNative(v) {
        return v ? 1 : 0;
      }
    },
    "v": {
      type: "void",
      size: 0
    },
    "*": {
      type: "pointer",
      size: pointerSize,
      read: (address) => address.readPointer(),
      write: (address, value) => {
        address.writePointer(value);
      },
      fromNative(h) {
        return h.readUtf8String();
      }
    },
    "@": {
      type: "pointer",
      size: pointerSize,
      read: (address) => address.readPointer(),
      write: (address, value) => {
        address.writePointer(value);
      },
      fromNative: fromNativeId,
      toNative: toNativeId
    },
    "@?": {
      type: "pointer",
      size: pointerSize,
      read: (address) => address.readPointer(),
      write: (address, value) => {
        address.writePointer(value);
      },
      fromNative: fromNativeBlock,
      toNative: toNativeBlock
    },
    "^@": {
      type: "pointer",
      size: pointerSize,
      read: (address) => address.readPointer(),
      write: (address, value) => {
        address.writePointer(value);
      },
      toNative: toNativeObjectArray
    },
    "^v": {
      type: "pointer",
      size: pointerSize,
      read: (address) => address.readPointer(),
      write: (address, value) => {
        address.writePointer(value);
      }
    },
    "#": {
      type: "pointer",
      size: pointerSize,
      read: (address) => address.readPointer(),
      write: (address, value) => {
        address.writePointer(value);
      },
      fromNative: fromNativeId,
      toNative: toNativeId
    },
    ":": {
      type: "pointer",
      size: pointerSize,
      read: (address) => address.readPointer(),
      write: (address, value) => {
        address.writePointer(value);
      }
    },
    "?": {
      type: "pointer",
      size: pointerSize,
      read: (address) => address.readPointer(),
      write: (address, value) => {
        address.writePointer(value);
      }
    }
  };
  function identityTransform(v) {
    return v;
  }
  function align(value, boundary) {
    const remainder = value % boundary;
    return remainder === 0 ? value : value + (boundary - remainder);
  }
}
var runtime2 = new Runtime2();
var frida_objc_bridge_default = runtime2;

// agent/Utils/Debugger.ts
var Debugger = class _Debugger {
  static Colors = {
    RESET: "\x1B[0m",
    INFO: "\x1B[96;1m",
    WARN: "\x1B[93;1m",
    ERROR: "\x1B[91;1m",
    DEBUG: "\x1B[95;1m"
  };
  static Format(level, ...messages2) {
    const color = _Debugger.Colors[level];
    const reset = _Debugger.Colors.RESET;
    return `${color}[${level}] ${messages2.map((m2) => typeof m2 === "string" ? m2 : JSON.stringify(m2, null, 2)).join(" ")}${reset}`;
  }
  static Log(level, ...messages2) {
    const fn = console[level.toLowerCase()];
    fn(_Debugger.Format(level, ...messages2));
  }
  static Info(...messages2) {
    _Debugger.Log("INFO", ...messages2);
  }
  static Warn(...messages2) {
    _Debugger.Log("WARN", ...messages2);
  }
  static Error(...messages2) {
    _Debugger.Log("ERROR", ...messages2);
  }
  static Debug(...messages2) {
    _Debugger.Log("DEBUG", ...messages2);
  }
};
var Debugger_default = Debugger;

// agent/Environement/Environment.ts
var Environment = class _Environment {
  static script_version = "1.0.0";
  static script_branch = "dev";
  static process_name = "Nulls Brawl";
  static platform = "iOS";
  static LaserModule;
  static LaserBase;
  static LaserBaseSize;
  static Init() {
    if (frida_java_bridge_default.available) {
      _Environment.platform = "Android";
    } else if (frida_objc_bridge_default.available) {
      _Environment.platform = "iOS";
    } else {
      Debugger_default.Error("wrong way ever to check if a device is ios or android but ngl im lazy bruh");
    }
    if (_Environment.platform == "iOS") {
      _Environment.FindModuleByName("NullsBrawl");
      _Environment.FindBaseAddress();
      _Environment.FindBaseSize();
    }
    if (_Environment.platform == "Android") {
      _Environment.FindModuleByName("libg.so");
      _Environment.FindBaseAddress();
      _Environment.FindBaseSize();
    }
  }
  static FindModuleByName(name) {
    _Environment.LaserModule = Process.getModuleByName(name);
  }
  static FindBaseAddress() {
    _Environment.LaserBase = _Environment.LaserModule.base;
  }
  static FindBaseSize() {
    _Environment.LaserBaseSize = _Environment.LaserModule.size;
  }
};
var Environment_default = Environment;

// agent/Manager/Addresses.ts
var Addresses = class _Addresses {
  static Imports = class {
    static Malloc;
  };
  static GUI_ShowFloaterTextAtDefaultPos;
  static GUI_showPopup;
  static GUIInstance;
  static StringCtor;
  static HomeMode_Enter;
  static AddFile;
  static StageAddChild;
  static GUIContainer;
  static GUIContainer_setMovieClip;
  static SpriteCtor;
  static DisplayObject_setPixelSnappedXY;
  static DisplayObject_setXY;
  static LogicDataTables_getColorGradientByName;
  static DecoratedTextField_setupDecoratedText;
  static MovieClip_getTextFieldByName;
  static ResourceManager_getMovieClip;
  static GUIContainer_createScrollArea;
  static ScrollArea_enablePinching;
  static ScrollArea_enableHorizontalDrag;
  static ScrollArea_enableVerticalDrag;
  static ScrollArea_setAlignment;
  static ScrollArea_update;
  static ScrollArea_addContent;
  static CustomButton_buttonPressed;
  static MovieClip_setText;
  static GameButtonCtor;
  static MovieClipHelper_setTextFieldVerticallyCentered;
  static MovieClipHelper_setTextAndScaleIfNecessary;
  static ServerConnectionUpdate;
  static State;
  static HasConnectFailed;
  static MessagingSend;
  static MessageManagerReceiveMessage;
  static MessageManagerInstance;
  static CreateMessageByType;
  static GetMessageType;
  static Destruct;
  static LogicLaserMessageFactory;
  static Decode;
  static PiranhaMessage;
  static GetLength;
  static IsServerShuttingDown;
  static ByteStreamWriteIntToByteArray;
  static LoginOkMessage;
  static HomePageButtonClicked;
  static LogicConfDataGetIntValue;
  static LogicLocalizationGetString;
  static StringConstructor;
  static PayloadSize;
  static PayloadPtr;
  static LogicVersionIsDev;
  static LogicVersionIsProd;
  static LogicVersionIsDeveloperBuild;
  static MessageLength;
  static ByteStream;
  static Version;
  static LogicGameModeUtil_getPlayerCount;
  static sm_offlineLocation;
  static LogicSkillServerCtor;
  static LogicSkillServerDtor;
  static Init() {
    _Addresses.Imports.Malloc = Process.getModuleByName("libSystem.B.dylib").findExportByName("malloc");
    _Addresses.GUI_ShowFloaterTextAtDefaultPos = Environment_default.LaserBase.add(674180);
    _Addresses.GUI_showPopup = Environment_default.LaserBase.add(675996);
    _Addresses.GUIInstance = Environment_default.LaserBase.add(15477e3);
    _Addresses.StringCtor = Environment_default.LaserBase.add(11998344);
    _Addresses.HomeMode_Enter = Environment_default.LaserBase.add(3265620);
    _Addresses.AddFile = Environment_default.LaserBase.add(10707260);
    _Addresses.StageAddChild = Environment_default.LaserBase.add(10227692);
    _Addresses.GUIContainer = Environment_default.LaserBase.add(688240);
    _Addresses.GUIContainer_setMovieClip = Environment_default.LaserBase.add(689236);
    _Addresses.SpriteCtor = Environment_default.LaserBase.add(10189732);
    _Addresses.DisplayObject_setPixelSnappedXY = Environment_default.LaserBase.add(10101996);
    _Addresses.DisplayObject_setXY = Environment_default.LaserBase.add(10101968);
    _Addresses.LogicDataTables_getColorGradientByName = Environment_default.LaserBase.add(4124004);
    _Addresses.DecoratedTextField_setupDecoratedText = Environment_default.LaserBase.add(661828);
    _Addresses.MovieClip_getTextFieldByName = Environment_default.LaserBase.add(10124948);
    _Addresses.ResourceManager_getMovieClip = Environment_default.LaserBase.add(9850936);
    _Addresses.GUIContainer_createScrollArea = Environment_default.LaserBase.add(10318384);
    _Addresses.ScrollArea_enablePinching = Environment_default.LaserBase.add(10323100);
    _Addresses.ScrollArea_enableHorizontalDrag = Environment_default.LaserBase.add(10323236);
    _Addresses.ScrollArea_enableVerticalDrag = Environment_default.LaserBase.add(10323224);
    _Addresses.ScrollArea_setAlignment = Environment_default.LaserBase.add(10324232);
    _Addresses.ScrollArea_update = Environment_default.LaserBase.add(10322324);
    _Addresses.ScrollArea_addContent = Environment_default.LaserBase.add(10321772);
    _Addresses.CustomButton_buttonPressed = Environment_default.LaserBase.add(10314196);
    _Addresses.MovieClip_setText = Environment_default.LaserBase.add(10125460);
    _Addresses.GameButtonCtor = Environment_default.LaserBase.add(684784);
    _Addresses.MovieClipHelper_setTextFieldVerticallyCentered = Environment_default.LaserBase.add(3688800);
    _Addresses.MovieClipHelper_setTextAndScaleIfNecessary = Environment_default.LaserBase.add(3689652);
    _Addresses.ServerConnectionUpdate = Environment_default.LaserBase.add(2338352);
    _Addresses.State = ptr(Process.pointerSize * 4);
    _Addresses.HasConnectFailed = ptr(Process.pointerSize);
    _Addresses.MessagingSend = Environment_default.LaserBase.add(11934012);
    _Addresses.MessageManagerReceiveMessage = Environment_default.LaserBase.add(2303748);
    _Addresses.MessageManagerInstance = Environment_default.LaserBase.add(15477336);
    _Addresses.CreateMessageByType = Environment_default.LaserBase.add(4669956);
    _Addresses.GetMessageType = ptr(Process.pointerSize * 5);
    _Addresses.Destruct = ptr(Process.pointerSize * 7);
    _Addresses.LogicLaserMessageFactory = Environment_default.LaserBase.add(14236950);
    _Addresses.Decode = ptr(3 * Process.pointerSize);
    _Addresses.PiranhaMessage = Environment_default.LaserBase.add(17648226);
    _Addresses.GetLength = Environment_default.LaserBase.add(11100664);
    _Addresses.IsServerShuttingDown = Environment_default.LaserBase.add(8054288);
    _Addresses.ByteStreamWriteIntToByteArray = Environment_default.LaserBase.add(13163808);
    _Addresses.LoginOkMessage = Environment_default.LaserBase.add(5575876);
    _Addresses.HomePageButtonClicked = Environment_default.LaserBase.add(4180612);
    _Addresses.LogicConfDataGetIntValue = Environment_default.LaserBase.add(12778376);
    _Addresses.LogicLocalizationGetString = Environment_default.LaserBase.add(5298700);
    _Addresses.StringConstructor = Environment_default.LaserBase.add(13271652);
    _Addresses.PayloadSize = ptr(Process.pointerSize + Process.pointerSize * 4);
    _Addresses.PayloadPtr = ptr(9 * Process.pointerSize);
    _Addresses.LogicVersionIsDev = Environment_default.LaserBase.add(12342476);
    _Addresses.LogicVersionIsProd = Environment_default.LaserBase.add(4890752);
    _Addresses.LogicVersionIsDeveloperBuild = Environment_default.LaserBase.add(7106744);
    _Addresses.MessageLength = ptr(Process.pointerSize * 2 + Process.pointerSize * 4 + Process.pointerSize);
    _Addresses.ByteStream = ptr(Process.pointerSize * 2);
    _Addresses.Version = ptr(Process.pointerSize);
    _Addresses.LogicGameModeUtil_getPlayerCount = Environment_default.LaserBase.add(5092984);
    _Addresses.sm_offlineLocation = Environment_default.LaserBase.add(15624e3).add(96);
    _Addresses.LogicSkillServerCtor = Environment_default.LaserBase.add(4559744);
    _Addresses.LogicSkillServerDtor = Environment_default.LaserBase.add(4559748);
  }
};
var Addresses_default = Addresses;

// agent/Manager/Functions.ts
var Functions = class _Functions {
  static GUI = class {
    static ShowFloaterTextAtDefaultPos;
    static ShowPopup;
    static GetInstance;
  };
  static ResourceManager = class {
    static GetMovieClip;
  };
  static GUIContainer = class {
    static GUIContainer;
    static SetMovieClip;
    static CreateScrollArea;
  };
  static DisplayObject = class {
    static SetPixelSnappedXY;
    static SetXY;
  };
  static LogicDataTables = class {
    static GetColorGradientByName;
  };
  static DecoratedTextField = class {
    static SetupDecoratedText;
  };
  static MovieClip = class {
    static GetTextFieldByName;
    static SetText;
  };
  static GameButton = class {
    static GameButton;
  };
  static MovieClipHelper = class {
    static SetTextFieldVerticallyCentered;
    static SetTextAndScaleIfNecessary;
  };
  static Sprite = class {
    static Sprite;
  };
  static String = class {
    static StringCtor;
  };
  static ResourceListenner = class {
    static AddFile;
  };
  static Stage = class {
    static AddChild;
    static sm_instance;
  };
  static ScrollArea = class {
    static EnablePinching;
    static EnableHorizontalDrag;
    static EnableVerticalDrag;
    static SetAlignment;
    static Update;
    static AddContent;
  };
  static Imports = class {
    static Malloc;
    static Free;
    static Open;
    static Read;
    static Write;
    static Close;
    static Mkdir;
  };
  static LogicLaserMessageFactory = class {
    static CreateMessageByType;
  };
  static Messaging = class {
    static ReceiveMessage;
    static Send;
  };
  static LogicGameModeUtil = class {
    static GetPlayerCount;
  };
  static LogicSkillServer = class {
    static Constructor;
    static Destructor;
  };
  static Init() {
    const LibSystem = Process.getModuleByName("libSystem.B.dylib");
    _Functions.GUI.ShowFloaterTextAtDefaultPos = new NativeFunction(Addresses_default.GUI_ShowFloaterTextAtDefaultPos, "void", ["pointer", "pointer", "float", "int"]);
    _Functions.GUI.ShowPopup = new NativeFunction(Addresses_default.GUI_showPopup, "void", ["pointer", "pointer", "int", "int", "int"]);
    _Functions.GUI.GetInstance = new NativeFunction(Addresses_default.GUIInstance, "pointer", []);
    _Functions.ResourceManager.GetMovieClip = new NativeFunction(Addresses_default.ResourceManager_getMovieClip, "pointer", ["pointer", "pointer"]);
    _Functions.GUIContainer.GUIContainer = new NativeFunction(Addresses_default.GUIContainer, "void", ["pointer"]);
    _Functions.GUIContainer.SetMovieClip = new NativeFunction(Addresses_default.GUIContainer_setMovieClip, "void", ["pointer", "pointer"]);
    _Functions.GUIContainer.CreateScrollArea = new NativeFunction(Addresses_default.GUIContainer_createScrollArea, "pointer", ["pointer", "pointer", "int"]);
    _Functions.DisplayObject.SetPixelSnappedXY = new NativeFunction(Addresses_default.DisplayObject_setPixelSnappedXY, "float", ["pointer", "float", "float"]);
    _Functions.DisplayObject.SetXY = new NativeFunction(Addresses_default.DisplayObject_setXY, "float", ["pointer", "float", "float"]);
    _Functions.LogicDataTables.GetColorGradientByName = new NativeFunction(Addresses_default.LogicDataTables_getColorGradientByName, "pointer", ["pointer", "int"]);
    _Functions.DecoratedTextField.SetupDecoratedText = new NativeFunction(Addresses_default.DecoratedTextField_setupDecoratedText, "void", ["pointer", "pointer", "pointer"]);
    _Functions.MovieClip.GetTextFieldByName = new NativeFunction(Addresses_default.MovieClip_getTextFieldByName, "pointer", ["pointer", "pointer"]);
    _Functions.MovieClip.SetText = new NativeFunction(Addresses_default.MovieClip_setText, "void", ["pointer", "pointer", "pointer"]);
    _Functions.MovieClipHelper.SetTextFieldVerticallyCentered = new NativeFunction(Addresses_default.MovieClipHelper_setTextFieldVerticallyCentered, "void", ["pointer"]);
    _Functions.Sprite.Sprite = new NativeFunction(Addresses_default.SpriteCtor, "void", ["pointer", "int"]);
    _Functions.String.StringCtor = new NativeFunction(Addresses_default.StringCtor, "void", ["pointer", "pointer"]);
    _Functions.ResourceListenner.AddFile = new NativeFunction(Addresses_default.AddFile, "int", ["pointer", "pointer", "int", "int", "int", "int", "int"]);
    _Functions.Stage.AddChild = new NativeFunction(Addresses_default.StageAddChild, "pointer", ["pointer", "pointer"]);
    _Functions.Stage.sm_instance = Environment_default.LaserBase.add(15738536);
    _Functions.ScrollArea.EnablePinching = new NativeFunction(Addresses_default.ScrollArea_enablePinching, "void", ["pointer", "int"]);
    _Functions.ScrollArea.EnableHorizontalDrag = new NativeFunction(Addresses_default.ScrollArea_enableHorizontalDrag, "void", ["pointer", "int"]);
    _Functions.ScrollArea.EnableVerticalDrag = new NativeFunction(Addresses_default.ScrollArea_enableVerticalDrag, "void", ["pointer", "int"]);
    _Functions.ScrollArea.SetAlignment = new NativeFunction(Addresses_default.ScrollArea_setAlignment, "void", ["pointer", "int"]);
    _Functions.ScrollArea.Update = new NativeFunction(Addresses_default.ScrollArea_update, "void", ["pointer", "int"]);
    _Functions.ScrollArea.AddContent = new NativeFunction(Addresses_default.ScrollArea_addContent, "void", ["pointer", "pointer"]);
    _Functions.GameButton.GameButton = new NativeFunction(Addresses_default.GameButtonCtor, "void", ["pointer"]);
    _Functions.MovieClipHelper.SetTextAndScaleIfNecessary = new NativeFunction(Addresses_default.MovieClipHelper_setTextAndScaleIfNecessary, "void", ["pointer", "pointer", "int", "int"]);
    _Functions.Imports.Malloc = new NativeFunction(Addresses_default.Imports.Malloc, "pointer", ["uint"]);
    _Functions.Imports.Free = new NativeFunction(LibSystem.findExportByName("free"), "int", ["pointer"]);
    _Functions.Imports.Open = new NativeFunction(LibSystem.findExportByName("open"), "int", ["pointer", "int", "int"]);
    _Functions.Imports.Read = new NativeFunction(LibSystem.findExportByName("read"), "int", ["int", "pointer", "int"]);
    _Functions.Imports.Write = new NativeFunction(LibSystem.findExportByName("write"), "int", ["int", "pointer", "int"]);
    _Functions.Imports.Close = new NativeFunction(LibSystem.findExportByName("close"), "int", ["int"]);
    _Functions.Imports.Mkdir = new NativeFunction(LibSystem.findExportByName("mkdir"), "int", ["pointer", "uint32"]);
    _Functions.LogicLaserMessageFactory.CreateMessageByType = new NativeFunction(Addresses_default.CreateMessageByType, "pointer", ["pointer", "int"]);
    _Functions.Messaging.ReceiveMessage = new NativeFunction(Addresses_default.MessageManagerReceiveMessage, "int", ["pointer", "pointer"]);
    _Functions.Messaging.Send = new NativeFunction(Addresses_default.MessagingSend, "int", ["pointer", "pointer"]);
    _Functions.LogicGameModeUtil.GetPlayerCount = new NativeFunction(Addresses_default.LogicGameModeUtil_getPlayerCount, "int", ["pointer"]);
    _Functions.LogicSkillServer.Constructor = new NativeFunction(Addresses_default.LogicSkillServerCtor, "pointer", ["pointer", "pointer"]);
    _Functions.LogicSkillServer.Destructor = new NativeFunction(Addresses_default.LogicSkillServerDtor, "pointer", ["pointer"]);
  }
};
var Functions_default = Functions;

// agent/Protocol/PiranhaMessage/PiranhaMessage.ts
var PiranhaMessage = class {
  static Encode(Message) {
    return new NativeFunction(Message.readPointer().add(16).readPointer(), "int", ["pointer"])(Message);
  }
  static Decode(Message) {
    return new NativeFunction(Message.readPointer().add(24).readPointer(), "int", ["pointer"])(Message);
  }
  static GetServiceNodeType(Message) {
    return new NativeFunction(Message.readPointer().add(32).readPointer(), "int", ["pointer"])(Message);
  }
  static GetMessageType(Message) {
    return new NativeFunction(Message.readPointer().add(40).readPointer(), "int", ["pointer"])(Message);
  }
  static GetMessageTypeName(Message) {
    return new NativeFunction(Message.readPointer().add(48).readPointer(), "pointer", ["pointer"])(Message);
  }
  static Destruct(Message) {
    return new NativeFunction(Message.readPointer().add(56).readPointer(), "int", ["pointer"])(Message);
  }
  static GetByteStream(Message) {
    return Message.add(8);
  }
};
var PiranhaMessage_default = PiranhaMessage;

// agent/Protocol/Messaging/Messaging.ts
var Messaging = class {
  static SendOfflineMessage(Id, Payload) {
    let Version = Id === 20104 ? 1 : 0;
    if (Id != 24109) {
      Debugger_default.Info(`Sending offline message with Packet ID ${Id}, Payload size ${Payload.length}, Version ${Version}`);
    }
    let Factory = Functions_default.Imports.Malloc(1024);
    Factory.writePointer(Addresses_default.LogicLaserMessageFactory);
    let Message = Functions_default.LogicLaserMessageFactory.CreateMessageByType(Factory, Id);
    Message.add(136).writeS64(Version);
    let PayloadLengthPtr = PiranhaMessage_default.GetByteStream(Message).add(24);
    Memory.protect(PayloadLengthPtr, 4, "rw-");
    PayloadLengthPtr.writeS64(Payload.length);
    if (Payload.length > 0) {
      let PayloadPtr = Functions_default.Imports.Malloc(Payload.length).writeByteArray(Payload);
      PiranhaMessage_default.GetByteStream(Message).add(56).writePointer(PayloadPtr);
    }
    let DecodeFnPtr = Message.readPointer().add(24).readPointer();
    let Decode = new NativeFunction(DecodeFnPtr, "void", ["pointer"]);
    Decode(Message);
    Functions_default.Messaging.ReceiveMessage(Addresses_default.MessageManagerInstance.readPointer(), Message);
    return Message;
  }
};
var Messaging_default = Messaging;

// agent/DataStream/ByteStream.ts
var ByteStreamHelper = class {
  static Utf8ArrayToString(Array2) {
    let Out = "";
    let Index = 0;
    let Length = Array2.length;
    while (Index < Length) {
      let Char = Array2[Index++];
      if (Char < 128) {
        Out += String.fromCharCode(Char);
      } else if (Char > 191 && Char < 224) {
        let Char2 = Array2[Index++];
        Out += String.fromCharCode((Char & 31) << 6 | Char2 & 63);
      } else {
        let Char2 = Array2[Index++];
        let Char3 = Array2[Index++];
        Out += String.fromCharCode((Char & 15) << 12 | (Char2 & 63) << 6 | Char3 & 63);
      }
    }
    return Out;
  }
  static StringToUtf8Array(Str) {
    let Utf8 = [];
    for (let Index = 0; Index < Str.length; Index++) {
      let CharCode = Str.charCodeAt(Index);
      if (CharCode < 128) {
        Utf8.push(CharCode);
      } else if (CharCode < 2048) {
        Utf8.push(192 | CharCode >> 6, 128 | CharCode & 63);
      } else if (CharCode < 55296 || CharCode >= 57344) {
        Utf8.push(224 | CharCode >> 12, 128 | CharCode >> 6 & 63, 128 | CharCode & 63);
      } else {
        Index++;
        let SurrogatePair = 65536 + ((CharCode & 1023) << 10 | Str.charCodeAt(Index) & 1023);
        Utf8.push(240 | SurrogatePair >> 18, 128 | SurrogatePair >> 12 & 63, 128 | SurrogatePair >> 6 & 63, 128 | SurrogatePair & 63);
      }
    }
    return new Uint8Array(Utf8);
  }
};
var ByteStream = class {
  Payload;
  BitOffset;
  Offset;
  constructor(Payload) {
    this.Payload = Payload;
    this.BitOffset = 0;
    this.Offset = 0;
  }
  ReadInt() {
    this.BitOffset = 0;
    let Result = this.Payload[this.Offset] << 24 | this.Payload[this.Offset + 1] << 16 | this.Payload[this.Offset + 2] << 8 | this.Payload[this.Offset + 3];
    this.Offset += 4;
    return Result;
  }
  ReadByte() {
    this.BitOffset = 0;
    let Result = this.Payload[this.Offset];
    this.Offset++;
    return Result;
  }
  ReadShort() {
    this.BitOffset = 0;
    let Result = this.Payload[this.Offset] << 8 | this.Payload[this.Offset + 1];
    this.Offset += 2;
    return Result;
  }
  ReadLong() {
    this.BitOffset = 0;
    let High = this.ReadInt();
    let Low = this.ReadInt();
    return Number(BigInt(High) << 32n | BigInt(Low));
  }
  ReadString() {
    this.BitOffset = 0;
    let Length = this.ReadInt();
    let Bytes = new Uint8Array(this.Payload.slice(this.Offset, this.Offset + Length));
    this.Offset += Length;
    return ByteStreamHelper.Utf8ArrayToString(Bytes);
  }
  ReadVInt() {
    let Offset = this.Offset;
    this.BitOffset = 0;
    let Result = this.Payload[Offset] & 63;
    this.Offset += 1;
    if (this.Payload[Offset] & 64) {
      if (this.Payload[Offset] & 128) {
        Result |= (this.Payload[Offset + 1] & 127) << 6;
        this.Offset += 2;
        if (this.Payload[Offset + 1] & 128) {
          Result |= (this.Payload[Offset + 2] & 127) << 13;
          this.Offset += 3;
          if (this.Payload[Offset + 2] & 128) {
            Result |= (this.Payload[Offset + 3] & 127) << 20;
            this.Offset += 4;
            if (this.Payload[Offset + 3] & 128) {
              Result |= this.Payload[Offset + 4] << 27;
              this.Offset += 5;
              return Result | 2147483648;
            }
            return Result | 4160749568;
          }
          return Result | 4293918720;
        }
        return Result | 4294959104;
      }
      return this.Payload[Offset] | 4294967232;
    } else if (this.Payload[Offset] & 128) {
      Result |= (this.Payload[Offset + 1] & 127) << 6;
      this.Offset += 2;
      if (this.Payload[Offset + 1] & 128) {
        Result |= (this.Payload[Offset + 2] & 127) << 13;
        this.Offset += 3;
        if (this.Payload[Offset + 2] & 128) {
          Result |= (this.Payload[Offset + 3] & 127) << 20;
          this.Offset += 4;
          if (this.Payload[Offset + 3] & 128) {
            Result |= this.Payload[Offset + 4] << 27;
            this.Offset += 5;
          }
        }
      }
    }
    return Result;
  }
  ReadVlong() {
    let High = this.ReadVInt();
    let Low = this.ReadVInt();
    return Number(BigInt(High) << 32n | BigInt(Low & 4294967295));
  }
  ReadBoolean() {
    this.BitOffset = 0;
    return Boolean(this.Payload[this.Offset++]);
  }
  ReadDataReference() {
    let High = this.ReadVInt();
    if (High == 0)
      return 0;
    let Low = this.ReadVInt();
    return Number(BigInt(High) << 32n | BigInt(Low & 4294967295));
  }
  WriteByte(Value) {
    this.BitOffset = 0;
    this.Payload.push(Value & 255);
    this.Offset++;
  }
  WriteBytes(Value) {
    if (Value != null) {
      const length = Value.length;
      this.WriteInt(length);
      for (let i = 0; i < length; i++) {
        this.Payload.push(Value[i] & 255);
        this.Offset++;
      }
    } else {
      this.WriteInt(-1);
    }
  }
  WriteShort(Value) {
    this.BitOffset = 0;
    this.Payload.push(Value >> 8 & 255);
    this.Payload.push(Value & 255);
    this.Offset += 2;
  }
  WriteInt(Value) {
    this.BitOffset = 0;
    this.Payload.push(Value >> 24 & 255);
    this.Payload.push(Value >> 16 & 255);
    this.Payload.push(Value >> 8 & 255);
    this.Payload.push(Value & 255);
    this.Offset += 4;
  }
  WriteLong(High, Low) {
    this.BitOffset = 0;
    this.WriteInt(High);
    this.WriteInt(Low);
  }
  WriteString(Str) {
    this.BitOffset = 0;
    let Bytes = ByteStreamHelper.StringToUtf8Array(Str);
    this.WriteInt(Bytes.length);
    for (let i = 0; i < Bytes.length; i++)
      this.WriteByte(Bytes[i]);
  }
  WriteStringReference(Str) {
    this.BitOffset = 0;
    const Bytes = ByteStreamHelper.StringToUtf8Array(Str);
    const StrLength = Bytes.length;
    if (StrLength < 900001) {
      this.WriteInt(StrLength);
      for (let i = 0; i < StrLength; i++) {
        this.WriteByte(Bytes[i]);
      }
    } else {
      console.warn(`ByteStream::writeString invalid string length ${StrLength}`);
      this.WriteInt(-1);
    }
  }
  WriteVInt(Value) {
    this.BitOffset = 0;
    if (Value < 0) {
      if (Value >= -63) {
        this.Payload.push(Value & 63 | 64);
        this.Offset += 1;
      } else if (Value >= -8191) {
        this.Payload.push(Value & 63 | 192);
        this.Payload.push(Value >> 6 & 127);
        this.Offset += 2;
      } else if (Value >= -1048575) {
        this.Payload.push(Value & 63 | 192);
        this.Payload.push(Value >> 6 & 127 | 128);
        this.Payload.push(Value >> 13 & 127);
        this.Offset += 3;
      } else if (Value >= -134217727) {
        this.Payload.push(Value & 63 | 192);
        this.Payload.push(Value >> 6 & 127 | 128);
        this.Payload.push(Value >> 13 & 127 | 128);
        this.Payload.push(Value >> 20 & 127);
        this.Offset += 4;
      } else {
        this.Payload.push(Value & 63 | 192);
        this.Payload.push(Value >> 6 & 127 | 128);
        this.Payload.push(Value >> 13 & 127 | 128);
        this.Payload.push(Value >> 20 & 127 | 128);
        this.Payload.push(Value >> 27 & 15);
        this.Offset += 5;
      }
    } else {
      if (Value <= 63) {
        this.Payload.push(Value & 63);
        this.Offset += 1;
      } else if (Value <= 8191) {
        this.Payload.push(Value & 63 | 128);
        this.Payload.push(Value >> 6 & 127);
        this.Offset += 2;
      } else if (Value <= 1048575) {
        this.Payload.push(Value & 63 | 128);
        this.Payload.push(Value >> 6 & 127 | 128);
        this.Payload.push(Value >> 13 & 127);
        this.Offset += 3;
      } else if (Value <= 134217727) {
        this.Payload.push(Value & 63 | 128);
        this.Payload.push(Value >> 6 & 127 | 128);
        this.Payload.push(Value >> 13 & 127 | 128);
        this.Payload.push(Value >> 20 & 127);
        this.Offset += 4;
      } else {
        this.Payload.push(Value & 63 | 128);
        this.Payload.push(Value >> 6 & 127 | 128);
        this.Payload.push(Value >> 13 & 127 | 128);
        this.Payload.push(Value >> 20 & 127 | 128);
        this.Payload.push(Value >> 27 & 15);
        this.Offset += 5;
      }
    }
  }
  WriteVLong(High, Low) {
    this.BitOffset = 0;
    this.WriteVInt(High);
    this.WriteVInt(Low);
  }
  WriteBoolean(Value) {
    if (this.BitOffset == 0) {
      this.Payload.push(0);
      this.Offset++;
    }
    if (Value) {
      this.Payload[this.Offset - 1] |= 1 << (this.BitOffset & 7);
    }
    this.BitOffset = this.BitOffset + 1 & 7;
    return Value;
  }
  WriteDataReference(High, Low = -1) {
    this.BitOffset = 0;
    this.WriteVInt(High);
    if (High != 0)
      this.WriteVInt(Low);
  }
  WriteHexa(data) {
    this.BitOffset = 0;
    for (let i = 0; i < data.length; i += 2) {
      const byteString = data.substring(i, i + 2);
      this.Payload.push(parseInt(byteString, 16));
    }
    this.Offset += data.length / 2;
  }
};
var ByteStream_default = ByteStream;

// agent/Packets/Server/LoginOkMessage.ts
var LoginOkMessage = class {
  static Encode() {
    let stream = new ByteStream_default([]);
    stream.WriteLong(0, 0);
    stream.WriteLong(0, 0);
    stream.WriteString("");
    stream.WriteString("");
    stream.WriteString("");
    stream.WriteInt(63);
    stream.WriteInt(1);
    stream.WriteInt(342);
    stream.WriteString("dev");
    stream.WriteInt(0);
    stream.WriteInt(0);
    stream.WriteInt(0);
    stream.WriteString("");
    stream.WriteString("");
    stream.WriteString("");
    stream.WriteInt(0);
    stream.WriteString("");
    stream.WriteString("EN");
    stream.WriteString("");
    stream.WriteInt(0);
    stream.WriteString("");
    stream.WriteInt(2);
    stream.WriteString("https://game-assets.brawlstarsgame.com");
    stream.WriteString("http://a678dbc1c015a893c9fd-4e8cc3b1ad3a3c940c504815caefa967.r87.cf2.rackcdn.com");
    stream.WriteInt(3);
    stream.WriteString("https://event-assets.brawlstars.com");
    stream.WriteString("https://event-assets-2.brawlstars.com");
    stream.WriteString("https://24b999e6da07674e22b0-8209975788a0f2469e68e84405ae4fcf.ssl.cf2.rackcdn.com/event-assets");
    stream.WriteVInt(0);
    stream.WriteInt(0);
    stream.WriteBoolean(true);
    stream.WriteBoolean(false);
    stream.WriteString("");
    stream.WriteString("");
    stream.WriteString("");
    stream.WriteString("https://play.google.com/store/apps/details?id=com.supercell.brawlstars");
    stream.WriteString("");
    stream.WriteBoolean(false);
    if (stream.WriteBoolean(false)) {
      stream.WriteString("");
    }
    if (stream.WriteBoolean(false)) {
      stream.WriteString("");
    }
    if (stream.WriteBoolean(false)) {
      stream.WriteString("");
    }
    if (stream.WriteBoolean(false)) {
      stream.WriteString("");
    }
    return stream.Payload;
  }
  static GetMessageType() {
    return 20104;
  }
};
var LoginOkMessage_default = LoginOkMessage;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicConfData/Arrays/ChronosAssetListEvent.ts
var ChronosFileEntry = class {
  static Encode(stream) {
    stream.WriteString("4db05b9a886581e81fb981a8e68482a9e521cb36");
    stream.WriteString("daaa0d43-d80a-47a0-9842-581fc84f1585_8c904385_20ce_4435_b84c_0b1eb9d33d6d_collab_subway_surfers__1_.sc");
  }
};
var ChronosAssetEntry = class {
  static Encode(stream) {
    if (stream.WriteBoolean(true)) {
      ChronosFileEntry.Encode(stream);
    }
    stream.WriteDataReference(83, 6);
  }
};
var ChronosAssetListEvent = class {
  static Encode(stream) {
    stream.WriteVInt(1);
    {
      if (stream.WriteBoolean(true)) {
        ChronosAssetEntry.Encode(stream);
      }
    }
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
  }
};
var ChronosAssetListEvent_default = ChronosAssetListEvent;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicConfData/Arrays/IntValueEntry.ts
var IntValueEntry = class _IntValueEntry {
  static ThemesID = [143, 144, 145, 146, 147, 148, 149, 150, 151];
  /* IntValueEntry Values:
      getTrophySeasonResetTrophyLimit = 10063LL
      getChallengeLivesPurchasesRemaining = 10039LL
      getPremiumPassMissingBonusProgressFromWins = 10066LL
      getPremiumPassExtraProgress = 10069LL
      getPointsPerWinForPoors = 10065LL
      getPointsPerWinForRichs = 10066LL
      getPassPointsFromWinsLimitForPoors = 10067LL
      getPassPointsFromWinsLimitForRichs = 10068LL
      getProgressTowardsNextTailReward = 152LL
      getMadePlayerDraftMapsCount = 10029LL
      isPlayerEligibleToCreateMap = 10027LL
      LogicRandomRewardManager::isUnlocked = 10057LL
      LogicRandomRewardManager::isEnabled = 10056LL
      getHeroReleaseState = 68LL
      getTrophiesToUnlockTrophyLimitedEventSlot = 10036LL, 10037LL, 10049LL
      isEventSlotLocked = 10018LL, 10043LL
      LogicPurchaseFameCommand::execute = 10055LL
      LogicPurchaseChallengeLivesCommand = 10039LL
      getExtraProgress = 148LL
      TID_COMPETITIVE_PASS_TAIL_INFO_NEW = 152LL
      getKeepDailyStreakCostInGems = 163LL
  */
  static Encode(stream) {
    stream.WriteVInt(8);
    stream.WriteDataReference(41e6 + _IntValueEntry.ThemesID[Math.floor(Math.random() * _IntValueEntry.ThemesID.length)], 1);
    stream.WriteDataReference(89, 6);
    stream.WriteDataReference(22, 0);
    stream.WriteDataReference(36, 1);
    stream.WriteDataReference(73, 1);
    stream.WriteDataReference(16, 5);
    stream.WriteDataReference(10056, 1);
    stream.WriteDataReference(10057, 1);
  }
};
var IntValueEntry_default = IntValueEntry;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicConfData/Arrays/EventData.ts
var EventData = class _EventData {
  static EventCount = 18;
  static EncodeEvents(stream) {
    _EventData.EncodeAll(stream);
  }
  static EncodeFirst(stream) {
    stream.WriteVInt(2961567073);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(74455);
    stream.WriteVInt(-1);
    stream.WriteDataReference(15, 8);
    stream.WriteVInt(-1);
    stream.WriteVInt(2);
    stream.WriteString("Kys");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(true);
    {
      stream.WriteString("Kill yourself, thanks");
      stream.WriteVInt(0);
    }
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
  }
  static EncodeCollab(stream) {
    stream.WriteVInt(360000017);
    stream.WriteVInt(36);
    stream.WriteVInt(0);
    stream.WriteVInt(2469280);
    stream.WriteVInt(2469280);
    stream.WriteVInt(0);
    stream.WriteDataReference(15, 117);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(true);
    {
      stream.WriteString("Kill yourself, thanks");
      stream.WriteVInt(0);
    }
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(-1);
    stream.WriteBoolean(true);
    {
      stream.WriteString("4db05b9a886581e81fb981a8e68482a9e521cb36");
      stream.WriteString("daaa0d43-d80a-47a0-9842-581fc84f1585_8c904385_20ce_4435_b84c_0b1eb9d33d6d_collab_subway_surfers__1_.sc");
    }
    stream.WriteBoolean(false);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(true);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(-1);
    stream.WriteVInt(150);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(2);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(4);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(6);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(8);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(150);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(10);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(12);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(14);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(16);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(18);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(20);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(22);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(25);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(28);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(31);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(34);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(37);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(40);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(43);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(46);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(49);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(52);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(55);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(1e3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(58);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(62);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(64);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(67);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(69);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(25);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(73);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(10);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(76);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(79);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(82);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(86);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(90);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(49);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000004);
    stream.WriteVInt(94);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(150);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(98);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(102);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(106);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(110);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(115);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(120);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(125);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(130);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(135);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(140);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(145);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(150);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(155);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(160);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(165);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(170);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(175);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(180);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(185);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(190);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(195);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(200);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(205);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(210);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(215);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(25);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(220);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(225);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(230);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(235);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(240);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(245);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(250);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(255);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(260);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(265);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(270);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(275);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(280);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(285);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(290);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(295);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(300);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(305);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(310);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(1e3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(315);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(320);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(325);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(330);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(335);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(4);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(1277);
    stream.WriteVInt(340);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(345);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(350);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(355);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(360);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(365);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(370);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(375);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(380);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(385);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(390);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(395);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(400);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(405);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(410);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(415);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(420);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(425);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(430);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(435);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(440);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(445);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(450);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(455);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(460);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(465);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(470);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(475);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(480);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(485);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(490);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(495);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(500);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(505);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(510);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(515);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(520);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(525);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(530);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(535);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(25);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(540);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(545);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(555);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(565);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(575);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(585);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(595);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(605);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(615);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(625);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(635);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(645);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(655);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(665);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(675);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(685);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(695);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(705);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(715);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(725);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(735);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(745);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(755);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(765);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(775);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(785);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(795);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(10);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(10);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
  }
  static EncodeAll(stream) {
    stream.WriteVInt(10244376);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(-3188);
    stream.WriteVInt(4012);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(9);
    stream.WriteVInt(0);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(20244376);
    stream.WriteVInt(2);
    stream.WriteVInt(0);
    stream.WriteVInt(-2588);
    stream.WriteVInt(4612);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(944);
    stream.WriteVInt(6);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(30244376);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(-1988);
    stream.WriteVInt(5212);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(884);
    stream.WriteVInt(5);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(40244376);
    stream.WriteVInt(4);
    stream.WriteVInt(0);
    stream.WriteVInt(-1388);
    stream.WriteVInt(5812);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(581);
    stream.WriteVInt(20);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(50244376);
    stream.WriteVInt(5);
    stream.WriteVInt(0);
    stream.WriteVInt(-2588);
    stream.WriteVInt(4612);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(945);
    stream.WriteVInt(9);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(60244376);
    stream.WriteVInt(6);
    stream.WriteVInt(0);
    stream.WriteVInt(-788);
    stream.WriteVInt(6412);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(217);
    stream.WriteVInt(2);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(70122188);
    stream.WriteVInt(7);
    stream.WriteVInt(0);
    stream.WriteVInt(-188);
    stream.WriteVInt(14212);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(57);
    stream.WriteVInt(10);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(80244375);
    stream.WriteVInt(8);
    stream.WriteVInt(0);
    stream.WriteVInt(-6788);
    stream.WriteVInt(412);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(462);
    stream.WriteVInt(24);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(90000021);
    stream.WriteVInt(9);
    stream.WriteVInt(0);
    stream.WriteVInt(-157988);
    stream.WriteVInt(2390812);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(327);
    stream.WriteVInt(0);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(1);
    stream.WriteVInt(46);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(true);
    stream.WriteBoolean(true);
    stream.WriteVInt(0);
    stream.WriteVInt(109);
    stream.WriteVInt(6);
    stream.WriteVInt(10);
    stream.WriteVInt(79615);
    stream.WriteVInt(0);
    stream.WriteVInt(3);
    stream.WriteVInt(15000405);
    stream.WriteVInt(15001023);
    stream.WriteVInt(15000548);
    stream.WriteVInt(7200);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(100244375);
    stream.WriteVInt(10);
    stream.WriteVInt(0);
    stream.WriteVInt(-6188);
    stream.WriteVInt(1012);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(1050);
    stream.WriteVInt(31);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(120244376);
    stream.WriteVInt(12);
    stream.WriteVInt(0);
    stream.WriteVInt(-3188);
    stream.WriteVInt(4012);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(37);
    stream.WriteVInt(14);
    stream.WriteVInt(0);
    stream.WriteVInt(-1324388);
    stream.WriteVInt(1008412);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(true);
    stream.WriteVInt(37);
    stream.WriteVInt(1758186e3);
    stream.WriteVInt(1760518800);
    stream.WriteVInt(2);
    stream.WriteVInt(0);
    stream.WriteVInt(8);
    stream.WriteVInt(16);
    stream.WriteVInt(15e3);
    stream.WriteVInt(17);
    stream.WriteVInt(2e4);
    stream.WriteVInt(18);
    stream.WriteVInt(25e3);
    stream.WriteVInt(19);
    stream.WriteVInt(3e4);
    stream.WriteVInt(4);
    stream.WriteVInt(3e3);
    stream.WriteVInt(7);
    stream.WriteVInt(6e3);
    stream.WriteVInt(10);
    stream.WriteVInt(9e3);
    stream.WriteVInt(13);
    stream.WriteVInt(12e3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(26);
    stream.WriteVInt(15);
    stream.WriteVInt(132);
    stream.WriteVInt(15);
    stream.WriteVInt(118);
    stream.WriteVInt(15);
    stream.WriteVInt(50);
    stream.WriteVInt(15);
    stream.WriteVInt(25);
    stream.WriteVInt(15);
    stream.WriteVInt(7);
    stream.WriteVInt(15);
    stream.WriteVInt(115);
    stream.WriteVInt(15);
    stream.WriteVInt(11);
    stream.WriteVInt(15);
    stream.WriteVInt(10);
    stream.WriteVInt(15);
    stream.WriteVInt(18);
    stream.WriteVInt(15);
    stream.WriteVInt(53);
    stream.WriteVInt(15);
    stream.WriteVInt(19);
    stream.WriteVInt(15);
    stream.WriteVInt(72);
    stream.WriteVInt(15);
    stream.WriteVInt(368);
    stream.WriteVInt(15);
    stream.WriteVInt(548);
    stream.WriteVInt(15);
    stream.WriteVInt(440);
    stream.WriteVInt(15);
    stream.WriteVInt(703);
    stream.WriteVInt(15);
    stream.WriteVInt(22);
    stream.WriteVInt(15);
    stream.WriteVInt(82);
    stream.WriteVInt(15);
    stream.WriteVInt(83);
    stream.WriteVInt(15);
    stream.WriteVInt(5);
    stream.WriteVInt(15);
    stream.WriteVInt(617);
    stream.WriteVInt(15);
    stream.WriteVInt(81);
    stream.WriteVInt(15);
    stream.WriteVInt(306);
    stream.WriteVInt(15);
    stream.WriteVInt(292);
    stream.WriteVInt(15);
    stream.WriteVInt(293);
    stream.WriteVInt(15);
    stream.WriteVInt(300);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(180244376);
    stream.WriteVInt(18);
    stream.WriteVInt(0);
    stream.WriteVInt(-3188);
    stream.WriteVInt(4012);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(360000017);
    stream.WriteVInt(36);
    stream.WriteVInt(0);
    stream.WriteVInt(2469280);
    stream.WriteVInt(2469280);
    stream.WriteVInt(0);
    stream.WriteDataReference(15, 117);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(true);
    {
      stream.WriteString("Kill yourself, thanks");
      stream.WriteVInt(0);
    }
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(-1);
    stream.WriteBoolean(true);
    {
      stream.WriteString("4db05b9a886581e81fb981a8e68482a9e521cb36");
      stream.WriteString("daaa0d43-d80a-47a0-9842-581fc84f1585_8c904385_20ce_4435_b84c_0b1eb9d33d6d_collab_subway_surfers__1_.sc");
    }
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(true);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(-1);
    stream.WriteVInt(150);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(2);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(4);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(6);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(8);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(150);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(10);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(12);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(14);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(16);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(18);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(20);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(22);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(25);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(28);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(31);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(34);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(37);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(40);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(43);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(46);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(49);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(52);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(55);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(1e3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(58);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(62);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(64);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(67);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(69);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(25);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(73);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(10);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(76);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(79);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(82);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(86);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(90);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(49);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000004);
    stream.WriteVInt(94);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(150);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(98);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(102);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(106);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(110);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(115);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(120);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(125);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(130);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(135);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(140);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(145);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(150);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(155);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(160);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(165);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(170);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(175);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(180);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(185);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(190);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(195);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(200);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(205);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(210);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(215);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(25);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(220);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(225);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(230);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(235);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(240);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(245);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(250);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(255);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(260);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(265);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(270);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(275);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(280);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(285);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(290);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(295);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(300);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(305);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(310);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(1e3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(315);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(320);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(325);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(330);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(335);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(4);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(1277);
    stream.WriteVInt(340);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(345);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(350);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(355);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(360);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(365);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(370);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(375);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(380);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(385);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(390);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(395);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(400);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(405);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(410);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(415);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(420);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(425);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(430);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(435);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(440);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(445);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(450);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(455);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(460);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(465);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(470);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(475);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(480);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(485);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(490);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(495);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(500);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(505);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(510);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(515);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(520);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(525);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(530);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(535);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(25);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(540);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(545);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(555);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(565);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(575);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(585);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(595);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(73);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(80000031);
    stream.WriteVInt(605);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(615);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(625);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(16);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(635);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(645);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(655);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(665);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(675);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(685);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(100);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(695);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(75);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(705);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(715);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(45);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(725);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(735);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(745);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(500);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(755);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(765);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(41);
    stream.WriteVInt(200);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(775);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(38);
    stream.WriteVInt(30);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(785);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(50);
    stream.WriteVInt(1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(795);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(10);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(-1);
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    stream.WriteVInt(50);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(10);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(390244376);
    stream.WriteVInt(39);
    stream.WriteVInt(0);
    stream.WriteVInt(-2588);
    stream.WriteVInt(4612);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(946);
    stream.WriteVInt(38);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(410244376);
    stream.WriteVInt(41);
    stream.WriteVInt(0);
    stream.WriteVInt(-1988);
    stream.WriteVInt(5212);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(996);
    stream.WriteVInt(48);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(420879752);
    stream.WriteVInt(42);
    stream.WriteVInt(0);
    stream.WriteVInt(-988);
    stream.WriteVInt(1012);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(386);
    stream.WriteVInt(22);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(430879752);
    stream.WriteVInt(43);
    stream.WriteVInt(0);
    stream.WriteVInt(-1588);
    stream.WriteVInt(412);
    stream.WriteVInt(0);
    stream.WriteVInt(15);
    stream.WriteVInt(177);
    stream.WriteVInt(15);
    stream.WriteVInt(2);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(1);
    stream.WriteVInt(46);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(-1);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
  }
};
var EventData_default = EventData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicConfData/Arrays/ReleaseEntry.ts
var ReleaseEntry = class {
  static Encode(stream, CSVId, CSVRow, Time, SecondTime, ThirdTime, IsNew) {
    stream.WriteDataReference(CSVId, CSVRow);
    stream.WriteInt(Time);
    stream.WriteInt(SecondTime);
    stream.WriteInt(ThirdTime);
    stream.WriteBoolean(IsNew);
  }
};
var ReleaseEntry_default = ReleaseEntry;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicConfData/Arrays/TimedIntValueEntry.ts
var TimedIntValueEntry = class {
  static Encode(stream, a1, a2, a3, a4) {
    stream.WriteVInt(a1);
    stream.WriteVInt(a2);
    stream.WriteVInt(a3);
    stream.WriteVInt(a4);
  }
};
var TimedIntValueEntry_default = TimedIntValueEntry;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicConfData/LogicConfData.ts
var LogicConfData = class _LogicConfData {
  static Encode(stream) {
    stream.WriteVInt(2025074);
    stream.WriteVInt(52);
    for (let EventID = 0; EventID < 52; EventID++) {
      stream.WriteVInt(EventID);
    }
    stream.WriteVInt(EventData_default.EventCount);
    {
      EventData_default.EncodeEvents(stream);
    }
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    _LogicConfData.EncodeIntList(stream, [0]);
    _LogicConfData.EncodeIntList(stream, [0]);
    _LogicConfData.EncodeIntList(stream, [0]);
    stream.WriteVInt(1);
    {
      ReleaseEntry_default.Encode(stream, 0, 0, 0, 0, 0, false);
    }
    IntValueEntry_default.Encode(stream);
    stream.WriteVInt(1);
    {
      TimedIntValueEntry_default.Encode(stream, 0, 0, 0, 0);
    }
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(1);
    {
      ChronosAssetListEvent_default.Encode(stream);
    }
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    _LogicConfData.EncodeIntList(stream, [0]);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
  }
  static EncodeIntList(stream, IntList) {
    stream.WriteVInt(IntList[0]);
  }
};
var LogicConfData_default = LogicConfData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/ForcedDrops.ts
var ForcedDrops = class {
  static Encode(stream) {
    stream.WriteVInt(200);
    stream.WriteVInt(200);
    stream.WriteVInt(5);
    {
      stream.WriteVInt(93);
      stream.WriteVInt(206);
      stream.WriteVInt(456);
      stream.WriteVInt(1001);
      stream.WriteVInt(2264);
    }
  }
};
var ForcedDrops_default = ForcedDrops;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/IntValueEntry.ts
var IntValueEntry2 = class {
  static Encode(stream) {
    stream.WriteVInt(18);
    stream.WriteDataReference(2, 1);
    stream.WriteDataReference(6, 0);
    stream.WriteDataReference(7, 0);
    stream.WriteDataReference(9, 1);
    stream.WriteDataReference(10, 0);
    stream.WriteDataReference(12, 1);
    stream.WriteDataReference(14, 0);
    stream.WriteDataReference(15, 1);
    stream.WriteDataReference(16, 1);
    stream.WriteDataReference(17, 0);
    stream.WriteDataReference(18, 1);
    stream.WriteDataReference(19, 0);
    stream.WriteDataReference(21, 1);
    stream.WriteDataReference(22, 1);
    stream.WriteDataReference(23, 0);
    stream.WriteDataReference(24, 1);
    stream.WriteDataReference(41, 100);
    stream.WriteDataReference(52, 1);
  }
};
var IntValueEntry_default2 = IntValueEntry2;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/LogicOfferBundle.ts
var LogicOfferBundle = class {
  static Encode(stream) {
    stream.WriteVInt(0);
  }
};
var LogicOfferBundle_default = LogicOfferBundle;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/LogicQuests.ts
var LogicQuests = class {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteVInt(1e4);
    stream.WriteVInt(3);
    stream.WriteVInt(0);
  }
};
var LogicQuests_default = LogicQuests;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/BrawlPassSeasonData.ts
var BrawlPassSeasonData = class {
  static Encode(stream) {
    stream.WriteVInt(1);
    {
      stream.WriteVInt(43 - 1);
      stream.WriteVInt(1e4);
      stream.WriteBoolean(true);
      stream.WriteVInt(0);
      stream.WriteBoolean(false);
      stream.WriteBoolean(true);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteBoolean(true);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteBoolean(true);
      stream.WriteBoolean(true);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
    }
  }
};
var BrawlPassSeasonData_default = BrawlPassSeasonData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/CooldownEntry.ts
var CooldownEntry = class {
  static Encode(stream) {
    stream.WriteVInt(0);
  }
};
var CooldownEntry_default = CooldownEntry;

// agent/Configuration/LogicPlayerData.ts
var LogicPlayerData = class {
  static OwnedBrawlers = {
    0: { CardID: 0, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    1: { CardID: 4, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    2: { CardID: 8, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    3: { CardID: 12, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    4: { CardID: 16, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    5: { CardID: 20, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    6: { CardID: 24, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    7: { CardID: 28, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    8: { CardID: 32, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    9: { CardID: 36, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    10: { CardID: 40, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    11: { CardID: 44, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    12: { CardID: 48, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    13: { CardID: 52, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    14: { CardID: 56, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    15: { CardID: 60, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    16: { CardID: 64, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    17: { CardID: 68, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    18: { CardID: 72, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    19: { CardID: 95, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    20: { CardID: 100, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    21: { CardID: 105, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    22: { CardID: 110, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    23: { CardID: 115, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    24: { CardID: 120, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    25: { CardID: 125, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    26: { CardID: 130, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    27: { CardID: 177, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    28: { CardID: 182, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    29: { CardID: 188, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    30: { CardID: 194, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    31: { CardID: 200, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    32: { CardID: 206, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    34: { CardID: 218, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    35: { CardID: 224, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    36: { CardID: 230, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    37: { CardID: 236, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    38: { CardID: 279, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    39: { CardID: 296, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    40: { CardID: 303, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    41: { CardID: 320, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    42: { CardID: 327, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    43: { CardID: 334, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    44: { CardID: 341, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    45: { CardID: 358, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    46: { CardID: 365, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    47: { CardID: 372, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    48: { CardID: 379, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    49: { CardID: 386, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    50: { CardID: 393, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    51: { CardID: 410, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    52: { CardID: 417, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    53: { CardID: 427, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    54: { CardID: 434, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    56: { CardID: 448, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    57: { CardID: 466, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    58: { CardID: 474, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    59: { CardID: 491, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    60: { CardID: 499, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    61: { CardID: 507, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    62: { CardID: 515, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    63: { CardID: 523, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    64: { CardID: 531, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    65: { CardID: 539, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    66: { CardID: 547, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    67: { CardID: 557, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    68: { CardID: 565, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    69: { CardID: 573, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    70: { CardID: 581, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    71: { CardID: 589, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    72: { CardID: 597, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    73: { CardID: 605, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    74: { CardID: 619, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    75: { CardID: 633, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    76: { CardID: 642, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    77: { CardID: 655, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    78: { CardID: 663, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    79: { CardID: 671, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    80: { CardID: 730, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    81: { CardID: 748, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    82: { CardID: 760, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    83: { CardID: 768, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    84: { CardID: 800, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    85: { CardID: 811, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    86: { CardID: 828, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    87: { CardID: 844, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    88: { CardID: 862, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    89: { CardID: 871, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    90: { CardID: 879, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    91: { CardID: 901, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    92: { CardID: 911, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    93: { CardID: 925, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    94: { CardID: 934, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    95: { CardID: 985, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    96: { CardID: 994, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    97: { CardID: 1035, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 },
    98: { CardID: 1043, Trophies: 0, HighestTrophies: 0, PowerLevel: 11, MasteryPoints: 24800, MasteryClaimed: 0, PowerPoints: 0, State: 2 }
  };
  static Currencys;
  static MiscData = {
    Trophies: 1e5,
    HighestTrophies: 1e5,
    TrophyRoadTier: 999,
    ExperienceLevel: 999,
    Thumbnail: 0,
    NameColor: 6,
    TokenDoubler: 1e5,
    CreatorCode: "@soufgamev2",
    Region: "EN"
  };
};
var LogicPlayerData_default = LogicPlayerData;

// agent/Packets/Server/Battles/LogicPlayer.ts
var LogicPlayer = class {
  static HasUlti = true;
  static HasBonusSkill = false;
  static IsSpectator = 0;
  static ControlMode = 2;
  static Encode(Stream2) {
    Stream2.WriteLong(0, 254842734);
    Stream2.WriteBoolean(true);
    {
      {
        Stream2.WriteString("@soufgamev2");
        Stream2.WriteVInt(100);
        Stream2.WriteVInt(28000058);
        Stream2.WriteVInt(43000006);
        Stream2.WriteVInt(43000006);
      }
      Stream2.WriteVInt(0);
      Stream2.WriteDataReference(100, 1);
      Stream2.WriteDataReference(28, -1);
      Stream2.WriteDataReference(28, -1);
      Stream2.WriteDataReference(52, -1);
      Stream2.WriteDataReference(76, -1);
      Stream2.WriteDataReference(0, 0);
    }
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteInt(1e6);
    Stream2.WriteByte(1);
    {
      Stream2.WriteDataReference(16, 1);
      Stream2.WriteBoolean(true);
      {
        Stream2.WriteVInt(11);
        {
          Stream2.WriteDataReference(0, 0);
          Stream2.WriteDataReference(0, 0);
          Stream2.WriteDataReference(0, 0);
          Stream2.WriteDataReference(0, 0);
          Stream2.WriteDataReference(0, 0);
          Stream2.WriteDataReference(0, 0);
          Stream2.WriteDataReference(0, 0);
        }
        Stream2.WriteVInt(0);
        Stream2.WriteVInt(0);
        Stream2.WriteDataReference(0, 0);
      }
      Stream2.WriteBoolean(true);
      {
        Stream2.WriteVInt(5);
        {
          Stream2.WriteDataReference(52, 210);
          Stream2.WriteDataReference(52, 154);
          Stream2.WriteDataReference(52, 152);
          Stream2.WriteDataReference(52, 175);
          Stream2.WriteDataReference(52, 687);
        }
        Stream2.WriteVInt(0);
      }
      Stream2.WriteBoolean(true);
      {
        Stream2.WriteVInt(5);
        {
          Stream2.WriteDataReference(68, 53);
          Stream2.WriteDataReference(68, 15);
          Stream2.WriteDataReference(68, 50);
          Stream2.WriteDataReference(68, 163);
          Stream2.WriteDataReference(68, 51);
        }
      }
      Stream2.WriteDataReference(29, 0);
      Stream2.WriteDataReference(0, 0);
      Stream2.WriteDataReference(0, 0);
    }
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteByte(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
  }
  static GetBonusSkillCooldown() {
    return 1e3;
  }
};
var LogicPlayer_default = LogicPlayer;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/CompetitivePassSeasonData.ts
var CompetitivePassSeasonData = class {
  static Encode(stream) {
    stream.WriteVInt(1);
    {
      stream.WriteBoolean(true);
      stream.WriteVInt(1e5);
      stream.WriteVInt(2);
      stream.WriteVInt(0);
      stream.WriteBoolean(true);
      stream.WriteVInt(1e8);
      stream.WriteBoolean(true);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteBoolean(true);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
      stream.WriteInt(0);
    }
  }
};
var CompetitivePassSeasonData_default = CompetitivePassSeasonData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/LogicPlayerRankedSeasonData.ts
var LogicPlayerRankedSeasonData = class {
  static Encode(stream) {
    stream.WriteVInt(22);
    stream.WriteVInt(13e3);
    stream.WriteVInt(22);
    stream.WriteVInt(13e3);
    stream.WriteVInt(22);
    stream.WriteVInt(13e3);
    stream.WriteVInt(22);
    stream.WriteVInt(13e3);
    stream.WriteVInt(22);
    stream.WriteVInt(13e3);
    stream.WriteVInt(22);
    stream.WriteVInt(13e3);
    stream.WriteVInt(22);
    stream.WriteVInt(0);
  }
};
var LogicPlayerRankedSeasonData_default = LogicPlayerRankedSeasonData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/Arrays/EsportsButtonStateData.ts
var EsportsButtonStateData = class {
  static Encode(stream) {
    stream.WriteVInt(22);
    stream.WriteVInt(22);
    stream.WriteVInt(22);
  }
};
var EsportsButtonStateData_default = EsportsButtonStateData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicDailyData/LogicDailyData.ts
var LogicDailyData = class {
  static Encode(stream) {
    stream.WriteVInt(2025257);
    stream.WriteVInt(40312);
    stream.WriteVInt(LogicPlayerData_default.MiscData.Trophies);
    stream.WriteVInt(LogicPlayerData_default.MiscData.HighestTrophies);
    stream.WriteVInt(LogicPlayerData_default.MiscData.HighestTrophies);
    stream.WriteVInt(LogicPlayerData_default.MiscData.TrophyRoadTier);
    stream.WriteVInt(LogicPlayerData_default.MiscData.ExperienceLevel);
    stream.WriteDataReference(28, LogicPlayerData_default.MiscData.Thumbnail);
    stream.WriteDataReference(43, LogicPlayerData_default.MiscData.NameColor);
    stream.WriteVInt(26);
    for (let x = 0; x < 26; x++) {
      stream.WriteVInt(x);
    }
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(1340);
    for (let x = 0; x < 1340; x++) {
      stream.WriteDataReference(29, x);
    }
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(LogicPlayerData_default.MiscData.HighestTrophies);
    stream.WriteVInt(1337);
    stream.WriteVInt(LogicPlayer_default.ControlMode);
    stream.WriteBoolean(true);
    stream.WriteVInt(LogicPlayerData_default.MiscData.TokenDoubler);
    stream.WriteVInt(144);
    stream.WriteVInt(1509112);
    stream.WriteVInt(144);
    stream.WriteVInt(1509112);
    ForcedDrops_default.Encode(stream);
    stream.WriteBoolean(true);
    stream.WriteVInt(2);
    stream.WriteVInt(2);
    stream.WriteVInt(2);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    LogicOfferBundle_default.Encode(stream);
    stream.WriteVInt(400);
    stream.WriteVInt(500);
    stream.WriteVInt(-1);
    stream.WriteVInt(1);
    stream.WriteVInt(30);
    stream.WriteByte(1);
    stream.WriteDataReference(16, 1);
    stream.WriteString(LogicPlayerData_default.MiscData.Region);
    stream.WriteString(LogicPlayerData_default.MiscData.CreatorCode);
    IntValueEntry_default2.Encode(stream);
    CooldownEntry_default.Encode(stream);
    BrawlPassSeasonData_default.Encode(stream);
    if (stream.WriteBoolean(true)) {
      LogicQuests_default.Encode(stream);
    }
    stream.WriteBoolean(true);
    stream.WriteVInt(0);
    if (stream.WriteBoolean(true)) {
      LogicPlayerRankedSeasonData_default.Encode(stream);
    }
    stream.WriteInt(0);
    stream.WriteVInt(1337);
    stream.WriteDataReference(16, 1);
    stream.WriteBoolean(false);
    stream.WriteVInt(-1);
    stream.WriteVInt(1337);
    stream.WriteVInt(832099);
    stream.WriteVInt(1616899);
    stream.WriteVInt(10659101);
    stream.WriteVInt(0);
    CompetitivePassSeasonData_default.Encode(stream);
    stream.WriteVInt(6);
    {
      stream.WriteDataReference(2, 446);
      stream.WriteDataReference(2, 448);
      stream.WriteDataReference(2, 450);
      stream.WriteDataReference(2, 452);
      stream.WriteDataReference(2, 454);
      stream.WriteDataReference(2, 456);
    }
    stream.WriteDataReference(2, 462);
    stream.WriteDataReference(2, 460);
    stream.WriteDataReference(2, 464);
    stream.WriteDataReference(2, 466);
    if (stream.WriteBoolean(true)) {
      EsportsButtonStateData_default.Encode(stream);
    }
    stream.WriteDataReference(2, 473);
    stream.WriteVInt(1337);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
  }
};
var LogicDailyData_default = LogicDailyData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicRandomRewardManager.ts
var LogicRandomRewardManager = class {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteInt(-1435281534);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(86400 * 24);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
  }
};
var LogicRandomRewardManager_default = LogicRandomRewardManager;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicBattleIntro.ts
var LogicBattleIntro = class {
  static Encode(stream) {
    stream.WriteDataReference(100, 1);
    stream.WriteDataReference(28, -1);
    stream.WriteDataReference(28, -1);
    stream.WriteDataReference(52, -1);
    stream.WriteDataReference(76, -1);
    stream.WriteDataReference(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
  }
};
var LogicBattleIntro_default = LogicBattleIntro;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicMastery.ts
var LogicMastery = class {
  static Encode(stream) {
    stream.WriteVInt(0);
  }
};
var LogicMastery_default = LogicMastery;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicHeroGears.ts
var LogicHeroGears = class {
  static Encode(stream) {
    stream.WriteVInt(0);
  }
};
var LogicHeroGears_default = LogicHeroGears;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicBrawlerRecruitRoad.ts
var LogicBrawlerRecruitRoad = class {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
  }
};
var LogicBrawlerRecruitRoad_default = LogicBrawlerRecruitRoad;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicGemOffer.ts
var LogicGemOffer = class {
  static Encode(stream, a1, a2, a3, a4, a5) {
    stream.WriteVInt(a1);
    stream.WriteVInt(a2);
    stream.WriteDataReference(a3, a4);
    stream.WriteVInt(a5);
  }
};
var LogicGemOffer_default = LogicGemOffer;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicLoginCalendar.ts
var LogicLoginCalendar = class {
  static Encode(stream) {
    LogicLoginCalendarTrack.Encode(stream);
    stream.WriteVInt(3);
    {
      LogicLoginCalendarTrack.Encode(stream);
      LogicLoginCalendarTrack.Encode(stream);
      LogicLoginCalendarTrack.Encode(stream);
    }
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
    stream.WriteVInt(0);
  }
};
var LogicLoginCalendarTrack = class {
  static Encode(stream) {
    stream.WriteVInt(1);
    stream.WriteVInt(1);
    {
      LogicLoginCalendarDay.Encode(stream);
    }
  }
};
var LogicLoginCalendarDay = class {
  static Encode(stream) {
    stream.WriteVInt(1);
    stream.WriteBoolean(true);
    stream.WriteVInt(1);
    {
      LogicLoginCalendarRewardOption.Encode(stream);
    }
  }
};
var LogicLoginCalendarRewardOption = class {
  static Encode(stream) {
    LogicGemOffer_default.Encode(stream, 3, 1, 16, 76, 0);
    stream.WriteBoolean(false);
  }
};
var LogicLoginCalendar_default = LogicLoginCalendar;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicPlayerAlliancePiggyBankData.ts
var LogicPlayerAlliancePiggyBankData = class {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
  }
};
var LogicPlayerAlliancePiggyBankData_default = LogicPlayerAlliancePiggyBankData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicPlayerCollabEventData.ts
var LogicPlayerCollabEventData = class {
  static Encode(stream) {
    stream.WriteVInt(67);
    stream.WriteVInt(0);
    stream.WriteBoolean(true);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(true);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteDataReference(83, 6);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
  }
};
var LogicPlayerCollabEventData_default = LogicPlayerCollabEventData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicPlayerSpecialEventData.ts
var LogicPlayerSpecialEventData = class {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
  }
};
var LogicPlayerSpecialEventData_default = LogicPlayerSpecialEventData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicDataSeenStates.ts
var LogicDataSeenStates = class {
  static Encode(stream) {
    stream.WriteVInt(0);
  }
};
var LogicDataSeenStates_default = LogicDataSeenStates;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicPlayerContestEventData.ts
var LogicPlayerContestEventData = class {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteLong(0, 1);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteLong(0, 1);
    stream.WriteBoolean(false);
    {
      LogicGemOffer_default.Encode(stream, 57, 14888, 0, 0, 0);
    }
    stream.WriteVInt(0);
  }
};
var LogicPlayerContestEventData_default = LogicPlayerContestEventData;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicPlayerRecordsData.ts
var LogicPlayerRecordsData = class _LogicPlayerRecordsData {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    {
    }
    _LogicPlayerRecordsData.EncodeCustom(stream);
  }
  static EncodeCustom(stream) {
    stream.WriteVInt(0);
  }
};
var LogicPlayerRecordsData_default = LogicPlayerRecordsData;

// agent/Packets/Server/Home/OwnHomeDataMessage/NotificationFactory/BaseNotification.ts
var BaseNotification = class {
  static Encode(stream, NotificationID, NotificationIndex, IsNotificationRead, NotificationTime, NotificationText) {
    stream.WriteVInt(NotificationID);
    stream.WriteInt(NotificationIndex);
    stream.WriteBoolean(IsNotificationRead);
    stream.WriteInt(NotificationTime);
    stream.WriteString(NotificationText);
    stream.WriteVInt(0);
  }
};
var BaseNotification_default = BaseNotification;

// agent/Packets/Server/Home/OwnHomeDataMessage/NotificationFactory/NotificationFactoryConfig.ts
var NotificationFactoryConfig = class {
  static NotificationCount = 0;
  static NotificationID = [28];
  static NotificationIndex = [0];
  static IsRead = [false];
  static NotificationTime = [1e5];
  static NotificationMessage = ["Hello"];
};
var NotificationFactoryConfig_default = NotificationFactoryConfig;

// agent/Packets/Server/Home/OwnHomeDataMessage/NotificationFactory/Notifications/ChallengeRewardNotification.ts
var ChallengeRewardNotification = class {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteString("");
    stream.WriteBoolean(false);
  }
};
var ChallengeRewardNotification_default = ChallengeRewardNotification;

// agent/Packets/Server/Home/OwnHomeDataMessage/NotificationFactory/NotificationFactory.ts
var NotificationFactory = class {
  static Encode(stream) {
    stream.WriteVInt(NotificationFactoryConfig_default.NotificationCount);
    for (let i = 0; i < NotificationFactoryConfig_default.NotificationCount; i++) {
      switch (NotificationFactoryConfig_default.NotificationID[i]) {
        case 28:
          BaseNotification_default.Encode(stream, NotificationFactoryConfig_default.NotificationID[i], NotificationFactoryConfig_default.NotificationIndex[i], NotificationFactoryConfig_default.IsRead[i], NotificationFactoryConfig_default.NotificationTime[i], NotificationFactoryConfig_default.NotificationMessage[i]);
          break;
        case 29:
          break;
        case 30:
          break;
        case 31:
          break;
        case 32:
          break;
        case 33:
          break;
        case 34:
          break;
        case 35:
          break;
        case 36:
          break;
        case 37:
          break;
        case 38:
          break;
        case 39:
          break;
        case 40:
          break;
        case 41:
          break;
        case 42:
          break;
        case 43:
          break;
        case 44:
          break;
        case 45:
          break;
        case 46:
          break;
        case 47:
          break;
        case 48:
          break;
        case 50:
          break;
        case 51:
          break;
        case 52:
          break;
        case 53:
          break;
        case 54:
          break;
        case 55:
          break;
        case 56:
          break;
        case 57:
          break;
        case 58:
          break;
        case 59:
          break;
        case 60:
          break;
        case 61:
          break;
        case 62:
          break;
        case 63:
          BaseNotification_default.Encode(stream, NotificationFactoryConfig_default.NotificationID[i], NotificationFactoryConfig_default.NotificationIndex[i], NotificationFactoryConfig_default.IsRead[i], NotificationFactoryConfig_default.NotificationTime[i], NotificationFactoryConfig_default.NotificationMessage[i]);
          break;
        case 64:
          break;
        case 65:
          break;
        case 66:
          break;
        case 67:
          break;
        case 68:
          break;
        case 69:
          break;
        case 70:
          BaseNotification_default.Encode(stream, NotificationFactoryConfig_default.NotificationID[i], NotificationFactoryConfig_default.NotificationIndex[i], NotificationFactoryConfig_default.IsRead[i], NotificationFactoryConfig_default.NotificationTime[i], NotificationFactoryConfig_default.NotificationMessage[i]);
          ChallengeRewardNotification_default.Encode(stream);
          break;
        case 71:
          break;
        case 72:
          break;
        case 73:
          break;
        case 74:
          break;
        case 75:
          break;
        case 76:
          break;
        case 79:
          break;
        case 80:
          break;
        case 81:
          break;
        case 82:
          break;
        case 83:
          break;
        case 84:
          break;
        case 85:
          break;
        case 86:
          break;
        case 87:
          break;
        case 88:
          break;
        case 89:
          break;
        case 90:
          break;
        case 91:
          break;
        case 92:
          break;
        case 93:
          break;
        case 94:
          break;
        case 95:
          break;
        case 96:
          break;
        default:
          BaseNotification_default.Encode(stream, NotificationFactoryConfig_default.NotificationID[i], NotificationFactoryConfig_default.NotificationIndex[i], NotificationFactoryConfig_default.IsRead[i], NotificationFactoryConfig_default.NotificationTime[i], NotificationFactoryConfig_default.NotificationMessage[i]);
          break;
      }
    }
  }
};
var NotificationFactory_default = NotificationFactory;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/Arrays/LogicGatchaDrop.ts
var LogicGatchaDrop = class {
  static Encode(stream) {
    stream.WriteVInt(0);
    stream.WriteDataReference(0);
    stream.WriteVInt(0);
    stream.WriteDataReference(0);
    stream.WriteDataReference(0);
    stream.WriteDataReference(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
  }
};
var LogicGatchaDrop_default = LogicGatchaDrop;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientHome/LogicClientHome.ts
var LogicClientHome = class {
  static Encode(stream) {
    LogicDailyData_default.Encode(stream);
    LogicConfData_default.Encode(stream);
    stream.WriteLong(0, 1);
    NotificationFactory_default.Encode(stream);
    stream.WriteVInt(1337);
    if (stream.WriteBoolean(true)) {
      stream.WriteVInt(1);
      {
        LogicGatchaDrop_default.Encode(stream);
      }
    } else {
      stream.WriteVInt(0);
    }
    stream.WriteVInt(1);
    {
      stream.WriteDataReference(0);
    }
    stream.WriteVInt(1);
    {
      stream.WriteDataReference(0);
      stream.WriteDataReference(0);
      stream.WriteByte(0);
    }
    if (stream.WriteBoolean(true)) {
      LogicLoginCalendar_default.Encode(stream);
    }
    if (stream.WriteBoolean(true)) {
      LogicLoginCalendar_default.Encode(stream);
    }
    if (stream.WriteBoolean(true)) {
      LogicLoginCalendar_default.Encode(stream);
    }
    if (stream.WriteBoolean(true)) {
      LogicLoginCalendar_default.Encode(stream);
    }
    LogicHeroGears_default.Encode(stream);
    if (stream.WriteBoolean(true)) {
      LogicBrawlerRecruitRoad_default.Encode(stream);
    }
    LogicMastery_default.Encode(stream);
    LogicBattleIntro_default.Encode(stream);
    LogicRandomRewardManager_default.Encode(stream);
    if (stream.WriteBoolean(false)) {
      LogicPlayerAlliancePiggyBankData_default.Encode(stream);
    }
    if (stream.WriteBoolean(true)) {
      LogicPlayerCollabEventData_default.Encode(stream);
    }
    if (stream.WriteBoolean(true)) {
      LogicPlayerSpecialEventData_default.Encode(stream);
    }
    LogicDataSeenStates_default.Encode(stream);
    if (stream.WriteBoolean(false)) {
      LogicPlayerContestEventData_default.Encode(stream);
    }
    if (stream.WriteBoolean(true)) {
      LogicPlayerRecordsData_default.Encode(stream);
    }
    stream.WriteBoolean(true);
    {
      stream.WriteVInt(0);
      stream.WriteVInt(0);
      stream.WriteVInt(0);
      stream.WriteVInt(0);
      stream.WriteVInt(0);
      stream.WriteVInt(0);
      stream.WriteVInt(1);
      {
        stream.WriteBoolean(true);
        {
          LogicGemOffer_default.Encode(stream, 57, 14888, 0, 0, 0);
        }
      }
      stream.WriteVInt(1);
      {
        stream.WriteBoolean(true);
        {
          LogicGemOffer_default.Encode(stream, 57, 14888, 0, 0, 0);
        }
      }
      stream.WriteVInt(0);
      stream.WriteVInt(0);
    }
    stream.WriteBoolean(true);
    {
      stream.WriteVInt(1);
      {
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
      }
    }
    stream.WriteVInt(1);
    {
      stream.WriteBoolean(true);
      {
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
        stream.WriteVInt(0);
      }
    }
  }
};
var LogicClientHome_default = LogicClientHome;

// agent/Packets/Server/Home/OwnHomeDataMessage/LogicClientAvatar/LogicClientAvatar.ts
var LogicClientAvatar = class {
  static Encode(stream) {
    stream.WriteVLong(0, 254842734);
    stream.WriteVLong(0, 254842734);
    stream.WriteVLong(0, 0);
    stream.WriteString("@soufgamev2");
    stream.WriteBoolean(true);
    stream.WriteInt(-1);
    stream.WriteVInt(28);
    let OwnedBrawlersCount = Object.values(LogicPlayerData_default.OwnedBrawlers).length;
    stream.WriteVInt(Object.values(LogicPlayerData_default.OwnedBrawlers).map((brawler) => brawler.CardID).length + 7);
    for (const CardId of Object.values(LogicPlayerData_default.OwnedBrawlers).map((brawler) => brawler.CardID)) {
      stream.WriteDataReference(23, CardId);
      stream.WriteVInt(-1);
      stream.WriteVInt(1);
    }
    stream.WriteDataReference(5, 8);
    stream.WriteVInt(-1);
    stream.WriteVInt(3e5);
    stream.WriteDataReference(5, 9);
    stream.WriteVInt(-1);
    stream.WriteVInt(3e5);
    stream.WriteDataReference(5, 21);
    stream.WriteVInt(-1);
    stream.WriteVInt(3e5);
    stream.WriteDataReference(5, 22);
    stream.WriteVInt(-1);
    stream.WriteVInt(3e5);
    stream.WriteDataReference(5, 23);
    stream.WriteVInt(-1);
    stream.WriteVInt(3e5);
    stream.WriteDataReference(5, 24);
    stream.WriteVInt(-1);
    stream.WriteVInt(3e5);
    stream.WriteDataReference(5, 25);
    stream.WriteVInt(-1);
    stream.WriteVInt(67);
    stream.WriteVInt(OwnedBrawlersCount);
    for (const CardId of Object.keys(LogicPlayerData_default.OwnedBrawlers).map((id) => parseInt(id))) {
      stream.WriteDataReference(16, CardId);
      stream.WriteVInt(-1);
      stream.WriteVInt(3e3);
    }
    stream.WriteVInt(OwnedBrawlersCount);
    for (const CardId of Object.keys(LogicPlayerData_default.OwnedBrawlers).map((id) => parseInt(id))) {
      stream.WriteDataReference(16, CardId);
      stream.WriteVInt(-1);
      stream.WriteVInt(3e3);
    }
    stream.WriteVInt(OwnedBrawlersCount);
    for (const CardId of Object.keys(LogicPlayerData_default.OwnedBrawlers).map((id) => parseInt(id))) {
      stream.WriteDataReference(16, CardId);
      stream.WriteVInt(-1);
      stream.WriteVInt(0);
    }
    stream.WriteVInt(OwnedBrawlersCount);
    for (const CardId of Object.keys(LogicPlayerData_default.OwnedBrawlers).map((id) => parseInt(id))) {
      stream.WriteDataReference(16, CardId);
      stream.WriteVInt(-1);
      stream.WriteVInt(3e3);
    }
    stream.WriteVInt(OwnedBrawlersCount);
    for (const CardId of Object.keys(LogicPlayerData_default.OwnedBrawlers).map((id) => parseInt(id))) {
      stream.WriteDataReference(16, CardId);
      stream.WriteVInt(-1);
      stream.WriteVInt(11 - 1);
    }
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(1e6);
    stream.WriteVInt(1e6);
    stream.WriteVInt(10);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(2);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteString("");
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteVInt(0);
    stream.WriteBoolean(false);
  }
};
var LogicClientAvatar_default = LogicClientAvatar;

// agent/Packets/Server/Home/OwnHomeDataMessage/OwnHomeDataMessage.ts
var OwnHomeDataMessage = class {
  static Encode() {
    let stream = new ByteStream_default([]);
    stream.WriteVInt(1757882887);
    stream.WriteVInt(-1230828389);
    LogicClientHome_default.Encode(stream);
    LogicClientAvatar_default.Encode(stream);
    return stream.Payload;
  }
  static GetMessageType() {
    return 24101;
  }
};
var OwnHomeDataMessage_default = OwnHomeDataMessage;

// agent/Packets/Server/Battles/LogicBattleModeServer.ts
var LogicBattleModeServer = class {
  static Ticks = 1;
  static HandledInputs = 0;
  static Spectators = 0;
  static IsBrawlTV = false;
  static PlayerCount = 1;
  // LogicGameModeUtil.GetPlayerCount();
  static PlayerIndex = 0;
  static TeamIndex = 0;
  static ModifiersCount = 0;
  static ModifiersID = [0];
  static CurrentPlayersInMM = 0;
  static MaxPlayers = 6;
  static MMTimer = 3;
};
var LogicBattleModeServer_default = LogicBattleModeServer;

// agent/Packets/Server/Battles/StartLoadingMessage.ts
var StartLoadingMessage = class {
  static GameModeVariation = 8;
  static Encode() {
    let Stream2 = new ByteStream_default([]);
    Stream2.WriteInt(LogicBattleModeServer_default.PlayerCount);
    Stream2.WriteInt(LogicBattleModeServer_default.PlayerIndex);
    Stream2.WriteInt(LogicBattleModeServer_default.TeamIndex);
    console.log("Player Count:", LogicBattleModeServer_default.PlayerCount);
    Stream2.WriteInt(LogicBattleModeServer_default.PlayerCount);
    for (let i = 0; i < LogicBattleModeServer_default.PlayerCount; i++) {
      LogicPlayer_default.Encode(Stream2);
    }
    Stream2.WriteInt(0);
    Stream2.WriteInt(LogicBattleModeServer_default.ModifiersCount);
    for (let i = 0; i < LogicBattleModeServer_default.ModifiersCount; i++) {
      Stream2.WriteInt(LogicBattleModeServer_default.ModifiersID[i]);
    }
    Stream2.WriteInt(0);
    Stream2.WriteVInt(8);
    Stream2.WriteVInt(1);
    Stream2.WriteVInt(13);
    Stream2.WriteVInt(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteVInt(LogicPlayer_default.IsSpectator);
    Stream2.WriteVInt(1);
    Stream2.WriteDataReference(15, 121);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteBoolean(true);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteDataReference(0);
    Stream2.WriteDataReference(0);
    Stream2.WriteDataReference(0);
    return Stream2.Payload;
  }
  static GetMessageType() {
    return 20559;
  }
};
var StartLoadingMessage_default = StartLoadingMessage;

// agent/Packets/Server/Battles/MatchmakingStatusMessage.ts
var MatchmakingStatusMessage = class {
  static Encode() {
    let Stream2 = new ByteStream_default([]);
    LogicBattleModeServer_default.CurrentPlayersInMM = LogicBattleModeServer_default.CurrentPlayersInMM + 1;
    Stream2.WriteInt(LogicBattleModeServer_default.MMTimer);
    Stream2.WriteInt(LogicBattleModeServer_default.CurrentPlayersInMM);
    Stream2.WriteInt(LogicBattleModeServer_default.MaxPlayers);
    Stream2.WriteInt(0);
    Stream2.WriteInt(0);
    Stream2.WriteInt(0);
    Stream2.WriteBoolean(true);
    return Stream2.Payload;
  }
  static GetMessageType() {
    return 20405;
  }
};
var MatchmakingStatusMessage_default = MatchmakingStatusMessage;

// agent/Packets/Client/StartGameMessage.ts
var StartGameMessage = class {
  static Encode() {
    let Stream2 = new ByteStream_default([]);
    Stream2.WriteInt(0);
    return Stream2.Payload;
  }
  static Execute() {
    LogicBattleModeServer_default.PlayerCount = 1;
    LogicLaserMessageFactory_default.CreateMessageByType(StartLoadingMessage_default.GetMessageType());
    console.log("done with the shit");
  }
  static GetMessageType() {
    return 14118;
  }
};
var StartGameMessage_default = StartGameMessage;

// agent/Packets/Server/Battles/ClientInfoMessage.ts
var ClientInfoMessage = class {
  static Encode() {
    let Stream2 = new ByteStream_default([]);
    Stream2.WriteString("");
    Stream2.WriteString("");
    Stream2.WriteVInt(0);
    return Stream2.Payload;
  }
  static GetMessageType() {
    return 10177;
  }
};
var ClientInfoMessage_default = ClientInfoMessage;

// agent/Packets/Server/Battles/UdpConnectionInfoMessage.ts
var UdpConnectionInfoMessage = class {
  static Encode() {
    let Stream2 = new ByteStream_default([]);
    Stream2.WriteVInt(9339);
    Stream2.WriteString("127.0.0.1");
    Stream2.WriteInt(0);
    Stream2.WriteByte(0);
    Stream2.WriteInt(0);
    Stream2.WriteByte(0);
    return Stream2.Payload;
  }
  static GetMessageType() {
    return 24112;
  }
};
var UdpConnectionInfoMessage_default = UdpConnectionInfoMessage;

// agent/Packets/Server/Home/PlayerProfileMessage.ts
var PlayerProfileMessage = class {
  static Encode() {
    let Stream2 = new ByteStream_default([]);
    Stream2.WriteVLong(0, 254842734);
    Stream2.WriteDataReference(16, 0);
    Stream2.WriteDataReference(0);
    Stream2.WriteVInt(1);
    {
      Stream2.WriteDataReference(16, 1);
      Stream2.WriteDataReference(0);
      Stream2.WriteVInt(1250);
      Stream2.WriteVInt(1250);
      Stream2.WriteVInt(11);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
    }
    Stream2.WriteVInt(28);
    {
      Stream2.WriteDataReference(1, 99);
      Stream2.WriteDataReference(3, 97);
      Stream2.WriteDataReference(4, 96);
      Stream2.WriteDataReference(8, 92);
      Stream2.WriteDataReference(10, 90);
      Stream2.WriteDataReference(11, 89);
      Stream2.WriteDataReference(12, 88);
      Stream2.WriteDataReference(13, 87);
      Stream2.WriteDataReference(14, 86);
      Stream2.WriteDataReference(15, 85);
      Stream2.WriteDataReference(16, 84);
      Stream2.WriteDataReference(17, 83);
      Stream2.WriteDataReference(18, 82);
      Stream2.WriteDataReference(19, 81);
      Stream2.WriteDataReference(21, 80);
      Stream2.WriteDataReference(22, 79);
      Stream2.WriteDataReference(23, 78);
      Stream2.WriteDataReference(26, 77);
      Stream2.WriteDataReference(28, 76);
      Stream2.WriteDataReference(20, 3e5);
      Stream2.WriteDataReference(24, 13e3);
      Stream2.WriteDataReference(25, 13e3);
      Stream2.WriteDataReference(27, 2025);
      Stream2.WriteDataReference(29, 2024);
      Stream2.WriteDataReference(30, 1);
      Stream2.WriteDataReference(31, 2039);
      Stream2.WriteDataReference(32, 12);
    }
    {
      Stream2.WriteString("@soufgamev2");
      Stream2.WriteVInt(100);
      Stream2.WriteVInt(28e6);
      Stream2.WriteVInt(43000006);
      Stream2.WriteVInt(43000006);
    }
    Stream2.WriteBoolean(false);
    Stream2.WriteString("hello world");
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteDataReference(29, 0);
    Stream2.WriteDataReference(0);
    Stream2.WriteDataReference(0);
    Stream2.WriteDataReference(0);
    Stream2.WriteDataReference(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteDataReference(25, 0);
    Stream2.WriteVInt(1);
    return Stream2.Payload;
  }
  static GetMessageType() {
    return 24113;
  }
};
var PlayerProfileMessage_default = PlayerProfileMessage;

// agent/Packets/Server/Home/TeamMessage.ts
var TeamMessage = class {
  static Encode() {
    let Stream2 = new ByteStream_default([]);
    Stream2.WriteVInt(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteVInt(3);
    Stream2.WriteLong(0, 1);
    Stream2.WriteVInt(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteDataReference(15, 7);
    Stream2.WriteBoolean(false);
    Stream2.WriteVInt(1);
    {
      Stream2.WriteBoolean(true);
      Stream2.WriteLong(0, 1);
      Stream2.WriteDataReference(16, 0);
      Stream2.WriteDataReference(29, 0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(1250);
      Stream2.WriteVInt(1250);
      Stream2.WriteVInt(11);
      Stream2.WriteVInt(3);
      Stream2.WriteVInt(0);
      Stream2.WriteBoolean(true);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteString("@soufgamev2");
      Stream2.WriteVInt(100);
      Stream2.WriteVInt(28e6);
      Stream2.WriteVInt(43000006);
      Stream2.WriteVInt(43000006);
      Stream2.WriteDataReference(0);
      Stream2.WriteDataReference(0);
      Stream2.WriteDataReference(0);
      Stream2.WriteDataReference(0);
      Stream2.WriteDataReference(0);
      Stream2.WriteDataReference(0);
      Stream2.WriteDataReference(0);
      Stream2.WriteDataReference(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
    }
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteVInt(0);
    Stream2.WriteBoolean(true);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteVInt(0);
    return Stream2.Payload;
  }
  static GetMessageType() {
    return 24124;
  }
};
var TeamMessage_default = TeamMessage;

// agent/DataStream/BitStream.ts
var BitStream = class {
  BitOffset = 0;
  MessagePayload;
  Length;
  Capacity = 100;
  ByteOffset = 0;
  constructor(messageBytes) {
    if (!messageBytes) {
      messageBytes = new Uint8Array(100);
    }
    this.MessagePayload = messageBytes;
    this.Length = messageBytes.length;
  }
  GetLength() {
    return this.ByteOffset;
  }
  GetByteArray() {
    return this.MessagePayload.slice(0, this.ByteOffset);
  }
  ReadBoolean() {
    return this.ReadOneBit() === 1;
  }
  ReadOneBit() {
    const bitOffset = this.BitOffset;
    this.BitOffset++;
    const byte = this.MessagePayload[this.ByteOffset];
    if (this.BitOffset === 8) {
      this.ByteOffset++;
      this.BitOffset = 0;
    }
    const result = (1 << (bitOffset & 31) & byte) >> (bitOffset & 31);
    return result;
  }
  ReadBits(nbBits) {
    let byteOffset = this.ByteOffset;
    let bitOffset = this.BitOffset;
    let bitResult = 0;
    for (let i = 0; i < nbBits; i++) {
      const bit = bitOffset & 31;
      bitOffset++;
      bitResult = (1 << bit & this.MessagePayload[byteOffset]) >> bit << (i & 31) | bitResult;
      if (bitOffset === 8) {
        bitOffset = 0;
        byteOffset++;
      }
    }
    this.ByteOffset = byteOffset;
    this.BitOffset = bitOffset;
    return bitResult;
  }
  ReadPositiveIntMax3() {
    return this.ReadBits(2);
  }
  ReadPositiveIntMax7() {
    return this.ReadBits(3);
  }
  ReadPositiveIntMax15() {
    return this.ReadBits(4);
  }
  ReadPositiveIntMax31() {
    return this.ReadBits(5);
  }
  ReadPositiveIntMax63() {
    return this.ReadBits(6);
  }
  ReadPositiveIntMax127() {
    return this.ReadBits(7);
  }
  ReadPositiveIntMax255() {
    return this.ReadBits(8);
  }
  ReadPositiveIntMax511() {
    return this.ReadBits(9);
  }
  ReadPositiveIntMax1023() {
    return this.ReadBits(10);
  }
  ReadPositiveIntMax2047() {
    return this.ReadBits(11);
  }
  ReadPositiveIntMax4095() {
    return this.ReadBits(12);
  }
  ReadPositiveIntMax8191() {
    return this.ReadBits(13);
  }
  ReadPositiveIntMax16383() {
    return this.ReadBits(14);
  }
  ReadPositiveIntMax32767() {
    return this.ReadBits(15);
  }
  ReadPositiveIntMax65535() {
    return this.ReadBits(16);
  }
  ReadPositiveIntMax131071() {
    return this.ReadBits(17);
  }
  ReadPositiveIntMax262143() {
    return this.ReadBits(18);
  }
  ReadPositiveIntMax524287() {
    return this.ReadBits(19);
  }
  ReadPositiveIntMax2097151() {
    return this.ReadBits(21);
  }
  ReadIntMax1() {
    const signedBit = this.ReadBits(1);
    const value = this.ReadBits(1);
    return (signedBit * 2 + -1) * value;
  }
  ReadIntMax7() {
    const signedBit = this.ReadBits(1);
    const value = this.ReadBits(3);
    return (signedBit * 2 + -1) * value;
  }
  ReadIntMax15() {
    const signedBit = this.ReadBits(1);
    const value = this.ReadBits(4);
    return (signedBit * 2 + -1) * value;
  }
  ReadIntMax127() {
    const signedBit = this.ReadBits(1);
    const value = this.ReadBits(7);
    return (signedBit * 2 + -1) * value;
  }
  ReadVIntMax255() {
    let value = this.ReadBits(3);
    value = this.ReadBits(value + 1);
    return value;
  }
  ReadPositiveVIntMax255OftenZero() {
    if (this.ReadBoolean()) {
      return 0;
    }
    let value = this.ReadBits(3);
    value = this.ReadBits(value + 1);
    return value;
  }
  ReadVIntMax65535() {
    let value = this.ReadBits(4);
    value = this.ReadBits(value + 1);
    return value;
  }
  ReadPositiveVIntMax65535OftenZero() {
    if (this.ReadBoolean()) {
      return 0;
    }
    let value = this.ReadBits(4);
    value = this.ReadBits(value + 1);
    return value;
  }
  Clamp(num, minValue, maxValue) {
    return Math.max(Math.min(num, maxValue), minValue);
  }
  EnsureCapacity() {
    if (this.Capacity < this.ByteOffset + 6) {
      this.Capacity += 100;
      const newPayload = new Uint8Array(this.Capacity);
      newPayload.set(this.MessagePayload);
      this.MessagePayload = newPayload;
    }
  }
  WritePositiveInt(value, nbBits) {
    this.EnsureCapacity();
    const clampedValue = this.Clamp(value, 0, ~(-1 << (nbBits & 31)));
    this.WriteBits(clampedValue, nbBits);
  }
  WriteInt(value, nbBits) {
    let clampedValue = -1 << (nbBits & 31);
    clampedValue = this.Clamp(value, clampedValue + 1, ~clampedValue);
    this.EnsureCapacity();
    if (clampedValue < 0) {
      this.WriteBits(0, 1);
      clampedValue = -clampedValue;
    } else {
      this.WriteBits(1, 1);
    }
    this.WriteBits(clampedValue, nbBits);
  }
  WritePositiveVInt(value, nbBits) {
    this.EnsureCapacity();
    let clampedValue = this.Clamp(value, 0, ~(-1 << (1 << (nbBits & 31) & 31)));
    let s;
    if (clampedValue === 0) {
      s = 1;
    } else if (clampedValue < 1) {
      s = 0;
    } else {
      s = 0;
      let a = clampedValue;
      let bvar1 = 1 < a;
      while (bvar1) {
        bvar1 = 1 < a;
        a >>= 1;
        s++;
      }
    }
    this.WriteBits(s - 1, nbBits);
    this.WriteBits(clampedValue, s);
  }
  WriteBoolean(value) {
    this.EnsureCapacity();
    this.WriteBits(value ? 1 : 0, 1);
    return value;
  }
  WriteBits(value, nbBits) {
    for (let i = 0; i < nbBits; i++) {
      this.MessagePayload[this.ByteOffset] |= (1 << (i & 7) & value) >> (i & 7) << (this.BitOffset & 7);
      this.BitOffset++;
      if (this.BitOffset === 8) {
        this.BitOffset = 0;
        this.ByteOffset++;
      }
    }
  }
  WriteDataReference(csvId, row) {
    if (csvId !== 0) {
      this.WritePositiveIntMax31(csvId);
      this.WritePositiveIntMax1023(row);
      return;
    }
    this.WritePositiveIntMax31(0);
  }
  ResetOffset() {
    this.BitOffset = 0;
    this.ByteOffset = 0;
  }
  // --- Convenience Wrappers ---
  WritePositiveIntMax3(value) {
    this.WritePositiveInt(value, 2);
  }
  WritePositiveIntMax7(value) {
    this.WritePositiveInt(value, 3);
  }
  WritePositiveIntMax15(value) {
    this.WritePositiveInt(value, 4);
  }
  WritePositiveIntMax31(value) {
    this.WritePositiveInt(value, 5);
  }
  WritePositiveIntMax63(value) {
    this.WritePositiveInt(value, 6);
  }
  WritePositiveIntMax127(value) {
    this.WritePositiveInt(value, 7);
  }
  WritePositiveIntMax255(value) {
    this.WritePositiveInt(value, 8);
  }
  WritePositiveIntMax511(value) {
    this.WritePositiveInt(value, 9);
  }
  WritePositiveIntMax1023(value) {
    this.WritePositiveInt(value, 10);
  }
  WritePositiveIntMax2047(value) {
    this.WritePositiveInt(value, 11);
  }
  WritePositiveIntMax4095(value) {
    this.WritePositiveInt(value, 12);
  }
  WritePositiveIntMax8191(value) {
    this.WritePositiveInt(value, 13);
  }
  WritePositiveIntMax16383(value) {
    this.WritePositiveInt(value, 14);
  }
  WritePositiveIntMax32767(value) {
    this.WritePositiveInt(value, 15);
  }
  WritePositiveIntMax65535(value) {
    this.WritePositiveInt(value, 16);
  }
  WritePositiveIntMax131071(value) {
    this.WritePositiveInt(value, 17);
  }
  WritePositiveIntMax262143(value) {
    this.WritePositiveInt(value, 18);
  }
  WritePositiveIntMax524287(value) {
    this.WritePositiveInt(value, 19);
  }
  WritePositiveIntMax1048575(value) {
    this.WritePositiveInt(value, 20);
  }
  WritePositiveIntMax2097151(value) {
    this.WritePositiveInt(value, 21);
  }
  WritePositiveIntMax134217727(value) {
    this.WritePositiveInt(value, 27);
  }
  WritePositiveVIntMax255(value) {
    this.WritePositiveVInt(value, 3);
  }
  WritePositiveVIntMax255OftenZero(value) {
    if (value !== 0) {
      this.WritePositiveInt(0, 1);
      this.WritePositiveVInt(value, 3);
      return;
    }
    this.WritePositiveInt(1, 1);
  }
  WritePositiveVIntMax65535(value) {
    this.WritePositiveVInt(value, 4);
  }
  WritePositiveVIntMax65535OftenZero(value) {
    if (value !== 0) {
      this.WritePositiveInt(0, 1);
      this.WritePositiveVInt(value, 4);
      return;
    }
    this.WritePositiveInt(1, 1);
  }
  WritePositiveVIntMax2147483647(value) {
    this.WritePositiveVInt(value, 5);
  }
  WritePositiveVIntMax2147483647OftenZero(value) {
    if (value !== 0) {
      this.WritePositiveInt(0, 1);
      this.WritePositiveVInt(value, 5);
      return;
    }
    this.WritePositiveInt(1, 1);
  }
  WriteIntMax1(value) {
    this.WriteInt(value, 1);
  }
  WriteIntMax3(value) {
    this.WriteInt(value, 2);
  }
  WriteIntMax7(value) {
    this.WriteInt(value, 3);
  }
  WriteIntMax15(value) {
    this.WriteInt(value, 4);
  }
  WriteIntMax31(value) {
    this.WriteInt(value, 4);
  }
  WriteIntMax63(value) {
    this.WriteInt(value, 6);
  }
  WriteIntMax127(value) {
    this.WriteInt(value, 7);
  }
  WriteIntMax1023(value) {
    this.WriteInt(value, 10);
  }
  WriteIntMax16383(value) {
    this.WriteInt(value, 14);
  }
  WriteIntMax2047(value) {
    this.WriteInt(value, 11);
  }
  WriteIntMax255(value) {
    this.WriteInt(value, 8);
  }
};
var BitStream_default = BitStream;

// agent/Utils/BattlesUtils/LogicGameModeUtil.ts
var LogicGameModeUtil = class {
  static PlayersCollectPowerCubes(Variation) {
    const V1 = Variation - 6;
    if (V1 <= 8) {
      return (281 >> V1 & 1) !== 0;
    } else {
      return false;
    }
  }
  static GetBattleTicks(V) {
    let V2 = 2400;
    switch (V) {
      case 0:
      case 5:
      case 16:
      case 22:
      case 23:
        V2 = 4200;
        break;
      case 3:
      case 7:
      case 8:
        break;
      case 6:
      case 9:
      case 10:
      case 12:
      case 13:
      case 18:
      case 20:
        return 1;
      /*BattleMode.NO_TIME_TICKS;*/
      case 14:
        V2 = 9600;
        break;
      case 17:
      case 21:
        V2 = 3600;
        break;
      default:
        V2 = 20 * ((100 - 100) / 20);
        break;
    }
    return (
      /*BattleMode.INTRO_TICKS*/
      100 + V2
    );
  }
  static GetRespawnSeconds(Variation) {
    switch (Variation) {
      case 0:
      case 2:
      case 7:
        return 3;
      case 3:
        return 1;
      default:
        return 5;
    }
  }
  static PlayersCollectBountyStars(Variation) {
    return Variation === 3 || Variation === 15;
  }
  static HasTwoTeams(Variation) {
    return Variation !== 6;
  }
  static HasTwoBases(Variation) {
    return Variation === 2 || Variation === 11;
  }
  static GetGameModeVariation(Mode) {
    switch (Mode) {
      case "CoinRush":
      case "GemGrab":
        return 0;
      case "Heist":
        return 2;
      case "BossFight":
      case "BigGame":
        return 7;
      case "Bounty":
        return 3;
      case "Artifact":
        return 4;
      case "LaserBall":
        return 5;
      case "Showdown":
        return 6;
      case "BattleRoyaleTeam":
        return 9;
      case "Survival":
        return 8;
      case "Raid":
        return 10;
      case "RoboWars":
        return 11;
      case "Tutorial":
        return 12;
      case "Training":
        return 13;
      case "TagTeam":
        return 24;
      case "ReachExit":
        return 30;
      case "MapPrint":
        return 99;
      default:
        return -1;
    }
  }
};
var LogicGameModeUtil_default = LogicGameModeUtil;

// agent/Packets/Server/Battles/LogicGameObjectManagerServer.ts
var LogicGameObjectManagerServer = class _LogicGameObjectManagerServer {
  static Encode() {
    let Stream2 = new BitStream_default();
    Stream2.WritePositiveIntMax2097151(1e6);
    Stream2.WritePositiveIntMax2097151(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    if (StartLoadingMessage_default.GameModeVariation == LogicGameModeUtil_default.GetGameModeVariation("GemGrab")) {
      Stream2.WritePositiveVInt(0, 4);
    }
    Stream2.WriteBoolean(false);
    Stream2.WriteIntMax15(-1);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WritePositiveIntMax31(0);
    Stream2.WritePositiveIntMax63(14);
    Stream2.WritePositiveIntMax31(16);
    Stream2.WritePositiveIntMax63(32);
    _LogicGameObjectManagerServer.EncodeTiles(Stream2);
    _LogicGameObjectManagerServer.EncodeDynamicTiles(Stream2);
    Stream2.WritePositiveVIntMax65535OftenZero(0);
    Stream2.WritePositiveVIntMax65535OftenZero(0);
    Stream2.WritePositiveIntMax4095(4e3);
    Stream2.WritePositiveIntMax3(0);
    Stream2.WritePositiveIntMax4095(4e3);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WritePositiveVIntMax255OftenZero(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WritePositiveIntMax15(0);
    Stream2.WriteBoolean(false);
    Stream2.WritePositiveIntMax131071(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WritePositiveIntMax15(0);
    Stream2.WritePositiveVIntMax255OftenZero(0);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteBoolean(false);
    Stream2.WriteIntMax16383(0);
    Stream2.WritePositiveIntMax1048575(0);
    Stream2.WritePositiveVIntMax65535OftenZero(0);
    Stream2.WritePositiveVIntMax255OftenZero(0);
    Stream2.WritePositiveIntMax127(0);
    Stream2.WritePositiveIntMax127(0);
    Stream2.WritePositiveVIntMax65535(0);
    {
      Stream2.WriteBoolean(false);
    }
    return Stream2;
  }
  static EncodeTiles(Stream2) {
    Stream2.WriteBoolean(false);
  }
  static EncodeDynamicTiles(Stream2) {
    Stream2.WritePositiveVIntMax65535OftenZero(0);
  }
};
var LogicGameObjectManagerServer_default = LogicGameObjectManagerServer;

// agent/Packets/Server/Battles/VisionUpdateMessage.ts
var VisionUpdateMessage = class {
  static VisionUpdateMessage(Instance) {
    return Instance;
  }
  static SetVisionBitStream(a, b) {
  }
  static Encode() {
    let Stream2 = new ByteStream_default([]);
    Stream2.WriteVInt(LogicBattleModeServer_default.Ticks);
    Stream2.WriteVInt(LogicBattleModeServer_default.HandledInputs);
    Stream2.WriteVInt(LogicPlayer_default.ControlMode);
    Stream2.WriteVInt(LogicBattleModeServer_default.Ticks);
    Stream2.WriteBoolean(LogicBattleModeServer_default.IsBrawlTV);
    if (Stream2.WriteBoolean(false)) {
      Stream2.WriteVInt(0);
    }
    if (Stream2.WriteBoolean(false)) {
      Stream2.WriteVInt(0);
      Stream2.WriteVInt(0);
    }
    let GameObjectManager = LogicGameObjectManagerServer_default.Encode();
    let ByteArray = GameObjectManager.GetByteArray();
    let Length = GameObjectManager.GetLength();
    Stream2.WriteInt(Length);
    for (let i = 0; i < ByteArray.length; i++) {
      Stream2.WriteByte(ByteArray[i]);
    }
    return Stream2.Payload;
  }
  static GetMessageType() {
    return 24109;
  }
};
var VisionUpdateMessage_default = VisionUpdateMessage;

// agent/Protocol/Messaging/LogicLaserMessageFactory.ts
var LogicLaserMessageFactory = class _LogicLaserMessageFactory {
  static CreateMessageByType(MessageType) {
    switch (MessageType) {
      case 10100:
        Messaging_default.SendOfflineMessage(LoginOkMessage_default.GetMessageType(), LoginOkMessage_default.Encode());
        Messaging_default.SendOfflineMessage(OwnHomeDataMessage_default.GetMessageType(), OwnHomeDataMessage_default.Encode());
        break;
      case 10101:
        Messaging_default.SendOfflineMessage(LoginOkMessage_default.GetMessageType(), LoginOkMessage_default.Encode());
        Messaging_default.SendOfflineMessage(OwnHomeDataMessage_default.GetMessageType(), OwnHomeDataMessage_default.Encode());
        break;
      case 12541:
        Messaging_default.SendOfflineMessage(TeamMessage_default.GetMessageType(), TeamMessage_default.Encode());
      case 14118:
        StartGameMessage_default.Execute();
        break;
      case 14109:
        Messaging_default.SendOfflineMessage(OwnHomeDataMessage_default.GetMessageType(), OwnHomeDataMessage_default.Encode());
        break;
      case 15081:
        _LogicLaserMessageFactory.CreateMessageByType(PlayerProfileMessage_default.GetMessageType());
        break;
      case 17750:
        _LogicLaserMessageFactory.CreateMessageByType(OwnHomeDataMessage_default.GetMessageType());
        break;
      case 24113:
        Messaging_default.SendOfflineMessage(PlayerProfileMessage_default.GetMessageType(), PlayerProfileMessage_default.Encode());
        break;
      case 10177:
        Messaging_default.SendOfflineMessage(ClientInfoMessage_default.GetMessageType(), ClientInfoMessage_default.Encode());
        _LogicLaserMessageFactory.CreateMessageByType(UdpConnectionInfoMessage_default.GetMessageType());
        break;
      case 20109:
        Messaging_default.SendOfflineMessage(OwnHomeDataMessage_default.GetMessageType(), OwnHomeDataMessage_default.Encode());
        break;
      case 20405:
        Messaging_default.SendOfflineMessage(MatchmakingStatusMessage_default.GetMessageType(), MatchmakingStatusMessage_default.Encode());
        break;
      case 20559:
        Messaging_default.SendOfflineMessage(StartLoadingMessage_default.GetMessageType(), StartLoadingMessage_default.Encode());
        break;
      case 24101:
        Messaging_default.SendOfflineMessage(OwnHomeDataMessage_default.GetMessageType(), OwnHomeDataMessage_default.Encode());
        break;
      case 24109:
        Messaging_default.SendOfflineMessage(VisionUpdateMessage_default.GetMessageType(), VisionUpdateMessage_default.Encode());
        break;
      case 24112:
        Messaging_default.SendOfflineMessage(UdpConnectionInfoMessage_default.GetMessageType(), UdpConnectionInfoMessage_default.Encode());
        break;
      case 10555:
        const intervalId = setInterval(() => {
          if (LogicBattleModeServer_default.Ticks >= 1e3) {
            clearInterval(intervalId);
            return;
          }
          _LogicLaserMessageFactory.CreateMessageByType(VisionUpdateMessage_default.GetMessageType());
          LogicBattleModeServer_default.Ticks += 1;
        }, 200);
        break;
      default:
        Debugger_default.Warn(`Unhandled Message! Message Type: ${MessageType}`);
        break;
    }
  }
};
var LogicLaserMessageFactory_default = LogicLaserMessageFactory;

// agent/Utils/Game/StringHelper.ts
var StringHelper = class _StringHelper {
  static ptr(Text) {
    return Memory.allocUtf8String(Text);
  }
  static scptr(Text) {
    let scptrmem = Functions_default.Imports.Malloc(Text.length + 1);
    Functions_default.String.StringCtor(scptrmem, _StringHelper.ptr(Text));
    return scptrmem;
  }
  static ReadSCPtr(scptr) {
    const StringByteLength = scptr.add(4).readInt();
    if (StringByteLength > 7) {
      return scptr.add(8).readPointer().readUtf8String(StringByteLength);
    }
    return scptr.add(8).readUtf8String(StringByteLength);
  }
};
var StringHelper_default = StringHelper;

// agent/Manager/Hooks.ts
var Hooks = class {
  static InstallHooks() {
    Interceptor.attach(Addresses_default.ServerConnectionUpdate, {
      onEnter: function(args) {
        this.ServerConnection = args[0];
        this.ServerConnection.add(8).readPointer().add(16).writeU8(0);
        this.ServerConnection.add(8).readPointer().add(181).writeInt(5);
      }
    });
    Interceptor.attach(Addresses_default.MessageManagerReceiveMessage, {
      onEnter(Args) {
        const Message = Args[1];
        if (PiranhaMessage_default.GetMessageType(Message) != 24109) {
          Debugger_default.Info("Received " + PiranhaMessage_default.GetMessageType(Message));
        }
      },
      onLeave(Retval) {
        Retval.replace(ptr(1));
      }
    });
    Interceptor.replace(Environment_default.LaserBase.add(11937892), new NativeCallback(function() {
      return 1;
    }, "int", []));
    Interceptor.attach(Environment_default.LaserBase.add(11939936), {
      onEnter(args) {
        this.messaging = args[0];
        console.warn("[+][PepperState::State][1] Pepper State Is", Memory.readU32(this.messaging.add(24)));
        Memory.writeU64(this.messaging.add(24), 5);
        args[1] = args[2];
        console.warn("[+][PepperState::State][2] Pepper State Is", Memory.readU32(this.messaging.add(24)));
      },
      onLeave(retval) {
        Memory.writeU32(this.messaging.add(24), 5);
        console.warn("[+][PepperState::State][3] Pepper State Is", Memory.readU32(this.messaging.add(24)));
      }
    });
    Interceptor.attach(Environment_default.LaserBase.add(11941700), function() {
      this.context.x0 = this.context.x8;
    });
    Interceptor.replace(Addresses_default.MessagingSend, new NativeCallback(function(Self, Message) {
      const Type = PiranhaMessage_default.GetMessageType(Message);
      if (Type === 10108) {
        return 0;
      }
      if (Type != 24109) {
        Debugger_default.Info("[Messaging::SendMessage] Type: " + Type);
      }
      LogicLaserMessageFactory_default.CreateMessageByType(Type);
      PiranhaMessage_default.Destruct(Message);
      return 0;
    }, "int", ["pointer", "pointer"]));
    Interceptor.replace(Environment_default.LaserBase.add(11933956), new NativeCallback(function() {
      return 1;
    }, "int", []));
    const StringTable__getString = new NativeFunction(Environment_default.LaserBase.add(3605444), "pointer", ["pointer"]);
    Interceptor.replace(StringTable__getString, new NativeCallback(function(a1) {
      let value = Memory.readUtf8String(a1);
      if (value === "TID_CONNECTING_TO_SERVER") {
        return StringTable__getString(Memory.allocUtf8String("<cfe0e00>[<cfe1c00>+<cfe2a00>]<cfe3800>[<cfd4600>S<cfd5500>h<cfd6300>a<cfd7100>d<cfd7f00>o<cfc8d00>w<cfc9b00>B<cfcaa00>r<cfcb800>a<cfbc600>w<cfbd400>l<cfbe200>O<cfbf000>f<cfaff00>f<cfbff00>l<cfbf00b>i<cfbe216>n<cfbd421>e<cfbc62c>:<cfcb837>:<cfca942>C<cfc9b4d>o<cfc8d58>n<cfd7f64>n<cfd716f>e<cfd637a>c<cfd5485>t<cfd4690>i<cfe389b>n<cfe2aa6>g<cfe1cb1>]</c>"));
      }
      if (value === "TID_EDIT_CONTROLS") {
        return StringTable__getString(Memory.allocUtf8String("Battle Settings"));
      }
      if (value === "TID_EDIT_MOVEMENT") {
        return StringTable__getString(Memory.allocUtf8String("testing"));
      }
      if (value === "TID_ABOUT") {
        return StringTable__getString(Memory.allocUtf8String("<cfe0e00>[<cfe1c00>+<cfe2a00>]<cfe3800>[<cfd4600>S<cfd5500>h<cfd6300>a<cfd7100>d<cfd7f00>o<cfc8d00>w<cfc9b00>B<cfcaa00>r<cfcb800>a<cfbc600>w<cfbd400>l<cfbe200>O<cfbf000>f<cfaff00>f<cfbff00>l<cfbf00b>i<cfbe216>n<cfbd421>e<cfbc62c>:<cfcb837>:<cfca942>C<cfc9b4d>o<cfc8d58>n<cfd7f64>n<cfd716f>e<cfd637a>c<cfd5485>t<cfd4690>i<cfe389b>n<cfe2aa6>g<cfe1cb1>]</c>"));
      }
      return StringTable__getString(a1);
    }, "pointer", ["pointer"]));
    Interceptor.attach(Environment_default.LaserBase.add(3291584), {
      onEnter: function(args) {
        let HomePageInstance = args[0];
        let TextField = Functions_default.MovieClip.GetTextFieldByName(HomePageInstance.add(112), StringHelper_default.ptr("players_online_txt"));
        Functions_default.MovieClip.SetText(HomePageInstance.add(112), StringHelper_default.ptr("players_online_debug_txt"), StringHelper_default.scptr("hiiiiiiii"));
      }
    });
  }
};
var Hooks_default = Hooks;

// agent/Environement/EnvironmentManager.ts
var EnvironmentManager = class {
  static InitEnvironment() {
    Addresses_default.Init();
    Functions_default.Init();
  }
};
var EnvironmentManager_default = EnvironmentManager;

// agent/Battles/LogicAccessoryData.ts
var LogicAccessoryData = class {
  static Type = "dash";
  static ActiveTicks = 8;
};
var LogicAccessoryData_default = LogicAccessoryData;

// agent/Battles/LogicCharacterServer.ts
var LogicCharacterServer = class _LogicCharacterServer {
  static Init() {
  }
  static PlaceHooks() {
    Interceptor.replace(Environment_default.LaserBase.add(4409828), new NativeCallback(function(a1, a2, a3) {
      return _LogicCharacterServer.SwapSkillTo(a1, a2, a3);
    }, "pointer", ["pointer", "int", "pointer"]));
  }
  static SwapSkillTo(a1, a2, a3) {
    if (![0, 1].includes(a2)) {
      return;
    }
    let NewSkill = Functions_default.Imports.Malloc(72);
    let result = Functions_default.LogicSkillServer.Constructor(NewSkill, a3);
    let SkillContainer = a1.add(424).readPointer();
    let SkillCount = a1.add(436).readInt();
    let SkillServer = SkillContainer.add(a2 * 8).readPointer();
    if (!SkillServer.isNull()) {
      SkillContainer.add(8).writeInt(SkillCount - 1);
      Functions_default.LogicSkillServer.Destructor(SkillServer);
      Functions_default.Imports.Free(SkillServer);
    }
    SkillContainer.add(8).writeInt(SkillCount + 1);
    SkillContainer.add(8 * a2).writePointer(NewSkill);
    return result;
  }
  static TriggerPushback(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
    const LogicCharacterServer_TriggerPushBack = new NativeFunction(Environment_default.LaserBase.add(4458180), "void", ["pointer", "int", "int", "int", "int", "bool", "int", "int", "int", "bool", "int", "int", "int", "int", "int"]);
    LogicCharacterServer_TriggerPushBack(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
    console.log("nigger");
  }
};
var LogicCharacterServer_default = LogicCharacterServer;

// agent/Utils/Math/LogicMath.ts
var LogicMath = class _LogicMath {
  static SQRT_TABLE = [
    0,
    16,
    22,
    27,
    32,
    35,
    39,
    42,
    45,
    48,
    50,
    53,
    55,
    57,
    59,
    61,
    64,
    65,
    67,
    69,
    71,
    73,
    75,
    76,
    78,
    80,
    81,
    83,
    84,
    86,
    87,
    89,
    90,
    91,
    93,
    94,
    96,
    97,
    98,
    99,
    101,
    102,
    103,
    104,
    106,
    107,
    108,
    109,
    110,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    128,
    128,
    129,
    130,
    131,
    132,
    133,
    134,
    135,
    136,
    137,
    138,
    139,
    140,
    141,
    142,
    143,
    144,
    144,
    145,
    146,
    147,
    148,
    149,
    150,
    150,
    151,
    152,
    153,
    154,
    155,
    155,
    156,
    157,
    158,
    159,
    160,
    160,
    161,
    162,
    163,
    163,
    164,
    165,
    166,
    167,
    167,
    168,
    169,
    170,
    170,
    171,
    172,
    173,
    173,
    174,
    175,
    176,
    176,
    177,
    178,
    178,
    179,
    180,
    181,
    181,
    182,
    183,
    183,
    184,
    185,
    185,
    186,
    187,
    187,
    188,
    189,
    189,
    190,
    191,
    192,
    192,
    193,
    193,
    194,
    195,
    195,
    196,
    197,
    197,
    198,
    199,
    199,
    200,
    201,
    201,
    202,
    203,
    203,
    204,
    204,
    205,
    206,
    206,
    207,
    208,
    208,
    209,
    209,
    210,
    211,
    211,
    212,
    212,
    213,
    214,
    214,
    215,
    215,
    216,
    217,
    217,
    218,
    218,
    219,
    219,
    220,
    221,
    221,
    222,
    222,
    223,
    224,
    224,
    225,
    225,
    226,
    226,
    227,
    227,
    228,
    229,
    229,
    230,
    230,
    231,
    231,
    232,
    232,
    233,
    234,
    234,
    235,
    235,
    236,
    236,
    237,
    237,
    238,
    238,
    239,
    240,
    240,
    241,
    241,
    242,
    242,
    243,
    243,
    244,
    244,
    245,
    245,
    246,
    246,
    247,
    247,
    248,
    248,
    249,
    249,
    250,
    250,
    251,
    251,
    252,
    252,
    253,
    253,
    254,
    254,
    255
  ];
  static ATAN_TABLE = [
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    11,
    12,
    12,
    13,
    13,
    14,
    14,
    14,
    15,
    15,
    16,
    16,
    17,
    17,
    17,
    18,
    18,
    19,
    19,
    19,
    20,
    20,
    21,
    21,
    21,
    22,
    22,
    22,
    23,
    23,
    24,
    24,
    24,
    25,
    25,
    25,
    26,
    26,
    27,
    27,
    27,
    28,
    28,
    28,
    29,
    29,
    29,
    30,
    30,
    30,
    31,
    31,
    31,
    32,
    32,
    32,
    33,
    33,
    33,
    34,
    34,
    34,
    35,
    35,
    35,
    35,
    36,
    36,
    36,
    37,
    37,
    37,
    37,
    38,
    38,
    38,
    39,
    39,
    39,
    39,
    40,
    40,
    40,
    40,
    41,
    41,
    41,
    41,
    42,
    42,
    42,
    42,
    43,
    43,
    43,
    43,
    44,
    44,
    44,
    44,
    45,
    45,
    45
  ];
  static SIN_TABLE = [
    0,
    18,
    36,
    54,
    71,
    89,
    107,
    125,
    143,
    160,
    178,
    195,
    213,
    230,
    248,
    265,
    282,
    299,
    316,
    333,
    350,
    367,
    384,
    400,
    416,
    433,
    449,
    465,
    481,
    496,
    512,
    527,
    543,
    558,
    573,
    587,
    602,
    616,
    630,
    644,
    658,
    672,
    685,
    698,
    711,
    724,
    737,
    749,
    761,
    773,
    784,
    796,
    807,
    818,
    828,
    839,
    849,
    859,
    868,
    878,
    887,
    896,
    904,
    912,
    920,
    928,
    935,
    943,
    949,
    956,
    962,
    968,
    974,
    979,
    984,
    989,
    994,
    998,
    1002,
    1005,
    1008,
    1011,
    1014,
    1016,
    1018,
    1020,
    1022,
    1023,
    1023,
    1024,
    1024
  ];
  static Abs(value) {
    if (value < 0) {
      return -value;
    }
    return value;
  }
  static Cos(angle) {
    return _LogicMath.Sin(angle + 90);
  }
  static GetAngle(x, y) {
    if (x === 0 && y === 0) {
      return 0;
    }
    if (x > 0 && y >= 0) {
      if (y >= x) {
        return 90 - _LogicMath.ATAN_TABLE[(x << 7) / y];
      }
      return _LogicMath.ATAN_TABLE[(y << 7) / x];
    }
    const num = _LogicMath.Abs(x);
    if (x <= 0 && y > 0) {
      if (num < y) {
        return 90 + _LogicMath.ATAN_TABLE[(num << 7) / y];
      }
      return 180 - _LogicMath.ATAN_TABLE[(y << 7) / num];
    }
    const num2 = _LogicMath.Abs(y);
    if (x < 0 && y <= 0) {
      if (num2 >= num) {
        if (num2 === 0) {
          return 0;
        }
        return 270 - _LogicMath.ATAN_TABLE[(num << 7) / num2];
      }
      return 180 + _LogicMath.ATAN_TABLE[(num2 << 7) / num];
    }
    if (num < num2) {
      return 270 + _LogicMath.ATAN_TABLE[(num << 7) / num2];
    }
    if (num === 0) {
      return 0;
    }
    return _LogicMath.NormalizeAngle360(360 - _LogicMath.ATAN_TABLE[(num2 << 7) / num]);
  }
  static Sign(a1) {
    const v1 = a1 >> 31;
    if (a1 > 0) {
      return 1;
    }
    return v1;
  }
  static GetAngleBetween(a1, a2) {
    let result = (a1 - a2) % 360;
    if (result < 0) {
      result += 360;
    }
    if (result > 179) {
      result -= 360;
    }
    return _LogicMath.Abs(result);
  }
  static GetRotatedX(x, y, angle) {
    let v3 = (angle + 90) % 360;
    if (v3 < 0) {
      v3 += 360;
    }
    let v4;
    let v5;
    if (v3 > 179) {
      v5 = v3 - 180;
      if (v3 - 180 > 90) {
        v5 = 360 - v3;
      }
      v4 = -_LogicMath.SIN_TABLE[v5];
    } else {
      if (v3 > 90) {
        v3 = 180 - v3;
      }
      v4 = _LogicMath.SIN_TABLE[v3];
    }
    const v6 = v4 * x;
    let v7 = angle % 360;
    if (v7 < 0) {
      v7 += 360;
    }
    let v8;
    let v9;
    if (v7 > 179) {
      v9 = v7 - 180;
      if (v7 - 180 > 90) {
        v9 = 360 - v7;
      }
      v8 = -_LogicMath.SIN_TABLE[v9];
    } else {
      if (v7 > 90) {
        v7 = 180 - v7;
      }
      v8 = _LogicMath.SIN_TABLE[v7];
    }
    return (v6 - v8 * y) / 1024;
  }
  static GetRotatedY(x, y, angle) {
    let v3 = angle % 360;
    if (v3 < 0) {
      v3 += 360;
    }
    let v4;
    let v5;
    if (v3 > 179) {
      v5 = v3 - 180;
      if (v3 - 180 > 90) {
        v5 = 360 - v3;
      }
      v4 = -_LogicMath.SIN_TABLE[v5];
    } else {
      if (v3 > 90) {
        v3 = 180 - v3;
      }
      v4 = _LogicMath.SIN_TABLE[v3];
    }
    const v6 = v4 * x;
    let v7 = (angle + 90) % 360;
    if (v7 < 0) {
      v7 += 360;
    }
    let v8;
    let v9;
    if (v7 > 179) {
      v9 = v7 - 180;
      if (v7 - 180 > 90) {
        v9 = 360 - v7;
      }
      v8 = -_LogicMath.SIN_TABLE[v9];
    } else {
      if (v7 > 90) {
        v7 = 180 - v7;
      }
      v8 = _LogicMath.SIN_TABLE[v7];
    }
    return (v6 + v8 * y) / 1024;
  }
  static NormalizeAngle180(angle) {
    angle = _LogicMath.NormalizeAngle360(angle);
    if (angle >= 180) {
      return angle - 180;
    }
    return angle;
  }
  static NormalizeAngle360(angle) {
    angle %= 360;
    if (angle < 0) {
      return angle + 360;
    }
    return angle;
  }
  static Sin(angle) {
    angle = _LogicMath.NormalizeAngle360(angle);
    if (angle < 180) {
      if (angle > 90) {
        angle = 180 - angle;
      }
      return _LogicMath.SIN_TABLE[angle];
    }
    angle -= 180;
    if (angle > 90) {
      angle = 180 - angle;
    }
    return -_LogicMath.SIN_TABLE[angle];
  }
  static Sqrt(value) {
    if (value >= 65536) {
      let num;
      if (value >= 16777216) {
        if (value >= 268435456) {
          if (value >= 1073741824) {
            if (value === 2147483647) {
              return 65535;
            }
            num = _LogicMath.SQRT_TABLE[value >> 24] << 8;
          } else {
            num = _LogicMath.SQRT_TABLE[value >> 22] << 7;
          }
        } else if (value >= 67108864) {
          num = _LogicMath.SQRT_TABLE[value >> 20] << 6;
        } else {
          num = _LogicMath.SQRT_TABLE[value >> 18] << 5;
        }
        num = num + 1 + Math.floor(value / num) >> 1;
        num = num + 1 + Math.floor(value / num) >> 1;
        return num * num <= value ? num : num - 1;
      }
      if (value >= 1048576) {
        if (value >= 4194304) {
          num = _LogicMath.SQRT_TABLE[value >> 16] << 4;
        } else {
          num = _LogicMath.SQRT_TABLE[value >> 14] << 3;
        }
      } else if (value >= 262144) {
        num = _LogicMath.SQRT_TABLE[value >> 12] << 2;
      } else {
        num = _LogicMath.SQRT_TABLE[value >> 10] << 1;
      }
      num = num + 1 + Math.floor(value / num) >> 1;
      return num * num <= value ? num : num - 1;
    }
    if (value >= 256) {
      let num;
      if (value >= 4096) {
        if (value >= 16384) {
          num = _LogicMath.SQRT_TABLE[value >> 8] + 1;
        } else {
          num = (_LogicMath.SQRT_TABLE[value >> 6] >> 1) + 1;
        }
      } else if (value >= 1024) {
        num = (_LogicMath.SQRT_TABLE[value >> 4] >> 2) + 1;
      } else {
        num = (_LogicMath.SQRT_TABLE[value >> 2] >> 3) + 1;
      }
      return num * num <= value ? num : num - 1;
    }
    if (value >= 0) {
      return _LogicMath.SQRT_TABLE[value] >> 4;
    }
    return -1;
  }
  static Clamp(clampValue, minValue, maxValue) {
    if (clampValue >= maxValue) {
      return maxValue;
    }
    if (clampValue <= minValue) {
      return minValue;
    }
    return clampValue;
  }
  static Max(valueA, valueB) {
    if (valueA >= valueB) {
      return valueA;
    }
    return valueB;
  }
  static Min(valueA, valueB) {
    if (valueA <= valueB) {
      return valueA;
    }
    return valueB;
  }
  static GetRadius(x, y) {
    x = _LogicMath.Abs(x);
    y = _LogicMath.Abs(y);
    const maxValue = _LogicMath.Max(x, y);
    const minValue = _LogicMath.Min(x, y);
    return maxValue + (53 * minValue >> 7);
  }
};
var LogicMath_default = LogicMath;

// agent/Battles/LogicAccessory.ts
var LogicAccessory = class _LogicAccessory {
  static X = 0;
  static Y = 0;
  static IsOwn = 1;
  static State = 0;
  static ActivationDelay = 0;
  static StartUsingTick = 0;
  static CoolDown = 6;
  static Uses = 3;
  static Angle = 0;
  static IsActive = 0;
  static TicksActive = 0;
  static Type = LogicAccessoryData_default.Type;
  static ActiveTicks = LogicAccessoryData_default.ActiveTicks;
  static Init() {
  }
  static PlaceHooks() {
    Interceptor.replace(Environment_default.LaserBase.add(40756), new NativeCallback(function(a1, a2, a3) {
      return _LogicAccessory.Encode(a1, a2, a3);
    }, "void", ["pointer", "pointer", "int"]));
    Interceptor.replace(Environment_default.LaserBase.add(4454708), new NativeCallback(function(a1, a2, a3, a4) {
      console.log("nigger");
      return _LogicAccessory.TriggerAccessory(a1, a2, a3, a4);
    }, "void", ["pointer", "pointer", "int", "int"]));
    Interceptor.replace(Environment_default.LaserBase.add(4339792), new NativeCallback(function(a1, a2) {
      return _LogicAccessory.UpdateAccessory(a1, a2);
    }, "void", ["pointer", "pointer"]));
  }
  static UpdateAccessory(a1, a2) {
    _LogicAccessory.State = 1;
    _LogicAccessory.CoolDown = LogicMath_default.Max(0, _LogicAccessory.CoolDown - 1);
    if (_LogicAccessory.IsActive) {
      if (_LogicAccessory.ActivationDelay < 1) {
        if (_LogicAccessory.TicksActive >= _LogicAccessory.ActiveTicks && _LogicAccessory.Type != "ulti_change") {
          _LogicAccessory.IsActive = 1;
          _LogicAccessory.CoolDown = 5;
        } else {
          _LogicAccessory.TickAccessory(a1);
          _LogicAccessory.TicksActive++;
        }
      } else {
        _LogicAccessory.ActivationDelay--;
        if (_LogicAccessory.ActivationDelay == 0) {
          _LogicAccessory.ActivateAccessory(a1);
        }
      }
    }
  }
  static TickAccessory(a1) {
    switch (_LogicAccessory.Type) {
      case "i dont know":
    }
  }
  static GetActivationAngle(a1) {
    if (_LogicAccessory.X == 0 && _LogicAccessory.Y == 0) {
    }
    return LogicMath_default.GetAngle(_LogicAccessory.X, _LogicAccessory.Y);
  }
  static ActivateAccessory(a1) {
    const LogicGameObjectServer_GetX = new NativeFunction(Environment_default.LaserBase.add(4514672), "int", ["pointer"]);
    const LogicGameObjectServer_GetY = new NativeFunction(Environment_default.LaserBase.add(4514664), "int", ["pointer"]);
    switch (_LogicAccessory.Type) {
      case "dash":
        LogicCharacterServer_default.TriggerPushback(a1, LogicGameObjectServer_GetX(a1), LogicMath_default.GetRotatedX(100, 0, _LogicAccessory.GetActivationAngle(a1)), LogicGameObjectServer_GetY(a1) - LogicMath_default.GetRotatedY(1e3, 0, _LogicAccessory.GetActivationAngle(a1)), 6, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0);
    }
  }
  static TriggerAccessory(a1, a2, a3, a4) {
    if (_LogicAccessory.CoolDown <= 0 && !_LogicAccessory.IsActive) {
      _LogicAccessory.IsActive = 1;
      _LogicAccessory.TicksActive = 0;
      _LogicAccessory.ActivateAccessory(a1);
    }
  }
  static Encode(a1, a2, a3) {
    const BitStream_writePositiveInt = new NativeFunction(Environment_default.LaserBase.add(5099956), "pointer", ["pointer", "int", "int"]);
    const BitStream_writePositiveVInt = new NativeFunction(Environment_default.LaserBase.add(5100612), "pointer", ["pointer", "int", "int"]);
    BitStream_writePositiveInt(a2, _LogicAccessory.IsActive, 1);
    if (_LogicAccessory.IsActive == 1) {
      BitStream_writePositiveVInt(a2, _LogicAccessory.CoolDown, 4);
    }
    BitStream_writePositiveInt(a2, 0, 1);
    BitStream_writePositiveVInt(a2, 7, 3);
    if (_LogicAccessory.State == 1) {
      BitStream_writePositiveInt(a2, _LogicAccessory.StartUsingTick, 14);
      BitStream_writePositiveInt(a2, _LogicAccessory.Angle, 9);
    }
    BitStream_writePositiveInt(a2, _LogicAccessory.Uses, 3);
  }
};
var LogicAccessory_default = LogicAccessory;

// agent/Battles/LogicGear.ts
var LogicGear = class _LogicGear {
  static GearType = 4;
  static CalledLogs = false;
  static Init() {
  }
  static PlaceHooks() {
    Interceptor.replace(Environment_default.LaserBase.add(40756), new NativeCallback(function(a1, a2, a3) {
      if (_LogicGear.CalledLogs == false) {
        console.log("fuck");
        _LogicGear.CalledLogs = true;
      }
      return _LogicGear.Encode(a1, a2, a3);
    }, "void", ["pointer", "pointer", "pointer"]));
  }
  static Encode(a1, a2, a3) {
    const BitStream_writePositiveInt = new NativeFunction(Environment_default.LaserBase.add(5099956), "pointer", ["pointer", "int", "int"]);
    const BitStream_writePositiveVInt = new NativeFunction(Environment_default.LaserBase.add(5100612), "pointer", ["pointer", "int", "int"]);
    BitStream_writePositiveInt(a2, 0, 1);
  }
};
var LogicGear_default = LogicGear;

// agent/Battles/OfflineBattles.ts
var OfflineBattles = class {
  static Init() {
    Debugger_default.Debug("[+][OfflineBattles::InitBattles] Initialising Battles!");
    LogicCharacterServer_default.Init();
    LogicAccessory_default.Init();
    LogicGear_default.Init();
    Debugger_default.Debug("[+][OfflineBattles::InitBattles] Initialized Battles!");
  }
};
var OfflineBattles_default = OfflineBattles;

// agent/Utils/Game/ReloadGame.ts
var ReloadGame = class {
  static Execute() {
  }
};
var ReloadGame_default = ReloadGame;

// agent/DebugMenu/DebugMenu/DebugUtils/Popups/Popups.ts
var Popups = class {
  static ShowFamePopup() {
    let FamePopupInstance = Functions_default.Imports.Malloc(1024);
    new NativeFunction(Environment_default.LaserBase.add(1578588), "void", ["pointer"])(FamePopupInstance);
    Functions_default.GUI.ShowPopup(Environment_default.LaserBase.add(15622584).readPointer(), FamePopupInstance, 0, 0, 0);
  }
  static ShowLatencyTestPopup() {
    let RankedEndPopupInstance = Functions_default.Imports.Malloc(1024);
    new NativeFunction(Environment_default.LaserBase.add(1625648), "void", ["pointer"])(RankedEndPopupInstance);
    Functions_default.GUI.ShowPopup(Environment_default.LaserBase.add(15622584).readPointer(), RankedEndPopupInstance, 1, 0, 1);
  }
  static ShowLatencdzyTestPopup() {
    let RankedEndPopupInstance = Functions_default.Imports.Malloc(1024);
    new NativeFunction(Environment_default.LaserBase.add(1625648), "void", ["pointer"])(RankedEndPopupInstance);
    Functions_default.GUI.ShowPopup(Environment_default.LaserBase.add(15622584).readPointer(), RankedEndPopupInstance, 1, 0, 1);
  }
  static ShowLatencydTestPopup() {
    let RankedEndPopupInstance = Functions_default.Imports.Malloc(1024);
    new NativeFunction(Environment_default.LaserBase.add(1625648), "void", ["pointer"])(RankedEndPopupInstance);
    Functions_default.GUI.ShowPopup(Environment_default.LaserBase.add(15622584).readPointer(), RankedEndPopupInstance, 1, 0, 1);
  }
  static ShowWasabiTestPopup() {
    let RankedEndPopupInstance = Functions_default.Imports.Malloc(1024);
    new NativeFunction(Environment_default.LaserBase.add(2150216), "void", ["pointer"])(RankedEndPopupInstance);
    Functions_default.GUI.ShowPopup(Environment_default.LaserBase.add(15622584).readPointer(), RankedEndPopupInstance, 1, 0, 1);
  }
};
var Popups_default = Popups;

// frida-shim:node_modules/@frida/path/index.js
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;
var CHAR_QUESTION_MARK = 63;
var platformIsWin32 = process_default.platform === "win32";
function isPathSeparator(code4) {
  return code4 === CHAR_FORWARD_SLASH || code4 === CHAR_BACKWARD_SLASH;
}
function isPosixPathSeparator(code4) {
  return code4 === CHAR_FORWARD_SLASH;
}
function isWindowsDeviceRoot(code4) {
  return code4 >= CHAR_UPPERCASE_A && code4 <= CHAR_UPPERCASE_Z || code4 >= CHAR_LOWERCASE_A && code4 <= CHAR_LOWERCASE_Z;
}
function normalizeString(path, allowAboveRoot, separator, isPathSeparator2) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code4 = 0;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code4 = path.charCodeAt(i);
    else if (isPathSeparator2(code4))
      break;
    else
      code4 = CHAR_FORWARD_SLASH;
    if (isPathSeparator2(code4)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length !== 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? `${separator}..` : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += `${separator}${path.slice(lastSlash + 1, i)}`;
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code4 === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep2, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || `${pathObject.name || ""}${pathObject.ext || ""}`;
  if (!dir) {
    return base;
  }
  return dir === pathObject.root ? `${dir}${base}` : `${dir}${sep2}${base}`;
}
var _win32 = {
  /**
   * path.resolve([from ...], to)
   * @param {...string} args
   * @returns {string}
   */
  resolve(...args) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for (let i = args.length - 1; i >= -1; i--) {
      let path;
      if (i >= 0) {
        path = args[i];
        if (path.length === 0) {
          continue;
        }
      } else if (resolvedDevice.length === 0) {
        path = process_default.cwd();
      } else {
        path = process_default.env[`=${resolvedDevice}`] || process_default.cwd();
        if (path === void 0 || path.slice(0, 2).toLowerCase() !== resolvedDevice.toLowerCase() && path.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
          path = `${resolvedDevice}\\`;
        }
      }
      const len = path.length;
      let rootEnd = 0;
      let device = "";
      let isAbsolute2 = false;
      const code4 = path.charCodeAt(0);
      if (len === 1) {
        if (isPathSeparator(code4)) {
          rootEnd = 1;
          isAbsolute2 = true;
        }
      } else if (isPathSeparator(code4)) {
        isAbsolute2 = true;
        if (isPathSeparator(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          while (j < len && !isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            const firstPart = path.slice(last, j);
            last = j;
            while (j < len && isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j < len && j !== last) {
              last = j;
              while (j < len && !isPathSeparator(path.charCodeAt(j))) {
                j++;
              }
              if (j === len || j !== last) {
                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code4) && path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2);
        rootEnd = 2;
        if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
          isAbsolute2 = true;
          rootEnd = 3;
        }
      }
      if (device.length > 0) {
        if (resolvedDevice.length > 0) {
          if (device.toLowerCase() !== resolvedDevice.toLowerCase())
            continue;
        } else {
          resolvedDevice = device;
        }
      }
      if (resolvedAbsolute) {
        if (resolvedDevice.length > 0)
          break;
      } else {
        resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
        resolvedAbsolute = isAbsolute2;
        if (isAbsolute2 && resolvedDevice.length > 0) {
          break;
        }
      }
    }
    resolvedTail = normalizeString(
      resolvedTail,
      !resolvedAbsolute,
      "\\",
      isPathSeparator
    );
    return resolvedAbsolute ? `${resolvedDevice}\\${resolvedTail}` : `${resolvedDevice}${resolvedTail}` || ".";
  },
  /**
   * @param {string} path
   * @returns {string}
   */
  normalize(path) {
    const len = path.length;
    if (len === 0)
      return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute2 = false;
    const code4 = path.charCodeAt(0);
    if (len === 1) {
      return isPosixPathSeparator(code4) ? "\\" : path;
    }
    if (isPathSeparator(code4)) {
      isAbsolute2 = true;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        while (j < len && !isPathSeparator(path.charCodeAt(j))) {
          j++;
        }
        if (j < len && j !== last) {
          const firstPart = path.slice(last, j);
          last = j;
          while (j < len && isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && !isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path.slice(last)}\\`;
            }
            if (j !== last) {
              device = `\\\\${firstPart}\\${path.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code4) && path.charCodeAt(1) === CHAR_COLON) {
      device = path.slice(0, 2);
      rootEnd = 2;
      if (len > 2 && isPathSeparator(path.charCodeAt(2))) {
        isAbsolute2 = true;
        rootEnd = 3;
      }
    }
    let tail = rootEnd < len ? normalizeString(
      path.slice(rootEnd),
      !isAbsolute2,
      "\\",
      isPathSeparator
    ) : "";
    if (tail.length === 0 && !isAbsolute2)
      tail = ".";
    if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1)))
      tail += "\\";
    if (device === void 0) {
      return isAbsolute2 ? `\\${tail}` : tail;
    }
    return isAbsolute2 ? `${device}\\${tail}` : `${device}${tail}`;
  },
  /**
   * @param {string} path
   * @returns {boolean}
   */
  isAbsolute(path) {
    const len = path.length;
    if (len === 0)
      return false;
    const code4 = path.charCodeAt(0);
    return isPathSeparator(code4) || // Possible device root
    len > 2 && isWindowsDeviceRoot(code4) && path.charCodeAt(1) === CHAR_COLON && isPathSeparator(path.charCodeAt(2));
  },
  /**
   * @param {...string} args
   * @returns {string}
   */
  join(...args) {
    if (args.length === 0)
      return ".";
    let joined;
    let firstPart;
    for (let i = 0; i < args.length; ++i) {
      const arg = args[i];
      if (arg.length > 0) {
        if (joined === void 0)
          joined = firstPart = arg;
        else
          joined += `\\${arg}`;
      }
    }
    if (joined === void 0)
      return ".";
    let needsReplace = true;
    let slashCount = 0;
    if (isPathSeparator(firstPart.charCodeAt(0))) {
      ++slashCount;
      const firstLen = firstPart.length;
      if (firstLen > 1 && isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2)))
            ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
    if (needsReplace) {
      while (slashCount < joined.length && isPathSeparator(joined.charCodeAt(slashCount))) {
        slashCount++;
      }
      if (slashCount >= 2)
        joined = `\\${joined.slice(slashCount)}`;
    }
    return _win32.normalize(joined);
  },
  /**
   * It will solve the relative path from `from` to `to`, for instancee
   * from = 'C:\\orandea\\test\\aaa'
   * to = 'C:\\orandea\\impl\\bbb'
   * The output of the function should be: '..\\..\\impl\\bbb'
   * @param {string} from
   * @param {string} to
   * @returns {string}
   */
  relative(from3, to) {
    if (from3 === to)
      return "";
    const fromOrig = _win32.resolve(from3);
    const toOrig = _win32.resolve(to);
    if (fromOrig === toOrig)
      return "";
    from3 = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from3 === to)
      return "";
    let fromStart = 0;
    while (fromStart < from3.length && from3.charCodeAt(fromStart) === CHAR_BACKWARD_SLASH) {
      fromStart++;
    }
    let fromEnd = from3.length;
    while (fromEnd - 1 > fromStart && from3.charCodeAt(fromEnd - 1) === CHAR_BACKWARD_SLASH) {
      fromEnd--;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    while (toStart < to.length && to.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) {
      toStart++;
    }
    let toEnd = to.length;
    while (toEnd - 1 > toStart && to.charCodeAt(toEnd - 1) === CHAR_BACKWARD_SLASH) {
      toEnd--;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i < length; i++) {
      const fromCode = from3.charCodeAt(fromStart + i);
      if (fromCode !== to.charCodeAt(toStart + i))
        break;
      else if (fromCode === CHAR_BACKWARD_SLASH)
        lastCommonSep = i;
    }
    if (i !== length) {
      if (lastCommonSep === -1)
        return toOrig;
    } else {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
          return toOrig.slice(toStart + i + 1);
        }
        if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from3.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      if (lastCommonSep === -1)
        lastCommonSep = 0;
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from3.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
        out += out.length === 0 ? ".." : "\\..";
      }
    }
    toStart += lastCommonSep;
    if (out.length > 0)
      return `${out}${toOrig.slice(toStart, toEnd)}`;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH)
      ++toStart;
    return toOrig.slice(toStart, toEnd);
  },
  /**
   * @param {string} path
   * @returns {string}
   */
  toNamespacedPath(path) {
    if (typeof path !== "string" || path.length === 0)
      return path;
    const resolvedPath = _win32.resolve(path);
    if (resolvedPath.length <= 2)
      return path;
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code4 = resolvedPath.charCodeAt(2);
        if (code4 !== CHAR_QUESTION_MARK && code4 !== CHAR_DOT) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0)) && resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
      return `\\\\?\\${resolvedPath}`;
    }
    return path;
  },
  /**
   * @param {string} path
   * @returns {string}
   */
  dirname(path) {
    const len = path.length;
    if (len === 0)
      return ".";
    let rootEnd = -1;
    let offset = 0;
    const code4 = path.charCodeAt(0);
    if (len === 1) {
      return isPathSeparator(code4) ? path : ".";
    }
    if (isPathSeparator(code4)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        while (j < len && !isPathSeparator(path.charCodeAt(j))) {
          j++;
        }
        if (j < len && j !== last) {
          last = j;
          while (j < len && isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && !isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j === len) {
              return path;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code4) && path.charCodeAt(1) === CHAR_COLON) {
      rootEnd = len > 2 && isPathSeparator(path.charCodeAt(2)) ? 3 : 2;
      offset = rootEnd;
    }
    let end = -1;
    let matchedSlash = true;
    for (let i = len - 1; i >= offset; --i) {
      if (isPathSeparator(path.charCodeAt(i))) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1) {
      if (rootEnd === -1)
        return ".";
      end = rootEnd;
    }
    return path.slice(0, end);
  },
  /**
   * @param {string} path
   * @param {string} [ext]
   * @returns {string}
   */
  basename(path, ext) {
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    if (path.length >= 2 && isWindowsDeviceRoot(path.charCodeAt(0)) && path.charCodeAt(1) === CHAR_COLON) {
      start = 2;
    }
    if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
      if (ext === path)
        return "";
      let extIdx = ext.length - 1;
      let firstNonSlashEnd = -1;
      for (let i = path.length - 1; i >= start; --i) {
        const code4 = path.charCodeAt(i);
        if (isPathSeparator(code4)) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code4 === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end)
        end = firstNonSlashEnd;
      else if (end === -1)
        end = path.length;
      return path.slice(start, end);
    }
    for (let i = path.length - 1; i >= start; --i) {
      if (isPathSeparator(path.charCodeAt(i))) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path.slice(start, end);
  },
  /**
   * @param {string} path
   * @returns {string}
   */
  extname(path) {
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path.length >= 2 && path.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path.charCodeAt(0))) {
      start = startPart = 2;
    }
    for (let i = path.length - 1; i >= start; --i) {
      const code4 = path.charCodeAt(i);
      if (isPathSeparator(code4)) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code4 === CHAR_DOT) {
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: _format.bind(null, "\\"),
  /**
   * @param {string} path
   * @returns {{
   *  dir: string;
   *  root: string;
   *  base: string;
   *  name: string;
   *  ext: string;
   *  }}
   */
  parse(path) {
    const ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0)
      return ret;
    const len = path.length;
    let rootEnd = 0;
    let code4 = path.charCodeAt(0);
    if (len === 1) {
      if (isPathSeparator(code4)) {
        ret.root = ret.dir = path;
        return ret;
      }
      ret.base = ret.name = path;
      return ret;
    }
    if (isPathSeparator(code4)) {
      rootEnd = 1;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        while (j < len && !isPathSeparator(path.charCodeAt(j))) {
          j++;
        }
        if (j < len && j !== last) {
          last = j;
          while (j < len && isPathSeparator(path.charCodeAt(j))) {
            j++;
          }
          if (j < len && j !== last) {
            last = j;
            while (j < len && !isPathSeparator(path.charCodeAt(j))) {
              j++;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code4) && path.charCodeAt(1) === CHAR_COLON) {
      if (len <= 2) {
        ret.root = ret.dir = path;
        return ret;
      }
      rootEnd = 2;
      if (isPathSeparator(path.charCodeAt(2))) {
        if (len === 3) {
          ret.root = ret.dir = path;
          return ret;
        }
        rootEnd = 3;
      }
    }
    if (rootEnd > 0)
      ret.root = path.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= rootEnd; --i) {
      code4 = path.charCodeAt(i);
      if (isPathSeparator(code4)) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code4 === CHAR_DOT) {
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (end !== -1) {
      if (startDot === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        ret.base = ret.name = path.slice(startPart, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
      }
    }
    if (startPart > 0 && startPart !== rootEnd)
      ret.dir = path.slice(0, startPart - 1);
    else
      ret.dir = ret.root;
    return ret;
  },
  sep: "\\",
  delimiter: ";",
  win32: null,
  posix: null
};
var posixCwd = (() => {
  if (platformIsWin32) {
    const regexp = /\\/g;
    return () => {
      const cwd2 = process_default.cwd().replace(regexp, "/");
      return cwd2.slice(cwd2.indexOf("/"));
    };
  }
  return () => process_default.cwd();
})();
var _posix = {
  /**
   * path.resolve([from ...], to)
   * @param {...string} args
   * @returns {string}
   */
  resolve(...args) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for (let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      const path = i >= 0 ? args[i] : posixCwd();
      if (path.length === 0) {
        continue;
      }
      resolvedPath = `${path}/${resolvedPath}`;
      resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    resolvedPath = normalizeString(
      resolvedPath,
      !resolvedAbsolute,
      "/",
      isPosixPathSeparator
    );
    if (resolvedAbsolute) {
      return `/${resolvedPath}`;
    }
    return resolvedPath.length > 0 ? resolvedPath : ".";
  },
  /**
   * @param {string} path
   * @returns {string}
   */
  normalize(path) {
    if (path.length === 0)
      return ".";
    const isAbsolute2 = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    const trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
    path = normalizeString(path, !isAbsolute2, "/", isPosixPathSeparator);
    if (path.length === 0) {
      if (isAbsolute2)
        return "/";
      return trailingSeparator ? "./" : ".";
    }
    if (trailingSeparator)
      path += "/";
    return isAbsolute2 ? `/${path}` : path;
  },
  /**
   * @param {string} path
   * @returns {boolean}
   */
  isAbsolute(path) {
    return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
  },
  /**
   * @param {...string} args
   * @returns {string}
   */
  join(...args) {
    if (args.length === 0)
      return ".";
    let joined;
    for (let i = 0; i < args.length; ++i) {
      const arg = args[i];
      if (arg.length > 0) {
        if (joined === void 0)
          joined = arg;
        else
          joined += `/${arg}`;
      }
    }
    if (joined === void 0)
      return ".";
    return _posix.normalize(joined);
  },
  /**
   * @param {string} from
   * @param {string} to
   * @returns {string}
   */
  relative(from3, to) {
    if (from3 === to)
      return "";
    from3 = _posix.resolve(from3);
    to = _posix.resolve(to);
    if (from3 === to)
      return "";
    const fromStart = 1;
    const fromEnd = from3.length;
    const fromLen = fromEnd - fromStart;
    const toStart = 1;
    const toLen = to.length - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i < length; i++) {
      const fromCode = from3.charCodeAt(fromStart + i);
      if (fromCode !== to.charCodeAt(toStart + i))
        break;
      else if (fromCode === CHAR_FORWARD_SLASH)
        lastCommonSep = i;
    }
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
          return to.slice(toStart + i + 1);
        }
        if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from3.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from3.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        out += out.length === 0 ? ".." : "/..";
      }
    }
    return `${out}${to.slice(toStart + lastCommonSep)}`;
  },
  /**
   * @param {string} path
   * @returns {string}
   */
  toNamespacedPath(path) {
    return path;
  },
  /**
   * @param {string} path
   * @returns {string}
   */
  dirname(path) {
    if (path.length === 0)
      return ".";
    const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
      if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1)
      return hasRoot ? "/" : ".";
    if (hasRoot && end === 1)
      return "//";
    return path.slice(0, end);
  },
  /**
   * @param {string} path
   * @param {string} [ext]
   * @returns {string}
   */
  basename(path, ext) {
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
      if (ext === path)
        return "";
      let extIdx = ext.length - 1;
      let firstNonSlashEnd = -1;
      for (let i = path.length - 1; i >= 0; --i) {
        const code4 = path.charCodeAt(i);
        if (code4 === CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code4 === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end)
        end = firstNonSlashEnd;
      else if (end === -1)
        end = path.length;
      return path.slice(start, end);
    }
    for (let i = path.length - 1; i >= 0; --i) {
      if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path.slice(start, end);
  },
  /**
   * @param {string} path
   * @returns {string}
   */
  extname(path) {
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i = path.length - 1; i >= 0; --i) {
      const code4 = path.charCodeAt(i);
      if (code4 === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code4 === CHAR_DOT) {
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: _format.bind(null, "/"),
  /**
   * @param {string} path
   * @returns {{
   *   dir: string;
   *   root: string;
   *   base: string;
   *   name: string;
   *   ext: string;
   *   }}
   */
  parse(path) {
    const ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0)
      return ret;
    const isAbsolute2 = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    let start;
    if (isAbsolute2) {
      ret.root = "/";
      start = 1;
    } else {
      start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= start; --i) {
      const code4 = path.charCodeAt(i);
      if (code4 === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code4 === CHAR_DOT) {
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (end !== -1) {
      const start2 = startPart === 0 && isAbsolute2 ? 1 : startPart;
      if (startDot === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        ret.base = ret.name = path.slice(start2, end);
      } else {
        ret.name = path.slice(start2, startDot);
        ret.base = path.slice(start2, end);
        ret.ext = path.slice(startDot, end);
      }
    }
    if (startPart > 0)
      ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute2)
      ret.dir = "/";
    return ret;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
_posix.win32 = _win32.win32 = _win32;
_posix.posix = _win32.posix = _posix;
var impl = platformIsWin32 ? _win32 : _posix;
var path_default = impl;
var {
  resolve,
  normalize,
  isAbsolute,
  join,
  relative,
  toNamespacedPath,
  dirname,
  basename: basename2,
  extname,
  format,
  parse,
  sep,
  delimiter,
  win32,
  posix
} = impl;

// frida-shim:node_modules/@frida/util/support/types.js
var types_exports = {};
__export(types_exports, {
  isAnyArrayBuffer: () => isAnyArrayBuffer,
  isArgumentsObject: () => isArgumentsObject,
  isArrayBuffer: () => isArrayBuffer,
  isArrayBufferView: () => isArrayBufferView,
  isAsyncFunction: () => isAsyncFunction,
  isBigInt64Array: () => isBigInt64Array,
  isBigIntObject: () => isBigIntObject,
  isBigUint64Array: () => isBigUint64Array,
  isBooleanObject: () => isBooleanObject,
  isBoxedPrimitive: () => isBoxedPrimitive,
  isDataView: () => isDataView,
  isExternal: () => isExternal,
  isFloat32Array: () => isFloat32Array,
  isFloat64Array: () => isFloat64Array,
  isGeneratorFunction: () => isGeneratorFunction,
  isGeneratorObject: () => isGeneratorObject,
  isInt16Array: () => isInt16Array,
  isInt32Array: () => isInt32Array,
  isInt8Array: () => isInt8Array,
  isMap: () => isMap,
  isMapIterator: () => isMapIterator,
  isModuleNamespaceObject: () => isModuleNamespaceObject,
  isNumberObject: () => isNumberObject,
  isPromise: () => isPromise,
  isProxy: () => isProxy,
  isSet: () => isSet,
  isSetIterator: () => isSetIterator,
  isSharedArrayBuffer: () => isSharedArrayBuffer,
  isStringObject: () => isStringObject,
  isSymbolObject: () => isSymbolObject,
  isTypedArray: () => isTypedArray,
  isUint16Array: () => isUint16Array,
  isUint32Array: () => isUint32Array,
  isUint8Array: () => isUint8Array,
  isUint8ClampedArray: () => isUint8ClampedArray,
  isWeakMap: () => isWeakMap,
  isWeakSet: () => isWeakSet,
  isWebAssemblyCompiledModule: () => isWebAssemblyCompiledModule
});
var ObjectToString = uncurryThis(Object.prototype.toString);
var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);
var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
var symbolValue = uncurryThis(Symbol.prototype.valueOf);
var generatorPrototype = Object.getPrototypeOf(function* () {
});
var typedArrayPrototype = Object.getPrototypeOf(Int8Array);
function isArgumentsObject(value) {
  if (value !== null && typeof value === "object" && Symbol.toStringTag in value) {
    return false;
  }
  return ObjectToString(value) === "[object Arguments]";
}
function isGeneratorFunction(value) {
  return Object.getPrototypeOf(value) === generatorPrototype;
}
function isTypedArray(value) {
  return value instanceof typedArrayPrototype;
}
function isPromise(input) {
  return input instanceof Promise;
}
function isArrayBufferView(value) {
  return ArrayBuffer.isView(value);
}
function isUint8Array(value) {
  return value instanceof Uint8Array;
}
function isUint8ClampedArray(value) {
  return value instanceof Uint8ClampedArray;
}
function isUint16Array(value) {
  return value instanceof Uint16Array;
}
function isUint32Array(value) {
  return value instanceof Uint32Array;
}
function isInt8Array(value) {
  return value instanceof Int8Array;
}
function isInt16Array(value) {
  return value instanceof Int16Array;
}
function isInt32Array(value) {
  return value instanceof Int32Array;
}
function isFloat32Array(value) {
  return value instanceof Float32Array;
}
function isFloat64Array(value) {
  return value instanceof Float64Array;
}
function isBigInt64Array(value) {
  return value instanceof BigInt64Array;
}
function isBigUint64Array(value) {
  return value instanceof BigUint64Array;
}
function isMap(value) {
  return ObjectToString(value) === "[object Map]";
}
function isSet(value) {
  return ObjectToString(value) === "[object Set]";
}
function isWeakMap(value) {
  return ObjectToString(value) === "[object WeakMap]";
}
function isWeakSet(value) {
  return ObjectToString(value) === "[object WeakSet]";
}
function isArrayBuffer(value) {
  return ObjectToString(value) === "[object ArrayBuffer]";
}
function isDataView(value) {
  return ObjectToString(value) === "[object DataView]";
}
function isSharedArrayBuffer(value) {
  return ObjectToString(value) === "[object SharedArrayBuffer]";
}
function isAsyncFunction(value) {
  return ObjectToString(value) === "[object AsyncFunction]";
}
function isMapIterator(value) {
  return ObjectToString(value) === "[object Map Iterator]";
}
function isSetIterator(value) {
  return ObjectToString(value) === "[object Set Iterator]";
}
function isGeneratorObject(value) {
  return ObjectToString(value) === "[object Generator]";
}
function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === "[object WebAssembly.Module]";
}
function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
function isBigIntObject(value) {
  return checkBoxedPrimitive(value, bigIntValue);
}
function isSymbolObject(value) {
  return checkBoxedPrimitive(value, symbolValue);
}
function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== "object") {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch (e) {
    return false;
  }
}
function isBoxedPrimitive(value) {
  return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
}
function isAnyArrayBuffer(value) {
  return isArrayBuffer(value) || isSharedArrayBuffer(value);
}
function isProxy(value) {
  throwNotSupported("isProxy");
}
function isExternal(value) {
  throwNotSupported("isExternal");
}
function isModuleNamespaceObject(value) {
  throwNotSupported("isModuleNamespaceObject");
}
function throwNotSupported(method2) {
  throw new Error(`${method2} is not supported in userland`);
}
function uncurryThis(f2) {
  return f2.call.bind(f2);
}

// frida-shim:node_modules/@frida/util/util.js
var types2 = {
  ...types_exports,
  isRegExp,
  isDate,
  isNativeError: isError
};
var formatRegExp = /%[sdj%]/g;
function format2(f2) {
  if (!isString(f2)) {
    const objects = [];
    for (let i2 = 0; i2 < arguments.length; i2++) {
      objects.push(inspect2(arguments[i2]));
    }
    return objects.join(" ");
  }
  let i = 1;
  const args = arguments;
  const len = args.length;
  let str = String(f2).replace(formatRegExp, function(x) {
    if (x === "%%") return "%";
    if (i >= len) return x;
    switch (x) {
      case "%s":
        return String(args[i++]);
      case "%d":
        return Number(args[i++]);
      case "%j":
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return "[Circular]";
        }
      default:
        return x;
    }
  });
  for (let x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += " " + x;
    } else {
      str += " " + inspect2(x);
    }
  }
  return str;
}
var debugEnvRegex = /^$/;
if (process_default.env.NODE_DEBUG) {
  let debugEnv = process_default.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
  debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
}
function inspect2(obj, opts) {
  const ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    ctx.showHidden = opts;
  } else if (opts) {
    _extend(ctx, opts);
  }
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
inspect2.custom = Symbol.for("nodejs.util.inspect.custom");
inspect2.colors = {
  "bold": [1, 22],
  "italic": [3, 23],
  "underline": [4, 24],
  "inverse": [7, 27],
  "white": [37, 39],
  "grey": [90, 39],
  "black": [30, 39],
  "blue": [34, 39],
  "cyan": [36, 39],
  "green": [32, 39],
  "magenta": [35, 39],
  "red": [31, 39],
  "yellow": [33, 39]
};
inspect2.styles = {
  "special": "cyan",
  "number": "yellow",
  "boolean": "yellow",
  "undefined": "grey",
  "null": "bold",
  "string": "green",
  "date": "magenta",
  // "name": intentionally not styling
  "regexp": "red"
};
function stylizeWithColor(str, styleType) {
  const style = inspect2.styles[styleType];
  if (style) {
    return "\x1B[" + inspect2.colors[style][0] + "m" + str + "\x1B[" + inspect2.colors[style][1] + "m";
  } else {
    return str;
  }
}
function stylizeNoColor(str, styleType) {
  return str;
}
function arrayToHash(array) {
  const hash = {};
  array.forEach(function(val, idx) {
    hash[val] = true;
  });
  return hash;
}
function formatValue(ctx, value, recurseTimes) {
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== inspect2 && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    let ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }
  const primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }
  let keys = Object.keys(value);
  const visibleKeys = arrayToHash(keys);
  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }
  if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
    return formatError(value);
  }
  if (keys.length === 0) {
    if (isFunction(value)) {
      const name = value.name ? ": " + value.name : "";
      return ctx.stylize("[Function" + name + "]", "special");
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), "date");
    }
    if (isError(value)) {
      return formatError(value);
    }
  }
  let base = "", array = false, braces = ["{", "}"];
  if (isArray(value)) {
    array = true;
    braces = ["[", "]"];
  }
  if (isFunction(value)) {
    const n = value.name ? ": " + value.name : "";
    base = " [Function" + n + "]";
  }
  if (isRegExp(value)) {
    base = " " + RegExp.prototype.toString.call(value);
  }
  if (isDate(value)) {
    base = " " + Date.prototype.toUTCString.call(value);
  }
  if (isError(value)) {
    base = " " + formatError(value);
  }
  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }
  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    } else {
      return ctx.stylize("[Object]", "special");
    }
  }
  ctx.seen.push(value);
  let output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }
  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize("undefined", "undefined");
  if (isString(value)) {
    const simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return ctx.stylize(simple, "string");
  }
  if (isNumber(value))
    return ctx.stylize("" + value, "number");
  if (isBoolean(value))
    return ctx.stylize("" + value, "boolean");
  if (isNull(value))
    return ctx.stylize("null", "null");
}
function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  const output = [];
  for (let i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(
        ctx,
        value,
        recurseTimes,
        visibleKeys,
        String(i),
        true
      ));
    } else {
      output.push("");
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(
        ctx,
        value,
        recurseTimes,
        visibleKeys,
        key,
        true
      ));
    }
  });
  return output;
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  let name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize("[Getter/Setter]", "special");
    } else {
      str = ctx.stylize("[Getter]", "special");
    }
  } else {
    if (desc.set) {
      str = ctx.stylize("[Setter]", "special");
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = "[" + key + "]";
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf("\n") > -1) {
        if (array) {
          str = str.split("\n").map(function(line) {
            return "  " + line;
          }).join("\n").substr(2);
        } else {
          str = "\n" + str.split("\n").map(function(line) {
            return "   " + line;
          }).join("\n");
        }
      }
    } else {
      str = ctx.stylize("[Circular]", "special");
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify("" + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, "name");
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, "string");
    }
  }
  return name + ": " + str;
}
function reduceToSingleString(output, base, braces) {
  let numLinesEst = 0;
  const length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf("\n") >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  if (length > 60) {
    return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
  }
  return braces[0] + base + " " + output.join(", ") + " " + braces[1];
}
function isArray(ar) {
  return Array.isArray(ar);
}
function isBoolean(arg) {
  return typeof arg === "boolean";
}
function isNull(arg) {
  return arg === null;
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isString(arg) {
  return typeof arg === "string";
}
function isUndefined(arg) {
  return arg === void 0;
}
function isRegExp(re) {
  return isObject(re) && objectToString(re) === "[object RegExp]";
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isDate(d) {
  return isObject(d) && objectToString(d) === "[object Date]";
}
function isError(e) {
  return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
}
function isFunction(arg) {
  return typeof arg === "function";
}
function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function _extend(origin, add) {
  if (!add || !isObject(add)) return origin;
  const keys = Object.keys(add);
  let i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var kCustomPromisifiedSymbol = Symbol("util.promisify.custom");
function promisify(original) {
  if (typeof original !== "function")
    throw new TypeError('The "original" argument must be of type Function');
  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    const fn2 = original[kCustomPromisifiedSymbol];
    if (typeof fn2 !== "function") {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn2, kCustomPromisifiedSymbol, {
      value: fn2,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return fn2;
  }
  function fn() {
    let promiseResolve, promiseReject;
    const promise = new Promise(function(resolve2, reject) {
      promiseResolve = resolve2;
      promiseReject = reject;
    });
    const args = [];
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function(err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });
    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }
    return promise;
  }
  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(
    fn,
    Object.getOwnPropertyDescriptors(original)
  );
}
promisify.custom = kCustomPromisifiedSymbol;

// frida-shim:node_modules/@frida/readable-stream/errors.js
var messages = /* @__PURE__ */ new Map();
var codes = {};
function aggregateTwoErrors(innerError, outerError) {
  if (innerError && outerError && innerError !== outerError) {
    if (Array.isArray(outerError.errors)) {
      outerError.errors.push(innerError);
      return outerError;
    }
    const err = new AggregateError([
      outerError,
      innerError
    ], outerError.message);
    err.code = outerError.code;
    return err;
  }
  return innerError || outerError;
}
function makeNodeErrorWithCode(Base, key) {
  return function NodeError(...args) {
    const error = new Base();
    const message = getMessage(key, args, error);
    Object.defineProperties(error, {
      message: {
        value: message,
        enumerable: false,
        writable: true,
        configurable: true
      },
      toString: {
        value() {
          return `${this.name} [${key}]: ${this.message}`;
        },
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    error.code = key;
    return error;
  };
}
function E2(sym, val, def, ...otherClasses) {
  messages.set(sym, val);
  def = makeNodeErrorWithCode(def, sym);
  if (otherClasses.length !== 0) {
    otherClasses.forEach((clazz) => {
      def[clazz.name] = makeNodeErrorWithCode(clazz, sym);
    });
  }
  codes[sym] = def;
}
function getMessage(key, args, self) {
  const msg = messages.get(key);
  if (typeof msg === "function") {
    return Reflect.apply(msg, self, args);
  }
  const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length;
  if (args.length === 0)
    return msg;
  args.unshift(msg);
  return Reflect.apply(format2, null, args);
}
var AbortError = class extends Error {
  constructor() {
    super("The operation was aborted");
    this.code = "ABORT_ERR";
    this.name = "AbortError";
  }
};
E2("ERR_EVENT_RECURSION", 'The event "%s" is already being dispatched', Error);
E2("ERR_ILLEGAL_CONSTRUCTOR", "Illegal constructor", TypeError);
E2("ERR_INVALID_ARG_TYPE", "Invalid argument type", TypeError);
E2("ERR_INVALID_ARG_VALUE", "Invalid argument value", TypeError, RangeError);
E2("ERR_INVALID_RETURN_VALUE", "Invalid return value", TypeError, RangeError);
E2("ERR_INVALID_THIS", 'Value of "this" must be of type %s', TypeError);
E2("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error);
E2("ERR_MISSING_ARGS", "Missing argument", TypeError);
E2("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error);
E2("ERR_OUT_OF_RANGE", "Out of range", RangeError);
E2(
  "ERR_STREAM_ALREADY_FINISHED",
  "Cannot call %s after a stream was finished",
  Error
);
E2("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error);
E2("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error);
E2("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
E2("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error);
E2("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error);
E2(
  "ERR_STREAM_UNSHIFT_AFTER_END_EVENT",
  "stream.unshift() after end event",
  Error
);
E2("ERR_STREAM_WRITE_AFTER_END", "write after end", Error);
E2("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError);

// frida-shim:node_modules/@frida/readable-stream/lib/once.js
function once2(callback) {
  let called = false;
  return function(...args) {
    if (called) return;
    called = true;
    Reflect.apply(callback, this, args);
  };
}

// frida-shim:node_modules/@frida/readable-stream/lib/utils.js
var kDestroyed = Symbol("kDestroyed");
var kIsDisturbed = Symbol("kIsDisturbed");
function isReadableNodeStream(obj) {
  return !!(obj && typeof obj.pipe === "function" && typeof obj.on === "function" && (!obj._writableState || obj._readableState?.readable !== false) && // Duplex
  (!obj._writableState || obj._readableState));
}
function isWritableNodeStream(obj) {
  return !!(obj && typeof obj.write === "function" && typeof obj.on === "function" && (!obj._readableState || obj._writableState?.writable !== false));
}
function isDuplexNodeStream(obj) {
  return !!(obj && (typeof obj.pipe === "function" && obj._readableState) && typeof obj.on === "function" && typeof obj.write === "function");
}
function isNodeStream(obj) {
  return obj && (obj._readableState || obj._writableState || typeof obj.write === "function" && typeof obj.on === "function" || typeof obj.pipe === "function" && typeof obj.on === "function");
}
function isIterable(obj, isAsync) {
  if (obj == null) return false;
  if (isAsync === true) return typeof obj[Symbol.asyncIterator] === "function";
  if (isAsync === false) return typeof obj[Symbol.iterator] === "function";
  return typeof obj[Symbol.asyncIterator] === "function" || typeof obj[Symbol.iterator] === "function";
}
function isDestroyed(stream) {
  if (!isNodeStream(stream)) return null;
  const wState = stream._writableState;
  const rState = stream._readableState;
  const state = wState || rState;
  return !!(stream.destroyed || stream[kDestroyed] || state?.destroyed);
}
function isWritableEnded(stream) {
  if (!isWritableNodeStream(stream)) return null;
  if (stream.writableEnded === true) return true;
  const wState = stream._writableState;
  if (wState?.errored) return false;
  if (typeof wState?.ended !== "boolean") return null;
  return wState.ended;
}
function isWritableFinished(stream, strict) {
  if (!isWritableNodeStream(stream)) return null;
  if (stream.writableFinished === true) return true;
  const wState = stream._writableState;
  if (wState?.errored) return false;
  if (typeof wState?.finished !== "boolean") return null;
  return !!(wState.finished || strict === false && wState.ended === true && wState.length === 0);
}
function isReadableFinished(stream, strict) {
  if (!isReadableNodeStream(stream)) return null;
  const rState = stream._readableState;
  if (rState?.errored) return false;
  if (typeof rState?.endEmitted !== "boolean") return null;
  return !!(rState.endEmitted || strict === false && rState.ended === true && rState.length === 0);
}
function isReadable(stream) {
  const r = isReadableNodeStream(stream);
  if (r === null || typeof stream?.readable !== "boolean") return null;
  if (isDestroyed(stream)) return false;
  return r && stream.readable && !isReadableFinished(stream);
}
function isWritable(stream) {
  const r = isWritableNodeStream(stream);
  if (r === null || typeof stream?.writable !== "boolean") return null;
  if (isDestroyed(stream)) return false;
  return r && stream.writable && !isWritableEnded(stream);
}
function isFinished(stream, opts) {
  if (!isNodeStream(stream)) {
    return null;
  }
  if (isDestroyed(stream)) {
    return true;
  }
  if (opts?.readable !== false && isReadable(stream)) {
    return false;
  }
  if (opts?.writable !== false && isWritable(stream)) {
    return false;
  }
  return true;
}
function isClosed(stream) {
  if (!isNodeStream(stream)) {
    return null;
  }
  const wState = stream._writableState;
  const rState = stream._readableState;
  if (typeof wState?.closed === "boolean" || typeof rState?.closed === "boolean") {
    return wState?.closed || rState?.closed;
  }
  if (typeof stream._closed === "boolean" && isOutgoingMessage(stream)) {
    return stream._closed;
  }
  return null;
}
function isOutgoingMessage(stream) {
  return typeof stream._closed === "boolean" && typeof stream._defaultKeepAlive === "boolean" && typeof stream._removedConnection === "boolean" && typeof stream._removedContLen === "boolean";
}
function isServerResponse(stream) {
  return typeof stream._sent100 === "boolean" && isOutgoingMessage(stream);
}
function isServerRequest(stream) {
  return typeof stream._consuming === "boolean" && typeof stream._dumped === "boolean" && stream.req?.upgradeOrConnect === void 0;
}
function willEmitClose(stream) {
  if (!isNodeStream(stream)) return null;
  const wState = stream._writableState;
  const rState = stream._readableState;
  const state = wState || rState;
  return !state && isServerResponse(stream) || !!(state && state.autoDestroy && state.emitClose && state.closed === false);
}
function isDisturbed(stream) {
  return !!(stream && (stream.readableDidRead || stream.readableAborted || stream[kIsDisturbed]));
}

// frida-shim:node_modules/@frida/readable-stream/lib/end-of-stream.js
var {
  ERR_STREAM_PREMATURE_CLOSE
} = codes;
function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === "function";
}
var nop = () => {
};
function eos(stream, options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  } else if (options == null) {
    options = {};
  }
  callback = once2(callback);
  const readable = options.readable || options.readable !== false && isReadableNodeStream(stream);
  const writable = options.writable || options.writable !== false && isWritableNodeStream(stream);
  if (isNodeStream(stream)) {
  } else {
  }
  const wState = stream._writableState;
  const rState = stream._readableState;
  const onlegacyfinish = () => {
    if (!stream.writable) onfinish();
  };
  let willEmitClose2 = willEmitClose(stream) && isReadableNodeStream(stream) === readable && isWritableNodeStream(stream) === writable;
  let writableFinished = isWritableFinished(stream, false);
  const onfinish = () => {
    writableFinished = true;
    if (stream.destroyed) willEmitClose2 = false;
    if (willEmitClose2 && (!stream.readable || readable)) return;
    if (!readable || readableFinished) callback.call(stream);
  };
  let readableFinished = isReadableFinished(stream, false);
  const onend = () => {
    readableFinished = true;
    if (stream.destroyed) willEmitClose2 = false;
    if (willEmitClose2 && (!stream.writable || writable)) return;
    if (!writable || writableFinished) callback.call(stream);
  };
  const onerror = (err) => {
    callback.call(stream, err);
  };
  let closed = isClosed(stream);
  const onclose = () => {
    closed = true;
    const errored = wState?.errored || rState?.errored;
    if (errored && typeof errored !== "boolean") {
      return callback.call(stream, errored);
    }
    if (readable && !readableFinished) {
      if (!isReadableFinished(stream, false))
        return callback.call(
          stream,
          new ERR_STREAM_PREMATURE_CLOSE()
        );
    }
    if (writable && !writableFinished) {
      if (!isWritableFinished(stream, false))
        return callback.call(
          stream,
          new ERR_STREAM_PREMATURE_CLOSE()
        );
    }
    callback.call(stream);
  };
  const onrequest = () => {
    stream.req.on("finish", onfinish);
  };
  if (isRequest(stream)) {
    stream.on("complete", onfinish);
    if (!willEmitClose2) {
      stream.on("abort", onclose);
    }
    if (stream.req) onrequest();
    else stream.on("request", onrequest);
  } else if (writable && !wState) {
    stream.on("end", onlegacyfinish);
    stream.on("close", onlegacyfinish);
  }
  if (!willEmitClose2 && typeof stream.aborted === "boolean") {
    stream.on("aborted", onclose);
  }
  stream.on("end", onend);
  stream.on("finish", onfinish);
  if (options.error !== false) stream.on("error", onerror);
  stream.on("close", onclose);
  if (closed) {
    process_default.nextTick(onclose);
  } else if (wState?.errorEmitted || rState?.errorEmitted) {
    if (!willEmitClose2) {
      process_default.nextTick(onclose);
    }
  } else if (!readable && (!willEmitClose2 || isReadable(stream)) && (writableFinished || !isWritable(stream))) {
    process_default.nextTick(onclose);
  } else if (!writable && (!willEmitClose2 || isWritable(stream)) && (readableFinished || !isReadable(stream))) {
    process_default.nextTick(onclose);
  } else if (rState && stream.req && stream.aborted) {
    process_default.nextTick(onclose);
  }
  const cleanup = () => {
    callback = nop;
    stream.removeListener("aborted", onclose);
    stream.removeListener("complete", onfinish);
    stream.removeListener("abort", onclose);
    stream.removeListener("request", onrequest);
    if (stream.req) stream.req.removeListener("finish", onfinish);
    stream.removeListener("end", onlegacyfinish);
    stream.removeListener("close", onlegacyfinish);
    stream.removeListener("finish", onfinish);
    stream.removeListener("end", onend);
    stream.removeListener("error", onerror);
    stream.removeListener("close", onclose);
  };
  if (options.signal && !closed) {
    const abort = () => {
      const endCallback = callback;
      cleanup();
      endCallback.call(stream, new AbortError());
    };
    if (options.signal.aborted) {
      process_default.nextTick(abort);
    } else {
      const originalCallback = callback;
      callback = once2((...args) => {
        options.signal.removeEventListener("abort", abort);
        originalCallback.apply(stream, args);
      });
      options.signal.addEventListener("abort", abort);
    }
  }
  return cleanup;
}

// frida-shim:node_modules/@frida/readable-stream/lib/add-abort-signal.js
var { ERR_INVALID_ARG_TYPE } = codes;
var validateAbortSignal = (signal, name) => {
  if (typeof signal !== "object" || !("aborted" in signal)) {
    throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
  }
};
function isNodeStream2(obj) {
  return !!(obj && typeof obj.pipe === "function");
}
function addAbortSignal(signal, stream) {
  validateAbortSignal(signal, "signal");
  if (!isNodeStream2(stream)) {
    throw new ERR_INVALID_ARG_TYPE("stream", "stream.Stream", stream);
  }
  return module.exports.addAbortSignalNoValidate(signal, stream);
}

// frida-shim:node_modules/@frida/readable-stream/lib/destroy.js
var destroy_exports = {};
__export(destroy_exports, {
  construct: () => construct,
  destroy: () => destroy,
  destroyer: () => destroyer,
  errorOrDestroy: () => errorOrDestroy,
  undestroy: () => undestroy
});
var {
  ERR_MULTIPLE_CALLBACK
} = codes;
var kDestroy = Symbol("kDestroy");
var kConstruct = Symbol("kConstruct");
function checkError(err, w, r) {
  if (err) {
    err.stack;
    if (w && !w.errored) {
      w.errored = err;
    }
    if (r && !r.errored) {
      r.errored = err;
    }
  }
}
function destroy(err, cb) {
  const r = this._readableState;
  const w = this._writableState;
  const s = w || r;
  if (w && w.destroyed || r && r.destroyed) {
    if (typeof cb === "function") {
      cb();
    }
    return this;
  }
  checkError(err, w, r);
  if (w) {
    w.destroyed = true;
  }
  if (r) {
    r.destroyed = true;
  }
  if (!s.constructed) {
    this.once(kDestroy, function(er) {
      _destroy(this, aggregateTwoErrors(er, err), cb);
    });
  } else {
    _destroy(this, err, cb);
  }
  return this;
}
function _destroy(self, err, cb) {
  let called = false;
  function onDestroy(err2) {
    if (called) {
      return;
    }
    called = true;
    const r = self._readableState;
    const w = self._writableState;
    checkError(err2, w, r);
    if (w) {
      w.closed = true;
    }
    if (r) {
      r.closed = true;
    }
    if (typeof cb === "function") {
      cb(err2);
    }
    if (err2) {
      process_default.nextTick(emitErrorCloseNT, self, err2);
    } else {
      process_default.nextTick(emitCloseNT, self);
    }
  }
  try {
    const result = self._destroy(err || null, onDestroy);
    if (result != null) {
      const then = result.then;
      if (typeof then === "function") {
        then.call(
          result,
          function() {
            process_default.nextTick(onDestroy, null);
          },
          function(err2) {
            process_default.nextTick(onDestroy, err2);
          }
        );
      }
    }
  } catch (err2) {
    onDestroy(err2);
  }
}
function emitErrorCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}
function emitCloseNT(self) {
  const r = self._readableState;
  const w = self._writableState;
  if (w) {
    w.closeEmitted = true;
  }
  if (r) {
    r.closeEmitted = true;
  }
  if (w && w.emitClose || r && r.emitClose) {
    self.emit("close");
  }
}
function emitErrorNT(self, err) {
  const r = self._readableState;
  const w = self._writableState;
  if (w && w.errorEmitted || r && r.errorEmitted) {
    return;
  }
  if (w) {
    w.errorEmitted = true;
  }
  if (r) {
    r.errorEmitted = true;
  }
  self.emit("error", err);
}
function undestroy() {
  const r = this._readableState;
  const w = this._writableState;
  if (r) {
    r.constructed = true;
    r.closed = false;
    r.closeEmitted = false;
    r.destroyed = false;
    r.errored = null;
    r.errorEmitted = false;
    r.reading = false;
    r.ended = r.readable === false;
    r.endEmitted = r.readable === false;
  }
  if (w) {
    w.constructed = true;
    w.destroyed = false;
    w.closed = false;
    w.closeEmitted = false;
    w.errored = null;
    w.errorEmitted = false;
    w.finalCalled = false;
    w.prefinished = false;
    w.ended = w.writable === false;
    w.ending = w.writable === false;
    w.finished = w.writable === false;
  }
}
function errorOrDestroy(stream, err, sync) {
  const r = stream._readableState;
  const w = stream._writableState;
  if (w && w.destroyed || r && r.destroyed) {
    return this;
  }
  if (r && r.autoDestroy || w && w.autoDestroy)
    stream.destroy(err);
  else if (err) {
    err.stack;
    if (w && !w.errored) {
      w.errored = err;
    }
    if (r && !r.errored) {
      r.errored = err;
    }
    if (sync) {
      process_default.nextTick(emitErrorNT, stream, err);
    } else {
      emitErrorNT(stream, err);
    }
  }
}
function construct(stream, cb) {
  if (typeof stream._construct !== "function") {
    return;
  }
  const r = stream._readableState;
  const w = stream._writableState;
  if (r) {
    r.constructed = false;
  }
  if (w) {
    w.constructed = false;
  }
  stream.once(kConstruct, cb);
  if (stream.listenerCount(kConstruct) > 1) {
    return;
  }
  process_default.nextTick(constructNT, stream);
}
function constructNT(stream) {
  let called = false;
  function onConstruct(err) {
    if (called) {
      errorOrDestroy(stream, err ?? new ERR_MULTIPLE_CALLBACK());
      return;
    }
    called = true;
    const r = stream._readableState;
    const w = stream._writableState;
    const s = w || r;
    if (r) {
      r.constructed = true;
    }
    if (w) {
      w.constructed = true;
    }
    if (s.destroyed) {
      stream.emit(kDestroy, err);
    } else if (err) {
      errorOrDestroy(stream, err, true);
    } else {
      process_default.nextTick(emitConstructNT, stream);
    }
  }
  try {
    const result = stream._construct(onConstruct);
    if (result != null) {
      const then = result.then;
      if (typeof then === "function") {
        then.call(
          result,
          function() {
            process_default.nextTick(onConstruct, null);
          },
          function(err) {
            process_default.nextTick(onConstruct, err);
          }
        );
      }
    }
  } catch (err) {
    onConstruct(err);
  }
}
function emitConstructNT(stream) {
  stream.emit(kConstruct);
}
function isRequest2(stream) {
  return stream && stream.setHeader && typeof stream.abort === "function";
}
function emitCloseLegacy(stream) {
  stream.emit("close");
}
function emitErrorCloseLegacy(stream, err) {
  stream.emit("error", err);
  process_default.nextTick(emitCloseLegacy, stream);
}
function destroyer(stream, err) {
  if (!stream || isDestroyed(stream)) {
    return;
  }
  if (!err && !isFinished(stream)) {
    err = new AbortError();
  }
  if (isServerRequest(stream)) {
    stream.socket = null;
    stream.destroy(err);
  } else if (isRequest2(stream)) {
    stream.abort();
  } else if (isRequest2(stream.req)) {
    stream.req.abort();
  } else if (typeof stream.destroy === "function") {
    stream.destroy(err);
  } else if (typeof stream.close === "function") {
    stream.close();
  } else if (err) {
    process_default.nextTick(emitErrorCloseLegacy, stream);
  } else {
    process_default.nextTick(emitCloseLegacy, stream);
  }
  if (!stream.destroyed) {
    stream[kDestroyed] = true;
  }
}

// frida-shim:node_modules/@frida/events/events.js
var events_default = EventEmitter;
function ProcessEmitWarning(warning) {
  console.warn(warning);
}
function EventEmitter() {
  EventEmitter.init.call(this);
}
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = void 0;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = void 0;
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}
Object.defineProperty(EventEmitter, "defaultMaxListeners", {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== "number" || arg < 0 || Number.isNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function() {
  if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || void 0;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
  }
  this._maxListeners = n;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === void 0)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit2(type) {
  const args = [];
  for (let i = 1; i < arguments.length; i++) args.push(arguments[i]);
  let doError = type === "error";
  const events = this._events;
  if (events !== void 0)
    doError = doError && events.error === void 0;
  else if (!doError)
    return false;
  if (doError) {
    let er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      throw er;
    }
    const err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
    err.context = er;
    throw err;
  }
  const handler = events[type];
  if (handler === void 0)
    return false;
  if (typeof handler === "function") {
    Reflect.apply(handler, this, args);
  } else {
    const len = handler.length;
    const listeners3 = arrayClone(handler, len);
    for (let i = 0; i < len; ++i)
      Reflect.apply(listeners3[i], this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  let existing;
  checkListener(listener);
  let events = target._events;
  if (events === void 0) {
    events = target._events = /* @__PURE__ */ Object.create(null);
    target._eventsCount = 0;
  } else {
    if (events.newListener !== void 0) {
      target.emit(
        "newListener",
        type,
        listener.listener ? listener.listener : listener
      );
      events = target._events;
    }
    existing = events[type];
  }
  if (existing === void 0) {
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === "function") {
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }
    const m2 = _getMaxListeners(target);
    if (m2 > 0 && existing.length > m2 && !existing.warned) {
      existing.warned = true;
      const w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      w.name = "MaxListenersExceededWarning";
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }
  return target;
}
EventEmitter.prototype.addListener = function addListener2(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener2(type, listener) {
  return _addListener(this, type, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target, type, listener) {
  const state = { fired: false, wrapFn: void 0, target, type, listener };
  const wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once3(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener2(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.removeListener = function removeListener2(type, listener) {
  checkListener(listener);
  const events = this._events;
  if (events === void 0)
    return this;
  const list2 = events[type];
  if (list2 === void 0)
    return this;
  if (list2 === listener || list2.listener === listener) {
    if (--this._eventsCount === 0)
      this._events = /* @__PURE__ */ Object.create(null);
    else {
      delete events[type];
      if (events.removeListener)
        this.emit("removeListener", type, list2.listener || listener);
    }
  } else if (typeof list2 !== "function") {
    let originalListener;
    let position = -1;
    for (let i = list2.length - 1; i >= 0; i--) {
      if (list2[i] === listener || list2[i].listener === listener) {
        originalListener = list2[i].listener;
        position = i;
        break;
      }
    }
    if (position < 0)
      return this;
    if (position === 0)
      list2.shift();
    else {
      spliceOne(list2, position);
    }
    if (list2.length === 1)
      events[type] = list2[0];
    if (events.removeListener !== void 0)
      this.emit("removeListener", type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners2(type) {
  const events = this._events;
  if (events === void 0)
    return this;
  if (events.removeListener === void 0) {
    if (arguments.length === 0) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== void 0) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else
        delete events[type];
    }
    return this;
  }
  if (arguments.length === 0) {
    const keys = Object.keys(events);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (key === "removeListener") continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners("removeListener");
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  const listeners3 = events[type];
  if (typeof listeners3 === "function") {
    this.removeListener(type, listeners3);
  } else if (listeners3 !== void 0) {
    for (let i = listeners3.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners3[i]);
    }
  }
  return this;
};
function _listeners(target, type, unwrap2) {
  const events = target._events;
  if (events === void 0)
    return [];
  const evlistener = events[type];
  if (evlistener === void 0)
    return [];
  if (typeof evlistener === "function")
    return unwrap2 ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap2 ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners2(type) {
  return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === "function") {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  const events = this._events;
  if (events !== void 0) {
    const evlistener = events[type];
    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener !== void 0) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};
function arrayClone(arr, n) {
  const copy2 = new Array(n);
  for (let i = 0; i < n; ++i)
    copy2[i] = arr[i];
  return copy2;
}
function spliceOne(list2, index) {
  for (; index + 1 < list2.length; index++)
    list2[index] = list2[index + 1];
  list2.pop();
}
function unwrapListeners(arr) {
  const ret = new Array(arr.length);
  for (let i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

// frida-shim:node_modules/@frida/readable-stream/lib/event_target.js
var {
  ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE2,
  ERR_EVENT_RECURSION,
  ERR_MISSING_ARGS,
  ERR_INVALID_THIS
} = codes;
var kIsEventTarget = Symbol.for("nodejs.event_target");
var kIsNodeEventTarget = Symbol("kIsNodeEventTarget");
var {
  kMaxEventTargetListeners,
  kMaxEventTargetListenersWarned
} = events_default;
var kEvents = Symbol("kEvents");
var kIsBeingDispatched = Symbol("kIsBeingDispatched");
var kStop = Symbol("kStop");
var kTarget = Symbol("kTarget");
var kHandlers = Symbol("khandlers");
var kWeakHandler = Symbol("kWeak");
var kHybridDispatch = Symbol.for("nodejs.internal.kHybridDispatch");
var kCreateEvent = Symbol("kCreateEvent");
var kNewListener = Symbol("kNewListener");
var kRemoveListener = Symbol("kRemoveListener");
var kIsNodeStyleListener = Symbol("kIsNodeStyleListener");
var kTrustEvent = Symbol("kTrustEvent");
var kType = Symbol("type");
var kDefaultPrevented = Symbol("defaultPrevented");
var kCancelable = Symbol("cancelable");
var kTimestamp = Symbol("timestamp");
var kBubbles = Symbol("bubbles");
var kComposed = Symbol("composed");
var kPropagationStopped = Symbol("propagationStopped");
var isTrustedSet = /* @__PURE__ */ new WeakSet();
var isTrusted = Object.getOwnPropertyDescriptor({
  get isTrusted() {
    return isTrustedSet.has(this);
  }
}, "isTrusted").get;
function isEvent(value) {
  return typeof value?.[kType] === "string";
}
var Event = class _Event {
  constructor(type, options = null) {
    if (arguments.length === 0)
      throw new ERR_MISSING_ARGS("type");
    const { cancelable, bubbles, composed } = { ...options };
    this[kCancelable] = !!cancelable;
    this[kBubbles] = !!bubbles;
    this[kComposed] = !!composed;
    this[kType] = `${type}`;
    this[kDefaultPrevented] = false;
    this[kTimestamp] = Date.now();
    this[kPropagationStopped] = false;
    if (options?.[kTrustEvent]) {
      isTrustedSet.add(this);
    }
    Object.defineProperty(this, "isTrusted", {
      get: isTrusted,
      enumerable: true,
      configurable: false
    });
    this[kTarget] = null;
    this[kIsBeingDispatched] = false;
  }
  [inspect2.custom](depth, options) {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    const name = this.constructor.name;
    if (depth < 0)
      return name;
    const opts = Object.assign({}, options, {
      depth: Number.isInteger(options.depth) ? options.depth - 1 : options.depth
    });
    return `${name} ${inspect2({
      type: this[kType],
      defaultPrevented: this[kDefaultPrevented],
      cancelable: this[kCancelable],
      timeStamp: this[kTimestamp]
    }, opts)}`;
  }
  stopImmediatePropagation() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    this[kStop] = true;
  }
  preventDefault() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    this[kDefaultPrevented] = true;
  }
  get target() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kTarget];
  }
  get currentTarget() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kTarget];
  }
  get srcElement() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kTarget];
  }
  get type() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kType];
  }
  get cancelable() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kCancelable];
  }
  get defaultPrevented() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kCancelable] && this[kDefaultPrevented];
  }
  get timeStamp() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kTimestamp];
  }
  // The following are non-op and unused properties/methods from Web API Event.
  // These are not supported in Node.js and are provided purely for
  // API completeness.
  composedPath() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kIsBeingDispatched] ? [this[kTarget]] : [];
  }
  get returnValue() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return !this.defaultPrevented;
  }
  get bubbles() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kBubbles];
  }
  get composed() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kComposed];
  }
  get eventPhase() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kIsBeingDispatched] ? _Event.AT_TARGET : _Event.NONE;
  }
  get cancelBubble() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    return this[kPropagationStopped];
  }
  set cancelBubble(value) {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    if (value) {
      this.stopPropagation();
    }
  }
  stopPropagation() {
    if (!isEvent(this))
      throw new ERR_INVALID_THIS("Event");
    this[kPropagationStopped] = true;
  }
  static NONE = 0;
  static CAPTURING_PHASE = 1;
  static AT_TARGET = 2;
  static BUBBLING_PHASE = 3;
};
var kEnumerableProperty = /* @__PURE__ */ Object.create(null);
kEnumerableProperty.enumerable = true;
Object.defineProperties(
  Event.prototype,
  {
    [Symbol.toStringTag]: {
      writable: false,
      enumerable: false,
      configurable: true,
      value: "Event"
    },
    stopImmediatePropagation: kEnumerableProperty,
    preventDefault: kEnumerableProperty,
    target: kEnumerableProperty,
    currentTarget: kEnumerableProperty,
    srcElement: kEnumerableProperty,
    type: kEnumerableProperty,
    cancelable: kEnumerableProperty,
    defaultPrevented: kEnumerableProperty,
    timeStamp: kEnumerableProperty,
    composedPath: kEnumerableProperty,
    returnValue: kEnumerableProperty,
    bubbles: kEnumerableProperty,
    composed: kEnumerableProperty,
    eventPhase: kEnumerableProperty,
    cancelBubble: kEnumerableProperty,
    stopPropagation: kEnumerableProperty
  }
);
var NodeCustomEvent = class extends Event {
  constructor(type, options) {
    super(type, options);
    if (options?.detail) {
      this.detail = options.detail;
    }
  }
};
var weakListenersState = null;
var objectToWeakListenerMap = null;
function weakListeners() {
  if (weakListenersState === null) {
    weakListenersState = new FinalizationRegistry(
      (listener) => listener.remove()
    );
  }
  if (objectToWeakListenerMap === null) {
    objectToWeakListenerMap = /* @__PURE__ */ new WeakMap();
  }
  return { registry: weakListenersState, map: objectToWeakListenerMap };
}
var Listener = class {
  constructor(previous, listener, once4, capture, passive, isNodeStyleListener, weak) {
    this.next = void 0;
    if (previous !== void 0)
      previous.next = this;
    this.previous = previous;
    this.listener = listener;
    this.once = once4;
    this.capture = capture;
    this.passive = passive;
    this.isNodeStyleListener = isNodeStyleListener;
    this.removed = false;
    this.weak = Boolean(weak);
    if (this.weak) {
      this.callback = new WeakRef(listener);
      weakListeners().registry.register(listener, this, this);
      weakListeners().map.set(weak, listener);
      this.listener = this.callback;
    } else if (typeof listener === "function") {
      this.callback = listener;
      this.listener = listener;
    } else {
      this.callback = listener.handleEvent.bind(listener);
      this.listener = listener;
    }
  }
  same(listener, capture) {
    const myListener = this.weak ? this.listener.deref() : this.listener;
    return myListener === listener && this.capture === capture;
  }
  remove() {
    if (this.previous !== void 0)
      this.previous.next = this.next;
    if (this.next !== void 0)
      this.next.previous = this.previous;
    this.removed = true;
    if (this.weak)
      weakListeners().registry.unregister(this);
  }
};
function initEventTarget(self) {
  self[kEvents] = /* @__PURE__ */ new Map();
  self[kMaxEventTargetListeners] = events_default.defaultMaxListeners;
  self[kMaxEventTargetListenersWarned] = false;
}
var EventTarget = class {
  // Used in checking whether an object is an EventTarget. This is a well-known
  // symbol as EventTarget may be used cross-realm.
  // Ref: https://github.com/nodejs/node/pull/33661
  static [kIsEventTarget] = true;
  constructor() {
    initEventTarget(this);
  }
  [kNewListener](size, type, listener, once4, capture, passive) {
    if (this[kMaxEventTargetListeners] > 0 && size > this[kMaxEventTargetListeners] && !this[kMaxEventTargetListenersWarned]) {
      this[kMaxEventTargetListenersWarned] = true;
      const w = new Error(`Possible EventTarget memory leak detected. ${size} ${type} listeners added to ${inspect2(this, { depth: -1 })}. Use events.setMaxListeners() to increase limit`);
      w.name = "MaxListenersExceededWarning";
      w.target = this;
      w.type = type;
      w.count = size;
      process_default.emitWarning(w);
    }
  }
  [kRemoveListener](size, type, listener, capture) {
  }
  addEventListener(type, listener, options = {}) {
    if (!isEventTarget(this))
      throw new ERR_INVALID_THIS("EventTarget");
    if (arguments.length < 2)
      throw new ERR_MISSING_ARGS("type", "listener");
    const {
      once: once4,
      capture,
      passive,
      signal,
      isNodeStyleListener,
      weak
    } = validateEventListenerOptions(options);
    if (!shouldAddListener(listener)) {
      const w = new Error(`addEventListener called with ${listener} which has no effect.`);
      w.name = "AddEventListenerArgumentTypeWarning";
      w.target = this;
      w.type = type;
      process_default.emitWarning(w);
      return;
    }
    type = String(type);
    if (signal) {
      if (signal.aborted) {
        return;
      }
      signal.addEventListener("abort", () => {
        this.removeEventListener(type, listener, options);
      }, { once: true, [kWeakHandler]: this });
    }
    let root = this[kEvents].get(type);
    if (root === void 0) {
      root = { size: 1, next: void 0 };
      new Listener(
        root,
        listener,
        once4,
        capture,
        passive,
        isNodeStyleListener,
        weak
      );
      this[kNewListener](root.size, type, listener, once4, capture, passive);
      this[kEvents].set(type, root);
      return;
    }
    let handler = root.next;
    let previous = root;
    while (handler !== void 0 && !handler.same(listener, capture)) {
      previous = handler;
      handler = handler.next;
    }
    if (handler !== void 0) {
      return;
    }
    new Listener(
      previous,
      listener,
      once4,
      capture,
      passive,
      isNodeStyleListener,
      weak
    );
    root.size++;
    this[kNewListener](root.size, type, listener, once4, capture, passive);
  }
  removeEventListener(type, listener, options = {}) {
    if (!isEventTarget(this))
      throw new ERR_INVALID_THIS("EventTarget");
    if (!shouldAddListener(listener))
      return;
    type = String(type);
    const capture = options?.capture === true;
    const root = this[kEvents].get(type);
    if (root === void 0 || root.next === void 0)
      return;
    let handler = root.next;
    while (handler !== void 0) {
      if (handler.same(listener, capture)) {
        handler.remove();
        root.size--;
        if (root.size === 0)
          this[kEvents].delete(type);
        this[kRemoveListener](root.size, type, listener, capture);
        break;
      }
      handler = handler.next;
    }
  }
  dispatchEvent(event) {
    if (!isEventTarget(this))
      throw new ERR_INVALID_THIS("EventTarget");
    if (!(event instanceof Event))
      throw new ERR_INVALID_ARG_TYPE2("event", "Event", event);
    if (event[kIsBeingDispatched])
      throw new ERR_EVENT_RECURSION(event.type);
    this[kHybridDispatch](event, event.type, event);
    return event.defaultPrevented !== true;
  }
  [kHybridDispatch](nodeValue, type, event) {
    const createEvent = () => {
      if (event === void 0) {
        event = this[kCreateEvent](nodeValue, type);
        event[kTarget] = this;
        event[kIsBeingDispatched] = true;
      }
      return event;
    };
    if (event !== void 0) {
      event[kTarget] = this;
      event[kIsBeingDispatched] = true;
    }
    const root = this[kEvents].get(type);
    if (root === void 0 || root.next === void 0) {
      if (event !== void 0)
        event[kIsBeingDispatched] = false;
      return true;
    }
    let handler = root.next;
    let next;
    while (handler !== void 0 && (handler.passive || event?.[kStop] !== true)) {
      next = handler.next;
      if (handler.removed) {
        handler = next;
        continue;
      }
      if (handler.once) {
        handler.remove();
        root.size--;
        const { listener, capture } = handler;
        this[kRemoveListener](root.size, type, listener, capture);
      }
      try {
        let arg;
        if (handler.isNodeStyleListener) {
          arg = nodeValue;
        } else {
          arg = createEvent();
        }
        const callback = handler.weak ? handler.callback.deref() : handler.callback;
        let result;
        if (callback) {
          result = callback.call(this, arg);
          if (!handler.isNodeStyleListener) {
            arg[kIsBeingDispatched] = false;
          }
        }
        if (result !== void 0 && result !== null)
          addCatch(result);
      } catch (err) {
        emitUncaughtException(err);
      }
      handler = next;
    }
    if (event !== void 0)
      event[kIsBeingDispatched] = false;
  }
  [kCreateEvent](nodeValue, type) {
    return new NodeCustomEvent(type, { detail: nodeValue });
  }
  [inspect2.custom](depth, options) {
    if (!isEventTarget(this))
      throw new ERR_INVALID_THIS("EventTarget");
    const name = this.constructor.name;
    if (depth < 0)
      return name;
    const opts = Object.assign({}, options, {
      depth: Number.isInteger(options.depth) ? options.depth - 1 : options.depth
    });
    return `${name} ${inspect2({}, opts)}`;
  }
};
Object.defineProperties(EventTarget.prototype, {
  addEventListener: kEnumerableProperty,
  removeEventListener: kEnumerableProperty,
  dispatchEvent: kEnumerableProperty,
  [Symbol.toStringTag]: {
    writable: false,
    enumerable: false,
    configurable: true,
    value: "EventTarget"
  }
});
function initNodeEventTarget(self) {
  initEventTarget(self);
}
var NodeEventTarget = class extends EventTarget {
  static [kIsNodeEventTarget] = true;
  static defaultMaxListeners = 10;
  constructor() {
    super();
    initNodeEventTarget(this);
  }
  setMaxListeners(n) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    events_default.setMaxListeners(n, this);
  }
  getMaxListeners() {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    return this[kMaxEventTargetListeners];
  }
  eventNames() {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    return Array.from(this[kEvents].keys());
  }
  listenerCount(type) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    const root = this[kEvents].get(String(type));
    return root !== void 0 ? root.size : 0;
  }
  off(type, listener, options) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    this.removeEventListener(type, listener, options);
    return this;
  }
  removeListener(type, listener, options) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    this.removeEventListener(type, listener, options);
    return this;
  }
  on(type, listener) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    this.addEventListener(type, listener, { [kIsNodeStyleListener]: true });
    return this;
  }
  addListener(type, listener) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    this.addEventListener(type, listener, { [kIsNodeStyleListener]: true });
    return this;
  }
  emit(type, arg) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    const hadListeners = this.listenerCount(type) > 0;
    this[kHybridDispatch](arg, type);
    return hadListeners;
  }
  once(type, listener) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    this.addEventListener(
      type,
      listener,
      { once: true, [kIsNodeStyleListener]: true }
    );
    return this;
  }
  removeAllListeners(type) {
    if (!isNodeEventTarget(this))
      throw new ERR_INVALID_THIS("NodeEventTarget");
    if (type !== void 0) {
      this[kEvents].delete(String(type));
    } else {
      this[kEvents].clear();
    }
    return this;
  }
};
Object.defineProperties(NodeEventTarget.prototype, {
  setMaxListeners: kEnumerableProperty,
  getMaxListeners: kEnumerableProperty,
  eventNames: kEnumerableProperty,
  listenerCount: kEnumerableProperty,
  off: kEnumerableProperty,
  removeListener: kEnumerableProperty,
  on: kEnumerableProperty,
  addListener: kEnumerableProperty,
  once: kEnumerableProperty,
  emit: kEnumerableProperty,
  removeAllListeners: kEnumerableProperty
});
function shouldAddListener(listener) {
  if (typeof listener === "function" || typeof listener?.handleEvent === "function") {
    return true;
  }
  if (listener == null)
    return false;
  throw new ERR_INVALID_ARG_TYPE2("listener", "EventListener", listener);
}
function validateEventListenerOptions(options) {
  if (typeof options === "boolean")
    return { capture: options };
  if (options === null)
    return {};
  return {
    once: Boolean(options.once),
    capture: Boolean(options.capture),
    passive: Boolean(options.passive),
    signal: options.signal,
    weak: options[kWeakHandler],
    isNodeStyleListener: Boolean(options[kIsNodeStyleListener])
  };
}
function isEventTarget(obj) {
  return obj?.constructor?.[kIsEventTarget];
}
function isNodeEventTarget(obj) {
  return obj?.constructor?.[kIsNodeEventTarget];
}
function addCatch(promise) {
  const then = promise.then;
  if (typeof then === "function") {
    then.call(promise, void 0, function(err) {
      emitUncaughtException(err);
    });
  }
}
function emitUncaughtException(err) {
  process_default.nextTick(() => {
    throw err;
  });
}
function makeEventHandler(handler) {
  function eventHandler(...args) {
    if (typeof eventHandler.handler !== "function") {
      return;
    }
    return Reflect.apply(eventHandler.handler, this, args);
  }
  eventHandler.handler = handler;
  return eventHandler;
}
function defineEventHandler(emitter, name) {
  Object.defineProperty(emitter, `on${name}`, {
    get() {
      return this[kHandlers]?.get(name)?.handler;
    },
    set(value) {
      if (!this[kHandlers]) {
        this[kHandlers] = /* @__PURE__ */ new Map();
      }
      let wrappedHandler = this[kHandlers]?.get(name);
      if (wrappedHandler) {
        if (typeof wrappedHandler.handler === "function") {
          this[kEvents].get(name).size--;
          const size = this[kEvents].get(name).size;
          this[kRemoveListener](size, name, wrappedHandler.handler, false);
        }
        wrappedHandler.handler = value;
        if (typeof wrappedHandler.handler === "function") {
          this[kEvents].get(name).size++;
          const size = this[kEvents].get(name).size;
          this[kNewListener](size, name, value, false, false, false);
        }
      } else {
        wrappedHandler = makeEventHandler(value);
        this.addEventListener(name, wrappedHandler);
      }
      this[kHandlers].set(name, wrappedHandler);
    },
    configurable: true,
    enumerable: true
  });
}

// frida-shim:node_modules/@frida/readable-stream/lib/abort_controller.js
var {
  ERR_ILLEGAL_CONSTRUCTOR,
  ERR_INVALID_THIS: ERR_INVALID_THIS2
} = codes;
var kAborted = Symbol("kAborted");
function customInspect(self, obj, depth, options) {
  if (depth < 0)
    return self;
  const opts = Object.assign({}, options, {
    depth: options.depth === null ? null : options.depth - 1
  });
  return `${self.constructor.name} ${inspect2(obj, opts)}`;
}
function validateAbortSignal2(obj) {
  if (obj?.[kAborted] === void 0)
    throw new ERR_INVALID_THIS2("AbortSignal");
}
var AbortSignal = class extends EventTarget {
  constructor() {
    throw new ERR_ILLEGAL_CONSTRUCTOR();
  }
  get aborted() {
    validateAbortSignal2(this);
    return !!this[kAborted];
  }
  [inspect2.custom](depth, options) {
    return customInspect(this, {
      aborted: this.aborted
    }, depth, options);
  }
  static abort() {
    return createAbortSignal(true);
  }
};
Object.defineProperties(AbortSignal.prototype, {
  aborted: { enumerable: true }
});
Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
  writable: false,
  enumerable: false,
  configurable: true,
  value: "AbortSignal"
});
defineEventHandler(AbortSignal.prototype, "abort");
function createAbortSignal(aborted = false) {
  const signal = new EventTarget();
  Object.setPrototypeOf(signal, AbortSignal.prototype);
  signal[kAborted] = aborted;
  return signal;
}
function abortSignal(signal) {
  if (signal[kAborted]) return;
  signal[kAborted] = true;
  const event = new Event("abort", {
    [kTrustEvent]: true
  });
  signal.dispatchEvent(event);
}
var kSignal = Symbol("signal");
function validateAbortController(obj) {
  if (obj?.[kSignal] === void 0)
    throw new ERR_INVALID_THIS2("AbortController");
}
var AbortController = class {
  constructor() {
    this[kSignal] = createAbortSignal();
  }
  get signal() {
    validateAbortController(this);
    return this[kSignal];
  }
  abort() {
    validateAbortController(this);
    abortSignal(this[kSignal]);
  }
  [inspect2.custom](depth, options) {
    return customInspect(this, {
      signal: this.signal
    }, depth, options);
  }
};
Object.defineProperties(AbortController.prototype, {
  signal: { enumerable: true },
  abort: { enumerable: true }
});
Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
  writable: false,
  enumerable: false,
  configurable: true,
  value: "AbortController"
});

// frida-shim:node_modules/@frida/readable-stream/lib/from.js
var {
  ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE3,
  ERR_STREAM_NULL_VALUES
} = codes;
function from2(Readable2, iterable, opts) {
  let iterator;
  if (typeof iterable === "string" || iterable instanceof Buffer2) {
    return new Readable2({
      objectMode: true,
      ...opts,
      read() {
        this.push(iterable);
        this.push(null);
      }
    });
  }
  let isAsync;
  if (iterable && iterable[Symbol.asyncIterator]) {
    isAsync = true;
    iterator = iterable[Symbol.asyncIterator]();
  } else if (iterable && iterable[Symbol.iterator]) {
    isAsync = false;
    iterator = iterable[Symbol.iterator]();
  } else {
    throw new ERR_INVALID_ARG_TYPE3("iterable", ["Iterable"], iterable);
  }
  const readable = new Readable2({
    objectMode: true,
    highWaterMark: 1,
    // TODO(ronag): What options should be allowed?
    ...opts
  });
  let reading = false;
  readable._read = function() {
    if (!reading) {
      reading = true;
      next();
    }
  };
  readable._destroy = function(error, cb) {
    close(error).then(
      () => process_default.nextTick(cb, error),
      // nextTick is here in case cb throws
      (e) => process_default.nextTick(cb, e || error)
    );
  };
  async function close(error) {
    const hadError = error !== void 0 && error !== null;
    const hasThrow = typeof iterator.throw === "function";
    if (hadError && hasThrow) {
      const { value, done } = await iterator.throw(error);
      await value;
      if (done) {
        return;
      }
    }
    if (typeof iterator.return === "function") {
      const { value } = await iterator.return();
      await value;
    }
  }
  async function next() {
    for (; ; ) {
      try {
        const { value, done } = isAsync ? await iterator.next() : iterator.next();
        if (done) {
          readable.push(null);
        } else {
          const res = value && typeof value.then === "function" ? await value : value;
          if (res === null) {
            reading = false;
            throw new ERR_STREAM_NULL_VALUES();
          } else if (readable.push(res)) {
            continue;
          } else {
            reading = false;
          }
        }
      } catch (err) {
        readable.destroy(err);
      }
      break;
    }
  }
  return readable;
}

// frida-shim:node_modules/@frida/readable-stream/lib/buffer_list.js
var BufferList = class {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  push(v) {
    const entry = { data: v, next: null };
    if (this.length > 0)
      this.tail.next = entry;
    else
      this.head = entry;
    this.tail = entry;
    ++this.length;
  }
  unshift(v) {
    const entry = { data: v, next: this.head };
    if (this.length === 0)
      this.tail = entry;
    this.head = entry;
    ++this.length;
  }
  shift() {
    if (this.length === 0)
      return;
    const ret = this.head.data;
    if (this.length === 1)
      this.head = this.tail = null;
    else
      this.head = this.head.next;
    --this.length;
    return ret;
  }
  clear() {
    this.head = this.tail = null;
    this.length = 0;
  }
  join(s) {
    if (this.length === 0)
      return "";
    let p = this.head;
    let ret = "" + p.data;
    while (p = p.next)
      ret += s + p.data;
    return ret;
  }
  concat(n) {
    if (this.length === 0)
      return Buffer2.alloc(0);
    const ret = Buffer2.allocUnsafe(n >>> 0);
    let p = this.head;
    let i = 0;
    while (p) {
      ret.set(p.data, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  }
  // Consumes a specified amount of bytes or characters from the buffered data.
  consume(n, hasStrings) {
    const data = this.head.data;
    if (n < data.length) {
      const slice2 = data.slice(0, n);
      this.head.data = data.slice(n);
      return slice2;
    }
    if (n === data.length) {
      return this.shift();
    }
    return hasStrings ? this._getString(n) : this._getBuffer(n);
  }
  first() {
    return this.head.data;
  }
  *[Symbol.iterator]() {
    for (let p = this.head; p; p = p.next) {
      yield p.data;
    }
  }
  // Consumes a specified amount of characters from the buffered data.
  _getString(n) {
    let ret = "";
    let p = this.head;
    let c = 0;
    do {
      const str = p.data;
      if (n > str.length) {
        ret += str;
        n -= str.length;
      } else {
        if (n === str.length) {
          ret += str;
          ++c;
          if (p.next)
            this.head = p.next;
          else
            this.head = this.tail = null;
        } else {
          ret += str.slice(0, n);
          this.head = p;
          p.data = str.slice(n);
        }
        break;
      }
      ++c;
    } while (p = p.next);
    this.length -= c;
    return ret;
  }
  // Consumes a specified amount of bytes from the buffered data.
  _getBuffer(n) {
    const ret = Buffer2.allocUnsafe(n);
    const retLen = n;
    let p = this.head;
    let c = 0;
    do {
      const buf = p.data;
      if (n > buf.length) {
        ret.set(buf, retLen - n);
        n -= buf.length;
      } else {
        if (n === buf.length) {
          ret.set(buf, retLen - n);
          ++c;
          if (p.next)
            this.head = p.next;
          else
            this.head = this.tail = null;
        } else {
          ret.set(
            new Uint8Array(buf.buffer, buf.byteOffset, n),
            retLen - n
          );
          this.head = p;
          p.data = buf.slice(n);
        }
        break;
      }
      ++c;
    } while (p = p.next);
    this.length -= c;
    return ret;
  }
  // Make sure the linked list only shows the minimal necessary information.
  [inspect2.custom](_, options) {
    return inspect2(this, {
      ...options,
      // Only inspect one level.
      depth: 0,
      // It should not recurse.
      customInspect: false
    });
  }
};

// frida-shim:node_modules/@frida/readable-stream/lib/legacy.js
function Stream(opts) {
  events_default.call(this, opts);
}
Object.setPrototypeOf(Stream.prototype, events_default.prototype);
Object.setPrototypeOf(Stream, events_default);
Stream.prototype.pipe = function(dest, options) {
  const source = this;
  function ondata(chunk) {
    if (dest.writable && dest.write(chunk) === false && source.pause) {
      source.pause();
    }
  }
  source.on("data", ondata);
  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }
  dest.on("drain", ondrain);
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on("end", onend);
    source.on("close", onclose);
  }
  let didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;
    dest.end();
  }
  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;
    if (typeof dest.destroy === "function") dest.destroy();
  }
  function onerror(er) {
    cleanup();
    if (events_default.listenerCount(this, "error") === 0) {
      this.emit("error", er);
    }
  }
  prependListener3(source, "error", onerror);
  prependListener3(dest, "error", onerror);
  function cleanup() {
    source.removeListener("data", ondata);
    dest.removeListener("drain", ondrain);
    source.removeListener("end", onend);
    source.removeListener("close", onclose);
    source.removeListener("error", onerror);
    dest.removeListener("error", onerror);
    source.removeListener("end", cleanup);
    source.removeListener("close", cleanup);
    dest.removeListener("close", cleanup);
  }
  source.on("end", cleanup);
  source.on("close", cleanup);
  dest.on("close", cleanup);
  dest.emit("pipe", source);
  return dest;
};
function prependListener3(emitter, event, fn) {
  if (typeof emitter.prependListener === "function")
    return emitter.prependListener(event, fn);
  if (!emitter._events || !emitter._events[event])
    emitter.on(event, fn);
  else if (Array.isArray(emitter._events[event]))
    emitter._events[event].unshift(fn);
  else
    emitter._events[event] = [fn, emitter._events[event]];
}

// frida-shim:node_modules/@frida/readable-stream/lib/state.js
var { ERR_INVALID_ARG_VALUE } = codes;
function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}
function getDefaultHighWaterMark(objectMode) {
  return objectMode ? 16 : 16 * 1024;
}
function getHighWaterMark(state, options, duplexKey, isDuplex) {
  const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
  if (hwm != null) {
    if (!Number.isInteger(hwm) || hwm < 0) {
      const name = isDuplex ? `options.${duplexKey}` : "options.highWaterMark";
      throw new ERR_INVALID_ARG_VALUE(name, hwm);
    }
    return Math.floor(hwm);
  }
  return getDefaultHighWaterMark(state.objectMode);
}

// frida-shim:node_modules/@frida/string_decoder/lib/string_decoder.js
var isEncoding2 = Buffer2.isEncoding;
function _normalizeEncoding(enc) {
  if (!enc) return "utf8";
  let retried = false;
  while (true) {
    switch (enc) {
      case "utf8":
      case "utf-8":
        return "utf8";
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return "utf16le";
      case "latin1":
      case "binary":
        return "latin1";
      case "base64":
      case "ascii":
      case "hex":
        return enc;
      default:
        if (retried) return;
        enc = ("" + enc).toLowerCase();
        retried = true;
    }
  }
}
function normalizeEncoding(enc) {
  const nenc = _normalizeEncoding(enc);
  if (nenc === void 0 && (Buffer2.isEncoding === isEncoding2 || !isEncoding2(enc))) throw new Error("Unknown encoding: " + enc);
  return nenc || enc;
}
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  let nb;
  switch (this.encoding) {
    case "utf16le":
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case "utf8":
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case "base64":
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer2.allocUnsafe(nb);
}
StringDecoder.prototype.write = function(buf) {
  if (buf.length === 0) return "";
  let r;
  let i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === void 0) return "";
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || "";
};
StringDecoder.prototype.end = utf8End;
StringDecoder.prototype.text = utf8Text;
StringDecoder.prototype.fillLast = function(buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};
function utf8CheckByte(byte) {
  if (byte <= 127) return 0;
  else if (byte >> 5 === 6) return 2;
  else if (byte >> 4 === 14) return 3;
  else if (byte >> 3 === 30) return 4;
  return byte >> 6 === 2 ? -1 : -2;
}
function utf8CheckIncomplete(self, buf, i) {
  let j = buf.length - 1;
  if (j < i) return 0;
  let nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;
      else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 192) !== 128) {
    self.lastNeed = 0;
    return "\uFFFD";
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 192) !== 128) {
      self.lastNeed = 1;
      return "\uFFFD";
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 192) !== 128) {
        self.lastNeed = 2;
        return "\uFFFD";
      }
    }
  }
}
function utf8FillLast(buf) {
  const p = this.lastTotal - this.lastNeed;
  const r = utf8CheckExtraBytes(this, buf, p);
  if (r !== void 0) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}
function utf8Text(buf, i) {
  const total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString("utf8", i);
  this.lastTotal = total;
  const end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString("utf8", i, end);
}
function utf8End(buf) {
  const r = buf && buf.length ? this.write(buf) : "";
  if (this.lastNeed) return r + "\uFFFD";
  return r;
}
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    const r = buf.toString("utf16le", i);
    if (r) {
      const c = r.charCodeAt(r.length - 1);
      if (c >= 55296 && c <= 56319) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString("utf16le", i, buf.length - 1);
}
function utf16End(buf) {
  const r = buf && buf.length ? this.write(buf) : "";
  if (this.lastNeed) {
    const end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString("utf16le", 0, end);
  }
  return r;
}
function base64Text(buf, i) {
  const n = (buf.length - i) % 3;
  if (n === 0) return buf.toString("base64", i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString("base64", i, buf.length - n);
}
function base64End(buf) {
  const r = buf && buf.length ? this.write(buf) : "";
  if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
  return r;
}
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}
function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : "";
}

// frida-shim:node_modules/@frida/readable-stream/lib/readable.js
var readable_default = Readable;
var {
  ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE4,
  ERR_METHOD_NOT_IMPLEMENTED,
  ERR_OUT_OF_RANGE,
  ERR_STREAM_PUSH_AFTER_EOF,
  ERR_STREAM_UNSHIFT_AFTER_END_EVENT
} = codes;
var kPaused = Symbol("kPaused");
Object.setPrototypeOf(Readable.prototype, Stream.prototype);
Object.setPrototypeOf(Readable, Stream);
var nop2 = () => {
};
var { errorOrDestroy: errorOrDestroy2 } = destroy_exports;
function ReadableState(options, stream, isDuplex) {
  if (typeof isDuplex !== "boolean")
    isDuplex = stream instanceof Stream.Duplex;
  this.objectMode = !!(options && options.objectMode);
  if (isDuplex)
    this.objectMode = this.objectMode || !!(options && options.readableObjectMode);
  this.highWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = [];
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;
  this.constructed = true;
  this.sync = true;
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this[kPaused] = null;
  this.errorEmitted = false;
  this.emitClose = !options || options.emitClose !== false;
  this.autoDestroy = !options || options.autoDestroy !== false;
  this.destroyed = false;
  this.errored = null;
  this.closed = false;
  this.closeEmitted = false;
  this.defaultEncoding = options && options.defaultEncoding || "utf8";
  this.awaitDrainWriters = null;
  this.multiAwaitDrain = false;
  this.readingMore = false;
  this.dataEmitted = false;
  this.decoder = null;
  this.encoding = null;
  if (options && options.encoding) {
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);
  const isDuplex = this instanceof Stream.Duplex;
  this._readableState = new ReadableState(options, this, isDuplex);
  if (options) {
    if (typeof options.read === "function")
      this._read = options.read;
    if (typeof options.destroy === "function")
      this._destroy = options.destroy;
    if (typeof options.construct === "function")
      this._construct = options.construct;
    if (options.signal && !isDuplex)
      addAbortSignal(options.signal, this);
  }
  Stream.call(this, options);
  construct(this, () => {
    if (this._readableState.needReadable) {
      maybeReadMore(this, this._readableState);
    }
  });
}
Readable.prototype.destroy = destroy;
Readable.prototype._undestroy = undestroy;
Readable.prototype._destroy = function(err, cb) {
  cb(err);
};
Readable.prototype[events_default.captureRejectionSymbol] = function(err) {
  this.destroy(err);
};
Readable.prototype.push = function(chunk, encoding) {
  return readableAddChunk(this, chunk, encoding, false);
};
Readable.prototype.unshift = function(chunk, encoding) {
  return readableAddChunk(this, chunk, encoding, true);
};
function readableAddChunk(stream, chunk, encoding, addToFront) {
  const state = stream._readableState;
  let err;
  if (!state.objectMode) {
    if (typeof chunk === "string") {
      encoding = encoding || state.defaultEncoding;
      if (state.encoding !== encoding) {
        if (addToFront && state.encoding) {
          chunk = Buffer2.from(chunk, encoding).toString(state.encoding);
        } else {
          chunk = Buffer2.from(chunk, encoding);
          encoding = "";
        }
      }
    } else if (chunk instanceof Buffer2) {
      encoding = "";
    } else if (Stream._isUint8Array(chunk)) {
      chunk = Stream._uint8ArrayToBuffer(chunk);
      encoding = "";
    } else if (chunk != null) {
      err = new ERR_INVALID_ARG_TYPE4(
        "chunk",
        ["string", "Buffer", "Uint8Array"],
        chunk
      );
    }
  }
  if (err) {
    errorOrDestroy2(stream, err);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (addToFront) {
      if (state.endEmitted)
        errorOrDestroy2(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
      else if (state.destroyed || state.errored)
        return false;
      else
        addChunk(stream, state, chunk, true);
    } else if (state.ended) {
      errorOrDestroy2(stream, new ERR_STREAM_PUSH_AFTER_EOF());
    } else if (state.destroyed || state.errored) {
      return false;
    } else {
      state.reading = false;
      if (state.decoder && !encoding) {
        chunk = state.decoder.write(chunk);
        if (state.objectMode || chunk.length !== 0)
          addChunk(stream, state, chunk, false);
        else
          maybeReadMore(stream, state);
      } else {
        addChunk(stream, state, chunk, false);
      }
    }
  } else if (!addToFront) {
    state.reading = false;
    maybeReadMore(stream, state);
  }
  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}
function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync && stream.listenerCount("data") > 0) {
    if (state.multiAwaitDrain) {
      state.awaitDrainWriters.clear();
    } else {
      state.awaitDrainWriters = null;
    }
    state.dataEmitted = true;
    stream.emit("data", chunk);
  } else {
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront)
      state.buffer.unshift(chunk);
    else
      state.buffer.push(chunk);
    if (state.needReadable)
      emitReadable(stream);
  }
  maybeReadMore(stream, state);
}
Readable.prototype.isPaused = function() {
  const state = this._readableState;
  return state[kPaused] === true || state.flowing === false;
};
Readable.prototype.setEncoding = function(enc) {
  const decoder = new StringDecoder(enc);
  this._readableState.decoder = decoder;
  this._readableState.encoding = this._readableState.decoder.encoding;
  const buffer = this._readableState.buffer;
  let content = "";
  for (const data of buffer) {
    content += decoder.write(data);
  }
  buffer.clear();
  if (content !== "")
    buffer.push(content);
  this._readableState.length = content.length;
  return this;
};
var MAX_HWM = 1073741824;
function computeNewHighWaterMark(n) {
  if (n > MAX_HWM) {
    throw new ERR_OUT_OF_RANGE("size", "<= 1GiB", n);
  } else {
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended)
    return 0;
  if (state.objectMode)
    return 1;
  if (Number.isNaN(n)) {
    if (state.flowing && state.length)
      return state.buffer.first().length;
    return state.length;
  }
  if (n <= state.length)
    return n;
  return state.ended ? state.length : 0;
}
Readable.prototype.read = function(n) {
  if (n === void 0) {
    n = NaN;
  } else if (!Number.isInteger(n)) {
    n = Number.parseInt(n, 10);
  }
  const state = this._readableState;
  const nOrig = n;
  if (n > state.highWaterMark)
    state.highWaterMark = computeNewHighWaterMark(n);
  if (n !== 0)
    state.emittedReadable = false;
  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }
  n = howMuchToRead(n, state);
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }
  let doRead = state.needReadable;
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
  }
  if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
    doRead = false;
  } else if (doRead) {
    state.reading = true;
    state.sync = true;
    if (state.length === 0)
      state.needReadable = true;
    try {
      const result = this._read(state.highWaterMark);
      if (result != null) {
        const then = result.then;
        if (typeof then === "function") {
          then.call(
            result,
            nop2,
            function(err) {
              errorOrDestroy2(this, err);
            }
          );
        }
      }
    } catch (err) {
      errorOrDestroy2(this, err);
    }
    state.sync = false;
    if (!state.reading)
      n = howMuchToRead(nOrig, state);
  }
  let ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;
  if (ret === null) {
    state.needReadable = state.length <= state.highWaterMark;
    n = 0;
  } else {
    state.length -= n;
    if (state.multiAwaitDrain) {
      state.awaitDrainWriters.clear();
    } else {
      state.awaitDrainWriters = null;
    }
  }
  if (state.length === 0) {
    if (!state.ended)
      state.needReadable = true;
    if (nOrig !== n && state.ended)
      endReadable(this);
  }
  if (ret !== null && !state.errorEmitted && !state.closeEmitted) {
    state.dataEmitted = true;
    this.emit("data", ret);
  }
  return ret;
};
function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    const chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;
  if (state.sync) {
    emitReadable(stream);
  } else {
    state.needReadable = false;
    state.emittedReadable = true;
    emitReadable_(stream);
  }
}
function emitReadable(stream) {
  const state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    state.emittedReadable = true;
    process_default.nextTick(emitReadable_, stream);
  }
}
function emitReadable_(stream) {
  const state = stream._readableState;
  if (!state.destroyed && !state.errored && (state.length || state.ended)) {
    stream.emit("readable");
    state.emittedReadable = false;
  }
  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
}
function maybeReadMore(stream, state) {
  if (!state.readingMore && state.constructed) {
    state.readingMore = true;
    process_default.nextTick(maybeReadMore_, stream, state);
  }
}
function maybeReadMore_(stream, state) {
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    const len = state.length;
    stream.read(0);
    if (len === state.length)
      break;
  }
  state.readingMore = false;
}
Readable.prototype._read = function(n) {
  throw new ERR_METHOD_NOT_IMPLEMENTED("_read()");
};
Readable.prototype.pipe = function(dest, pipeOpts) {
  const src = this;
  const state = this._readableState;
  if (state.pipes.length === 1) {
    if (!state.multiAwaitDrain) {
      state.multiAwaitDrain = true;
      state.awaitDrainWriters = new Set(
        state.awaitDrainWriters ? [state.awaitDrainWriters] : []
      );
    }
  }
  state.pipes.push(dest);
  const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process_default.stdout && dest !== process_default.stderr;
  const endFn = doEnd ? onend : unpipe;
  if (state.endEmitted)
    process_default.nextTick(endFn);
  else
    src.once("end", endFn);
  dest.on("unpipe", onunpipe);
  function onunpipe(readable, unpipeInfo) {
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }
  function onend() {
    dest.end();
  }
  let ondrain;
  let cleanedUp = false;
  function cleanup() {
    dest.removeListener("close", onclose);
    dest.removeListener("finish", onfinish);
    if (ondrain) {
      dest.removeListener("drain", ondrain);
    }
    dest.removeListener("error", onerror);
    dest.removeListener("unpipe", onunpipe);
    src.removeListener("end", onend);
    src.removeListener("end", unpipe);
    src.removeListener("data", ondata);
    cleanedUp = true;
    if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }
  function pause() {
    if (!cleanedUp) {
      if (state.pipes.length === 1 && state.pipes[0] === dest) {
        state.awaitDrainWriters = dest;
        state.multiAwaitDrain = false;
      } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
        state.awaitDrainWriters.add(dest);
      }
      src.pause();
    }
    if (!ondrain) {
      ondrain = pipeOnDrain(src, dest);
      dest.on("drain", ondrain);
    }
  }
  src.on("data", ondata);
  function ondata(chunk) {
    const ret = dest.write(chunk);
    if (ret === false) {
      pause();
    }
  }
  function onerror(er) {
    unpipe();
    dest.removeListener("error", onerror);
    if (events_default.listenerCount(dest, "error") === 0) {
      const s = dest._writableState || dest._readableState;
      if (s && !s.errorEmitted) {
        errorOrDestroy2(dest, er);
      } else {
        dest.emit("error", er);
      }
    }
  }
  prependListener3(dest, "error", onerror);
  function onclose() {
    dest.removeListener("finish", onfinish);
    unpipe();
  }
  dest.once("close", onclose);
  function onfinish() {
    dest.removeListener("close", onclose);
    unpipe();
  }
  dest.once("finish", onfinish);
  function unpipe() {
    src.unpipe(dest);
  }
  dest.emit("pipe", src);
  if (dest.writableNeedDrain === true) {
    if (state.flowing) {
      pause();
    }
  } else if (!state.flowing) {
    src.resume();
  }
  return dest;
};
function pipeOnDrain(src, dest) {
  return function pipeOnDrainFunctionResult() {
    const state = src._readableState;
    if (state.awaitDrainWriters === dest) {
      state.awaitDrainWriters = null;
    } else if (state.multiAwaitDrain) {
      state.awaitDrainWriters.delete(dest);
    }
    if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && events_default.listenerCount(src, "data")) {
      state.flowing = true;
      flow(src);
    }
  };
}
Readable.prototype.unpipe = function(dest) {
  const state = this._readableState;
  const unpipeInfo = { hasUnpiped: false };
  if (state.pipes.length === 0)
    return this;
  if (!dest) {
    const dests = state.pipes;
    state.pipes = [];
    this.pause();
    for (let i = 0; i < dests.length; i++)
      dests[i].emit("unpipe", this, { hasUnpiped: false });
    return this;
  }
  const index = state.pipes.indexOf(dest);
  if (index === -1)
    return this;
  state.pipes.splice(index, 1);
  if (state.pipes.length === 0)
    this.pause();
  dest.emit("unpipe", this, unpipeInfo);
  return this;
};
Readable.prototype.on = function(ev, fn) {
  const res = Stream.prototype.on.call(this, ev, fn);
  const state = this._readableState;
  if (ev === "data") {
    state.readableListening = this.listenerCount("readable") > 0;
    if (state.flowing !== false)
      this.resume();
  } else if (ev === "readable") {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process_default.nextTick(nReadingNextTick, this);
      }
    }
  }
  return res;
};
Readable.prototype.addListener = Readable.prototype.on;
Readable.prototype.removeListener = function(ev, fn) {
  const res = Stream.prototype.removeListener.call(
    this,
    ev,
    fn
  );
  if (ev === "readable") {
    process_default.nextTick(updateReadableListening, this);
  }
  return res;
};
Readable.prototype.off = Readable.prototype.removeListener;
Readable.prototype.removeAllListeners = function(ev) {
  const res = Stream.prototype.removeAllListeners.apply(
    this,
    arguments
  );
  if (ev === "readable" || ev === void 0) {
    process_default.nextTick(updateReadableListening, this);
  }
  return res;
};
function updateReadableListening(self) {
  const state = self._readableState;
  state.readableListening = self.listenerCount("readable") > 0;
  if (state.resumeScheduled && state[kPaused] === false) {
    state.flowing = true;
  } else if (self.listenerCount("data") > 0) {
    self.resume();
  } else if (!state.readableListening) {
    state.flowing = null;
  }
}
function nReadingNextTick(self) {
  self.read(0);
}
Readable.prototype.resume = function() {
  const state = this._readableState;
  if (!state.flowing) {
    state.flowing = !state.readableListening;
    resume(this, state);
  }
  state[kPaused] = false;
  return this;
};
function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process_default.nextTick(resume_, stream, state);
  }
}
function resume_(stream, state) {
  if (!state.reading) {
    stream.read(0);
  }
  state.resumeScheduled = false;
  stream.emit("resume");
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}
Readable.prototype.pause = function() {
  if (this._readableState.flowing !== false) {
    this._readableState.flowing = false;
    this.emit("pause");
  }
  this._readableState[kPaused] = true;
  return this;
};
function flow(stream) {
  const state = stream._readableState;
  while (state.flowing && stream.read() !== null) ;
}
Readable.prototype.wrap = function(stream) {
  let paused = false;
  stream.on("data", (chunk) => {
    if (!this.push(chunk) && stream.pause) {
      paused = true;
      stream.pause();
    }
  });
  stream.on("end", () => {
    this.push(null);
  });
  stream.on("error", (err) => {
    errorOrDestroy2(this, err);
  });
  stream.on("close", () => {
    this.destroy();
  });
  stream.on("destroy", () => {
    this.destroy();
  });
  this._read = () => {
    if (paused && stream.resume) {
      paused = false;
      stream.resume();
    }
  };
  const streamKeys = Object.keys(stream);
  for (let j = 1; j < streamKeys.length; j++) {
    const i = streamKeys[j];
    if (this[i] === void 0 && typeof stream[i] === "function") {
      this[i] = stream[i].bind(stream);
    }
  }
  return this;
};
Readable.prototype[Symbol.asyncIterator] = function() {
  return streamToAsyncIterator(this);
};
Readable.prototype.iterator = function(options) {
  return streamToAsyncIterator(this, options);
};
function streamToAsyncIterator(stream, options) {
  if (typeof stream.read !== "function") {
    stream = Readable.wrap(stream, { objectMode: true });
  }
  const iter = createAsyncIterator(stream, options);
  iter.stream = stream;
  return iter;
}
async function* createAsyncIterator(stream, options) {
  let callback = nop2;
  function next(resolve2) {
    if (this === stream) {
      callback();
      callback = nop2;
    } else {
      callback = resolve2;
    }
  }
  stream.on("readable", next);
  let error;
  eos(stream, { writable: false }, (err) => {
    error = err ? aggregateTwoErrors(error, err) : null;
    callback();
    callback = nop2;
  });
  try {
    while (true) {
      const chunk = stream.destroyed ? null : stream.read();
      if (chunk !== null) {
        yield chunk;
      } else if (error) {
        throw error;
      } else if (error === null) {
        return;
      } else {
        await new Promise(next);
      }
    }
  } catch (err) {
    error = aggregateTwoErrors(error, err);
    throw error;
  } finally {
    if ((error || options?.destroyOnReturn !== false) && (error === void 0 || stream._readableState.autoDestroy)) {
      destroyer(stream, null);
    }
  }
}
Object.defineProperties(Readable.prototype, {
  readable: {
    get() {
      const r = this._readableState;
      return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted;
    },
    set(val) {
      if (this._readableState) {
        this._readableState.readable = !!val;
      }
    }
  },
  readableDidRead: {
    enumerable: false,
    get: function() {
      return this._readableState.dataEmitted;
    }
  },
  readableAborted: {
    enumerable: false,
    get: function() {
      return !!(this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted;
    }
  },
  readableHighWaterMark: {
    enumerable: false,
    get: function() {
      return this._readableState.highWaterMark;
    }
  },
  readableBuffer: {
    enumerable: false,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  },
  readableFlowing: {
    enumerable: false,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(state) {
      if (this._readableState) {
        this._readableState.flowing = state;
      }
    }
  },
  readableLength: {
    enumerable: false,
    get() {
      return this._readableState.length;
    }
  },
  readableObjectMode: {
    enumerable: false,
    get() {
      return this._readableState ? this._readableState.objectMode : false;
    }
  },
  readableEncoding: {
    enumerable: false,
    get() {
      return this._readableState ? this._readableState.encoding : null;
    }
  },
  destroyed: {
    enumerable: false,
    get() {
      if (this._readableState === void 0) {
        return false;
      }
      return this._readableState.destroyed;
    },
    set(value) {
      if (!this._readableState) {
        return;
      }
      this._readableState.destroyed = value;
    }
  },
  readableEnded: {
    enumerable: false,
    get() {
      return this._readableState ? this._readableState.endEmitted : false;
    }
  }
});
Object.defineProperties(ReadableState.prototype, {
  // Legacy getter for `pipesCount`.
  pipesCount: {
    get() {
      return this.pipes.length;
    }
  },
  // Legacy property for `paused`.
  paused: {
    get() {
      return this[kPaused] !== false;
    },
    set(value) {
      this[kPaused] = !!value;
    }
  }
});
Readable._fromList = fromList;
function fromList(n, state) {
  if (state.length === 0)
    return null;
  let ret;
  if (state.objectMode)
    ret = state.buffer.shift();
  else if (!n || n >= state.length) {
    if (state.decoder)
      ret = state.buffer.join("");
    else if (state.buffer.length === 1)
      ret = state.buffer.first();
    else
      ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}
function endReadable(stream) {
  const state = stream._readableState;
  if (!state.endEmitted) {
    state.ended = true;
    process_default.nextTick(endReadableNT, state, stream);
  }
}
function endReadableNT(state, stream) {
  if (!state.errored && !state.closeEmitted && !state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.emit("end");
    if (stream.writable && stream.allowHalfOpen === false) {
      process_default.nextTick(endWritableNT, stream);
    } else if (state.autoDestroy) {
      const wState = stream._writableState;
      const autoDestroy = !wState || wState.autoDestroy && // We don't expect the writable to ever 'finish'
      // if writable is explicitly set to false.
      (wState.finished || wState.writable === false);
      if (autoDestroy) {
        stream.destroy();
      }
    }
  }
}
function endWritableNT(stream) {
  const writable = stream.writable && !stream.writableEnded && !stream.destroyed;
  if (writable) {
    stream.end();
  }
}
Readable.from = function(iterable, opts) {
  return from2(Readable, iterable, opts);
};
Readable.wrap = function(src, options) {
  return new Readable({
    objectMode: src.readableObjectMode ?? src.objectMode ?? true,
    ...options,
    destroy(err, callback) {
      destroyer(src, err);
      callback(err);
    }
  }).wrap(src);
};

// frida-shim:node_modules/@frida/readable-stream/lib/writable.js
var writable_default = Writable;
var {
  ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE5,
  ERR_METHOD_NOT_IMPLEMENTED: ERR_METHOD_NOT_IMPLEMENTED2,
  ERR_MULTIPLE_CALLBACK: ERR_MULTIPLE_CALLBACK2,
  ERR_STREAM_CANNOT_PIPE,
  ERR_STREAM_DESTROYED,
  ERR_STREAM_ALREADY_FINISHED,
  ERR_STREAM_NULL_VALUES: ERR_STREAM_NULL_VALUES2,
  ERR_STREAM_WRITE_AFTER_END,
  ERR_UNKNOWN_ENCODING
} = codes;
var { errorOrDestroy: errorOrDestroy3 } = destroy_exports;
Object.setPrototypeOf(Writable.prototype, Stream.prototype);
Object.setPrototypeOf(Writable, Stream);
function nop3() {
}
var kOnFinished = Symbol("kOnFinished");
function WritableState(options, stream, isDuplex) {
  if (typeof isDuplex !== "boolean")
    isDuplex = stream instanceof Stream.Duplex;
  this.objectMode = !!(options && options.objectMode);
  if (isDuplex)
    this.objectMode = this.objectMode || !!(options && options.writableObjectMode);
  this.highWaterMark = options ? getHighWaterMark(this, options, "writableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
  this.finalCalled = false;
  this.needDrain = false;
  this.ending = false;
  this.ended = false;
  this.finished = false;
  this.destroyed = false;
  const noDecode = !!(options && options.decodeStrings === false);
  this.decodeStrings = !noDecode;
  this.defaultEncoding = options && options.defaultEncoding || "utf8";
  this.length = 0;
  this.writing = false;
  this.corked = 0;
  this.sync = true;
  this.bufferProcessing = false;
  this.onwrite = onwrite.bind(void 0, stream);
  this.writecb = null;
  this.writelen = 0;
  this.afterWriteTickInfo = null;
  resetBuffer(this);
  this.pendingcb = 0;
  this.constructed = true;
  this.prefinished = false;
  this.errorEmitted = false;
  this.emitClose = !options || options.emitClose !== false;
  this.autoDestroy = !options || options.autoDestroy !== false;
  this.errored = null;
  this.closed = false;
  this.closeEmitted = false;
  this[kOnFinished] = [];
}
function resetBuffer(state) {
  state.buffered = [];
  state.bufferedIndex = 0;
  state.allBuffers = true;
  state.allNoop = true;
}
WritableState.prototype.getBuffer = function getBuffer() {
  return this.buffered.slice(this.bufferedIndex);
};
Object.defineProperty(WritableState.prototype, "bufferedRequestCount", {
  get() {
    return this.buffered.length - this.bufferedIndex;
  }
});
var realHasInstance = Function.prototype[Symbol.hasInstance];
function Writable(options) {
  const isDuplex = this instanceof Stream.Duplex;
  if (!isDuplex && !realHasInstance.call(Writable, this))
    return new Writable(options);
  this._writableState = new WritableState(options, this, isDuplex);
  if (options) {
    if (typeof options.write === "function")
      this._write = options.write;
    if (typeof options.writev === "function")
      this._writev = options.writev;
    if (typeof options.destroy === "function")
      this._destroy = options.destroy;
    if (typeof options.final === "function")
      this._final = options.final;
    if (typeof options.construct === "function")
      this._construct = options.construct;
    if (options.signal)
      addAbortSignal(options.signal, this);
  }
  Stream.call(this, options);
  construct(this, () => {
    const state = this._writableState;
    if (!state.writing) {
      clearBuffer(this, state);
    }
    finishMaybe(this, state);
  });
}
Object.defineProperty(Writable, Symbol.hasInstance, {
  value: function(object) {
    if (realHasInstance.call(this, object)) return true;
    if (this !== Writable) return false;
    return object && object._writableState instanceof WritableState;
  }
});
Writable.prototype.pipe = function() {
  errorOrDestroy3(this, new ERR_STREAM_CANNOT_PIPE());
};
function _write(stream, chunk, encoding, cb) {
  const state = stream._writableState;
  if (typeof encoding === "function") {
    cb = encoding;
    encoding = state.defaultEncoding;
  } else {
    if (!encoding)
      encoding = state.defaultEncoding;
    else if (encoding !== "buffer" && !Buffer2.isEncoding(encoding))
      throw new ERR_UNKNOWN_ENCODING(encoding);
    if (typeof cb !== "function")
      cb = nop3;
  }
  if (chunk === null) {
    throw new ERR_STREAM_NULL_VALUES2();
  } else if (!state.objectMode) {
    if (typeof chunk === "string") {
      if (state.decodeStrings !== false) {
        chunk = Buffer2.from(chunk, encoding);
        encoding = "buffer";
      }
    } else if (chunk instanceof Buffer2) {
      encoding = "buffer";
    } else if (Stream._isUint8Array(chunk)) {
      chunk = Stream._uint8ArrayToBuffer(chunk);
      encoding = "buffer";
    } else {
      throw new ERR_INVALID_ARG_TYPE5(
        "chunk",
        ["string", "Buffer", "Uint8Array"],
        chunk
      );
    }
  }
  let err;
  if (state.ending) {
    err = new ERR_STREAM_WRITE_AFTER_END();
  } else if (state.destroyed) {
    err = new ERR_STREAM_DESTROYED("write");
  }
  if (err) {
    process_default.nextTick(cb, err);
    errorOrDestroy3(stream, err, true);
    return err;
  }
  state.pendingcb++;
  return writeOrBuffer(stream, state, chunk, encoding, cb);
}
Writable.prototype.write = function(chunk, encoding, cb) {
  return _write(this, chunk, encoding, cb) === true;
};
Writable.prototype.cork = function() {
  this._writableState.corked++;
};
Writable.prototype.uncork = function() {
  const state = this._writableState;
  if (state.corked) {
    state.corked--;
    if (!state.writing)
      clearBuffer(this, state);
  }
};
Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  if (typeof encoding === "string")
    encoding = encoding.toLowerCase();
  if (!Buffer2.isEncoding(encoding))
    throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};
function writeOrBuffer(stream, state, chunk, encoding, callback) {
  const len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  const ret = state.length < state.highWaterMark;
  if (!ret)
    state.needDrain = true;
  if (state.writing || state.corked || state.errored || !state.constructed) {
    state.buffered.push({ chunk, encoding, callback });
    if (state.allBuffers && encoding !== "buffer") {
      state.allBuffers = false;
    }
    if (state.allNoop && callback !== nop3) {
      state.allNoop = false;
    }
  } else {
    state.writelen = len;
    state.writecb = callback;
    state.writing = true;
    state.sync = true;
    stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
  }
  return ret && !state.errored && !state.destroyed;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed)
    state.onwrite(new ERR_STREAM_DESTROYED("write"));
  else if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}
function onwriteError(stream, state, er, cb) {
  --state.pendingcb;
  cb(er);
  errorBuffer(state);
  errorOrDestroy3(stream, er);
}
function onwrite(stream, er) {
  const state = stream._writableState;
  const sync = state.sync;
  const cb = state.writecb;
  if (typeof cb !== "function") {
    errorOrDestroy3(stream, new ERR_MULTIPLE_CALLBACK2());
    return;
  }
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
  if (er) {
    er.stack;
    if (!state.errored) {
      state.errored = er;
    }
    if (stream._readableState && !stream._readableState.errored) {
      stream._readableState.errored = er;
    }
    if (sync) {
      process_default.nextTick(onwriteError, stream, state, er, cb);
    } else {
      onwriteError(stream, state, er, cb);
    }
  } else {
    if (state.buffered.length > state.bufferedIndex) {
      clearBuffer(stream, state);
    }
    if (sync) {
      if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
        state.afterWriteTickInfo.count++;
      } else {
        state.afterWriteTickInfo = { count: 1, cb, stream, state };
        process_default.nextTick(afterWriteTick, state.afterWriteTickInfo);
      }
    } else {
      afterWrite(stream, state, 1, cb);
    }
  }
}
function afterWriteTick({ stream, state, count, cb }) {
  state.afterWriteTickInfo = null;
  return afterWrite(stream, state, count, cb);
}
function afterWrite(stream, state, count, cb) {
  const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain;
  if (needDrain) {
    state.needDrain = false;
    stream.emit("drain");
  }
  while (count-- > 0) {
    state.pendingcb--;
    cb();
  }
  if (state.destroyed) {
    errorBuffer(state);
  }
  finishMaybe(stream, state);
}
function errorBuffer(state) {
  if (state.writing) {
    return;
  }
  for (let n = state.bufferedIndex; n < state.buffered.length; ++n) {
    const { chunk, callback } = state.buffered[n];
    const len = state.objectMode ? 1 : chunk.length;
    state.length -= len;
    callback(state.errored ?? new ERR_STREAM_DESTROYED("write"));
  }
  const onfinishCallbacks = state[kOnFinished].splice(0);
  for (let i = 0; i < onfinishCallbacks.length; i++) {
    onfinishCallbacks[i](state.errored ?? new ERR_STREAM_DESTROYED("end"));
  }
  resetBuffer(state);
}
function clearBuffer(stream, state) {
  if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
    return;
  }
  const { buffered, bufferedIndex, objectMode } = state;
  const bufferedLength = buffered.length - bufferedIndex;
  if (!bufferedLength) {
    return;
  }
  let i = bufferedIndex;
  state.bufferProcessing = true;
  if (bufferedLength > 1 && stream._writev) {
    state.pendingcb -= bufferedLength - 1;
    const callback = state.allNoop ? nop3 : (err) => {
      for (let n = i; n < buffered.length; ++n) {
        buffered[n].callback(err);
      }
    };
    const chunks = state.allNoop && i === 0 ? buffered : buffered.slice(i);
    chunks.allBuffers = state.allBuffers;
    doWrite(stream, state, true, state.length, chunks, "", callback);
    resetBuffer(state);
  } else {
    do {
      const { chunk, encoding, callback } = buffered[i];
      buffered[i++] = null;
      const len = objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, callback);
    } while (i < buffered.length && !state.writing);
    if (i === buffered.length) {
      resetBuffer(state);
    } else if (i > 256) {
      buffered.splice(0, i);
      state.bufferedIndex = 0;
    } else {
      state.bufferedIndex = i;
    }
  }
  state.bufferProcessing = false;
}
Writable.prototype._write = function(chunk, encoding, cb) {
  if (this._writev) {
    this._writev([{ chunk, encoding }], cb);
  } else {
    throw new ERR_METHOD_NOT_IMPLEMENTED2("_write()");
  }
};
Writable.prototype._writev = null;
Writable.prototype.end = function(chunk, encoding, cb) {
  const state = this._writableState;
  if (typeof chunk === "function") {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === "function") {
    cb = encoding;
    encoding = null;
  }
  let err;
  if (chunk !== null && chunk !== void 0) {
    const ret = _write(this, chunk, encoding);
    if (ret instanceof Error) {
      err = ret;
    }
  }
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }
  if (err) {
  } else if (!state.errored && !state.ending) {
    state.ending = true;
    finishMaybe(this, state, true);
    state.ended = true;
  } else if (state.finished) {
    err = new ERR_STREAM_ALREADY_FINISHED("end");
  } else if (state.destroyed) {
    err = new ERR_STREAM_DESTROYED("end");
  }
  if (typeof cb === "function") {
    if (err || state.finished) {
      process_default.nextTick(cb, err);
    } else {
      state[kOnFinished].push(cb);
    }
  }
  return this;
};
function needFinish(state) {
  return state.ending && state.constructed && state.length === 0 && !state.errored && state.buffered.length === 0 && !state.finished && !state.writing && !state.errorEmitted && !state.closeEmitted;
}
function callFinal(stream, state) {
  let called = false;
  function onFinish(err) {
    if (called) {
      errorOrDestroy3(stream, err ?? ERR_MULTIPLE_CALLBACK2());
      return;
    }
    called = true;
    state.pendingcb--;
    if (err) {
      const onfinishCallbacks = state[kOnFinished].splice(0);
      for (let i = 0; i < onfinishCallbacks.length; i++) {
        onfinishCallbacks[i](err);
      }
      errorOrDestroy3(stream, err, state.sync);
    } else if (needFinish(state)) {
      state.prefinished = true;
      stream.emit("prefinish");
      state.pendingcb++;
      process_default.nextTick(finish, stream, state);
    }
  }
  state.sync = true;
  state.pendingcb++;
  try {
    const result = stream._final(onFinish);
    if (result != null) {
      const then = result.then;
      if (typeof then === "function") {
        then.call(
          result,
          function() {
            process_default.nextTick(onFinish, null);
          },
          function(err) {
            process_default.nextTick(onFinish, err);
          }
        );
      }
    }
  } catch (err) {
    onFinish(stream, state, err);
  }
  state.sync = false;
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === "function" && !state.destroyed) {
      state.finalCalled = true;
      callFinal(stream, state);
    } else {
      state.prefinished = true;
      stream.emit("prefinish");
    }
  }
}
function finishMaybe(stream, state, sync) {
  if (needFinish(state)) {
    prefinish(stream, state);
    if (state.pendingcb === 0 && needFinish(state)) {
      state.pendingcb++;
      if (sync) {
        process_default.nextTick(finish, stream, state);
      } else {
        finish(stream, state);
      }
    }
  }
}
function finish(stream, state) {
  state.pendingcb--;
  state.finished = true;
  const onfinishCallbacks = state[kOnFinished].splice(0);
  for (let i = 0; i < onfinishCallbacks.length; i++) {
    onfinishCallbacks[i]();
  }
  stream.emit("finish");
  if (state.autoDestroy) {
    const rState = stream._readableState;
    const autoDestroy = !rState || rState.autoDestroy && // We don't expect the readable to ever 'end'
    // if readable is explicitly set to false.
    (rState.endEmitted || rState.readable === false);
    if (autoDestroy) {
      stream.destroy();
    }
  }
}
Object.defineProperties(Writable.prototype, {
  destroyed: {
    get() {
      return this._writableState ? this._writableState.destroyed : false;
    },
    set(value) {
      if (this._writableState) {
        this._writableState.destroyed = value;
      }
    }
  },
  writable: {
    get() {
      const w = this._writableState;
      return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended;
    },
    set(val) {
      if (this._writableState) {
        this._writableState.writable = !!val;
      }
    }
  },
  writableFinished: {
    get() {
      return this._writableState ? this._writableState.finished : false;
    }
  },
  writableObjectMode: {
    get() {
      return this._writableState ? this._writableState.objectMode : false;
    }
  },
  writableBuffer: {
    get() {
      return this._writableState && this._writableState.getBuffer();
    }
  },
  writableEnded: {
    get() {
      return this._writableState ? this._writableState.ending : false;
    }
  },
  writableNeedDrain: {
    get() {
      const wState = this._writableState;
      if (!wState) return false;
      return !wState.destroyed && !wState.ending && wState.needDrain;
    }
  },
  writableHighWaterMark: {
    get() {
      return this._writableState && this._writableState.highWaterMark;
    }
  },
  writableCorked: {
    get() {
      return this._writableState ? this._writableState.corked : 0;
    }
  },
  writableLength: {
    get() {
      return this._writableState && this._writableState.length;
    }
  }
});
var destroy2 = destroy;
Writable.prototype.destroy = function(err, cb) {
  const state = this._writableState;
  if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
    process_default.nextTick(errorBuffer, state);
  }
  destroy2.call(this, err, cb);
  return this;
};
Writable.prototype._undestroy = undestroy;
Writable.prototype._destroy = function(err, cb) {
  cb(err);
};
Writable.prototype[events_default.captureRejectionSymbol] = function(err) {
  this.destroy(err);
};

// frida-shim:node_modules/@frida/readable-stream/lib/duplex.js
var {
  ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE6,
  ERR_INVALID_RETURN_VALUE
} = codes;
Object.setPrototypeOf(Duplex.prototype, readable_default.prototype);
Object.setPrototypeOf(Duplex, readable_default);
{
  for (const method2 of Object.keys(writable_default.prototype)) {
    if (!Duplex.prototype[method2])
      Duplex.prototype[method2] = writable_default.prototype[method2];
  }
}
function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);
  readable_default.call(this, options);
  writable_default.call(this, options);
  if (options) {
    this.allowHalfOpen = options.allowHalfOpen !== false;
    if (options.readable === false) {
      this._readableState.readable = false;
      this._readableState.ended = true;
      this._readableState.endEmitted = true;
    }
    if (options.writable === false) {
      this._writableState.writable = false;
      this._writableState.ending = true;
      this._writableState.ended = true;
      this._writableState.finished = true;
    }
  } else {
    this.allowHalfOpen = true;
  }
}
Object.defineProperties(Duplex.prototype, {
  writable: Object.getOwnPropertyDescriptor(writable_default.prototype, "writable"),
  writableHighWaterMark: Object.getOwnPropertyDescriptor(writable_default.prototype, "writableHighWaterMark"),
  writableObjectMode: Object.getOwnPropertyDescriptor(writable_default.prototype, "writableObjectMode"),
  writableBuffer: Object.getOwnPropertyDescriptor(writable_default.prototype, "writableBuffer"),
  writableLength: Object.getOwnPropertyDescriptor(writable_default.prototype, "writableLength"),
  writableFinished: Object.getOwnPropertyDescriptor(writable_default.prototype, "writableFinished"),
  writableCorked: Object.getOwnPropertyDescriptor(writable_default.prototype, "writableCorked"),
  writableEnded: Object.getOwnPropertyDescriptor(writable_default.prototype, "writableEnded"),
  writableNeedDrain: Object.getOwnPropertyDescriptor(writable_default.prototype, "writableNeedDrain"),
  destroyed: {
    get() {
      if (this._readableState === void 0 || this._writableState === void 0) {
        return false;
      }
      return this._readableState.destroyed && this._writableState.destroyed;
    },
    set(value) {
      if (this._readableState && this._writableState) {
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    }
  }
});
Duplex.from = function(body) {
  return duplexify(body, "body");
};
var Duplexify = class extends Duplex {
  constructor(options) {
    super(options);
    if (options?.readable === false) {
      this._readableState.readable = false;
      this._readableState.ended = true;
      this._readableState.endEmitted = true;
    }
    if (options?.writable === false) {
      this._writableState.writable = false;
      this._writableState.ending = true;
      this._writableState.ended = true;
      this._writableState.finished = true;
    }
  }
};
function duplexify(body, name) {
  if (isDuplexNodeStream(body)) {
    return body;
  }
  if (isReadableNodeStream(body)) {
    return _duplexify({ readable: body });
  }
  if (isWritableNodeStream(body)) {
    return _duplexify({ writable: body });
  }
  if (isNodeStream(body)) {
    return _duplexify({ writable: false, readable: false });
  }
  if (typeof body === "function") {
    const { value, write: write3, final: final2, destroy: destroy3 } = fromAsyncGen(body);
    if (isIterable(value)) {
      return from2(Duplexify, value, {
        // TODO (ronag): highWaterMark?
        objectMode: true,
        write: write3,
        final: final2,
        destroy: destroy3
      });
    }
    const then2 = value?.then;
    if (typeof then2 === "function") {
      let d;
      const promise = then2.call(
        value,
        (val) => {
          if (val != null) {
            throw new ERR_INVALID_RETURN_VALUE("nully", "body", val);
          }
        },
        (err) => {
          destroyer(d, err);
        }
      );
      return d = new Duplexify({
        // TODO (ronag): highWaterMark?
        objectMode: true,
        readable: false,
        write: write3,
        final(cb) {
          final2(async () => {
            try {
              await promise;
              process_default.nextTick(cb, null);
            } catch (err) {
              process_default.nextTick(cb, err);
            }
          });
        },
        destroy: destroy3
      });
    }
    throw new ERR_INVALID_RETURN_VALUE(
      "Iterable, AsyncIterable or AsyncFunction",
      name,
      value
    );
  }
  if (isIterable(body)) {
    return from2(Duplexify, body, {
      // TODO (ronag): highWaterMark?
      objectMode: true,
      writable: false
    });
  }
  if (typeof body?.writable === "object" || typeof body?.readable === "object") {
    const readable = body?.readable ? isReadableNodeStream(body?.readable) ? body?.readable : duplexify(body.readable) : void 0;
    const writable = body?.writable ? isWritableNodeStream(body?.writable) ? body?.writable : duplexify(body.writable) : void 0;
    return _duplexify({ readable, writable });
  }
  const then = body?.then;
  if (typeof then === "function") {
    let d;
    then.call(
      body,
      (val) => {
        if (val != null) {
          d.push(val);
        }
        d.push(null);
      },
      (err) => {
        destroyer(d, err);
      }
    );
    return d = new Duplexify({
      objectMode: true,
      writable: false,
      read() {
      }
    });
  }
  throw new ERR_INVALID_ARG_TYPE6(
    name,
    [
      "Blob",
      "ReadableStream",
      "WritableStream",
      "Stream",
      "Iterable",
      "AsyncIterable",
      "Function",
      "{ readable, writable } pair",
      "Promise"
    ],
    body
  );
}
function fromAsyncGen(fn) {
  let { promise, resolve: resolve2 } = createDeferredPromise();
  const ac = new AbortController();
  const signal = ac.signal;
  const value = fn(async function* () {
    while (true) {
      const { chunk, done, cb } = await promise;
      process_default.nextTick(cb);
      if (done) return;
      if (signal.aborted) throw new AbortError();
      yield chunk;
      ({ promise, resolve: resolve2 } = createDeferredPromise());
    }
  }(), { signal });
  return {
    value,
    write(chunk, encoding, cb) {
      resolve2({ chunk, done: false, cb });
    },
    final(cb) {
      resolve2({ done: true, cb });
    },
    destroy(err, cb) {
      ac.abort();
      cb(err);
    }
  };
}
function _duplexify(pair) {
  const r = pair.readable && typeof pair.readable.read !== "function" ? readable_default.wrap(pair.readable) : pair.readable;
  const w = pair.writable;
  let readable = !!isReadable(r);
  let writable = !!isWritable(w);
  let ondrain;
  let onfinish;
  let onreadable;
  let onclose;
  let d;
  function onfinished(err) {
    const cb = onclose;
    onclose = null;
    if (cb) {
      cb(err);
    } else if (err) {
      d.destroy(err);
    } else if (!readable && !writable) {
      d.destroy();
    }
  }
  d = new Duplexify({
    // TODO (ronag): highWaterMark?
    readableObjectMode: !!r?.readableObjectMode,
    writableObjectMode: !!w?.writableObjectMode,
    readable,
    writable
  });
  if (writable) {
    eos(w, (err) => {
      writable = false;
      if (err) {
        destroyer(r, err);
      }
      onfinished(err);
    });
    d._write = function(chunk, encoding, callback) {
      if (w.write(chunk, encoding)) {
        callback();
      } else {
        ondrain = callback;
      }
    };
    d._final = function(callback) {
      w.end();
      onfinish = callback;
    };
    w.on("drain", function() {
      if (ondrain) {
        const cb = ondrain;
        ondrain = null;
        cb();
      }
    });
    w.on("finish", function() {
      if (onfinish) {
        const cb = onfinish;
        onfinish = null;
        cb();
      }
    });
  }
  if (readable) {
    eos(r, (err) => {
      readable = false;
      if (err) {
        destroyer(r, err);
      }
      onfinished(err);
    });
    r.on("readable", function() {
      if (onreadable) {
        const cb = onreadable;
        onreadable = null;
        cb();
      }
    });
    r.on("end", function() {
      d.push(null);
    });
    d._read = function() {
      while (true) {
        const buf = r.read();
        if (buf === null) {
          onreadable = d._read;
          return;
        }
        if (!d.push(buf)) {
          return;
        }
      }
    };
  }
  d._destroy = function(err, callback) {
    if (!err && onclose !== null) {
      err = new AbortError();
    }
    onreadable = null;
    ondrain = null;
    onfinish = null;
    if (onclose === null) {
      callback(err);
    } else {
      onclose = callback;
      destroyer(w, err);
      destroyer(r, err);
    }
  };
  return d;
}
function createDeferredPromise() {
  let resolve2;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve2 = res;
    reject = rej;
  });
  return { promise, resolve: resolve2, reject };
}

// frida-shim:node_modules/@frida/readable-stream/lib/transform.js
var {
  ERR_METHOD_NOT_IMPLEMENTED: ERR_METHOD_NOT_IMPLEMENTED3
} = codes;
Object.setPrototypeOf(Transform.prototype, Duplex.prototype);
Object.setPrototypeOf(Transform, Duplex);
var kCallback = Symbol("kCallback");
function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);
  Duplex.call(this, options);
  this._readableState.sync = false;
  this[kCallback] = null;
  if (options) {
    if (typeof options.transform === "function")
      this._transform = options.transform;
    if (typeof options.flush === "function")
      this._flush = options.flush;
  }
  this.on("prefinish", prefinish2);
}
function final(cb) {
  let called = false;
  if (typeof this._flush === "function" && !this.destroyed) {
    const result = this._flush((er, data) => {
      called = true;
      if (er) {
        if (cb) {
          cb(er);
        } else {
          this.destroy(er);
        }
        return;
      }
      if (data != null) {
        this.push(data);
      }
      this.push(null);
      if (cb) {
        cb();
      }
    });
    if (result !== void 0 && result !== null) {
      try {
        const then = result.then;
        if (typeof then === "function") {
          then.call(
            result,
            (data) => {
              if (called)
                return;
              if (data != null)
                this.push(data);
              this.push(null);
              if (cb)
                process_default.nextTick(cb);
            },
            (err) => {
              if (cb) {
                process_default.nextTick(cb, err);
              } else {
                process_default.nextTick(() => this.destroy(err));
              }
            }
          );
        }
      } catch (err) {
        process_default.nextTick(() => this.destroy(err));
      }
    }
  } else {
    this.push(null);
    if (cb) {
      cb();
    }
  }
}
function prefinish2() {
  if (this._final !== final) {
    final.call(this);
  }
}
Transform.prototype._final = final;
Transform.prototype._transform = function(chunk, encoding, callback) {
  throw new ERR_METHOD_NOT_IMPLEMENTED3("_transform()");
};
Transform.prototype._write = function(chunk, encoding, callback) {
  const rState = this._readableState;
  const wState = this._writableState;
  const length = rState.length;
  let called = false;
  const result = this._transform(chunk, encoding, (err, val) => {
    called = true;
    if (err) {
      callback(err);
      return;
    }
    if (val != null) {
      this.push(val);
    }
    if (wState.ended || // Backwards compat.
    length === rState.length || // Backwards compat.
    rState.length < rState.highWaterMark || rState.length === 0) {
      callback();
    } else {
      this[kCallback] = callback;
    }
  });
  if (result !== void 0 && result != null) {
    try {
      const then = result.then;
      if (typeof then === "function") {
        then.call(
          result,
          (val) => {
            if (called)
              return;
            if (val != null) {
              this.push(val);
            }
            if (wState.ended || length === rState.length || rState.length < rState.highWaterMark || rState.length === 0) {
              process_default.nextTick(callback);
            } else {
              this[kCallback] = callback;
            }
          },
          (err) => {
            process_default.nextTick(callback, err);
          }
        );
      }
    } catch (err) {
      process_default.nextTick(callback, err);
    }
  }
};
Transform.prototype._read = function() {
  if (this[kCallback]) {
    const callback = this[kCallback];
    this[kCallback] = null;
    callback();
  }
};

// frida-shim:node_modules/@frida/readable-stream/lib/passthrough.js
Object.setPrototypeOf(PassThrough.prototype, Transform.prototype);
Object.setPrototypeOf(PassThrough, Transform);
function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);
  Transform.call(this, options);
}
PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

// frida-shim:node_modules/@frida/readable-stream/lib/pipeline.js
var {
  ERR_INVALID_ARG_TYPE: ERR_INVALID_ARG_TYPE7,
  ERR_INVALID_RETURN_VALUE: ERR_INVALID_RETURN_VALUE2,
  ERR_MISSING_ARGS: ERR_MISSING_ARGS2,
  ERR_STREAM_DESTROYED: ERR_STREAM_DESTROYED2
} = codes;
function destroyer2(stream, reading, writing, callback) {
  callback = once2(callback);
  let finished2 = false;
  stream.on("close", () => {
    finished2 = true;
  });
  eos(stream, { readable: reading, writable: writing }, (err) => {
    finished2 = !err;
    const rState = stream._readableState;
    if (err && err.code === "ERR_STREAM_PREMATURE_CLOSE" && reading && (rState && rState.ended && !rState.errored && !rState.errorEmitted)) {
      stream.once("end", callback).once("error", callback);
    } else {
      callback(err);
    }
  });
  return (err) => {
    if (finished2) return;
    finished2 = true;
    destroyer(stream, err);
    callback(err || new ERR_STREAM_DESTROYED2("pipe"));
  };
}
function popCallback(streams) {
  return streams.pop();
}
function makeAsyncIterable(val) {
  if (isIterable(val)) {
    return val;
  } else if (isReadableNodeStream(val)) {
    return fromReadable(val);
  }
  throw new ERR_INVALID_ARG_TYPE7(
    "val",
    ["Readable", "Iterable", "AsyncIterable"],
    val
  );
}
async function* fromReadable(val) {
  yield* readable_default.prototype[Symbol.asyncIterator].call(val);
}
async function pump(iterable, writable, finish2) {
  let error;
  let onresolve = null;
  const resume2 = (err) => {
    if (err) {
      error = err;
    }
    if (onresolve) {
      const callback = onresolve;
      onresolve = null;
      callback();
    }
  };
  const wait = () => new Promise((resolve2, reject) => {
    if (error) {
      reject(error);
    } else {
      onresolve = () => {
        if (error) {
          reject(error);
        } else {
          resolve2();
        }
      };
    }
  });
  writable.on("drain", resume2);
  const cleanup = eos(writable, { readable: false }, resume2);
  try {
    if (writable.writableNeedDrain) {
      await wait();
    }
    for await (const chunk of iterable) {
      if (!writable.write(chunk)) {
        await wait();
      }
    }
    writable.end();
    await wait();
    finish2();
  } catch (err) {
    finish2(error !== err ? aggregateTwoErrors(error, err) : err);
  } finally {
    cleanup();
    writable.off("drain", resume2);
  }
}
var pipeline_default = pipeline;
function pipeline(...streams) {
  const callback = once2(popCallback(streams));
  if (Array.isArray(streams[0]) && streams.length === 1) {
    streams = streams[0];
  }
  return pipelineImpl(streams, callback);
}
function pipelineImpl(streams, callback, opts) {
  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS2("streams");
  }
  const ac = new AbortController();
  const signal = ac.signal;
  const outerSignal = opts?.signal;
  function abort() {
    finishImpl(new AbortError());
  }
  outerSignal?.addEventListener("abort", abort);
  let error;
  let value;
  const destroys = [];
  let finishCount = 0;
  function finish2(err) {
    finishImpl(err, --finishCount === 0);
  }
  function finishImpl(err, final2) {
    if (err && (!error || error.code === "ERR_STREAM_PREMATURE_CLOSE")) {
      error = err;
    }
    if (!error && !final2) {
      return;
    }
    while (destroys.length) {
      destroys.shift()(error);
    }
    outerSignal?.removeEventListener("abort", abort);
    ac.abort();
    if (final2) {
      callback(error, value);
    }
  }
  let ret;
  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i];
    const reading = i < streams.length - 1;
    const writing = i > 0;
    if (isNodeStream(stream)) {
      finishCount++;
      destroys.push(destroyer2(stream, reading, writing, finish2));
    }
    if (i === 0) {
      if (typeof stream === "function") {
        ret = stream({ signal });
        if (!isIterable(ret)) {
          throw new ERR_INVALID_RETURN_VALUE2(
            "Iterable, AsyncIterable or Stream",
            "source",
            ret
          );
        }
      } else if (isIterable(stream) || isReadableNodeStream(stream)) {
        ret = stream;
      } else {
        ret = Duplex.from(stream);
      }
    } else if (typeof stream === "function") {
      ret = makeAsyncIterable(ret);
      ret = stream(ret, { signal });
      if (reading) {
        if (!isIterable(ret, true)) {
          throw new ERR_INVALID_RETURN_VALUE2(
            "AsyncIterable",
            `transform[${i - 1}]`,
            ret
          );
        }
      } else {
        if (!PassThrough) {
        }
        const pt = new PassThrough({
          objectMode: true
        });
        const then = ret?.then;
        if (typeof then === "function") {
          then.call(
            ret,
            (val) => {
              value = val;
              pt.end(val);
            },
            (err) => {
              pt.destroy(err);
            }
          );
        } else if (isIterable(ret, true)) {
          finishCount++;
          pump(ret, pt, finish2);
        } else {
          throw new ERR_INVALID_RETURN_VALUE2(
            "AsyncIterable or Promise",
            "destination",
            ret
          );
        }
        ret = pt;
        finishCount++;
        destroys.push(destroyer2(ret, false, true, finish2));
      }
    } else if (isNodeStream(stream)) {
      if (isReadableNodeStream(ret)) {
        ret.pipe(stream);
        if (stream === process_default.stdout || stream === process_default.stderr) {
          ret.on("end", () => stream.end());
        }
      } else {
        ret = makeAsyncIterable(ret);
        finishCount++;
        pump(ret, stream, finish2);
      }
      ret = stream;
    } else {
      ret = Duplex.from(stream);
    }
  }
  if (signal?.aborted || outerSignal?.aborted) {
    process_default.nextTick(abort);
  }
  return ret;
}

// frida-shim:node_modules/@frida/readable-stream/lib/compose.js
var {
  ERR_INVALID_ARG_VALUE: ERR_INVALID_ARG_VALUE2,
  ERR_MISSING_ARGS: ERR_MISSING_ARGS3
} = codes;
var ComposeDuplex = class extends Duplex {
  constructor(options) {
    super(options);
    if (options?.readable === false) {
      this._readableState.readable = false;
      this._readableState.ended = true;
      this._readableState.endEmitted = true;
    }
    if (options?.writable === false) {
      this._writableState.writable = false;
      this._writableState.ending = true;
      this._writableState.ended = true;
      this._writableState.finished = true;
    }
  }
};
function compose(...streams) {
  if (streams.length === 0) {
    throw new ERR_MISSING_ARGS3("streams");
  }
  if (streams.length === 1) {
    return Duplex.from(streams[0]);
  }
  const orgStreams = [...streams];
  if (typeof streams[0] === "function") {
    streams[0] = Duplex.from(streams[0]);
  }
  if (typeof streams[streams.length - 1] === "function") {
    const idx = streams.length - 1;
    streams[idx] = Duplex.from(streams[idx]);
  }
  for (let n = 0; n < streams.length; ++n) {
    if (!isNodeStream(streams[n])) {
      continue;
    }
    if (n < streams.length - 1 && !isReadable(streams[n])) {
      throw new ERR_INVALID_ARG_VALUE2(
        `streams[${n}]`,
        orgStreams[n],
        "must be readable"
      );
    }
    if (n > 0 && !isWritable(streams[n])) {
      throw new ERR_INVALID_ARG_VALUE2(
        `streams[${n}]`,
        orgStreams[n],
        "must be writable"
      );
    }
  }
  let ondrain;
  let onfinish;
  let onreadable;
  let onclose;
  let d;
  function onfinished(err) {
    const cb = onclose;
    onclose = null;
    if (cb) {
      cb(err);
    } else if (err) {
      d.destroy(err);
    } else if (!readable && !writable) {
      d.destroy();
    }
  }
  const head = streams[0];
  const tail = pipeline(streams, onfinished);
  const writable = !!isWritable(head);
  const readable = !!isReadable(tail);
  d = new ComposeDuplex({
    // TODO (ronag): highWaterMark?
    writableObjectMode: !!head?.writableObjectMode,
    readableObjectMode: !!tail?.writableObjectMode,
    writable,
    readable
  });
  if (writable) {
    d._write = function(chunk, encoding, callback) {
      if (head.write(chunk, encoding)) {
        callback();
      } else {
        ondrain = callback;
      }
    };
    d._final = function(callback) {
      head.end();
      onfinish = callback;
    };
    head.on("drain", function() {
      if (ondrain) {
        const cb = ondrain;
        ondrain = null;
        cb();
      }
    });
    tail.on("finish", function() {
      if (onfinish) {
        const cb = onfinish;
        onfinish = null;
        cb();
      }
    });
  }
  if (readable) {
    tail.on("readable", function() {
      if (onreadable) {
        const cb = onreadable;
        onreadable = null;
        cb();
      }
    });
    tail.on("end", function() {
      d.push(null);
    });
    d._read = function() {
      while (true) {
        const buf = tail.read();
        if (buf === null) {
          onreadable = d._read;
          return;
        }
        if (!d.push(buf)) {
          return;
        }
      }
    };
  }
  d._destroy = function(err, callback) {
    if (!err && onclose !== null) {
      err = new AbortError();
    }
    onreadable = null;
    ondrain = null;
    onfinish = null;
    if (onclose === null) {
      callback(err);
    } else {
      onclose = callback;
      destroyer(tail, err);
    }
  };
  return d;
}

// frida-shim:node_modules/@frida/readable-stream/lib/promises.js
var promises_exports = {};
__export(promises_exports, {
  finished: () => finished,
  pipeline: () => pipeline2
});
function pipeline2(...streams) {
  return new Promise((resolve2, reject) => {
    let signal;
    const lastArg = streams[streams.length - 1];
    if (lastArg && typeof lastArg === "object" && !isNodeStream(lastArg) && !isIterable(lastArg)) {
      const options = streams.pop();
      signal = options.signal;
    }
    pipelineImpl(streams, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve2(value);
      }
    }, { signal });
  });
}
function finished(stream, opts) {
  return new Promise((resolve2, reject) => {
    eos(stream, opts, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve2();
      }
    });
  });
}

// frida-shim:node_modules/@frida/readable-stream/readable.js
Stream.isDisturbed = isDisturbed;
Stream.Readable = readable_default;
Stream.Writable = writable_default;
Stream.Duplex = Duplex;
Stream.Transform = Transform;
Stream.PassThrough = PassThrough;
Stream.pipeline = pipeline_default;
Stream.addAbortSignal = addAbortSignal;
Stream.finished = eos;
Stream.destroy = destroyer;
Stream.compose = compose;
Object.defineProperty(Stream, "promises", {
  configurable: true,
  enumerable: true,
  get() {
    return promises_exports;
  }
});
Object.defineProperty(pipeline_default, promisify.custom, {
  enumerable: true,
  get() {
    return pipeline2;
  }
});
Object.defineProperty(eos, promisify.custom, {
  enumerable: true,
  get() {
    return finished;
  }
});
Stream.Stream = Stream;
Stream._isUint8Array = types2.isUint8Array;
Stream._uint8ArrayToBuffer = Buffer2.from;

// frida-shim:node_modules/@frida/stream/index.js
var stream_default = Stream;

// frida-shim:node_modules/frida-fs/dist/index.js
var getWindowsApi = memoize2(_getWindowsApi);
var getPosixApi = memoize2(_getPosixApi);
var platform2 = Process.platform;
var pointerSize11 = Process.pointerSize;
var isWindows = platform2 === "windows";
var S_IFMT = 61440;
var S_IFREG = 32768;
var S_IFDIR = 16384;
var S_IFCHR = 8192;
var S_IFBLK = 24576;
var S_IFIFO = 4096;
var S_IFLNK = 40960;
var S_IFSOCK = 49152;
var universalConstants = {
  S_IFMT,
  S_IFREG,
  S_IFDIR,
  S_IFCHR,
  S_IFBLK,
  S_IFIFO,
  S_IFLNK,
  S_IFSOCK,
  S_IRWXU: 448,
  S_IRUSR: 256,
  S_IWUSR: 128,
  S_IXUSR: 64,
  S_IRWXG: 56,
  S_IRGRP: 32,
  S_IWGRP: 16,
  S_IXGRP: 8,
  S_IRWXO: 7,
  S_IROTH: 4,
  S_IWOTH: 2,
  S_IXOTH: 1,
  DT_UNKNOWN: 0,
  DT_FIFO: 1,
  DT_CHR: 2,
  DT_DIR: 4,
  DT_BLK: 6,
  DT_REG: 8,
  DT_LNK: 10,
  DT_SOCK: 12,
  DT_WHT: 14
};
var platformConstants = {
  darwin: {
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    O_CREAT: 512,
    O_EXCL: 2048,
    O_NOCTTY: 131072,
    O_TRUNC: 1024,
    O_APPEND: 8,
    O_DIRECTORY: 1048576,
    O_NOFOLLOW: 256,
    O_SYNC: 128,
    O_DSYNC: 4194304,
    O_SYMLINK: 2097152,
    O_NONBLOCK: 4
  },
  linux: {
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    O_CREAT: 64,
    O_EXCL: 128,
    O_NOCTTY: 256,
    O_TRUNC: 512,
    O_APPEND: 1024,
    O_DIRECTORY: 65536,
    O_NOATIME: 262144,
    O_NOFOLLOW: 131072,
    O_SYNC: 1052672,
    O_DSYNC: 4096,
    O_DIRECT: 16384,
    O_NONBLOCK: 2048
  }
};
var constants = {
  ...universalConstants,
  ...platformConstants[platform2]
};
var INVALID_HANDLE_VALUE = -1;
var GENERIC_READ = 2147483648;
var GENERIC_WRITE = 1073741824;
var FILE_SHARE_READ = 1;
var FILE_SHARE_WRITE = 2;
var FILE_SHARE_DELETE = 4;
var CREATE_ALWAYS = 2;
var OPEN_EXISTING = 3;
var FILE_ATTRIBUTE_NORMAL = 128;
var FILE_ATTRIBUTE_DIRECTORY = 16;
var FILE_ATTRIBUTE_REPARSE_POINT = 1024;
var IO_REPARSE_TAG_MOUNT_POINT = 2684354563;
var IO_REPARSE_TAG_SYMLINK = 2684354572;
var FILE_FLAG_OVERLAPPED = 1073741824;
var FILE_FLAG_BACKUP_SEMANTICS = 33554432;
var ERROR_NOT_ENOUGH_MEMORY = 8;
var ERROR_SHARING_VIOLATION = 32;
var SEEK_SET = 0;
var SEEK_END = 2;
var EINTR = 4;
var ReadStream = class extends stream_default.Readable {
  #input = null;
  #readRequest = null;
  constructor(path) {
    super({
      highWaterMark: 4 * 1024 * 1024
    });
    if (isWindows) {
      const api3 = getWindowsApi();
      const result = api3.CreateFileW(Memory.allocUtf16String(path), GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_FLAG_OVERLAPPED, NULL);
      const handle2 = result.value;
      if (handle2.equals(INVALID_HANDLE_VALUE)) {
        process_default.nextTick(() => {
          this.destroy(makeWindowsError(result.lastError));
        });
        return;
      }
      this.#input = new Win32InputStream(handle2, { autoClose: true });
    } else {
      const api3 = getPosixApi();
      const result = api3.open(Memory.allocUtf8String(path), constants.O_RDONLY, 0);
      const fd = result.value;
      if (fd === -1) {
        process_default.nextTick(() => {
          this.destroy(makePosixError(result.errno));
        });
        return;
      }
      this.#input = new UnixInputStream(fd, { autoClose: true });
    }
  }
  _destroy(error, callback) {
    this.#input?.close();
    this.#input = null;
    callback(error);
  }
  _read(size) {
    if (this.#readRequest !== null)
      return;
    this.#readRequest = this.#input.read(size).then((buffer) => {
      this.#readRequest = null;
      if (buffer.byteLength === 0) {
        this.push(null);
        return;
      }
      if (this.push(Buffer2.from(buffer)))
        this._read(size);
    }).catch((error) => {
      this.#readRequest = null;
      this.destroy(error);
    });
  }
};
var WriteStream = class extends stream_default.Writable {
  #output = null;
  #writeRequest = null;
  constructor(path) {
    super({
      highWaterMark: 4 * 1024 * 1024
    });
    if (isWindows) {
      const api3 = getWindowsApi();
      const result = api3.CreateFileW(Memory.allocUtf16String(path), GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL | FILE_FLAG_OVERLAPPED, NULL);
      const handle2 = result.value;
      if (handle2.equals(INVALID_HANDLE_VALUE)) {
        process_default.nextTick(() => {
          this.destroy(makeWindowsError(result.lastError));
        });
        return;
      }
      this.#output = new Win32OutputStream(handle2, { autoClose: true });
    } else {
      const api3 = getPosixApi();
      const pathStr = Memory.allocUtf8String(path);
      const flags = constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC;
      const mode = constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IROTH;
      const result = api3.open(pathStr, flags, mode);
      const fd = result.value;
      if (fd === -1) {
        process_default.nextTick(() => {
          this.destroy(makePosixError(result.errno));
        });
        return;
      }
      this.#output = new UnixOutputStream(fd, { autoClose: true });
    }
  }
  _destroy(error, callback) {
    this.#output?.close();
    this.#output = null;
    callback(error);
  }
  _write(chunk, encoding, callback) {
    if (this.#writeRequest !== null)
      return;
    this.#writeRequest = this.#output.writeAll(chunk).then((size) => {
      this.#writeRequest = null;
      callback();
    }).catch((error) => {
      this.#writeRequest = null;
      callback(error);
    });
  }
};
var windowsBackend = {
  enumerateDirectoryEntries(path, callback) {
    enumerateWindowsDirectoryEntriesMatching(path + "\\*", callback);
  },
  readFileSync(path, options = {}) {
    if (typeof options === "string")
      options = { encoding: options };
    const { encoding = null } = options;
    const { CreateFileW, GetFileSizeEx, ReadFile, CloseHandle } = getWindowsApi();
    const createRes = CreateFileW(Memory.allocUtf16String(path), GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
    const handle2 = createRes.value;
    if (handle2.equals(INVALID_HANDLE_VALUE))
      throwWindowsError(createRes.lastError);
    try {
      const scratchBuf = Memory.alloc(8);
      const fileSizeBuf = scratchBuf;
      const getRes = GetFileSizeEx(handle2, fileSizeBuf);
      if (getRes.value === 0)
        throwWindowsError(getRes.lastError);
      const fileSize = fileSizeBuf.readU64().valueOf();
      const buf = Memory.alloc(fileSize);
      const numBytesReadBuf = scratchBuf;
      const readRes = ReadFile(handle2, buf, fileSize, numBytesReadBuf, NULL);
      if (readRes.value === 0)
        throwWindowsError(readRes.lastError);
      const n = numBytesReadBuf.readU32();
      if (n !== fileSize)
        throw new Error("Short read");
      return parseReadFileResult(buf, fileSize, encoding);
    } finally {
      CloseHandle(handle2);
    }
  },
  readlinkSync(path) {
    const { CreateFileW, GetFinalPathNameByHandleW, CloseHandle } = getWindowsApi();
    const createRes = CreateFileW(Memory.allocUtf16String(path), 0, FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE, NULL, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, NULL);
    const handle2 = createRes.value;
    if (handle2.equals(INVALID_HANDLE_VALUE))
      throwWindowsError(createRes.lastError);
    try {
      let maxLength = 256;
      while (true) {
        const buf = Memory.alloc(maxLength * 2);
        const { value, lastError } = GetFinalPathNameByHandleW(handle2, buf, maxLength, 0);
        if (value === 0)
          throwWindowsError(lastError);
        if (lastError === ERROR_NOT_ENOUGH_MEMORY) {
          maxLength *= 2;
          continue;
        }
        return buf.readUtf16String().substring(4);
      }
    } finally {
      CloseHandle(handle2);
    }
  },
  rmdirSync(path) {
    const result = getWindowsApi().RemoveDirectoryW(Memory.allocUtf16String(path));
    if (result.value === 0)
      throwWindowsError(result.lastError);
  },
  unlinkSync(path) {
    const result = getWindowsApi().DeleteFileW(Memory.allocUtf16String(path));
    if (result.value === 0)
      throwWindowsError(result.lastError);
  },
  statSync(path) {
    const s = windowsBackend.lstatSync(path);
    if (!s.isSymbolicLink())
      return s;
    const target = windowsBackend.readlinkSync(path);
    return windowsBackend.lstatSync(target);
  },
  lstatSync(path) {
    const getFileExInfoStandard = 0;
    const buf = Memory.alloc(36);
    const result = getWindowsApi().GetFileAttributesExW(Memory.allocUtf16String(path), getFileExInfoStandard, buf);
    if (result.value === 0) {
      if (result.lastError === ERROR_SHARING_VIOLATION) {
        let fileAttrData;
        enumerateWindowsDirectoryEntriesMatching(path, (data) => {
          fileAttrData = Memory.dup(data, 36);
        });
        return makeStatsProxy(path, fileAttrData);
      }
      throwWindowsError(result.lastError);
    }
    return makeStatsProxy(path, buf);
  }
};
function enumerateWindowsDirectoryEntriesMatching(filename, callback) {
  const { FindFirstFileW, FindNextFileW, FindClose } = getWindowsApi();
  const data = Memory.alloc(592);
  const result = FindFirstFileW(Memory.allocUtf16String(filename), data);
  const handle2 = result.value;
  if (handle2.equals(INVALID_HANDLE_VALUE))
    throwWindowsError(result.lastError);
  try {
    do {
      callback(data);
    } while (FindNextFileW(handle2, data) !== 0);
  } finally {
    FindClose(handle2);
  }
}
var posixBackend = {
  enumerateDirectoryEntries(path, callback) {
    const { opendir, opendir$INODE64, closedir, readdir: readdir2, readdir$INODE64 } = getPosixApi();
    const opendirImpl = opendir$INODE64 || opendir;
    const readdirImpl = readdir$INODE64 || readdir2;
    const dir = opendirImpl(Memory.allocUtf8String(path));
    const dirHandle = dir.value;
    if (dirHandle.isNull())
      throwPosixError(dir.errno);
    try {
      let entry;
      while (!(entry = readdirImpl(dirHandle)).isNull()) {
        callback(entry);
      }
    } finally {
      closedir(dirHandle);
    }
  },
  readFileSync(path, options = {}) {
    if (typeof options === "string")
      options = { encoding: options };
    const { encoding = null } = options;
    const { open, close, lseek, read: read2 } = getPosixApi();
    const openResult = open(Memory.allocUtf8String(path), constants.O_RDONLY, 0);
    const fd = openResult.value;
    if (fd === -1)
      throwPosixError(openResult.errno);
    try {
      const fileSize = lseek(fd, 0, SEEK_END).valueOf();
      lseek(fd, 0, SEEK_SET);
      const buf = Memory.alloc(fileSize);
      let readResult, n, readFailed;
      do {
        readResult = read2(fd, buf, fileSize);
        n = readResult.value.valueOf();
        readFailed = n === -1;
      } while (readFailed && readResult.errno === EINTR);
      if (readFailed)
        throwPosixError(readResult.errno);
      if (n !== fileSize.valueOf())
        throw new Error("Short read");
      return parseReadFileResult(buf, fileSize, encoding);
    } finally {
      close(fd);
    }
  },
  readlinkSync(path) {
    const pathStr = Memory.allocUtf8String(path);
    const linkSize = posixBackend.lstatSync(path).size.valueOf();
    const buf = Memory.alloc(linkSize);
    const result = getPosixApi().readlink(pathStr, buf, linkSize);
    const n = result.value.valueOf();
    if (n === -1)
      throwPosixError(result.errno);
    return buf.readUtf8String(n);
  },
  rmdirSync(path) {
    const result = getPosixApi().rmdir(Memory.allocUtf8String(path));
    if (result.value === -1)
      throwPosixError(result.errno);
  },
  unlinkSync(path) {
    const result = getPosixApi().unlink(Memory.allocUtf8String(path));
    if (result.value === -1)
      throwPosixError(result.errno);
  },
  statSync(path) {
    return performStatPosix(getStatSpec()._stat, path);
  },
  lstatSync(path) {
    return performStatPosix(getStatSpec()._lstat, path);
  }
};
function writeFileSync(path, data, options = {}) {
  if (typeof options === "string")
    options = { encoding: options };
  const { encoding = null } = options;
  let rawData;
  if (typeof data === "string") {
    if (encoding !== null && !encodingIsUtf8(encoding))
      rawData = Buffer2.from(data, encoding).buffer;
    else
      rawData = data;
  } else {
    rawData = data.buffer;
  }
  const file = new File(path, "wb");
  try {
    file.write(rawData);
  } finally {
    file.close();
  }
}
function performStatPosix(impl2, path) {
  const buf = Memory.alloc(statBufSize);
  const result = impl2(Memory.allocUtf8String(path), buf);
  if (result.value !== 0)
    throwPosixError(result.errno);
  return makeStatsProxy(path, buf);
}
function parseReadFileResult(buf, fileSize, encoding) {
  if (encodingIsUtf8(encoding))
    return buf.readUtf8String(fileSize);
  const value = Buffer2.from(buf.readByteArray(fileSize));
  if (encoding !== null)
    return value.toString(encoding);
  return value;
}
function encodingIsUtf8(encoding) {
  return encoding === "utf8" || encoding === "utf-8";
}
var backend = isWindows ? windowsBackend : posixBackend;
var { enumerateDirectoryEntries, readFileSync, readlinkSync, rmdirSync, unlinkSync, statSync, lstatSync } = backend;
var direntSpecs = {
  "windows": {
    "d_name": [44, "Utf16String"],
    "d_type": [0, readWindowsFileAttributes],
    "atime": [12, readWindowsFileTime],
    "mtime": [20, readWindowsFileTime],
    "ctime": [4, readWindowsFileTime],
    "size": [28, readWindowsFileSize]
  },
  "linux-32": {
    "d_name": [11, "Utf8String"],
    "d_type": [10, "U8"]
  },
  "linux-64": {
    "d_name": [19, "Utf8String"],
    "d_type": [18, "U8"]
  },
  "darwin-32": {
    "d_name": [21, "Utf8String"],
    "d_type": [20, "U8"]
  },
  "darwin-64": {
    "d_name": [21, "Utf8String"],
    "d_type": [20, "U8"]
  }
};
var direntSpec = isWindows ? direntSpecs.windows : direntSpecs[`${platform2}-${pointerSize11 * 8}`];
function readdirSync(path) {
  const entries = [];
  enumerateDirectoryEntries(path, (entry) => {
    const name = readDirentField(entry, "d_name");
    entries.push(name);
  });
  return entries;
}
function list(path) {
  const extraFieldNames = Object.keys(direntSpec).filter((k) => !k.startsWith("d_"));
  const entries = [];
  enumerateDirectoryEntries(path, (entry) => {
    const name = readDirentField(entry, "d_name");
    const type = readDirentField(entry, "d_type", path_default.join(path, name));
    const extras = {};
    for (const f2 of extraFieldNames)
      extras[f2] = readDirentField(entry, f2);
    entries.push({
      name,
      type,
      ...extras
    });
  });
  return entries;
}
function readDirentField(entry, name, ...args) {
  const fieldSpec = direntSpec[name];
  const [offset, type] = fieldSpec;
  const read2 = typeof type === "string" ? NativePointer.prototype["read" + type] : type;
  const value = read2.call(entry.add(offset), ...args);
  if (value instanceof Int64 || value instanceof UInt64)
    return value.valueOf();
  return value;
}
var statFields = /* @__PURE__ */ new Set([
  "dev",
  "mode",
  "nlink",
  "uid",
  "gid",
  "rdev",
  "blksize",
  "ino",
  "size",
  "blocks",
  "atimeMs",
  "mtimeMs",
  "ctimeMs",
  "birthtimeMs",
  "atime",
  "mtime",
  "ctime",
  "birthtime"
]);
var statSpecGenericLinux32 = {
  size: 88,
  fields: {
    "dev": [0, "U64"],
    "mode": [16, "U32"],
    "nlink": [20, "U32"],
    "ino": [12, "U32"],
    "uid": [24, "U32"],
    "gid": [28, "U32"],
    "rdev": [32, "U64"],
    "atime": [56, readTimespec32],
    "mtime": [64, readTimespec32],
    "ctime": [72, readTimespec32],
    "size": [44, "S32"],
    "blocks": [52, "S32"],
    "blksize": [48, "S32"]
  }
};
var statSpecs = {
  "windows": {
    size: 36,
    fields: {
      "dev": [0, returnZero],
      "mode": [0, readWindowsFileAttributes],
      "nlink": [0, returnOne],
      "ino": [0, returnZero],
      "uid": [0, returnZero],
      "gid": [0, returnZero],
      "rdev": [0, returnZero],
      "atime": [12, readWindowsFileTime],
      "mtime": [20, readWindowsFileTime],
      "ctime": [20, readWindowsFileTime],
      "birthtime": [4, readWindowsFileTime],
      "size": [28, readWindowsFileSize],
      "blocks": [28, readWindowsFileSize],
      "blksize": [0, returnOne]
    }
  },
  "darwin-32": {
    size: 108,
    fields: {
      "dev": [0, "S32"],
      "mode": [4, "U16"],
      "nlink": [6, "U16"],
      "ino": [8, "U64"],
      "uid": [16, "U32"],
      "gid": [20, "U32"],
      "rdev": [24, "S32"],
      "atime": [28, readTimespec32],
      "mtime": [36, readTimespec32],
      "ctime": [44, readTimespec32],
      "birthtime": [52, readTimespec32],
      "size": [60, "S64"],
      "blocks": [68, "S64"],
      "blksize": [76, "S32"]
    }
  },
  "darwin-64": {
    size: 144,
    fields: {
      "dev": [0, "S32"],
      "mode": [4, "U16"],
      "nlink": [6, "U16"],
      "ino": [8, "U64"],
      "uid": [16, "U32"],
      "gid": [20, "U32"],
      "rdev": [24, "S32"],
      "atime": [32, readTimespec64],
      "mtime": [48, readTimespec64],
      "ctime": [64, readTimespec64],
      "birthtime": [80, readTimespec64],
      "size": [96, "S64"],
      "blocks": [104, "S64"],
      "blksize": [112, "S32"]
    }
  },
  "linux-ia32": statSpecGenericLinux32,
  "linux-ia32-stat64": {
    size: 96,
    fields: {
      "dev": [0, "U64"],
      "mode": [16, "U32"],
      "nlink": [20, "U32"],
      "ino": [88, "U64"],
      "uid": [24, "U32"],
      "gid": [28, "U32"],
      "rdev": [32, "U64"],
      "atime": [64, readTimespec32],
      "mtime": [72, readTimespec32],
      "ctime": [80, readTimespec32],
      "size": [44, "S64"],
      "blocks": [56, "S64"],
      "blksize": [52, "S32"]
    }
  },
  "linux-x64": {
    size: 144,
    fields: {
      "dev": [0, "U64"],
      "mode": [24, "U32"],
      "nlink": [16, "U64"],
      "ino": [8, "U64"],
      "uid": [28, "U32"],
      "gid": [32, "U32"],
      "rdev": [40, "U64"],
      "atime": [72, readTimespec64],
      "mtime": [88, readTimespec64],
      "ctime": [104, readTimespec64],
      "size": [48, "S64"],
      "blocks": [64, "S64"],
      "blksize": [56, "S64"]
    }
  },
  "linux-arm": statSpecGenericLinux32,
  "linux-arm-stat64": {
    size: 104,
    fields: {
      "dev": [0, "U64"],
      "mode": [16, "U32"],
      "nlink": [20, "U32"],
      "ino": [96, "U64"],
      "uid": [24, "U32"],
      "gid": [28, "U32"],
      "rdev": [32, "U64"],
      "atime": [72, readTimespec32],
      "mtime": [80, readTimespec32],
      "ctime": [88, readTimespec32],
      "size": [48, "S64"],
      "blocks": [64, "S64"],
      "blksize": [56, "S32"]
    }
  },
  "linux-arm64": {
    size: 128,
    fields: {
      "dev": [0, "U64"],
      "mode": [16, "U32"],
      "nlink": [20, "U32"],
      "ino": [8, "U64"],
      "uid": [24, "U32"],
      "gid": [28, "U32"],
      "rdev": [32, "U64"],
      "atime": [72, readTimespec64],
      "mtime": [88, readTimespec64],
      "ctime": [104, readTimespec64],
      "size": [48, "S64"],
      "blocks": [64, "S64"],
      "blksize": [56, "S32"]
    }
  }
};
var linuxStatVersions = {
  ia32: 3,
  x64: 1,
  arm: 3,
  arm64: 0,
  mips: 3
};
var STAT_VER_LINUX = linuxStatVersions[Process.arch];
var cachedStatSpec = null;
var statBufSize = 256;
function getStatSpec() {
  if (cachedStatSpec !== null)
    return cachedStatSpec;
  let statSpec;
  if (isWindows) {
    statSpec = statSpecs.windows;
  } else {
    const api3 = getPosixApi();
    const stat64Impl = api3.stat64 ?? api3.__xstat64;
    let platformId;
    if (platform2 === "darwin") {
      platformId = `darwin-${pointerSize11 * 8}`;
    } else {
      platformId = `${platform2}-${Process.arch}`;
      if (pointerSize11 === 4 && stat64Impl !== void 0) {
        platformId += "-stat64";
      }
    }
    statSpec = statSpecs[platformId];
    if (statSpec === void 0)
      throw new Error("Current OS/arch combo is not yet supported; please open a PR");
    statSpec._stat = stat64Impl ?? api3.stat;
    statSpec._lstat = api3.lstat64 ?? api3.__lxstat64 ?? api3.lstat;
  }
  cachedStatSpec = statSpec;
  return statSpec;
}
var Stats = class {
  dev;
  mode;
  nlink;
  uid;
  gid;
  rdev;
  blksize;
  ino;
  size;
  blocks;
  atimeMs;
  mtimeMs;
  ctimeMs;
  birthtimeMs;
  atime;
  mtime;
  ctime;
  birthtime;
  buffer;
  isFile() {
    return (this.mode & S_IFMT) === S_IFREG;
  }
  isDirectory() {
    return (this.mode & S_IFMT) === S_IFDIR;
  }
  isCharacterDevice() {
    return (this.mode & S_IFMT) === S_IFCHR;
  }
  isBlockDevice() {
    return (this.mode & S_IFMT) === S_IFBLK;
  }
  isFIFO() {
    return (this.mode & S_IFMT) === S_IFIFO;
  }
  isSymbolicLink() {
    return (this.mode & S_IFMT) === S_IFLNK;
  }
  isSocket() {
    return (this.mode & S_IFMT) === S_IFSOCK;
  }
};
function makeStatsProxy(path, buf) {
  return new Proxy(new Stats(), {
    has(target, property) {
      if (typeof property === "symbol")
        return property in target;
      return statsHasField(property);
    },
    get(target, property, receiver) {
      switch (property) {
        case "prototype":
          return void 0;
        case "constructor":
        case "toString":
          return target[property];
        case "hasOwnProperty":
          return statsHasField;
        case "valueOf":
          return receiver;
        case "buffer":
          return buf;
        default: {
          let val;
          if (typeof property === "symbol" || (val = target[property]) !== void 0) {
            return val;
          }
          return statsReadField.call(receiver, property, path);
        }
      }
    },
    set(target, property, value, receiver) {
      return false;
    },
    ownKeys(target) {
      return Array.from(statFields);
    },
    getOwnPropertyDescriptor(target, property) {
      return {
        writable: false,
        configurable: true,
        enumerable: true
      };
    }
  });
}
function statsHasField(name) {
  return statFields.has(name);
}
function statsReadField(name, path) {
  let field = getStatSpec().fields[name];
  if (field === void 0) {
    if (name === "birthtime") {
      return statsReadField.call(this, "ctime", path);
    }
    const msPos = name.lastIndexOf("Ms");
    if (msPos === name.length - 2) {
      return statsReadField.call(this, name.substring(0, msPos), path).getTime();
    }
    return void 0;
  }
  const [offset, type] = field;
  const read2 = typeof type === "string" ? NativePointer.prototype["read" + type] : type;
  const value = read2.call(this.buffer.add(offset), path);
  if (value instanceof Int64 || value instanceof UInt64)
    return value.valueOf();
  return value;
}
function readWindowsFileAttributes(path) {
  const attributes = this.readU32();
  let isLink = false;
  if ((attributes & FILE_ATTRIBUTE_REPARSE_POINT) !== 0) {
    enumerateWindowsDirectoryEntriesMatching(path, (data) => {
      const reserved0 = data.add(36).readU32();
      isLink = reserved0 === IO_REPARSE_TAG_MOUNT_POINT || reserved0 === IO_REPARSE_TAG_SYMLINK;
    });
  }
  const isDir = (attributes & FILE_ATTRIBUTE_DIRECTORY) !== 0;
  let mode;
  if (isLink)
    mode = S_IFLNK;
  else if (isDir)
    mode = S_IFDIR;
  else
    mode = S_IFREG;
  if (isDir)
    mode |= 493;
  else
    mode |= 420;
  return mode;
}
function readWindowsFileTime() {
  const fileTime = BigInt(this.readU64().toString()).valueOf();
  const ticksPerMsec = 10000n;
  const msecToUnixEpoch = 11644473600000n;
  const unixTime = fileTime / ticksPerMsec - msecToUnixEpoch;
  return new Date(parseInt(unixTime.toString()));
}
function readWindowsFileSize() {
  const high = this.readU32();
  const low = this.add(4).readU32();
  return uint64(high).shl(32).or(low);
}
function readTimespec32() {
  const sec = this.readU32();
  const nsec = this.add(4).readU32();
  const msec = nsec / 1e6;
  return new Date(sec * 1e3 + msec);
}
function readTimespec64() {
  const sec = this.readU64().valueOf();
  const nsec = this.add(8).readU64().valueOf();
  const msec = nsec / 1e6;
  return new Date(sec * 1e3 + msec);
}
function returnZero() {
  return 0;
}
function returnOne() {
  return 1;
}
function throwWindowsError(lastError) {
  throw makeWindowsError(lastError);
}
function throwPosixError(errno) {
  throw makePosixError(errno);
}
function makeWindowsError(lastError) {
  const maxLength = 256;
  const FORMAT_MESSAGE_FROM_SYSTEM = 4096;
  const FORMAT_MESSAGE_IGNORE_INSERTS = 512;
  const buf = Memory.alloc(maxLength * 2);
  getWindowsApi().FormatMessageW(FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS, NULL, lastError, 0, buf, maxLength, NULL);
  return new Error(buf.readUtf16String());
}
function makePosixError(errno) {
  const message = getPosixApi().strerror(errno).readUtf8String();
  return new Error(message);
}
function callbackify(original) {
  return function(...args) {
    const numArgsMinusOne = args.length - 1;
    const implArgs = args.slice(0, numArgsMinusOne);
    const callback = args[numArgsMinusOne];
    process_default.nextTick(function() {
      try {
        const result = original(...implArgs);
        callback(null, result);
      } catch (e) {
        callback(e);
      }
    });
  };
}
var ssizeType = pointerSize11 === 8 ? "int64" : "int32";
var sizeType = "u" + ssizeType;
var offsetType = platform2 === "darwin" || pointerSize11 === 8 ? "int64" : "int32";
function _getWindowsApi() {
  const SF = SystemFunction;
  const NF = NativeFunction;
  return makeApi([
    ["CreateFileW", SF, "pointer", ["pointer", "uint", "uint", "pointer", "uint", "uint", "pointer"]],
    ["DeleteFileW", SF, "uint", ["pointer"]],
    ["GetFileSizeEx", SF, "uint", ["pointer", "pointer"]],
    ["ReadFile", SF, "uint", ["pointer", "pointer", "uint", "pointer", "pointer"]],
    ["RemoveDirectoryW", SF, "uint", ["pointer"]],
    ["CloseHandle", NF, "uint", ["pointer"]],
    ["FindFirstFileW", SF, "pointer", ["pointer", "pointer"]],
    ["FindNextFileW", NF, "uint", ["pointer", "pointer"]],
    ["FindClose", NF, "uint", ["pointer"]],
    ["GetFileAttributesExW", SF, "uint", ["pointer", "uint", "pointer"]],
    ["GetFinalPathNameByHandleW", SF, "uint", ["pointer", "pointer", "uint", "uint"]],
    ["FormatMessageW", NF, "uint", ["uint", "pointer", "uint", "uint", "pointer", "uint", "pointer"]]
  ]);
}
function _getPosixApi() {
  const SF = SystemFunction;
  const NF = NativeFunction;
  return makeApi([
    ["open", SF, "int", ["pointer", "int", "...", "int"]],
    ["close", NF, "int", ["int"]],
    ["lseek", NF, offsetType, ["int", offsetType, "int"]],
    ["read", SF, ssizeType, ["int", "pointer", sizeType]],
    ["opendir", SF, "pointer", ["pointer"]],
    ["opendir$INODE64", SF, "pointer", ["pointer"]],
    ["closedir", NF, "int", ["pointer"]],
    ["readdir", NF, "pointer", ["pointer"]],
    ["readdir$INODE64", NF, "pointer", ["pointer"]],
    ["readlink", SF, ssizeType, ["pointer", "pointer", sizeType]],
    ["rmdir", SF, "int", ["pointer"]],
    ["unlink", SF, "int", ["pointer"]],
    ["stat", SF, "int", ["pointer", "pointer"]],
    ["stat64", SF, "int", ["pointer", "pointer"]],
    ["__xstat64", SF, "int", ["int", "pointer", "pointer"], invokeXstat],
    ["lstat", SF, "int", ["pointer", "pointer"]],
    ["lstat64", SF, "int", ["pointer", "pointer"]],
    ["__lxstat64", SF, "int", ["int", "pointer", "pointer"], invokeXstat],
    ["strerror", NF, "pointer", ["int"]]
  ]);
}
function invokeXstat(impl2, path, buf) {
  return impl2(STAT_VER_LINUX, path, buf);
}
function makeApi(spec) {
  return spec.reduce((api3, entry) => {
    addApiPlaceholder(api3, entry);
    return api3;
  }, {});
}
var kernel32 = null;
var nativeOpts = isWindows && pointerSize11 === 4 ? { abi: "stdcall" } : {};
function addApiPlaceholder(api3, entry) {
  const [name] = entry;
  Object.defineProperty(api3, name, {
    configurable: true,
    get() {
      const [, Ctor, retType2, argTypes2, wrapper] = entry;
      if (isWindows && kernel32 === null)
        kernel32 = Process.getModuleByName("kernel32.dll");
      let impl2 = null;
      const address = isWindows ? kernel32.findExportByName(name) : Module.findGlobalExportByName(name);
      if (address !== null)
        impl2 = new Ctor(address, retType2, argTypes2, nativeOpts);
      if (wrapper !== void 0)
        impl2 = wrapper.bind(null, impl2);
      Object.defineProperty(api3, name, { value: impl2 });
      return impl2;
    }
  });
}
function createReadStream(path) {
  return new ReadStream(path);
}
function createWriteStream(path) {
  return new WriteStream(path);
}
var readdir = callbackify(readdirSync);
var readFile = callbackify(readFileSync);
var writeFile = callbackify(writeFileSync);
var readlink = callbackify(readlinkSync);
var rmdir = callbackify(rmdirSync);
var unlink = callbackify(unlinkSync);
var stat = callbackify(statSync);
var lstat = callbackify(lstatSync);
function memoize2(compute) {
  let value;
  let computed = false;
  return function(...args) {
    if (!computed) {
      value = compute(...args);
      computed = true;
    }
    return value;
  };
}
var dist_default = {
  constants,
  createReadStream,
  createWriteStream,
  readdir,
  readdirSync,
  list,
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  readlink,
  readlinkSync,
  rmdir,
  rmdirSync,
  unlink,
  unlinkSync,
  stat,
  statSync,
  lstat,
  lstatSync,
  Stats
};

// agent/DebugMenu/DebugMenu/DebugUtils/Dumper/Dumper.ts
var Dumper = class _Dumper {
  static OwnHomeDataMessageOutput;
  static StreamVInt;
  static DumpOHD() {
    _Dumper.OwnHomeDataMessageOutput = `${ObjC.classes.NSHomeDirectory().toString()}/Documents/dump_vints.txt`;
    dist_default.writeFileSync(_Dumper.OwnHomeDataMessageOutput, "", "utf8");
    let sigmaboy = Interceptor.attach(Environment_default.LaserBase.add(3760240), {
      onEnter: function(args) {
        _Dumper.StreamVInt = Interceptor.attach(Environment_default.LaserBase.add(10413868), {
          onLeave: function(retval) {
            let VInt = "ByteStream.WriteVInt(" + retval.toInt32() + ")\n";
            dist_default.appendFileSync(_Dumper.OwnHomeDataMessageOutput, VInt, "utf8");
          }
        });
      },
      onLeave(retval) {
        _Dumper.StreamVInt.detach();
      }
    });
  }
  static DumpBattles() {
    console.log("ruck ypou" + Frida.version);
  }
};
var Dumper_default = Dumper;

// agent/DebugMenu/DebugMenu/DebugMenuBase.ts
var DebugMenuBase = class _DebugMenuBase {
  static TabScrollArea;
  static ScrollArea;
  static Buttons = [];
  static ButtonsX = 0;
  static ButtonsY = 20;
  static MiniCategorys = [];
  static MiniCategorysX = 0;
  static MiniCategorysY = 20;
  static Categorys = [];
  static CategorysX = 0;
  static CategorysY = 20;
  static CategoryButtons = [];
  static CategoryButtonsX = 0;
  static CategoryButtonsY = 0;
  static NewDebugMenuBase(Instance, SCFile, SCImport) {
    Functions_default.Sprite.Sprite(Instance, 1);
    Functions_default.GUIContainer.GUIContainer(Instance);
    let DebugMenuClip = Functions_default.ResourceManager.GetMovieClip(SCFile, SCImport);
    Functions_default.GUIContainer.SetMovieClip(Instance, DebugMenuClip);
    let ColorGradientByName = Functions_default.LogicDataTables.GetColorGradientByName(StringHelper_default.scptr("Demons"), 1);
    let title2 = Functions_default.MovieClip.GetTextFieldByName(DebugMenuClip, StringHelper_default.ptr("title"));
    Functions_default.DecoratedTextField.SetupDecoratedText(title2, StringHelper_default.scptr("Debug Menu"), ColorGradientByName);
    let ColorGradientByName2 = Functions_default.LogicDataTables.GetColorGradientByName(StringHelper_default.scptr("Name8"), 1);
    let version2 = Functions_default.MovieClip.GetTextFieldByName(DebugMenuClip, StringHelper_default.ptr("version"));
    Functions_default.DecoratedTextField.SetupDecoratedText(version2, StringHelper_default.scptr("v63.265"), ColorGradientByName2);
    let ColorGradientByName3 = Functions_default.LogicDataTables.GetColorGradientByName(StringHelper_default.scptr("Name4"), 1);
    let search_help = Functions_default.MovieClip.GetTextFieldByName(DebugMenuClip, StringHelper_default.ptr("search_help"));
    Functions_default.DecoratedTextField.SetupDecoratedText(search_help, StringHelper_default.scptr("@soufgamev2"), ColorGradientByName3);
    let v15 = Functions_default.Stage.sm_instance.readPointer().add(7376).readInt() - (Functions_default.Stage.sm_instance.readPointer().add(84).readFloat() + Functions_default.Stage.sm_instance.readPointer().add(88).readFloat()) / (Functions_default.Stage.sm_instance.readPointer().add(7232).readFloat() != 0 ? Functions_default.Stage.sm_instance.readPointer().add(7232).readFloat() : 0.1);
    Functions_default.DisplayObject.SetXY(Instance, v15, 0);
    let v17 = Functions_default.GUIContainer.CreateScrollArea(Instance, StringHelper_default.ptr("tab_area"), 1);
    _DebugMenuBase.TabScrollArea = v17;
    v17.add(664).writeU8(1);
    Functions_default.ScrollArea.EnablePinching(v17, 0);
    Functions_default.ScrollArea.EnableHorizontalDrag(v17, 1);
    Functions_default.ScrollArea.EnableVerticalDrag(v17, 0);
    Functions_default.ScrollArea.SetAlignment(v17, 2);
    Functions_default.DisplayObject.SetPixelSnappedXY(v17, 730, 73);
    let v18 = Functions_default.GUIContainer.CreateScrollArea(Instance, StringHelper_default.ptr("item_area"), 1);
    _DebugMenuBase.ScrollArea = v18;
    v18.add(664).writeU8(1);
    Functions_default.ScrollArea.EnablePinching(v18, 0);
    Functions_default.ScrollArea.EnableHorizontalDrag(v18, 0);
    Functions_default.ScrollArea.SetAlignment(v18, 4);
    Functions_default.DisplayObject.SetPixelSnappedXY(v18, 730, 113);
    _DebugMenuBase.CreateMiniCategory("", _DebugMenuBase.CloseAllCategories);
    _DebugMenuBase.CreateMiniCategory("Battles", () => _DebugMenuBase.ToggleDebugMenuCategory("Battles"));
    _DebugMenuBase.CreateMiniCategory("Dumper", () => _DebugMenuBase.ToggleDebugMenuCategory("Dumper"));
    _DebugMenuBase.CreateDebugMenuItem("Reload Game", "Name11", ReloadGame_default.Execute, null);
    _DebugMenuBase.CreateDebugMenuItem("Join Telegram", "Name11", ReloadGame_default.Execute, null);
    let BattlesInstance = _DebugMenuBase.CreateDebugMenuCategory("Battles", () => _DebugMenuBase.ToggleDebugMenuCategory("Battles"));
    _DebugMenuBase.CreateDebugMenuItem("Infinite Ulti", "Name4", Popups_default.ShowFamePopup, "Battles", BattlesInstance);
    let DumperInstance = _DebugMenuBase.CreateDebugMenuCategory("Dumper", () => _DebugMenuBase.ToggleDebugMenuCategory("Dumper"));
    _DebugMenuBase.CreateDebugMenuItem("Dump OHD", "Name4", Dumper_default.DumpOHD, "Dumper", DumperInstance);
    _DebugMenuBase.CreateDebugMenuItem("Dump Battle Struct", "Name4", Dumper_default.DumpBattles, "Dumper", DumperInstance);
    _DebugMenuBase.updateLayout();
  }
  static update(ScrollArea, FramePer) {
    Functions_default.ScrollArea.Update(ScrollArea, FramePer);
  }
  static updateLayout() {
    let currentY = 20;
    const allButtons = _DebugMenuBase.Buttons.concat(_DebugMenuBase.Categorys);
    allButtons.sort((a, b) => a.creationOrder - b.creationOrder);
    for (const button of allButtons) {
      Functions_default.DisplayObject.SetPixelSnappedXY(button, 145, currentY + 10);
      button.Y = currentY + 10;
      currentY += 55;
      if (button.isExpanded) {
        const categoryButtons = _DebugMenuBase.CategoryButtons.filter((btn) => btn.categoryName === button.Text);
        for (const subButton of categoryButtons) {
          subButton.add(8).writeU8(1);
          Functions_default.DisplayObject.SetPixelSnappedXY(subButton, 145, currentY + 10);
          currentY += 55;
        }
      } else {
        const categoryButtons = _DebugMenuBase.CategoryButtons.filter((btn) => btn.categoryName === button.Text);
        for (const subButton of categoryButtons) {
          subButton.add(8).writeU8(0);
        }
      }
    }
  }
  static CreateMiniCategory(Text, Callback) {
    let ButtonInstance = Functions_default.Imports.Malloc(1e3);
    let GameButton = Functions_default.GameButton.GameButton(ButtonInstance);
    let MovieClip = Functions_default.ResourceManager.GetMovieClip(StringHelper_default.ptr("sc/debug.sc"), StringHelper_default.ptr("debug_menu_category_mini"));
    new NativeFunction(ButtonInstance.readPointer().add(352).readPointer(), "void", ["pointer", "pointer", "bool"])(ButtonInstance, MovieClip, 1);
    let TextField = Functions_default.MovieClip.GetTextFieldByName(MovieClip, StringHelper_default.ptr("Text"));
    Functions_default.MovieClipHelper.SetTextAndScaleIfNecessary(TextField, StringHelper_default.scptr(Text), 1, 0);
    Functions_default.MovieClip.SetText(MovieClip, StringHelper_default.ptr("Text"), StringHelper_default.scptr(Text));
    Functions_default.DisplayObject.SetPixelSnappedXY(ButtonInstance, 20 + _DebugMenuBase.MiniCategorysX, 20);
    _DebugMenuBase.MiniCategorysX += 45;
    Functions_default.ScrollArea.AddContent(_DebugMenuBase.TabScrollArea, ButtonInstance);
    Interceptor.attach(Addresses_default.CustomButton_buttonPressed, {
      onEnter(args) {
        if (ButtonInstance.toInt32() === args[0].toInt32()) {
          Callback();
        }
      }
    });
    return ButtonInstance;
  }
  static CreateDebugMenuItem(Text, ColorGradient, Callback, CategoryName, CategoryButton = null) {
    let ButtonInstance = Functions_default.Imports.Malloc(1e3);
    let GameButton = Functions_default.GameButton.GameButton(ButtonInstance);
    let MovieClip = Functions_default.ResourceManager.GetMovieClip(StringHelper_default.ptr("sc/debug.sc"), StringHelper_default.ptr("debug_menu_item"));
    new NativeFunction(ButtonInstance.readPointer().add(352).readPointer(), "void", ["pointer", "pointer", "bool"])(ButtonInstance, MovieClip, 1);
    let TextField = Functions_default.MovieClip.GetTextFieldByName(MovieClip, StringHelper_default.ptr("Text"));
    let ColorGradientByName2 = Functions_default.LogicDataTables.GetColorGradientByName(StringHelper_default.scptr(ColorGradient), 1);
    Functions_default.MovieClipHelper.SetTextAndScaleIfNecessary(TextField, StringHelper_default.scptr(Text), 1, 0);
    Functions_default.DecoratedTextField.SetupDecoratedText(TextField, StringHelper_default.scptr(Text), ColorGradientByName2);
    Functions_default.MovieClip.SetText(MovieClip, StringHelper_default.ptr("Text"), StringHelper_default.scptr(Text));
    Functions_default.MovieClipHelper.SetTextFieldVerticallyCentered(TextField);
    Functions_default.ScrollArea.AddContent(_DebugMenuBase.ScrollArea, ButtonInstance);
    Interceptor.attach(Addresses_default.CustomButton_buttonPressed, {
      onEnter(args) {
        if (ButtonInstance.toInt32() === args[0].toInt32()) {
          Callback();
        }
      }
    });
    if (CategoryName == null) {
      ButtonInstance.creationOrder = _DebugMenuBase.Buttons.length;
      _DebugMenuBase.Buttons.push(ButtonInstance);
    } else {
      ButtonInstance.categoryName = CategoryName;
      ButtonInstance.categoryButton = CategoryButton;
      _DebugMenuBase.CategoryButtons.push(ButtonInstance);
      ButtonInstance.add(8).writeU8(0);
    }
    return ButtonInstance;
  }
  static CreateDebugMenuCategory(Text, Callback) {
    let ButtonInstance = Functions_default.Imports.Malloc(1e3);
    let GameButton = Functions_default.GameButton.GameButton(ButtonInstance);
    let MovieClip = Functions_default.ResourceManager.GetMovieClip(StringHelper_default.ptr("sc/debug.sc"), StringHelper_default.ptr("debug_menu_category"));
    new NativeFunction(ButtonInstance.readPointer().add(352).readPointer(), "void", ["pointer", "pointer", "bool"])(ButtonInstance, MovieClip, 1);
    let TextField = Functions_default.MovieClip.GetTextFieldByName(MovieClip, StringHelper_default.ptr("Text"));
    let ColorGradientByName2 = Functions_default.LogicDataTables.GetColorGradientByName(StringHelper_default.scptr("Name11"), 1);
    Functions_default.DecoratedTextField.SetupDecoratedText(TextField, StringHelper_default.scptr(Text), ColorGradientByName2);
    Functions_default.MovieClip.SetText(MovieClip, StringHelper_default.ptr("Text"), StringHelper_default.scptr("+ " + Text));
    Functions_default.MovieClipHelper.SetTextFieldVerticallyCentered(TextField);
    ButtonInstance.Text = Text;
    ButtonInstance.MovieClip = MovieClip;
    ButtonInstance.isExpanded = false;
    ButtonInstance.creationOrder = _DebugMenuBase.Buttons.length + _DebugMenuBase.Categorys.length;
    _DebugMenuBase.Categorys.push(ButtonInstance);
    Functions_default.ScrollArea.AddContent(_DebugMenuBase.ScrollArea, ButtonInstance);
    Interceptor.attach(Addresses_default.CustomButton_buttonPressed, {
      onEnter(args) {
        if (ButtonInstance.toInt32() === args[0].toInt32()) {
          Callback();
        }
      }
    });
    return ButtonInstance;
  }
  static CloseAllCategories() {
    _DebugMenuBase.Categorys.forEach((category) => {
      if (category.isExpanded) {
        category.isExpanded = false;
        const movieClip = category.MovieClip;
        Functions_default.MovieClip.SetText(movieClip, StringHelper_default.ptr("Text"), StringHelper_default.scptr("+ " + category.Text));
      }
    });
    _DebugMenuBase.updateLayout();
  }
  static ToggleDebugMenuCategory(CategoryName) {
    const categoryButton = _DebugMenuBase.Categorys.find((btn) => btn.Text === CategoryName);
    if (!categoryButton)
      return;
    categoryButton.isExpanded = !categoryButton.isExpanded;
    const movieClip = categoryButton.MovieClip;
    const prefix = categoryButton.isExpanded ? "- " : "+ ";
    Functions_default.MovieClip.SetText(movieClip, StringHelper_default.ptr("Text"), StringHelper_default.scptr(prefix + CategoryName));
    _DebugMenuBase.updateLayout();
  }
};
var DebugMenuBase_default = DebugMenuBase;

// agent/DebugMenu/DebugMenu/DebugMenu.ts
var DebugMenu = class _DebugMenu {
  static DebugMenuInstance;
  static NewDebugMenu() {
    _DebugMenu.DebugMenuInstance = Functions_default.Imports.Malloc(5200);
    let SCFile = StringHelper_default.ptr("sc/debug.sc");
    let SCImport = StringHelper_default.ptr("debug_menu");
    DebugMenuBase_default.NewDebugMenuBase(_DebugMenu.DebugMenuInstance, SCFile, SCImport);
    Functions_default.Stage.AddChild(Functions_default.Stage.sm_instance.readPointer(), _DebugMenu.DebugMenuInstance);
    Functions_default.Stage.AddChild(Functions_default.Stage.sm_instance.readPointer(), DebugMenuBase_default.TabScrollArea);
    Functions_default.Stage.AddChild(Functions_default.Stage.sm_instance.readPointer(), DebugMenuBase_default.ScrollArea);
    Interceptor.attach(Environment_default.LaserBase.add(671924), {
      onLeave() {
        DebugMenuBase_default.update(DebugMenuBase_default.TabScrollArea, 20);
        DebugMenuBase_default.update(DebugMenuBase_default.ScrollArea, 20);
      }
    });
  }
};
var DebugMenu_default = DebugMenu;

// agent/Utils/Game/ShowFloaterText.ts
var ShowFloaterText = class _ShowFloaterText {
  static ShowFloaterTextAtDefaultPos(Text, Color, Speed) {
    Functions_default.GUI.ShowFloaterTextAtDefaultPos(Addresses_default.GUIInstance.readPointer(), StringHelper_default.scptr(Text), Color, Speed);
  }
  static Execute(Text) {
    _ShowFloaterText.ShowFloaterTextAtDefaultPos(Text, -1, 0);
  }
};
var ShowFloaterText_default = ShowFloaterText;

// agent/DebugMenu/DebugMenu/DebugButton.ts
var DebugButton = class _DebugButton {
  static IsDebugMenuOpenned = false;
  static isDebugMenuLoaded = false;
  static DebugButtonInstance;
  static DebugButtonMovieClip;
  static LoadDebugButton() {
    _DebugButton.DebugButtonInstance = Functions_default.Imports.Malloc(5200);
    Functions_default.GameButton.GameButton(_DebugButton.DebugButtonInstance);
    _DebugButton.DebugButtonMovieClip = Functions_default.ResourceManager.GetMovieClip(StringHelper_default.ptr("sc/debug.sc"), StringHelper_default.ptr("debug_button"));
    new NativeFunction(_DebugButton.DebugButtonInstance.readPointer().add(352).readPointer(), "void", ["pointer", "pointer", "bool"])(_DebugButton.DebugButtonInstance, _DebugButton.DebugButtonMovieClip, 1);
    Functions_default.DisplayObject.SetXY(_DebugButton.DebugButtonInstance, 5, 710);
    Functions_default.MovieClip.SetText(_DebugButton.DebugButtonMovieClip, StringHelper_default.ptr("Txt"), StringHelper_default.scptr("D"));
    Functions_default.Stage.AddChild(Functions_default.Stage.sm_instance.readPointer(), _DebugButton.DebugButtonInstance);
    Debugger_default.Info("[DebugButton::LoadDebugButton] Loaded debug button!");
    _DebugButton.isDebugMenuLoaded = true;
    _DebugButton.IsDebugMenuOpenned = true;
    DebugMenu_default.NewDebugMenu();
    Interceptor.attach(Addresses_default.CustomButton_buttonPressed, {
      onEnter(args) {
        _DebugButton.ButtonClicked(args);
      }
    });
  }
  static ButtonClicked(args) {
    if (_DebugButton.DebugButtonInstance.toInt32() === args[0].toInt32()) {
      Debugger_default.Debug("[DebugButton::ButtonClicked] Button Clicked!");
      ShowFloaterText_default.Execute("[DebugButton::ButtonClicked] Button Clicked!");
      if (_DebugButton.IsDebugMenuOpenned === false) {
        if (_DebugButton.isDebugMenuLoaded == false) {
          DebugMenu_default.NewDebugMenu();
        }
        DebugMenu_default.DebugMenuInstance.add(8).writeU8(1);
        DebugMenuBase_default.ScrollArea.add(8).writeU8(1);
        DebugMenuBase_default.TabScrollArea.add(8).writeU8(1);
        Debugger_default.Info("[DebugMenu::LoadDebugMenu] Debug Menu Loaded!");
        _DebugButton.isDebugMenuLoaded = true;
        _DebugButton.IsDebugMenuOpenned = true;
      } else {
        DebugMenu_default.DebugMenuInstance.add(8).writeU8(0);
        DebugMenuBase_default.ScrollArea.add(8).writeU8(0);
        DebugMenuBase_default.TabScrollArea.add(8).writeU8(0);
        _DebugButton.IsDebugMenuOpenned = false;
        Debugger_default.Info("[DebugMenu::LoadDebugMenu] Debug Menu Closed!");
      }
    }
  }
};
var DebugButton_default = DebugButton;

// agent/Utils/Game/AddFile.ts
var ResourceListener = class {
  static AddFile(SCFile) {
    const SCLoader = Interceptor.attach(Addresses_default.AddFile, {
      onEnter(args) {
        Debugger_default.Info("[Loader::LoadDebugSC] Loading debug.sc...");
        Functions_default.ResourceListenner.AddFile(args[0], StringHelper_default.scptr(SCFile), -1, -1, -1, -1, 0);
        Debugger_default.Info("[Loader::LoadDebugSC] Loaded debug.sc!");
        setTimeout(() => {
          DebugButton_default.LoadDebugButton();
        }, 3e3);
        SCLoader.detach();
      }
    });
  }
};
var AddFile_default = ResourceListener;

// agent/index.ts
var ShadowBrawlOffline = class {
  static Init() {
    Debugger_default.Debug("[+][ShadowBrawlOffline::Init] Initialising Environement!");
    Environment_default.Init();
    EnvironmentManager_default.InitEnvironment();
    Debugger_default.Debug("[+][ShadowBrawlOffline::Init] Initialised Environement!");
    Debugger_default.Debug("[+][ShadowBrawlOffline::Init] Installing Hooks!");
    Hooks_default.InstallHooks();
    Debugger_default.Debug("[+][ShadowBrawlOffline::Init] Installed Hooks!");
    OfflineBattles_default.Init();
    AddFile_default.AddFile("sc/debug.sc");
  }
};
ShadowBrawlOffline.Init();
