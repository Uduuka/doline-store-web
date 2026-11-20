## 6. Admin pass key `[Admin only]`

The gate between signing in and reaching any shop data. It has two faces: it
*creates* the account's admin pass key on the first device, and *asks for* that
same key on every device after.

A pass key is six digits. The admin's is the one that unlocks a newly
provisioned device, and it is deliberately asked for again on each new device:
provisioning a device is exactly the moment you want to be challenged, even
though the account has had the same pass key for months.

### On the first device -- Create your admin pass key

Headed "Create your admin pass key", with the line "You'll use this 6-digit key
to unlock this device. Other devices on this account will ask for the same one."

Two fields, Pass key and Confirm pass key, then a Set pass key button. Both
fields take digits only and stop at six. Setup needs the explicit button press
-- it does not submit itself on the last digit the way a later verification
does.

Choose it as carefully as you would a safe combination, and do not reuse
something a staff member could guess from knowing you. It is what stands between
a signed-out spare phone and your shop's figures.

### On every later device -- Enter your admin pass key

Headed "Enter your admin pass key", with the line "This account already has an
admin. Please verify it's you." One field, and it submits itself the moment the
sixth digit lands -- there is no button to press while it is being checked.

This is what stops a staff member turning a spare phone into an admin till of
their own: the account password alone is not enough to provision a device.

### What it tells you when something is wrong

- "Your pass key must be 6 digits." -- fewer than six were entered before the
  button was pressed.
- "Those two don't match." -- the two setup fields differ. Both are cleared so
  you can start again.
- "That pass key is already set." -- another device set one between this screen
  opening and the button being pressed. Use the verify form instead.
- "That isn't right. N attempts left." -- a wrong key on a verification,
  counting down to a lockout.
- "Too many attempts. Try again in N seconds." -- the lockout below is in
  effect. The Try again button becomes available when the count reaches zero.
- "Couldn't find your admin profile." -- setup did not complete properly. Sign
  out and sign in again.

### Lockouts

Five wrong entries and the screen locks for thirty seconds. Keep getting it
wrong and the wait doubles each time it trips -- thirty seconds, a minute, two,
four -- up to a ceiling of fifteen minutes. A correct entry clears the count
entirely.

The lockout belongs to the device, not the account, and so does the counter: it
is a defence against somebody sitting in the back room working through six-digit
combinations on one phone.

### Forgot pass key?

"Forgot pass key?" sits under the pass key entry here and on the staff lock
(section 8), for the account's own admin. It proves who you are through the
account rather than the key:

1. "We'll email a code to <your address>. Enter it here to choose a new pass
   key. Only someone who can open that inbox can reset it." Tap **Email me a
   code**.
2. Enter the six-digit code from the email.
3. Choose the new pass key and enter it twice.

The new key works on this device at once, clears any lockout, and reaches the
account's other devices when it syncs. It needs a connection, because the code
comes by email. A staff member who forgets theirs is reset by an admin instead
(section 21).

### Working offline

Verifying a pass key needs no connection -- the check happens on the device. That
matters more than it sounds: a till whose sign-in token has expired can still be
opened and used, because this gate and the staff lock after it both work
entirely offline.

### What happens next

Setting or verifying the key goes straight on to choosing which of the account's
shops live on this device (section 7).
