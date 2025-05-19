import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { buildUrlTree, urlToLinkName, buildHierarchicalTree } from './util/urlTree'

import extending from './json/drupal_headings_extending.json'
import administering from './json/drupal_headings_adminstering.json'
import updating from './json/drupal_headings_updating.json'
import upgrading from './json/drupal_headings_upgrading.json'
import started from './json/drupal_headings_getting_started.json'
import develop from './json/drupal_headings_develop.json'
import apis from './json/drupal_headings_apis.json';
import curated from './json/drupal_curated_guides_docs_tree.json'
import user_guide from './json/drupal_headings_user_guide.json'
import string_user_guide from './json/user_guide.js'
import contributor_reference from './json/drupal_headings_contributor_reference.json'
import './App.css'

import ShowUrlTree from './components/ShowUrlTree'

const ug = Object.values(JSON.parse(string_user_guide)).sort((a,b) => a.weight = b.weight );

function buildHierarchy(data, rootUrls) {
  const buildNode = (url) => {
    const currentNode = data[url];
    if (!currentNode) return null;

    // Construct the node object
    const node = { url, children: [] };

    // Build children recursively
    if (currentNode.children) {
      node.children = currentNode.children
        .map(buildNode) // Recursively build each child node
        .filter((child) => child !== null); // Filter out any non-existent URLs
    }
    return node;
  };

  // Start building with the specified root URLs
  if (rootUrls) {
    return rootUrls.map(buildNode).filter((node) => node !== null);
  }

  // Or find all possible root nodes (those that are not children of any node)
  const allUrls = new Set(Object.keys(data));
  const childUrls = new Set(
    Object.values(data).flatMap((node) => node.children)
  );
  const rootNodes = [...allUrls].filter((url) => !childUrls.has(url));

  // Build the hierarchy starting from all root nodes
  return rootNodes.map(buildNode).filter((node) => node !== null);
}

function addLengthProperty(obj, namesList, originalObj) {
  if (Array.isArray(obj)) {
    // If it's an array, apply the function on each item
    obj.forEach((v) => addLengthProperty(v, namesList, originalObj));
  } else if (typeof obj === 'object' && obj !== null) {
    // If it's an object, check for the "url" property and compute the length
    if (obj.hasOwnProperty('url')) {
      obj.text = namesList?.[obj.url] || obj.url.split('/')[obj.url.split('/').length - 1];
      if (originalObj[obj.url] && !obj.end) {
        const originalChildren = obj.children ? [...obj.children] : [];

        const renamed =
          originalObj[obj.url]
            .map((item) => ({url: item.href, text: item.text}))
            .filter((item) => !originalChildren.some((childItem) => childItem.url === item.url))
        if (renamed.length && obj.children && obj.children.length) {
          obj.children = [...originalChildren, ...renamed]
        } else if (renamed.length) {
          obj.children = [...originalChildren, ...renamed]
          obj.end = renamed
        }

      }
    }


    // Recursively apply the function to each property
    if (!obj.end) {
      Object.values(obj).forEach((v) => addLengthProperty(v, namesList, originalObj));
    }
  }
}

function headHunt(json) {
  const linkNames = urlToLinkName(json)
  const structured = {}
  const urls =  Object.keys(json);
  urls.forEach((theUrl) => {
    const kids = urls
      .filter((url) =>
        url !== theUrl &&
        url
          .replace('www.', '')
          .match(new RegExp(`^${theUrl.replace('www.', '')}(?:$|/([^/]*)$)`))
      );
    const otherKids = json[theUrl].map(item => item.href);
    structured[theUrl] = {}
    structured[theUrl].children = otherKids.length ? otherKids : kids
  })

  let filterCount = 6;
  if (json['https://drupal.org/community/contributor-guide/reference-information']) {
    filterCount = 12
  }
  const arranged = buildHierarchy(structured).filter(item => item.url.split('/').length < filterCount);
  if (structured['https://drupal.org/docs/extending-drupal']) {
    // console.log('STR', structured)
    // console.log('arr', arranged)
  }
  addLengthProperty(arranged[0], linkNames, json)
  return arranged[0];
}

function App() {

  return (
    <>
      <h1>Drupal Docs Overhead View /docs</h1>
      <b>All hierarchies below stop at 8 levels of depth</b>
      <h2>Main Docs Page</h2>
      <ShowUrlTree tree={headHunt(started)} title='Getting Started' names={urlToLinkName(started)}/>
      <ShowUrlTree tree={headHunt(administering)} title='Administering Drupal' names={urlToLinkName(administering)}/>
      <ShowUrlTree tree={headHunt(upgrading)} title='Upgrading Drupal' names={urlToLinkName(upgrading)}/>

      <ShowUrlTree tree={headHunt(updating)} title='Updating Drupal' names={urlToLinkName(updating)}/>
      <ShowUrlTree tree={headHunt(extending)} title='Extending Drupal' names={urlToLinkName(extending)}/>
      <h2>Develop (from sidebar)</h2>

      <ShowUrlTree tree={headHunt(develop)} title='Developing Drupal' names={urlToLinkName(develop)}/>

      <h2>Drupal APIs (from sidebar)</h2>
      <ShowUrlTree tree={headHunt(apis)} title='Drupal APIs' names={urlToLinkName(apis)}/>
      <h4><a href='https://api.drupal.org/api/drupal'>Complete Api Reference</a> https://api.drupal.org/api/drupal</h4>

      <h2>Curated Guides (from sidebar)</h2>
      <h3><a href='https://www.drupal.org/docs/official_docs/en/_evaluator_guide.html'>Evaluator Guide</a></h3>
      <h3><a href='https://www.drupal.org/docs/official_docs/en/_local_development_guide.html'>Local Development
        Guide</a></h3>
      {/*<ShowUrlTree tree={headHunt(user_guide)} title='User Guide (curated)' names={urlToLinkName(user_guide)}/>*/}
      <div className="url-tree-container">
        <h3 style={{
          marginBottom: '4px',
          marginTop: '0',
          marginInline: '-5px',
          paddingInline: '5px',
          backgroundColor: '#c3e1ff',
          position: 'sticky',
          top: '0'
        }}>User Guide</h3>
        <details style={{fontSize: '12px'}}>
          <summary className="node-label">User Guide <a href='https://www.drupal.org/docs/user_guide/en/index.html'>user_guide</a></summary>
          <div >
            {ug.map((chapter, index) => {
              const subs = chapter.children.map((child, idx) => {
                return <li key={idx}><a href={child.url}>{child.title}</a></li>
              })
              return <div key={index}><h4>{chapter.title}</h4>
                <ul>{subs}</ul>
              </div>
            })}
          </div>
        </details>

      </div>
      <h1>Other areas</h1>
      <h2>Contributor Guide</h2>
      <ShowUrlTree tree={headHunt(contributor_reference)} title='Contributor Reference' names={urlToLinkName(contributor_reference)}/>

    </>
  )
}

export default App
