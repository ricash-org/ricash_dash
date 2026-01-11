import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function AgentRegistrationPending() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F2EE]">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-[#2B8286]" /> Demande envoyée
            </CardTitle>
            <CardDescription>Votre inscription est en attente de validation.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[#29475B]">Nous vous informerons dès que votre compte aura été validé par un administrateur.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


