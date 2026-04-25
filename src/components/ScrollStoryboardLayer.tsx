export function ScrollStoryboardLayer() {
  return (
    <div className="storyboard-layer" aria-hidden="true">
      <div className="storyboard-layer__grain" />
      <div className="storyboard-layer__orb storyboard-layer__orb--top" />
      <div className="storyboard-layer__orb storyboard-layer__orb--bottom" />
      <div className="storyboard-layer__track">
        <span>Future scroll video layer</span>
      </div>
    </div>
  );
}
