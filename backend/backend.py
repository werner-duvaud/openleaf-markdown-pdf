import threading
import time
from pathlib import Path

from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse
from werkzeug.utils import secure_filename

from markdown_to_pdf import PdfGenerator

# URL_BASE = "https://openleaf-backend.herokuapp.com"
URL_BASE = "http://localhost:5000"
generate_path = "generated"

app = Flask(__name__, static_folder=generate_path)
api = Api(app)
CORS(app)

parser = reqparse.RequestParser()


def cleanup():
    while True:
        now = time.time()
        path_list = [
            path
            for path in (Path(__file__).resolve().parent / generate_path).glob("*.pdf")
        ]
        path_list.extend(
            [
                path
                for path in (Path(__file__).resolve().parent / generate_path).glob(
                    "*.html"
                )
            ]
        )
        for path in path_list:
            if path.stat().st_mtime < now - 60 * 5:
                print("Deleting: ", path)
                time.sleep(2)  # could be removed, time for canceling in debug
                try:
                    path.unlink()
                except FileNotFoundError:
                    pass
        time.sleep(60 * 5)


def launch_cleanup():
    thr = threading.Thread(target=cleanup, args=(), kwargs={})
    thr.start()


class HelloWorld(Resource):
    def get(self):
        return "OpenLeaf Backend"


class GeneratePdf(Resource):
    def post(self):
        parser.add_argument("markdown", type=str)
        parser.add_argument("userId", type=str)
        parser.add_argument("theme", type=str)
        args = parser.parse_args()

        if not args.theme or args.theme == "material":
            css_path = "default-style.css"

        path = Path(generate_path) / secure_filename(args.userId)
        PdfGenerator().load_markdown_from_str(args.markdown).run(
            pdf_path=Path(__file__).resolve().parent / path.with_suffix(".pdf"),
            css_path=Path(__file__).resolve().parent / css_path,
            html_path=Path(__file__).resolve().parent / path.with_suffix(".html"),
        )
        return {"url": URL_BASE + "/" + str(path)}


api.add_resource(HelloWorld, "/")
api.add_resource(GeneratePdf, "/generate-pdf")

if __name__ == "__main__":
    launch_cleanup()
    app.run(debug=True)
