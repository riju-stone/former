"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const { formBuilderData, reorderFormBlocks, setFormBlocks } = useFormStore();

  const blockIds = useMemo(() => Object.keys(formBuilderData), [formBuilderData]);

  // Local items state: only element arrays per block, used for real-time drag updates.
  // The store is only updated once on drag end.
  const [items, setItems] = useState<Record<string, FormElement[]>>(() =>
    Object.fromEntries(blockIds.map((id) => [id, formBuilderData[id].formBlockElements])),
  );

  const snapshot = useRef<Record<string, FormElement[]>>(structuredClone(items));
  const isDraggingRef = useRef(false);
  // Always reflects the latest items — avoids stale closure in handleDragEnd
  // because onDragOver updates items via functional setState, not a direct reference.
  const itemsRef = useRef(items);

  // Sync local items from store whenever formBuilderData changes
  // (but not during a drag, to avoid interrupting in-progress drag operations)
  useEffect(() => {
    if (!isDraggingRef.current) {
      const synced = Object.fromEntries(blockIds.map((id) => [id, formBuilderData[id].formBlockElements]));
      setItems(synced);
      itemsRef.current = synced;
    }
  }, [blockIds, formBuilderData]);

  const handleDragStart = useCallback<DragDropEventHandlers["onDragStart"]>(() => {
    isDraggingRef.current = true;
    snapshot.current = structuredClone(itemsRef.current);
  }, []);

  const handleDragOver = useCallback<DragDropEventHandlers["onDragOver"]>((event) => {
    const { source } = event.operation;

    // Only move elements across blocks, not blocks themselves
    if (source && source.type === "form-block") {
      return;
    }

    // Use functional setState so each onDragOver operates on the latest items,
    // matching @dnd-kit's internal position tracking for cross-block moves.
    setItems((currentItems) => {
      const newItems = move(currentItems, event);
      itemsRef.current = newItems;
      return newItems;
    });
  }, []);

  const handleDragEnd = useCallback<DragDropEventHandlers["onDragEnd"]>(
    (event) => {
      isDraggingRef.current = false;

      if (event.canceled) {
        setItems(snapshot.current);
        itemsRef.current = snapshot.current;
        return;
      }

      const { source, target } = event.operation;

      // Handle block reordering
      if (source?.type === "form-block" && target?.type === "form-block") {
        const sourceIndex = blockIds.indexOf(source.id as string);
        const targetIndex = blockIds.indexOf(target.id as string);

        if (sourceIndex !== -1 && targetIndex !== -1) {
          const newBlockIds = [...blockIds];
          const [moved] = newBlockIds.splice(sourceIndex, 1);
          newBlockIds.splice(targetIndex, 0, moved);
          reorderFormBlocks(newBlockIds);
        }
        return;
      }

      // Final element positions are already computed by onDragOver — commit to store
      const finalItems = itemsRef.current;
      const newBlocks: Record<string, FormBuilderData> = {};
      for (const id of blockIds) {
        newBlocks[id] = { ...formBuilderData[id], formBlockElements: finalItems[id] ?? [] };
      }
      setFormBlocks(newBlocks);
    },
    [blockIds, formBuilderData, reorderFormBlocks, setFormBlocks],
  );

  return (
    <DragDropProvider
      plugins={defaultPreset.plugins}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full w-full overflow-x-auto overflow-y-hidden">
        <div className="h-full inline-flex justify-start items-start px-2">
          <AnimatePresence>
            {blockIds.map((key, index) => (
              <FormBlockComponent key={`form-block-${key}`} id={key} index={index} elements={items[key] ?? []} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DragDropProvider>
  );
}

export default FormBuilderComponent;
