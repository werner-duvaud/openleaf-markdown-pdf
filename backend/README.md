# Openleaf Backend

Standalone and backend Markdown to PDF in Python.

Markdown --> [Python-Markdown](https://github.com/Python-Markdown/markdown) --> HTML + CSS --> [WeasyPrint](https://github.com/Kozea/WeasyPrint) --> PDF

## Getting started

### Installation

```bash
git clone https://github.com/werner-duvaud/openleaf-markdown-pdf.git
cd openleaf-markdown-pdf/backend

pip install -r requirements.txt
```

### How to use it

Standalone usage:
```bash
python markdown_to_pdf.py --markdown_path my_markdown.md --pdf_path my_pdf.pdf --css_path (optional) my_css.css --html_path (optional) my_html.html
```

Server mode:
```bash
python backend.py
```

## Demo

https://openleaf.herokuapp.com