from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image, ImageDraw, ImageEnhance
import qrcode
from io import BytesIO

# -------------------------------
# Reusable helper functions
# -------------------------------

def make_round_image(img_file, size=(100, 100), dpi=300, sharpen=True):
    """
    Make an image circular with high clarity and DPI support.
    Args:
        img_file: file-like object or path
        size: (width, height) in PDF points
        dpi: output resolution (default 300 for print quality)
        sharpen: optionally enhance image sharpness
    Returns:
        ImageReader for ReportLab
    """
    # Convert PDF points → pixels (72 points = 1 inch)
    px_width = int(size[0] * dpi / 72)
    px_height = int(size[1] * dpi / 72)

    img = Image.open(img_file).convert("RGBA")
    img = img.resize((px_width, px_height), Image.Resampling.LANCZOS)

    # Optionally increase sharpness slightly
    if sharpen:
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.3)

    # Create circular mask
    mask = Image.new("L", (px_width, px_height), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, px_width, px_height), fill=255)

    # Apply mask
    rounded = Image.new("RGBA", (px_width, px_height))
    rounded.paste(img, (0, 0), mask=mask)

    # Save as high-DPI PNG for ReportLab
    rounded_bytes = BytesIO()
    rounded.save(rounded_bytes, format="PNG", dpi=(dpi, dpi))
    rounded_bytes.seek(0)

    return ImageReader(rounded_bytes)

def make_soft_round_image(img_file, size=(100, 100), radius=20, dpi=300, sharpen=True):
    """
    Make an image with rounded corners and high clarity.
    Args:
        img_file: file-like object or path
        size: (width, height) in points (PDF units)
        radius: corner radius
        dpi: target print resolution
    """

    px_width = int(size[0] * dpi / 72)
    px_height = int(size[1] * dpi / 72)

    img = Image.open(img_file).convert("RGBA")
    img = img.resize((px_width, px_height), Image.Resampling.LANCZOS)

    if sharpen:
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.3)

    mask = Image.new("L", (px_width, px_height), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, px_width, px_height), radius=int(radius * dpi / 72), fill=255)

    rounded = Image.new("RGBA", (px_width, px_height))
    rounded.paste(img, (0, 0), mask=mask)

    rounded_bytes = BytesIO()
    rounded.save(rounded_bytes, format="PNG", dpi=(dpi, dpi))
    rounded_bytes.seek(0)
    return ImageReader(rounded_bytes)


def generate_qr(data: str, box_size=2):
    """Generate a QR code image reader."""
    qr = qrcode.QRCode(box_size=box_size, border=1)
    qr.add_data(data)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_bytes = BytesIO()
    qr_img.save(qr_bytes)
    qr_bytes.seek(0)
    return ImageReader(qr_bytes)

# -------------------------------
# Main PDF generator (with config inside)
# -------------------------------

