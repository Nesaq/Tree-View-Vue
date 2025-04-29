import type { Content, Pages, TreeNode, Page } from '../types/ApiType'

function createNode(page: Page, pages: Pages): TreeNode {
  const node: TreeNode = {
    ...page,
    children: [],
  }

  if (page.childPageKeys) {
    node.children = page.childPageKeys
      .map(key => pages[key])
      .filter(Boolean) // На случай, если ключ есть, а страницы нет
      .map(childPage => createNode(childPage, pages))
  }

  return node
}

export function buildTree(data: Content): TreeNode[] {
  if (!data || !data.pages || !data.rootLevelKeys) {
    return []
  }

  const { pages, rootLevelKeys } = data

  const tree = rootLevelKeys
    .map(key => pages[key])
    .filter(Boolean) // На случай, если ключ есть, а страницы нет
    .map(rootPage => createNode(rootPage, pages))

  return tree
}
