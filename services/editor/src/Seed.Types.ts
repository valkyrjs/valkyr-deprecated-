import { format } from "~Services/Prettier";

export const realms = format(`
  type Member = {
    id: string;
    accountId: string;
    name: string;
    avatar?: string;
    color: string;
    archived: boolean;
  };
`);

export const stories = format(`
  type Theme = "light" | "dark";
  type Height = "third" | "half" | "full";

  type Width = "third" | "half" | "full";
  type Size = { width: Width; height: Height };
  type PositionX = "left" | "center" | "right";
  type PositionY = "top" | "center" | "bottom";
  type Position = { x: PositionX; y: PositionY };
  type Alignment = "start" | "center" | "end";
  type Align = { x: Alignment; y: Alignment };

  type SectionSettings = {
    theme: Theme;
    height: Height;
  };

  type LayerSettings = {
    size: Size;
    position: Position;
    align: Align;
  };

  type MediaFormat =
    | "gif"
    | "png"
    | "jpg"
    | "bmp"
    | "ico"
    | "pdf"
    | "tiff"
    | "eps"
    | "jpc"
    | "jp2"
    | "psd"
    | "webp"
    | "zip"
    | "svg"
    | "webm"
    | "wdp"
    | "hpx"
    | "djvu"
    | "ai"
    | "flif"
    | "bpg"
    | "miff"
    | "tga"
    | "heic";

  type MediaData = ImageData | ColorData;

  type MediaType = "image" | "color";

  type ImageData = {
    type: "image";
    publicId: string;
    src: string;
    name?: string;
    alt?: string;
    tags: string[];
    size?: number;
    format: MediaFormat;
    x: number;
    y: number;
    width: number;
    height: number;
    unit: "px" | "%";
  };

  type ColorData = {
    type: "color";
    color?: string;
  };

  type TextData = {
    text: string;
    html: string;
  };

  type StyleData = Record<string, string>;

  type BaseLayer = {
    id: string;
    settings: LayerSettings;
  };

  type TextLayer = BaseLayer & {
    type: "text";
    data: TextData;
  };

  type MediaLayer = BaseLayer & {
    type: "media";
    data: MediaData;
  };

  type StyleLayer = BaseLayer & {
    type: "style";
    data: StyleData;
  };

  type Layer = TextLayer | MediaLayer | StyleLayer;

  type StoryState = "draft" | "published" | "scheduled" | "archived";
  type StoryType = "story" | "template";

  type Section = {
    id: string;
    title?: string;
    layers: Layer[];
    settings: SectionSettings;
  };

  type SectionLayerData = TextData | MediaData | StyleData;
`);
