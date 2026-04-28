# SportLife

Mini tienda virtual desarrollada para la actividad práctica sumativa de la semana 6 de Taller de Plataformas Web.

## Descripción general

Este proyecto simula una tienda online llamada **SportLife**, enfocada en productos deportivos. La aplicación permite:

- visualizar productos deportivos
- agregar productos al carrito
- mantener el carrito activo durante la navegación usando **Session Storage**
- iniciar y cerrar sesión con **Auth0**
- completar un formulario de pago y despacho
- mostrar una confirmación final de compra

## Tecnologías usadas

- HTML
- CSS
- JavaScript
- Auth0
- Session Storage

## Flujo de autenticación con Auth0

Para la autenticación se utilizó **Auth0**, configurando una aplicación del tipo **Single Page Application**.

El flujo funciona así:

1. El usuario hace clic en el botón **Iniciar sesión**.
2. La aplicación redirige al login de Auth0.
3. El usuario ingresa sus credenciales.
4. Auth0 valida el acceso y redirige nuevamente a la tienda.
5. Una vez autenticado, la página muestra un mensaje de bienvenida con el nombre del usuario.
6. Al cerrar sesión, la aplicación vuelve al estado inicial.

En esta actividad no se manejaron manualmente tokens JWT, ya que la autenticación fue delegada al SDK cliente de Auth0.

## Proceso de selección de productos

La tienda muestra tres productos de distintas categorías:

- camiseta deportiva
- pantalón deportivo
- accesorio deportivo

Cada producto incluye:

- imagen
- nombre
- descripción
- precio
- botón **Agregar al carrito**

Cuando el usuario pulsa ese botón, el producto se agrega al carrito. Si vuelve a agregar el mismo producto, aumenta la cantidad seleccionada. El carrito muestra:

- nombre del producto
- precio
- cantidad
- subtotal
- total de la compra

## Uso de Session Storage

Se utilizó **Session Storage** para guardar temporalmente los productos seleccionados en el carrito.

Esto permite que:

- el carrito siga visible aunque la página se recargue
- los productos se mantengan mientras la sesión del navegador siga activa

Los datos almacenados en `sessionStorage` se eliminan en dos casos:

- cuando el usuario finaliza la compra
- cuando el usuario cierra sesión

De esta forma, la sesión del carrito se mantiene durante la navegación, pero no queda guardada de forma permanente.

## Formulario de pago y despacho

La aplicación incluye un formulario con los siguientes campos:

- nombre completo
- dirección de envío
- correo electrónico
- teléfono

Se agregaron validaciones simples para comprobar:

- que todos los campos estén completos
- que el correo tenga formato válido
- que el teléfono contenga solo números y una longitud razonable

Después de completar correctamente el formulario, la aplicación muestra una confirmación con los datos del pedido y el total pagado.

## Estructura del proyecto

SportLife/
- index.html
- style.css
- app.js
- README.md
- img/

## Autor

Pablo Gutiérrez