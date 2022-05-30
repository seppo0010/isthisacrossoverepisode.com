import React, { useState } from 'react'
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
      .then((data) => setIndex(MiniSearch.loadJSON(data, { fields: ['text'], storeFields: ['html', 'season', 'episode', 'stillPath'] })))
      // TODO: handle error
  })
  return (
    <div>
      {index && <div>
        <ul>
          {index.search('horse').map((doc: SearchResult) => (<li key={doc.stillPath}>
            <img src={`data/${doc.stillPath}`} />
            {doc.html}
          </li>))}
        </ul>
      </div>}
    </div>
  )
}

export default App
