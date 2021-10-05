const app = document.querySelector('#app')

// https://json.medrating.org/users/
// https://json.medrating.org/albums?userId=3
// https://json.medrating.org/photos?albumId=2

app.addEventListener('click', event => {
  let element = event.target
  let elemAlbum = element.querySelector('.list__album')
  let elemPhoto = element.querySelector('.list__photo')
  let elemClass = element.className
  let userId = element.getAttribute('data-id')

  if (elemClass === 'list__user' && !elemAlbum)
    getData
    (userId, element, 'album', 'https://json.medrating.org/albums?userId=')

  if (elemClass === 'list__album' && !elemPhoto)
    getData
    (userId, element, 'photo', 'https://json.medrating.org/photos?albumId=')

  clearAlbums(element)
})

fetch('https://json.medrating.org/users/')
  .then((response) => response.json())
  .then((data) => data.forEach( element => {
    let userList = document.createElement('ul')
    let user = document.createElement('li')
    userList.classList.add('container', 'list')
    app.append(userList)
    user.setAttribute('data-id', element.id)
    user.classList.add('list__user')
    user.innerHTML = element.name
    userList.append(user)
  }))

const createElem = (inPoint, element, name) => {
  console.log(element)
  let ul = document.createElement('ul')
  let li = document.createElement('li')
  ul.classList.add('list')
  inPoint.append(ul)
  ul.append(li)
  li.setAttribute('data-id', element.id)
  li.classList.add(`list__${name}`)
  element.url
    ?
    li.innerHTML = `<img src=${element.url} alt=${element.title} class="list__photo">`
    :
    li.innerHTML = element.title
  ul.append(li)
}

const clearAlbums = (element) => {
  let userAlbums = element.querySelectorAll('.list')
  userAlbums.forEach(elem => elem.remove())
}

const getData = (id, inPoint, name, url) => {
  fetch(`${url}${id}`)
    .then((response) => response.json())
    .then((data) => data.forEach( element => createElem(inPoint, element, name)))
}




