export default function TrackList({
  tracks,
  current,
  onSelect,
}: {
  tracks: any[];
  current: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="track-list">
      {tracks.map((track, idx) => (
        <div
          key={idx}
          className={`track-item ${current === idx ? "active" : ""}`}
          onClick={() => onSelect(idx)}
        >
          <img src={track.thumbnail} alt="" className="track-thumb" />
          <div>
            <div className="track-title">{track.title}</div>
            <div className="track-artist">{track.artist}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
