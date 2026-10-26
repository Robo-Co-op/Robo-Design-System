# Robo Presentation QA Contract

A deck is not done when every slide has content. It is done when the story, visuals, and evidence survive review.

## 1. Storyline

- Every slide has one governing message.
- Titles are assertions or decisions where possible, not generic topics.
- Reading only the slide titles should reveal the argument.
- Adjacent slides should have an explicit narrative relationship.
- Remove slides that repeat the same conclusion without adding evidence.

## 2. Evidence

- Separate facts, assumptions, estimates, and recommendations.
- Cite or label externally sourced claims when appropriate.
- Never invent numbers, screenshots, quotes, customer names, or system outputs.
- Show uncertainty when evidence is incomplete.

## 3. Visual hierarchy

- The intended first-read element is obvious.
- Body text is not used as the main visual.
- Key evidence is larger or more prominent than supporting metadata.
- Decorative elements must not compete with the message.

## 4. Density

- Default to 2–4 visual groups per slide.
- Avoid more than 90 body words unless the slide is intentionally document-like.
- Avoid more than five bullet lines.
- Use a second slide instead of shrinking text to fit.

## 5. Consistency

- Use canonical Robo tokens for colors, typography, spacing, and logos.
- Keep title position and safe margins stable across a deck.
- Use the same semantic color for the same meaning.
- Do not mix multiple visual metaphors for the same concept.

## 6. Robo Lab / Tech

- Code-like elements must contain meaningful metadata or real technical content.
- Terminal/UI frames should clarify system behavior, not act as decoration.
- Use electric blue as emphasis, not as a full-slide texture.
- Maintain high contrast on dark surfaces.
- Preserve whitespace even in dense technical diagrams.

## 7. Final review

Before export, inspect rendered slides at full-deck view and at 100% scale.

Fail the deck if:
- text clips or overflows
- the title does not match the slide's evidence
- a chart or diagram cannot be understood without narration
- a source or assumption is ambiguous
- visual density varies wildly without narrative reason
