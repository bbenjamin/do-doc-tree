import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { buildUrlTree, urlToLinkName, buildHierarchicalTree } from './util/urlTree'

import extending from './json/drupal_extending_docs_tree.json'
import administering from './json/drupal_administering_docs_tree.json'
import updating from './json/drupal_updating_docs_tree.json'
import started from './json/drupal_getting_started_docs_tree.json'
import develop from './json/drupal_develop_docs_tree.json'
import apis from './json/drupal_apis_docs_tree.json';
import curated from './json/drupal_curated_guides_docs_tree.json'
import user_guide from './json/drupal_user_guide_docs_tree.json'

import ShowUrlTree from './components/ShowUrlTree'
// console.log('user_guild', buildUrlTree(user_guide))
// console.log('h tree', buildHierarchicalTree(user_guide))

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1>Drupal Docs Tree View</h1>
      <ShowUrlTree tree={buildUrlTree(started)} title='Getting Started' names={urlToLinkName(started)} />
      <ShowUrlTree tree={buildUrlTree(extending)} title='Extending Drupal' names={urlToLinkName(extending)} />
     <ShowUrlTree tree={buildUrlTree(updating)} title='Updating Drupal' names={urlToLinkName(updating)}/>
     <ShowUrlTree tree={buildUrlTree(administering)} title='Administering Drupal' names={urlToLinkName(administering)} />

      <ShowUrlTree tree={buildUrlTree(develop)} title='Administering Drupal' names={urlToLinkName(develop)} />
      <ShowUrlTree tree={buildUrlTree(apis)} title='Drupal APIs' names={urlToLinkName(apis)} />
      <ShowUrlTree tree={buildUrlTree(curated)} title='Curated' names={urlToLinkName(curated)} />
      <ShowUrlTree tree={buildUrlTree(user_guide)} title='User Guide (curated)' names={urlToLinkName(user_guide)} />



    </>
  )
}

export default App
