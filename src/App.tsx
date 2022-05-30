import React, { useState, useEffect } from 'react'
import './App.css'
// eslint-disable-next-line import/no-webpack-loader-syntax
const Worker = require('workerize-loader!./search.worker')

interface SearchResult {
  stillPath: string
  html: string
}

function App () {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [workerInstance, setWorkerInstance] = useState<any | null>(null)
  const [searchCriteria, setSearchCriteria] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (workerInstance) return
    const w = new Worker()
    setWorkerInstance(w)

    w.addEventListener('message', ({ data }: any) => {
      // I don't know why `const [t, params] = data` does not work
      const [t, params] = [data[0], data[1]]
      if (!t) return
      switch (t) {
        case 'setReady': setReady(params); break
        case 'setSearchResults': setSearchResults(params); break
        default: console.error('unexpected message type: ' + t); break
      }
    })
  }, [workerInstance])

  useEffect(() => {
    workerInstance?.search(searchCriteria)
  }, [searchCriteria, workerInstance])

  useEffect(() => {
    if (loading || !workerInstance) return
    setLoading(true)

    workerInstance.init()
  }, [loading, workerInstance])

  return (
    <div>
      <input type="text" placeholder="Peanutbutter" value={searchCriteria} onChange={(event) => setSearchCriteria(event.target.value)} />
      {ready && searchResults && <div>
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
