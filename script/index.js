const app = document.querySelector('#app')
const container = document.querySelector('#container')
const swap = document.querySelector('#swap')
const modal = document.querySelector('#modal')
const catalog = document.querySelector('#catalog')
const inductee = document.querySelector('#inductee')
const photo = document.querySelector('.photo-wrapper')
const linkUsers = 'https://json.medrating.org/users/'
const linkAlbum = 'https://json.medrating..org/albums?userId='
const linkPhoto = 'https://json.medrating.org/photos?albumId='

// Обработчик на создание/удаление списков
app.addEventListener('click', event => {
  let element = event.target
  let parentElement = event.target.parentElement
  let list = element.querySelector('.list')
  let listParent = element.parentElement.querySelector('.list')
  let elemAlbum = element.querySelector('.list__album-span')
  let elemPhoto = element.querySelector('.photo-wrapper')
  let photoWrapp = element.querySelector('.list-photo-wrapp')
  let photoWrappParent = element.parentElement.querySelector('.list-photo-wrapp')
  let elemClass = element.className
  let id = element.getAttribute('data-id')
  let neighbor = element.nextElementSibling
  let errorImg = element.parentElement.querySelector('.error__img-user-wrapp')

  // Обработчик при нажаьте на иконку списка
  if (element.className === 'icon-list' && !errorImg) {
    let user = element.parentElement.querySelector('.list__user-span')
    let album = element.parentElement.querySelector('.list__album-span')
    let photo = element.parentElement.querySelector('.list-photo-wrapp')
    if (!album && user && !errorImg) {
      getData(linkAlbum, id, user)
      element.src = './img/close-list.svg'
    }

    if (album && !photo && !errorImg) {
      getData(linkPhoto, id, album)
      element.src = './img/close-list.svg'
    }
  }
  // Запрос для альбомов
  if (elemClass === 'list__user-span' && !elemAlbum && !errorImg) {
    getData(linkAlbum, id, element)
    let neighbor = element.parentElement.querySelector('.icon-list')
    neighbor.src = './img/close-list.svg'
  }
  // Запрос для фото
  if (elemClass === 'list__album-span' && !elemPhoto && !errorImg) {
    getData(linkPhoto, id, element)
    let neighbor = element.parentElement.querySelector('.icon-list')
    neighbor.src = './img/close-list.svg'
  }
  // Открытие фото в полный экран
  if (elemClass === 'photo') photoFullScreen(element)
  // Запись и уделание избранного в localstorage
  if (elemClass === 'star-favorite' && !errorImg) {
    let photo = parentElement.querySelector('.photo')
    let id = photo.getAttribute('data-id')
    let url = photo.getAttribute('src')
    let title = photo.getAttribute('alt')
    let urlTU = photo.getAttribute('data-url')
    let arg = [url, title, id, urlTU]

    if (!localStorage.getItem(`photo_${id}`)){
      localStorage.setItem(`photo_${id}`, JSON.stringify(arg))
      event.target.setAttribute('src', './img/star_active.png')
    } else {
      localStorage.removeItem(`photo_${id}`)
      event.target.setAttribute('src', './img/star_empty.png')
      if (event.target.parentElement.className === 'inductee-wrapp')
        showInductee()
    }
  }
  // Удаление и смена иконки списка
  if (element.className === 'icon-list' && listParent) {
    element.src = './img/open-list.svg'
    clearElem(element.parentElement)
  }
  if (element.className === 'icon-list' && photoWrappParent) {
    element.src = './img/open-list.svg'
    clearElem(element.parentElement)
  }
  if (element.className === 'list__user-span' && list) {
    neighbor.src = './img/open-list.svg'
    clearElem(element)
  }
  if (element.className === 'list__album-span' && photoWrapp) {
    neighbor.src = './img/open-list.svg'
    clearElem(element.parentElement)
  }
  if (errorImg) {
    element.parentElement.querySelector('.icon-list').src = './img/open-list.svg'
    clearElem(element)
  }

})

