#!/usr/bin/env python3
"""Parse approved Batch 1-9 transcript extracts into locale EN/ES dictionaries."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTRACT_DIR = ROOT / "scripts" / "_transcript_extract"
FILES_ORDER = [
    "batch1-2-L2527.md",
    "batch3-L2529.md",
    "batch4-L2531.md",
    "batch5-L2533.md",
    "batch6-L2535.md",
    "batch7-L2537.md",
    "batch8-L2539.md",
    "batch9-L2541.md",
]

KEY_RE = re.compile(
    r"`((?:quiz\.advice\.[a-z0-9._-]+|\.\.\.[a-z0-9._-]+(?:\.(?:title|description|name|why))?))`"
)
FIELD_SUFFIX = {
    "title": "title",
    "description": "description",
    "name": "name",
    "why": "why",
}

# Cumulative approved ES/EN polish (Batch 2 retro + later batch locks)
POLISH_REPLACEMENTS: list[tuple[str, str]] = [
    ("que vuestro hogar realmente consuma", "que tu hogar realmente consuma"),
    ("primero en entrar, primero en salir", "primero en entrar, primero en consumir"),
    ("a vuestros hábitos de cocina", "a tus hábitos de cocina"),
    ("que necesitáis para", "que necesitas para"),
    ("no os deje expuestos", "no te deje expuesto"),
    ("validar vuestra preparación", "validar tu preparación"),
    ("vosotros", "tú"),
    ("vuestro", "tu"),
    ("vuestros", "tus"),
    ("vuestra", "tu"),
    (" offline", " sin conexión"),
    ("Offline", "Sin conexión"),
    ("offline", "sin conexión"),
    ("bivouac", "vivac"),
    ("bivouac", "vivac"),
    ("mess kit", "set de cocina de campaña"),
    ("Mess kit", "Set de cocina de campaña"),
    ("pouch Faraday", "bolsa Faraday"),
    ("pouch faraday", "bolsa Faraday"),
    ("Faraday pouch", "bolsa Faraday"),
    ("pila de continuidad", "sistema de continuidad"),
    ("pila de tratamiento", "conjunto de tratamiento"),
    ("Rearquitectura", "Rediseña la arquitectura de cargas"),
    ("rearquitectura", "rediseña la arquitectura de cargas"),
    ("nivel de practicante", "nivel profesional"),
    ("practicante", "profesional"),
    ("multisource", "multifuente"),
    ("Multisource", "Multifuente"),
    ("playbooks", "manuales operativos"),
    ("Playbooks", "Manuales operativos"),
    ("playbook", "manual operativo"),
    ("SOP", "procedimiento operativo"),
    ("SOPs", "procedimientos operativos"),
    ("triage", "triaje básico"),
    ("Triage", "Triaje básico"),
    ("e aislamiento", "y aislamiento"),
    ("hardware de torre", "herrajes de torre"),
    ("hardware", "herrajes"),
    ("estructura de túnel\"", "estructura de túnel de cultivo\""),
    ("estructura de túnel ", "estructura de túnel de cultivo "),
    ("Caja fuerte de semillas", "Banco de semillas hortícolas heirloom"),
    ("Silbato de tormenta", "Silbato de supervivencia"),
    ("Químicos para inodoro", "Productos químicos para inodoro"),
    ("para nursery", "para habitación infantil"),
    ("Inicio ganadero", "Pack inicial ganadero"),
]

POLISH_ES_ONLY: list[tuple[str, str]] = [
    (
        "Construye una despensa de emergencia con rotación activa",
        "Construye una despensa de emergencia con rotación activa para 30 días",
    ),
    (
        "Refuerza el sistema alimentario contra fallos",
        "Refuerza el sistema alimentario contra modos de fallo",
    ),
]


def polish(text: str, *, es: bool) -> str:
    for old, new in POLISH_REPLACEMENTS:
        text = text.replace(old, new)
    if es:
        for old, new in POLISH_ES_ONLY:
            if old in text and new not in text:
                text = text.replace(old, new)
    return text.strip()


def expand_partial(partial: str, anchor: str | None) -> str | None:
    partial = partial.strip().strip("`")
    if partial.startswith("quiz.advice."):
        return partial
    if not partial.startswith("...") or not anchor:
        return None
    suffix = partial[3:]
    is_action = bool(re.search(r"\.(week|month|year)\.\d+\.(title|description)$", suffix))
    is_product = bool(re.match(r"^[a-z]+\.\d+\.(name|why)$", suffix))
    m = re.match(
        r"(quiz\.advice\.(?:action|product)\.[a-z-]+\.[a-z]+)\.",
        anchor,
    )
    if not m:
        return None
    base = m.group(1)
    if is_action:
        base = re.sub(r"\.product\.", ".action.", base)
    elif is_product:
        base = re.sub(r"\.action\.", ".product.", base)
    return f"{base}.{suffix}"


def field_from_key(key: str) -> str | None:
    for suf in ("title", "description", "name", "why"):
        if key.endswith(f".{suf}"):
            return suf
    return None


def parse_file(path: Path, en: dict[str, str], es: dict[str, str]) -> None:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    anchor: str | None = None
    pending_key: str | None = None
    pending_field: str | None = None
    capture_as: str | None = None  # title | description | name | why
    ctx_quiz: str | None = None
    ctx_band: str | None = None
    ctx_category: str | None = None

    def infer_full_key(partial: str) -> str | None:
        if not partial.startswith("..."):
            return None
        tail = partial[3:]
        if not ctx_quiz or not ctx_band:
            return None
        if re.search(r"\.(week|month|year)\.\d+\.(title|description)$", tail):
            return f"quiz.advice.action.{ctx_quiz}.{ctx_band}.{tail}"
        if re.match(r"^[a-z]+\.\d+\.(name|why)$", tail):
            return f"quiz.advice.product.{ctx_quiz}.{ctx_band}.{tail}"
        return None

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        if "Batch" in line:
            band_m = re.search(
                r"(foundational|intermediate|advanced|refinement)",
                line,
                re.I,
            )
            if band_m:
                ctx_band = band_m.group(1).lower()
            if "self-sufficiency" in line:
                ctx_quiz = "self-sufficiency"
            if "emergency-readiness" in line:
                ctx_quiz = "emergency-readiness"

        cat_m = re.match(r"^#+\s*(?:Category:\s*)?([A-Za-z][A-Za-z ]*)$", line)
        if cat_m:
            name = cat_m.group(1).strip().lower()
            if name not in ("week", "month", "year", "products"):
                ctx_category = name.split()[0] if name else None

        if line.startswith("#") and "Batch" in line:
            i += 1
            continue

        keys = [k for k in KEY_RE.findall(line) if k not in ("...description", "...why")]
        if keys:
            for raw in keys:
                full = expand_partial(raw, anchor) or infer_full_key(raw)
                if full:
                    anchor = full
                    pending_key = full
                    pending_field = field_from_key(full)
                    capture_as = pending_field

        if "...description" in line:
            capture_as = "description"
        elif "...why" in line:
            capture_as = "why"
        elif "EN/ES as Batch 1" in line or "EN/ES as approved" in line:
            if pending_key and capture_as == "description":
                for n in (1, 2, 3):
                    src = f"quiz.advice.action.self-sufficiency.foundational.water.week.{n}.description"
                    if pending_key.endswith(f".week.{n}.title"):
                        if src in en:
                            en[pending_key.replace(".title", ".description")] = en[src]
                        if src in es:
                            es[pending_key.replace(".title", ".description")] = es[src]
            if pending_key and capture_as == "why" and ".water." in pending_key:
                m = re.search(r"\.(\d)\.name$", pending_key.replace(".why", ".name"))
                if m:
                    src_n = m.group(1)
                    src = f"quiz.advice.product.self-sufficiency.foundational.water.{src_n}.why"
                    if src in en:
                        en[pending_key.replace(".name", ".why")] = en[src]
                    if src in es:
                        es[pending_key.replace(".name", ".why")] = es[src]

        def store(lang: str, value: str) -> None:
            nonlocal pending_key, pending_field
            if not pending_key or not pending_field:
                return
            value = polish(value, es=(lang == "es"))
            target = es if lang == "es" else en
            # Later files override earlier (batch 4+ over batch 2 stubs)
            target[pending_key] = value

        def strip_md(s: str) -> str:
            return s.strip().strip("*").strip()

        INLINE_PATTERNS = [
            (r"^-?\s*\*?\*?EN\*?\*?:\s*(.+)$", "en", "title"),
            (r"^-?\s*\*?\*?ES\*?\*?:\s*(.+)$", "es", "title"),
            (r"^-?\s*\*?\*?Desc EN\*?\*?:\s*(.+)$", "en", "description"),
            (r"^-?\s*\*?\*?Desc ES\*?\*?:\s*(.+)$", "es", "description"),
            (r"^-?\s*\*?\*?Why EN\*?\*?:\s*(.+)$", "en", "why"),
            (r"^-?\s*\*?\*?Why ES\*?\*?:\s*(.+)$", "es", "why"),
        ]
        matched_inline = False
        for pat, lang, kind in INLINE_PATTERNS:
            m = re.match(pat, line, re.I)
            if not m:
                continue
            val = polish(strip_md(m.group(1)), es=(lang == "es"))
            field_kind = kind
            if kind == "title" and capture_as in ("description", "why"):
                field_kind = capture_as
            if field_kind == "title" and pending_key and pending_field == "title":
                (es if lang == "es" else en)[pending_key] = val
            elif field_kind == "description" and pending_key:
                key = pending_key.replace(".title", ".description")
                (es if lang == "es" else en)[key] = val
            elif field_kind == "why" and pending_key:
                key = pending_key.replace(".name", ".why")
                (es if lang == "es" else en)[key] = val
            elif field_kind == "title":
                store(lang, val)
            matched_inline = True
            i += 1
            break
        if matched_inline:
            continue

        i += 1


def expected_keys() -> set[str]:
    quiz_types = ["self-sufficiency", "emergency-readiness"]
    bands = ["foundational", "intermediate", "advanced", "refinement"]
    cats = {
        "self-sufficiency": ["food", "water", "energy", "shelter", "skills"],
        "emergency-readiness": ["water", "food", "medical", "power", "communication"],
    }
    horizons = ["week", "month", "year"]
    keys: set[str] = set()
    for qt in quiz_types:
        for band in bands:
            for cat in cats[qt]:
                for h in horizons:
                    for n in (1, 2, 3):
                        keys.add(
                            f"quiz.advice.action.{qt}.{band}.{cat}.{h}.{n}.title"
                        )
                        keys.add(
                            f"quiz.advice.action.{qt}.{band}.{cat}.{h}.{n}.description"
                        )
                for n in (1, 2, 3):
                    keys.add(f"quiz.advice.product.{qt}.{band}.{cat}.{n}.name")
                    keys.add(f"quiz.advice.product.{qt}.{band}.{cat}.{n}.why")
    return keys


def apply_batch1_water_aliases(en: dict[str, str], es: dict[str, str]) -> None:
    """Batch 2 water week items reference Batch 1 copy verbatim."""
    for n in (1, 2, 3):
        for field in ("title", "description"):
            src = f"quiz.advice.action.self-sufficiency.foundational.water.week.{n}.{field}"
            dst = src  # same key when batch2 says 'as Batch 1'
            if src in en and dst not in en:
                en[dst] = en[src]
            if src in es and dst not in es:
                es[dst] = es[src]
    for n in (1, 2, 3):
        for field in ("name", "why"):
            src = f"quiz.advice.product.self-sufficiency.foundational.water.{n}.{field}"
            if src in en:
                en[src] = en.get(src, en[src])
            if src in es:
                es[src] = es.get(src, es[src])


def main() -> None:
    en: dict[str, str] = {}
    es: dict[str, str] = {}
    for name in FILES_ORDER:
        path = EXTRACT_DIR / name
        if not path.exists():
            raise SystemExit(f"Missing extract: {path}")
        parse_file(path, en, es)

    apply_batch1_water_aliases(en, es)

    expected = expected_keys()
    missing_en = sorted(expected - set(en.keys()))
    missing_es = sorted(expected - set(es.keys()))

    out_en = ROOT / "data" / "quiz-advice-en.partial.json"
    out_es = ROOT / "data" / "quiz-advice-es.partial.json"
    out_en.parent.mkdir(parents=True, exist_ok=True)
    out_en.write_text(json.dumps(dict(sorted(en.items())), ensure_ascii=False, indent=2) + "\n")
    out_es.write_text(json.dumps(dict(sorted(es.items())), ensure_ascii=False, indent=2) + "\n")

    print(f"Parsed EN keys: {len(en)}")
    print(f"Parsed ES keys: {len(es)}")
    print(f"Expected content keys: {len(expected)}")
    print(f"Missing EN: {len(missing_en)}")
    print(f"Missing ES: {len(missing_es)}")
    if missing_en[:5]:
        print("  sample missing EN:", missing_en[:5])
    if missing_es[:5]:
        print("  sample missing ES:", missing_es[:5])

    # Merge into locale files
    for locale, partial in (("en", en), ("es", es)):
        loc_path = ROOT / "locales" / f"{locale}.json"
        loc = json.loads(loc_path.read_text(encoding="utf-8"))
        updated = 0
        for k, v in partial.items():
            if k.startswith("quiz.advice.") and k in expected:
                loc[k] = v
                updated += 1
        loc_path.write_text(
            json.dumps(loc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Updated {locale}.json: {updated} quiz.advice keys")

    # Parity check
    en_loc = json.loads((ROOT / "locales/en.json").read_text())
    es_loc = json.loads((ROOT / "locales/es.json").read_text())
    en_advice = {k for k in en_loc if k.startswith("quiz.advice.")}
    es_advice = {k for k in es_loc if k.startswith("quiz.advice.")}
    if en_advice != es_advice:
        print("PARITY MISMATCH", len(en_advice - es_advice), len(es_advice - en_advice))
    else:
        print("Parity OK:", len(en_advice), "quiz.advice keys")

    placeholders = [
        k
        for k, v in en_loc.items()
        if k.startswith("quiz.advice.action.") and "readiness" in v and "action 1" in v
    ]
    print(f"Remaining placeholder-like EN action titles: {len(placeholders)}")


if __name__ == "__main__":
    main()
