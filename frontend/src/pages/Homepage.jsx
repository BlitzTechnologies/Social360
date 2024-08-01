import About from "../components/homepage/Welcome";
import Hero from "../components/homepage/Hero";
import Welcome from "../components/homepage/Welcome";
import VideoChat from "../components/homepage/VideoChat";
function Homepage() {
  return (
    <div className="Homepage">
      <Hero />
      <Welcome />
      <VideoChat />
    </div>
  );
}

export default Homepage;
