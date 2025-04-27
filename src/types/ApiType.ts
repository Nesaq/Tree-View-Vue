export type Page = {
  key: string
  name: string
  level: number
  link: string | null
  parentKey?: string | null
  childPageKeys?: string[] | null
}

export type Pages = {
  [key: string]: Page
}

export type Content = {
  pages: Pages
  rootLevelKeys: string[]
}

export type TreeNode = Page & {
  children: TreeNode[]
}