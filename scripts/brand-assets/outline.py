"""Outline text with Archivo (variable) into SVG path data.

shape_and_outline(text, wdth, wght, size, tracking_em) -> (d, bbox, advance)
Coordinates: y grows downward, baseline at y=0, x starts at 0 (pen origin).
"""
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

_cache = {}

def _load(path):
    if path not in _cache:
        tt = TTFont(path)
        blob = hb.Blob.from_file_path(path)
        face = hb.Face(blob)
        _cache[path] = (tt, face)
    return _cache[path]

def shape_and_outline(text, wdth, wght, size, tracking_em=0.0, font_path=None, features=None):
    tt, face = _load(font_path)
    upem = tt['head'].unitsPerEm
    font = hb.Font(face)
    font.set_variations({'wght': wght, 'wdth': wdth})
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, features or {'kern': True, 'liga': True})
    gs = tt.getGlyphSet(location={'wght': wght, 'wdth': wdth})
    order = tt.getGlyphOrder()
    scale = size / upem
    track = tracking_em * upem
    pen = SVGPathPen(gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    bpen = BoundsPen(gs)
    x = 0.0
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        name = order[info.codepoint]
        # flip y, scale, translate to pen position
        t = (scale, 0, 0, -scale, (x + pos.x_offset) * scale, -pos.y_offset * scale)
        gs[name].draw(TransformPen(pen, t))
        gs[name].draw(TransformPen(bpen, t))
        x += pos.x_advance + (track if i < n - 1 else 0)
    return pen.getCommands(), bpen.bounds, x * scale

def outline_words(text, wdth, wght, size, tracking_em, font_path, word_gap_em):
    """Outline a multi-word line with an exact ink-to-ink gap between words.

    The gap is (tracking_em + word_gap_em) * size plus the font's space advance,
    measured from the last glyph's ink to the next word's first ink, so the
    word space can be tuned independently of the letter tracking.
    Returns (d, bbox) with the first word's ink starting at x=0, baseline at y=0.
    """
    tt, _ = _load(font_path)
    gs = tt.getGlyphSet(location={'wght': wght, 'wdth': wdth})
    _, _, space_adv = shape_and_outline(' ', wdth, wght, size, 0.0, font_path)
    pen = SVGPathPen(gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    x_ink = 0.0
    x0 = y0 = float('inf'); x1 = y1 = float('-inf')
    for i, word in enumerate(text.split(' ')):
        d, (bx0, by0, bx1, by1), _ = shape_and_outline(word, wdth, wght, size, tracking_em, font_path)
        if i:
            x_ink += (tracking_em + word_gap_em) * size + space_adv
        dx = x_ink - bx0                       # place this word's ink at x_ink
        _redraw(word, wdth, wght, size, tracking_em, font_path, pen, dx)
        x0, y0 = min(x0, bx0 + dx), min(y0, by0)
        x1, y1 = max(x1, bx1 + dx), max(y1, by1)
        x_ink = bx1 + dx                       # ink right edge of this word
    return pen.getCommands(), (x0, y0, x1, y1)


def _redraw(text, wdth, wght, size, tracking_em, font_path, pen, dx):
    tt, face = _load(font_path)
    upem = tt['head'].unitsPerEm
    font = hb.Font(face)
    font.set_variations({'wght': wght, 'wdth': wdth})
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {'kern': True, 'liga': True})
    gs = tt.getGlyphSet(location={'wght': wght, 'wdth': wdth})
    order = tt.getGlyphOrder()
    scale = size / upem
    x = 0.0
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        t = (scale, 0, 0, -scale, dx + (x + pos.x_offset) * scale, -pos.y_offset * scale)
        gs[order[info.codepoint]].draw(TransformPen(pen, t))
        x += pos.x_advance + (tracking_em * upem if i < n - 1 else 0)


def cap_height(font_path):
    tt, _ = _load(font_path)
    return tt['OS/2'].sCapHeight / tt['head'].unitsPerEm
