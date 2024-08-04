import Hero from "../components/homepage/Hero";
import Welcome from "../components/homepage/Welcome";
import VideoChat from "../components/homepage/VideoChat";
function Homepage() {
  return (
    <div className="Homepage">
      <Welcome />
      <VideoChat />
      <Hero />
    </div>
  );
}

export default Homepage;
