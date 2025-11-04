from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image, ImageDraw, ImageEnhance
import qrcode
from io import BytesIO
import barcode
from barcode.writer import ImageWriter

from .templates import ID_CARD_LAYOUT, CERTIFICATE_LAYOUT

# -------------------------------
# Reusable helper functions
# -------------------------------

def barcode_generator(data: str, width=200, height=50):
    """Generate a barcode image reader."""
    CODE128 = barcode.get_barcode_class('code128')
    code128 = CODE128(data, writer=ImageWriter(), add_checksum=False)
    barcode_bytes = BytesIO()
    code128.write(barcode_bytes, {'module_width': 0.2, 'module_height': height / 10.0, 'font_size': 10, 'text_distance': 1})
    barcode_bytes.seek(0)
    return ImageReader(barcode_bytes)

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

def generate_pdf(template_path, data_fields, document_type, layout, image_file=None, qr_text=None):
    """
    Generalized PDF builder for various document types (e.g., idcard, niyukti_certificate).

    Args:
        template_path (str/BytesIO): Path or buffer of the base PDF template.
        data_fields (dict): Dictionary of data to populate the fields.
        document_type (str): Key to select the correct layout ('idcard' or 'niyukti_certificate').
        image_file (str/BytesIO, optional): Path or buffer of the photo to embed. Defaults to None.
        qr_text (str, optional): Data to encode in the QR code. Defaults to None.
        
    Returns:
        BytesIO: A buffer containing the final generated PDF.
    """

    LAYOUT = layout
    # 2. Update QR data within the selected layout configuration
    # Note: This modifies the layout dictionary which might not be desirable
    # for production use if the layouts object is shared. A deep copy would be better.
    if LAYOUT.get("qr"):
        LAYOUT["qr"]["data"] = qr_text

    # --- Read template & get size ---
    template_pdf = PdfReader(template_path)
    first_page = template_pdf.pages[0]
    width = float(first_page.mediabox.width)
    height = float(first_page.mediabox.height)
    # print(f"[DEBUG] Template size: {width}x{height}")

    # --- Apply Scaling if defined in Layout ---
    scaling_conf = LAYOUT.get("scaling")
    if scaling_conf:
        new_width = scaling_conf["width"]
        new_height = scaling_conf["height"]
        
        # In the original code, all pages were scaled, but only the first page's size was checked.
        for page in template_pdf.pages:
            page.scale_to(new_width, new_height)
        
        width = new_width
        height = new_height
        # print(f"[DEBUG] New Template size: {width}x{height}")

    packet = BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))

    # --- 3. Draw text fields ---
    for item in LAYOUT.get("text_fields", []):
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
            elif color == "black":
                c.setFillColorRGB(0, 0, 0)
            else:
                c.setFillColorRGB(0, 0, 0) # Default to black
                
            current_size = size
            c.setFont(font, current_size)
            text_width = c.stringWidth(value, font, current_size)

            # Auto shrink if max_width is given
            if max_width and text_width > max_width:
                current_size = current_size * max_width / text_width
                c.setFont(font, current_size)
                text_width = c.stringWidth(value, font, current_size)

            x, y = item["x"], item["y"]

            if align == "center":
                c.drawCentredString(x, y, value)
            elif align == "right":
                c.drawRightString(x, y, value)
            else:
                c.drawString(x, y, value)
            # print(f"[DRAW TEXT] {field}='{value}' at ({x},{y})")

    # --- 4. Draw image if provided ---
    if image_file and LAYOUT.get("image"):
        img_conf = LAYOUT["image"]
        size = (img_conf["width"], img_conf["height"])
        
        # Select the appropriate utility function
        if img_conf.get("shape") == "round":
            img_reader = make_round_image(image_file, size)
        elif img_conf.get("shape") == "soft_round":
            img_reader = make_soft_round_image(image_file, size, radius=img_conf.get("radius", 20))
        else:
            img_reader = ImageReader(image_file)
            
        c.drawImage(
            img_reader,
            img_conf["x"],
            img_conf["y"],
            width=img_conf["width"],
            height=img_conf["height"],
            mask="auto",
        )
        # print(f"[DRAW IMAGE] at ({img_conf['x']},{img_conf['y']}) size={size}")

    # --- 5. Draw QR code if provided ---
    if LAYOUT.get("qr") and LAYOUT["qr"].get("data"):
        qr_conf = LAYOUT["qr"]
        qr_text_data = LAYOUT["qr"]["data"]
        
        qr_reader = generate_qr(qr_text_data)
        c.drawImage(
            qr_reader,
            qr_conf["x"],
            qr_conf["y"],
            width=qr_conf["width"],
            height=qr_conf["height"],
        )
        # print(f"[DRAW QR] '{qr_text_data}' at ({qr_conf['x']},{qr_conf['y']})")

    c.save()
    packet.seek(0)

    # --- 6. Merge overlay ---
    overlay_pdf = PdfReader(packet)
    output_pdf = PdfWriter()

    # Merge the overlay (canvas content) onto the first page of the template
    first_page.merge_page(overlay_pdf.pages[0])
    output_pdf.add_page(first_page)

    # Duplicate remaining pages
    for i in range(1, len(template_pdf.pages)):
        output_pdf.add_page(template_pdf.pages[i])
         
    final_pdf = BytesIO()
    output_pdf.write(final_pdf)
    final_pdf.seek(0)
    # print("[SUCCESS] PDF generation complete.")
    return final_pdf


