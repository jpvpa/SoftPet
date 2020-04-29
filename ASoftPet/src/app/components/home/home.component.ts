import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  productos = [
    {
      name: 'Producto 1',
      img: '../../../assets/images/producto1.jpg',
      description: 'Esta es una descripcion 1'
    },
    {
      name: 'Producto 2',
      img: '../../../assets/images/producto1.jpg',
      description: 'Esta es una descripcion 2'
    },
    {
      name: 'Producto 3',
      img: '../../../assets/images/producto1.jpg',
      description: 'Esta es una descripcion 3'
    },
    {
      name: 'Producto 4',
      img: '../../../assets/images/producto1.jpg',
      description: 'Esta es una descripcion 4'
    }
    ,
    {
      name: 'Producto 5',
      img: '../../../assets/images/producto1.jpg',
      description: 'Esta es una descripcion 5'
    },
    {
      name: 'Producto 6',
      img: '../../../assets/images/producto1.jpg',
      description: 'Esta es una descripcion 6'
    },
    {
      name: 'Producto 7',
      img: '../../../assets/images/producto1.jpg',
      description: 'Esta es una descripcion 7'
    },
    {
      name: 'Producto 8',
      img: '../../../assets/images/producto1.jpg',
      description: 'Esta es una descripcion 8'
    }
  ]
 
  valores = [
    {
      titulo: 'Misión',
      subtitle: 'SoftPet',
      description: 'Esta es la mision blablabla',
      color: 'primary',
      img: '../../../assets/images/mision.png'
    },
    {
      titulo: 'Visión',
      subtitle: 'SoftPet',
      description: 'Esta es la vision blablabla',
      color: 'success',
      img: '../../../assets/images/vision.png'
    },
    {
      titulo: 'Valores',
      subtitle: 'SoftPet',
      description: 'Estos son los valores blablabla',
      color: 'danger',
      img: '../../../assets/images/diamante.png'
    },
  ]

}
