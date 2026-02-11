export default function Page() {
  return (
    <article className="rounded-[8px] border border-[#d8e5f8] bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.08)] sm:p-8">
      <h2 className="text-2xl font-bold text-[#333333]">Your Privacy Matters</h2>
      <p className="mt-3 text-sm leading-7 text-[#666666]">
        UniGuide collects only the information required to provide university recommendations, authentication, and
        account personalization. We do not sell personal information to third parties.
      </p>

      <section className="mt-6 space-y-4 text-sm leading-7 text-[#666666]">
        <div>
          <h3 className="text-base font-semibold text-[#333333]">1. Information We Collect</h3>
          <p>Profile details, account credentials, and user preferences required for recommendations and account management.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#333333]">2. How We Use Data</h3>
          <p>To deliver personalized search results, maintain account security, and improve platform quality.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#333333]">3. Data Security</h3>
          <p>We apply industry-standard security controls and role-based protections for sensitive operations.</p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#333333]">4. Contact</h3>
          <p>For privacy questions, contact: support@uniguide.com</p>
        </div>
      </section>
    </article>
  );
}
