import type { Metadata } from "next";
import Link from "next/link";
import { Contact, LegalPage, Section } from "@/components/legal";

// The Doline Store Terms of Service, as published at
// https://www.dolinesystems.com/products/doline-store/terms (effective 25 October 2026).
// Keep the two in step: update both when the terms change.

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The agreement between your business and Doline Technologies Limited for using Doline Store.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms are the agreement between your business and Doline Technologies Limited for using Doline Store, on Android and Windows."
      effective={{ label: "25 October 2026", iso: "2026-10-25" }}
      other={{ href: "/privacy", label: "Privacy Policy" }}
    >
      <Section title="1. About these terms">
        <p>
          By creating an account or using Doline Store, you agree to these terms on behalf of the business you use it for. &quot;Doline Technologies&quot;,
          &quot;we&quot; and &quot;us&quot; mean Doline Technologies Limited of Kampala, Uganda. &quot;You&quot; means the business and the person who accepts these terms for
          it.
        </p>
        <ul>
          <li>You must be at least 18 years old and able to enter into a binding agreement for the business.</li>
          <li>Doline Store is a tool for running a business. It is not meant for personal or household use.</li>
          <li>
            Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal data, and forms part of these terms.
          </li>
        </ul>
        <p>If you do not agree to these terms, do not use Doline Store.</p>
      </Section>

      <Section title="2. The service">
        <p>Doline Store is point-of-sale and shop-management software, for Android phones and tablets and for Windows computers. It lets you:</p>
        <ul>
          <li>sell at the counter, take payments, give credit and record returns;</li>
          <li>keep inventory, batches, prices, promotions, stock counts and write-offs;</li>
          <li>keep records of clients, suppliers, expenses and notes;</li>
          <li>add staff, set what each may do, and see a log of who did what;</li>
          <li>see reports of sales, profit and stock;</li>
          <li>list your store and products on DolineMarket, our app for shoppers, and receive its orders;</li>
          <li>ask Lilli, the built-in assistant, about your store and how to use the app.</li>
        </ul>
        <p>
          The app keeps your records on each device and syncs them to our cloud when it is online, so your other devices see them too. We may add, change or
          remove features. When a change takes away something you rely on, we will try to tell you in advance.
        </p>
      </Section>

      <Section title="3. Your account">
        <p>
          You sign in with a one-time code sent to your email address, or with your Google account. Whoever controls that email address or Google account
          controls your Doline Store account, so keep it secure.
        </p>
        <ul>
          <li>Give accurate information about yourself and your business, and keep it up to date.</li>
          <li>One account can run more than one store. You are responsible for every store on your account.</li>
          <li>Tell us straight away if you think someone else has got into your account.</li>
        </ul>
        <p>The person who opens a store is its keeper. The keeper&apos;s account is the one every device for that store signs in with.</p>
      </Section>

      <Section title="4. Staff, pass keys and permissions">
        <p>You decide who works on your till. Staff unlock a device with a personal pass key, and an admin decides what each staff member may do beyond selling.</p>
        <ul>
          <li>
            <strong>You are responsible for your staff&apos;s use of Doline Store</strong> and for everything done under a pass key on your devices, as if you had
            done it yourself.
          </li>
          <li>Make sure each staff member knows these terms and the rules of your shop, and has your permission to use the app.</li>
          <li>Keep pass keys private. Each staff member should choose their own, and nobody should share theirs. We never ask for a pass key, and Lilli will not reveal one.</li>
          <li>
            Give admin access only to people you trust with your whole store: an admin can add staff, change permissions, edit store details and see costs and
            profit.
          </li>
          <li>When an admin approves an action for a staff member with their own pass key, the approval is recorded in the activity log against both of them.</li>
        </ul>
        <p>
          Permissions are enforced by the app on each device. They are a tool for running your shop, not a guarantee against a determined person with access to
          your devices or your account. Keep your devices and the keeper&apos;s email account secure.
        </p>
        <p>The activity log records who did what and when. It is there so you can see what happened in your store. It cannot be edited or cleared from the app.</p>
      </Section>

      <Section title="5. Your data">
        <p>
          Your business records belong to you. That covers your items, prices, costs, stock, sales, clients, suppliers, staff, expenses, notes, images and
          everything else you put into Doline Store.
        </p>
        <p>
          You give us permission to store, copy, sync, process and display that data only as needed to run Doline Store for you. That includes publishing what
          you choose to list on DolineMarket, and passing what you ask Lilli to our AI providers so she can answer. We do not sell your data and do not use it for
          advertising.
        </p>
        <p>
          <strong>Personal data about other people is your responsibility.</strong> When you record your customers, staff or suppliers in Doline Store, your
          business decides what is collected and why, and we handle it on your behalf. You must:
        </p>
        <ul>
          <li>have a lawful reason to collect and keep it, under the Data Protection and Privacy Act, 2019 of Uganda and any other law that applies to you;</li>
          <li>tell those people how you use their information, and get their consent where the law requires it;</li>
          <li>record only what you need, keep it accurate, and handle their requests to see, correct or delete it;</li>
          <li>not record sensitive information, such as health, religion or political views, unless the law allows it.</li>
        </ul>
        <p>We will help you respond to a request from one of those people when we reasonably can.</p>
      </Section>

      <Section title="6. DolineMarket listings and orders">
        <p>
          When you list your store or products on DolineMarket, shoppers can see your store&apos;s name, description, address, map location, opening hours,
          delivery options, the payment methods and currencies you accept, your photos, and the products, prices and stock you list.
        </p>
        <ul>
          <li>
            <strong>Listings must be accurate and lawful.</strong> Do not list goods or services that are illegal, counterfeit, stolen, unsafe, or that you have no
            right to sell.
          </li>
          <li>
            <strong>The sale is between you and the shopper.</strong> You set your prices and are responsible for fulfilling orders, delivery, returns, refunds,
            warranties, and complying with consumer-protection law.
          </li>
          <li>
            <strong>Use shoppers&apos; details only for their orders.</strong> Orders bring you a shopper&apos;s name, phone number, delivery address and any
            message they add. Do not use them for unrelated marketing without the shopper&apos;s consent.
          </li>
          <li>
            <strong>Reviews and ratings</strong> shoppers leave about your store are theirs. Do not post fake reviews or pressure shoppers about what they write.
          </li>
        </ul>
        <p>We may remove a listing that breaks these terms or the law, or that we receive a credible complaint about.</p>
      </Section>

      <Section title="7. Acceptable use">
        <p>Use Doline Store only for lawful business. You must not, and must not let anyone else:</p>
        <ul>
          <li>use it to commit or hide fraud, money laundering, tax evasion or any other crime;</li>
          <li>record or sell goods or services that are illegal where you trade;</li>
          <li>get into another business&apos;s store or data, or try to get round the app&apos;s sign-in, pass keys or permissions;</li>
          <li>copy, decompile or reverse-engineer the app, except where the law allows it despite this term;</li>
          <li>overload, probe or attack our systems, or collect data from them with bots or scrapers;</li>
          <li>upload malware, or content that is unlawful, defamatory, obscene or infringes someone else&apos;s rights;</li>
          <li>misuse Lilli, for example by trying to make her reveal pass keys or other people&apos;s data, or using her for anything unrelated to running your store;</li>
          <li>resell or sub-license Doline Store to others without our written agreement.</li>
        </ul>
      </Section>

      <Section title="8. Lilli, the AI assistant">
        <p>Lilli answers questions about your store and explains how to use Doline Store. She is powered by AI models run by third-party providers, named in our Privacy Policy.</p>
        <ul>
          <li>
            <strong>Lilli can be wrong.</strong> Check anything that matters, especially figures, before you act on it. She can only see what your store has
            recorded, and what you are allowed to see.
          </li>
          <li>
            <strong>She is not an adviser.</strong> Nothing Lilli says is legal, tax, accounting or financial advice.
          </li>
          <li>
            <strong>She acts only when you confirm.</strong> Lilli can prepare a restock from a delivery an admin describes, but nothing is stocked until the admin
            taps Confirm. You are responsible for checking what she prepared before confirming.
          </li>
          <li>
            <strong>What you send her leaves your device.</strong> Your messages, and the store records she looks up to answer them, are sent to our AI providers
            to produce a reply. Do not ask Lilli to look up anything you do not want processed that way.
          </li>
        </ul>
        <p>We may limit, change or switch off Lilli at any time.</p>
      </Section>

      <Section title="9. Taxes, records and compliance">
        <p>
          You are responsible for your business&apos;s taxes, receipts and records, and for meeting the law where you trade. That includes VAT, income tax,
          licences, and any obligation to issue fiscal receipts through the Uganda Revenue Authority&apos;s EFRIS or a similar system.
        </p>
        <p>
          Doline Store is not connected to EFRIS or any tax authority. Some settings, such as VAT, EFRIS, negative-stock rules, automatic re-ordering and loyalty
          points, record your preference but do not yet change how the app behaves. The in-app manual says which. Do not rely on them until we tell you they work.
        </p>
      </Section>

      <Section title="10. Accuracy of figures">
        <p>Reports, profit, margins and stock levels are worked out from what you and your staff enter. Their accuracy depends on yours, especially buying prices and stock received.</p>
        <p>
          Currency conversions use exchange rates fetched from a third party about once an hour, or rates you have locked. They may differ from the rate your bank
          or mobile-money provider gives you.
        </p>
        <p>Use the figures to run your shop. Check them before you rely on them for tax returns, loans, or decisions you cannot undo.</p>
      </Section>

      <Section title="11. Offline use and sync">
        <p>Doline Store works without an internet connection and syncs when it is back online. Until a change has synced, it exists only on the device it was made on.</p>
        <ul>
          <li>If a device is lost, broken, reset or the app is uninstalled before it syncs, those unsynced changes can be lost.</li>
          <li>Each device keeps a copy of your store&apos;s records. Lock your devices, and use the app&apos;s lock screen on shared tills.</li>
          <li>When two devices change the same record before syncing, one change may replace the other.</li>
        </ul>
        <p>Let devices sync regularly, and do not uninstall the app from a device that has changes waiting.</p>
      </Section>

      <Section title="12. Fees">
        <p>
          We may offer some features of Doline Store for a fee. Before you pay for anything, we will show you the price, what it covers and how it is billed. We
          will give you at least 30 days&apos; notice before charging for a feature that is free today, and you may stop using it before the charge starts.
        </p>
      </Section>

      <Section title="13. Third-party services">
        <p>
          Doline Store relies on services run by other companies: cloud hosting, Google sign-in, push notifications, AI models for Lilli, barcode lookups and
          exchange rates. Our Privacy Policy lists them. Their own terms apply to your use of their parts, for example Google&apos;s terms when you sign in with
          Google. We are not responsible for an outage or change on their side, but we will work to keep Doline Store running if one happens.
        </p>
        <p>The Google Play Store, the Microsoft Store and any other place you download the app from have their own terms too.</p>
      </Section>

      <Section title="14. Updates">
        <p>
          We release new versions of Doline Store to fix problems, keep it secure and add features. Some updates change how your store&apos;s data is stored on the
          device. The app upgrades that data for you when it starts.
        </p>
        <p>Keep the app up to date. An old version may stop syncing once the cloud has moved on, and we may stop supporting versions more than 12 months old.</p>
      </Section>

      <Section title="15. Intellectual property">
        <p>
          Doline Store, DolineMarket, Lilli, the Doline name and logos, and the software, designs, manual and content we provide belong to Doline Technologies Limited or our
          licensors. While you follow these terms, we give you a non-exclusive, non-transferable right to install and use Doline Store for your business. We keep
          all other rights.
        </p>
        <p>If you send us feedback or ideas, we may use them without owing you anything.</p>
      </Section>

      <Section title="16. Suspension and closing your account">
        <p>
          You can stop using Doline Store at any time. To close your account and delete your store&apos;s data from our cloud, email us from the address on the
          account. We will confirm before deleting anything. Data on your own devices stays there until you uninstall the app or delete it.
        </p>
        <p>We may suspend or close your account, or remove a store or listing, if:</p>
        <ul>
          <li>you break these terms, or we reasonably believe your use is unlawful or puts others at risk;</li>
          <li>we are required to by law or by an authority;</li>
          <li>your account has been inactive for more than 24 months, after we have warned you by email.</li>
        </ul>
        <p>
          Where we reasonably can, we will tell you first and give you a chance to fix the problem. Before closing a store for a reason other than a serious
          breach, we will give you at least 30 days to ask for a copy of its data.
        </p>
        <p>Sections 5, 9, 10 and 15 to 20 continue to apply after your account closes.</p>
      </Section>

      <Section title="17. Disclaimers">
        <p>
          We work to keep Doline Store accurate, secure and available, but we provide it &quot;as is&quot; and &quot;as available&quot;. To the extent the law
          allows, we make no promise that it will be uninterrupted or free of errors, that it will suit your particular business, or that data will never be lost.
          Keep your own records of anything you cannot afford to lose.
        </p>
      </Section>

      <Section title="18. Limitation of liability">
        <p>To the extent the law allows:</p>
        <ul>
          <li>we are not liable for lost profits, revenue, business or goodwill, or for any indirect or consequential loss;</li>
          <li>we are not liable for losses caused by your staff, by someone using your account or devices, by data you entered, or by a third-party service;</li>
          <li>
            our total liability to you for all claims about Doline Store in any 12 months is limited to the greater of the fees you paid us for it in those 12
            months and UGX 500,000.
          </li>
        </ul>
        <p>
          Nothing in these terms limits liability for fraud, for death or personal injury caused by negligence, or for anything else that cannot be limited under
          the law of Uganda.
        </p>
      </Section>

      <Section title="19. Indemnity">
        <p>
          You will cover our reasonable losses and costs from a claim by someone else that arises from your breach of these terms, your listings, your sales to
          shoppers, or how you handled your customers&apos;, staff&apos;s or suppliers&apos; personal data.
        </p>
      </Section>

      <Section title="20. Governing law and disputes">
        <p>These terms are governed by the laws of the Republic of Uganda.</p>
        <p>
          If you have a complaint, contact us first. We will try to settle it with you within 30 days. If we cannot, either of us may take it to the courts of
          Uganda, which will have exclusive jurisdiction. This does not take away any right you have under consumer law to bring a claim where you live.
        </p>
      </Section>

      <Section title="21. Changes to these terms">
        <p>
          We may update these terms as Doline Store and the law change. The date at the top shows the current version. For a change that materially affects you,
          we will tell you in the app or by email at least 14 days before it takes effect. If you keep using Doline Store after that, the new terms apply. If you
          do not agree, stop using it and ask us to close your account.
        </p>
        <p>
          If any part of these terms cannot be enforced, the rest still applies. If we do not enforce a term straight away, we can still enforce it later. You may
          not transfer these terms to someone else without our agreement; we may transfer them to a company that takes over Doline Store, and will tell you if we
          do.
        </p>
      </Section>

      <Section title="22. Contact us">
        <Contact closing="You can also reach us from Help and feedback in the app." />
      </Section>
    </LegalPage>
  );
}
