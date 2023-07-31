import React, { useEffect } from "react";

import * as se from "src/components/se";
import styles from "src/components/Block/Block.module.css";
import { useRef, useState } from "react";
import { useDragDrop } from "@/hooks/useDragDrop";

interface BlockProps {
  leftBlockCount: number;
  rightBlockCount: number;
}

const divColor = ["#ff8082", "#005aff", "#ff8082", "#005aff"];

export const Block = (props: BlockProps) => {
  const el_blocksArea = useRef<HTMLDivElement>(null);
  const upLeftCount = props.leftBlockCount > 10 ? 10 : 0 || 0;
  const upRightCount = props.rightBlockCount > 10 ? 10 : 0 || 0;
  const loLeftCount =
    props.leftBlockCount > 10 ? props.leftBlockCount - 10 : props.leftBlockCount === 0 ? 0 : props.leftBlockCount || 10;
  const loRightCount =
    props.rightBlockCount > 10
      ? props.rightBlockCount - 10
      : props.rightBlockCount === 0
      ? 0
      : props.rightBlockCount || 10;
  const [count, setCount] = useState(0);

  const { dragStart, dragOver, dropEnd, touchStart, touchMove, touchEnd } = useDragDrop();

  // 数図ブロックの描画
  useEffect(() => {
    const ele = el_blocksArea.current;
    while (ele?.firstChild) {
      ele.removeChild(ele.firstChild);
    }

    for (let i = 0; i < 4; i++) {
      const TBL = document.createElement("table");
      ele!.appendChild(TBL);
      for (let j = 0; j < 2; j++) {
        const tr = document.createElement("tr");
        TBL.appendChild(tr);
        for (let k = 0; k < 5; k++) {
          const td = document.createElement("td");
          td.className = "droppable-elem";
          tr.appendChild(td);
          if (
            (i === 0 && j * 5 + k < upLeftCount) ||
            (i === 1 && j * 5 + k < upRightCount) ||
            (i === 2 && j * 5 + k < loLeftCount) ||
            (i === 3 && j * 5 + k < loRightCount)
          ) {
            let colorIndex = i;
            let touchStartFlag = false;
            const div = document.createElement("div");
            div.className = "draggable-elem";
            div.setAttribute("draggable", "true");
            div.style.backgroundColor = divColor[colorIndex];

            const colorChange = () => {
              se.pi.play();
              colorIndex++;
              div.style.backgroundColor = divColor[colorIndex % 2];
            };

            //150ミリ秒以内にタッチして指を離すとき，クリックイベントと同じ挙動とみなす。
            const touchStartEvent = () => {
              touchStartFlag === false ? (touchStartFlag = true) : (touchStartFlag = false);
              setTimeout(() => {
                touchStartFlag = false;
              }, 150);
            };

            const touchEndEvent = () => {
              touchStartFlag === true ? colorChange() : null;
            };

            div.addEventListener("click", colorChange, false);
            div.addEventListener("touchstart", touchStartEvent, false);
            div.addEventListener("touchend", touchEndEvent, false);
            td.appendChild(div);
          }
        }
      }
    }
  }, [count, upLeftCount, upRightCount, loLeftCount, loRightCount]);

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">すうず　ぶろっく</h1>
        <div
          ref={el_blocksArea}
          className={styles.table}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
          onDragStart={dragStart}
          onDragOver={dragOver}
          onDrop={dropEnd}
        ></div>
      </main>
    </>
  );
};
