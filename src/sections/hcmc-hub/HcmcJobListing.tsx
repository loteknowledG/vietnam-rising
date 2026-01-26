import React, { useMemo } from 'react'
// Vite raw import to load the XML file as a string
// @ts-ignore
import xmlString from '../../../ho-chi-minh-city-metropolitan-area.xml?raw'

type JobItem = {
  title: string
  link: string
  pubDate?: string
  description?: string
}

function parseRss(xml: string): JobItem[] {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'application/xml')
    const items = Array.from(doc.querySelectorAll('item'))
    return items.map((it) => ({
      title: it.querySelector('title')?.textContent?.trim() ?? 'No title',
      link: it.querySelector('link')?.textContent?.trim() ?? '#',
      pubDate: it.querySelector('pubDate')?.textContent?.trim() ?? undefined,
      description: it.querySelector('description')?.textContent?.trim() ?? undefined,
    }))
  } catch (e) {
    console.error('Failed to parse XML', e)
    return []
  }
}

export default function HcmcJobListing(): JSX.Element {
  const jobs = useMemo(() => parseRss(xmlString as string), [])

  return (
    <div style={{maxWidth: 880, margin: '0 auto', padding: '1rem'}}>
      <h2>Ho Chi Minh — Job Listings</h2>
      <p style={{color: '#666', marginTop: 4}}>{`Found ${jobs.length} items`}</p>
      <div style={{display: 'grid', gap: 12, marginTop: 12}}>
        {jobs.map((job, i) => (
          <article key={i} style={{border: '1px solid #e6e6e6', borderRadius: 8, padding: 12}}>
            <a href={job.link} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
              <h3 style={{margin: 0}}>{job.title}</h3>
            </a>
            {job.pubDate && <div style={{fontSize: 12, color: '#888', marginTop: 6}}>{job.pubDate}</div>}
            {job.description && <p style={{marginTop: 8}} dangerouslySetInnerHTML={{__html: job.description}} />}
            <div style={{marginTop: 8}}>
              <a href={job.link} target="_blank" rel="noopener noreferrer">View listing</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
