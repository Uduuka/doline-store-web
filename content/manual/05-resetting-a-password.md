## 5. Resetting a password `[Both]`

Two screens, reached from "Forgot password?" on the Login screen: one asks where
to send a link, the other sets the new password once that link is opened.

This is for the *account* password -- the one that signs a device in. Staff pass
keys are a different thing entirely and are reset by an admin from Settings,
with no email involved.

### Asking for a link

The first screen is headed "Reset password". It takes one field, Email address,
and the Send reset link button sends it. "Remembered it? Login" goes back
without sending anything, and so does the back arrow in the top bar.

Once it has sent, the screen changes to "Check your email" and tells you that
*if* an account exists for that address, a link is on its way. It will not tell
you whether one actually does. That is deliberate: otherwise anyone who picked
up the shop's phone could use this screen to work out which email addresses have
Doline accounts. The address is named back to you, though, so a typo is still
obvious.

"Didn't arrive? Send again" resends. "Back to login" returns to the Login
screen, which is where you end up anyway if you give up.

### Setting the new password

Opening the link from your email brings you back into Doline on a screen headed
"New password": a New password field and a Confirm new password field, with an
eye icon on each to show what you typed. Six characters is the minimum, the same
as at registration.

It asks for nothing else. There is no current-password field, because the whole
premise is that you do not have it. Saving signs you in and the app carries
straight on into setup or into your shop, exactly as a normal login would -- you
do not have to go back and type the password you just set.

### Open the link on the same device, within the hour

The device remembers that it made the request, and that memory is what turns the
link into a new-password prompt. On any other device the same link simply signs
you in and leaves the password as forgotten as it was. After an hour it stops
working altogether, and you will be told "That reset link has expired. Please
request a new one."

Neither is a real problem: ask for a new link from the device you are actually
holding. But it does mean this is not a flow to start on the shop phone and
finish on your own.

All of this needs a connection, on both legs -- sending the email and setting the
password. It is not a way out of a lost password on a day the internet is down.
