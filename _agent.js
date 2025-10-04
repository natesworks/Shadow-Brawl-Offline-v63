📦
502441 /agent/index.js
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
  let e, m;
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
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  while (nBits > 0) {
    m = m * 256 + buffer[offset + i];
    i += d;
    nBits -= 8;
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
  let e, m, c;
  let eLen = nBytes * 8 - mLen - 1;
  const eMax = (1 << eLen) - 1;
  const eBias = eMax >> 1;
  const rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  let i = isLE ? 0 : nBytes - 1;
  const d = isLE ? 1 : -1;
  const s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
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
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  while (mLen >= 8) {
    buffer[offset + i] = m & 255;
    i += d;
    m /= 256;
    mLen -= 8;
  }
  e = e << mLen | m;
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
function swap(b, n, m) {
  const i = b[n];
  b[n] = b[m];
  b[m] = i;
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
      const code2 = val.charCodeAt(0);
      if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
        val = code2;
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
    return `${color}[${level}] ${messages2.map((m) => typeof m === "string" ? m : JSON.stringify(m, null, 2)).join(" ")}${reset}`;
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
  //LogicGameModeUtil.GetPlayerCount();
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
    Interceptor.attach(Environment_default.LaserBase.add(3696528), {
      onEnter: function(args) {
        let StringPtr = StringHelper_default.ReadSCPtr(args[1]);
        if (StringPtr == "cleared_txt") {
          args[1].writePointer(StringHelper_default.scptr("players_online_debug_txt"));
        }
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
function isPathSeparator(code2) {
  return code2 === CHAR_FORWARD_SLASH || code2 === CHAR_BACKWARD_SLASH;
}
function isPosixPathSeparator(code2) {
  return code2 === CHAR_FORWARD_SLASH;
}
function isWindowsDeviceRoot(code2) {
  return code2 >= CHAR_UPPERCASE_A && code2 <= CHAR_UPPERCASE_Z || code2 >= CHAR_LOWERCASE_A && code2 <= CHAR_LOWERCASE_Z;
}
function normalizeString(path, allowAboveRoot, separator, isPathSeparator2) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code2 = 0;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code2 = path.charCodeAt(i);
    else if (isPathSeparator2(code2))
      break;
    else
      code2 = CHAR_FORWARD_SLASH;
    if (isPathSeparator2(code2)) {
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
    } else if (code2 === CHAR_DOT && dots !== -1) {
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
      const code2 = path.charCodeAt(0);
      if (len === 1) {
        if (isPathSeparator(code2)) {
          rootEnd = 1;
          isAbsolute2 = true;
        }
      } else if (isPathSeparator(code2)) {
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
      } else if (isWindowsDeviceRoot(code2) && path.charCodeAt(1) === CHAR_COLON) {
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
    const code2 = path.charCodeAt(0);
    if (len === 1) {
      return isPosixPathSeparator(code2) ? "\\" : path;
    }
    if (isPathSeparator(code2)) {
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
    } else if (isWindowsDeviceRoot(code2) && path.charCodeAt(1) === CHAR_COLON) {
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
    const code2 = path.charCodeAt(0);
    return isPathSeparator(code2) || // Possible device root
    len > 2 && isWindowsDeviceRoot(code2) && path.charCodeAt(1) === CHAR_COLON && isPathSeparator(path.charCodeAt(2));
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
        const code2 = resolvedPath.charCodeAt(2);
        if (code2 !== CHAR_QUESTION_MARK && code2 !== CHAR_DOT) {
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
    const code2 = path.charCodeAt(0);
    if (len === 1) {
      return isPathSeparator(code2) ? path : ".";
    }
    if (isPathSeparator(code2)) {
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
    } else if (isWindowsDeviceRoot(code2) && path.charCodeAt(1) === CHAR_COLON) {
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
        const code2 = path.charCodeAt(i);
        if (isPathSeparator(code2)) {
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
            if (code2 === ext.charCodeAt(extIdx)) {
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
      const code2 = path.charCodeAt(i);
      if (isPathSeparator(code2)) {
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
      if (code2 === CHAR_DOT) {
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
    let code2 = path.charCodeAt(0);
    if (len === 1) {
      if (isPathSeparator(code2)) {
        ret.root = ret.dir = path;
        return ret;
      }
      ret.base = ret.name = path;
      return ret;
    }
    if (isPathSeparator(code2)) {
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
    } else if (isWindowsDeviceRoot(code2) && path.charCodeAt(1) === CHAR_COLON) {
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
      code2 = path.charCodeAt(i);
      if (isPathSeparator(code2)) {
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
      if (code2 === CHAR_DOT) {
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
        const code2 = path.charCodeAt(i);
        if (code2 === CHAR_FORWARD_SLASH) {
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
            if (code2 === ext.charCodeAt(extIdx)) {
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
      const code2 = path.charCodeAt(i);
      if (code2 === CHAR_FORWARD_SLASH) {
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
      if (code2 === CHAR_DOT) {
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
      const code2 = path.charCodeAt(i);
      if (code2 === CHAR_FORWARD_SLASH) {
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
      if (code2 === CHAR_DOT) {
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
  basename,
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
function throwNotSupported(method) {
  throw new Error(`${method} is not supported in userland`);
}
function uncurryThis(f) {
  return f.call.bind(f);
}

// frida-shim:node_modules/@frida/util/util.js
var types = {
  ...types_exports,
  isRegExp,
  isDate,
  isNativeError: isError
};
var formatRegExp = /%[sdj%]/g;
function format2(f) {
  if (!isString(f)) {
    const objects = [];
    for (let i2 = 0; i2 < arguments.length; i2++) {
      objects.push(inspect2(arguments[i2]));
    }
    return objects.join(" ");
  }
  let i = 1;
  const args = arguments;
  const len = args.length;
  let str = String(f).replace(formatRegExp, function(x) {
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
    const m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
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
function _listeners(target, type, unwrap) {
  const events = target._events;
  if (events === void 0)
    return [];
  const evlistener = events[type];
  if (evlistener === void 0)
    return [];
  if (typeof evlistener === "function")
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
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
  for (const method of Object.keys(writable_default.prototype)) {
    if (!Duplex.prototype[method])
      Duplex.prototype[method] = writable_default.prototype[method];
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
Stream._isUint8Array = types.isUint8Array;
Stream._uint8ArrayToBuffer = Buffer2.from;

// frida-shim:node_modules/@frida/stream/index.js
var stream_default = Stream;

// frida-shim:node_modules/frida-fs/dist/index.js
var getWindowsApi = memoize(_getWindowsApi);
var getPosixApi = memoize(_getPosixApi);
var platform2 = Process.platform;
var pointerSize = Process.pointerSize;
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
      const api = getWindowsApi();
      const result = api.CreateFileW(Memory.allocUtf16String(path), GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_FLAG_OVERLAPPED, NULL);
      const handle = result.value;
      if (handle.equals(INVALID_HANDLE_VALUE)) {
        process_default.nextTick(() => {
          this.destroy(makeWindowsError(result.lastError));
        });
        return;
      }
      this.#input = new Win32InputStream(handle, { autoClose: true });
    } else {
      const api = getPosixApi();
      const result = api.open(Memory.allocUtf8String(path), constants.O_RDONLY, 0);
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
      const api = getWindowsApi();
      const result = api.CreateFileW(Memory.allocUtf16String(path), GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL | FILE_FLAG_OVERLAPPED, NULL);
      const handle = result.value;
      if (handle.equals(INVALID_HANDLE_VALUE)) {
        process_default.nextTick(() => {
          this.destroy(makeWindowsError(result.lastError));
        });
        return;
      }
      this.#output = new Win32OutputStream(handle, { autoClose: true });
    } else {
      const api = getPosixApi();
      const pathStr = Memory.allocUtf8String(path);
      const flags = constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC;
      const mode = constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IROTH;
      const result = api.open(pathStr, flags, mode);
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
    const handle = createRes.value;
    if (handle.equals(INVALID_HANDLE_VALUE))
      throwWindowsError(createRes.lastError);
    try {
      const scratchBuf = Memory.alloc(8);
      const fileSizeBuf = scratchBuf;
      const getRes = GetFileSizeEx(handle, fileSizeBuf);
      if (getRes.value === 0)
        throwWindowsError(getRes.lastError);
      const fileSize = fileSizeBuf.readU64().valueOf();
      const buf = Memory.alloc(fileSize);
      const numBytesReadBuf = scratchBuf;
      const readRes = ReadFile(handle, buf, fileSize, numBytesReadBuf, NULL);
      if (readRes.value === 0)
        throwWindowsError(readRes.lastError);
      const n = numBytesReadBuf.readU32();
      if (n !== fileSize)
        throw new Error("Short read");
      return parseReadFileResult(buf, fileSize, encoding);
    } finally {
      CloseHandle(handle);
    }
  },
  readlinkSync(path) {
    const { CreateFileW, GetFinalPathNameByHandleW, CloseHandle } = getWindowsApi();
    const createRes = CreateFileW(Memory.allocUtf16String(path), 0, FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE, NULL, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, NULL);
    const handle = createRes.value;
    if (handle.equals(INVALID_HANDLE_VALUE))
      throwWindowsError(createRes.lastError);
    try {
      let maxLength = 256;
      while (true) {
        const buf = Memory.alloc(maxLength * 2);
        const { value, lastError } = GetFinalPathNameByHandleW(handle, buf, maxLength, 0);
        if (value === 0)
          throwWindowsError(lastError);
        if (lastError === ERROR_NOT_ENOUGH_MEMORY) {
          maxLength *= 2;
          continue;
        }
        return buf.readUtf16String().substring(4);
      }
    } finally {
      CloseHandle(handle);
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
  const handle = result.value;
  if (handle.equals(INVALID_HANDLE_VALUE))
    throwWindowsError(result.lastError);
  try {
    do {
      callback(data);
    } while (FindNextFileW(handle, data) !== 0);
  } finally {
    FindClose(handle);
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
var direntSpec = isWindows ? direntSpecs.windows : direntSpecs[`${platform2}-${pointerSize * 8}`];
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
    for (const f of extraFieldNames)
      extras[f] = readDirentField(entry, f);
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
    const api = getPosixApi();
    const stat64Impl = api.stat64 ?? api.__xstat64;
    let platformId;
    if (platform2 === "darwin") {
      platformId = `darwin-${pointerSize * 8}`;
    } else {
      platformId = `${platform2}-${Process.arch}`;
      if (pointerSize === 4 && stat64Impl !== void 0) {
        platformId += "-stat64";
      }
    }
    statSpec = statSpecs[platformId];
    if (statSpec === void 0)
      throw new Error("Current OS/arch combo is not yet supported; please open a PR");
    statSpec._stat = stat64Impl ?? api.stat;
    statSpec._lstat = api.lstat64 ?? api.__lxstat64 ?? api.lstat;
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
var ssizeType = pointerSize === 8 ? "int64" : "int32";
var sizeType = "u" + ssizeType;
var offsetType = platform2 === "darwin" || pointerSize === 8 ? "int64" : "int32";
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
  return spec.reduce((api, entry) => {
    addApiPlaceholder(api, entry);
    return api;
  }, {});
}
var kernel32 = null;
var nativeOpts = isWindows && pointerSize === 4 ? { abi: "stdcall" } : {};
function addApiPlaceholder(api, entry) {
  const [name] = entry;
  Object.defineProperty(api, name, {
    configurable: true,
    get() {
      const [, Ctor, retType, argTypes, wrapper] = entry;
      if (isWindows && kernel32 === null)
        kernel32 = Process.getModuleByName("kernel32.dll");
      let impl2 = null;
      const address = isWindows ? kernel32.findExportByName(name) : Module.findGlobalExportByName(name);
      if (address !== null)
        impl2 = new Ctor(address, retType, argTypes, nativeOpts);
      if (wrapper !== void 0)
        impl2 = wrapper.bind(null, impl2);
      Object.defineProperty(api, name, { value: impl2 });
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
function memoize(compute) {
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
    _DebugMenuBase.CreateMiniCategory("", null);
    _DebugMenuBase.CreateMiniCategory("Pops", () => _DebugMenuBase.ToggleDebugMenuCategory("Popups"));
    _DebugMenuBase.CreateMiniCategory("Dump", () => _DebugMenuBase.ToggleDebugMenuCategory("Dumper"));
    _DebugMenuBase.CreateDebugMenuItem("Reload Game", ReloadGame_default.Execute, null);
    let RandomFeatures = _DebugMenuBase.CreateDebugMenuCategory("Battles", () => _DebugMenuBase.ToggleDebugMenuCategory("Random Features"));
    _DebugMenuBase.CreateDebugMenuItem("Infinite Ulti", Popups_default.ShowFamePopup, "Random Features", RandomFeatures);
    let PopupInstance = _DebugMenuBase.CreateDebugMenuCategory("Popups", () => _DebugMenuBase.ToggleDebugMenuCategory("Popups"));
    _DebugMenuBase.CreateDebugMenuItem("Show Fame Popup", Popups_default.ShowFamePopup, "Popups", PopupInstance);
    _DebugMenuBase.CreateDebugMenuItem("Show Latency Test Popup", Popups_default.ShowLatencyTestPopup, "Popups", PopupInstance);
    let DumperInstance = _DebugMenuBase.CreateDebugMenuCategory("Dumper", () => _DebugMenuBase.ToggleDebugMenuCategory("Dumper"));
    _DebugMenuBase.CreateDebugMenuItem("Dump OHD", Dumper_default.DumpOHD, "Dumper", DumperInstance);
    _DebugMenuBase.CreateDebugMenuItem("Dump Battle Struct", Dumper_default.DumpBattles, "Dumper", DumperInstance);
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
  static CreateDebugMenuItem(Text, Callback, CategoryName, CategoryButton = null) {
    let ButtonInstance = Functions_default.Imports.Malloc(1e3);
    let GameButton = Functions_default.GameButton.GameButton(ButtonInstance);
    let MovieClip = Functions_default.ResourceManager.GetMovieClip(StringHelper_default.ptr("sc/debug.sc"), StringHelper_default.ptr("debug_menu_item"));
    new NativeFunction(ButtonInstance.readPointer().add(352).readPointer(), "void", ["pointer", "pointer", "bool"])(ButtonInstance, MovieClip, 1);
    let TextField = Functions_default.MovieClip.GetTextFieldByName(MovieClip, StringHelper_default.ptr("Text"));
    Functions_default.MovieClip.SetText(MovieClip, StringHelper_default.ptr("Text"), StringHelper_default.scptr(Text));
    Functions_default.ScrollArea.AddContent(_DebugMenuBase.ScrollArea, ButtonInstance);
    Functions_default.MovieClipHelper.SetTextFieldVerticallyCentered(TextField);
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
      onEnter() {
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
        }, 120);
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