// Обработчик закрытия модального окна
modal.addEventListener('click', event => {
  let elementClassName = event.target.className
  if (elementClassName === 'close-modal' || elementClassName === 'overlay') {
    event.target.parentElement.remove()
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('position')
    document.body.style.removeProperty('height')
  }
})
// Обработчик для переключения: Каталог/Избранное
swap.addEventListener('click', event => {
  let idBtn = event.target.getAttribute('id')

  if (idBtn === 'catalog') {
    catalog.classList.add('btn-active')
    inductee.classList.remove('btn-active')
    app.innerHTML = ''
    createUserList()
  }

  if (idBtn === 'inductee') {
    inductee.classList.add('btn-active')
    catalog.classList.remove('btn-active')
    showInductee()
  }
})

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

//Создание списка пользователей
const createUserList = () => {
  let ul = document.createElement('ul')
  ul.classList.add('container', 'list')
  fetch(linkUsers)
    .then((response) => response.json())
    .then((data) => data.forEach( element => {
      let iconList = document.createElement('img')
      let span = document.createElement('span')
      let user = document.createElement('li')

      iconList.classList.add('icon-list')
      iconList.src = './img/open-list.svg'
      iconList.setAttribute('data-id', element.id)
      user.setAttribute('data-id', element.id)
      user.classList.add('list__user')
      span.classList.add('list__user-span')
      span.innerHTML = element.name
      span.setAttribute('data-id', element.id)
      user.append(span)
      user.append(iconList)
      ul.append(user)
    })).catch(err => { // Если данные не пришли
    //console.log(err)
    showErrorImg(app, 'error__img-wrapp')
  })
  app.append(ul)
}
createUserList()

// Получение данных по ссылке и отправка их на создание разметки
const getData = (url, id, inPoint) => {
  fetch(`${url}${id}`)
    .then((response) => response.json())
    .then((data) => createElem(data, inPoint))
    .catch(err => { // Если данные не пришли
      //console.log(err)
      showErrorImg(inPoint, 'error__img-user-wrapp')
    })
}

// Создание елементов и вставка их по inPoint
const createElem = (data, inPoint) => {
  let ul = document.createElement('ul')
  ul.classList.add('list')

  data.forEach(element => {
    let li = document.createElement('li')
    let img = document.createElement('img')
    let starImg = document.createElement('img')
    starImg.classList.add('star-favorite')
    starImg.alt = 'star'

    // Если событие на list__album-span
    if (element.thumbnailUrl) {
      starImg.src = localStorage.getItem(`photo_${element.id}`)
        ?
        './img/star_active.png'
        :
        './img/star_empty.png'
      ul.classList.remove('list')
      ul.classList.add('list-photo-wrapp')
      img.classList.add('photo')
      img.src = element.thumbnailUrl
      img.alt = element.title
      img.setAttribute('data-id', element.id)
      img.setAttribute('data-url', element.url)
      li.setAttribute('data-title', element.title)
      li.classList.add('photo-wrapper')
      li.append(img)
      li.append(starImg)
      ul.append(li)
      inPoint.append(ul)
    } else { // Если событие на list__user-span
      let iconList = document.createElement('img')
      let span = document.createElement('span')
      iconList.src = './img/open-list.svg'
      iconList.classList.add('icon-list')
      iconList.setAttribute('data-id', element.id)
      li.setAttribute('data-id', element.id)
      li.classList.add('list__album')
      span.classList.add('list__album-span')
      span.innerHTML = element.title
      span.setAttribute('data-id', element.id)
      li.append(span)
      li.append(iconList)
      ul.append(li)
      inPoint.append(ul)
    }
  })
}

