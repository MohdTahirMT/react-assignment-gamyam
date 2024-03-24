import { Image, Card, Text, Group, ActionIcon } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useHover } from "@mantine/hooks";
import PropTypes from "prop-types";
import verified from "../assets/verified-active.svg";
import favorite from "../assets/favorite.svg";
import share from "../assets/share.svg";
import fire from "../assets/fire.svg";
import classes from "./CarouselCard.module.css";

// Constants for icons
const ICONS = {
  verified,
  favorite,
  share,
  fire,
};

// Function to format text
function formatText(text) {
  return text.includes("_")
    ? text
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : text.charAt(0).toUpperCase() + text.slice(1);
}

// Function to format property price
function formatPropertyPrice({
  price_per_acre,
  price_per_acre_crore,
  total_price,
  total_land_size_in_acres,
}) {
  // Check if acres value is 0
  if (total_land_size_in_acres.acres === 0) {
    let formattedTotalPrice = total_price / 100;
    if (formattedTotalPrice < 1) {
      formattedTotalPrice *= 100;
      if (Number.isInteger(formattedTotalPrice)) {
        return `${formattedTotalPrice.toFixed(0)} lakh for full property`;
      } else {
        return `${formattedTotalPrice.toFixed(2)} lakh for full property`;
      }
    } else {
      if (Number.isInteger(formattedTotalPrice)) {
        return `${formattedTotalPrice.toFixed(0)} crores for full property`;
      } else {
        return `${formattedTotalPrice.toFixed(2)} crores for full property`;
      }
    }
  }

  // Check if crore value is less than 1
  if (price_per_acre_crore.crore < 1) {
    // Convert crore value to lakh
    let lakh = price_per_acre_crore.crore * 100 + price_per_acre_crore.lakh;
    if (Number.isInteger(lakh)) {
      return `${lakh.toFixed(0)} lakh per acre`;
    } else {
      return `${lakh.toFixed(2)} lakh per acre`;
    }
  } else {
    // Convert price_per_acre to crore and lakh
    let crore = Math.floor(price_per_acre / 100);
    let lakh = price_per_acre % 100;
    if (Number.isInteger(lakh)) {
      return `${crore}.${lakh} crore per acre`;
    } else {
      return `${crore}.${lakh} crore per acre`;
    }
  }
}

// Function to format land size
function formatLandSize({ acres, guntas }) {
  let formattedString = "";
  if (acres > 0) formattedString += `${acres} Acres`;
  if (guntas > 0)
    formattedString += formattedString
      ? ` ${guntas} Guntas`
      : `${guntas} Guntas`;
  return formattedString.trim();
}

export function CarouselCard({ data }) {
  const { hovered, ref } = useHover();

  const slides = data?.land_media?.map((item) => (
    <Carousel.Slide key={item?.id} style={{ position: "relative" }}>
      <Image src={item?.image} height={250} fit="cover" />
      {item?.category !== "land" && (
        <Text className={classes.categoryBadge}>
          {formatText(item?.category)}
        </Text>
      )}
    </Carousel.Slide>
  ));

  return (
    <Card
      ref={ref}
      shadow={hovered ? "md" : "sm"}
      radius="md"
      withBorder
      padding="xl"
    >
      {/* Card section of Carousel */}
      <Card.Section>
        <div className={classes.cardSection}>
          {data?.approach_road_type === "highway_road" && (
            <div className={classes.highwayBadge}>
              <Group gap={"xs"}>
                <Image src={ICONS.fire} height={"18px"} />
                <Text style={{ fontSize: "16px", fontWeight: 700 }}>
                  Highway
                </Text>
              </Group>
            </div>
          )}
          <Group className={classes.shareWishBadge} gap={"xs"}>
            {["share", "favorite"].map((icon, index) => (
              <ActionIcon
                key={index}
                variant="default"
                color="rgba(255, 255, 255, 1)"
                size="lg"
                radius="xl"
                aria-label={icon}
              >
                <Image src={ICONS[icon]} height={"18px"} />
              </ActionIcon>
            ))}
          </Group>
        </div>
        <Carousel controlsOffset="md" controlSize={40} draggable={false} loop>
          {slides}
        </Carousel>
      </Card.Section>

      {/* Place Name (Village, Mandal, District) */}
      <Group justify="space-between" align="normal" mt="md">
        <Text style={{ width: "80%", fontSize: "18px", fontWeight: 700 }}>
          {`${data?.village_name ?? null}, ${data?.mandal_name} ${
            data?.district_name
          }(dt)`}
        </Text>
        {data?.is_basic_verified && (
          <Image src={ICONS.verified} height={"18px"} mt={5} />
        )}
      </Group>

      {/* Place Size and Rate */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <Text style={{ fontSize: "15px", fontWeight: 700 }}>
          {formatLandSize(data?.total_land_size_in_acres)}&nbsp;.&nbsp;
        </Text>
        <Text style={{ fontSize: "15px" }}>{formatPropertyPrice(data)}</Text>
      </div>
    </Card>
  );
}

CarouselCard.propTypes = {
  data: PropTypes.shape({
    land_media: PropTypes.array.isRequired,
    approach_road_type: PropTypes.string.isRequired,
    village_name: PropTypes.string.isRequired,
    mandal_name: PropTypes.string.isRequired,
    district_name: PropTypes.string.isRequired,
    is_basic_verified: PropTypes.bool.isRequired,
    total_land_size_in_acres: PropTypes.object.isRequired,
  }).isRequired,
};
