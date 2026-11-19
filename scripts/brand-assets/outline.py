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

def cap_height(font_path):
    tt, _ = _load(font_path)
    return tt['OS/2'].sCapHeight / tt['head'].unitsPerEm
