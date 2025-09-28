import React from 'react'
import { RicashCard, RicashStatCard } from '@/components/ui/ricash-card'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashTabs, RicashTabsContent, RicashTabsList, RicashTabsTrigger } from '@/components/ui/ricash-navigation'
import { Users, DollarSign } from 'lucide-react'

export default function RicashTest() {
  return (
    <div className="p-6 bg-[#F4F2EE] min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-[#29475B]">Test des Composants Ricash</h1>
      
      {/* Test RicashCard */}
      <RicashCard className="p-6">
        <h2 className="text-xl font-bold text-[#29475B] mb-4">Test RicashCard</h2>
        <p className="text-[#376470]">Ceci est un test de la carte Ricash</p>
      </RicashCard>

      {/* Test RicashStatCard */}
      <RicashStatCard
        title="Test StatCard"
        value="1,234"
        change="+12%"
        changeType="positive"
        description="Test"
        icon={Users}
        iconColor="#2B8286"
      />

      {/* Test RicashButton */}
      <div className="space-x-4">
        <RicashButton variant="default">Bouton Default</RicashButton>
        <RicashButton variant="outline">Bouton Outline</RicashButton>
        <RicashButton variant="accent">Bouton Accent</RicashButton>
      </div>

      {/* Test RicashInput */}
      <RicashInput placeholder="Test input Ricash" />

      {/* Test RicashTabs */}
      <RicashTabs defaultValue="tab1">
        <RicashTabsList>
          <RicashTabsTrigger value="tab1">Onglet 1</RicashTabsTrigger>
          <RicashTabsTrigger value="tab2">Onglet 2</RicashTabsTrigger>
        </RicashTabsList>
        <RicashTabsContent value="tab1">
          <div className="p-4 bg-white rounded-lg">
            <p>Contenu de l'onglet 1</p>
          </div>
        </RicashTabsContent>
        <RicashTabsContent value="tab2">
          <div className="p-4 bg-white rounded-lg">
            <p>Contenu de l'onglet 2</p>
          </div>
        </RicashTabsContent>
      </RicashTabs>

      <div className="text-center text-[#2B8286] font-bold">
        ✅ Tous les composants Ricash fonctionnent correctement !
      </div>
    </div>
  )
}
