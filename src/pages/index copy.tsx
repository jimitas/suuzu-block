import * as se from "src/components/se";
import styles from "@/styles/Home.module.css";
import { useRef, useState } from "react";

const CASES_COUNT = 2;
const ROWS_COUNT = 2;
const COLUMNS_COUNT = 5;
const BLOCKS_COUNT = CASES_COUNT * ROWS_COUNT * COLUMNS_COUNT;

export default function Home() {
  const blockRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [rotationAngles, setRotationAngles] = useState<number[]>(new Array(BLOCKS_COUNT).fill(0));
  const [isFlipped, setIsFlipped] = useState(new Array(BLOCKS_COUNT).fill(false));
  const [blockColors, setBlockColors] = useState<string[]>(new Array(BLOCKS_COUNT).fill("pink"));
  const [lastClickTimestamp, setLastClickTimestamp] = useState<number>(0);


  //ダブルクリックの判定
  const handleClick = (blockIndex: number) => {
    const currentTimestamp = Date.now();
    if (currentTimestamp - lastClickTimestamp <= 500) {
      handleBlockDoubleClick(blockIndex);
    } else {
      se.pi.play();
    }
    setLastClickTimestamp(currentTimestamp);
  };
  

  //ブロックを裏返す
  const handleBlockDoubleClick = (blockIndex: number) => {
    se.kururin.play();

    setIsFlipped((prevFlipped) => {
      const newFlipped = [...prevFlipped];
      newFlipped[blockIndex] = !newFlipped[blockIndex];
      return newFlipped;
    });

    setBlockColors((prevColors) => {
      const newColors = [...prevColors];
      newColors[blockIndex] = prevColors[blockIndex] === "pink" ? "blue" : "pink";
      return newColors;
    });

    setRotationAngles((prevAngles) => {
      const newAngles = [...prevAngles];
      newAngles[blockIndex] += 180;
      return newAngles;
    });

    if (!blockRefs.current[blockIndex]) return;
    blockRefs.current[blockIndex]!.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.2)";
  };

  const handleTransitionEnd = (blockIndex: number) => {
    if (!blockRefs.current[blockIndex]) return;
    blockRefs.current[blockIndex]!.style.boxShadow = isFlipped[blockIndex]
      ? "-4px 4px 3px rgba(0, 0, 0, 0.5)"
      : "4px 4px 3px rgba(0, 0, 0, 0.5)";
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200">
        <h1 className="text-4xl font-bold text-gray-700">すうず　ぶろっく</h1>

        <div className="flex">
          {Array.from({ length: CASES_COUNT }).map((_, caseIndex) => (
            <div key={caseIndex} className="border-2 p-4 m-4">
              {Array.from({ length: ROWS_COUNT }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {Array.from({ length: COLUMNS_COUNT }).map((_, columnIndex) => {
                    const blockIndex =
                      caseIndex * (ROWS_COUNT * COLUMNS_COUNT) + rowIndex * COLUMNS_COUNT + columnIndex;
                    return (
                      <div
                        key={blockIndex}
                        ref={(el) => (blockRefs.current[blockIndex] = el)}
                        className={styles.suuzuBlockOuter}
                        onClick={() => handleClick(blockIndex)}
                        onTransitionEnd={() => handleTransitionEnd(blockIndex)}
                        style={{
                          transform: `rotateY(${rotationAngles[blockIndex]}deg)`,
                        }}
                      >
                        <div
                          className={styles.suuzuBlockInner}
                          style={{ backgroundColor: blockColors[blockIndex] }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
