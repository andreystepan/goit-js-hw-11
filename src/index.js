import axios from "axios";
import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const KEY = '27728909-9cfd380db3bf4e34a59031529';

const URL = 'https://pixabay.com/api/';

const form = document.querySelector('.search-form');
const cardGallery = document.querySelector(".gallery");
const btnLoad = document.querySelector('.btn-load-more')

let query = '';
let page = 1;
const perPage = 40;
let simpleLightBox = new SimpleLightbox('.gallery a')



async function getUser(query, page, perPage) {

    const response = await axios.get(`${URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    // console.log(response);

     return response;
}



form.addEventListener('submit', handleSearchForm);
btnLoad.addEventListener('click', handleBtnLoad);



function handleSearchForm(e) {
    e.preventDefault();

    let query = e.target.searchQuery.value.trim();
    cardGallery.innerHTML = '';
    page = 1;

    if (!query) {
         Notify.failure('The search string cannot be empty. Please specify your search query.')
    return
    }

    getUser(query, page, perPage).then(({ data } ) => {
        
        if (data.totalHits === 0) {
             Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        } else
        {
            cardGallery.insertAdjacentHTML('beforeend', creatCards(data.hits));
            simpleLightBox.refresh();
        }
        
        if (data.totalHits > perPage) {
          btnLoad.classList.remove('is-hidden')
        }
    })

}

function creatCards(cards) {
    const gallery = cards.map(card => {
              const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = card
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="photo-card">
            <img  src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `
    })
    .join('')
    
    return gallery;
}

function handleBtnLoad() {
    page += 1;

      getUser(query, page, perPage).then(({ data } ) => {
        
          cardGallery.insertAdjacentHTML('beforeend', creatCards(data.hits));
          simpleLightBox.refresh()
          
           const remainderPages = Math.ceil(data.totalHits / perPage)
      if (page > remainderPages) {
        btnLoad.classList.add('is-hidden') 
        Notify.failure("We're sorry, but you've reached the end of search results.")
      }

            
    })
}