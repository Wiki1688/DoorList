# PROMPTS.md - DoorList

**Student:** Wee Khee Ang · **Course:** MGMT 6110 Human-AI Collaboration · **Problem Set 1** (Individual)
**User sentence:** A registration-desk volunteer at a 200-person student conference opens this screen to check attendees in as they arrive and flag anyone whose payment is unconfirmed, and knows it worked when the checked-in counter matches the queue in front of them and nobody flagged has a badge.
**User type:** B, internal. Business function: event operations (registration desk).
**Live link:** ⟦paste your Vercel production URL, the short one, tested in a private window⟧
**Repository:** https://github.com/Wiki1688/DoorList
**Builder:** Google AI Studio (Build), personal Google account. Sunday 6 - Monday 7 September 2026.

> Every prompt I sent, in order, verbatim. One line on what came back, one line on what I changed next and why. Entries were written as I sent each prompt; outcome lines were checked against the code in the repository afterwards, and where the code contradicted what the preview or the assistant told me, I say so.

---

## Prompt 1 - the master prompt (R·G·O·G·C)

```
ROLE: You are a senior front-end developer building a React web app.

GOAL: Build the front end of DoorList, a web product for volunteers on the
registration desk of a 200-person student conference (two or three volunteers,
standing at a table by the entrance, on their phones, during a 45-minute arrival
rush). Their job on this product is "check people in as they arrive and flag
anyone whose payment isn't confirmed". Screens:
1) Desk: a search box, then a list of attendees showing name, organisation,
   ticket type (Standard, Student or Speaker) and payment status (Paid or
   Unconfirmed). Tapping a Paid attendee marks them checked in: the row greys out
   and shows a tick; tapping again undoes it. Tapping an Unconfirmed attendee does
   NOT check them in; it shows a small confirmation asking "Payment confirmed at
   desk?" with two buttons, "Confirmed - check in" and "Cancel". Filter chips at
   the top: All, Not arrived, Checked in, Flagged. The selected filter is
   remembered when the page is closed and reopened. A counter at the top reads
   "Checked in X / Y". The volunteer knows it worked when the counter matches the
   number of people who have walked past the desk.
2) Summary: three large numbers (checked in, expected, flagged unconfirmed) and
   the list of flagged attendees, readable from two metres away. Reached from a
   tab or button on the Desk screen, and back again.

OUTPUT: A running app. Keep every invented value in ONE data file of its own,
with at least 18 attendees across all three ticket types and both payment
statuses, so the screen looks real. One component per screen or section. Move
between screens without reloading the page. Readable on a phone at arm's
length. When you are done, list the files you created and what each one holds.

GUARDRAILS: Screens and invented data only. Do NOT call the Gemini API or any
other model. Do NOT call any outside service or fetch from any URL. No database,
no login, no user accounts, no analytics. No features I did not list. No real
company's, university's or event's name, logo, or trademark. Invented names and
numbers only, nothing confidential.

CONTEXT: Individual Problem Set 1 for MGMT 6110 Human-AI Collaboration at SMU.
Built in Google AI Studio, shared as a link, and opened on a phone by classmates
in Week 3. I am not a programmer: when you make a choice I did not specify, say
so in one line rather than burying it.
```

**What came back:** A running two-screen app, roughly 15 files, preview loaded in about two minutes. Every numbered item in my Goal passed on the first check: search box, attendee list, Paid tap toggles check-in, Unconfirmed tap opens the "Payment confirmed at desk?" dialogue with the two buttons I named, four filter chips that filter, filter remembered after refresh, counter updates, Summary with three large numbers and the flagged list, navigation without reload. It also added things I never asked for: a "% Checked in" figure on the Desk counter card, a "Reset to default attendance data" button in the header (which did not work when pressed), a "Back to Desk" button on the Summary screen, 24 attendees instead of 18 with six of them already checked in before the event starts, and search that also matches ticket type (typing "student" returns 11 rows).

