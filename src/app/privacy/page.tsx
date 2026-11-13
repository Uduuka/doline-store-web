import type { Metadata } from "next";
import Link from "next/link";
import { Contact, LegalPage, LegalTable, Section } from "@/components/legal";

// The Doline Store Privacy Policy, as published at
// https://www.dolinesystems.com/products/doline-store/privacy (effective 25 October 2026).
// Keep the two in step: update both when the policy changes.

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal data Doline Store collects, why, who it goes to, and the choices you have.",
};

const Public = ({ children }: { children: React.ReactNode }) => (
  <>
    <strong>Public</strong> {children}
  </>
);

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what personal data Doline Store collects, why, who it goes to, and the choices you have."
      effective={{ label: "25 October 2026", iso: "2026-10-25" }}
      other={{ href: "/terms", label: "Terms of Service" }}
    >
      <Section title="1. Who we are and what this covers">
        <p>
          Doline Store is made by Doline Systems of Kampala, Uganda (&quot;we&quot;, &quot;us&quot;). This policy covers the Doline Store app on Android and
          Windows, the cloud service it syncs with, and Lilli, its built-in assistant. DolineMarket, our app for shoppers, has its own privacy policy.
        </p>
        <p>
          Using Doline Store is also governed by our <Link href="/terms">Terms of Service</Link>.
        </p>
      </Section>

      <Section title="2. Two kinds of data, two roles">
        <p>
          <strong>Your own data.</strong> The details of the people who sign in and run a store, the store itself, and how the app is used. For this we decide
          what is collected and why, so we are responsible for it as the data controller.
        </p>
        <p>
          <strong>Data your business records about other people.</strong> Your customers, staff and suppliers. Your business decides what to record and why, so
          your business is the data controller and we process that data on its behalf, only to run Doline Store for you.
        </p>
        <p>If you are a customer, staff member or supplier of a shop that uses Doline Store, contact that shop first about your information. We will help the shop answer you.</p>
      </Section>

      <Section title="3. What we collect">
        <p>
          We collect what you and your staff enter, what DolineMarket shoppers send with their orders, and a small amount of technical data the app needs to sync
          and send notifications.
        </p>
        <LegalTable
          head={["Data", "What it includes", "Where it comes from", "Who can see it"]}
          rows={[
            [
              "Account",
              'Email address, full name, username, phone number, "about" text, profile photo. With Google sign-in: the name, email address and photo on your Google account.',
              "You, or Google",
              "You, and the admins of stores you work in",
            ],
            ["Store details", "Store name, category, description, address, map location, opening hours, delivery zones, payment methods, currencies, cover photo", "You", <Public key="p">on DolineMarket</Public>],
            ["Products and listings", "Items, descriptions, photos, prices, promotions, stock available", "You", <Public key="p">on DolineMarket when listed</Public>],
            [
              "Business records",
              "Batches and buying prices, stock counts, write-offs, expenses, notes, orders, payments, credit balances, tips, returns, supplier orders, settings",
              "You and your staff",
              "Your store's staff, as their permissions allow",
            ],
            ["Customers", "Name, phone number, email address, address, their orders and balances", "You and your staff", "Your store's staff"],
            ["Suppliers", "Name, phone number, email address, address, the products you buy from them", "You and your staff", "Your store's staff"],
            [
              "Staff",
              <>
                Name, username, role, admin status, permissions, and a salted hash of each pass key. <strong>Never the pass key itself.</strong>
              </>,
              "You (an admin)",
              "Your store's admins",
            ],
            ["Report recipients", "Email addresses you enter to receive reports", "You", "Your store's admins"],
            ["Shopper orders", "A DolineMarket shopper's name, phone number, delivery address, message and order", "The shopper", "Your store's staff"],
            ["Reviews", "Ratings and comments shoppers leave on your store and products", "The shopper", <Public key="p">on DolineMarket</Public>],
            ["Activity log", "Who did what in your store, when, and which admin approved it", "The app", "Your store's admins"],
            ["Device", "A random device identifier, the platform, the app version, and (on Android) a push-notification token", "The app", "Us, to sync and deliver notifications"],
            ["Lilli chats", "Your messages, and the store records Lilli looks up to answer them", "You and the app", "You; sent to our AI providers (section 6)"],
            ["Feedback", "What you write in Help and feedback, and an email address if you give one", "You", "Us"],
            ["Barcodes", "The barcode number of a product you scan, when the app looks it up", "You", "Sent to a barcode database (section 6)"],
          ]}
        />
        <p>
          <strong>We do not collect</strong> bank card or mobile-money credentials (the app records payments but does not process them), your phone&apos;s
          contacts, your device&apos;s location, advertising identifiers, or usage analytics. Camera images used to scan barcodes are processed on the device and
          not uploaded.
        </p>
      </Section>

      <Section title="4. How we use it">
        <p>We use personal data to run Doline Store and keep it safe, and for nothing else:</p>
        <ul>
          <li>
            <strong>Run the service:</strong> sign you in, keep your store&apos;s records, and sync them between your devices.
          </li>
          <li>
            <strong>DolineMarket:</strong> publish the store details and products you list, and pass shoppers&apos; orders to your store.
          </li>
          <li>
            <strong>Notifications:</strong> tell you about new orders, reviews and stock, on your phones and computers.
          </li>
          <li>
            <strong>Lilli:</strong> answer your questions about your store and the app.
          </li>
          <li>
            <strong>Support:</strong> answer your messages and feedback, and fix problems you report.
          </li>
          <li>
            <strong>Security:</strong> detect and stop misuse, protect accounts, and keep the activity log of who did what.
          </li>
          <li>
            <strong>The law:</strong> meet legal obligations and respond to lawful requests from authorities.
          </li>
        </ul>
        <p>We do not sell personal data, show advertising, or build profiles of you or your customers. We do not use your store&apos;s data to train AI models.</p>
      </Section>

      <Section title="5. Our lawful bases">
        <p>Under Uganda&apos;s Data Protection and Privacy Act, 2019, we rely on:</p>
        <ul>
          <li>
            <strong>Contract:</strong> to provide Doline Store under our Terms of Service, which covers most of section 4;
          </li>
          <li>
            <strong>Consent:</strong> for Google sign-in and push notifications. You can withdraw it in your Google account or your device&apos;s settings;
          </li>
          <li>
            <strong>Legitimate interests:</strong> keeping the service secure and preventing misuse, where those interests are not outweighed by yours;
          </li>
          <li>
            <strong>Legal obligation:</strong> where the law requires us to keep or disclose data.
          </li>
        </ul>
        <p>For data your business records about other people, your business is responsible for having its own lawful basis (see our Terms of Service, section 5).</p>
      </Section>

      <Section title="6. Who we share it with">
        <p>
          We share personal data only with the service providers below, who process it for us to run Doline Store; with DolineMarket shoppers, for what you list;
          and where the law requires it.
        </p>
        <LegalTable
          head={["Provider", "What it does for us", "What it receives", "Where"]}
          rows={[
            [<a key="l" href="https://supabase.com/privacy">Supabase</a>, "Database, sign-in, file storage and server functions", "Everything that syncs: accounts, stores, records, photos, the activity log", "United Kingdom (London)"],
            [<a key="l" href="https://policies.google.com/privacy">Google</a>, '"Sign in with Google"', "Your Google name, email address and photo", "Global"],
            [
              <a key="l" href="https://firebase.google.com/support/privacy">Google Firebase Cloud Messaging</a>,
              "Push notifications to Android phones",
              'The device\'s push token and the notification\'s text, for example "New order from Jane"',
              "Global",
            ],
            [
              <a key="l" href="https://www.deepseek.com">DeepSeek</a>,
              "AI model behind Lilli",
              "Your Lilli messages, your name and role, and the store records Lilli looks up to answer, which can include customers' names, phone numbers and addresses, orders, and sales or profit figures",
              "China",
            ],
            [<a key="l" href="https://cohere.com/privacy">Cohere</a>, "Finds the right part of the user manual for Lilli", "The text of your question", "Canada and the United States"],
            [<a key="l" href="https://www.upcitemdb.com">UPCitemdb</a>, "Looks up products by barcode", "The barcode number only", "United States"],
            [<a key="l" href="https://www.exchangerate-api.com">ExchangeRate-API</a>, "Hourly currency exchange rates", "No personal data", "United States"],
          ]}
        />
        <p>Each provider handles the data under its own terms and privacy policy, linked above. We send each one only what it needs.</p>
        <p>
          <strong>Lilli is optional.</strong> If you would rather your store&apos;s records did not go to an AI provider outside Uganda, do not ask Lilli about
          them. Everything else in Doline Store works without her.
        </p>
        <p>We may also disclose personal data:</p>
        <ul>
          <li>to a court, the police or a regulator, when the law requires it;</li>
          <li>to protect people&apos;s safety, or our rights, when that is reasonably necessary;</li>
          <li>to a company that takes over Doline Store, which must then honour this policy. We will tell you first.</li>
        </ul>
      </Section>

      <Section title="7. International transfers">
        <p>
          Some of our providers process data outside Uganda, as the table above shows. When we transfer personal data abroad, we do so as the Data Protection and
          Privacy Act, 2019 allows: to providers bound by their own data-protection commitments, and only as needed to run Doline Store. By using Lilli, you ask
          for your messages and the records she looks up to be sent to our AI providers to answer you.
        </p>
      </Section>

      <Section title="8. What stays on your devices">
        <p>Doline Store keeps a full copy of your store&apos;s records on every device it runs on, so it works without an internet connection.</p>
        <ul>
          <li>
            <strong>Android:</strong> in the app&apos;s private storage, which other apps cannot read. It is not included in Google&apos;s device backups.
            Uninstalling the app deletes it.
          </li>
          <li>
            <strong>Windows:</strong> the database and photos are in a <code>.doline</code> folder in the Windows user&apos;s profile, and the sign-in session and
            app settings are in that user&apos;s part of the Windows registry. <strong>Uninstalling the app does not delete them.</strong> Delete the{" "}
            <code>.doline</code> folder to remove them.
          </li>
        </ul>
        <p>Anyone who can use a device can see what the app shows on it. Lock your devices, give each staff member their own pass key, and use the app&apos;s automatic lock on shared tills.</p>
      </Section>

      <Section title="9. How we keep data secure">
        <ul>
          <li>Data travels between the app and our cloud over encrypted connections (HTTPS).</li>
          <li>Our database provider encrypts stored data, and access rules in the database let an account reach only the stores it belongs to.</li>
          <li>Staff pass keys are stored only as salted hashes. Repeated wrong guesses lock the pass key for a while.</li>
          <li>
            Staff permissions control who can see costs, reports and settings. Admin approvals and sensitive actions are recorded in the activity log, which cannot
            be edited or cleared from the app.
          </li>
          <li>Only the Doline Systems people who need it for support or maintenance can reach production data.</li>
        </ul>
        <p>No system is perfectly secure. If a breach puts your personal data at risk, we will tell you and the Personal Data Protection Office, as the law requires.</p>
      </Section>

      <Section title="10. How long we keep data">
        <p>We keep your store&apos;s data for as long as your account is open, because it is your business record.</p>
        <ul>
          <li>
            <strong>Deleted records:</strong> when you delete something, the cloud keeps a short marker that it was deleted, so your other devices remove it too.
          </li>
          <li>
            <strong>Activity log:</strong> kept for the life of the store, as its audit trail.
          </li>
          <li>
            <strong>Closed accounts:</strong> when you ask us to close your account, we delete its stores&apos; data from our live systems within 90 days. Our
            database backups are overwritten on a rolling schedule after that.
          </li>
          <li>
            <strong>What we must keep:</strong> anything the law requires us to keep longer, or that we need for a legal claim, we keep only for that purpose and
            only as long as it requires.
          </li>
          <li>
            <strong>Your devices:</strong> data there stays until you delete it (section 8).
          </li>
        </ul>
      </Section>

      <Section title="11. Your rights">
        <p>Under Uganda&apos;s Data Protection and Privacy Act, 2019, you have the right to:</p>
        <ul>
          <li>know what personal data we hold about you, and get a copy;</li>
          <li>have it corrected if it is wrong or incomplete;</li>
          <li>have it deleted, where we have no lawful reason to keep it;</li>
          <li>object to how we use it, or ask us to stop;</li>
          <li>withdraw consent you gave, without affecting what happened before.</li>
        </ul>
        <p>
          You can change most of your own details in the app, under Edit profile and the store&apos;s settings. There is not yet a button to delete an account in
          the app: email us from the address on the account and we will do it. We may ask you to confirm who you are before acting on a request, and we will
          answer within the time the law allows.
        </p>
        <p>If you are a shop&apos;s customer, staff member or supplier, ask the shop first (section 2).</p>
        <p>
          You can also complain to Uganda&apos;s <a href="https://pdpo.go.ug">Personal Data Protection Office</a>. We would appreciate the chance to put things
          right first.
        </p>
      </Section>

      <Section title="12. Children">
        <p>
          Doline Store is for businesses and is not meant for anyone under 18. We do not knowingly collect personal data about children through it. If you think
          a child&apos;s data has been entered, tell us and we will help remove it.
        </p>
      </Section>

      <Section title="13. Messages we send">
        <p>
          We send emails and notifications that the service needs: sign-in codes, order and stock notifications, and important changes to Doline Store, these
          terms or this policy. You can turn off most notifications in the app&apos;s settings or your device&apos;s settings. We do not send marketing messages
          unless you have agreed to receive them, and every one will tell you how to stop.
        </p>
      </Section>

      <Section title="14. Changes to this policy">
        <p>
          We will update this policy when Doline Store or the law changes. The date at the top shows the current version. If a change affects how we use your
          personal data, we will tell you in the app or by email before it takes effect.
        </p>
      </Section>

      <Section title="15. Contact us">
        <Contact closing='For anything about your personal data, write to us with "Privacy" in the subject line.' />
      </Section>
    </LegalPage>
  );
}
