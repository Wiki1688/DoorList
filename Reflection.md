# REFLECTION.md workbook - DoorList

This is not the reflection. It is everything you need to write it in about an hour: for each of the five questions, what the rubric is looking for, the evidence from *your* build (with prompt numbers and file names so you can cite them), the argument that follows from that evidence, and the sentences the "Excellent" band explicitly asks for. Write the prose yourself, in first person, in your own words. Target 700 - 1,000 words total; the per-question budgets below add up to about 900.

**Header for the file:**

```
# REFLECTION.md - DoorList
**Student:** Wee Khee Ang · **Course:** MGMT 6110 · **Problem Set 1**
Repository: https://github.com/Wiki1688/DoorList · Live: ⟦Vercel URL⟧
```

---

## Q1 - Who are your users, and what changes for them? (~140 words)

**Rubric wants:** external/internal, job title, where, how many; the step-by-step of today without the product; which steps the screen removes or reorders; for internal users, the business function and who owns the step today.

**Your facts (all from your Step 1 slide):**
- Internal (Type B). Two or three registration-desk volunteers, standing at a table by the entrance, on their phones, during a 45-minute arrival rush for a 200-person student conference.
- Function: event operations, registration. Step owned today by the registration lead.
- Today: attendee says name → volunteer scans printed alphabetical list → finds it (or not, if misspelt) → checks the "paid" column printed the night before, already stale → if unclear, WhatsApps the treasurer while the queue waits → highlights the name → hands over badge → at the end the lead counts highlighter marks.
- Removed: stale printout (data is the list itself), highlighter count (the counter and Summary), treasurer message for the *unambiguous* cases (Paid shows in green).
- Deliberately kept: the human decision on Unconfirmed arrivals - the dialogue exists precisely so that step stays with a person.
- One honest limit you found in the code: check-ins are stored in each phone's browser, so two volunteers' phones would not agree. In the real event the lead would still need one device as the master list. Saying this shows you read what was built.

**Avoid:** "saves time." Say what it replaces: the search through a printout and the wait for a treasurer's reply, for perhaps 170 of 200 arrivals.

---

## Q2 - Augmented and constrained capacity (~200 words, both halves required)

**Augmented - be exact.** Your numbers: a working two-screen app from a five-paragraph prompt in about two minutes of generation; every item on the Goal list passed first time; roughly 15 files at first build, 20 files and ~1,800 lines by the end; you have never written React. Then the important sentence: where your time actually went. Not into building, but into deciding what "Flagged" should mean, whether a wrong confirmation should be reversible, and hunting for what the model added without being asked.

**Constrained - name the one you actually felt, and the moment.** You have an unusually strong one. Use Prompts 4 and 5:

- You asked twice for a way to revert a wrong payment confirmation. Both times the assistant said done. Both times nothing appeared. You could not tell whether your wording was wrong or the code was wrong.
- The repository shows what happened: the agent wrote a `handleFlagAttendee` function in `App.tsx`, passed it into `DeskScreen.tsx`, and never connected it to a button. The feature exists as code that nothing calls. You only learned this after the build, and only because someone read the code for you.
- This is the brief's first candidate word for word: *you cannot judge what you cannot read.* Verifying became the bottleneck - you could check the Goal list in the preview but had no way to check a "done" that produced nothing visible.
- Second, smaller constraint worth one sentence: the builder's defaults became your product's defaults. The dark header, the green accent, the "DL" logo mark, 24 attendees, six pre-checked-in: none were your decisions.
- The brief cites Anthropic's 2026 report (AI in ~60% of engineers' work, 0-20% of tasks fully delegated, surveyed on Anthropic's own engineers, not on people like you). One sentence connecting it: your gap showed up exactly at the verification step, and you are less equipped to close it than the engineers surveyed.

---

## Q3 - In the loop, on the loop, out of the loop (~280 words - the most important answer)

**Rubric wants (Competent):** quote your own log for a moment where judgment changed the outcome. **(Excellent):** admit a moment where you were nominally in the loop and added nothing. Then place the product's steps in/on/out using reversibility, stakes, checkability, volume, who bears the error; argue for one step out of the loop with the evidence you'd need; name one step where a human must stay.

**Backward - judgment changed the outcome.** Quote Prompt 3's outcome and the test that led to it: you tested confirm-then-undo and found that a desk confirmation silently rewrote the attendee to Paid, so a mis-tap erased the record that money had been taken at the desk. The model had made that decision; you overruled it. Quote Prompt 5's wording ("allow the volunteer to revert the status of the attendee from paid, checked-in to flagged payment unconfirmed. This is to cater to the situation when the volunteer click the verify and confirmed-check in wrongly").

**Backward - nominally in the loop, added nothing.** Two candidates; use at least the first:
1. Prompts 4 and 5: you were asked, in effect, to approve "done" twice, and you did, with no way to evaluate it. Being asked is not the same as deciding.
2. Prompt 8: you approved the Edit/Delete feature because it worked in the preview. You did not notice until reading the code afterwards that the Edit form lets a volunteer set Unconfirmed → Paid *without* the confirmation dialogue - the one control the product exists for - and lets a volunteer delete a registered attendee. You solved a problem by widening the spec and the widening opened a hole. Admitting this is worth more than any working feature.

**Forward - place the steps.**

