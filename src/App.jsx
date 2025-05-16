import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { buildUrlTree, urlToLinkName } from './util/urlTree'

import extending from './json/drupal_extending_docs_tree.json'
import administering from './json/drupal_administering_docs_tree.json'
import updating from './json/drupal_updating_docs_tree.json'
import ShowUrlTree from './components/ShowUrlTree'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  console.log(buildUrlTree(extending))

  return (
    <>
     <h1>Drupal Docs Tree View</h1>
     <ShowUrlTree tree={buildUrlTree(extending)} title='Extending Drupal' names={urlToLinkName(extending)} />
     <ShowUrlTree tree={buildUrlTree(updating)} title='Updating Drupal' names={urlToLinkName(updating)}/>
     <ShowUrlTree tree={buildUrlTree(administering)} title='Administering Drupal' names={urlToLinkName(administering)} />


    </>
  )
}

export default App
