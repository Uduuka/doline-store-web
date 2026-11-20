## 8. Who's on shift `[Both]`

The staff lock. Headed "Who's on shift?" with the line "Select your name to
unlock this device", this is the screen a provisioned till opens on and returns
to all day.

It exists because the counter device is shared. Doline wants a name against
every sale, so the day's figures can be read per staff member and so a dispute
has an answer. Unlocking is the nearest thing the app has to clocking in.

### Unlocking

Tap your own name in the list. The pass key field appears with the keyboard
already up, and typing the sixth digit submits it -- there is nothing to press.
If the key is right, the shop opens on the dashboard.

The Unlock button is there for the moment you want it: a key typed and then
corrected, or a field you have tapped back into. "Not you? Choose again" under
the field returns to the staff list, which is what to use when somebody else
picked your name by mistake. Backing out of this screen clears whatever has been
typed, so a half-entered pass key cannot sit waiting for the next person.

### Your first time on a device

A staff member who has never unlocked *this* device, and has no pass key yet,
gets a different form: "First time on this device -- set a pass key to unlock it
going forward." with Pass key and Confirm pass key fields, and a Set pass key
button. Setup needs the button; only an existing pass key submits itself on the
last digit.

What you set here is yours from then on, on this device and on any other till in
the shop once it has synced. Choose six digits nobody at the counter can read
over your shoulder, and do not use the shop's own obvious numbers.

### What it tells you when something is wrong

- "Enter your pass key." -- Unlock was pressed with the field empty.
- "Incorrect pass key." -- wrong digits. The field clears so you can type again.
- "Pass key must be exactly 6 digits." -- on first-time setup, fewer than six
  were entered.
- "Pass keys don't match." -- on first-time setup, the two fields differ.
- "Too many attempts. Try again in Ns." -- the lockout is in effect, counting
  down on screen.

### Lockouts

Five wrong entries locks that staff member out for thirty seconds, and the wait
doubles each further time it trips -- up to fifteen minutes. A correct entry
clears the count.

If you are locked out and it was not you getting it wrong, tell an admin:
somebody has been trying your name. And if you have genuinely forgotten your
pass key, an admin resets it from Settings > Staff & Security. The admin who
forgets their own uses "Forgot pass key?" under the pass key entry, which emails
a code to the account's address (section 6). Nobody can read a pass key back to
you -- not an admin, not support, not Lilli. Resetting is the only route.

### Automatic re-locking

By default a device does not lock itself: whoever unlocked it stays on shift
until they lock it, or the app is closed. An admin can change that per device,
under Settings > Staff & Security > "Lock automatically after" -- Never, 1, 5, 15
or 30 minutes (section 21). With a time set, the device locks once it has sat
untouched that long, and the clock restarts on any touch anywhere in the app. A
till in use then never locks and a till put down always does, so the next person
to pick it up enters their own pass key rather than inheriting your shift.

Either way, lock it deliberately when you step away -- Lock in the account menu
at the top right of the dashboard, or the Lock button at the foot of the sidebar
on a computer. On a shared counter, do that rather than relying on a timer.

Closing the app entirely has the same effect. The shift is held in memory only,
so reopening Doline always comes back to this screen -- but it comes back to the
right shop, which the device does remember.

### If your name is not in the list

Only staff added to this shop appear. If yours is missing, an admin has not
added you yet -- Settings > Staff & Security, under their own login. On a brand
new device the list may hold only the admin until the first sync brings the rest
of the staff down.
