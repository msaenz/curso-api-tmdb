let page = 0
let infiniteScroll
let maxPages = 1
let idCategory = 0
let captions

/* window.onstorage =  () => {
  console.log("Revisando Storage")
  getLikedMovies()
} */
//window.addEventListener('storage', () => {getLikedMovies()})

const  lang = document.getElementById('optionLanguages')
changeLanguage(navigator.language.substring(0,2))


window.addEventListener('languagechange', () => {
  changeLanguage(lang.value = navigator.language.substring(0,2))
  navigatorApp()
});

//data
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY,
  }
})

function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'))
  let movies

  if (item) {
    movies = item
  } else {
    movies = {}
  }
  return movies
}

function likeMovie(movie) {
  // movie.id
  const likedMovies = likedMoviesList()

  console.log(likedMovies)

  if (likedMovies[movie.id]){
    //removerla
    likedMovies[movie.id] = undefined
  } else {
    // adicionarla
    likedMovies[movie.id] = movie
  }

  localStorage.setItem('liked_movies',JSON.stringify(likedMovies))
  getLikedMovies()
}

// Utils
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute('data-img')
      entry.target.setAttribute('src',url)
    }
  })
})

function createMovies(movies, container, { lazyLoad = false, clean = true} = {}, ) {

  if (clean) {
    container.innerHTML = ''
  }

  movies.forEach(movie => {
    const movieContainer = document.createElement('div')
    movieContainer.classList.add('movie-container')

    const movieImg = document.createElement('img')
    movieImg.classList.add('movie-img')
    movieImg.setAttribute('alt', movie.title)
    movieImg.setAttribute(
      lazyLoad ? 'data-img' : 'src',
      `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    )
    movieImg.addEventListener('click', () => {
      location.hash = `#movie=${movie.id}`
    })

    movieImg.addEventListener('error', () =>{
      movieImg.setAttribute(
        'src',
        `https://static.platzi.com/static/images/error/img404.png`
      )
    })

    const movieBtn = document.createElement('button')
    movieBtn.classList.add('movie-btn')
    likedMoviesList()[movie.id] && movieBtn.classList.toggle('movie-btn-liked')
    movieBtn.addEventListener('click', () => {
      movieBtn.classList.toggle('movie-btn--liked')
      //enviar a local storage
      likeMovie(movie)
    })

    if (lazyLoad) {
      lazyLoader.observe(movieImg)
    }

    movieContainer.appendChild(movieImg)
    movieContainer.appendChild(movieBtn)
    container.appendChild(movieContainer)
  });

}

