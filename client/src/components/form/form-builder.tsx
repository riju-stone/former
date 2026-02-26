"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { DragDropProvider } from "@dnd-kit/react";
import { defaultPreset, KeyboardSensor, PointerSensor } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import type { DragDropEventHandlers } from "@dnd-kit/react";

import { useFormStore } from "@/store/formBuilderStore";
import FormBlockComponent from "./form-block";
import type { FormBuilderData, FormElement } from "@/types/formBuilderState";

const sensors = [
  PointerSensor.configure({
    activatorElements(source) {
      return [source.element, source.handle];
    },
  }),
  KeyboardSensor,
];

function FormBuilderComponent() {
  const { formBuilderData, setFormBlocks } = useFormStore();
  const blockIds = useMemo(() => Object.keys(formBuilderData), [formBuilderData]);
  const snapshot = useRef<Record<string, FormBuilderData>>({});
  const isDraggingRef = useRef(false);

  const handleDragStart = useCallback<DragDropEventHandlers["onDragStart"]>(() => {
    isDraggingRef.current = true;
    snapshot.current = structuredClone(formBuilderData);
  }, [formBuilderData]);

  const handleDragOver = useCallback<DragDropEventHandlers["onDragOver"]>(
    (event) => {
      const { source, target } = event.operation;

      // Handle block reordering during drag - update store directly
      if (source && source.type === "form-block" && target && target.type === "form-block") {
        const currentBlockIds = Object.keys(formBuilderData);
        const sourceIndex = currentBlockIds.indexOf(source.id as string);
        const targetIndex = currentBlockIds.indexOf(target.id as string);

        if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
          const newBlockIds = [...currentBlockIds];
          const [moved] = newBlockIds.splice(sourceIndex, 1);
          newBlockIds.splice(targetIndex, 0, moved);

          const newBlocks: Record<string, FormBuilderData> = {};
          for (const id of newBlockIds) {
            newBlocks[id] = formBuilderData[id];
          }
          setFormBlocks(newBlocks);
        }
        return;
      }

      // Only move elements, not blocks
      if (source && source.type === "form-block") {
        return;
      }

      // Handle element reordering - update store directly
      const items: Record<string, FormElement[]> = {};
      Object.keys(formBuilderData).forEach((id) => {
        items[id] = formBuilderData[id].formBlockElements;
      });

      const newItems = move(items, event);
      const newBlocks: Record<string, FormBuilderData> = {};
      Object.keys(formBuilderData).forEach((id) => {
        newBlocks[id] = { ...formBuilderData[id], formBlockElements: newItems[id] ?? [] };
      });
      setFormBlocks(newBlocks);
    },
    [formBuilderData, setFormBlocks],
  );

  const handleDragEnd = useCallback<DragDropEventHandlers["onDragEnd"]>(
    (event) => {
      isDraggingRef.current = false;

      if (event.canceled) {
        setFormBlocks(snapshot.current);
      }
    },
    [setFormBlocks],
  );

  return (
    <DragDropProvider
      plugins={defaultPreset.plugins}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full w-full overflow-auto">
        <div className="h-full inline-flex justify-start items-start px-2">
          <AnimatePresence mode="popLayout">
            {blockIds.map((key, index) => (
              <FormBlockComponent
                key={key}
                id={key}
                index={index}
                elements={formBuilderData[key]?.formBlockElements ?? []}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DragDropProvider>
  );
}

export default FormBuilderComponent;
