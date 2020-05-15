import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  preguntas = [
    {
      pregunta: '¿Cómo se realiza una compra?',
      respuesta: `Comprar en SoftPet es fácil, sencillo y seguro. Puedes realizar tus compras las 24 horas del día, los 7 días de la semana a través de nuestra página web, estaremos para ti de lunes a viernes entre las 9:00 a.m. y las 6:00 p.m.
      Para comprar a través de la página web, busca el producto que deseas, selecciónalo y haz clic en el icono del carrito o añadir carrito. Una vez en tu carrito, introduce la cantidad que quieras; puedes finalizar la compra en este momento o marcar el botón Seguir comprando.  
      Cuando tengas en tu carrito toda la orden, haz clic en Finalizar compra. Introduce tus datos personales y el método de pago que prefieras. Si tienes algún código de promoción o descuento, insértalo al inicio de esta sección. 
      Una vez realizada la compra, ¡ya está todo listo para que recibas el pedido en tu domicilio durante los días siguientes!`,
      id: 'uno', 
      seccion: 1
    },
    {
      pregunta: 'Disponibilidad de Productos',
      respuesta: `En SoftPet trabajamos para que los productos estén siempre en nuestros almacenes y los puedas recibir lo antes posible. Aún así, en los extraordinarios casos en los que no tengamos un producto en el almacén, te lo haremos saber inmediatamente y procederemos a cancelar la compra sin ningún coste para ti.`,
      id: 'dos',
      seccion: 1
    },
    {
      pregunta: 'No encuentro el producto que estoy buscando ',
      respuesta: `¿Buscaste el producto en el buscador y aun así no lo has encontrado? Si este es el caso, por favor escríbenos a softpet.store@gmail.com con el nombre y la marca del producto que necesitas. Con esta información, iremos alimentando nuestro catálogo y por ende, te serviremos cada vez mejor. `,
      id: 'tres',
      seccion: 1
    },
    {
      pregunta: '¿Cómo creo una cuenta? ',
      respuesta: `Es muy sencillo crear una cuenta en Softpet, en la barra de navegación en “Mi Cuenta” se despliega la opción de “Registrarse” da clic en ella. Llena los campos que se te piden, da clic en “Registrarse” y ¡listo! en breve recibirás un correo con un boton para activar tu cuenta, ¡ahora podrás iniciar sesión y ver tu perfil!
      Si ya eres usuario, en la página de inicio de sesión ingresa tu correo y contraseña para tener acceso a tu cuenta y poder hacer tus compras como las veces anteriores. `,
      id: 'cuatro',
      seccion: 2
    },
    {
      pregunta: '¿Cómo edito mis direcciones de envío y facturación? ',
      respuesta: `Inicia sesión en tu cuenta, en el menú lateral que dice ajustes, da clic en ella y se muestran los campos a editar de tu dirección. Una vez en la página de edición de dirección actualiza tus datos y da clic en “Editar”. `, 
      id: 'cinco',
      seccion: 2
    },
    {
      pregunta: '¿Qué plataformas de pago utiliza SoftPet? ',
      respuesta: `En SoftPet utilizamos ciertas plataformas de pago en línea. Es importante señalar que, en ninguno de los casos, SoftPet recibe los datos bancarios o de tarjetas de crédito/débito de sus usuarios, asegurando aún más su protección. `, 
      id: 'seis',
      seccion: 3
    },
  ]

  secciones = [
    {
      seccion: '¿Cómo comprar en SoftPet?',
      id: 1
    },
    {
      seccion: '¿Cómo usar tu cuenta?',
      id: 2
    },
    {
      seccion: 'Pagos',
      id: 3
    }
  ]

}
