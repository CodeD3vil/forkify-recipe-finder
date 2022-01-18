class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  // the 'handler' callback function is the 'controlSearchResults' from 'controller.js'
  // based on Publisher-Subscriber pattern
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
