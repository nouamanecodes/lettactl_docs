export interface CommandFlag {
  flag: string
  short?: string
  description: string
  type: string
  default?: string
}

export interface CommandExample {
  title: string
  code: string
  description?: string
}

export interface CommandDoc {
  name: string
  description: string
  usage: string
  flags: CommandFlag[]
  examples: CommandExample[]
  notes?: string[]
  seeAlso?: string[]
}