function createCategories(categories, container) {
  container.innerHTML = ''
  categories.forEach(category => {
    const categoryContainer = document.createElement('div')
    categoryContainer.classList.add('category-container')

    const categoryTitle = document.createElement('h3')
    categoryTitle.classList.add('category-title')

    categoryTitle.setAttribute('id', `id${category.id}`)
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`
    })
    const categoryTitleText = document.createTextNode(category.name)

    categoryTitle.appendChild(categoryTitleText)
    categoryContainer.appendChild(categoryTitle)
    container.appendChild(categoryContainer)
  });
}

// Llamados a la API
async function getTrendingMoviesPreview() {
  // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
  // const data = await res.json()
  // const movies = data.results
  const { data }= await api('trending/movie/day',{
    params: {
      language: lang.value
    }
  })
  const movies = data.results
  createMovies(movies, trendingMoviesPreviewList, true)

}

async function getCategoriesPreview() {
  const { data }= await api('genre/movie/list', {
    params: {
      language: lang.value
    }
  })
  const categories = data.genres

  createCategories(categories, categoriesPreviewList)
}

async function getMoviesByCategory() {
  /* const { data }= await api(`discover/movie`, {
    params: {
      with_genres: id,
    }
  })
 */
  console.log(`Entrando a categorias...${idCategory}, pagina ${page}, Maximo ${maxPages}`);
  const { scrollTop, scrollHeight, clientHeight} = document.documentElement
  const scrollIsBottom = scrollTop + scrollHeight >= clientHeight -15

  if (scrollIsBottom && page <= maxPages) {
    page ++
    const { data }= await api(`discover/movie`, {
      params: {
        with_genres: idCategory,
        page: page,
        language: lang.value
      }
    })
    const movies = data.results
    maxPages = data.total_pages
    console.log(`Categorias Paginas totales ${maxPages}, a buscar ${page} Categoria ${idCategory}`);
    //createMovies(movies, genericSection, )
    createMovies(movies, genericSection, {lazyLoad: true, clean: false})

  }
}

async function getMoviesBySearch(query) {
  if (query) {
    const { data } = await api(`search/movie`, {
      params: {
        query,
        page: 1,
        language: lang.value
      }
    })
    const movies = data.results
    maxPages = data.total_pages
    console.log(`maxPages${maxPages}`)
    createMovies(movies, genericSection, {lazyLoad: true, clean: true})
  }
}

async function getTrendingMovies() {
  // Usando Fetch
  // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
  // const data = await res.json()
  // const movies = data.results

  // Usando Axios
  const { data }= await api('trending/movie/day', {
    params: {
      language: lang.value
    }
  })
  const movies = data.results
  maxPages = data.total_pages

  createMovies(movies, genericSection, {lazyLoad: true, clean: true})

  /* const btnLoadMore =  document.createElement('button')
  btnLoadMore.innerText = "Cargar más"
  btnLoadMore.addEventListener('click', () => getTrendingMoviesPaginate())
  genericSection.appendChild(btnLoadMore) */
}

function getPaginatedMoviesBySearch(query) {
  return async function() {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement
    const scrollIsBottom = scrollTop + scrollHeight >= clientHeight -15

      if (scrollIsBottom && page <= maxPages) {
      page ++
      const { data }= await api('search/movie', {
        params: {
          query,
          page,
          language: lang.value
        }
      })
      const movies = data.results
      createMovies(movies, genericSection, {lazyLoad: true, clean: false})

    }
  }
}

async function getMovieById(movieId) {
  const { data: movie }= await api(`movie/${movieId}`, {
    params: {
      language: lang.value
    }
  })
  const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

  headerSection.style.background = `linear-gradient(180deg,rgba(0, 0, 0, 0.35) 19.27%,rgba(0, 0, 0, 0) 29.17%),url(${movieImgUrl})`

  movieDetailTitle.textContent = movie.title
  movieDetailDescription.textContent = movie.overview
  movieDetailScore.textContent = movie.vote_average

  createCategories(movie.genres, movieDetailCategoriesList)
  getRelatedMovies(movieId)
}

async function getRelatedMovies(movieId) {
  const { data }= await api(`movie/${movieId}/similar`, {
    params: {
      language: lang.value
    }
  })
  const relatedMovies = data.results
  createMovies(relatedMovies, relatedMoviesContainer)
}


async function getTrendingMoviesPaginate() {
  const { scrollTop, scrollHeight, clientHeight} = document.documentElement
  const scrollIsBottom = scrollTop + scrollHeight >= clientHeight -15

    if (scrollIsBottom && page <= maxPages) {
    page ++
    const { data }= await api('trending/movie/day', {
      params: {
        page: page,
        language: lang.value
      }
    })
    const movies = data.results
    createMovies(movies, genericSection, {lazyLoad: true, clean: false})

  }
}

function getLikedMovies(params) {
  const likedMovies = likedMoviesList()
  const moviesArray = Object.values(likedMovies)
  createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true})
}

function changeLanguage(lang) {
  //buscar lenguaje y asignarlo a un objeto
  captions = langs.find(e => e.lang === lang)
  if (captions == undefined) {
    captions = langs.find(e => e.lang === 'es')
    optionLanguages.value = 'es'
  } else {
    optionLanguages.value = lang
  }
}

function optLang(lang) {
  changeLanguage(lang)
  navigatorApp()
}