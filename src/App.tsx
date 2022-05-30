import React, { useState, useEffect } from 'react'
import MiniSearch from 'minisearch'
import './App.css'

interface SearchResult {
  stillPath: string
  html: string
}

function App () {
  const [index, setIndex] = useState<null | any>(null)
  useState(() => {
    fetch('data/index.json')
      .then((res) => res.text())
      // minisearch configuration must match datamaker's¬
      .then((data) => setIndex(MiniSearch.loadJSON(data, {
        fields: ['text'],
        storeFields: ['html', 'season', 'episode', 'stillPath'],
        searchOptions: {
          prefix: true,
          fuzzy: 0.2
        }
      })))
      // TODO: handle error
  })
  const [searchCriteria, setSearchCriteria] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  useEffect(() => {
    if (index) {
      setSearchResults(index.search(searchCriteria))
    }
  }, [index, searchCriteria])
  return (
    <div>
      <input type="text" placeholder="Peanutbutter" value={searchCriteria} onChange={(event) => setSearchCriteria(event.target.value)} />
      {searchResults && <div>
        <ul>
          {searchResults.map((doc: SearchResult) => (<li key={doc.stillPath}>
            <img src={`data/${doc.stillPath}`} />
            {doc.html}
          </li>))}
        </ul>
      </div>}
    </div>
  )
}

export default App
