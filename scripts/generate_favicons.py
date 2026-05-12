#!/usr/bin/env python3
"""Build tight favicon.png + multi-PNG favicon.ico from public/logo.png (trim near-white)."""
from __future__ import annotations

import io
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "logo.png"
OUT_PNG = ROOT / "public" / "favicon.png"
OUT_ICO = ROOT / "public" / "favicon.ico"

WHITE = (248, 248, 248, 255)


def read_png_rgba_stdlib(path: Path) -> tuple[int, int, bytes]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not PNG")
    pos = 8
    width = height = bit_depth = color_type = interlace = None
    idat = bytearray()
    while pos < len(data):
        length = struct.unpack(">I", data[pos : pos + 4])[0]
        ctype = data[pos + 4 : pos + 8]
        chunk = data[pos + 8 : pos + 8 + length]
        pos += 8 + length + 4
        if ctype == b"IHDR":
            width, height, bit_depth, color_type, _, _, interlace = struct.unpack(">IIBBBBB", chunk)
        elif ctype == b"IDAT":
            idat.extend(chunk)
        elif ctype == b"IEND":
            break
    if width is None or height is None or bit_depth != 8 or color_type != 6 or interlace != 0:
        raise ValueError("need 8-bit RGBA non-interlaced PNG")
    raw = zlib.decompress(bytes(idat))
    bpp = 4
    stride = width * bpp
    out = bytearray(height * stride)

    def paeth(a: int, b: int, c: int) -> int:
        p = a + b - c
        pa = abs(p - a)
        pb = abs(p - b)
        pc = abs(p - c)
        if pa <= pb and pa <= pc:
            return a
        if pb <= pc:
            return b
        return c

    i = 0
    prev = bytearray(stride)
    for _y in range(height):
        f = raw[i]
        i += 1
        row = bytearray(raw[i : i + stride])
        i += stride
        if f == 0:
            pass
        elif f == 1:
            for x in range(stride):
                left = row[x - bpp] if x >= bpp else 0
                row[x] = (row[x] + left) & 255
        elif f == 2:
            for x in range(stride):
                row[x] = (row[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride):
                left = row[x - bpp] if x >= bpp else 0
                up = prev[x]
                row[x] = (row[x] + ((left + up) // 2)) & 255
        elif f == 4:
            for x in range(stride):
                left = row[x - bpp] if x >= bpp else 0
                up = prev[x]
                ul = prev[x - bpp] if x >= bpp else 0
                row[x] = (row[x] + paeth(left, up, ul)) & 255
        else:
            raise ValueError(f"unsupported filter {f}")
        out[_y * stride : (_y + 1) * stride] = row
        prev = row
    return width, height, bytes(out)


def trim_rgba(w: int, h: int, buf: bytes, thr: int = 14) -> tuple[int, int, bytes]:
    stride = w * 4
    wr, wg, wb, _ = WHITE

    def is_bg(idx: int) -> bool:
        o = idx * 4
        r, g, b, a = buf[o], buf[o + 1], buf[o + 2], buf[o + 3]
        if a < 18:
            return True
        return r >= wr - thr and g >= wg - thr and b >= wb - thr

    min_x, min_y = w, h
    max_x, max_y = -1, -1
    for y in range(h):
        for x in range(w):
            idx = y * w + x
            if not is_bg(idx):
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if max_x < 0:
        raise SystemExit("no non-background pixels found")
    cw = max_x - min_x + 1
    ch = max_y - min_y + 1
    out = bytearray(cw * ch * 4)
    for y in range(ch):
        src_row = (y + min_y) * stride + min_x * 4
        out[y * cw * 4 : (y + 1) * cw * 4] = buf[src_row : src_row + cw * 4]
    return cw, ch, bytes(out)


def scale_rgba(buf: bytes, sw: int, sh: int, dw: int, dh: int) -> bytes:
    out = bytearray(dw * dh * 4)
    for y in range(dh):
        sy = int((y + 0.5) * sh / dh - 0.5)
        sy = max(0, min(sh - 1, sy))
        for x in range(dw):
            sx = int((x + 0.5) * sw / dw - 0.5)
            sx = max(0, min(sw - 1, sx))
            si = (sy * sw + sx) * 4
            di = (y * dw + x) * 4
            out[di : di + 4] = buf[si : si + 4]
    return bytes(out)


def write_png_stream(w: int, h: int, rgba: bytes) -> bytes:
    def chunk(t: bytes, b: bytes) -> bytes:
        return struct.pack(">I", len(b)) + t + b + struct.pack(">I", zlib.crc32(t + b) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    stride = w * 4
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        raw.extend(rgba[y * stride : (y + 1) * stride])
    compressed = zlib.compress(bytes(raw), 9)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")


def write_png(path: Path, w: int, h: int, rgba: bytes) -> None:
    path.write_bytes(write_png_stream(w, h, rgba))


def build_ico(png_blobs: list[bytes]) -> bytes:
    header = struct.pack("<HHH", 0, 1, len(png_blobs))
    entries = bytearray()
    offset = 6 + len(png_blobs) * 16
    payload = bytearray()
    for png in png_blobs:
        w = int.from_bytes(png[16:20], "big")
        h = int.from_bytes(png[20:24], "big")
        bw = w if w < 256 else 0
        bh = h if h < 256 else 0
        entries.extend(struct.pack("<BBBBHHII", bw, bh, 0, 0, 1, 32, len(png), offset))
        offset += len(png)
        payload.extend(png)
    return header + entries + payload


def load_trimmed_rgba() -> tuple[int, int, bytes]:
    try:
        from PIL import Image  # type: ignore

        im = Image.open(SRC).convert("RGBA")
        bbox = im.getbbox()
        if bbox:
            im = im.crop(bbox)
        return im.size[0], im.size[1], im.tobytes()
    except Exception:
        w, h, buf = read_png_rgba_stdlib(SRC)
        return trim_rgba(w, h, buf)


def main() -> None:
    w, h, buf = load_trimmed_rgba()
    side = max(w, h)
    stride = w * 4
    square = bytearray(side * side * 4)
    ox = (side - w) // 2
    oy = (side - h) // 2
    for y in range(h):
        dst = (oy + y) * side * 4 + ox * 4
        square[dst : dst + w * 4] = buf[y * stride : y * stride + w * 4]

    sq = bytes(square)
    master = 256
    rgba256 = scale_rgba(sq, side, side, master, master)
    write_png(OUT_PNG, master, master, rgba256)

    ico_pngs: list[bytes] = []
    for s in (16, 32, 48):
        r = scale_rgba(sq, side, side, s, s)
        ico_pngs.append(write_png_stream(s, s, r))
    OUT_ICO.write_bytes(build_ico(ico_pngs))

    print("OK:", OUT_PNG.stat().st_size, OUT_ICO.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
