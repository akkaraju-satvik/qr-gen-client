import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'qr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private http: HttpClient) { }
  
  form = new FormGroup({
    qrType: new FormControl('', [Validators.required]),
    wifiQR: new FormGroup({
      ssid: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      hidden: new FormControl(false, [Validators.required]),
      encryption: new FormControl('WPA', [Validators.required])
    }),
    urlQR: new FormGroup({
      url: new FormControl('', [Validators.required, Validators.pattern('http(s)*://.+')]),
    }),
    textQR: new FormGroup({
      text: new FormControl('', [Validators.required])
    }),
  })

  qrFileName: string = '';

  ngOnInit(): void {
    this.form.get('qrType')?.valueChanges.subscribe((value) => {
      this.form.get(value as string)?.reset();
    });
  }

  onSubmit(form: string | null | undefined) {
    console.log(form);
    if (this.form.get(form as string)) {
      const reqBody = this.form.get(form as string)?.value;
      reqBody.qrType = form;
      this.http.post('http://localhost:3000/get-qr', reqBody).subscribe({
        next: (res: any) => {
          console.log(res);
          this.qrFileName = res.fileName as string;
        },
        error: (err) => {
        console.log(err);
        }
      });
    }
  }

}
