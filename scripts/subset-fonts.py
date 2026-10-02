"""Rebuild the SF Pro Display web fonts from the vendor .otf files.

The .otf originals carry Cyrillic, Greek, Vietnamese and a few thousand other
glyphs this site never renders — about 530 KB of high-priority font bytes on
first paint, which is a slow way to show an English CV. Subsetting to the
ranges below and compressing as woff2 brings the four weights to roughly
220 KB without changing a single visible letter. Persian is not in these
ranges on purpose: it comes from IRANSansX.

    pip install fonttools brotli
    python scripts/subset-fonts.py
"""

from pathlib import Path

from fontTools.subset import main as subset

FONTS = Path(__file__).resolve().parent.parent / (
    "src/assets/fonts/sanFranciscoPro/fonts"
)
WEIGHTS = ("Regular", "Medium", "Semibold", "Bold")
RANGES = ",".join(
    [
        "U+0000-00FF",  # basic latin + latin-1
        "U+0100-024F",  # latin extended A/B
        "U+0259",
        "U+1E00-1EFF",  # latin extended additional
        "U+2000-206F",  # general punctuation
        "U+2070-209F",  # super/subscripts
        "U+20A0-20BF",  # currency
        "U+2100-214F",  # letterlike symbols
        "U+2190-21FF",  # arrows
        "U+2212",  # minus
        "U+25A0-25FF",  # geometric shapes
        "U+FB00-FB04",  # fi/fl ligatures
        "U+FEFF",
        "U+FFFD",
    ]
)


def main() -> None:
    for weight in WEIGHTS:
        source = FONTS / f"SF-Pro-Display-{weight}.otf"
        target = FONTS / f"SF-Pro-Display-{weight}.woff2"
        subset(
            [
                str(source),
                f"--unicodes={RANGES}",
                "--layout-features=*",
                "--flavor=woff2",
                f"--output-file={target}",
            ]
        )
        print(f"{target.name}: {target.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
