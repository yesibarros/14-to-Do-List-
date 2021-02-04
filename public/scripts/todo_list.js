/* globals $ */

$('#toggle').click(() => { // toggle is the arrow up and down
  $('ul').toggle(); // Si, así de simple.+ 
});

$.get('/api/items') //api returns all items
  .then(items => {
    items
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) //items sorted by createAt
      .forEach(addItemToList); //item properties: (id, title, isCompleted, createdAt, updatedAt)
});

function addItemToList(item) { //build de <li> in DOM with data from item
  //cuando tenemos en un selector un tag html, estamos diciendo a jquery crea este elemento
  const $li = $(`<li id="${item.id}">${item.title}</li>`); //building my <li>
  if (item.isCompleted) $li.addClass('completed');
  $li.append('<span><i class="fa fa-trash"></i></span>'); //add recicle bin
  $('ul').append($li);
}

// adding news todos
$('input').keypress(function addNewItem(evento) {
  if (evento.keyCode === 13) { // 13 === enter key
    const title = $(this).val(); //extracting value from the input
    $.post('/api/items', { title }) // Es lo mismo que { title: title }
      .then((item) => {
        addItemToList(item);
        $(this).val('');
      });
  }
});

// marked items as completed, taking the data from the DOM
$('ul').on('click', 'li', function toggleComplete() {
  const id = $(this).attr('id'); //$(this) is the selected li
  const completed = $(this).hasClass('completed');
  $.ajax({
    url: `/api/items/${id}`,
    method: 'PUT',
    data: { isCompleted: !completed }, //!completed is toggling the behaviour of completed
  })
    .then(() => $(this).toggleClass('completed'));
});

//deleting item from the list when click the recicle bin icon
$('ul').on('click', 'span', function deleteItem() {
  const $item = $(this).parent(); //parent takes the parent or container of the recicle icon, you guess, is the li!
  const id = $item.attr('id');
  $.ajax({
    url: `/api/items/${id}`,
    method: 'DELETE',
  })
    .then(() => {
      $item.remove(); //remove item from the dom
    });
});
  