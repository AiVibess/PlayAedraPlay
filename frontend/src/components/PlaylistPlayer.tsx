import { useRef, useEffect } from "react";

type Track = {
  artist: string;
  title: string;
  videoId: string;
  thumbnail?: string;
};

type Props = {
  track: Track | null;
  onNext: () => void;
  onPrev: () => void;
  title: string;
};

export default function PlaylistPlayer({
  track,
  onNext,
  onPrev,
  title,
}: Props) {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayer = useRef<any>(null);

  useEffect(() => {
    if (!track?.videoId) return;

    // Безопасно очищаем контейнер, если он есть
    if (playerRef.current) {
      playerRef.current.innerHTML = "";
      // Создаем div для плеера
      const playerDiv = document.createElement("div");
      playerDiv.id = "yt-player";
      playerRef.current.appendChild(playerDiv);
    } else {
      // Если playerRef.current по какой-то причине null - просто выходим
      return;
    }

    const createYTPlayer = () => {
      if (ytPlayer.current) ytPlayer.current.destroy();

      // @ts-ignore
      ytPlayer.current = new window.YT.Player("yt-player", {
        height: "200",
        width: "360",
        videoId: track.videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === 0) {
              onNext();
            }
          },
        },
      });
    };

    // @ts-ignore
    if (window.YT && window.YT.Player) {
      createYTPlayer();
    } else {
      // @ts-ignore
      window.onYouTubeIframeAPIReady = createYTPlayer;
    }

    return () => {
      if (ytPlayer.current) {
        ytPlayer.current.destroy();
        ytPlayer.current = null;
      }
    };
  }, [track?.videoId, onNext]);

  return (
    <div className="playlist-player">
      <div ref={playerRef}></div>
      <div className="controls">
        <button onClick={onPrev}>⏮</button>
        <span>
          {track ? (
            <>
              {track.artist} — {track.title} <span className="track-num">{title}</span>
            </>
          ) : (
            <span>Выберите трек</span>
          )}
        </span>
        <button onClick={onNext}>⏭</button>
      </div>
    </div>
  );
}
