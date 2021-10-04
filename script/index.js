const app = document.querySelector('#app')

// https://json.medrating.org/users/
// https://json.medrating.org/albums?userId=3
// https://json.medrating.org/photos?albumId=2

app.addEventListener('click', event => {
  let element = event.target
  let album = element.querySelector('.list__album')
  if (!album) {
    let userId = element.getAttribute('data-id')

    getAlbums(userId, element)
  }
  clearAlbums(element)
})


fetch('https://json.medrating.org/users/')
  .then((response) => response.json())
  .then((data) => data.forEach( element => {
    let userList = document.createElement('ul')
    userList.classList.add('container', 'list')
    app.append(userList)

    let user = document.createElement('li')
    user.setAttribute('data-id', element.id)
    user.classList.add('list__user')
    user.innerHTML = element.name
    userList.append(user)
  }))

const clearAlbums = (element) => {
  let userAlbums = element.querySelectorAll('.list__album')
  userAlbums.forEach(elem => elem.remove())
}

const getAlbums = (id, inPoint) => {
  fetch(`https://json.medrating.org/albums?userId=${id}`)
    .then((response) => response.json())
    .then((data) => data.forEach( element => {
      let albumsList = document.createElement('ul')
      albumsList.classList.add('list')
      inPoint.append(albumsList)
      let albums = document.createElement('li')
      albumsList.append(albums)
      //albums.setAttribute('data-id', element.id)
      albums.classList.add('list__album')
      albums.innerHTML = element.title
      albumsList.append(albums)
    }))
}




