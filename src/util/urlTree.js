/**
 * Converts flat URL objects into a hierarchical tree structure
 * @param {Object} urlObject - Object with URLs as keys and their data as values
 * @returns {Object} A tree structure representing the URL hierarchy
 */
export function buildUrlTree(urlObject) {
    // Find root URL (should be the shortest URL)
    const urls = Object.keys(urlObject);
    const rootUrl = urls.reduce((shortest, current) => 
      current.length < shortest.length ? current : shortest, urls[0]);

    // console.log(`Root URL ${rootUrl}`, urlObject);
    // Initialize the tree with the root
    const tree = {
      url: rootUrl,
      title: urlObject[rootUrl]?.text || "Root",
      data: urlObject[rootUrl] || {},
      children: []
    };
    
    // Process all non-root URLs
    urls.filter(url => url !== rootUrl).forEach(url => {
      // Calculate the path segments relative to root
      const rootPath = new URL(rootUrl).pathname;
      const currentPath = new URL(url).pathname;
      
      // Skip if this URL doesn't extend from root
      if (!currentPath.startsWith(rootPath)) return;
      
      // Get relative path segments (excluding the root segments)
      const rootSegments = rootPath.split('/').filter(Boolean);
      const urlSegments = currentPath.split('/').filter(Boolean);
      const relativeSegments = urlSegments.slice(rootSegments.length);
      
      // Insert node into the tree
      insertNodeIntoTree(tree, relativeSegments, url, urlObject[url]);
    });
    
    return tree;
  }
  
  /**
   * Helper function to insert a node into the tree at the correct position
   */
  function insertNodeIntoTree(tree, pathSegments, fullUrl, nodeData) {
    // Base case: if no more segments, this is not a child node
    if (pathSegments.length === 0) return;
    
    // First segment defines where in the current level this node belongs
    const currentSegment = pathSegments[0];
    const remainingSegments = pathSegments.slice(1);
    
    // Look for an existing child that matches the current segment
    let targetChild = tree.children.find(child => {
      const childSegments = new URL(child.url).pathname.split('/').filter(Boolean);
      const lastSegment = childSegments[childSegments.length - 1];
      return lastSegment === currentSegment;
    });
    
    // If no matching child exists, create one
    if (!targetChild) {
        // console.log(`t---g ${fullUrl}`, nodeData)
      targetChild = {
        url: fullUrl,
        title: nodeData?.text || currentSegment,
        data: nodeData || {},
        children: []
      };
      
      // Only add as a direct child if this is the last segment
      if (remainingSegments.length === 0) {
        tree.children.push(targetChild);
        return;
      }
    }
    
    // If this is not the target node (more segments exist), keep traversing
    if (remainingSegments.length > 0) {
      // If we just created this node but it's not a leaf node,
      // add it to the tree before continuing
      if (!tree.children.includes(targetChild)) {
        tree.children.push(targetChild);
      }
      insertNodeIntoTree(targetChild, remainingSegments, fullUrl, nodeData);
    }
  }

  export function urlToLinkName(links) {
    const linksToName = {};
    Object.values(links).forEach(linkColl => {
        linkColl.forEach(link => {
            linksToName[link.href] = link.text;
        });
    });
    return linksToName
    // console.log('linkColl', linksToName)

  }