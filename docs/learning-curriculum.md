# Foundation course (UK Lite)

Ten weeks with an owner and their own dog. Source of truth: [`kb/meta/uk-lite-course.json`](../kb/meta/uk-lite-course.json).

The public title is **Foundation course**. UK Lite is the internal name. The course is independent guidance. It is not affiliated with or endorsed by IMDT Ltd, and it is not a professional qualification. Lesson wording comes from the UK welfare-charity lessons already in this repo. IMDT sources stay `paraphrase_ok_pending_legal` and do not feed owner text (`review-017`).

The week themes follow the public shape of IMDT's shorter UK pathway: theory first (the 2-day headings), then the practical exercises this registry can teach, then limits. [`kb/meta/crash-course.json`](../kb/meta/crash-course.json) stays the coverage checklist. This file is the timetable.

## How a week works

- One theme. Dog work stays short and ends on a success. Published ranges stay side by side (`disc-007`): Blue Cross about 2 to 5 minutes, Dogs Trust 5 to 10, PDSA clicker training about 10 to 15 (about 2 minutes to charge a click, shorter for puppies), and one RSPCA branch 5 to 15. The RSPCA national page gives no minute number. The course does not pick one of those numbers.
- The week is complete after at least five practice days and the check below. A missed check repeats the week at an easier version of the same skill.
- Later weeks keep a few repetitions of earlier skills.
- There is no rep-count target. Checks use the observable criteria below and, where listed, the metrics in [`kb/registry/assessment-metrics.json`](../kb/registry/assessment-metrics.json).

## Part 1 — Understand

Owner version of the 2-day theory course.

### Week 1 — How dogs learn

Lessons: `lesson-equipment-and-law`, `lesson-how-dogs-learn`, `lesson-outdoor-rewards`, `lesson-intro-marker`.

`lesson-outdoor-rewards` is the answer to a dog that responds at home and not outside: a plainer treat for easy practice, a softer, smellier treat when the place gets harder (`oq-train-001`).

Practice: pair the marker with a reward on several days. Fit the collar, ID tag, and harness, and check the microchip record.

Check: the dog looks for a reward when it hears the marker, across two sessions, and the collar, ID tag, and harness fit are done.

If the check fails: keep pairing the marker with a reward. Do not add a new skill this week.

Shock-collar status stays the cautious wording already in the equipment lesson (`review-020`).

### Week 2 — Read your dog

Lessons: `lesson-name-attention`, `lesson-read-your-dog-stress`.

Practice: the name game in a quiet room. On one boring outing, watch for stress signs and do not add a training ask.

Check: the dog orients within 2 seconds of its name, said once, at conversational volume, in low distraction (`metric-name-latency-2s`). The owner can name stress signs and give space when they appear.

If the check fails: shorten the name game and drop distractions. Week 6 stays closed until this check is met.

### Week 3 — Plan the work

Lesson: `lesson-plan-and-measure`.

This is the owner version of class planning and a consultation: one written goal, a diary, and the same cue for the whole household.

Practice: log several short sessions against that goal. Keep a few marker and name repetitions in each one.

Check: the goal is written down and several short sessions are logged against it.

If the check fails: shrink the goal to a single skill in a quiet room and log that.

## Part 2 — Practise

Only exercises the registry can teach. Stay builds duration before distance (`disc-006`).

### Week 4 — Positions

Lessons: `lesson-first-sit`, then `lesson-down-basics` and `lesson-stay-basics`, plus `lesson-hand-touch`. `lesson-spin-trick` and `lesson-settle-mat` are optional and do not gate the week.

`lesson-settle-mat` is a calm settle on a blanket. It is not a send to a mat. The crash-course mat-target row stays partial. Stay still builds duration before distance. RSPCA's stay page says the same order (`claim-rspca-stay-002-duration-then-distance`, `disc-006`). The distance-first skeleton and `review-013` are unchanged.

Practice: one position at a time, indoors or in a quiet garden. Add the word "sit" as the dog sits. For the stay, add time while you are still close.

Check: the dog sits on cue with the lure starting to fade, and holds a short stay close to the handler.

If the check fails: return to the lure sit in a quiet room. Leave down, stay, and hand touch until the sit is easy again.

### Week 5 — Everyday manners

Lessons: `lesson-leave-it-basics`, then `lesson-rspca-leave`, `lesson-drop-it-swap`, and `lesson-play-retrieve`. `lesson-jumping-up` and `lesson-steal-chase` are for when that is the live problem. They do not gate the week.

Practice: closed fist, then open palm, then a toy swapped for something better, then a hold and a bring-back.

Check: the dog backs off a closed fist before the treat is released, and lets go of a toy in a fair trade. The bring-back does not gate the week.

