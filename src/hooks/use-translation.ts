import { getDictionary } from "@/i18n/get-dictionary";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Translation } from "@/types/translation";

export function useTranslation() {
  const { lang } = useParams();
  const [t, setT] = useState<Translation | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang as "fa" | "en");
      setT(dictionary.about);
    };
    loadDictionary();
  }, [lang]);

  return t;
}
