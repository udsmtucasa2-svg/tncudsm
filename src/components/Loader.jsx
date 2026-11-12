export default function Loader({ fullscreen }) {
  const spinner = (
    <div className="ld-wrap" role="status" aria-label="Loading">
      <div className="ld-trio"><i /><i /><i /></div>
      <img src="/images/pcm-logo.png" alt="" />
    </div>
  );
  return fullscreen ? <div className="loader-screen">{spinner}</div> : <div className="loader-inline">{spinner}</div>;
}
