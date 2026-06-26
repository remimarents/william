from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
OUT = DOCS / "Trening-guide.pdf"

DARK = "#0f172a"
TEAL = "#16b8a6"
CORAL = "#ff6b5f"
LINE = "#d7dde7"
MUTED = "#64748b"


def styles():
    style = getSampleStyleSheet()
    style.add(ParagraphStyle(name="CoverTitle", fontName="Helvetica-Bold", fontSize=42, leading=45, textColor=colors.white, spaceAfter=12))
    style.add(ParagraphStyle(name="CoverText", fontName="Helvetica", fontSize=13, leading=18, textColor=colors.white, spaceAfter=8))
    style.add(ParagraphStyle(name="SectionTitle", fontName="Helvetica-Bold", fontSize=22, leading=26, textColor=colors.HexColor(DARK), spaceAfter=8))
    style.add(ParagraphStyle(name="Lead", fontName="Helvetica", fontSize=12.5, leading=17, textColor=colors.HexColor("#334155"), spaceAfter=10))
    style.add(ParagraphStyle(name="Body", fontName="Helvetica", fontSize=10.5, leading=14.5, textColor=colors.HexColor(DARK), spaceAfter=6))
    style.add(ParagraphStyle(name="Small", fontName="Helvetica", fontSize=8.5, leading=11.5, textColor=colors.HexColor(MUTED)))
    style.add(ParagraphStyle(name="CardTitle", fontName="Helvetica-Bold", fontSize=11.5, leading=14, textColor=colors.HexColor(DARK), spaceAfter=4))
    return style


def card(title, body, style, width=80 * mm):
    return Table(
        [[Paragraph(title, style["CardTitle"])], [Paragraph(body, style["Body"])]],
        colWidths=[width],
        style=[
            ("BACKGROUND", (0, 0), (-1, -1), colors.white),
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor(LINE)),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ],
    )


def build_pdf():
    DOCS.mkdir(parents=True, exist_ok=True)
    style = styles()
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=14 * mm,
        rightMargin=14 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title="Trening - bruksanvisning",
        author="Remi Marents",
    )

    story = []
    cover = Table(
        [[
            [
                Spacer(1, 62 * mm),
                Paragraph("Trening", style["CoverTitle"]),
                Paragraph("Slik bruker du appen for å innarbeide gode treningsvaner, følge progresjon og nå treningsmålene du setter deg.", style["CoverText"]),
                Spacer(1, 18 * mm),
                Paragraph("marents.no/trening/", style["CoverText"]),
            ]
        ]],
        colWidths=[176 * mm],
        style=[
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(TEAL)),
            ("LEFTPADDING", (0, 0), (-1, -1), 14 * mm),
            ("RIGHTPADDING", (0, 0), (-1, -1), 14 * mm),
            ("TOPPADDING", (0, 0), (-1, -1), 14 * mm),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 14 * mm),
        ],
    )
    story += [cover, Spacer(1, 12 * mm)]

    story += [
        Paragraph("Hva appen hjelper deg med", style["SectionTitle"]),
        Paragraph("Trening er laget for daglig oppfølging. Poenget er ikke at hver økt må være perfekt, men at du møter opp, registrerer ærlig og ser utviklingen over tid.", style["Lead"]),
        Table(
            [[
                card("Vaner", "Bygg en rytme der trening blir noe du gjør jevnlig, også på dager med lav motivasjon.", style),
                card("Progresjon", "Følg med på økter, historikk og utvikling slik at små forbedringer blir synlige.", style),
            ], [
                card("Mål", "Sett mål som passer nivået ditt, juster underveis og bruk appen til å holde retningen.", style),
                card("Ærlige data", "Registrer det du faktisk gjorde. Det gir bedre grunnlag for neste økt enn pyntede tall.", style),
            ]],
            colWidths=[84 * mm, 84 * mm],
            style=[("VALIGN", (0, 0), (-1, -1), "TOP")],
        ),
        Spacer(1, 9 * mm),
        Paragraph("Slik bruker du den", style["SectionTitle"]),
        Table(
            [[
                card("1. Logg inn", "Bruk kontoen din på marents.no. Appen viser hvilken bruker som er innlogget, og lagrer treningsdata separat per bruker.", style),
                card("2. Se dagens økt", "Start med dagens forslag. Juster tallene hvis økten må bli lettere eller tyngre.", style),
            ], [
                card("3. Registrer resultatet", "Skriv inn det du faktisk gjennomførte, og legg gjerne til hvordan økten føltes.", style),
                card("4. Følg utviklingen", "Bruk statistikk, streak og historikk til å se om vanen og treningen beveger seg riktig vei.", style),
            ]],
            colWidths=[84 * mm, 84 * mm],
            style=[("VALIGN", (0, 0), (-1, -1), "TOP")],
        ),
        Spacer(1, 9 * mm),
        Paragraph("Påminnelser og konto", style["SectionTitle"]),
        Paragraph("Påminnelser kan sendes fra Mac mini med iMessage. Appen kan sende dagens økt med lenke på et fast tidspunkt, og en egen påminnelse senere hvis dagens økt fortsatt mangler. Konto og innlogging håndteres felles via Marents-spillsiden, mens treningsdata lagres per bruker.", style["Lead"]),
        Table(
            [[
                Paragraph("<b>Tips:</b> Legg appen til på Hjem-skjermen på iPhone for å bruke den som en vanlig app.", style["Body"]),
            ]],
            colWidths=[168 * mm],
            style=[
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#ecfeff")),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#99f6e4")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ],
        ),
        Spacer(1, 8 * mm),
        Paragraph("Denne PDF-en er generell og inneholder ikke brukernavn, passord eller personspesifikke mål.", style["Small"]),
    ]

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(OUT)
