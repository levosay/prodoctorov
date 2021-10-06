const app = document.querySelector('#app')
const swap = document.querySelector('#swap')
const catalog = document.querySelector('#catalog')
const inductee = document.querySelector('#inductee')
const photo = document.querySelector('.photo-wrapper')
const linkUsers = 'https://json.medrating.org/users/'
const linkAlbum = 'https://json.medrating.org/albums?userId='
const linkPhoto = 'https://json.medrating.org/photos?albumId='

// Обработчик на создание/удаление списков
app.addEventListener('click', event => {
  let element = event.target
  let elemAlbum = element.querySelector('.list__album')
  let elemPhoto = element.querySelector('.photo-wrapper')
  let elemClass = element.className
  let id = element.getAttribute('data-id')

//Запрос для альбомов
  if (elemClass === 'list__user' && !elemAlbum) getData(linkAlbum, id, element)
//Запрос для фото
  if (elemClass === 'list__album' && !elemPhoto) getData(linkPhoto, id, element)

// Запись и уделание избранного в localstorage
//   if (elemClass === 'photo') {
//
//   }
  if (elemClass === 'star-favorite') {
    let parentElement = event.target.parentElement
    let photo = parentElement.querySelector('.photo')
    let id = photo.getAttribute('data-id')
    let url = photo.getAttribute('src')
    let title = photo.getAttribute('alt')
    let arg = [url, title]

    if (!localStorage.getItem(`photo_${id}`)){
      localStorage.setItem(`photo_${id}`, JSON.stringify(arg))
      event.target.setAttribute('src', './img/star_active.png')
    } else {
      localStorage.removeItem(`photo_${id}`)
      event.target.setAttribute('src', './img/star_empty.png')
    }

  }
//Удаление
  clearElem(element)
})

// Обработчик для переключения: Каталог/Избранное
swap.addEventListener('click', e => {
  let idBtn = e.target.getAttribute('id')

  if (idBtn === 'catalog' && !catalog.classList.add('btn-active')) {
    catalog.classList.add('btn-active')
    inductee.classList.remove('btn-active')
    app.innerHTML = ''
    app.append(ul)
  }

  if (idBtn === 'inductee' && !inductee.classList.add('btn-active')) {
    inductee.classList.add('btn-active')
    catalog.classList.remove('btn-active')

    showInductee()
  }
})

const changeInducteeIcon = (elem) => {
  elem.setAttribute('src', 'star_active.png')
}

// Получение всех данных из localStorage
const getAllStorage = () => {
  let values = [],
      keys = Object.keys(localStorage),
      i = keys.length;
  while ( i-- ) {
    values.push( JSON.parse(localStorage.getItem(keys[i])) );
  }
  return values;
}

// Создание спика Избранного
const showInductee = () => {
  let allStorage = getAllStorage()
  let div = document.createElement('div')
  app.innerHTML = ''

  allStorage.forEach(arr => {
    let img = document.createElement('img')
    img.classList.add('photo')
    img.src = arr[0]
    img.alt = arr[1]
    div.classList.add('inductee__photo')
    div.append(img)
    app.append(div)
  })
}

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
    let starImg = document.createElement('img')
    starImg.classList.add('star-favorite')
    starImg.alt = 'star'

    // Если событие на list__album
    if (element.thumbnailUrl) {
      starImg.src = localStorage.getItem(`photo_${element.id}`)
        ?
        './img/star_active.png'
        :
        './img/star_empty.png'
      ul.classList.remove('list')
      ul.classList.add('list-photo-wrapp')
      let img = document.createElement('img')
      img.classList.add('photo')
      img.src = element.thumbnailUrl
      img.alt = element.title
      img.setAttribute('data-id', element.id)
      li.classList.add('photo-wrapper')
      li.append(img)
      li.append(starImg)
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
  if (element.querySelector('.list-photo-wrapp')) {
    element.querySelector('.list-photo-wrapp').remove()
  }
  element.querySelectorAll('.list')
    .forEach(elem => elem.remove())
}






