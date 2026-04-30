import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../auth/AuthContext'

export function useHabitosLog() {
  const { user } = useAuth()
  const [logHoy, setLogHoy] = useState([])

  const hoy = new Date().toISOString().slice(0, 10)

  async function fetchLogHoy() {
    const { data } = await supabase
      .from('habitos_log')
      .select('habito_id')
      .eq('user_id', user.id)
      .eq('fecha', hoy)
    setLogHoy((data ?? []).map(r => r.habito_id))
  }

  useEffect(() => {
    if (user) fetchLogHoy()
  }, [user])

  async function toggleCompletado(habitoId) {
    const yaCompletado = logHoy.includes(habitoId)
    if (yaCompletado) {
      await supabase
        .from('habitos_log')
        .delete()
        .eq('habito_id', habitoId)
        .eq('user_id', user.id)
        .eq('fecha', hoy)
      setLogHoy(prev => prev.filter(id => id !== habitoId))
    } else {
      await supabase
        .from('habitos_log')
        .insert({ habito_id: habitoId, user_id: user.id, fecha: hoy })
      setLogHoy(prev => [...prev, habitoId])
    }
  }

  return { logHoy, toggleCompletado, fetchLogHoy }
}
