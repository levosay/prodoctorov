const app = document.querySelector('#app')
const swap = document.querySelector('#swap')
const catalog = document.querySelector('#catalog')
const inductee = document.querySelector('#inductee')
const linkUsers = 'https://json.medrating.org/users/'
const linkAlbum = 'https://json.medrating.org/albums?userId='
const linkPhoto = 'https://json.medrating.org/photos?albumId='

// Обработчик на создание/удаление списков
app.addEventListener('click', event => {
  let element = event.target
  let elemAlbum = element.querySelector('.list__album')
  let elemPhoto = element.querySelector('.list__photo')
  let elemClass = element.className
  let id = element.getAttribute('data-id')

//Запрос для альбомов
  if (elemClass === 'list__user' && !elemAlbum) getData(linkAlbum, id, element)
//Запрос для фото
  if (elemClass === 'list__album' && !elemPhoto) getData(linkPhoto, id, element)
//Удаление
  clearElem(element)
})

// Обработчик для переключения: Каталог/Избранное
swap.addEventListener('click', e => {
  console.log(e.target.getAttribute('id'))
  console.log(e)
  let idBtn = e.target.getAttribute('id')
  if (idBtn === 'catalog' && !catalog.classList.add('active')) {
    catalog.classList.add('active')
    inductee.classList.remove('active')
  }

  if (idBtn === 'inductee' && !inductee.classList.add('active')) {
    inductee.classList.add('active')
    catalog.classList.remove('active')
  }
})

//Создание списка пользователей
let ul = document.createElement('ul')
ul.classList.add('container', 'list')
fetch(linkUsers)
  .then((response) => response.json())
  .then((data) => data.forEach( element => {
    let user = document.createElement('li')
    user.setAttribute('data-id', element.id)
    user.classList.add('list__user')
    user.innerHTML = element.name
    ul.append(user)
  }))
app.append(ul)


// Получение данных по ссылке и отправка их на создание разметки
const getData = (url, id, inPoint) => {
  fetch(`${url}${id}`)
    .then((response) => response.json())
    .then((data) => createElem(data, inPoint))
}

// Создание елементов и вставка их по inPoint
const createElem = (data, inPoint) => {
  let ul = document.createElement('ul')
  ul.classList.add('list')

  data.forEach(element => {
    let li = document.createElement('li')

    // Если событие на list__album
    if (element.url) {
      let img = document.createElement('img')
      img.classList.add('photo')
      img.src = element.url
      img.alt=element.title
      img.class='photo'
      li.classList.add('list__photo')
      li.append(img)
      ul.append(li)
      inPoint.append(ul)
    } else { // Если событие на list__user
      li.setAttribute('data-id', element.id)
      li.classList.add('list__album')
      li.innerHTML = element.title
      ul.append(li)
      inPoint.append(ul)
    }
  })
}

// Удаление елементов
const clearElem = (element) => {
  let userAlbums = element.querySelectorAll('.list')
  userAlbums.forEach(elem => elem.remove())
}






