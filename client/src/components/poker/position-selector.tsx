import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const positions = [
  { code: "UTG", name: "Under the Gun", color: "bg-red-600 hover:bg-red-500", description: "Early Position" },
  { code: "UTG+1", name: "UTG+1", color: "bg-red-500 hover:bg-red-400", description: "Early Position" },
  { code: "MP", name: "Middle Position", color: "bg-orange-600 hover:bg-orange-500", description: "Middle Position" },
  { code: "MP+1", name: "MP+1", color: "bg-orange-500 hover:bg-orange-400", description: "Mid-Late" },
  { code: "CO", name: "Cutoff", color: "bg-yellow-600 hover:bg-yellow-500", description: "Late Position" },
  { code: "BTN", name: "Button", color: "bg-green-600 hover:bg-green-500", description: "Best Position" },
  { code: "SB", name: "Small Blind", color: "bg-blue-600 hover:bg-blue-500", description: "Blind" },
  { code: "BB", name: "Big Blind", color: "bg-purple-600 hover:bg-purple-500", description: "Blind" },
];

interface PositionSelectorProps {
  selectedPosition: string;
  onPositionChange: (position: string) => void;
}

export default function PositionSelector({ selectedPosition, onPositionChange }: PositionSelectorProps) {
  return (
    <Card className="bg-green-800 border-green-600 p-6">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center">
        <MapPin className="text-yellow-400 mr-2" />
        Table Position
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {positions.map((position) => (
          <Button
            key={position.code}
            onClick={() => onPositionChange(position.code)}
            className={`p-3 text-center transition-colors ${
              selectedPosition === position.code 
                ? 'bg-yellow-500 text-black font-bold' 
                : position.color
            }`}
            variant="default"
          >
            <div>
              <div className="font-bold">{position.code}</div>
              <div className="text-xs opacity-75">{position.description}</div>
            </div>
          </Button>
        ))}
      </div>
      
      {/* Position Description */}
      <div className="mt-4 p-3 bg-green-700 rounded-lg text-white">
        <div className="text-sm">
          <strong>Selected: {selectedPosition}</strong>
          <br />
          {positions.find(p => p.code === selectedPosition)?.name}
        </div>
      </div>
    </Card>
  );
}
