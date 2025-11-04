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
        {"name": "name", "x": 300, "y": 400, "font": "Helvetica-Bold", "size": 18},
        {"name": "reg_no", "x": 280, "y": 370, "size": 14},
        {"name": "reg_date", "x": 280, "y": 340, "size": 12},
        {"name": "valid_till", "x": 280, "y": 310, "size": 12},
    ],
    "image": {"x": 450, "y": 420, "width": 80, "height": 80, "shape": "round"},
    "qr": {"x": 500, "y": 100, "width": 60, "height": 60, "data": "Sample QR"},
    "duplicate_page": False,
}
