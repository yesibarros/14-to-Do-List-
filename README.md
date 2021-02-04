# ToDo List

## Introducción

### Overview

Hasta ahora hemos estado creando servidores que reciben requests y envían archivos HTML dinámicos usando `nunjucks`. Pero es momento de hacer las cosas mas interesantes!

Vamos a hacer una Single Page Application de una ToDo List. Esta lista va a permitir al usuario agregar, editar y eliminar ítems de una lista de quehaceres.

Para este proyecto vamos a entregarte un punto de arranque en el cual vas a tener toda la vista dibujada pero sin ningún comportamiento dinámico, todo el comportamiento lo vamos a hacer con JQuery. 

Ademas la app viene con un RESTful API donde todos los endpoints para agregar editar y ver los ítems ya están creados. 

### Single Page Application

Las [Single Page Applications (SPAs)](https://en.wikipedia.org/wiki/Single-page_application), como lo dice su nombre en ingles son Aplicaciones Web que renderizan solo un archivo HTML y esta página dinámicamente va actualizando su vista dependiendo lo que hace el usuario. Los SPAs usan pedidos AJAX para comunicarse con una Web API para crear la fluidez de cambiar la información que se muestra en tu Web App sin constantemente refrescar la página.

Una [Web API](https://en.wikipedia.org/wiki/Web_API) es una interfaz de programación de aplicaciones que consiste en uno o mas HTTP endpoints, que responden típicamente con un JSON o XML. De esta manera los pedidos AJAX de nuestro cliente envían o piden información al servidor, y el servidor le devuelve respuestas que pueden ser luego utilizadas por nuestro código.

## Empezando ToDo List

### Setup

Lo primero que vamos a hacer es forkear y clonar este repo. Una vez descargado, corre `npm install` y luego `npm start`. Vas a ver que tenemos mucha ya hecho en los archivos. Podés recorrer los archivos para tener una noción de lo que ya vino preparado.

#### Models

En los modelos podemos ver que solo tenemos uno, `Item`, el cual va a tener un título, y un booleano de si esa tarea esta completada.

#### Routes

En el `index.js` dentro de rutas vas a ver que estamos sirviendo en la ruta ` GET /` un archivo estático `index.html` y después en `/api`, vamos a servir nuestras rutas de `api.js`.

En `api.js` vemos que tenemos cuatro rutas definidas que nos van a hacer muy útiles. 
1. `GET /items`: Nos trae un arreglo de todos los ítems.
2. `POST /items`: Crea un nuevo ítem con lo que haya enviado en `req.body` y lo envía. No te preocupes que no pongamos `isCompleted`, recuerda que en nuestro modelo le pusimos un valor `false` por defecto.
3. `PUT /items/:id`: Editá un ítem buscándolo a partir de su `id`. Esta ruta la vamos a usar únicamente para togglear la propiedad `isCompleted`. 
4. `DELETE /items/:id`: Elimina el item buscándolo por su id.



### index.html

Ahora si, una vez que hayas visto un poco los archivos, veamos que tenemos hecho en `index.html`. Pero antes de ver el archivo en si, entremos a [http://localhost:3000/](http://localhost:3000). 

Podés ver que tenemos una pseudo-lista hard-codeada para que tengas un diseño de la vista que vas a podes usar, la idea es que esta lista cargue dinámicamente cuando le solicitamos al servidor todos los items guardados en la base de datos, por lo que pronto borraremos estos placeholders.

Si vemos en index.html vemos que tenemos el style de Bootstrap y de nuestro stylesheet enlazados. Más adelante vemos nuestro container con la lista. Y al final vemos el script de JQuery, Bootstrap y el nuestro en el cual vamos a escribir todo nuestro código.


### Entrando en Calor con JQuery

Bueno basta de presentaciones escribamos nuestras primeras lineas de código. Recomendamos empezar a escribir en el archivo `/public/scripts/todo_list.js`, pero sentite libre de escribir código en distintos scripts si querés modularizar tu código, recuerda que vas a tener que agregar cada script en `index.html`. 

Empecemos con algo fácil. Antes de meternos en el mundo de pedidos AJAX y asincronicidad, hagamos una tarea simple para recordar los selectores de JQuery y manejar eventos. El botón de flechas `#toggle` a la derecha del título en este momento no hace nada. Tu tarea es darle funcionalidad! **Haz que el botón oculte o muestre la lista cuando es clickeado**.

Si no te acuerdas mucho de JQuery, puedes entrar a [esta página](https://oscarotero.com/jquery/) para buscar rápidamente una referencia de todos los métodos que obtenemos con la magia de `$`. Ohh! Oscar Otero, como te queremos! Vas a tener que **seleccionar** `#toggle`, **crear un evento de click** para él, que **alterne la vista de la lista** dependiendo si se esta mostrando o no.


+++Seleccionando un elemento
```js
$('#toggle')
```
+++

+++Agregando un evento
```js
$('#toggle').click(() => {

});
```
+++


+++Mostrando u ocultando un evento
```js
$('ul').toggle(); // Si, así de simple.
```
+++

## Pidiendo la Lista

### Creando una lista

Va a ser difícil ver si nuestra lista funciona si no tenemos nada en nuestra base de datos. Así que lo primero que vamos a querer hacer es agregar items a nuestra base de datos todo_list. Normalmente primero tendríamos que crear la base de datos en nuestro Postgres e ir a crear los modelos, pero todo eso ya esta hecho. Te estarás preguntando, ¿cuándo creamos la base de datos? Si te fijás en el `package.json`, dentro de nuestros scripts vas a ver un `postinstall`. Este script como dice su nombre se ejecuta automáticamente luego de correr `npm install`. Lo que hicimos acá es cuando instalamos nuestras dependencias ya crear la db `todo_list`.

Ahora que ya sabemos como hicimos la base de datos, creemos un archivo seed el cual nos va a permitir agregar Items a nuestra lista. Crea un archivo `seed.js` e importa nuestro modelo `Item`. Luego usando el método [`bulkCreate`](http://docs.sequelizejs.com/manual/tutorial/instances.html#working-in-bulk-creating-updating-and-destroying-multiple-rows-at-once-) crea por lo menos tres items con un `title`. Una vez que hayas terminado con eso ejecutá el archivo usando `node seed.js`.

Para probar que nuestro archivo funcionó correctamente podemos ir a Postico y ver si están, o probar que nos devuelve la ruta [http://localhost:3000/api/items](http://localhost:3000/api/items) en Chrome o en Postman.

+++Usando `bulkCreate`
```js
Item.bulkCreate([
    { title: 'Comprar Pan' },
    { title: 'Lavar al Perro' },
    { title: 'Sacar entradas para el Cine' },
]);
```
+++

### Haciendo un Pedido AJAX 

Ahora sí. Llego el momento de traer todos nuestros items. Aquí es donde JQuery con sus AJAX requests entra en acción. Para hacer un pedido GET vamos a usar el método `$.get()`. Como estamos haciendo un pedido a nuestro servidor, esta función va a ser asincrónica, y por lo tanto JQuery va a utilizar promesas para que podamos usar la respuesta. Por ejemplo funcionaría así:

```js
$.get('/myURL')
    .then(data => doSomething(data))
```

Ahora intenta hacer un `GET /api/items` y loguear en la consola la respuesta.

+++Solución
```js
$.get('/api/items')
    .then((data) => {
        console.log(data)
    })
```
+++


### Agregándolo al DOM

Buenísimo! Ya estamos trayendo un arreglo con todos nuestros items, es momento de mostrarlos en nuestro ToDo List. Lo primero va a ser borrar nuestros placeholders de la lista, pero quedate con uno de referencia para saber como es la vista con la cual tienes que anexar al item.

Ahora simplemente recorré el arreglo y agregalos uno por uno a nuestro DOM, quizás un método como [`.append()`](http://api.jquery.com/append/) te venga bien para esto.

Ahora cada vez que recargues la página deberían cargarse los elementos de la base de datos. 

+++Solución
```js
$.get('/api/items')
    .then((items) => {
        items.forEach((item) => {
            const $li = $('<li>').text(item.title);
            $li.append('<span><i class="fa fa-trash"></i></span>');
            $('ul').append($li);
        });
    })
```
+++


## Agregando un Item a la Lista

### Escuchando por un keypress

Lo que queremos hacer ahora es que cuando el usuario escriba un nuevo item en la lista y apriete el botón Enter agregaremos lo que escribió a nuestra base de datos y de ahí lo mostraremos en la lista actualizada. Pero primero antes de complicarnos con el servidor, intentemos agregar un nuevo elemento en la lista directamente sin guardarlo en nuestra base de datos.


Lo primero que tenemos que hacer es poner un listener en el input para cuando alguien presiona una tecla. Una vez que configuramos eso, vamos a fijarnos si la tecla que presionó (`keyCode`) fue un [enter](http://keycode.info/). Una vez que logramos eso simplemente agregamos el valor del input a la lista.


+++Agregando un nuevo ítem a la lista
```js
$('input').keypress(function addNewItem(e){ 
    if(e.keyCode === 13) {
        const title = $(this).val()
        const $li = $('<li>').text(title);
        $li.append('<span><i class="fa fa-trash"></i></span>');
        $('ul').append($li);
    }
});

```
+++

Ahora, si no lo hiciste aún, te estarás dando cuenta que la acción de agregar un item a la lista, y agregar a todos los items cuando cargamos la página es exactamente la misma excepto por algunos detalles. Esto no es para nada DRY. Imaginemos que queremos cambiar como se ve el elemento de la lista, tendríamos que ir a todos los lugares que lo hacemos y estar seguros que se sigue viendo igual en todos ellos, sería mucho mejor tener un solo lugar donde controlamos la vista de el elemento de la lista. Abstraigamos la acción de agregar un item a la lista a una función. Y ejecutemos esa función en ambos lados

+++Solución con función addItemToList
```js
function addItemToList(title) {
  const $li = $('<li>').text(title);
  $li.append('<span><i class="fa fa-trash"></i></span>');
  $('ul').append($li);
}

$.get('/api/items')
  .then((items) => {
      items.forEach((item) => {
        addItemToList(item.title);
      });
  });

$('input').keypress(function addNewItem(e) {
  if (e.keyCode === 13) {
    const title = $(this).val();
    addItemToList(title);
  }
});

```
+++

Finalmente, te darás cuenta que cuando apretamos enter seguimos viendo el valor del input, uno esperaría que una vez que agregó el item a la lista este se limpie, arregla este bug.


+++Borrando el valor del input
```js
$('input').val('');
```
+++


### Persistiendo el nuevo Item

Genial! Ya tenemos un input el cual agrega nuevos elementos a nuestra lista. Pero el problema ahora es que cuando refrescamos la página estos elementos se borran. Lo que tenemos que hacer ahora es enviar un `POST /api/items` con la información de nuestro nuevo item, este se va a encargar de crearlo y enviarnos el nuevo item que hayamos creado, una vez que esto funcionó correctamente vamos a agregar el item a la lista. 

Para hacer esto utilizaremos el método `$.post()`. También es una promesa. Así que recuerda primero crearemos el elemento en la base de datos y una vez que recibimos la confirmación del servidor, vamos a agregarlo a nuestra vista.

Como el método `POST` envía un `body` con información de lo que queremos enviar al servidor, esto se pasa como segundo argumento después de la ruta. Un ejemplo de como lo utilizaríamos sería lo siguiente:

```js
$.post('/users', { username: 'Guille' })
    .then((newUser) => {
        console.log(newUser.username) // 'Guille'
    });
```

Ahora intenta por tu cuenta agregar un nuevo elemento a nuestra base de datos y luego agregarlo a nuestra vista. Si todo sale bien deberías poder agregar un nuevo elemento refrescar la página y ver que sigue ahí.


+++Solución
```js
$('input').keypress(function addNewItem(e) {
  if (e.keyCode === 13) {
    const title = $(this).val();
    $.post('/api/items', { title }) // Es lo mismo que { title: title }
      .then((item) => {
        addItemToList(item.title);
        $(this).val('');
      });
  }
});
```
+++

## Completando un ToDo

### Nuestro Objetivo

Si te fijaste en nuestros primeros placeholders uno de los items tenía la clase `.completed` puesta en el `<li>`. Si te fijás en nuestra hoja de estilo podes ver que esta clase esta definida para darle un color gris a la letra y tacharla. La idea es que cuando clickeamos una tarea, esta se tache, y si la volvemos a clickear esta se destache. 

También no nos tenemos que olvidar de enviar al servidor la nueva información, para que ajuste la propiedad `isCompleted` del item en la base de datos y esta persista. Por lo cual cuando refresquemos nuestra página los items completados tienen que aparecer como tal. Vamos a tener que agregar mucho código pero también cambiar código ya escrito. Así que mantengamos la calma y vayamos paso a paso.


### Creando la Referencia al Item

La lógica de este feature funcionaría de la siguiente manera:

1. Clickeamos el item con id `1` que queremos completar
2. Este envía un pedido `PUT` a `/api/items/1`.
3. En el body del pedido enviamos { isCompleted: true }
4. Cuando recibimos el ok del servidor le agregamos la clase `.completed` al elemento del DOM.

El primer problema que podemos ver acá es que no tenemos una referencia al id del elemento en la base de datos. No tenemos ahora ninguna forma de saber cual era el id del item el cual estamos clickeando. Vamos a aprovechar el hecho de que los elementos html pueden tener id únicos.

Modifiquemos la función `addItemtoList` para que en vez de tomar un `title` tome un objeto `item` y dale el `id` como `#id` del elemento. No te olvides de refactorear todos los lugares donde usamos la función para que ya no pasen solo el título pero sino que pasen todo el item. 


+++Nuevo addItemToList
```js
function addItemToList(item) {
  const $li = $(`<li id="${item.id}">`).text(item.title);
  $li.append('<span><i class="fa fa-trash"></i></span>');
  $('ul').append($li);
}
```
+++

### Agregando el click handler

Si vemos la ruta `PUT /api/items/:id`, vamos a ver que lo que tenemos que enviar es un objeto que tenga las propiedades que queremos cambiar. En este caso, `isCompleted`. Entonces lo que queremos hacer ahora es lo siguiente:

1. Agregar un click handler al elemento de la lista
2. Tomar el valor del `id` del item clickeado
3. y hacer un `PUT` request enviando un objeto con la propiedad `isCompleted` con el valor `true` (Por ahora solo preocupémonos en tacharlo, después agregaremos la funcionalidad de des-tacharlo).

Entonces empecemos por el  primer y segundo paso, agrega un click handler al elemento de la lista y loguea en la consola el id del elemento. Recordá que para extraer el valor del id podes usar el método `.attr('id')`. Suena bastante fácil ¿no?, pero seguramente tu primer intento no funcione. Intentá pensar por tu cuenta porque puede estar pasando esto, investigá las razones y como poder solucionarlo. Si estas muy perdido mirá la siguiente pista:  

+++Arreglando el click handler
El problema es más simple de lo que parece. Cuando nosotros creamos los listeners todavía no tenemos ningún `li`, esto se debe a que todavía nuestro servidor esta yendo a buscar los ítems, y cuando estos son agregados, la función que creaba los listeners ya termino hace rato.

Para solucionar este problema JQuery tiene una opción bastante astuta. En vez de utilizar `.click()`, vamos a usar `.on('click')`. La diferencia va a ser que vamos a agregar el listener a un elemento que ya existe en nuestro DOM como lo es el `ul` y vamos a pasar un segundo argumento luego del `'click'` que va significar a que elementos dentro del que habíamos seleccionado queremos realmente oír. El resultado final se verá algo así.

```js
$('ul').on('click', 'li', function completed() {
  const id = $(this).attr('id');
  console.log(id);
});
```
+++

### Modificando la Base de Datos

Ahora si, a ponerse las pilas. Sin mucha vuelta dentro del click handler agrega un un `PUT` request al servidor usando `$.ajax()`. (No existe `$.put()`)
El método `.ajax` es un poco mas complejo. Este va a tomar un objeto en el cual le tenemos que pasar el `url`, la `data` que queremos mandar  y el `method` que queremos usar (i.e: `GET`, `POST`, `PUT`, `DELETE`). No te olvides de enviar un objeto con la propiedad `isCompleted` en true. 

Aquí un ejemplo de como se utilizaría el metodo `$.ajax`: 

```js
$.ajax({
    url: '/users',
    data: { username: 'Toni'},
    method: 'POST',  
})
```

Al igual que los otros métodos este devuelve una promesa que por ahora no vamos a hacer nada con su resolución. Si quieres para probar que una respuesta esta llegando hace un `console.log` con un 'ok'.

Por ahora hagamos solo eso, no nos preocupemos en mostrarlo en la vista, si querés comprobar que el valor se modificó en la base de datos, simplemente buscalo en Postico, o en Chrome o Postman hace un pedido por todos los items y fijate si el que clickeamos cambió.

+++Solución
```js
$('ul').on('click', 'li', function completed() {
  const id = $(this).attr('id');
  $.ajax({
    url: `/api/items/${id}`,
    method: 'PUT',
    data: { isCompleted: true },
  })
    .then(() => console.log('ok'));
});
```
+++ 

### Mostrando un Item Completado

Ya estamos modificando el item de la lista, en la base de datos ahora solo falta mostrarlo en la página. Lo que vamos a hacer es en el callback, una vez que recibimos la confirmación del servidor, agregarle la clase `.completed`.

Esto no debería ser muy difícil, solo hay que usar el método `addClass` sobre el elemento del DOM que queremos modificar, y si todo sale bien deberías ver la diferencia en la vista.

#### Cargar los items correctamente

Ahora seguramente notaste que cuando recargamos la página las tachaduras desaparecen, esto es porque cuando cargamos los elementos no nos estamos fijando si estos están completados o no. Agregá a la función `addItemtoList` la posibilidad de agregar la clase `.completed` si el elemento tiene su propiedad `isCompleted` en true. Esto no debería ser mas complicado que agregar un declaración `if` en tu función. 

### Togglear isCompleted

Buenísimo, ahora cuando clickeamos nuestros items estos se tachan, y cuando refrescamos la página estos siguen tachados, pero no nos olvidemos de otra parte de la funcionalidad. Que estos se des-tachen cuando los volvemos a clickear. Podés utilizar lo que ya hicimos para saber si tenes que enviar `true` o `false` al servidor, y después asegurate de cambiar la clase correctamente. 

Buscá entre los métodos de JQuery para manejar las clases para resolver este problema. Realmente esto se puede hacer de muchas maneras distintas, recomendamos que intentes la tuya y una vez que funciona te fijes en la nuestra, que es la siguiente:

+++Como hacer un toggle de `.completed`
```js
$('ul').on('click', 'li', function toggleComplete() {
  const id = $(this).attr('id');
  const completed = $(this).hasClass('completed');
  $.ajax({
    url: `/api/items/${id}`,
    method: 'PUT',
    data: { isCompleted: !completed },
  })
    .then(() => {
      $(this).toggleClass('completed');
    });
});
```
+++

## Borrar un Ítem

### Cosas a Tener en Cuenta

Bueno ya tuvimos demasiada practica para poder eliminar un item sin mucha ayuda. Todo con lo que te podes enfrentar para eliminar ya vimos como solucionarlo en pasos anteriores, seguramente vas a necesitar de igual manera utilizar métodos que no hayamos visto todavía, pero no deberían ser muy difíciles de encontrar. Cosas a tener en cuenta:

1. Recordá que los botones para eliminar no van a existir cuando crees los listeners
2. Recuerda que vas a necesitar una referencia al elemento, pero también recuerda que no podés agregarle el id también al botón, porque dos elementos no pueden tener el mismo id. Así que hay dos approach posibles, le agregas otro tipo de data al elemento, o buscas el id de su pariente.
3. Vas a necesitar hacer un pedido AJAX con el metodo `DELETE`. 
4. Una vez que lo elimines de la base de datos, vas a tener que eliminar el elemento del DOM, este método no va a ser difícil de encontrar en el cheatsheet de JQuery.

+++Los botones no van a existir
```js
$('ul').on('click', 'span', function deleteItem() {
 
});
```
+++

+++Referencia al elemento
```js
const $item = $(this).parent();
```
+++

+++`DELETE` request
```js
$.ajax({
  url: `/api/items/${id}`,
  method: 'DELETE',
})
```
+++

+++Eliminar un elemento
```js
$item.remove();
```
+++



+++Solución final
```js
$('ul').on('click', 'span', function deleteItem() {
  const $item = $(this).parent();
  const id = $item.attr('id');
  $.ajax({
    url: `/api/items/${id}`,
    method: 'DELETE',
  })
    .then(() => {
      $item.remove();
    });
});
```
+++


## Bonus

### Pequeño bug

Cuando cambiamos la propiedad `.isCompleted` de un elemento podemos ver que cuando refrescamos la página el orden de los elementos cambió. Eso es porque Sequelize los esta ordenando por fecha de modificación. Cambiemos nuestra función que agrega todos los elementos cuando llegan para que antes de recorrerlos los ordene en orden de creación. ¿Como saber el orden de creación?
Sequelize automáticamente crea la propiedad `createdAt`, podemos usar esa propiedad y el Array method [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) para solucionar este problema.



