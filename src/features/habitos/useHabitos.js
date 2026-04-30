import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../auth/AuthContext'

export function useHabitos() {
  const { user } = useAuth()
  const [habitos, setHabitos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchHabitos() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('habitos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setHabitos(data)
    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchHabitos()
  }, [user])

  async function crearHabito(fields) {
    const { data, error: err } = await supabase
      .from('habitos')
      .insert({ ...fields, user_id: user.id })
      .select()
      .single()
    if (err) throw err
    setHabitos(prev => [data, ...prev])
    return data
  }

  async function actualizarHabito(id, fields) {
    const { data, error: err } = await supabase
      .from('habitos')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    setHabitos(prev => prev.map(h => h.id === id ? data : h))
    return data
  }

  async function eliminarHabito(id) {
    const { error: err } = await supabase
      .from('habitos')
      .delete()
      .eq('id', id)
    if (err) throw err
    setHabitos(prev => prev.filter(h => h.id !== id))
  }

  return { habitos, loading, error, crearHabito, actualizarHabito, eliminarHabito, refetch: fetchHabitos }
}
