"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import ShortAnswer from "@/assets/icons/short.svg";
import LongAnswer from "@/assets/icons/long.svg";
import Check from "@/assets/icons/check.svg";
import Url from "@/assets/icons/url.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Hash from "@/assets/icons/hash.svg";

import Image from "next/image";
import { useFormStore } from "@/store/formStore";

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

const listWrapperAnim = {
  closed: {
    opacity: 0,
    height: "0px",
    transition: {
      duration: 0.4,
      delay: 0.2,
      ease: [0.85, 0, 0.15, 1],
      opacity: {
        delay: 0.25,
      },
    },
  },
  open: {
    opacity: 1,
    height: "274px",
    transition: {
      duration: 0.4,
      ease: [0.85, 0, 0.15, 1],
      opacity: {
        delay: 0.08,
      },
    },
  },
};

const listItemsAnim = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: 0.25,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.25,
    },
  },
};

const styles = {
  dropdownWrapper:
    "absolute right-2 z-10 h-[274px] w-[300px] flex justify-center align-middle bg-white border-[1px] border-gray-200 rounded-xl shadow-dropdown p-1 overflow-hidden",
  dropdownListContainer:
    "h-full w-full flex flex-col justify-center align-middle",
  dropdownListHeading:
    "h-full w-full font-[600] text-[12px] text-gray-500 uppercase rounded-lg bg-gray-50 leading-4 px-4 py-2 mb-1",
  dropdownListItem:
    "h-full w-full flex justify-start align-middle gap-2 p-2 text-[14px] font-medium break-keep rounded-lg bg-gray-00 hover:bg-gray-50 cursor-pointer",
};

function FormDropdownComponent({ id, open, setMenuOpen }) {
  const modifyElement = useFormStore((state) => state.modifyElementType);

  const handleSelection = (e) => {
    const elType = e.currentTarget.getAttribute("data-item");
    modifyElement(id, elType);
    setMenuOpen(false);
  };

  useEffect(() => {
    function handleMenuClose(event) {
      if (event.srcElement.alt !== "form-type") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("click", handleMenuClose);

    return () => {
      window.removeEventListener("click", handleMenuClose);
    };
  });

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className={styles.dropdownWrapper}
          variants={listWrapperAnim}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.div
            className={styles.dropdownListContainer}
            variants={listItemsAnim}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className={styles.dropdownListHeading}>Input Types</div>
            {FormTypes.map((type) => {
              return (
                <div
                  key={type.tag}
                  data-item={type.tag}
                  className={styles.dropdownListItem}
                  onClick={(e) => handleSelection(e)}
                >
                  <span>
                    <Image src={type.logo} alt="logo" />
                  </span>
                  <span>{type.name}</span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FormDropdownComponent;