**What I changed next and why:** Started removing the uninvited features one per prompt, beginning with the % figure. My Guardrail said "No features I did not list" and it was ignored three times in one build, so I now know that line is too general to hold; I add specific exclusions as each one appears (see Prompts 2, 3 and 9).

---

## Prompt 2 - remove the % checked in

```
Remove this feature showing the % Checked in. I did not ask for this. Change nothing else.
```

**What came back:** "I have removed the percentage checked-in display and its progress indicator from the Desk counter card. Nothing else was changed." Preview confirmed: the counter card now reads only "Checked in X / Y".

**What I changed next and why:** Moved to the next uninvited item, the Reset button. Guardrail added to my list: *no percentages or progress indicators unless listed*.

---

## Prompt 3 - remove the Reset button

```
Remove this feature showing Reset to default attendance data. I did not ask for this. Change nothing else.
```

**What came back:** "I have removed the reset to default attendance data button and its associated handler from the top navigation bar. Nothing else was changed." Confirmed in the preview; the header now holds only the Desk and Summary tabs.

**What I changed next and why:** With the uninvited items cleared, I went back to my own edge-case tests (Cancel on the dialogue, confirm-then-undo, Summary versus Desk flagged counts). The confirm-then-undo test exposed a problem: after "Confirmed - check in", the attendee's payment status silently becomes Paid, and undoing the check-in leaves them looking like an ordinary paid attendee. A volunteer who taps "Confirmed" by mistake has no way back to Unconfirmed. Guardrail added: *no reset, debug or developer buttons*.

---

## Prompt 4 - add a way to flag an attendee (first attempt)

```
Add the feature to allow the volunteer to flag attendee if they have not paid or if the volunteer clicked the verify and confirmed check-in wrongly. Change nothing else.
```

**What came back:** The assistant reported the change as done ⟦paste its exact reply here if you still have it⟧. In the preview nothing new appeared on any row or dialogue, and I could not find any control that flagged an attendee. It did not seem to work. *(Checked later in the repository: the agent wrote a `handleFlagAttendee` function in `App.tsx` and passed it into `DeskScreen.tsx` as `onFlagAttendee`, but never attached it to any button. The feature exists as dead code that nothing calls.)*

**What I changed next and why:** I assumed my wording was too vague ("flag attendee") and rewrote the request as a precise modification of the Screen 1 behaviour, describing the exact state change I wanted.

---

## Prompt 5 - add a way to revert a wrong confirmation (second attempt)

```
Modify the feature for Screen 1, Desk: Tapping an Unconfirmed attendee does not check them in; it opens a small confirmation asking "Payment confirmed at desk?" with two choices: Confirmed — check in or Cancel. After Confirmed - check in, allow the volunteer to revert the status of the attendee from paid, checked-in to flagged payment unconfirmed. This is to cater to the situation when the volunteer click the verify and confirmed- check in wrongly, as well as any other wrong inputs to the attendees who have been incorrectly categorized as paid.
```

**What came back:** Again reported as done ⟦paste reply if available⟧; again nothing visible changed in the preview. Tapping a checked-in attendee still only undid the check-in and left them as Paid. Two attempts, two "done" messages, zero working feature, and from the preview alone I could not tell whether the fault was my wording or the code.

**What I changed next and why:** Stopped attacking the problem head-on. I decided to move on to the Summary screen and come back to the revert problem by a different route (Prompt 8). This is the moment I most want to remember: I accepted "done" twice without any way to check it.

---

## Prompt 6 - put the % and progress bar on the Summary screen

```
Add a feature to allow me to showing the % Checked in and in progress bar under the Summary Screen. Change nothing else.
```

**What came back:** Works. A "Check-in Progress" card with a percentage and a green bar now sits under the three large numbers on the Summary screen.

**What I changed next and why:** I had removed this exact feature from the Desk in Prompt 2. On reflection the percentage is useful to the registration lead glancing from across the room, but not to the volunteer at the desk, so I moved it rather than deleting it. ⟦Edit if your actual reason differed.⟧ This is a case where the model's unrequested default turned out to be a good idea in the wrong place.

