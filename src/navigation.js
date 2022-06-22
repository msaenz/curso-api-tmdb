/* let page = 1
let infiniteScroll
let maxPages */

searchFormBtn.addEventListener('click', () => {
  location.hash = `#search=${searchFormInput.value }`
})

trendingBtn.addEventListener('click', () => {
  location.hash = '#trends='
})

arrowBtn.addEventListener('click', () => {
  history.back()
})


/* window.addEventListener('storage', () => {
  console.log("Revisando Storage")
  //getLikedMovies()
})
 */
window.addEventListener('DOMContentLoaded', navigatorApp, false)
window.addEventListener('hashchange', navigatorApp, false)
window.addEventListener('scroll', infiniteScroll, false)

function navigatorApp() {
  if (infiniteScroll) {
    window.removeEventListener('scroll', infiniteScroll, {passive: false})
    infiniteScroll = undefined
  }

  if (location.hash.startsWith('#trends')) {
    trendsPage()
  } else if (location.hash.startsWith('#search=')) {
    searchPage()
  } else if (location.hash.startsWith('#movie=')) {
    moviesPage()
  } else if (location.hash.startsWith('#category=')) {
    genericSection.innerHTML = ""
    categoriesPage()
  } else  {
    homePage()
  }
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0

  if (infiniteScroll) {
    window.addEventListener('scroll', infiniteScroll, {passive: false})
  }
}

function homePage() {
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.add('inactive')
  arrowBtn.classList.remove('header-arrow--white')

  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.remove('inactive')

  trendingPreviewTitle.innerHTML = captions.captions.trends
  //headerTitle.innerText = "Hola Mundo Films"
  //captions.captions.trends

  categoriesPreviewTitle.innerHTML = captions.captions.category
  likedTitle.innerHTML = captions.captions.likedTitle
  trendingBtn.innerHTML = captions.captions.trendMore
  footerCaption.innerHTML = captions.captions.footerCaption
  selectCaption.innerHTML = captions.captions.selectLang

  trendingPreviewSection.classList.remove('inactive')
  likedMoviesSection.classList.remove('inactive')
  categoriesPreviewSection.classList.remove('inactive')
  genericSection.classList.add('inactive')
  movieDetailSection.classList.add('inactive')

  getTrendingMoviesPreview()
  getCategoriesPreview()
  getLikedMovies()
}

function categoriesPage() {
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.remove('header-arrow--white')
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.remove('inactive')
  headerCategoryTitle.innerHTML = captions.captions

  searchForm.classList.add('inactive')

  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  likedMoviesSection.classList.add('inactive')
  genericSection.classList.remove('inactive')
  movieDetailSection.classList.add('inactive')

  const [_, categoryData]  = location.hash.split('=')
  const [categoryId, categoryName] = categoryData.split('-')
  headerCategoryTitle.innerHTML = categoryName

  page = 0
  maxPage = 1
  console.log(`página ${page}`);
  idCategory = categoryId
  getMoviesByCategory()
    //*********/
  infiniteScroll = getMoviesByCategory

}

function moviesPage() {
  headerSection.classList.add('header-container--long')
  //headerSection.style.background = ''
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.add('header-arrow--white')

  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.add('inactive')
  searchForm.classList.add('inactive')

  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  likedMoviesSection.classList.add('inactive')
  genericSection.classList.add('inactive')
  movieDetailSection.classList.remove('inactive')

  const [_, movieId]  = location.hash.split('=')
  getMovieById(movieId)
}

function searchPage(id) {
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.remove('header-arrow--white')
  headerTitle.classList.add('inactive')
  headerCategoryTitle.classList.remove('inactive')
  headerCategoryTitle.innerHTML = captions.captions.search

  searchForm.classList.remove('inactive')


  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  likedMoviesSection.classList.add('inactive')
  genericSection.classList.remove('inactive')
  movieDetailSection.classList.add('inactive')

  const [_, query]  = location.hash.split('=')
  getMoviesBySearch(query)

  page = 0
  maxPage = 1

  infiniteScroll = getPaginatedMoviesBySearch(query)
}

function trendsPage() {
  headerSection.classList.remove('header-container--long')
  headerSection.style.background = ''
  arrowBtn.classList.remove('inactive')
  arrowBtn.classList.remove('header-arrow--white')
  headerCategoryTitle.classList.remove('inactive')
  searchForm.classList.add('inactive')

  trendingPreviewTitle.innerHTML = captions.captions.trends
  headerCategoryTitle.innerHTML = captions.captions.trends

  trendingPreviewSection.classList.add('inactive')
  categoriesPreviewSection.classList.add('inactive')
  likedMoviesSection.classList.add('inactive')
  genericSection.classList.remove('inactive')
  movieDetailSection.classList.add('inactive')

  getTrendingMovies()
  infiniteScroll = getTrendingMoviesPaginate
}

