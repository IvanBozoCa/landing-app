from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "tarjeta-comercial-ivan-bozo.pdf"
TEMP = ROOT / "tmp" / "pdfs" / "tarjeta-comercial-sin-cajas.pdf"

TRIM_WIDTH = 90 * mm
TRIM_HEIGHT = 50 * mm
BLEED = 3 * mm
PAGE_WIDTH = TRIM_WIDTH + 2 * BLEED
PAGE_HEIGHT = TRIM_HEIGHT + 2 * BLEED
PAGE_SIZE = landscape((PAGE_HEIGHT, PAGE_WIDTH))

DARK = HexColor("#111A18")
TEXT = HexColor("#17201D")
GREEN = HexColor("#2F6B5F")
GREEN_DARK = HexColor("#24564D")
MINT = HexColor("#9AD1C2")
CREAM = HexColor("#F7F6F2")
WHITE = HexColor("#FFFFFF")
MUTED_LIGHT = HexColor("#C6CECA")
MUTED_DARK = HexColor("#52605A")

NAME = "Iván Bozo Catalán"
DESCRIPTOR = "Software a medida · Sitios web · Productos digitales"
PHONE = "+56 9 4106 8150"
EMAIL = "iv.bozo.catalan@gmail.com"
DOMAIN = "ivanbozocatalan.com"
QR_URL = "https://ivanbozocatalan.com/hola?origen=tarjeta"


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("CardRegular", "C:/Windows/Fonts/arial.ttf"))
    pdfmetrics.registerFont(TTFont("CardBold", "C:/Windows/Fonts/arialbd.ttf"))


def label(pdf: canvas.Canvas, text: str, x: float, y: float, color=MINT) -> None:
    line = pdf.beginText(x, y)
    line.setFillColor(color)
    line.setFont("CardBold", 5.5)
    line.setCharSpace(1.05)
    line.textOut(text.upper())
    pdf.drawText(line)
    reset_spacing = pdf.beginText(0, 0)
    reset_spacing.setCharSpace(0)
    pdf.drawText(reset_spacing)