def generate_pdf(template_path, data_fields, image_file=None, qr_text=None):
    """
    Generic PDF builder with integrated ID_CARD_LAYOUT for debugging.
    """
    # --- Layout configuration for ID Card ---
    ID_CARD_LAYOUT = {
        "text_fields": [
            {"name": "reg_no", "x": 110, "y": 130, "font": "Helvetica-Bold", "size": 11, "align": "center", "max_width": 120},
            {"name": "name", "x": 50, "y": 110, "font": "Helvetica", "size": 8, "align": "left", "max_width": 200},
            {"name": "in", "x": 50, "y": 100, "font": "Helvetica", "size": 8, "align": "left", "max_width": 200},
            {"name": "mob", "x": 50, "y": 88, "font": "Helvetica", "size": 8, "align": "left", "max_width": 200},
            {"name": "date", "x": 50, "y": 77, "font": "Helvetica", "size": 8, "align": "left", "max_width": 200},
            {"name": "block", "x": 50, "y": 65, "font": "Helvetica", "size": 8, "align": "left", "max_width": 200},
            {"name": "district", "x": 50, "y": 55, "font": "Helvetica", "size": 8, "align": "left", "max_width": 200},
            {"name": "state", "x": 50, "y": 44, "font": "Helvetica", "size": 8, "align": "left", "max_width": 200},
        ],
        "image": {"x": 8, "y": 123, "width": 63, "height": 69, "shape": "soft_round", "radius": 10},
        "qr": {"x": 93, "y": 155, "width": 37, "height": 37, "data": qr_text},
    }

    # --- Read template & get size ---
    template_pdf = PdfReader(template_path)
    first_page = template_pdf.pages[0]
    width = float(first_page.mediabox.width)
    height = float(first_page.mediabox.height)
    # print(f"[DEBUG] Template size: {width}x{height}")

    packet = BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))

    # --- Draw text fields ---
    for item in ID_CARD_LAYOUT.get("text_fields", []):
        field = item["name"]
        if field in data_fields:
            value = str(data_fields[field])
            font = item.get("font", "Helvetica")
            size = item.get("size", 10)
            align = item.get("align", "left")
            max_width = item.get("max_width")
            color = item.get("color", "black")

            # Set color
            if color == "white":
                c.setFillColorRGB(1, 1, 1)
            if color == "black":
                c.setFillColorRGB(0, 0, 0)
            c.setFont(font, size)
            text_width = c.stringWidth(value, font, size)

            # Auto shrink if max_width is given
            if max_width and text_width > max_width:
                size = size * max_width / text_width
                c.setFont(font, size)
                text_width = c.stringWidth(value, font, size)

            x, y = item["x"], item["y"]

            if align == "center":
                c.drawCentredString(x, y, value)
            elif align == "right":
                c.drawRightString(x, y, value)
            else:
                c.drawString(x, y, value)
            # print(f"[DRAW TEXT] {field}='{value}' at ({x},{y})")

    # --- Draw image if provided ---
    if image_file and ID_CARD_LAYOUT.get("image"):
        img_conf = ID_CARD_LAYOUT["image"]
        size = (img_conf["width"], img_conf["height"])
        if img_conf.get("shape") == "round":
            img_reader = make_round_image(image_file, size)
        elif img_conf.get("shape") == "soft_round":
            img_reader = make_soft_round_image(image_file, size, radius=img_conf.get("radius", 20))
        else:
            img_reader = ImageReader(image_file)
        img_reader = (
            img_reader
        )
        c.drawImage(
            img_reader,
            img_conf["x"],
            img_conf["y"],
            width=img_conf["width"],
            height=img_conf["height"],
            mask="auto",
        )
        # print(f"[DRAW IMAGE] at ({img_conf['x']},{img_conf['y']}) size={size}")

    # --- Draw QR code if provided ---
    if ID_CARD_LAYOUT.get("qr"):
        qr_conf = ID_CARD_LAYOUT["qr"]
        qr_text = qr_conf.get("data", "")
        qr_reader = generate_qr(qr_text)
        c.drawImage(
            qr_reader,
            qr_conf["x"],
            qr_conf["y"],
            width=qr_conf["width"],
            height=qr_conf["height"],
        )
        # print(f"[DRAW QR] '{qr_text}' at ({qr_conf['x']},{qr_conf['y']})")

    c.save()
    packet.seek(0)

    # --- Merge overlay ---
    overlay_pdf = PdfReader(packet)
    output_pdf = PdfWriter()

    first_page.merge_page(overlay_pdf.pages[0])
    output_pdf.add_page(first_page)

    # Duplicate second page if exists
    if len(template_pdf.pages) > 1:
        output_pdf.add_page(template_pdf.pages[1])
    else:
        output_pdf.add_page(first_page)

    final_pdf = BytesIO()
    output_pdf.write(final_pdf)
    final_pdf.seek(0)
    # print("[SUCCESS] PDF generation complete.")
    return final_pdf
