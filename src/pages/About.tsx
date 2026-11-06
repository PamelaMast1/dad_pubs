import Tbc from "../components/Tbc";

export default function About() {
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <p className="eyebrow">About Dad</p>
      <h1>The man behind the record</h1>

      <Tbc title="His name & the headline">
        <p>Full name, where he's from, and the one-line version of the record for people in a hurry.</p>
      </Tbc>
      <div style={{ height: 16 }} />

      <Tbc title="How it started">
        <p>
          When did the pub-counting begin, and why? Was it always deliberate, or did someone
          point out one day just how many he'd racked up?
        </p>
      </Tbc>
      <div style={{ height: 16 }} />

      <Tbc title="How the records were kept">
        <p>
          The spreadsheet behind this whole site &mdash; was it always digital, or transcribed
          from decades of notebooks? Any detail on the method is good material for this section.
        </p>
      </Tbc>
      <div style={{ height: 16 }} />

      <Tbc title="A favourite story or two">
        <p>The best anecdote from the road. The strangest pub. The one that got away (closed before he could get a second visit in).</p>
      </Tbc>
      <div style={{ height: 16 }} />

      <Tbc title="In his own words">
        <p>A quote from him &mdash; about the hobby, about pubs in general, anything.</p>
      </Tbc>
    </div>
  );
}
