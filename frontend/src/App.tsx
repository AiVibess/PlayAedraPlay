import { useState } from "react";
import QueryInput from "./components/QueryInput";
import TrackList from "./components/TrackList";
import PlaylistPlayer from "./components/PlaylistPlayer";
import "./App.css";

export default function App() {
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  function handlePlaylist(tracks: any[]) {
    setPlaylist(tracks);
    setCurrent(0);
  }

  function handleNext() {
    setCurrent((prev) => (prev + 1 < playlist.length ? prev + 1 : 0));
  }

  function handlePrev() {
    setCurrent((prev) => (prev - 1 >= 0 ? prev - 1 : playlist.length - 1));
  }

  return (
    <div className="main-container">
      <h1>🎵 AI Playlist Generator</h1>
      <QueryInput onPlaylist={handlePlaylist} />
      {playlist.length > 0 && (
        <>
          <PlaylistPlayer
            track={playlist[current]}
            onNext={handleNext}
            onPrev={handlePrev}
            title={`${current + 1} / ${playlist.length}`}
          />
          <TrackList
            tracks={playlist}
            current={current}
            onSelect={setCurrent}
          />
        </>
      )}
      <footer>
        <span>
          <a href="https://aedra.tech" target="_blank" rel="noopener noreferrer">
            aedra.tech
          </a>
        </span>
      </footer>
    </div>
  );
}
