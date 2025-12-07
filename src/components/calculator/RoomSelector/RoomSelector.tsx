import React from 'react';
import styles from './RoomSelector.module.scss';

interface RoomSelectorProps {
  rooms: number[];
  selectedRooms: number | null;
  onRoomsChange: (rooms: number) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ 
  rooms, 
  selectedRooms, 
  onRoomsChange 
}) => {
  return (
    <div className={styles.selector}>
      <label>Количество комнат:</label>
      <div className={styles.rooms}>
        {rooms.map(room => (
          <button
            key={room}
            className={`${styles.roomButton} ${
              selectedRooms === room ? styles.active : ''
            }`}
            onClick={() => onRoomsChange(room)}
          >
            {room}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;