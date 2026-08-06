import { describe, expect, it } from 'vitest'
import { convertData, parseData, serializeData } from '../src/lib/dataformats'

describe('dataformats', () => {
  const obj = [
    { id: 1, name: 'Earth', moons: 1 },
    { id: 2, name: 'Mars', moons: 2 },
  ]

  it('json to yaml and back', async () => {
    const yaml = await convertData(JSON.stringify(obj), 'json', 'yaml')
    expect(yaml).toContain('name: Earth')
    const back = await convertData(yaml, 'yaml', 'json')
    expect(JSON.parse(back)).toEqual(obj)
  })

  it('json array to csv', async () => {
    const csv = await convertData(JSON.stringify(obj), 'json', 'csv')
    expect(csv.split(/\r?\n/)[0]).toBe('id,name,moons')
    expect(csv).toContain('1,Earth,1')
  })

  it('csv to json', async () => {
    const csv = 'id,name,moons\n1,Earth,1\n2,Mars,2'
    const json = await convertData(csv, 'csv', 'json')
    expect(JSON.parse(json)).toEqual(obj)
  })

  it('json to xml and back', async () => {
    const src = { root: { item: 'value' } }
    const xml = await serializeData(src, 'xml')
    expect(xml).toContain('<item>value</item>')
    const back = await parseData(xml, 'xml')
    expect(back).toEqual(src)
  })

  it('rejects invalid json', async () => {
    await expect(parseData('{bad', 'json')).rejects.toThrow()
  })
})
