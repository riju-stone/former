"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useFormStore } from "@/store/formStore";
import FormTypes from "@/lib/formTypes";

import { ChevronDown, FileText, ScrollText, CircleDot, Hash, Link2, Calendar1 } from "lucide-react"

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
        "absolute left-[50%] my-[0.5rem] z-10 h-[274px] w-[300px] flex justify-center align-middle bg-white border-[1px] border-gray-200 rounded-xl shadow-dropdown p-1 overflow-hidden",
    dropdownListContainer:
        "h-full w-full flex flex-col justify-center align-middle",
    dropdownListHeading:
        "h-full w-full font-[600] text-[12px] text-gray-500 uppercase rounded-lg bg-gray-50 leading-4 px-4 py-2 mb-1",
    dropdownListItem:
        "h-full w-full flex justify-start align-middle gap-2 p-2 text-[14px] font-medium break-keep rounded-lg bg-gray-00 hover:bg-gray-50 cursor-pointer",
};

function getDropdownAnimObject(type: string) {
    return {
        closed: {
            opacity: 0,
            y: type == "down" ? -20 : -295,
            x: -275,
            transition: {
                duration: 0.3,
                delay: 0.15,
                ease: [0.85, 0, 0.15, 1],
                opacity: {
                    delay: 0.15,
                },
            },
        },
        open: {
            opacity: 1,
            y: type == "down" ? 12 : -320,
            x: -275,
            transition: {
                duration: 0.4,
                ease: [0.85, 0, 0.15, 1],
                opacity: {
                    delay: 0.08,
                },
            },
        },
    };

}

function FormTypeLogo({ type }) {
    switch (type) {
        case "short":
            return <FileText size={18} />
        case "long":
            return <ScrollText size={18} />
        case "option":
            return <CircleDot size={18} />
        case "number":
            return <Hash size={18} />
        case "date":
            return <Calendar1 size={18} />
        case "url":
            return <Link2 size={18} />
    }
}

function Dropdown({ menuType, isMenuOpen, handleSelection }) {
    return <AnimatePresence mode="wait">
        {isMenuOpen && (
            <motion.div
                className={`${styles.dropdownWrapper}`}
                variants={getDropdownAnimObject(menuType)}
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
                                    <FormTypeLogo type={type.tag} />
                                </span>
                                <span>{type.name}</span>
                            </div>
                        );
                    })}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
}


function FormDropdownComponent({ id, element }) {
    const dropRef = useRef(null)
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [menuType, setMenuType] = useState("down");
    const modifyElement = useFormStore((state) => state.updateElementType);

    const handleSelection = (e) => {
        const elType = e.currentTarget.getAttribute("data-item");
        modifyElement(id, elType);
        setMenuOpen(false);
    };

    useEffect(() => {
        if (dropRef.current) {
            const rect = dropRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2) setMenuType("down")
            else setMenuType("up")
        }

        function handleMenuClose(event) {
            console.log(event)
        }

        window.addEventListener("click", handleMenuClose);

        return () => {
            window.removeEventListener("click", handleMenuClose);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropRef}>
            <button
                onClick={() => setMenuOpen(!isMenuOpen)} className="h-[1.25rem] flex justify-center items-center gap-1 py-1">
                <div className="opacity-50">
                    <AnimatePresence mode="wait">
                        <motion.div key={element.type} initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}>
                            <FormTypeLogo type={element.type} />
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="h-full w-full">
                    <motion.div
                        className="w-full h-full flex justify-center items-center opacity-50"
                        initial={{ rotateZ: 0 }}
                        animate={isMenuOpen ? { rotateZ: 180 } : { rotateZ: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown size={18} />
                    </motion.div>
                </div>
            </button>
            <Dropdown menuType={menuType} isMenuOpen={isMenuOpen} handleSelection={handleSelection} />
        </div>
    );
}

export default FormDropdownComponent;
