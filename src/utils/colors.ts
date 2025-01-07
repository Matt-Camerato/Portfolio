//TODO: Remove the Bright/Dark variants if not needed
export const ColorPalette = {
  //Base Colors
  Black: "#333333",
  Gray: "#666666",
  White: "#E3E3DD",
  Yellow: "#E6DB74",
  Orange: "#F87D35",
  Purple: "#8C6BC8",
  Pink: "#C4265E",
  Blue: "#56ADBC",
  Green: "#86B42B",
  Pear: "#B3B42B",
  Indigo: "#6A7EC8",

  //Bright variants
  BrightBlack: "#666666",
  BrightGray: "#888888",
  BrightWhite: "#F8F8F2",
  BrightYellow: "#EDE497",
  BrightOrange: "#F99358",
  BrightPurple: "#AE81FF",
  BrightPink: "#F92672",
  BrightBlue: "#66D9EF",
  BrightGreen: "#A6E22E",
  BrightPear: "#E5E541",
  BrightIndigo: "#819AFF",

  //Dark Variants
  DarkBlack: "#111111",
  DarkGray: "#444444",
  DarkWhite: "#CDCDC1",
  DarkYellow: "#DDCD3C",
  DarkOrange: "#F66009",
  DarkPurple: "#6E45BA",
  DarkPink: "#96224A",
  DarkBlue: "#407882",
  DarkGreen: "#678627",
  DarkPear: "#8E8E29",
  DarkIndigo: "#4F64B0",
};

export const SkyColors = {
  night: "#1a1a2e",
  sunrise: {
    start: "#1a1a2e",
    middle: "#ff7b00",
    end: "#87ceeb",
  },
  day: "#87ceeb",
  sunset: {
    start: "#87ceeb",
    middle: "#ff7b00",
    end: "#1a1a2e",
  },
};

export const lerpColor = (
  color1: string,
  color2: string,
  amount: number
): string => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * amount);
  const g = Math.round(g1 + (g2 - g1) * amount);
  const b = Math.round(b1 + (b2 - b1) * amount);
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const getSkyColor = (hours: number, minutes: number): string => {
  const time = hours + minutes / 60;
  const sunrise = {
    start: 5,
    peak: 6,
    end: 7,
  };
  const sunset = {
    start: 19,
    peak: 20,
    end: 21,
  };

  //Night
  if (time <= sunrise.start || time >= sunset.end) {
    return SkyColors.night;
  }

  //Sunrise
  if (time >= sunrise.start && time <= sunrise.end) {
    if (time <= sunrise.peak) {
      //First half of sunrise
      const amount = (time - sunrise.start) / (sunrise.peak - sunrise.start);
      return lerpColor(
        SkyColors.sunrise.start,
        SkyColors.sunrise.middle,
        amount
      );
    } else {
      //Second half of sunrise
      const amount = (time - sunrise.peak) / (sunrise.end - sunrise.peak);
      return lerpColor(SkyColors.sunrise.middle, SkyColors.sunrise.end, amount);
    }
  }

  //Day
  if (time >= sunrise.end && time <= sunset.start) {
    return SkyColors.day;
  }

  //Sunset
  if (time >= sunset.start && time <= sunset.end) {
    if (time <= sunset.peak) {
      const amount = (time - sunset.start) / (sunset.peak - sunset.start);
      return lerpColor(SkyColors.sunset.start, SkyColors.sunset.middle, amount);
    } else {
      const amount = (time - sunset.peak) / (sunset.end - sunset.peak);
      return lerpColor(SkyColors.sunset.middle, SkyColors.sunset.end, amount);
    }
  }

  return SkyColors.night;
};
