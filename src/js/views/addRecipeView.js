import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _message = 'Recipe was successfully uploaded'
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  // these methods are initiated when this object is created
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleHidden() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleHidden.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleHidden.bind(this));
    this._overlay.addEventListener('click', this.toggleHidden.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      // the FormData array to manipulate from data
      const formDataArray = [...new FormData(this)];
      // convert formDataArray to an object
      const formData = Object.fromEntries(formDataArray)
      handler(formData);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
