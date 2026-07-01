import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../auth/useAuth'
import { calcularTotalGastos } from '../../lib/gastosUtils'

export function useGastos() {
  const { user } = useAuth()
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const mesActual = new Date().toISOString().slice(0, 7)

  async function fetchGastos() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('gastos')
      .select('*')
      .eq('user_id', user.id)
      .gte('fecha', `${mesActual}-01`)
      .lte('fecha', `${mesActual}-31`)
      .order('fecha', { ascending: false })
    if (err) setError(err.message)
    else setGastos(data)
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount, ver deuda técnica en CALIDAD.md
    if (user) fetchGastos()
  }, [user])

  async function crearGasto(fields) {
    const { data, error: err } = await supabase
      .from('gastos')
      .insert({ ...fields, user_id: user.id })
      .select()
      .single()
    if (err) throw err
    setGastos(prev => [data, ...prev])
    return data
  }

  async function actualizarGasto(id, fields) {
    const { data, error: err } = await supabase
      .from('gastos')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    setGastos(prev => prev.map(g => g.id === id ? data : g))
    return data
  }

  async function eliminarGasto(id) {
    const { error: err } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id)
    if (err) throw err
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  const total = calcularTotalGastos(gastos)

  return { gastos, loading, error, total, crearGasto, actualizarGasto, eliminarGasto }
}