// Создание списка Избранного
const showInductee = () => {
  let allStorage = getAllStorage()

  if (allStorage.length > 0) {
    let container = document.createElement('div')
    app.innerHTML = ''

    allStorage.forEach(arr => {

      let divWrapp = document.createElement('div')
      let img = document.createElement('img')
      let starImg = document.createElement('img')
      let description = document.createElement('p')
      container.classList.add('inductee')
      divWrapp.classList.add('inductee-wrapp')
      img.classList.add('photo')
      img.src = arr[0]
      img.alt = arr[1]
      img.setAttribute('data-id', `${arr[2]}`)
      img.setAttribute('data-url', `${arr[3]}`)
      starImg.classList.add('star-favorite')
      starImg.alt = 'star'
      starImg.src = './img/star_active.png'
      description.classList.add('description')
      description.innerHTML = `${arr[1]}`

      divWrapp.append(starImg)
      divWrapp.append(img)
      divWrapp.append(description)
      container.append(divWrapp)
      app.append(container)
    })
  } else {
    let divEmpty = document.createElement('div')
    let imgListEmpty = document.createElement('img')
    let titleEmpty = document.createElement('h3')
    let textEmpty = document.createElement('p')
    divEmpty.classList.add('empty')
    imgListEmpty.classList.add('empty__img')
    imgListEmpty.alt = 'Список Избранного пуст'
    imgListEmpty.src = './img/empty.png'
    titleEmpty.classList.add('empty__title')
    titleEmpty.innerHTML = 'Список избранного пуст'
    textEmpty.classList.add('empty__text')
    textEmpty.innerHTML = 'Добавляйте изображения, нажимая на звездочки'
    app.innerHTML = ''

    divEmpty.append(imgListEmpty)
    divEmpty.append(titleEmpty)
    divEmpty.append(textEmpty)
    app.append(divEmpty)
  }
}
// Создание фото в полный экран
const photoFullScreen = (element) => {
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'relative'
  document.body.style.height = '100vh'
  let backDiv = document.createElement('div')
  let bigImg = document.createElement('img')
  let closeImg = document.createElement('img')
  backDiv.classList.add('overlay')
  bigImg.classList.add('photo-fullscreen')
  bigImg.src = element.getAttribute('data-url')
  bigImg.alt = element.getAttribute('alt')
  closeImg.src = './img/close_modal.svg'
  closeImg.classList.add('close-modal')
  modal.innerHTML = ''

  modal.append(backDiv)
  modal.append(bigImg)
  modal.append(closeImg)
  container.append(modal)
}
// Создание лоадера
const showErrorImg = (inPoint = app, className) => {
  let divText = document.createElement('div')
  let imgLoader = document.createElement('img')
  let ulLoader = document.createElement('ul')
  let titleError = document.createElement('h3')
  let textError = document.createElement('p')
  imgLoader.classList.add('error__img')
  imgLoader.src = './img/error.png'
  ulLoader.classList.add(className)
  divText.classList.add('error__text-wrapp')
  titleError.classList.add('error__title')
  titleError.innerHTML = 'Сервер не отвечает'
  textError.classList.add('empty__text')
  textError.innerHTML = 'Уже работаем над этим'
  divText.append(titleError)
  divText.append(textError)
  ulLoader.append(imgLoader)
  ulLoader.append(divText)

  inPoint.append(ulLoader)
}
// Удаление елементов
const clearElem = (element) => {
  let errorAll = element.parentElement.querySelector('.error__img-user-wrapp')
  let errorUser = element.parentElement.querySelector('.error__img-user-wrapp')

  console.log(errorAll)
  console.log(errorUser)
  if (element.className === 'icon-list') {
    errorAll.remove()
    errorUser.remove()
  }
  if (element.className === 'list__album-span' && (errorAll || errorUser)) {
    errorAll.remove()
    errorUser.remove()
  }
  if (element.className === 'list__user-span' && (errorAll || errorUser)) {
    errorAll.remove()
    errorUser.remove()
  }
  if (element.querySelector('.list-photo-wrapp')) {
    element.querySelector('.list-photo-wrapp').remove()
  }
  if (element.querySelector('.list')) {
    element.querySelector('.list').remove()
  }
}




