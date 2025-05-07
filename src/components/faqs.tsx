import { useTranslations } from "next-intl";

const FAQs = () => {
  const t = useTranslations("HomePage.FAQs");

  const faqs = [
    {
      id: 1,
      question: t("questions.question1"),
      answer: t("questions.answer1"),
    },
    {
      id: 2,
      question: t("questions.question2"),
      answer: t("questions.answer2"),
    },
    {
      id: 3,
      question: t("questions.question3"),
      answer: t("questions.answer3"),
    },
    {
      id: 4,
      question: t("questions.question4"),
      answer: t("questions.answer4"),
    },
  ];
  return (
    <div className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold leading-10 tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-6 text-base leading-7 text-foreground/50">
            {t("description")}
          </p>
        </div>
        <div className="mt-12">
          <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
            {faqs.map((faq) => (
              <div key={faq.id}>
                <dt className="text-base font-semibold leading-7 text-foreground">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base leading-7 text-foreground/75">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export { FAQs };
