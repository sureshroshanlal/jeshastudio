import os
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('public/images/cutouts', exist_ok=True)

CUTOUT_MAPPING = [
    {
        'slug': 'gulabi-organza-anarkali-set',
        'source': 'public/images/hero_twirl_organza.jpg',
        'box': (380, 160, 840, 840),  # garment region
        'neck_clear': (550, 150, 680, 290) # clear neck/head
    },
    {
        'slug': 'pistachio-linen-nehru-jacket-set',
        'source': 'public/images/hero_bundi_boy.jpg',
        'box': (390, 160, 830, 840),
        'neck_clear': (550, 150, 670, 280)
    },
    {
        'slug': 'powder-blue-smocked-cotton-dress',
        'source': 'public/images/hero_smock_girl.jpg',
        'box': (370, 170, 850, 830),
        'neck_clear': (540, 160, 680, 300)
    },
    {
        'slug': 'saffron-marigold-angrakha-dhoti-set',
        'source': 'public/images/saffron_angrakha_toddler.jpg',
        'box': (360, 160, 840, 830),
        'neck_clear': (530, 150, 670, 290)
    },
    {
        'slug': 'ivory-botanical-co-ord-set',
        'source': 'public/images/botanical_resort_coord.jpg',
        'box': (380, 160, 830, 830),
        'neck_clear': (540, 150, 670, 280)
    },
    {
        'slug': 'dusty-mint-peplum-sharara-set',
        'source': 'public/images/mint_peplum_sharara.jpg',
        'box': (370, 160, 850, 840),
        'neck_clear': (540, 150, 670, 290)
    },
    {
        'slug': 'blush-terracotta-tiered-tulle-frock',
        'source': 'public/images/birthday_tulle_frock.jpg',
        'box': (360, 160, 850, 840),
        'neck_clear': (530, 150, 670, 290)
    }
]

for item in CUTOUT_MAPPING:
    src_path = item['source']
    if not os.path.exists(src_path):
        continue
    
    img = Image.open(src_path).convert('RGBA')
    w, h = img.size
    
    # Create alpha mask with smooth feathered edges around garment
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    
    bx0, by0, bx1, by1 = item['box']
    
    # Draw body polygon / ellipse
    # Upper chest, sleeves, skirt flare
    mid_x = (bx0 + bx1) // 2
    poly = [
        (bx0 + 60, by0 + 80),   # Left shoulder
        (bx0 - 20, by0 + 220),  # Left sleeve / elbow
        (bx0 + 20, by0 + 360),  # Left waist
        (bx0 - 50, by1),        # Left hem flare
        (bx1 + 50, by1),        # Right hem flare
        (bx1 - 20, by0 + 360),  # Right waist
        (bx1 + 20, by0 + 220),  # Right sleeve / elbow
        (bx1 - 60, by0 + 80),   # Right shoulder
        (mid_x + 50, by0 + 70), # Right collar
        (mid_x, by0 + 90),      # Center scoop collar
        (mid_x - 50, by0 + 70)  # Left collar
    ]
    draw.polygon(poly, fill=255)
    
    # Cut out neck / head area completely with smooth ellipse
    nx0, ny0, nx1, ny1 = item['neck_clear']
    draw.ellipse((nx0, ny0 - 100, nx1, ny1), fill=0)
    
    # Feather edges with Gaussian Blur
    mask_blurred = mask.filter(ImageFilter.GaussianBlur(radius=16))
    
    # Apply mask
    cutout = img.copy()
    cutout.putalpha(mask_blurred)
    
    # Crop to garment bounding box with padding
    pad = 30
    crop_box = (max(0, bx0 - pad - 50), max(0, by0 - 20), min(w, bx1 + pad + 50), min(h, by1 + 10))
    cropped = cutout.crop(crop_box)
    
    out_path = f"public/images/cutouts/{item['slug']}.png"
    cropped.save(out_path, 'PNG')
    print(f"Generated starter cutout: {out_path} ({cropped.size})")