| Step | Position | Why (five criteria) |
|---|---|---|
| Checking in a Paid attendee | **Out of the loop** (self-service scan) | Reversible (untick). Low stakes (a wrong tick). Instantly checkable (the person is standing there). High volume - 200 in 45 minutes, exactly the volume that numbs a reviewer. Error borne by the organiser, not the attendee. |
| Admitting an Unconfirmed attendee | **In the loop**, however slow | Badge issued is hard to take back. Stakes are the organisation's money and a person's admission. The attendee never agreed to be judged by a rule. |
| Reverting a wrong confirmation / editing a record | **In the loop, with a second person** | Your Prompt 8 evidence: an edit form with no confirmation is a bypass. Should require the lead, not any volunteer. |
| Duplicate names, end-of-day reconciliation | **On the loop** | The lead watches Summary totals and samples. Design must *surface* the ambiguous case rather than silently pick the first match. |

**The out-of-the-loop argument, with evidence required:** self-service check-in for Paid attendees, signed off only after (a) fewer than 1% mismatch between kiosk count and headcount across three events, (b) every kiosk check-in visible and reversible from the volunteer's screen within seconds, (c) a flagged person physically cannot self-check-in (the code already refuses this for Unconfirmed - cite `handleRowClick` in `DeskScreen.tsx`).

**The sentence that shows you read the brief:** in-the-loop fails when volume makes the volunteer tap "Confirmed" on everyone - the brief's ~97% approval figure; on-the-loop fails when the lead's sample misses the one unpaid speaker. "Keep a human everywhere" is not an answer.

---

## Q4 - What did it build that you never sketched? (~150 words)

**Rubric wants:** one gap that matters most, *when* you noticed (build / deploy / writing this), and what you would have had to do differently to catch it at the time. Also one case where the model was right and your spec was wrong.

**Three kinds of gap, from your build:**

*Added what you never asked for:* % on the Desk card, the non-working Reset button, the Back to Desk button (Prompts 2, 3, 9 - noticed during the build, from the preview). And the kitchen: `@google/genai`, `express`, `dotenv` in `package.json`; `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` in `metadata.json`; a `GEMINI_API_KEY` placeholder in `.env.example`. Noticed only when the repository was read after the build. Twist worth a sentence: `vite.config.ts` - the one file the brief told you to check - was clean, so following the instructions alone would have told you there was nothing there.

*Decided something you didn't know was a decision:* confirming at the desk sets the attendee to Paid (noticed during the build, by testing - your best moment). Flagged means two different things on the two screens. Check-ins are persisted per phone. Six people start checked in. The Flagged chip is cut off at phone width.

*Right where you were wrong:* the empty-search state ("No matches for 'zzzz'…" with a clear link) - you never specified it and the model's version is better than nothing. Persisting check-ins across a reload is arguably right too, and you never asked for it.

**Pick one and answer the real question.** Strongest choice: the dead `handleFlagAttendee` code, or the Gemini/server scaffolding. For either, the closing sentence is what you would have had to do: open the Code tab after every "done" and search for the word you used in the prompt; or add "list every dependency and file you added, and say why" to the Output section so the agent has to tell you.

---

## Q5 - Learning pointers for the organisational context (~130 words)

**Rubric wants:** three pointers, one sentence each, actionable by a function head on Monday, each traced to something that happened in your build. Generic governance advice scores zero.

Draft your own from these traces:

1. **From Prompts 4-5 (dead code reported as done):** a rule that "done" from an agent is not accepted until a named person has seen the change work *and* has searched the code for the feature's name - because in your build the agent reported success twice for a feature that was never wired to anything.
2. **From Prompt 8 (Edit form bypasses the confirmation):** a rule that any control which changes money- or eligibility-related status is listed explicitly in the spec with the check it must pass through, and any feature added mid-build is re-tested against that list - because your workaround for a failed feature quietly created a way round the one control the product was for.
3. **From the kitchen (`genai`, `express`, `dotenv`, `.env.example`, metadata capability):** a rule that an AI-built tool's dependency list and environment files are reviewed before deployment, and that a tool spending its *owner's* quota when others use it is never shared before that review - because your two-screen list app shipped with a Gemini client, a server and a key placeholder you never asked for, in files the brief did not tell you to look at.
4. Optional fourth to swap in: **from the per-phone storage decision** - a rule that the spec states where state lives and who sees it, because your app would give two volunteers two different lists and nobody specified otherwise.

Write each as one sentence a head of operations could act on, and name the prompt or file it came from.

---

## Before you write

- Rename `Prompts.md` → `PROMPTS.md` and `Reflection.md` → `REFLECTION.md` on GitHub (the brief uses upper case; GitHub is case-sensitive; a grader searching for `PROMPTS.md` should find it).
- Add a `README.md` with your name, the user sentence, user type B and function, the Vercel link, and the four steps to repeat the build (paste master prompt → AI Studio Build → Settings → GitHub → push → Vercel import). That covers the "a stranger could repeat the build" Excellent criterion and the "name in README" checklist item.
- Fill every ⟦…⟧ in PROMPTS.md, especially the reasons for Prompts 7 and 8. If a bracketed reason is not what you actually thought, replace it. The log is graded as a record of *your* deciding.
- If you have 30 minutes spare, one more prompt would strengthen Q4/Q5 and the live app: `Remove the @google/genai, express and dotenv dependencies from package.json and delete .env.example. This app makes no Gemini or server calls. Change nothing else.` Log it as Prompt 10. Then push and redeploy.
- Test the Vercel URL in a private window and on your phone before pasting it into eLearn.
