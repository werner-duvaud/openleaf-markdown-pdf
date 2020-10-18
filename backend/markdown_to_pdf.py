import argparse
import codecs
from datetime import date
from pathlib import Path

import markdown
from bs4 import BeautifulSoup
from pygments.formatters import HtmlFormatter
from weasyprint import HTML

import sys
class PdfGenerator:
    def __init__(self):
        self.markdown = None
        self.html = None
        self.meta = {}

    def run(self, pdf_path, css_path=None, html_path=None):
        self.preprocess_markdown()
        self.markdown_to_html()
        self.add_meta()

        if not css_path:
            css_path = Path(__file__).resolve().parent / "default-style.css"

        self.add_css(css_path)
        self.add_toc()
        self.generate_pdf(pdf_path)
        if html_path:
            self.generate_html(html_path)
        return self

    def load_markdown_from_path(self, path):
        markdown_file = codecs.open(path, mode="r")
        self.markdown = markdown_file.read()
        return self

    def load_markdown_from_str(self, markdown_string):
        self.markdown = markdown_string
        return self

    def preprocess_markdown(self):
        self.markdown = self.markdown.replace("!!!", "\n!!!")
        self.markdown = self.markdown.replace(
            "\\today", date.today().strftime("%d %B, %Y")
        )
        self.markdown = self.markdown.replace(
            "\\no-header", '<div class="no-header"></div>'
        )
        self.markdown = self.markdown.replace(
            "\\page-break", '<div class="page-break"></div>'
        )
        self.markdown = self.markdown.replace(
            "[ ]",
            '<img class="checkbox" src="https://fonts.gstatic.com/s/i/materialicons/check_box_outline_blank/v4/24px.svg"/>',
        )
        self.markdown = self.markdown.replace(
            "[x]",
            '<img class="checkbox" src="https://fonts.gstatic.com/s/i/materialiconsoutlined/check_box/v4/24px.svg"/>',
        )
        self.markdown = self.markdown.replace(
            "[X]",
            '<img class="checkbox" src="https://fonts.gstatic.com/s/i/materialiconsoutlined/check_box/v4/24px.svg"/>',
        )
        return self

    def markdown_to_html(self):
        md = markdown.Markdown(
            extensions=[
                "extra",
                "abbr",
                "attr_list",
                "def_list",
                "fenced_code",
                "md_in_html",
                "tables",
                "admonition",
                "codehilite",
                "legacy_attrs",
                "legacy_em",
                "meta",
                "nl2br",
                "sane_lists",
                "smarty",
                "toc",
                "wikilinks",
                "markdown_katex",
                "footnotes2",
            ]
        )
        self.html = BeautifulSoup(md.convert(self.markdown), "html5lib")
        self.meta = md.Meta
        return self

    def add_meta(self):
        if not self.html:
            raise ValueError("You must load a markdown before adding metadata")

        meta_string = ""
        for key, values in self.meta.items():
            for value in values:
                if key == "title":
                    meta_string += "<title>{}</title>".format(value)
                else:
                    meta_string += '<meta name={} content="{}">'.format(key, value)
        if meta_string != "":
            meta_string += '<div class="page-break"></div>'

        meta_html = BeautifulSoup(meta_string, "html5lib")
        self.html.head.append(meta_html)
        return self

    def add_css(self, path):
        if not self.html:
            raise ValueError("You must load a markdown before adding css")

        css_file = codecs.open(path, mode="r")
        css_text = css_file.read()
        css = BeautifulSoup(
            '<style type="text/css">{}</style>'.format(css_text), "html5lib"
        )
        self.html.head.append(css)
        return self

    def add_toc(self):
        toc = []
        current_list = toc
        previous_tag = None

        for header in self.html.findAll(["h2", "h3"]):
            if previous_tag == "h2" and header.name == "h3":
                current_list = []
            elif previous_tag == "h3" and header.name == "h2":
                toc.append(current_list)
                current_list = toc

            current_list.append((header["id"], header.string))

            previous_tag = header.name

        if current_list != toc:
            toc.append(current_list)

        def list_to_html(lst):
            result = ["<ul>"]
            for item in lst:
                if isinstance(item, list):
                    result.append(list_to_html(item))
                else:
                    result.append('<li><a href="#%s">%s</a></li>' % item)
            result.append("</ul>")
            return "\n".join(result)

        toc_html = '<div class="toc">' + list_to_html(toc) + "</div>"
        self.html = BeautifulSoup(str(self.html).replace("[toc]", toc_html), "html5lib")
        self.html = BeautifulSoup(str(self.html).replace("[TOC]", toc_html), "html5lib")
        return self

    def generate_pdf(self, path):
        print("Generating pdf ...")
        html = str(self.html)
        html = html.replace(
            "file://", "https://"
        )  # Safety, could be disabled for local usage
        # print(self.markdown)
        # print(self.html)
        HTML(string=html).write_pdf(path)
        return self

    def generate_html(self, path):
        with open(path, "w") as file:
            file.write(str(self.html))
        return self


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert markdown to pdf")
    parser.add_argument("--markdown_path", help="Markdown path", required=True)
    parser.add_argument("--pdf_path", help="PDF path", required=True)
    parser.add_argument("--css_path", default=None, help="CCS path")
    args = parser.parse_args()

    PdfGenerator().load_markdown_from_path(args.markdown_path).run(
        pdf_path=args.pdf_path, css_path=args.css_path
    )
