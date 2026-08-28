from PIL import Image

def add_watermark(base_image_path, watermark_path, output_path):
    try:
        base = Image.open(base_image_path).convert("RGBA")
        watermark = Image.open(watermark_path).convert("RGBA")
        
        # Resize watermark to be about 15% of the base image width
        wm_width = int(base.width * 0.15)
        wm_height = int((wm_width / float(watermark.width)) * watermark.height)
        watermark = watermark.resize((wm_width, wm_height), Image.Resampling.LANCZOS)
        
        # Create a new transparent image the size of the base
        transparent = Image.new('RGBA', base.size, (0,0,0,0))
        transparent.paste(base, (0,0))
        
        # Position in top right corner with some padding
        padding = int(base.width * 0.05)
        pos_x = base.width - wm_width - padding
        pos_y = padding
        
        # Overlay
        transparent.paste(watermark, (pos_x, pos_y), mask=watermark)
        
        # Save
        transparent.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print("Error:", e)

base_path = "public/l1.png"
wm_path = "/Users/tahbibmanzoor/.gemini/antigravity/brain/0cc0d65f-2e77-4a26-8f12-86979cb9dd54/.user_uploaded/media_1787900358023.png"
out_path = "public/l1_watermarked.png"

add_watermark(base_path, wm_path, out_path)
