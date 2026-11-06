import { useEffect, useRef } from "react";
import { MIN_Y } from "../constants/BOTTOM_SHEET";

const useBottomSheet = (initialHeight = 0.5) => {
  const sheet = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sheetElement = sheet.current;
    const handleElement = handle.current;

    if (!sheetElement || !handleElement) return;

    let isDragging = false;
    let startY = 0;
    let startSheetY = 0;

    const MIN_SHEET_HEIGHT = 60;

    const getMaxY = () => {
      return Math.max(0, window.innerHeight - MIN_SHEET_HEIGHT);
    };

    const clampY = (y: number) => {
      const minY = Math.min(MIN_Y, getMaxY());

      return Math.min(Math.max(y, minY), getMaxY());
    };

    const setSheetPosition = (y: number, animated = true) => {
      const nextY = clampY(y);

      sheetElement.style.transition = animated
        ? "top 0.3s ease-out, height 0.3s ease-out"
        : "none";

      sheetElement.style.top = `${nextY}px`;
      sheetElement.style.height = `${window.innerHeight - nextY}px`;
    };

    const getSnapPoints = () => {
      return [clampY(MIN_Y), clampY(window.innerHeight / 2), getMaxY()];
    };

    const findNearestSnapPoint = (currentY: number) => {
      const snapPoints = getSnapPoints();

      return snapPoints.reduce((nearest, point) =>
        Math.abs(point - currentY) < Math.abs(nearest - currentY)
          ? point
          : nearest,
      );
    };

    const initialY = window.innerHeight * (1 - initialHeight);

    setSheetPosition(initialY, false);

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      isDragging = true;

      startY = event.clientY;
      startSheetY = sheetElement.getBoundingClientRect().top;

      handleElement.setPointerCapture(event.pointerId);
      sheetElement.style.transition = "none";
    };

    // 드래그 중
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return;

      const deltaY = event.clientY - startY;

      setSheetPosition(startSheetY + deltaY, false);
    };

    const finishDragging = (event: PointerEvent) => {
      if (!isDragging) return;

      isDragging = false;

      if (handleElement.hasPointerCapture(event.pointerId)) {
        handleElement.releasePointerCapture(event.pointerId);
      }

      const currentY = sheetElement.getBoundingClientRect().top;

      const nearestSnap = findNearestSnapPoint(currentY);

      setSheetPosition(nearestSnap, true);
    };

    const handleResize = () => {
      const currentY = sheetElement.getBoundingClientRect().top;

      setSheetPosition(findNearestSnapPoint(currentY), false);
    };

    handleElement.addEventListener("pointerdown", handlePointerDown);
    handleElement.addEventListener("pointermove", handlePointerMove);
    handleElement.addEventListener("pointerup", finishDragging);
    handleElement.addEventListener("pointercancel", finishDragging);

    window.addEventListener("resize", handleResize);

    return () => {
      handleElement.removeEventListener("pointerdown", handlePointerDown);
      handleElement.removeEventListener("pointermove", handlePointerMove);
      handleElement.removeEventListener("pointerup", finishDragging);
      handleElement.removeEventListener("pointercancel", finishDragging);

      window.removeEventListener("resize", handleResize);
    };
  }, [initialHeight]);

  return { sheet, handle, content };
};

export default useBottomSheet;
