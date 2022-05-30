import MiniSearch from 'minisearch'

let index: MiniSearch
let criteria = ''

const doSearch = () => {
  if (!index) return
  if (criteria.split(' ').some((x) => x.length < 3)) {
    global.self.postMessage(['setSearchResults', []])
    return
  }
  global.self.postMessage(['setSearchResults', index.search(criteria)])
}
export async function init () {
  fetch('data/index.json')
    .then((res) => res.text())
    // minisearch configuration must match datamaker's
    .then((data) => {
      index = MiniSearch.loadJSON(data, {
        fields: ['text'],
        storeFields: ['html', 'season', 'episode', 'stillPath'],
        searchOptions: {
          prefix: true
        }
      })
      global.self.postMessage(['setReady', true])
      doSearch()
    })
    // TODO: handle error
}

export async function search (searchCriteria: string) {
  criteria = searchCriteria
  doSearch()
}
