'use client'

import { Card } from '@/components/ui/card'

interface ChipSelectionProps {
  selectedChip: number
  onChipSelect: (amount: number) => void
}

const chipDenominations = [
  { value: 25, color: 'from-green-500 to-green-700', textColor: 'text-white' },
  { value: 100, color: 'from-blue-500 to-blue-700', textColor: 'text-white' },
  { value: 500, color: 'from-red-500 to-red-700', textColor: 'text-white' },
  { value: 1000, color: 'from-purple-500 to-purple-700', textColor: 'text-white' },
  { value: 5000, color: 'from-yellow-400 to-yellow-600', textColor: 'text-black' },
  { value: 10000, color: 'from-pink-500 to-pink-700', textColor: 'text-white' }
]

export default function ChipSelection({ selectedChip, onChipSelect }: ChipSelectionProps) {
  return (
    <Card className="p-4 bg-gray-900/50 border-gray-700">
      <h3 className="text-lg font-bold text-white mb-4 text-center">Seleccionar Ficha</h3>

      <div className="grid grid-cols-2 gap-3">
        {chipDenominations.map(chip => (
          <button
            key={chip.value}
            onClick={() => onChipSelect(chip.value)}
            className={`
              relative w-full h-16 rounded-full bg-gradient-to-br ${chip.color}
              ${chip.textColor} font-bold text-sm transition-all duration-200
              shadow-lg hover:shadow-xl transform hover:scale-105
              ${selectedChip === chip.value
                ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-105'
                : 'hover:scale-110'
              }
            `}
          >
            {/* Diseño de la ficha */}
            <div className="absolute inset-1 rounded-full border-2 border-white/30" />
            <div className="absolute inset-2 rounded-full border border-white/20" />

            {/* Valor */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <span className="text-xs opacity-80">$</span>
              <span className="font-bold">{chip.value.toLocaleString()}</span>
            </div>

            {/* Efecto de brillo */}
            <div className="absolute top-2 left-3 w-4 h-2 bg-white/40 rounded-full blur-sm" />

            {/* Indicador de selección */}
            {selectedChip === chip.value && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-600 rounded-full" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Información de la ficha seleccionada */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">Ficha seleccionada:</p>
        <p className="text-xl font-bold text-yellow-400">${selectedChip.toLocaleString()}</p>
      </div>
    </Card>
  )
}
