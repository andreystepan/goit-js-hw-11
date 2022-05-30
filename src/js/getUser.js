import axios from "axios";
export default getUser;

const KEY = '27728909-9cfd380db3bf4e34a59031529';

const URL = 'https://pixabay.com/api/';

async function getUser(query, page, perPage) {

    const response = await axios.get(`${URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);

     return response;
}
