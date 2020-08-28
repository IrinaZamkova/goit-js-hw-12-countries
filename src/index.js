import './styles.css';
import countryCard from './templates/country-list.hbs';
import listCountriesSearch from './templates/country-card.hbs';
import debounce from 'lodash.debounce';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';

const refs = {
  input: document.querySelector('.searchCountry'),
  listOfCountry: document.querySelector('.js-country'),
};

refs.input.addEventListener(`input`, debounce(onInputSearch, 1000));

function onInputSearch(event) {
  event.preventDefault();
  let input = event.target.value;
  const mainUrl = `https://restcountries.eu/rest/v2/`;
  const serchPartUrt = `name/${input}`;

  fetch(`${mainUrl}${serchPartUrt}`)
    .then(res => res.json())
    .then(data => {
      refs.listOfCountry.innerHTML = '';

      if (data.length > 10) {
        const myError = error({
          text: 'Too many matches found. Please enter a more specific query!',
          delay: 2000,
          width: '460px',
        });
      }
      if (data.length > 1 && data.length <= 10) {
        const markUp = listCountriesSearch(data);
        refs.listOfCountry.insertAdjacentHTML('beforeend', markUp);
      }

      if (data.length === 1) {
        const markUp = countryCard(data);
        refs.listOfCountry.insertAdjacentHTML('beforeend', markUp);
      }
      if (data.length === undefined) {
        const myError = error({
          text: 'no match, please try again',
          delay: 2000,
          width: '460px',
        });
      }
    })
    .catch(err => {
      console.log(err);
      refs.listOfCountry.innerHTML = '';
    });
}
