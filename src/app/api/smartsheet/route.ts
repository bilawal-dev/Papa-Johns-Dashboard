import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'redis'

const redis = createClient({ url: process.env.REDIS_URL })
redis.connect().catch(console.error)

const TTL = 60 * 60 * 24 * 180 // 180 days

async function geocode(address: string) {
  const key = `geo:${address.toLowerCase()}`
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  if (!address.trim() || address === ', , , USA') {
    const nullCoords = { lat: null, lon: null }
    await redis.set(key, JSON.stringify(nullCoords), { EX: TTL })
    return nullCoords
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    address
  )}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'your-app/1.0 (email@example.com)' },
  })

  if (!res.ok) {
    console.error(`Nominatim error ${res.status} for ${address}`)
    const nullCoords = { lat: null, lon: null }
    await redis.set(key, JSON.stringify(nullCoords), { EX: TTL })
    return nullCoords
  }

  const text = await res.text()
  try {
    const json = JSON.parse(text)
    const coords =
      json?.[0] ? { lat: Number(json[0].lat), lon: Number(json[0].lon) } : { lat: null, lon: null }

    await redis.set(key, JSON.stringify(coords), { EX: TTL })
    return coords
  } catch (e) {
    console.error(`Invalid JSON from Nominatim for ${address}:`, text.slice(0, 200))
    const nullCoords = { lat: null, lon: null }
    await redis.set(key, JSON.stringify(nullCoords), { EX: TTL })
    return nullCoords
  }
}


export async function GET(_req: NextRequest) {
  try {
    const accessToken = process.env.SMARTSHEET_API_ACCESS_TOKEN
    const reportId = process.env.SMARTSHEET_REPORT_ID

    if (!accessToken || !reportId) {
      return NextResponse.json(
        { error: 'Missing Smartsheet configuration' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.smartsheet.com/2.0/reports/${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Smartsheet API error: ${response.status}`)
    }

    const data = await response.json()

    const transformedData = {
      name: data.name,
      totalRowCount: data.totalRowCount,
      columns:
        data.columns?.map((col: any) => ({
          id: col.id,
          title: col.title,
          type: col.type,
        })) || [],
      rows: await Promise.all(
        data.rows?.map(async (row: any) => {
          const cells = row.cells || []
          const obj = {
            id: row.id,
            project_name: cells[0]?.displayValue || cells[0]?.value || '',
            project_status: cells[1]?.displayValue || cells[1]?.value || '',
            status_comments: cells[2]?.displayValue || cells[2]?.value || '',
            city: cells[3]?.displayValue || cells[3]?.value || '',
            address: cells[4]?.displayValue || cells[4]?.value || '',
            st: cells[5]?.displayValue || cells[5]?.value || '',
            survey_requested: cells[6]?.displayValue || cells[6]?.value || '',
            survey_received: cells[7]?.displayValue || cells[7]?.value || '',
            brandbook_design_requested:
              cells[8]?.displayValue || cells[8]?.value || '',
            brandbook_design_received:
              cells[9]?.displayValue || cells[9]?.value || '',
            design_approval_requested:
              cells[10]?.displayValue || cells[10]?.value || '',
            design_approval_received:
              cells[11]?.displayValue || cells[11]?.value || '',
            landlord_approval_requested:
              cells[12]?.displayValue || cells[12]?.value || '',
            landlord_approval_received:
              cells[13]?.displayValue || cells[13]?.value || '',
            permit_submitted: cells[14]?.displayValue || cells[14]?.value || '',
            permit_approved: cells[15]?.displayValue || cells[15]?.value || '',
            production_released:
              cells[16]?.displayValue || cells[16]?.value || '',
            ship_date_schedule:
              cells[17]?.displayValue || cells[17]?.value || '',
            install_start: cells[18]?.displayValue || cells[18]?.value || '',
            install_complete: cells[19]?.displayValue || cells[19]?.value || '',
            order: cells[20]?.displayValue || cells[20]?.value || '',
          }

          const fullAddress = `${obj.address}, ${obj.city}, ${obj.st}, USA`
          const coords = await geocode(fullAddress)

          return { ...obj, lat: coords?.lat || null, lon: coords?.lon || null }
        }) || []
      ).then(rows => rows.filter(row =>
        // Filter out rows with "#NO MATCH" in key fields
        row.project_name !== '#NO MATCH' &&
        row.project_status !== '#NO MATCH' &&
        row.city !== '#NO MATCH' &&
        row.address !== '#NO MATCH' &&
        row.st !== '#NO MATCH' &&
        // Also filter out completely empty or invalid entries
        row.project_name.trim() !== '' &&
        row.city.trim() !== '' &&
        row.address.trim() !== ''
      )),
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching Smartsheet data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from Smartsheet' },
      { status: 500 }
    )
  }
}
