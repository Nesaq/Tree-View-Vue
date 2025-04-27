type Page = {
  key: string
  name: string
  level: number
  link: string | null
  parentKey?: string | null
  childPageKeys?: string[] | null
}

type Pages = {
  [key: string]: Page
}

export type Content = {
  pages: Pages
  rootLevelKeys: string[]
}
