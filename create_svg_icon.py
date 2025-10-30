#!/usr/bin/env python3
"""
Creates an SVG icon based on the Base44 RTL design.
Generates a circular icon with gradient background, text, and stripes.
"""

import base64
from pathlib import Path

def _find_source_png() -> Path:
    assets_dir = Path("assets")
    preferred = assets_dir / "icon-source.png"
    if preferred.exists():
        return preferred

    candidates = sorted(assets_dir.glob("*.png"))
    if not candidates:
        raise FileNotFoundError("No PNG files found in assets directory")
    # Prefer the largest PNG as a fallback
    return max(candidates, key=lambda path: path.stat().st_size)

def create_base44_svg():
    """Embed the original PNG as a data URI so the SVG is pixel-perfect."""

    src_path = _find_source_png()
    if not src_path.exists():
        raise FileNotFoundError(f"Source PNG not found: {src_path}")

    png_bytes = src_path.read_bytes()
    b64_png = base64.b64encode(png_bytes).decode("ascii")

    svg_content = (
        "<svg xmlns=\"http://www.w3.org/2000/svg\" "
        "viewBox=\"0 0 1024 1024\" width=\"1024\" height=\"1024\">\n"
        "  <image href=\"data:image/png;base64," + b64_png + "\" "
        "width=\"1024\" height=\"1024\" />\n"
        "</svg>"
    )

    return svg_content

def main():
    print("Creating Base44 RTL SVG icon...")
    
    # Generate SVG content
    svg_content = create_base44_svg()
    
    # Save to assets folder
    output_path = "assets/icon.svg"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    
    print(f"✓ SVG icon created successfully: {output_path}")
    print(f"✓ File size: {len(svg_content)} bytes")
    print("\nThe SVG file has been saved and can be used in the manifest.json")

if __name__ == "__main__":
    main()
