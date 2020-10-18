# Openleaf: Markdown editor for generating PDF
This is a Python based markdown to PDF converter, specially designed for paginated documents.
It can be used as a standalone markdown to PDF converter but a minimalist web editor is available.

https://openleaf.herokuapp.com

## Markdown to PDF

I did this project for myself because I needed to produce carefully designed reports while remaining productive and focused on the content.
PDF is the most popular format for reports and no markdown editor offers a table of contents with page numbers and a header with the current title.
I found LaTex old, complicated, not very hackable and heavy to install, that's why I tried to make this project:
- Simple and hackable but powerful
- Lightweight (but still requires python)

## Features

* Customizable: preprocessed in Python, designed with HTML and CSS
* Predefined, hackable and fully customizable CSS styles
* Table of content with page numbers
* First page with metadata integration
* Header & Footer
* Maths and code rendering with KaTex and Pygments
* Admonition note blocks
* Dynamic replacing (ex: \today is replaced by the current date)
* Page break and disable header for specific pages

## Getting started

### Demo

https://openleaf.herokuapp.com

![website-preview](https://github.com/werner-duvaud/openleaf-markdown-pdf/blob/master/docs/website-preview.png)

### Standalone backend

```bash
git clone https://github.com/werner-duvaud/openleaf-markdown-pdf.git
cd openleaf/backend

python markdown_to_pdf.py --markdown_path my_markdown.md --pdf_path my_pdf.pdf
```

### Local server mode

```bash
git clone https://github.com/werner-duvaud/openleaf-markdown-pdf.git
```

Launch backend:
```bash
cd openleaf-markdown-pdf/backend
pip install -r requirements.txt
python backend.py
```

Launch frontend:
```bash
cd openleaf-markdown-pdf/frontend
npm run build-local
npm start
```

Navigate to http://localhost:4200

## Style

Styles are in pur CSS, they are easily customizable, you can use the [default style](https://github.com/werner-duvaud/openleaf-markdown-pdf/blob/master/backend/default-style.css) to get started.

[Markdown used to generate the following PDF](https://github.com/werner-duvaud/openleaf-markdown-pdf/blob/master/docs/demo.md)

### Material theme

[Markdown](https://github.com/werner-duvaud/openleaf-markdown-pdf/blob/master/docs/demo.md) | [PDF](https://github.com/werner-duvaud/openleaf-markdown-pdf/blob/master/docs/material.pdf)

![material-style](https://github.com/werner-duvaud/openleaf-markdown-pdf/blob/master/docs/material.png)
