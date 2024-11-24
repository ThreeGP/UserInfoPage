import { FaGithub, FaDiscord, FaPlay, FaPause } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import music from "./assets/music.mp3";
import pfp from "./assets/pfp.jpg";
import ParticleBackground from "./components/ParticleBackground";

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const audioRef = useRef(new Audio(music));
  const audioElement = audioRef.current;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const audio = audioElement;

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const newProgress = (clickPosition / progressBarWidth) * 100;
    const newTime = (audioElement.duration * newProgress) / 100;

    audioElement.currentTime = newTime;
    setProgress(newProgress);
  };

  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="relative">
          {/* Dekoracyjne kółka w tle */}
          <div className="absolute -z-10 w-72 h-72 bg-red-900/20 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 w-72 h-72 bg-red-700/10 rounded-full blur-3xl -translate-x-1/2"></div>

          <div className="backdrop-blur-lg bg-black/30 p-8 rounded-2xl shadow-2xl max-w-md border border-red-900/30">
            {/* Przyciski kontrolne macOS - zmieniona pozycja na prawą stronę */}
            <div className="absolute top-3 right-3 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center group">
                <svg
                  className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer flex items-center justify-center group">
                <svg
                  className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M20 12H4" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center group">
                <svg
                  className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M3 3h18v18H3V3z" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6 mt-4">
              {/* Zdjęcie profilowe */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden animate-float border-2 border-red-600">
                  <img
                    src={pfp}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-red-600 w-4 h-4 rounded-full border-2 border-white animate-float"></div>
              </div>

              {/* Nick */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                3gp💫
              </h1>

              {/* Opis */}
              <p className="text-center text-gray-300">
                Frontend Developer | React Enthusiast
              </p>

              {/* Kontakty i linki */}
              <div className="w-full space-y-4">
                <a
                  href="https://discord.com/users/1067160011228319744"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-all"
                >
                  <FaDiscord className="w-6 h-6 text-red-200" />
                  <span className="text-gray-300">Kontakt: </span>
                  <span className="text-red-300">threegp</span>
                </a>

                <a
                  href="https://github.com/ThreeGP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-all"
                >
                  <FaGithub className="w-6 h-6 text-red-200" />
                  <span className="text-gray-300">Prace:</span>
                  <span className="text-red-300">GitHub</span>
                </a>

                {/* Music Player */}
                <div className="p-4 rounded-lg bg-black/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-red-300 font-medium">Obecnie gra:</p>
                      <p className="text-gray-400 text-sm">
                        JUNIOR - Niszczą Ft. SENIOR
                      </p>
                    </div>
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full bg-red-600/20 hover:bg-red-600/30 flex items-center justify-center transition-all"
                    >
                      {isPlaying ? (
                        <FaPause className="w-4 h-4 text-red-300" />
                      ) : (
                        <FaPlay className="w-4 h-4 text-red-300 ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="w-full h-2 bg-red-900/30 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Time display */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{currentTime}</span>
                    <span>{duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
