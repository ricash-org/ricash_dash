import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RicashSelect } from '@/components/ui/ricash-input'

export default function AgentRegistrationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', prenom: '', phone: '', agence: 'AGE001' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    navigate('/register-agent/pending')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F2EE]">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Inscription agent</CardTitle>
            <CardDescription>Demandez la création de votre compte agent</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Prénom</Label>
                  <Input value={form.prenom} onChange={(e) => handleChange('prenom', e.target.value)} placeholder="Prénom" />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input value={form.nom} onChange={(e) => handleChange('nom', e.target.value)} placeholder="Nom" />
                </div>
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Ex: +221 77 000 00 00" />
              </div>
              <div>
                <Label>Agence</Label>
                <RicashSelect value={form.agence} onValueChange={(v) => handleChange('agence', v)}>
                  <option value="AGE001">Ricash Dakar Centre</option>
                  <option value="AGE002">Ricash Touba</option>
                  <option value="AGE003">Ricash Saint-Louis</option>
                </RicashSelect>
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Envoi...' : "Soumettre l'inscription"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


