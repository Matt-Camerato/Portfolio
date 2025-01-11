import { motion } from "framer-motion";
import { ColorPalette } from "../../../utils/colors";

const createButtonVariants = () => ({
  idle: {
    scale: 1,
  },
  pressing: {
    scale: [1, 0.9, 1],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      repeatDelay: Math.random() * 12 + 3, // Random delay between 3-15 seconds
    },
  },
});

const createDpadVariants = () => ({
  idle: {
    scale: 1,
  },
  pressing: {
    scale: [1, 0.95, 1],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      repeatDelay: Math.random() * 12 + 3, // Random delay between 3-15 seconds
    },
  },
});

const AnimatedController = () => {
  const northButtonVariants = createButtonVariants();
  const eastButtonVariants = createButtonVariants();
  const southButtonVariants = createButtonVariants();
  const westButtonVariants = createButtonVariants();

  const northDpadVariants = createDpadVariants();
  const eastDpadVariants = createDpadVariants();
  const southDpadVariants = createDpadVariants();
  const westDpadVariants = createDpadVariants();

  return (
    <motion.div className="controller-blueprint">
      <svg viewBox="22.14 15 1080 1080" xmlns="http://www.w3.org/2000/svg">
        {/* Base Left */}
        <motion.path
          d="M 353.648 154.69 C 353.648 154.69 330.048 166.303 294.907 154.69 L 294.907 143.181 C 289.063 140.64 281.207 137.999 267.451 136.774 C 243.406 134.634 226.287 136.84 209.426 148.109 L 209.426 152.371 C 206.946 153.992 204.715 155.964 202.801 158.225 C 190.554 172.514 155.528 232.516 136.676 337.847 C 126.969 392.082 119.738 435.285 117.901 467.791 C 113.88 510.031 129.301 533.723 129.301 533.723 C 162.272 581.6 208.9 570.868 208.9 570.868 C 225.819 567.111 252.785 555.851 262.057 521.487 C 262.057 521.487 284.727 429.057 295.911 422.346 C 308.159 414.997 307.567 413.495 311.344 414.312 C 315.121 415.129 330.125 427.377 348.294 427.887 C 366.463 428.397 380.752 425.642 388.306 420.844 C 395.86 416.046 400.657 409.718 402.392 409.616 C 403.292 409.563 425.555 409.565 446.892 409.579 L 446.892 409.616 C 446.892 409.616 455.151 409.606 466.47 409.595"
          transform="translate(96.05, 226.09)"
          stroke={ColorPalette.Indigo}
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Base Right */}
        <motion.path
          d="M 230.053 154.69 C 230.053 154.69 253.653 166.303 288.794 154.69 L 288.794 143.181 C 294.638 140.64 302.494 137.999 316.25 136.774 C 340.295 134.634 357.414 136.84 374.275 148.109 L 374.275 152.371 C 376.755 153.992 378.986 155.964 380.9 158.225 C 393.147 172.514 428.173 232.516 447.025 337.847 C 456.732 392.082 463.963 435.285 465.8 467.791 C 469.821 510.031 454.4 533.723 454.4 533.723 C 421.429 581.6 374.8 570.868 374.8 570.868 C 357.881 567.111 330.915 555.851 321.643 521.487 C 321.643 521.487 298.973 429.057 287.789 422.346 C 275.541 414.997 276.133 413.495 272.356 414.311 C 268.579 415.127 253.575 427.376 235.406 427.886 C 217.237 428.396 202.948 425.641 195.394 420.843 C 187.84 416.045 183.043 409.717 181.308 409.615 C 180.408 409.563 158.145 409.564 136.808 409.578 L 136.808 409.615 C 136.808 409.615 128.549 409.605 117.23 409.594"
          transform="translate(445.13, 226.09)"
          stroke={ColorPalette.Indigo}
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Center Rectangle Button */}
        <motion.path
          d="M 17.822 0 L 211.717 0 C 221.584 0.025 229.563 8.044 229.539 17.911 L 229.539 109.065 C 229.563 118.932 221.584 126.951 211.717 126.976 L 17.822 126.976 C 7.955 126.951 -0.024 118.932 0 109.065 L 0 17.911 C -0.024 8.044 7.955 0.025 17.822 0 Z"
          transform="translate(447.41, 371.84)"
          stroke={ColorPalette.Blue}
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            delay: 1,
          }}
        />

        {/* Left Joystick Outline Circle */}
        <motion.circle
          cx="449.36"
          cy="578.31"
          r="45.762"
          stroke={ColorPalette.Orange}
          strokeWidth="2"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        />

        {/* Left Joystick */}
        <motion.circle
          cx="450.87"
          cy="577.99"
          r="27.65"
          stroke={ColorPalette.Orange}
          strokeWidth="3"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={["visible", "moving"]}
          variants={{
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.5, delay: 2 },
            },
            moving: {
              x: [0, -3, 3, -3, 3, 0, 4, -4, 3, 0],
              y: [0, 3, -3, 3, -3, 0, 4, -4, -3, 0],
              transition: {
                duration: 5,
                delay: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
        />

        {/* Right Joystick Outline Circle */}
        <motion.circle
          cx="673.25"
          cy="578.31"
          r="45.762"
          stroke={ColorPalette.Orange}
          strokeWidth="2"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        />

        {/* Right Joystick */}
        <motion.circle
          cx=" 673.93"
          cy="577.99"
          r="27.65"
          stroke={ColorPalette.Orange}
          strokeWidth="3"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={["visible", "moving"]}
          variants={{
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.5, delay: 2 },
            },
            moving: {
              x: [0, 4, -3, 3, 0, -3, -4, 0, 5, -3, 0],
              y: [0, 4, -3, 3, 0, 3, -3, 0, 5, 4, 0],
              transition: {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
            },
          }}
        />

        {/* North D-Pad Button */}
        <motion.g transform="translate(40.61, 199.36)">
          <motion.path
            d="M 288.121 227.315 L 310.564 227.315 C 314.706 227.315 318.064 230.673 318.064 234.815 L 318.064 254.428 C 318.063 256.417 317.272 258.323 315.864 259.728 L 304.987 270.6 C 302.059 273.525 297.315 273.525 294.387 270.6 L 283.15 259.365 C 281.776 257.99 280.99 256.136 280.956 254.193 L 280.628 234.939 C 280.595 232.93 281.369 230.991 282.778 229.558 C 284.187 228.125 286.111 227.317 288.121 227.315 Z"
            stroke={ColorPalette.Pink}
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={["visible", "pressing"]}
            variants={{
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.6, delay: 2.5 },
              },
              pressing: northDpadVariants.pressing,
            }}
          />
        </motion.g>

        {/* East D-Pad Button */}
        <motion.g transform="translate(25.73, 179.85)">
          <motion.path
            d="M 369.619 291.879 L 369.619 314.322 C 369.619 318.46413562373095 366.261135623731 321.822 362.119 321.822 L 342.51 321.822 C 340.5214148761852 321.8209086558562 338.61479970465007 321.02948349031334 337.21 319.622 L 326.332 308.745 C 323.4074662194248 305.81682453226045 323.4074662194248 301.07317546773953 326.332 298.145 L 337.569 286.90799999999996 C 338.94337805745977 285.53443013360805 340.7972025593965 284.7478722227109 342.74 284.71399999999994 L 362 284.385 C 364.00862150825446 284.3531254030817 365.9460703188795 285.1283825146834 367.37825893987576 286.53707414426026 C 368.8104475608721 287.94576577383714 369.61764579182164 289.8701260568489 369.619 291.879 Z"
            stroke={ColorPalette.Pink}
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={["visible", "pressing"]}
            variants={{
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.6, delay: 2.6 },
              },
              pressing: eastDpadVariants.pressing,
            }}
          />
        </motion.g>

        {/* South D-Pad Button */}
        <motion.g transform="translate(59.76, 179.85)">
          <motion.path
            d="M 224.577 314.322 L 224.577 291.88 C 224.57976012252502 287.7398171323562 227.9368162123154 284.3849990799591 232.077 284.385 L 251.69 284.385 C 253.6785851238148 284.3860913441438 255.58520029534992 285.17751650968665 256.99 286.585 L 267.868 297.46299999999997 C 270.7925337805751 300.3911754677395 270.7925337805752 305.13482453226044 267.868 308.063 L 256.631 319.299 C 255.256782572135 320.67293671274774 253.40293854426105 321.4598614161288 251.45999999999998 321.49399999999997 L 232.206 321.82199999999995 C 230.19462013330414 321.8566008742617 228.25365725330718 321.0817259881655 226.81910969037278 319.67143542295275 C 225.3845621274384 318.2611448577401 224.57670241028066 316.3336774344038 224.577 314.322 Z"
            stroke={ColorPalette.Pink}
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={["visible", "pressing"]}
            variants={{
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.6, delay: 2.7 },
              },
              pressing: southDpadVariants.pressing,
            }}
          />
        </motion.g>

        {/* West D-Pad Button */}
        <motion.g transform="translate(40.61, 164.58)">
          <motion.path
            d="M 310.564 374.528 L 288.121 374.528 C 283.98081621231535 374.52800092004094 280.623760122525 371.1731828676438 280.621 367.033 L 280.621 347.42 C 280.62275052039877 345.431546496905 281.4140751262404 343.52517358283205 282.82099999999997 342.12 L 293.7 331.243 C 296.62817546773954 328.3184662194248 301.37182453226046 328.3184662194248 304.3 331.243 L 315.536 342.48 C 316.9098080630927 343.85462555927114 317.6963854976607 345.70885458916416 317.73 347.65200000000004 L 318.058 366.90600000000006 C 318.09068673674943 368.9151371296967 317.315789366563 370.8533636983183 315.90700903247426 372.28620646672294 C 314.4982286983855 373.7190492351276 312.5734025551548 374.5266583509556 310.564 374.528 Z"
            stroke={ColorPalette.Pink}
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={["visible", "pressing"]}
            variants={{
              visible: {
                pathLength: 1,
                opacity: 1,
                transition: { duration: 0.6, delay: 2.8 },
              },
              pressing: westDpadVariants.pressing,
            }}
          />
        </motion.g>

        {/* North Circle Button */}
        <motion.circle
          cx="782.8"
          cy="431.36"
          r="21.843"
          stroke={ColorPalette.Green}
          strokeWidth="3"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={["visible", "pressing"]}
          variants={{
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.6, delay: 2.7 },
            },
            pressing: northButtonVariants.pressing,
          }}
        />

        {/* East Circle Button */}
        <motion.circle
          cx="835.06"
          cy="481.58"
          r="21.843"
          stroke={ColorPalette.Pink}
          strokeWidth="3"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={["visible", "pressing"]}
          variants={{
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.6, delay: 2.8 },
            },
            pressing: eastButtonVariants.pressing,
          }}
        />

        {/* South Circle Button */}
        <motion.circle
          cx="784.84"
          cy="534.18"
          r="21.843"
          stroke={ColorPalette.Blue}
          strokeWidth="3"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={["visible", "pressing"]}
          variants={{
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.6, delay: 2.9 },
            },
            pressing: southButtonVariants.pressing,
          }}
        />

        {/* West Circle Button */}
        <motion.circle
          cx="732.17"
          cy="481.58"
          r="21.843"
          stroke={ColorPalette.Purple}
          strokeWidth="3"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={["visible", "pressing"]}
          variants={{
            visible: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.6, delay: 3 },
            },
            pressing: westButtonVariants.pressing,
          }}
        />

        {/* Select Button */}
        <motion.g transform="translate(422.59, 415.63)">
          <motion.rect
            x="-11.705"
            y="-19.735"
            width="23.41"
            height="39.47"
            rx="11.704"
            ry="11.704"
            stroke={ColorPalette.Yellow}
            strokeWidth="2"
            fill="none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 3.1 }}
          />
        </motion.g>

        {/* Start Button */}
        <motion.g transform="translate(708.85, 415.63)">
          <motion.rect
            x="-11.705"
            y="-19.735"
            width="23.41"
            height="39.47"
            rx="11.704"
            ry="11.704"
            stroke={ColorPalette.Yellow}
            strokeWidth="2"
            fill="none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 3.2 }}
          />
        </motion.g>

        {/* Console Button */}
        <motion.circle
          cx="561.78"
          cy=" 583.44"
          r="20.006"
          stroke={ColorPalette.Purple}
          strokeWidth="3"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 3.3 }}
        />
      </svg>
    </motion.div>
  );
};

export default AnimatedController;
