# REFLECTION.md - DoorList

**Student:** Ang Wee Khee · **Course:** MGMT 6110 Human-AI Collaboration · **Problem Set 1**
**Repository:** https://github.com/Wiki1688/DoorList · **Live:** https://doorlist-alpha.vercel.app/

## Q1 · Who are my users, and what changes for them?

My users are internal: two or three registration-desk volunteers at a 200-person student conference, on their phones at the entrance table during a 45-minute arrival rush. The function is event operations (registration); the step is owned today by the registration lead.

Today: an attendee says their name; the volunteer scans a printed list; checks a "paid" column printed the night before and already stale; if unclear, WhatsApps the treasurer while the queue waits; highlights the name; hands over a badge. At the end the lead counts highlighter marks.

DoorList removes the stale printout, the highlighter count, and the treasurer message for the roughly 170 of 200 arrivals whose payment is already clear. It deliberately keeps the human decision on the rest: an Unconfirmed attendee can only be checked in through the "Payment confirmed at desk?" dialogue. One limit I found only in the code: check-ins live in each phone's browser, so two volunteers' lists would disagree.

## Q2 · Augmented and constrained capacity

**Augmented.** I have never written React. From one five-paragraph prompt I had a two-screen app on my phone in about two minutes, and every item on my Goal list passed first time; the agent ended up writing 20 files and roughly 1,800 lines. The build took about three hours, almost none of it building: the time went into verifying what I asked for, deciding what to add, and deleting what the AI added unasked. The pairing moved my time from making to judging.

**Constrained.** I could not judge what I could not read, and I can name the moment. In Prompt 4 I asked for a way to flag an attendee whose payment had been confirmed by mistake. The assistant said done; nothing appeared. I assumed my prompt was unclear and rewrote it precisely in Prompt 5. Done again; nothing again. I felt something had broken and moved on. Only when the repository was read afterwards did I learn that the agent had written a `handleFlagAttendee` function in `App.tsx`, passed it into `DeskScreen.tsx`, and never attached it to a button. Two "done" messages, zero feature, and no way to tell whether the fault was my wording or the code. Verifying was the bottleneck, exactly as the brief predicted.

## Q3 · In, on and out of the loop

**Where my judgment changed the outcome.** Testing confirm-then-undo after Prompt 3, I found that "Confirmed - check in" silently rewrote the attendee to Paid, so a mis-tap erased the record that money was taken at the desk. The model decided that; I overruled it in Prompt 5: "allow the volunteer to revert the status of the attendee from paid, checked-in to flagged payment unconfirmed."

**Where I was nominally in the loop and added nothing.** In Prompts 4 and 5 I accepted "done" twice with no way to evaluate it. The harder admission is Prompt 8. I asked for edit and delete controls because I thought that flexibility mattered for wrong clicks, and it did give me the revert I had failed to get. What I did not weigh was that the Edit form also lets any volunteer set Unconfirmed to Paid *without* the confirmation dialogue, the one control the product exists for, and delete a registered attendee outright. I approved it because it worked in the preview. I widened the spec to solve a problem, and the widening opened a hole.

**Looking forward.** Marking a Paid attendee as present could go **out of the loop** as a self-service scan: reversible in one tap, stakes of one wrong tick, instantly checkable because the person is standing there, and a volume (200 in 45 minutes) that numbs a human into tapping yes on everyone, the brief's 97 percent. Before signing off I would want, over three events, under one percent mismatch between kiosk count and headcount, and proof that an Unconfirmed attendee cannot self-check-in. Marking an attendee as **paid** stays **in the loop** however slow the queue gets: a badge is hard to take back, the money is the organisation's, and the attendee never agreed to be judged by a rule.

## Q4 · What did it build that I never sketched?

Caught during the build, from the preview: a percentage on the Desk counter, a non-working "Reset to default attendance data" button, and a "Back to Desk" button (Prompts 2, 3, 9). Caught only when the repository was read afterwards: `@google/genai`, `express` and `dotenv` in `package.json`, a `GEMINI_API_KEY` placeholder in `.env.example`, and a server-side Gemini capability in `metadata.json`. I asked for a screen and got a server's plumbing, while `vite.config.ts`, the one file the brief told me to check, was clean.

Decisions I did not know were decisions: confirming sets Paid; check-ins persist per phone; and "Flagged" means "Unconfirmed and not checked in" on the Desk but simply "Unconfirmed" on the Summary. Flagged bothers me most: I wrote the word without defining it, and the model quietly gave it two meanings. Where the model was right and I was wrong: the empty-search message and persisting check-ins across a reload, neither of which I asked for.

The gap that matters most is the dead `handleFlagAttendee` code, noticed only after the build. To catch it at the time I would have had to open the Code tab after each "done" and search for the word in my prompt, or add to my Output section: "list every file and dependency you added or changed, and why."

## Q5 · Learning pointers for the organisational context

1. Treat "done" from an agent as a claim, not a result: no AI-built change goes live until a named person has watched it work and searched the code for the feature by name, because my agent reported success twice for a feature never wired to anything (Prompts 4-5).
2. List every control that changes money or eligibility status in the spec with the check it must pass through, and re-test each mid-build addition against that list, because my workaround for a failed feature quietly created a way round the payment confirmation (Prompt 8).
3. Review the dependency list and environment files of every AI-built tool before it is shared, since a shared app spends its owner's quota, because my two-screen list shipped with a Gemini client, a web server and a key placeholder in files I was never told to open.