If the check fails: stay on the closed fist. Do not move the food onto an open palm yet.

`lesson-play-retrieve` follows Blue Cross: reward a hold, then a pickup, then a return, and throw only after the toy has stopped. The fetched retrieve steps do not include a release into the hand, so the assessed retrieve stays partial. Dogs Trust tidy-up is a separate get-it, drop and box chain.

### Week 6 — Coming back nearby

Opens after week 5 and after `metric-name-latency-2s`.

Lesson: `lesson-recall-basics`.

Practice: one recall word for the whole household. Enclosed space first, then 5 metres on a long line in low distraction. Reward the return, including a slow one (`safe-003`). If the place makes responding hard, use the softer treat from `lesson-outdoor-rewards`. That lesson is optional here and does not gate the week.

Check: `metric-recall-long-line-5m`.

If the check fails: go back to the name game and shorten the distance. Do not repeat the cue if the dog is unlikely to come.

### Week 7 — Coming back at a distance

Practice: one cue, 10 metres, long line, mild distraction. Stay on the line. If the place gets harder, use `lesson-outdoor-rewards` again and shorten the place before you add distance. It does not gate the week.

Check: `metric-recall-long-line-10m`.

`lesson-emergency-recall` starts only after that check (`review-008`).

If the check fails: drop back to 5 metres and an easier place. Leave the emergency cue unused.

Public off-lead stays locked for the whole course (`safe-002`, `metric-off-lead-not-unlocked`).

### Week 8 — Loose lead

Lesson: `lesson-loose-lead`.

Practice: the researched loose-lead lesson on several short outings, plus a few recall repetitions on the line.

Check: ten consecutive slack steps without the owner stopping (`metric-loose-lead-10-steps`).

If the check fails: practise fewer steps in a quieter place.

Good Dog must not overwrite `ex-lead-loose` from this course. `goodDogExportStatus` stays `hold_until_method_review`.

## Part 3 — Real life

Owner version of behaviour modification and professional limits. Clinical problems stay referrals (`safe-004`).

### Week 9 — One situation

Choose one branch. Practise it on at least five days. Keep a few reps of an earlier skill.

If the week goes badly: stay on the same branch at an easier setup.

| Branch | Lessons | Constraint |
|--------|---------|------------|
| Puppy | `lesson-puppy-socialisation`, `lesson-mouthing-redirect` | No public-ground walking before the vet says vaccination cover is enough. Carry the puppy until then. |
| Newly rehomed dog | `lesson-rescue-settling` | Settling comes before harder skills. Eating and resting in the home is the aim. |
| Adolescent dog | `lesson-adolescent-regression` | Shorten the session and return to an easier version of a skill that used to work. |
| Hard walks | `lesson-reactive-management` | Vet check first. Management and a referral, not a rehabilitation plan (`safe-004`, `safe-005`). |
| Noise and fireworks | `lesson-fireworks-management` | Safe place, notice the signs, comfort and management. Severe panic is a referral (`safe-004`). |
| Time alone | `lesson-alone-prevention` | Short absences only while the dog is coping. Stop lengthening them if the dog is distressed (`review-006`, `safe-004`). |
| Two dogs | `lesson-multi-dog-household` | Meet at a distance, then separate beds, bowls, meals and chews. Do not punish a growl. Barking, lunging or snapping means stop and get help (`safe-004`, `safe-005`). This is not a plan for taking guarded items. |

### Week 10 — Generalise and stop

Lessons: `lesson-plan-and-measure`, `lesson-vet-handling-prep`.

Practice: one solid skill somewhere mildly new. Predictable touch for a vet visit, at the dog's pace. Read the diary and pick the next skill or place.

Check: that skill still works in the new place, and the owner can name the problems that belong with a vet or a behaviour professional.

If the check fails: return the skill to the last place where it worked, then try a smaller change of place.

Muzzle training stays in human review (`review-016`) and is not a week. Public off-lead stays locked.

## Not in this course

| Item | Why |
|------|-----|
| `lesson-muzzle-training` | Held for human review (`review-016`). |
| Emergency stop | The PDSA road-safety page was read. Its stop cue has no body position or distance steps, so it is not the assessed stop. The nearest lesson is the stay. |
| Chin rest | Still no UK charity step page. The Dogs Trust, Blue Cross, PDSA and RSPCA indexes fetched in batch 014 do not list it. |
| Middle | The same indexes do not list it. |
| Send around | The same indexes do not list it. |
| Full retrieve | Week 5 teaches a drop and a play bring-back. A release into the hand is still missing, so the assessed retrieve stays partial. |
| Mat target | Week 4 can include `lesson-settle-mat` as a calm settle on a blanket. That is not a send to a mat, so the crash-course row stays partial. |
