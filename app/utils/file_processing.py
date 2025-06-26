import io
import os
import fitz
from PIL import Image

def get_file_extension(filename: str) -> str:
    _, ext = os.path.splitext(filename)
    return ext.lower()

def extract_pdf_text_from_bytes(file_bytes: bytes) -> str:
    """Extracts text from a PDF file given its byte content."""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return f"Error extracting PDF text: {str(e)}"


def extract_image_text_from_bytes(image_bytes: bytes) -> str:
    """Extracts text from an image using OCR (e.g., Tesseract)."""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        return image
    except Exception as e:
        return f"Error processing image: {str(e)}"
