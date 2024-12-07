"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";

import ShortAnswer from "@/assets/icons/short.svg";
import LongAnswer from "@/assets/icons/long.svg";
import Check from "@/assets/icons/check.svg";
import Url from "@/assets/icons/url.svg";
import Calendar from "@/assets/icons/calendar.svg";
import Hash from "@/assets/icons/hash.svg";

import Image from "next/image";

const FormTypes = [
  {
    name: "Short answer",
    logo: ShortAnswer,
  },
  {
    name: "Long Answer",
    logo: LongAnswer,
  },
  {
    name: "Single select",
    logo: Check,
  },
  {
    name: "Number",
    logo: Hash,
  },
  {
    name: "URL",
    logo: Url,
  },
  {
    name: "Date",
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
        delay: 0.32,
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
    "absolute right-2 h-[274px] w-[300px] flex justify-center align-middle bg-white border-[1px] border-gray-200 rounded-xl shadow-dropdown p-1 overflow-hidden",
  dropdownListContainer:
    "h-full w-full flex flex-col justify-center align-middle",
  dropdownListHeading:
    "h-full w-full font-[600] text-[12px] text-gray-500 uppercase rounded-lg bg-gray-50 leading-4 px-4 py-2 mb-1",
  dropdownListItem:
    "h-full w-full flex justify-start align-middle gap-2 p-2 text-[14px] font-medium break-keep rounded-lg bg-gray-00 hover:bg-gray-50 cursor-pointer",
};

function FormDropdownComponent({ open }: { open: boolean }) {
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
            {FormTypes.map((type, index) => {
              return (
                <div
                  key={`form-type=${index}`}
                  className={styles.dropdownListItem}
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