---

## Prompt 7 - allow adding attendees

```
Add in a feature to allow the volunteer to add new attendees in the Desk screen. Change nothing else.
```

**What came back:** Works. A green "Add Attendee" button appeared in the counter card, opening a form (name, organisation, ticket type, payment status). In the repository this is a new 202-line file, `AddAttendeeModal.tsx`.

**What I changed next and why:** ⟦State your real reason - for example: walk-ins happen at every event and the volunteer needs a way to record them; or, this was a step towards being able to correct records after Prompts 4 and 5 failed.⟧ I note that this widens my own scope beyond the master prompt's two jobs, and that my Guardrail "No features I did not list" now had to be relaxed by me rather than broken by the model.

---

## Prompt 8 - allow editing and deleting attendees

```
Add in a feature to allow the volunteer to delete or modify the details of existing attendees in the Desk screen. Change nothing else.
```

**What came back:** Works. A pencil icon on every row opens an Edit form with a Delete button behind a "Delete {name}?" confirmation. In the repository this is a new 267-line file, `EditAttendeeModal.tsx`. The Edit form's payment-status dropdown can set Paid back to Unconfirmed, which is the revert I failed to get in Prompts 4 and 5.

**What I changed next and why:** ⟦Confirm this was your intent.⟧ It solved the revert problem, but by a route that also lets a volunteer set Unconfirmed to Paid *without* the "Payment confirmed at desk?" dialogue, and lets a volunteer delete a registered attendee entirely. I noticed the bypass only when reviewing the code for this log, not while building. I have left it in for submission and discuss it in REFLECTION.md Q3 and Q4 as the decision I would take back.

---

## Prompt 9 - remove the Back to Desk button

```
Remove this button showing back to desk. I did not ask for this. Change nothing else.
```

**What came back:** "I have removed the 'Back to Desk' button (#btn-back-to-desk) from the Summary screen as requested. Volunteers can navigate between the Desk and Summary screens using the top navigation header tabs. Nothing else was changed." Confirmed in the preview.

**What I changed next and why:** Nothing further in the app. Guardrail added: *no navigation controls other than the two header tabs*. Moved to GitHub push and Vercel deploy.

---

## What I found in the Code tab and the repository (not a prompt, but part of the record)

- 20 files and about 1,800 lines of code, from a prompt of five paragraphs plus eight short follow-ups. I can read the data file (`src/data/attendees.ts`) and roughly follow the components; I could not have written any of it.
- `package.json` includes `@google/genai` (the Gemini client), `express` (a web server) and `dotenv` (secret loading). None are used by my screens. `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`. `.env.example` contains a `GEMINI_API_KEY` placeholder with the comment "AI Studio automatically injects this at runtime from user secrets." I asked for a screen and was given the plumbing for a server that talks to Gemini.
- `vite.config.ts` does **not** contain the `GEMINI_API_KEY` line the brief warned about, so the production build passed and the deployed page was not blank. I would have looked in the one file the brief named, found it clean, and concluded there was no Gemini scaffolding.
- Searching the repository for `KEY` and `TOKEN` returns only the `.env.example` placeholder and two browser-storage key names. No live key anywhere.
- Decisions the model made that I never specified: check-in state is saved in the phone's browser storage (so a reload does not lose check-ins, but two volunteers' phones would show two different lists); "Flagged" is computed as *Unconfirmed and not checked in* on the Desk but as *Unconfirmed* on the Summary; six attendees start already checked in; long names are truncated with an ellipsis rather than wrapped; on a 390-pixel phone screen the fourth filter chip, "Flagged", is cut off and only reachable by scrolling sideways.

## Guardrails as they stand after this build

Added to the original list because each one was breached or turned out to be needed:

1. No percentages or progress indicators unless listed.
2. No reset, debug or developer buttons.
3. No navigation controls other than the ones listed.
4. No server dependencies, environment files or model clients of any kind.
5. Any control that changes a payment status must go through the confirmation dialogue.
