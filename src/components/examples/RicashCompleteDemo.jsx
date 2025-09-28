import React from 'react'
import RicashDashboardExample from './RicashDashboardExample'
import RicashFormExample from './RicashFormExample'

export default function RicashCompleteDemo() {
  const [activeView, setActiveView] = React.useState('dashboard')
  
  const views = [
    { id: 'dashboard', label: 'Dashboard', component: RicashDashboardExample },
    { id: 'form', label: 'Formulaire', component: RicashFormExample }
  ]
  
  const ActiveComponent = views.find(v => v.id === activeView)?.component

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      {/* Navigation des vues */}
      <div className="bg-white border-b border-[#376470]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#2B8286] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-[#29475B]">
                Ricash UI Components
              </h1>
            </div>
            
            <nav className="flex space-x-1">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeView === view.id
                      ? 'bg-[#2B8286] text-white'
                      : 'text-[#376470] hover:bg-[#F4F2EE] hover:text-[#29475B]'
                    }
                  `}
                >
                  {view.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ActiveComponent && <ActiveComponent />}
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-[#376470]/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-[#2B8286] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-[#29475B]">
                Ricash
              </span>
            </div>
            <p className="text-[#376470] mb-4">
              Composants UI modernes et élégants pour votre application Ricash
            </p>
            <div className="text-sm text-[#376470]/70">
              © 2025 Ricash. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
