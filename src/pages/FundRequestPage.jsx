import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput, RicashSelect } from '@/components/ui/ricash-input'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { DollarSign, Send } from 'lucide-react'

export default function FundRequestPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ montant: '', agence: 'AGE001', motif: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    navigate('/app/funds/approval')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#29475B] flex items-center gap-2">
          <DollarSign className="h-6 w-6" /> Demande de fonds
        </h1>
      </div>
      <RicashCard className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#29475B]">Montant</label>
            <RicashInput
              type="number"
              placeholder="Ex: 500000"
              value={form.montant}
              onChange={(e) => handleChange('montant', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#29475B]">Agence</label>
            <RicashSelect value={form.agence} onValueChange={(v) => handleChange('agence', v)}>
              <option value="AGE001">Ricash Dakar Centre</option>
              <option value="AGE002">Ricash Touba</option>
              <option value="AGE003">Ricash Saint-Louis</option>
            </RicashSelect>
          </div>
          <div>
            <label className="text-sm font-medium text-[#29475B]">Motif</label>
            <RicashTextarea
              rows={3}
              placeholder="Expliquez la demande"
              value={form.motif}
              onChange={(e) => handleChange('motif', e.target.value)}
            />
          </div>
          <div className="pt-2">
            <RicashButton type="submit" loading={submitting} loadingText="Envoi...">
              <Send className="h-4 w-4 mr-2" /> Envoyer la demande
            </RicashButton>
          </div>
        </form>
      </RicashCard>
    </div>
  )
}