def draw_front(pdf: canvas.Canvas) -> None:
    pdf.setFillColor(DARK)
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#18312C"))
    pdf.circle(PAGE_WIDTH - 5 * mm, PAGE_HEIGHT + 4 * mm, 32 * mm, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#21463E"))
    pdf.circle(PAGE_WIDTH + 5 * mm, PAGE_HEIGHT - 5 * mm, 23 * mm, fill=1, stroke=0)

    safe_x = BLEED + 5 * mm
    top = PAGE_HEIGHT - BLEED - 5 * mm

    pdf.setFillColor(GREEN)
    pdf.roundRect(safe_x, top - 10 * mm, 10 * mm, 10 * mm, 2.5 * mm, fill=1, stroke=0)
    pdf.setFillColor(WHITE)
    pdf.setFont("CardBold", 7)
    pdf.drawCentredString(safe_x + 5 * mm, top - 6.3 * mm, "IB")

    label(pdf, "SOLUCIONES DIGITALES PARA NECESIDADES REALES", safe_x + 14 * mm, top - 3.6 * mm)
    pdf.setFillColor(WHITE)
    pdf.setFont("CardBold", 18)
    pdf.drawString(safe_x, top - 19 * mm, NAME)
    pdf.setFillColor(MUTED_LIGHT)
    pdf.setFont("CardRegular", 7.1)
    pdf.drawString(safe_x, top - 25 * mm, DESCRIPTOR)

    info_y = BLEED + 4.3 * mm
    pdf.setStrokeColor(HexColor("#3D4A46"))
    pdf.setLineWidth(0.45)
    pdf.line(safe_x, info_y + 10 * mm, PAGE_WIDTH - BLEED - 5 * mm, info_y + 10 * mm)
    pdf.setFont("CardBold", 6.2)
    pdf.setFillColor(WHITE)
    pdf.drawString(safe_x, info_y + 5 * mm, PHONE)
    pdf.setFillColor(MINT)
    pdf.drawRightString(PAGE_WIDTH - BLEED - 5 * mm, info_y + 5 * mm, DOMAIN)
    pdf.setFillColor(MUTED_LIGHT)
    pdf.setFont("CardRegular", 5.8)
    pdf.drawString(safe_x, info_y, EMAIL)
    pdf.showPage()


def draw_qr(pdf: canvas.Canvas, x: float, y: float, size: float) -> None:
    widget = QrCodeWidget(QR_URL)
    x1, y1, x2, y2 = widget.getBounds()
    drawing = Drawing(size, size, transform=[size / (x2 - x1), 0, 0, size / (y2 - y1), 0, 0])
    drawing.add(widget)
    renderPDF.draw(drawing, pdf, x, y)


def draw_back(pdf: canvas.Canvas) -> None:
    pdf.setFillColor(CREAM)
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#E6EFEA"))
    pdf.circle(-3 * mm, PAGE_HEIGHT + 2 * mm, 29 * mm, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#EEF1EC"))
    pdf.circle(44 * mm, -15 * mm, 33 * mm, fill=1, stroke=0)

    safe_x = BLEED + 5 * mm
    top = PAGE_HEIGHT - BLEED - 6 * mm
    label(pdf, "UN PRIMER PASO", safe_x, top, GREEN)

    pdf.setFillColor(TEXT)
    pdf.setFont("CardBold", 12.2)
    pdf.drawString(safe_x, top - 8 * mm, "¿Algo en tu negocio")
    pdf.drawString(safe_x, top - 13.5 * mm, "es lento, manual o")
    pdf.drawString(safe_x, top - 19 * mm, "difícil de organizar?")

    pdf.setFillColor(MUTED_DARK)
    pdf.setFont("CardRegular", 6.2)
    pdf.drawString(safe_x, top - 26.5 * mm, "Escanea y cuéntame el contexto.")
    pdf.drawString(safe_x, top - 31 * mm, "No necesitas una solución técnica.")

    qr_size = 24 * mm
    qr_x = PAGE_WIDTH - BLEED - 5 * mm - qr_size
    qr_y = BLEED + 8.5 * mm
    pdf.setFillColor(WHITE)
    pdf.roundRect(qr_x - 2.2 * mm, qr_y - 2.2 * mm, qr_size + 4.4 * mm, qr_size + 4.4 * mm, 3 * mm, fill=1, stroke=0)
    draw_qr(pdf, qr_x, qr_y, qr_size)

    pdf.setFillColor(GREEN_DARK)
    pdf.setFont("CardBold", 4.8)
    pdf.drawCentredString(qr_x + qr_size / 2, BLEED + 4.3 * mm, "ESCANEA Y CONVERSEMOS")
    pdf.setFillColor(MUTED_DARK)
    pdf.setFont("CardRegular", 5.3)
    pdf.drawString(safe_x, BLEED + 4.3 * mm, "ivanbozocatalan.com/hola")
    pdf.showPage()


def add_print_boxes() -> None:
    reader = PdfReader(TEMP)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    for page in writer.pages:
        page.trimbox.lower_left = (BLEED, BLEED)
        page.trimbox.upper_right = (BLEED + TRIM_WIDTH, BLEED + TRIM_HEIGHT)
        page.bleedbox.lower_left = (0, 0)
        page.bleedbox.upper_right = (PAGE_WIDTH, PAGE_HEIGHT)
    writer.add_metadata({
        "/Title": "Tarjeta comercial - Iván Bozo Catalán",
        "/Author": NAME,
        "/Subject": "Tarjeta de presentación de servicios digitales",
    })
    with OUTPUT.open("wb") as stream:
        writer.write(stream)


def main() -> None:
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    TEMP.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(TEMP), pagesize=PAGE_SIZE, pageCompression=1)
    pdf.setTitle("Tarjeta comercial - Iván Bozo Catalán")
    draw_front(pdf)
    draw_back(pdf)
    pdf.save()
    add_print_boxes()
    print(OUTPUT)


if __name__ == "__main__":
    main()
