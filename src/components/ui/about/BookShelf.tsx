import { useMemo } from "react";
import { motion } from "framer-motion";
import { ColorPalette } from "../../../utils/colors";

const BookShelf = ({ readingInView }: { readingInView: boolean }) => {
  const shelves = [
    [0, 1, 0, 2, 3],
    [5, 4, 6],
    [0, 0, 3, 4],
    [0, 0, 2, 6, 1, 5],
  ];

  const getBookColor = (color: number) => {
    return color === 1
      ? ColorPalette.Pink
      : color === 2
      ? ColorPalette.Green
      : color === 3
      ? ColorPalette.Blue
      : color === 4
      ? ColorPalette.Orange
      : color === 5
      ? ColorPalette.Yellow
      : ColorPalette.Indigo;
  };

  const randomBooks = useMemo(() => {
    return shelves.map((shelf) =>
      shelf.map((book) =>
        book !== 0
          ? {
              backgroundColor: getBookColor(book),
              width: `${Math.random() * 10 + 20}px`,
              height: `${Math.random() * 30 + 70}px`,
              marginRight: `${Math.random() * 12}px`,
            }
          : null
      )
    );
  }, []);

  return (
    <div className="book-shelf">
      {randomBooks.map((shelf, shelfIndex) => (
        <motion.div
          key={`shelf-${shelfIndex}`}
          className="shelf"
          initial={{ x: 50, opacity: 0 }}
          animate={readingInView ? { x: 0, opacity: 1 } : {}}
          transition={{ delay: 0.3 + shelfIndex * 0.2 }}
        >
          {shelf.map((book, i) =>
            book ? (
              <motion.div
                key={`${shelfIndex}-${i}`}
                className="book"
                whileHover={{ rotateZ: 5 }}
                style={book}
              />
            ) : (
              <div
                key={`${shelfIndex}-${i}`}
                className="book"
                style={{ visibility: "hidden" }}
              />
            )
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default BookShelf;
