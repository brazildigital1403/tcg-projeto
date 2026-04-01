import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const maxPages = Number(searchParams.get('pages')) || 10
    const pageSize = 100

    // cria registro de status
    const { data: statusRow } = await supabase
      .from('import_status')
      .insert({
        status: 'importando',
        current_page: 0,
        total_imported: 0,
      })
      .select()
      .single()

    let totalImported = 0
    let page = 1

    while (page <= maxPages) {
      const res = await fetch(
        `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}`
      )

      const json = await res.json()

      if (!json.data || json.data.length === 0) break

      const cards = json.data
        .filter((c: any) => c.images?.small && c.name)
        .map((c: any) => ({
          id: c.id,
          nome: c.name,
          imagem: c.images.small,
          pokedex: c.nationalPokedexNumbers?.[0] || null,
          elemento: c.types?.[0]?.toLowerCase() || 'colorless',
          raridade: c.rarity || 'Common',
          ativo: false,
        }))

      const { error } = await supabase
        .from('cards')
        .upsert(cards, { onConflict: 'id' })

      if (error) throw error

      totalImported += cards.length

      await supabase
        .from('import_status')
        .update({
          current_page: page,
          total_imported: totalImported,
        })
        .eq('id', statusRow.id)

      page++
    }

    await supabase
      .from('import_status')
      .update({ status: 'concluido' })
      .eq('id', statusRow.id)

    return NextResponse.json({
      success: true,
      id: statusRow.id,
    })

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    })
  }
}