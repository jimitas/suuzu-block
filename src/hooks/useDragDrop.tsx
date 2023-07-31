import { useCallback } from "react";
import * as se from "src/components/se";

export const useDragDrop = () => {
  const dragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.draggable === true) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      dragged = e.target;
    }
  }, []);

  const dragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const dropEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    se.kako.play();
    if (e.target instanceof HTMLTableCellElement && e.target.classList.contains("droppable-elem")) {
      dragged?.parentNode?.removeChild(dragged);
      e.target.appendChild(dragged!);
      se.kako.play();
    }
  }, []);

  let dragged: HTMLElement | null;

  const touchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const touchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedElem = e.target as HTMLElement;
    const touch = e.changedTouches[0];
    draggedElem.style.position = "fixed";
    draggedElem.style.top = touch.pageY - window.pageYOffset - draggedElem.offsetHeight / 2 + "px";
    draggedElem.style.left = touch.pageX - window.pageXOffset - draggedElem.offsetWidth / 2 + "px";
  }, []);

  const touchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedElem = e.target as HTMLElement;
    droppedElem.style.position = "";
    droppedElem.style.top = "";
    droppedElem.style.left = "";
    const touch = e.changedTouches[0];
    const newParentElem = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);
    if (newParentElem instanceof HTMLTableCellElement && newParentElem.classList.contains("droppable-elem")) {
      newParentElem.appendChild(droppedElem);
      se.kako.play();
    }
  }, []);

  return { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd };
};
