import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comercio',
  templateUrl: './comercio.component.html',
  styles: []
})
export class ComercioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  guardarCampos( data ) {
    console.log( data );
  }

}
