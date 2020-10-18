import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenleafBackendService {

  constructor(private http: HttpClient) { }


  getGeneratedUrl(markdown: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + "/generate-pdf", {'markdown': markdown, 'userId': localStorage.getItem('userId'), 'theme': 'material'})
  }

  download(url: string) {
    window.open(url);
  }
}
