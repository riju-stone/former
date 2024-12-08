import ShortAnswer from "@/assets/icons/short.svg";
import LongAnswer from "@/assets/icons/long.svg";
import Check from "@/assets/icons/check.svg";
import Url from "@/assets/icons/url.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Hash from "@/assets/icons/hash.svg";

const FormTypes = [
  {
    name: "Short answer",
    tag: "short",
    logo: ShortAnswer,
  },
  {
    name: "Long Answer",
    tag: "long",
    logo: LongAnswer,
  },
  {
    name: "Single select",
    tag: "option",
    logo: Check,
  },
  {
    name: "Number",
    tag: "number",
    logo: Hash,
  },
  {
    name: "URL",
    tag: "url",
    logo: Url,
  },
  {
    name: "Date",
    tag: "date",
    logo: Calendar,
  },
];

export default FormTypes;
