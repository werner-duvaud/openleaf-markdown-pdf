import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpenleafBackendService } from './openleaf-backend/openleaf-backend.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('pdf') pdfEl: any;
  constructor(private http: HttpClient, private OpenleafBackendService: OpenleafBackendService) { }

  modelChanged: Subject<string> = new Subject<string>();
  subscription: Subscription;
  debounceTime = 500;
  scrollPosition = 0;
  caretPos = 0;
  endCaretPos = undefined;

  markdown = "";
  pdfPath = "assets/pdf.pdf";
  htmlPath = "assets/pdf.pdf";

	ngOnInit() {
		if (localStorage.getItem('userId') === null) {
			localStorage.setItem('userId', Math.random().toString(36).substr(2));
		}

		this.markdown = localStorage.getItem('markdown');
		if (this.markdown == "" || this.markdown === null) {
			this.http.get('assets/demo.md', {
					responseType: 'text'
				})
				.subscribe(data => {
					this.markdown = data;
					this.updatePdf();
				});

		} else {
			this.updatePdf();
		}

		this.subscription = this.modelChanged
			.pipe(
				debounceTime(this.debounceTime),
			)
			.subscribe(() => {
				this.updatePdf();
			});
	}

	inputChanged() {
		this.modelChanged.next();
	}

	updatePdf() {
		localStorage.setItem('markdown', this.markdown);
		this.OpenleafBackendService.getGeneratedUrl(this.markdown).subscribe(data => {
			this.scrollPosition = this.pdfEl.pdfViewerContainer.nativeElement.scrollTop;
			console.log(data.url)
			this.pdfPath = data.url + ".pdf?" + Date.now();
			this.htmlPath = data.url + ".html?" + Date.now();
		});
	}

	downloadPdf() {
		this.OpenleafBackendService.download(this.pdfPath);
	}

	downloadHtml() {
		this.OpenleafBackendService.download(this.htmlPath);
	}

	downloadMarkdown() {
		let blob = new Blob([this.markdown], {
			type: 'text/plain'
		});
		let url = window.URL.createObjectURL(blob);
		let a = document.createElement('a');
		document.body.appendChild(a);
		a.setAttribute('style', 'display: none');
		a.href = url;
		a.download = 'markdown.md';
		a.click();
		window.URL.revokeObjectURL(url);
		a.remove();
	}

	afterLoadComplete() {
		setTimeout(() => {
			this.pdfEl.pdfViewerContainer.nativeElement.scrollTop = this.scrollPosition;
		}, 100);
	}

	getCaretPos(event) {
		if (event.selectionStart == event.selectionEnd) {
			this.caretPos = event.selectionStart;
			this.endCaretPos = undefined;
		}
	}

	selectionchange(event) {
		this.caretPos = event.target.selectionStart;
		this.endCaretPos = event.target.selectionEnd;
	}

	findLastSpace(caret: number) {
		let spaceIndex = this.markdown.indexOf(" ", caret);
		let breakIndex = this.markdown.indexOf("\n", caret);
		if (spaceIndex == -1) {
			spaceIndex = this.markdown.length;
		}
		if (breakIndex == -1) {
			breakIndex = this.markdown.length;
		}
		return Math.min(spaceIndex, breakIndex);
	}

	changeWordStyle(char1: string, char2: string) {
		let firstSpace = Math.max(this.markdown.lastIndexOf(" ", this.caretPos - 1), this.markdown.lastIndexOf("\n", this.caretPos - 1));
		let firstChar = this.markdown.lastIndexOf(char1, this.caretPos - 1);
		let lastSpace = this.findLastSpace(this.caretPos);
		let lastChar = this.markdown.indexOf(char2, this.caretPos);

		if (this.endCaretPos != undefined) {
			lastSpace = this.findLastSpace(this.endCaretPos);
			lastChar = this.markdown.indexOf(char2, this.endCaretPos);
		}

		if (lastChar == -1) {
			lastChar = this.markdown.length;
		}

		if (firstSpace - char1.length < firstChar && lastChar - char2.length < lastSpace) {
			this.markdown = this.markdown.slice(0, firstChar) + this.markdown.slice(firstChar + char1.length, lastChar) + this.markdown.slice(lastChar + char2.length, this.markdown.length);

			this.caretPos -= char1.length;
			if (this.endCaretPos != undefined) {
				this.endCaretPos -= char1.length;
			}

		} else {
			this.markdown = this.markdown.substring(0, firstSpace + 1) + char1 + this.markdown.substring(firstSpace + 1, lastSpace) + char2 + this.markdown.substring(lastSpace);

			this.caretPos += char1.length;
			if (this.endCaretPos != undefined) {
				this.endCaretPos += char1.length;
			}
		}
	}

	getBeginOfLine(caret: number) {
		let lastIndex = this.markdown.lastIndexOf("\n", caret - 1);
		if (caret == 0 || lastIndex == -1) {
			return 0
		} else {
			return lastIndex + 1
		}
	}

	changeBeginOfLine(char: string, caret: number) {
		let beginOfLine = this.getBeginOfLine(caret)
		if (this.markdown.substring(beginOfLine, beginOfLine + char.length) == char) {
			this.markdown = this.markdown.slice(0, beginOfLine) + this.markdown.slice(beginOfLine + char.length);
			this.caretPos -= char.length;
			if (this.endCaretPos != undefined) {
				this.endCaretPos -= char.length;
			}
		} else {
			this.markdown = this.markdown.substring(0, beginOfLine) + char + this.markdown.substring(beginOfLine);
			this.caretPos += char.length;
			if (this.endCaretPos != undefined) {
				this.endCaretPos += char.length;
			}
		}
	}

	replaceInSubstring(pattern: string, replace: string) {
		let newString = this.markdown.substring(this.caretPos, this.endCaretPos).split(pattern).join(replace);
		this.markdown = this.markdown.substring(0, this.caretPos) + newString + this.markdown.substring(this.endCaretPos);
		this.endCaretPos += newString.length - (this.endCaretPos - this.caretPos);
	}

	changeLineStyle(char: string) {
		this.changeBeginOfLine(char, this.caretPos);
		if (this.endCaretPos != undefined) {
			if (this.markdown.substring(this.caretPos, this.endCaretPos).indexOf('\n' + char) == -1) {
				this.replaceInSubstring('\n', '\n' + char);
			} else {
				this.replaceInSubstring('\n' + char, '\n');
			}
		}
	}


	addCode() {
		if (this.endCaretPos == undefined || !this.markdown.substring(this.caretPos, this.endCaretPos + 2).includes('\n')) {
			this.changeWordStyle('`', '`');
		} else {
			this.changeWordStyle('```bash\n', '\n```')
		}
	}

	addMath() {
		if (this.endCaretPos == undefined || !this.markdown.substring(this.caretPos, this.endCaretPos + 2).includes('\n')) {
			this.changeWordStyle('$`', '`$');
		} else {
			this.changeWordStyle('```math\n', '\n```')
		}
	}

	addAdmonition() {
		if (this.endCaretPos == undefined) {
			this.changeWordStyle('\n!!! red "', '"\n    ')
		} else {
			this.markdown = this.markdown.substring(0, this.caretPos) + '!!! red "Title"\n    ' + this.markdown.substring(this.caretPos, this.endCaretPos).split('\n').join('\n    ') + this.markdown.substring(this.endCaretPos);
		}
	}

	addImage() {
		this.markdown = this.markdown.substring(0, this.caretPos) + '\n<img style="height: 150px;" src="https://"/>\n' + this.markdown.substring(this.caretPos, this.endCaretPos)
	}

	addCenter() {
		if (this.endCaretPos == undefined || !this.markdown.substring(this.caretPos, this.endCaretPos + 2).includes('\n')) {
			this.changeWordStyle('<center>', '</center>');
		} else {
			this.changeWordStyle('\n<center>\n', '\n</center>\n')
		}
	}

	insertText(text: string) {
		this.markdown = this.markdown.substring(0, this.caretPos) + text + this.markdown.substring(this.caretPos)
	}

}
