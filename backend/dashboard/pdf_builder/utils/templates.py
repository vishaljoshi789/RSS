# idcards/utils/templates_config.py

# ID Card layout
ID_CARD_LAYOUT = {
        "scaling": {"width": 153.0, "height": 243.0},
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
        "qr": {"x": 93, "y": 155, "width": 37, "height": 37},
    }

# Certificate layout
CERTIFICATE_LAYOUT = {
    "scaling": None,
    "text_fields": [
        {"name": "name", "x": 300, "y": 400, "font": "NotoSansDevanagari", "size": 20, "align": "center", "max_width": 100, "color": (14, 47, 117)},
        {"name": "reg_no", "x": 290, "y": 86, "size": 9},
        {"name": "reg_date", "x": 290, "y": 75, "size": 9},
        {"name": "valid_till", "x": 290, "y": 64, "size": 9},
    ],
    "image": {"x": 240, "y": 420, "width": 120, "height": 130, "shape": "soft_round", "radius": 15},
    "qr": {"x": 480, "y": 730, "width": 80, "height": 80},
    "barcode": {"x": 210, "y": 100, "width": 170, "height": 40},
    "duplicate_page": False,
}

JOINING_LETTER_LAYOUT = {
    "scaling": None,
    "text_fields": [
        {"name": "name", "x": 55, "y": 690, "font": "Helvetica-Bold", "size": 16, "align": "left", "max_width": 300, "color": (0, 0, 0)},
        {"name": "address", "x": 55, "y": 670, "size": 13},
        {"name": "reg_no", "x": 60, "y": 650, "size": 13},
        {"name": "joining_date", "x": 195, "y": 650, "size": 13},
    ],
    "image": None,
    "qr": None,
    "barcode": None,
    "duplicate_page": False,
}
