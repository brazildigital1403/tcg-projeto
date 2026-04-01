import { supabase } from '@/lib/supabase'

export type Card = {
  id: string
  nome: string
  raridade: string
  imagem?: string
  ativo: boolean
  api_id?: string
  created_at: string
}

// BUSCAR (ADMIN)
export async function getAllCards(
  search?: string,
  rarity?: string,
  status?: string,
  tipo?: string
) {
  let allCards: any[] = []

  const pageSize = 1000
  let from = 0
  let hasMore = true

  while (hasMore) {
    let query = supabase
      .from('cards')
      .select('*')
      .range(from, from + pageSize - 1)

    if (search) {
      query = query.ilike('nome', `%${search}%`)
    }

    if (rarity && rarity !== 'all') {
      query = query.eq('raridade', rarity)
    }

    if (tipo && tipo !== 'all') {
      query = query.eq('elemento', tipo)
    }

    if (status === 'active') {
      query = query.eq('ativo', true)
    }

    if (status === 'inactive') {
      query = query.eq('ativo', false)
    }

    const { data, error } = await query

    if (error) throw error

    if (!data || data.length === 0) {
      hasMore = false
      break
    }

    allCards = [...allCards, ...data]

    if (data.length < pageSize) {
      hasMore = false
    } else {
      from += pageSize
    }
  }

  return allCards
}

// BUSCAR (APP)
export async function getActiveCards(): Promise<Card[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('ativo', true)

  if (error) throw error

  return data || []
}

// UPLOAD IMAGEM
export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('cards')
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage
    .from('cards')
    .getPublicUrl(fileName)

  return data.publicUrl
}

// CRIAR MANUAL
export async function createCard(card: {
  nome: string
  raridade: string
  imagem?: string
}) {
  const { data, error } = await supabase
    .from('cards')
    .insert({
      ...card,
      ativo: true,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// TOGGLE ATIVO
export async function toggleCard(id: string, ativo: boolean) {
  const { error } = await supabase
    .from('cards')
    .update({ ativo: !ativo })
    .eq('id', id)

  if (error) throw error
}

// IMPORTAR DA API (COM PROTEÇÃO DE DUPLICADO)
export async function importCardsFromAPI() {
  try {
    const res = await fetch('https://api.pokemontcg.io/v2/cards?pageSize=50')
    const json = await res.json()

    const cards = json.data

    for (const c of cards) {
      const mapped = {
        api_id: c.id,
        nome: c.name,
        raridade: c.rarity || 'Common',
        imagem: c.images?.small || '',
        ativo: false,
      }

      // verifica duplicado
      const { data: existing } = await supabase
        .from('cards')
        .select('id')
        .eq('api_id', mapped.api_id)
        .maybeSingle()

      if (existing) continue

      await supabase.from('cards').insert(mapped)
    }

    return true
  } catch (err) {
    console.error(err)
    throw new Error('Erro ao importar cartas')
  }
}