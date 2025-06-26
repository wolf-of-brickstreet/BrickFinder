import { useState } from 'react';
import BrickResultComponent from './BrickResultComponent';
import BrickDetailsComponent from './BrickDetailsComponent';

export default function ResultListComponent({ bricks, itemsByStorage }) {
  const [selectedBrick, setSelectedBrick] = useState(null);

  return (
    <>
      <div className="brickList">
        {bricks.map((brick) => (
          <BrickResultComponent
            key={brick.id}
            brick={brick}
            onSelect={() => setSelectedBrick(brick)}
          />
        ))}
      </div>

      <BrickDetailsComponent
        isOpen={!!selectedBrick}
        brick={selectedBrick}
        onClose={() => setSelectedBrick(null)}
        itemsByStorage={itemsByStorage}
      />
    </>
  );
}
