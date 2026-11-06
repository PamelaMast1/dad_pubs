import { photos } from "../data/photos";
import Tbc from "../components/Tbc";
import "./Photos.css";

export default function Photos() {
  return (
    <div className="container">
      <p className="eyebrow">Photos</p>
      <h1>Pictures from the pub trail</h1>

      {photos.length === 0 ? (
        <Tbc title="No photos added yet">
          <p>
            Drop image files into <code>public/photos/</code>, then list them in{" "}
            <code>src/data/photos.ts</code> with a filename and caption. They'll show up here in a
            gallery automatically &mdash; no other code changes needed.
          </p>
        </Tbc>
      ) : (
        <div className="photo-grid">
          {photos.map((p) => (
            <figure key={p.src} className="photo-card">
              <img src={`${import.meta.env.BASE_URL}${p.src}`} alt={p.caption} loading="lazy" />
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
