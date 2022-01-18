import View from './view';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // handler is the callback function 'controlPagination()' from 'controller.js'
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const navigationButton = event.target.closest('.btn--inline');

      // if we don`t click on the button nothing will happen but without the guard clause
      // we could click outside the button area (within the parentElement)
      // and the would return an error
      if (!navigationButton) return;

      // this number is from the 'data-goto="${currentPage + 1}"' html attribute
      const gotToPAge = +navigationButton.dataset.goto;

      handler(gotToPAge);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);

    /////////////////////////// Page 1 and there are MORE pages to go to.
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    ////////////////////////// LAST page
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        `;
    }

    //////////////////////////// BETWEEN pages
    if (currentPage < numPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>

        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    // Page 1 and there are NO other pages to go to
    return '';
  }
}

export default new PaginationView();
